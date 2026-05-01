import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
      const jobs =
        await prisma.job.count(
          {
            where: {
              companyProfileId:
                company.id,
            },
          }
        );

      const applications =
        await prisma.application.count(
          {
            where: {
              job: {
                companyProfileId:
                  company.id,
              },
            },
          }
        );

      const interviewed =
        await prisma.application.count(
          {
            where: {
              status:
                "interviewed",
              job: {
                companyProfileId:
                  company.id,
              },
            },
          }
        );

      companyStats = {
        jobs,
        applications,
        interviewed,
      };
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
        <div>
          <h2 className="text-xl font-semibold">
            Panel Talento
          </h2>

          <p>
            Buscar empleos y completar perfil.
          </p>
        </div>
      )}

      {role === "company" && (
        <div>
          <h2 className="text-xl font-semibold mb-6">
            Panel Empresa
          </h2>

          <div className="grid grid-cols-3 gap-4 mb-8">
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
                {companyStats?.applications ||
                  0}
              </p>
            </div>

            <div className="border rounded p-5">
              <p className="text-sm">
                Entrevistas
              </p>
              <p className="text-3xl font-bold">
                {companyStats?.interviewed ||
                  0}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href="/jobs/create"
              className="block border p-3 rounded"
            >
              Publicar Vacante
            </a>

            <a
              href="/company/applications"
              className="block border p-3 rounded"
            >
              Ver Postulantes
            </a>

            <a
              href="/profile"
              className="block border p-3 rounded"
            >
              Editar Perfil Empresa
            </a>
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