import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";

/*
  API: actualizar estado de respuesta

  Función:
  - Aceptar o rechazar propuestas
  - Si se acepta:
      → cierra la oportunidad
      → rechaza todas las demás propuestas
*/

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    session.user?.role !== "company"
  ) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  const formData = await req.formData();

  const responseId = String(
    formData.get("responseId")
  );

  const status = String(
    formData.get("status")
  ) as "accepted" | "rejected";

  // Buscar empresa logueada
  const company =
    await prisma.companyProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

  if (!company) {
    return NextResponse.redirect(
      new URL("/profile", req.url)
    );
  }

  // Buscar la respuesta
  const response =
    await prisma.opportunityResponse.findUnique({
      where: { id: responseId },
      include: {
        opportunity: true,
      },
    });

  if (!response) {
    return NextResponse.redirect(
      new URL("/company/opportunities", req.url)
    );
  }

  // Seguridad: verificar que la oportunidad es de la empresa
  if (
    response.opportunity
      .requesterCompanyProfileId !==
    company.id
  ) {
    return NextResponse.redirect(
      new URL("/company/opportunities", req.url)
    );
  }

  // ----------- CASO ACEPTAR -----------

  if (status === "accepted") {
    // Usamos transacción para mantener consistencia
    await prisma.$transaction([
      // 1. Marcar esta como aceptada
      prisma.opportunityResponse.update({
        where: { id: responseId },
        data: { status: "accepted" },
      }),

      // 2. Rechazar todas las demás
      prisma.opportunityResponse.updateMany({
        where: {
          opportunityId:
            response.opportunityId,
          NOT: {
            id: responseId,
          },
        },
        data: {
          status: "rejected",
        },
      }),

      // 3. Cerrar oportunidad
      prisma.opportunity.update({
        where: {
          id: response.opportunityId,
        },
        data: {
          status: "closed",
        },
      }),
    ]);
  }

  // ----------- CASO RECHAZAR -----------

  if (status === "rejected") {
    await prisma.opportunityResponse.update({
      where: { id: responseId },
      data: { status: "rejected" },
    });
  }

  return NextResponse.redirect(
    new URL(
      `/company/opportunities/${response.opportunityId}`,
      req.url
    )
  );
}