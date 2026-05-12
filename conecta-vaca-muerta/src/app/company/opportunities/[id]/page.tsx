import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

/*
  Módulo: CompanyOpportunityPage

  Función:
  Vista de detalle de una oportunidad.

  Permite:
  - Ver propuestas de otras empresas
  - Aceptar / rechazar respuestas
  - Ver contexto completo de la oportunidad

  Este es el núcleo del flujo B2B (negociación entre empresas).
*/

export default async function CompanyOpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session =
    await getServerSession(authOptions);

  if (!session) redirect("/login");

  if (session.user?.role !== "company") {
    redirect("/dashboard");
  }

  const company =
    await prisma.companyProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

  if (!company) redirect("/profile");

  const opportunity =
    await prisma.opportunity.findUnique({
      where: { id },
      include: {
        responses: {
          include: {
            responderCompanyProfile: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

  // Seguridad: evitar ver oportunidades de otras empresas
  if (
    !opportunity ||
    opportunity.requesterCompanyProfileId !==
    company.id
  ) {
    redirect("/company/opportunities");
  }

  return (
    <main className="max-w-5xl mx-auto p-10">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {opportunity.title}
        </h1>

        <p className="mt-2 text-gray-600">
          {opportunity.description}
        </p>

        {/* Estado visual */}
        <p className="mt-3">
          Estado:{" "}
          <span
            className={`px-2 py-1 text-white text-xs rounded ${opportunity.status === "open"
                ? "bg-green-600"
                : opportunity.status ===
                  "in_progress"
                  ? "bg-yellow-600"
                  : "bg-gray-600"
              }`}
          >
            {opportunity.status}
          </span>
        </p>

        {opportunity.locationText && (
          <p className="text-sm mt-2">
            {opportunity.locationText}
          </p>
        )}
      </div>

      {/* LISTADO DE RESPUESTAS */}
      <h2 className="text-xl font-semibold mb-4">
        Propuestas recibidas
      </h2>

      <div className="space-y-5">
        {opportunity.responses.map(
          (item) => (
            <div
              key={item.id}
              className="border p-5 rounded space-y-3"
            >
              {/* Empresa que responde */}
              <div>
                <p className="text-xl font-bold">
                  {
                    item
                      .responderCompanyProfile
                      .companyName
                  }
                </p>

                <p className="text-sm">
                  Estado: {item.status}
                </p>
              </div>

              {/* Propuesta económica */}
              <div className="border rounded p-4">
                <p className="font-semibold mb-2">
                  Propuesta económica
                </p>

                <p>
                  Presupuesto:
                  {" "}
                  {item.proposedPrice
                    ? `${item.currency} ${item.proposedPrice.toString()}`
                    : "No especificado"}
                </p>

                {item.paymentType && (
                  <p>
                    Tipo de pago:
                    {" "}
                    {item.paymentType}
                  </p>
                )}

                {item.paymentTerms && (
                  <p>
                    Condiciones:
                    {" "}
                    {item.paymentTerms}
                  </p>
                )}

                {item.estimatedTime && (
                  <p>
                    Tiempo estimado:
                    {" "}
                    {item.estimatedTime}
                  </p>
                )}
              </div>

              {/* Mensaje */}
              <div>
                <p className="font-semibold mb-1">
                  Propuesta
                </p>

                <p>{item.message}</p>
              </div>

              {/* Notas adicionales */}
              {item.additionalNotes && (
                <div>
                  <p className="font-semibold mb-1">
                    Notas adicionales
                  </p>

                  <p>
                    {item.additionalNotes}
                  </p>
                </div>
              )}

              {/* Acciones */}
              {item.status ===
                "pending" && (
                  <div className="flex gap-2 pt-3">
                    <form
                      action="/api/opportunities/response-status"
                      method="POST"
                    >
                      <input
                        type="hidden"
                        name="responseId"
                        value={item.id}
                      />

                      <input
                        type="hidden"
                        name="status"
                        value="accepted"
                      />

                      <button className="bg-black text-white px-3 py-2">
                        Aceptar
                      </button>
                    </form>

                    <form
                      action="/api/opportunities/response-status"
                      method="POST"
                    >
                      <input
                        type="hidden"
                        name="responseId"
                        value={item.id}
                      />

                      <input
                        type="hidden"
                        name="status"
                        value="rejected"
                      />

                      <button className="border px-3 py-2">
                        Rechazar
                      </button>
                    </form>
                  </div>
                )}
            </div>
          )
        )}

        {opportunity.responses
          .length === 0 && (
            <div className="border p-5 rounded">
              No hay propuestas aún.
            </div>
          )}
      </div>
    </main>
  );
}