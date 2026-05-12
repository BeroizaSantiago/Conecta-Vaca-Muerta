import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    location?: string;
    type?: string;
  }>;
}) {
  const session =
    await getServerSession(
      authOptions
    );

  const params =
    await searchParams;

  const q =
    params.q?.trim() || "";

  const location =
    params.location?.trim() ||
    "";

  const type =
    params.type?.trim() || "";

  // Consulta principal de vacantes con filtros
  const jobs =
    await prisma.job.findMany({
      where: {
        status: "open",

        ...(q && {
          title: {
            contains: q,
            mode:
              "insensitive",
          },
        }),

        ...(location && {
          locationText: {
            contains:
              location,
            mode:
              "insensitive",
          },
        }),

        ...(type && {
          jobType: {
            contains:
              type,
            mode:
              "insensitive",
          },
        }),
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        companyProfile: true,
        jobSkills: {
          include: {
            skill: true,
          },
        },
      },
    });

  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Vacantes Disponibles
      </h1>

      {/* Filtros de búsqueda */}
      <form className="grid grid-cols-3 gap-3 mb-8">
        <input
          name="q"
          placeholder="Buscar cargo"
          defaultValue={q}
          className="border p-2"
        />

        <input
          name="location"
          placeholder="Ubicación"
          defaultValue={location}
          className="border p-2"
        />

        <input
          name="type"
          placeholder="Tipo"
          defaultValue={type}
          className="border p-2"
        />

        <button className="bg-black text-white px-4 py-2 col-span-3">
          Buscar
        </button>

        <a
          href="/jobs"
          className="text-center border p-2 col-span-3"
        >
          Limpiar filtros
        </a>
      </form>

      <p className="mb-6">
        {jobs.length} vacante(s) encontrada(s)
      </p>

      <div className="space-y-6">
        {jobs.length === 0 && (
          <div className="border p-6 rounded">
            No se encontraron vacantes.
          </div>
        )}

        {jobs.map((job) => (
          <div
            key={job.id}
            className="border p-5 rounded space-y-2"
          >
            {/* Título clickeable → lleva al detalle */}
            <a
              href={`/jobs/${job.slug}`}
              className="text-xl font-bold underline"
            >
              {job.title}
            </a>

            <p>
              {job.companyProfile.companyName}
            </p>

            <p>{job.locationText}</p>

            <p>{job.jobType}</p>

            {/* Skills resumidas */}
            {job.jobSkills.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                  {job.jobSkills.map(
                    (item) => (
                      <span
                        key={item.skill.id}
                        className="border px-2 py-1 rounded text-sm"
                      >
                        {item.skill.name}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {/* CTA principal ahora es ver detalle */}
            <a
              href={`/jobs/${job.slug}`}
              className="inline-block mt-3 border px-4 py-2"
            >
              Ver detalle
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}