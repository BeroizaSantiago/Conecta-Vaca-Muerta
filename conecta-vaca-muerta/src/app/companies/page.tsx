import { prisma } from "@/lib/prisma";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    location?: string;
    rubro?: string;
  }>;
}) {
  const params =
    await searchParams;

  const q =
    params.q?.trim() || "";

  const location =
    params.location?.trim() ||
    "";

  const rubro =
    params.rubro?.trim() ||
    "";

  const rubros =
    await prisma.rubro.findMany(
      {
        orderBy: {
          name: "asc",
        },
      }
    );

  const companies =
    await prisma.companyProfile.findMany(
      {
        where: {
          AND: [
            q
              ? {
                  companyName:
                    {
                      contains:
                        q,
                      mode:
                        "insensitive",
                    },
                }
              : {},

            location
              ? {
                  addressText:
                    {
                      contains:
                        location,
                      mode:
                        "insensitive",
                    },
                }
              : {},

            rubro
              ? {
                  companyRubros:
                    {
                      some: {
                        rubroId:
                          rubro,
                      },
                    },
                }
              : {},
          ],
        },

        include: {
          companyRubros:
            {
              include: {
                rubro: true,
              },
            },
        },

        orderBy: [
          {
            isFeatured:
              "desc",
          },
          {
            companyName:
              "asc",
          },
        ],
      }
    );

  return (
    <main className="max-w-6xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Directorio de
        Empresas
      </h1>

      <form className="grid md:grid-cols-3 gap-3 mb-8">
        <input
          name="q"
          placeholder="Buscar empresa"
          defaultValue={
            q
          }
          className="border p-2"
        />

        <input
          name="location"
          placeholder="Ubicación"
          defaultValue={
            location
          }
          className="border p-2"
        />

        <select
          name="rubro"
          defaultValue={
            rubro
          }
          className="border p-2"
        >
          <option value="">
            Todos los rubros
          </option>

          {rubros.map(
            (
              item
            ) => (
              <option
                key={
                  item.id
                }
                value={
                  item.id
                }
              >
                {
                  item.name
                }
              </option>
            )
          )}
        </select>

        <button className="bg-black text-white p-2 md:col-span-3">
          Buscar
        </button>

        <a
          href="/companies"
          className="border p-2 text-center md:col-span-3"
        >
          Limpiar filtros
        </a>
      </form>

      <p className="mb-6">
        {
          companies.length
        }{" "}
        empresa(s)
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {companies.map(
          (
            company
          ) => (
            <a
              key={
                company.id
              }
              href={`/companies/${company.id}`}
              className="border p-5 rounded block"
            >
              <div className="flex gap-2 mb-2 flex-wrap">
                {company.verificationStatus ===
                  "verified" && (
                  <span className="border px-2 py-1 text-sm">
                    Verificada
                  </span>
                )}

                {company.isFeatured && (
                  <span className="border px-2 py-1 text-sm">
                    Destacada
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold">
                {
                  company.companyName
                }
              </h2>

              <p className="mt-2">
                {company.description ||
                  "Sin descripción"}
              </p>

              <p className="mt-2 text-sm">
                {company.addressText ||
                  "Sin ubicación"}
              </p>

              {company.companyRubros
                .length >
                0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {company.companyRubros.map(
                    (
                      item
                    ) => (
                      <span
                        key={
                          item
                            .rubro
                            .id
                        }
                        className="border px-2 py-1 text-xs rounded"
                      >
                        {
                          item
                            .rubro
                            .name
                        }
                      </span>
                    )
                  )}
                </div>
              )}
            </a>
          )
        )}

        {companies.length ===
          0 && (
          <div className="border p-5 rounded md:col-span-2">
            No se encontraron
            empresas.
          </div>
        )}
      </div>
    </main>
  );
}