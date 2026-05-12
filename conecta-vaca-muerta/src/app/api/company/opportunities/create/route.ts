import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";

/*
  API: crear oportunidad B2B

  Función:
  - Publicar oportunidades empresa ↔ empresa
  - Marketplace industrial
  - Preparado para matching y notificaciones
*/

export async function POST(
  req: Request
) {
  const session =
    await getServerSession(authOptions);

  // Validar sesión
  if (!session) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  // Solo empresas
  if (
    session.user?.role !== "company"
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", req.url)
    );
  }

  const formData =
    await req.formData();

  // Datos básicos
  const title = String(
    formData.get("title") || ""
  );

  const description = String(
    formData.get("description") || ""
  );

  const type = String(
    formData.get("type") || "need"
  );

  const locationText = String(
    formData.get("locationText") || ""
  );

  // Categoría/rubro
  const categoryText = String(
    formData.get("categoryText") || ""
  );

  const rubros =
    formData.getAll("rubros");

  // Presupuesto
  const budgetMinRaw = String(
    formData.get("budgetMin") || ""
  );

  const budgetMaxRaw = String(
    formData.get("budgetMax") || ""
  );

  const currency = String(
    formData.get("currency") || "ARS"
  );

  // Fecha límite
  const deadlineAtRaw = String(
    formData.get("deadlineAt") || ""
  );

  // Urgencia
  const isUrgent =
    formData.get("isUrgent") === "on";

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

  /*
    Crear oportunidad.
  */

  await prisma.opportunity.create({
    data: {
      requesterCompanyProfileId:
        company.id,

      title,

      description,

      type:
        type === "offer"
          ? "offer"
          : "need",

      categoryText,

      locationText,

      budgetMin:
        budgetMinRaw
          ? Number(budgetMinRaw)
          : null,

      budgetMax:
        budgetMaxRaw
          ? Number(budgetMaxRaw)
          : null,

      currency,

      deadlineAt:
        deadlineAtRaw
          ? new Date(
            deadlineAtRaw
          )
          : null,

      isUrgent,

      status: "open",

      /*
        Relación many-to-many:
        oportunidad ↔ rubros
      */
      opportunityRubros: {
        create: rubros.map(
          (rubroId) => ({
            rubroId:
              String(rubroId),
          })
        ),
      },
    },
  });


  return NextResponse.redirect(
    new URL(
      "/company/opportunities",
      req.url
    )
  );
}