import { prisma } from "@/lib/prisma";

export default async function OpportunitiesPage() {
  const opportunities =
    await prisma.opportunity.findMany({
      where: {
        status: "open",
      },
      include: {
        requesterCompanyProfile: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <main className="max-w-6xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Oportunidades B2B
      </h1>

      <div className="space-y-4">
        {opportunities.map((item) => (
          <div
            key={item.id}
            className="border p-5 rounded"
          >
            <h2 className="text-xl font-bold">
              {item.title}
            </h2>

            <p className="mt-2">
              {item.description}
            </p>

            <p className="mt-2">
              Tipo: {item.type}
            </p>

            <p>
              Empresa:{" "}
              {
                item
                  .requesterCompanyProfile
                  .companyName
              }
            </p>

            <p>
              Ubicación:{" "}
              {item.locationText}
            </p>

            <a
              href={`/opportunities/${item.id}`}
              className="inline-block mt-4 bg-black text-white px-4 py-2"
            >
              Responder
            </a>
          </div>
        ))}

        {opportunities.length === 0 && (
          <p>
            No hay oportunidades
            activas.
          </p>
        )}
      </div>
    </main>
  );
}