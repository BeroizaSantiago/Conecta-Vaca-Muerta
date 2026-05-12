import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export default async function CompanyApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    job?: string;
  }>;
}) {
  const params = await searchParams;

  const selectedStatus =
    params.status || "";

  const selectedJob =
    params.job || "";

  const session =
    await getServerSession(
      authOptions
    );

  if (!session) {
    redirect("/login");
  }

  if (
    session.user?.role !==
    "company"
  ) {
    redirect("/dashboard");
  }

  const company =
    await prisma.companyProfile.findUnique(
      {
        where: {
          userId:
            session.user.id,
        },
      }
    );

  if (!company) {
    redirect("/profile");
  }

  const jobsList =
    await prisma.job.findMany({
      where: {
        companyProfileId:
          company.id,
      },
      orderBy: {
        title: "asc",
      },
    });

  const applications =
    await prisma.application.findMany(
      {
        where: {
          job: {
            companyProfileId:
              company.id,

            ...(selectedJob
              ? {
                  id: selectedJob,
                }
              : {}),
          },

          ...(selectedStatus
            ? {
                status:
                  selectedStatus as any,
              }
            : {}),
        },

        include: {
          job: true,

          // Traemos todo lo necesario para perfil completo
          talentProfile: {
            include: {
              talentSkills: {
                include: {
                  skill: true,
                },
              },
            },
          },
        },

        orderBy: {
          createdAt:
            "desc",
        },
      }
    );

  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Postulantes Recibidos
      </h1>

      {/* Filtros */}
      <form
        method="GET"
        className="flex gap-3 mb-8"
      >
        <select
          name="status"
          defaultValue={
            selectedStatus
          }
          className="border p-2"
        >
          <option value="">
            Todos los estados
          </option>

          <option value="applied">
            applied
          </option>
          <option value="reviewed">
            reviewed
          </option>
          <option value="shortlisted">
            shortlisted
          </option>
          <option value="interviewed">
            interviewed
          </option>
          <option value="hired">
            hired
          </option>
          <option value="rejected">
            rejected
          </option>
        </select>

        <select
          name="job"
          defaultValue={
            selectedJob
          }
          className="border p-2"
        >
          <option value="">
            Todas las vacantes
          </option>

          {jobsList.map(
            (job) => (
              <option
                key={job.id}
                value={
                  job.id
                }
              >
                {job.title}
              </option>
            )
          )}
        </select>

        <button className="bg-black text-white px-4">
          Filtrar
        </button>
      </form>

      <div className="space-y-6">
        {applications.map(
          (app) => (
            <form
              key={app.id}
              action="/api/company/application-status"
              method="POST"
              className="border p-5 rounded space-y-4"
            >
              <input
                type="hidden"
                name="applicationId"
                value={
                  app.id
                }
              />

              {/* INFO PRINCIPAL */}
              <div>
                <p className="text-xl font-bold">
                  {
                    app
                      .talentProfile
                      .fullName
                  }
                </p>

                <p className="text-sm text-gray-600">
                  {
                    app
                      .talentProfile
                      .profession
                  }
                </p>
              </div>

              {/* INFO ADICIONAL */}
              <div className="text-sm space-y-1">
                {app.talentProfile
                  .experienceYears && (
                  <p>
                    Experiencia:{" "}
                    {
                      app
                        .talentProfile
                        .experienceYears
                    }{" "}
                    años
                  </p>
                )}

                {app.talentProfile
                  .currentLocationText && (
                  <p>
                    Ubicación:{" "}
                    {
                      app
                        .talentProfile
                        .currentLocationText
                    }
                  </p>
                )}

                {app.talentProfile
                  .linkedinUrl && (
                  <a
                    href={
                      app
                        .talentProfile
                        .linkedinUrl
                    }
                    target="_blank"
                    className="underline block"
                  >
                    LinkedIn
                  </a>
                )}
              </div>

              {/* BIO */}
              {app.talentProfile.bio && (
                <p className="text-sm">
                  {
                    app
                      .talentProfile
                      .bio
                  }
                </p>
              )}

              {/* SKILLS */}
              {app.talentProfile
                .talentSkills.length >
                0 && (
                <div>
                  <p className="text-sm font-semibold">
                    Skills
                  </p>

                  <div className="flex flex-wrap gap-2 mt-1">
                    {app.talentProfile.talentSkills.map(
                      (ts) => (
                        <span
                          key={`${ts.talentProfileId}-${ts.skillId}`}
                          className="border px-2 py-1 text-xs rounded"
                        >
                          {
                            ts.skill.name
                          }
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* VACANTE */}
              <p className="text-sm">
                Vacante:{" "}
                {app.job.title}
              </p>

              {/* CV */}
              {app.talentProfile
                .cvFileUrl && (
                <a
                  href={
                    app
                      .talentProfile
                      .cvFileUrl
                  }
                  target="_blank"
                  className="underline block"
                >
                  Ver CV
                </a>
              )}

              {/* FECHA */}
              <p className="text-xs text-gray-500">
                Postuló el{" "}
                {new Date(
                  app.createdAt
                ).toLocaleDateString()}
              </p>

              {/* ESTADO */}
              <div className="flex items-center gap-3">
                <select
                  name="status"
                  defaultValue={
                    app.status
                  }
                  className="border p-2"
                >
                  <option value="applied">
                    applied
                  </option>
                  <option value="reviewed">
                    reviewed
                  </option>
                  <option value="shortlisted">
                    shortlisted
                  </option>
                  <option value="interviewed">
                    interviewed
                  </option>
                  <option value="hired">
                    hired
                  </option>
                  <option value="rejected">
                    rejected
                  </option>
                  <option value="withdrawn">
                    withdrawn
                  </option>
                </select>

                <button className="bg-black text-white px-4 py-2">
                  Guardar
                </button>
              </div>
            </form>
          )
        )}

        {applications.length ===
          0 && (
          <div className="border p-5 rounded">
            No hay postulantes con esos filtros.
          </div>
        )}
      </div>
    </main>
  );
}