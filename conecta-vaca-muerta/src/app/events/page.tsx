import { prisma } from "@/lib/prisma";

export default async function EventsPage() {
  const events =
    await prisma.event.findMany({
      where: {
        visibility:
          "public",
      },
      orderBy: {
        startAt: "asc",
      },
    });

  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Agenda y Eventos
      </h1>

      <div className="space-y-5">
        {events.map((event) => (
          <a
            key={event.id}
            href={`/events/${event.slug}`}
            className="block border p-5 rounded"
          >
            <h2 className="text-2xl font-bold">
              {event.title}
            </h2>

            <p className="mt-2">
              {event.description}
            </p>

            <p className="mt-3 text-sm">
              {new Date(
                event.startAt
              ).toLocaleString()}
            </p>

            <p className="text-sm">
              {event.locationText}
            </p>

            {event.isGlobal && (
              <p className="text-sm mt-2">
                Global
              </p>
            )}
          </a>
        ))}

        {events.length === 0 && (
          <div className="border p-5 rounded">
            No hay eventos publicados.
          </div>
        )}
      </div>
    </main>
  );
}