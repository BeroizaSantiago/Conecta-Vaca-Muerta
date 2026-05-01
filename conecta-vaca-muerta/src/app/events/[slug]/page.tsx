import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RegisterButton from "./RegisterButton";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } =
    await params;

  const event =
    await prisma.event.findUnique({
      where: { slug },
    });

  if (
    !event ||
    event.visibility !==
      "public"
  ) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-6">
        {event.title}
      </h1>

      <p className="mb-6">
        {event.description}
      </p>

      <p className="mb-2">
        Inicio:{" "}
        {new Date(
          event.startAt
        ).toLocaleString()}
      </p>

      <p className="mb-2">
        Fin:{" "}
        {new Date(
          event.endAt
        ).toLocaleString()}
      </p>

      <p className="mb-6">
        Ubicación:{" "}
        {event.locationText}
      </p>

      {event.externalUrl && (
        <a
          href={event.externalUrl}
          target="_blank"
          className="underline block mb-6"
        >
          Sitio oficial
        </a>
      )}

      <RegisterButton
        eventId={event.id}
      />
    </main>
  );
}