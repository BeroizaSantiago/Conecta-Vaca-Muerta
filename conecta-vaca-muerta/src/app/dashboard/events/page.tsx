import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardEventsPage() {
  const session =
    await getServerSession(
      authOptions
    );

  if (!session?.user?.id) {
    redirect("/login");
  }

  const registrations =
    await prisma.eventRegistration.findMany(
      {
        where: {
          userId:
            session.user.id,
        },

        include: {
          event: true,
        },

        orderBy: {
          event: {
            startAt:
              "asc",
          },
        },
      }
    );

  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Mis Eventos
      </h1>

      <div className="space-y-5">
        {registrations.map(
          (item) => (
            <a
              key={item.id}
              href={`/events/${item.event.slug}`}
              className="block border p-5 rounded"
            >
              <h2 className="text-2xl font-bold">
                {
                  item.event
                    .title
                }
              </h2>

              <p className="mt-2">
                {new Date(
                  item.event.startAt
                ).toLocaleString()}
              </p>

              <p className="mt-1">
                {
                  item.event
                    .locationText
                }
              </p>

              <p className="mt-3 text-sm">
                Estado:{" "}
                {
                  item.status
                }
              </p>
            </a>
          )
        )}

        {registrations.length ===
          0 && (
          <div className="border p-5 rounded">
            No estás registrado en eventos.
          </div>
        )}
      </div>
    </main>
  );
}