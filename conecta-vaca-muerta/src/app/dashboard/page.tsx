import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

/*
  Módulo: Dashboard multirol

  Función:
  Mostrar métricas y accesos según el rol del usuario.
  En empresa: actúa como panel central del ATS.
*/

export default async function DashboardPage() {
  const session =
    await getServerSession(
      authOptions
    );

  if (!session) {
    redirect("/login");
  }

  const role =
    session.user?.role;

  let companyStats =
    null;

  let recentApplications: any[] =
    [];

  if (
    role === "company"
  ) {
    const company =
      await prisma.companyProfile.findUnique(
        {
          where: {
            userId:
              session.user.id,
          },
        }
      );

    if (company) {
      // Métricas principales
      const jobs =
        await prisma.job.count({
          where: {
            companyProfileId:
              company.id,
          },
        });

      const applications =
        await prisma.application.count({
          where: {
            job: {
              companyProfileId:
                company.id,
            },
          },
        });

      const interviewed =
        await prisma.application.count({
          where: {
            status:
              "interviewed",
            job: {
              companyProfileId:
                company.id,
            },
          },
        });

      const hired =
        await prisma.application.count({
          where: {
            status: "hired",
            job: {
              companyProfileId:
                company.id,
            },
          },
        });

      companyStats = {
        jobs,
        applications,
        interviewed,
        hired,
      };

      // Últimos postulantes (para acción rápida)
      recentApplications =
        await prisma.application.findMany(
          {
            where: {
              job: {
                companyProfileId:
                  company.id,
              },
            },
            include: {
              talentProfile: true,
              job: true,
            },
            orderBy: {
              createdAt:
                "desc",
            },
            take: 5,
          }
        );
    }
  }

  return (
    <main className="p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <p className="mb-2">
        Usuario:{" "}
        {
          session.user
            ?.email
        }
      </p>

      <p className="mb-8">
        Rol: {String(role)}
      </p>

      {role === "talent" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Panel Talento
          </h2>

          <a
            href="/jobs"
            className="block border p-3 rounded"
          >
            Ver vacantes
          </a>

          <a
            href="/my-applications"
            className="block border p-3 rounded"
          >
            Mis postulaciones
          </a>

          <a
            href="/profile"
            className="block border p-3 rounded"
          >
            Editar perfil
          </a>
        </div>
      )}

      {role === "company" && (
        <div>
          <h2 className="text-xl font-semibold mb-6">
            Panel Empresa
          </h2>

          {/* MÉTRICAS */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="border rounded p-5">
              <p className="text-sm">
                Vacantes
              </p>
              <p className="text-3xl font-bold">
                {
                  companyStats?.jobs ||
                  0
                }
              </p>
            </div>

            <div className="border rounded p-5">
              <p className="text-sm">
                Postulaciones
              </p>
              <p className="text-3xl font-bold">
                {
                  companyStats?.applications ||
                  0
                }
              </p>
            </div>

            <div className="border rounded p-5">
              <p className="text-sm">
                Entrevistas
              </p>
              <p className="text-3xl font-bold">
                {
                  companyStats?.interviewed ||
                  0
                }
              </p>
            </div>

            <div className="border rounded p-5">
              <p className="text-sm">
                Contratados
              </p>
              <p className="text-3xl font-bold">
                {
                  companyStats?.hired ||
                  0
                }
              </p>
            </div>
          </div>

          {/* ACCESOS */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <a
              href="/jobs/create"
              className="border p-4 rounded"
            >
              Publicar Vacante
            </a>

            <a
              href="/company/applications"
              className="border p-4 rounded"
            >
              Ver Postulantes
            </a>

            <a
              href="/profile"
              className="border p-4 rounded"
            >
              Editar Perfil
            </a>
          </div>

          {/* ÚLTIMOS POSTULANTES */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Últimos postulantes
            </h3>

            <div className="space-y-3">
              {recentApplications.map(
                (app) => (
                  <div
                    key={app.id}
                    className="border p-3 rounded"
                  >
                    <p className="font-semibold">
                      {
                        app
                          .talentProfile
                          .fullName
                      }
                    </p>

                    <p className="text-sm">
                      {app.job.title}
                    </p>

                    <p className="text-xs text-gray-500">
                      {new Date(
                        app.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )
              )}

              {recentApplications.length ===
                0 && (
                <p className="text-sm">
                  No hay postulaciones aún.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {role === "admin" && (
        <div>
          <h2 className="text-xl font-semibold">
            Panel Admin
          </h2>

          <p>
            Administración general.
          </p>
        </div>
      )}
    </main>
  );
}