import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

/*
  Marketplace B2B

  Función:
  - Mostrar oportunidades abiertas
  - Priorizar matching por rubros
  - Base para recomendaciones inteligentes
*/

export default async function OpportunitiesPage() {
  const session =
    await getServerSession(authOptions);

  /*
    Obtener empresa actual.
  */
  let company = null;

  if (
    session?.user?.role ===
    "company"
  ) {
    company =
      await prisma.companyProfile.findUnique({
        where: {
          userId:
            session.user.id,
        },

        include: {
          companyRubros: true,
        },
      });
  }

  /*
    IDs de rubros de la empresa actual.
  */
  const companyRubroIds =
    company?.companyRubros.map(
      (item) => item.rubroId
    ) || [];

  /*
    Traer oportunidades con rubros.
  */
  const opportunities =
    await prisma.opportunity.findMany({
      where: {
        status: "open",
      },

      include: {
        requesterCompanyProfile:
          true,

        opportunityRubros: {
          include: {
            rubro: true,
          },
        },

        _count: {
          select: {
            responses: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  /*
    Matching simple por rubros.
    Las coincidencias se muestran primero.
  */
  const sortedOpportunities =
    opportunities.sort((a, b) => {
      const aMatch =
        a.opportunityRubros.some(
          (item) =>
            companyRubroIds.includes(
              item.rubroId
            )
        );

      const bMatch =
        b.opportunityRubros.some(
          (item) =>
            companyRubroIds.includes(
              item.rubroId
            )
        );

      if (aMatch && !bMatch)
        return -1;

      if (!aMatch && bMatch)
        return 1;

      return 0;
    });

  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Oportunidades disponibles
      </h1>

      <div className="space-y-4">
        {sortedOpportunities.map(
          (item) => {
            /*
              Detectar si coincide
              con rubros de empresa.
            */
            const matchesRubros =
              item.opportunityRubros.some(
                (rubro) =>
                  companyRubroIds.includes(
                    rubro.rubroId
                  )
              );

            return (
              <a
                key={item.id}
                href={`/opportunities/${item.id}`}
                className="border p-5 rounded block"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">
                      {item.title}
                    </h2>

                    <p>
                      {
                        item
                          .requesterCompanyProfile
                          .companyName
                      }
                    </p>
                  </div>

                  {/* 
                    Badge de matching
                  */}
                  {matchesRubros && (
                    <div className="border px-3 py-1 text-sm rounded">
                      Coincide con tus rubros
                    </div>
                  )}
                </div>

                <p className="text-sm mt-2">
                  {item.locationText}
                </p>

                {/* Rubros */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.opportunityRubros.map(
                    (rel) => (
                      <span
                        key={
                          rel.rubro.id
                        }
                        className="border px-2 py-1 rounded text-sm"
                      >
                        {
                          rel.rubro.name
                        }
                      </span>
                    )
                  )}
                </div>

                <p className="text-sm mt-4">
                  Respuestas:{" "}
                  {
                    item._count
                      .responses
                  }
                </p>
              </a>
            );
          }
        )}

        {sortedOpportunities.length ===
          0 && (
          <p>
            No hay oportunidades disponibles.
          </p>
        )}
      </div>
    </main>
  );
}