import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

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

      <div className="space-y-6">
        {applications.map((app) => (
          <div
            key={app.id}
            className="border p-5 rounded"
          >
            <h2 className="text-xl font-bold">
              {app.job.title}
            </h2>

            <p>
              {app.job.companyProfile.companyName}
            </p>

            <p className="mt-2">
              Estado: {app.status}
            </p>

            <p>
              {new Date(
                app.createdAt
              ).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}