import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import ApplyButton from "@/app/jobs/ApplyButton";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  const company =
    await prisma.companyProfile.findUnique({
      where: { id },
      include: {
        jobs: {
          where: {
            status: "open",
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

  if (!company) notFound();

  return (
    <main className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-4">
        {company.companyName}
      </h1>

      <p className="mb-4">
        {company.description ||
          "Sin descripción"}
      </p>

      <p className="mb-4">
        {company.addressText}
      </p>

      <p className="mb-8">
        {company.website}
      </p>

      <h2 className="text-2xl font-bold mb-4">
        Vacantes activas
      </h2>

      <div className="space-y-4">
        {company.jobs.map((job) => (
          <div
            key={job.id}
            className="border p-4 rounded"
          >
            <p className="font-bold">
              {job.title}
            </p>

            <p>{job.jobType}</p>

            <p>{job.locationText}</p>

            {session?.user?.role === "talent" && (
              <div className="mt-4">
                <ApplyButton jobId={job.id} />
              </div>
            )}
          </div>
        ))}

        {company.jobs.length === 0 && (
          <p>No posee vacantes activas.</p>
        )}
      </div>
    </main>
  );
}