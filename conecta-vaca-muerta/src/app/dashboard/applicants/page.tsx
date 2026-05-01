import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export default async function ApplicantsPage() {
  const session =
    await getServerSession(
      authOptions
    );

  if (!session?.user?.id) {
    redirect("/login");
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
    redirect("/dashboard");
  }

  const jobs =
    await prisma.job.findMany({
      where: {
        companyProfileId:
          company.id,
      },

      include: {
        applications: {
          include: {
            talentProfile: true,
          },

          orderBy: {
            appliedAt:
              "desc",
          },
        },
      },

      orderBy: {
        createdAt:
          "desc",
      },
    });

  return (
    <main className="max-w-6xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Postulantes
      </h1>

      <div className="space-y-8">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="border rounded p-5"
          >
            <h2 className="text-2xl font-bold mb-5">
              {job.title}
            </h2>

            <div className="space-y-4">
              {job.applications.map(
                (app) => (
                  <div
                    key={app.id}
                    className="border rounded p-4"
                  >
                    <p className="font-bold text-lg">
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

                    <p className="mt-1">
                      Estado:{" "}
                      {
                        app.status
                      }
                    </p>

                    <p>
                      Fecha:{" "}
                      {new Date(
                        app.appliedAt
                      ).toLocaleString()}
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
                        className="underline block mt-2"
                      >
                        Ver CV
                      </a>
                    )}
                  </div>
                )
              )}

              {job.applications
                .length ===
                0 && (
                <p>
                  Sin postulantes aún.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}