import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

function getStatusColor(status: string) {
  switch (status) {
    case "applied":
      return "bg-gray-200 text-gray-800";
    case "reviewed":
      return "bg-blue-200 text-blue-800";
    case "shortlisted":
      return "bg-purple-200 text-purple-800";
    case "interviewed":
      return "bg-yellow-200 text-yellow-800";
    case "hired":
      return "bg-green-200 text-green-800";
    case "rejected":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-100";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "applied":
      return "Postulado";
    case "reviewed":
      return "Revisado";
    case "shortlisted":
      return "Preseleccionado";
    case "interviewed":
      return "Entrevista";
    case "hired":
      return "Contratado";
    case "rejected":
      return "Rechazado";
    default:
      return status;
  }
}

export default async function MyApplicationsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "talent") {
    redirect("/dashboard");
  }

  const talent = await prisma.talentProfile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!talent) {
    redirect("/profile");
  }

  const applications = await prisma.application.findMany({
    where: {
      talentProfileId: talent.id,
    },
    include: {
      job: {
        include: {
          companyProfile: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Mis Postulaciones
      </h1>

      {applications.length === 0 && (
        <div className="border p-6 rounded">
          Todavía no aplicaste a ninguna vacante.
        </div>
      )}

      <div className="space-y-6">
        {applications.map((app) => (
          <div
            key={app.id}
            className="border p-5 rounded space-y-3"
          >
            <h2 className="text-xl font-bold">
              {app.job.title}
            </h2>

            <p className="text-sm text-gray-600">
              {app.job.companyProfile.companyName}
            </p>

            {app.job.locationText && (
              <p className="text-sm">
                 {app.job.locationText}
              </p>
            )}

            <div>
              <span
                className={`px-3 py-1 text-sm rounded ${getStatusColor(
                  app.status
                )}`}
              >
                {getStatusLabel(app.status)}
              </span>
            </div>

            <p className="text-sm text-gray-500">
              Postulaste el{" "}
              {new Date(app.createdAt).toLocaleDateString()}
            </p>

            {app.job.salaryMin && (
              <p className="text-sm">
                 {app.job.salaryMin?.toString()} - {app.job.salaryMax?.toString()} {app.job.currency}
              </p>
            )}

            <a
              href={`/jobs/${app.job.slug}`}
              className="inline-block mt-2 underline text-sm"
            >
              Ver vacante
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}