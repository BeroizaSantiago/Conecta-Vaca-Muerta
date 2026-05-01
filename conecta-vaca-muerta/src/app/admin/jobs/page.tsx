import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminJobsPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  if (session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const jobs = await prisma.job.findMany({
    include: {
      companyProfile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Vacantes
      </h1>

      <div className="space-y-4">
        {jobs.map((job) => (
          <form
            key={job.id}
            action="/api/admin/job-status"
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

            <p>
              {job.companyProfile.companyName}
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

              <option value="expired">
                expired
              </option>
            </select>

            <button className="block bg-black text-white px-4 py-2">
              Guardar Estado
            </button>
          </form>
        ))}
      </div>
    </main>
  );
}