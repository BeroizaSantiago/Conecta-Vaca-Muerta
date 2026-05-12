import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";

/*
  API: responder oportunidad B2B

  Función:
  - Permite enviar propuestas comerciales
  - Marketplace empresa ↔ empresa
  - Incluye presupuesto y condiciones
*/

export async function POST(req: Request) {
  const session =
    await getServerSession(authOptions);

  // Validar sesión
  if (
    !session ||
    session.user?.role !== "company"
  ) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  const formData =
    await req.formData();

  // Datos principales
  const opportunityId = String(
    formData.get("opportunityId")
  );

  const message = String(
    formData.get("message") || ""
  );

  // Presupuesto
  const proposedPriceRaw = String(
    formData.get("proposedPrice") || ""
  );

  const currency = String(
    formData.get("currency") || "ARS"
  );

  // Nuevos campos comerciales
  const paymentTerms = String(
    formData.get("paymentTerms") || ""
  );

  const paymentType = String(
    formData.get("paymentType") || ""
  );

  const estimatedTime = String(
    formData.get("estimatedTime") || ""
  );

  const additionalNotes = String(
    formData.get("additionalNotes") || ""
  );

  // Buscar empresa actual
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

  // Buscar oportunidad
  const opportunity =
    await prisma.opportunity.findUnique({
      where: {
        id: opportunityId,
      },
    });

  if (!opportunity) {
    return NextResponse.redirect(
      new URL("/opportunities", req.url)
    );
  }

  // Evitar responder propia publicación
  if (
    opportunity.requesterCompanyProfileId ===
    company.id
  ) {
    return NextResponse.redirect(
      new URL("/opportunities", req.url)
    );
  }

  // Solo responder abiertas
  if (opportunity.status !== "open") {
    return NextResponse.redirect(
      new URL("/opportunities", req.url)
    );
  }

  // Evitar duplicados
  const existing =
    await prisma.opportunityResponse.findFirst({
      where: {
        opportunityId,
        responderCompanyProfileId:
          company.id,
      },
    });

  if (existing) {
    return NextResponse.redirect(
      new URL("/opportunities", req.url)
    );
  }

  /*
    Crear propuesta comercial.
    Acá ya guardamos información más cercana
    a una cotización/propuesta real.
  */

  await prisma.opportunityResponse.create({
    data: {
      opportunityId,

      responderCompanyProfileId:
        company.id,

      message,

      proposedPrice:
        proposedPriceRaw
          ? Number(proposedPriceRaw)
          : null,

      currency,

      paymentTerms,

      paymentType,

      estimatedTime,

      additionalNotes,

      status: "pending",
    },
  });

  return NextResponse.redirect(
    new URL("/opportunities", req.url)
  );
}