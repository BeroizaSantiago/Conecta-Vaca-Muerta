import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export default async function CompanyJobsPage() {
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

  const jobs = await prisma.job.findMany({
    where: {
      companyProfileId: company.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Mis Vacantes
      </h1>

      <div className="space-y-4">
        {jobs.map((job) => (
          <form
            key={job.id}
            action="/api/company/job-status"
            method="POST"
            className="border p-4 rounded space-y-2"
          >
            <input
              type="hidden"
              name="jobId"
              value={job.id}
            />

            <p className="font-bold">
              {job.title}
            </p>

            <select
              name="status"
              defaultValue={job.status}
              className="border p-2"
            >
              <option value="draft">
                draft
              </option>

              <option value="open">
                open
              </option>

              <option value="paused">
                paused
              </option>

              <option value="closed">
                closed
              </option>
            </select>

            <button className="bg-black text-white px-4 py-2">
              Guardar
            </button>

            <a
            href={`/company/jobs/${job.id}/applications`}
            className="block border p-2 text-center"
            >
            Ver postulantes
            </a>
          </form>
        ))}
      </div>
    </main>
  );
}