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
              className="border p-5 rounded space-y-3"
            >
              <input
                type="hidden"
                name="applicationId"
                value={
                  app.id
                }
              />

              <p className="text-xl font-bold">
                {
                  app
                    .talentProfile
                    .fullName
                }
              </p>

              <p>
                {
                  app
                    .talentProfile
                    .profession
                }
              </p>

              <p>
                Vacante:{" "}
                {
                  app.job
                    .title
                }
              </p>

              {app
                .talentProfile
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