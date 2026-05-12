import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

/*
  Módulo: Detalle de oportunidad (lado marketplace)

  Función:
  - Ver detalle completo
  - Enviar propuesta
*/

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  if (session.user?.role !== "company") {
    redirect("/dashboard");
  }

  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      requesterCompanyProfile: true,
    },
  });

  if (!opportunity) {
    redirect("/opportunities");
  }

  return (
    <main className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-4">
        {opportunity.title}
      </h1>

      <p className="mb-4">
        {opportunity.description}
      </p>

      <p className="text-sm mb-6">
        Empresa:{" "}
        {
          opportunity
            .requesterCompanyProfile
            .companyName
        }
      </p>

      {/* FORM RESPUESTA */}
      {/* 
  Formulario de respuesta comercial B2B.
  Permite enviar propuesta económica completa.
*/}

      <form
        action="/api/opportunities/respond"
        method="POST"
        className="space-y-4 border p-5 rounded mt-8"
      >
        <input
          type="hidden"
          name="opportunityId"
          value={opportunity.id}
        />

        <div>
          <label className="block mb-1 font-medium">
            Mensaje
          </label>

          <textarea
            name="message"
            required
            className="border p-2 w-full h-32"
            placeholder="Describe tu propuesta..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">
              Presupuesto estimado
            </label>

            <input
              type="number"
              step="0.01"
              name="proposedPrice"
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Moneda
            </label>

            <select
              name="currency"
              className="border p-2 w-full"
              defaultValue="ARS"
            >
              <option value="ARS">
                ARS
              </option>

              <option value="USD">
                USD
              </option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Condiciones de pago
          </label>

          <textarea
            name="paymentTerms"
            className="border p-2 w-full h-24"
            placeholder="Ej: 50% anticipo y saldo contra entrega"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Tipo de pago
          </label>

          <input
            name="paymentType"
            className="border p-2 w-full"
            placeholder="Transferencia, cheque, contado..."
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Tiempo estimado
          </label>

          <input
            name="estimatedTime"
            className="border p-2 w-full"
            placeholder="Ej: 15 días"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Notas adicionales
          </label>

          <textarea
            name="additionalNotes"
            className="border p-2 w-full h-24"
          />
        </div>

        <button className="bg-black text-white px-4 py-2">
          Enviar propuesta
        </button>
      </form>
    </main>
  );
}