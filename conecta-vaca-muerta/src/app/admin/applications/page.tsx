import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

/*
  Módulo: Admin Applications

  Función:
  - Supervisión global de postulaciones (ATS)
  - Permite al admin ver todo el flujo del sistema
  - Incluye filtros por estado
*/

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
  }>;
}) {
  const params = await searchParams;

  const selectedStatus =
    params.status || "";

  const session =
    await getServerSession(
      authOptions
    );

  if (!session) redirect("/login");

  if (session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const applications =
    await prisma.application.findMany({
      where: {
        ...(selectedStatus
          ? {
              status:
                selectedStatus as any,
            }
          : {}),
      },

      include: {
        job: {
          include: {
            companyProfile: true,
          },
        },
        talentProfile: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <main className="max-w-6xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Supervisión de Postulaciones
      </h1>

      {/* FILTRO */}
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

          <option value="withdrawn">
            withdrawn
          </option>
        </select>

        <button className="bg-black text-white px-4">
          Filtrar
        </button>
      </form>

      {/* LISTADO */}
      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="border p-5 rounded"
          >
            {/* TALENTO */}
            <p className="font-bold text-lg">
              {app.talentProfile.fullName}
            </p>

            <p>
              {
                app.talentProfile
                  .profession
              }
            </p>

            {/* JOB */}
            <p className="mt-2">
              Vacante:{" "}
              {app.job.title}
            </p>

            <p>
              Empresa:{" "}
              {
                app.job
                  .companyProfile
                  .companyName
              }
            </p>

            {/* ESTADO */}
            <p className="mt-2">
              Estado:{" "}
              <span className="font-semibold">
                {app.status}
              </span>
            </p>

            {/* FECHA */}
            <p className="text-sm mt-2">
              {new Date(
                app.createdAt
              ).toLocaleDateString()}
            </p>
          </div>
        ))}

        {applications.length === 0 && (
          <div className="border p-5 rounded">
            No hay postulaciones.
          </div>
        )}
      </div>
    </main>
  );
}