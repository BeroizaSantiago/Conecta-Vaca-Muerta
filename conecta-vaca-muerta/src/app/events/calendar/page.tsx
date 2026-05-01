import { prisma } from "@/lib/prisma";

export default async function EventsCalendarPage() {
  const now = new Date();

  const year =
    now.getFullYear();

  const month =
    now.getMonth();

  const firstDay =
    new Date(
      year,
      month,
      1
    );

  const nextMonth =
    new Date(
      year,
      month + 1,
      1
    );

  const lastDay =
    new Date(
      year,
      month + 1,
      0
    );

  const events =
    await prisma.event.findMany({
      where: {
        visibility:
          "public",

        startAt: {
          gte: firstDay,
          lt: nextMonth,
        },
      },

      orderBy: {
        startAt: "asc",
      },
    });

  const daysInMonth =
    lastDay.getDate();

  const days = Array.from(
    {
      length:
        daysInMonth,
    },
    (_, i) => i + 1
  );

  const monthName =
    now.toLocaleString(
      "es-AR",
      {
        month: "long",
      }
    );

  return (
    <main className="max-w-6xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-2">
        Calendario de Eventos
      </h1>

      <p className="mb-8 text-lg capitalize">
        {monthName} {year}
      </p>

      <div className="grid grid-cols-7 gap-3 text-center font-bold mb-3">
        <div>Dom</div>
        <div>Lun</div>
        <div>Mar</div>
        <div>Mié</div>
        <div>Jue</div>
        <div>Vie</div>
        <div>Sáb</div>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {days.map((day) => {
          const dayEvents =
            events.filter(
              (event) =>
                new Date(
                  event.startAt
                ).getDate() ===
                day
            );

          return (
            <div
              key={day}
              className="border rounded p-2 min-h-[140px]"
            >
              <div className="font-bold mb-2">
                {day}
              </div>

              <div className="space-y-1">
                {dayEvents.map(
                  (event) => (
                    <a
                      key={event.id}
                      href={`/events/${event.slug}`}
                      className="block text-xs border rounded px-2 py-1 hover:bg-gray-100"
                    >
                      {event.title}
                    </a>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}