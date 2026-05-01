import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export default async function JobApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  if (session.user?.role !== "company") {
    redirect("/dashboard");
  }

  const company = await prisma.companyProfile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!company) redirect("/profile");

  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: {
      id,
    },
  });

  if (!job || job.companyProfileId !== company.id) {
    redirect("/company/jobs");
  }

  const applications = await prisma.application.findMany({
    where: {
      jobId: job.id,
    },
    include: {
      talentProfile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Postulantes - {job.title}
      </h1>

      <div className="space-y-4">
        {applications.map((app) => (
          <form
            key={app.id}
            action="/api/company/application-status"
            method="POST"
            className="border p-4 rounded space-y-2"
          >
            <input
              type="hidden"
              name="applicationId"
              value={app.id}
            />

            <p className="font-bold">
              {app.talentProfile.fullName}
            </p>

            <select
              name="status"
              defaultValue={app.status}
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

            <p>
              {new Date(
                app.createdAt
              ).toLocaleDateString()}
            </p>
          </form>
        ))}

        {applications.length === 0 && (
          <p>No hay postulantes aún.</p>
        )}
      </div>
    </main>
  );
}