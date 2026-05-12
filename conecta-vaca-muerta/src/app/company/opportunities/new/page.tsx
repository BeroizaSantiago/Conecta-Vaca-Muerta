import { prisma } from "@/lib/prisma";

/*
  Módulo:
  Publicación de oportunidades B2B

  Función:
  - Crear oportunidades de marketplace
  - Asociar oportunidad a rubro real
  - Base para matching entre empresas
*/

export default async function NewOpportunityPage() {
  // Traemos rubros para selector
  const rubros =
    await prisma.rubro.findMany({
      orderBy: {
        name: "asc",
      },
    });

  return (
    <main className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Nueva Oportunidad
      </h1>

      <form
        action="/api/company/opportunities/create"
        method="POST"
        className="space-y-5"
      >
        {/* Tipo */}
        <div>
          <label className="block mb-1 font-medium">
            Tipo
          </label>

          <select
            name="type"
            className="border p-2 w-full"
          >
            <option value="need">
              Necesito un servicio
            </option>

            <option value="offer">
              Ofrezco un servicio
            </option>
          </select>
        </div>

        {/* Título */}
        <div>
          <label className="block mb-1 font-medium">
            Título
          </label>

          <input
            name="title"
            required
            placeholder="Ej: Transporte de personal"
            className="border p-2 w-full"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block mb-1 font-medium">
            Descripción
          </label>

          <textarea
            name="description"
            required
            className="border p-2 w-full h-40"
            placeholder="Describe el servicio requerido..."
          />
        </div>

        {/* Rubros múltiples */}
        <div>
          <label className="block mb-2 font-medium">
            Rubros relacionados
          </label>
          <div className="grid md:grid-cols-2 gap-2 border p-4 rounded">
            {rubros.map((rubro) => (
              <label
                key={rubro.id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  name="rubros"
                  value={rubro.id}
                />

                {rubro.name}
              </label>
            ))}
          </div>
        </div>

        {/* Categoría libre opcional */}
        <div>
          <label className="block mb-1 font-medium">
            Categoría libre
          </label>

          <input
            name="categoryText"
            placeholder="Texto opcional"
            className="border p-2 w-full"
          />
        </div>

        {/* Ubicación */}
        <div>
          <label className="block mb-1 font-medium">
            Ubicación
          </label>

          <input
            name="locationText"
            placeholder="Neuquén, Añelo..."
            className="border p-2 w-full"
          />
        </div>

        {/* Presupuesto */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">
              Presupuesto mínimo
            </label>

            <input
              type="number"
              step="0.01"
              name="budgetMin"
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Presupuesto máximo
            </label>

            <input
              type="number"
              step="0.01"
              name="budgetMax"
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

        {/* Fecha límite */}
        <div>
          <label className="block mb-1 font-medium">
            Fecha límite
          </label>

          <input
            type="date"
            name="deadlineAt"
            className="border p-2 w-full"
          />
        </div>

        {/* Urgente */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isUrgent"
          />

          Marcar como urgente
        </label>

        <button className="bg-black text-white px-4 py-2">
          Publicar oportunidad
        </button>
      </form>
    </main>
  );
}