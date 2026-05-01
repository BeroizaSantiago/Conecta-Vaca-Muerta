import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export default async function CompanyOpportunitiesPage() {
  const session =
    await getServerSession(authOptions);

  if (!session) redirect("/login");

  if (session.user?.role !== "company") {
    redirect("/dashboard");
  }

  const company =
    await prisma.companyProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

  if (!company) redirect("/profile");

  const opportunities =
    await prisma.opportunity.findMany({
      where: {
        requesterCompanyProfileId:
          company.id,
      },
      include: {
        _count: {
          select: {
            responses: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  const total =
    opportunities.length;

  const open =
    opportunities.filter(
      (x) => x.status === "open"
    ).length;

  const progress =
    opportunities.filter(
      (x) =>
        x.status === "in_progress"
    ).length;

  const closed =
    opportunities.filter(
      (x) => x.status === "closed"
    ).length;

  return (
    <main className="max-w-6xl mx-auto p-10">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">
          Mis Oportunidades
        </h1>

        <a
          href="/company/opportunities/new"
          className="bg-black text-white px-4 py-2"
        >
          Nueva oportunidad
        </a>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-10">
        <div className="border p-4 rounded">
          <p>Total</p>
          <p className="text-2xl font-bold">
            {total}
          </p>
        </div>

        <div className="border p-4 rounded">
          <p>Abiertas</p>
          <p className="text-2xl font-bold">
            {open}
          </p>
        </div>

        <div className="border p-4 rounded">
          <p>En progreso</p>
          <p className="text-2xl font-bold">
            {progress}
          </p>
        </div>

        <div className="border p-4 rounded">
          <p>Cerradas</p>
          <p className="text-2xl font-bold">
            {closed}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {opportunities.map((item) => (
          <a
            key={item.id}
            href={`/company/opportunities/${item.id}`}
            className="border p-5 rounded block"
          >
            <h2 className="text-xl font-bold">
              {item.title}
            </h2>

            <p>
              Estado: {item.status}
            </p>

            <p>
              Respuestas:{" "}
              {item._count.responses}
            </p>

            <p>
              {item.locationText}
            </p>
          </a>
        ))}

        {opportunities.length === 0 && (
          <p>
            Todavía no publicaste
            oportunidades.
          </p>
        )}
      </div>
    </main>
  );
}