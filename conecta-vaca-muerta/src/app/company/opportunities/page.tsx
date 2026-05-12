import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

/*
  Módulo: CompanyOpportunitiesPage

  Función:
  Listar oportunidades creadas por la empresa.
  Incluye métricas, filtros y acceso a detalle.

  Este módulo es la base del flujo B2B (empresa ↔ empresa).
*/

export default async function CompanyOpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
  }>;
}) {
  const params = await searchParams;

  const selectedStatus =
    params.status || "";

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

  // Query con filtro opcional por estado
  const opportunities =
    await prisma.opportunity.findMany({
      where: {
        requesterCompanyProfileId:
          company.id,

        ...(selectedStatus
          ? {
              status:
                selectedStatus as any,
            }
          : {}),
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

  // Métricas
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

      {/* FILTROS */}
      <form
        method="GET"
        className="flex gap-3 mb-6"
      >
        <select
          name="status"
          defaultValue={
            selectedStatus
          }
          className="border p-2"
        >
          <option value="">
            Todos
          </option>

          <option value="open">
            Abiertas
          </option>

          <option value="in_progress">
            En progreso
          </option>

          <option value="closed">
            Cerradas
          </option>
        </select>

        <button className="bg-black text-white px-4">
          Filtrar
        </button>
      </form>

      {/* MÉTRICAS */}
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

      {/* LISTADO */}
      <div className="space-y-4">
        {opportunities.map(
          (item) => (
            <a
              key={item.id}
              href={`/company/opportunities/${item.id}`}
              className="border p-5 rounded block"
            >
              <h2 className="text-xl font-bold">
                {item.title}
              </h2>

              {/* Estado visual */}
              <p className="text-sm mt-1">
                Estado:{" "}
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${
                    item.status === "open"
                      ? "bg-green-600"
                      : item.status ===
                        "in_progress"
                      ? "bg-yellow-600"
                      : "bg-gray-600"
                  }`}
                >
                  {item.status}
                </span>
              </p>

              <p className="text-sm mt-1">
                Respuestas:{" "}
                {
                  item._count
                    .responses
                }
              </p>

              {item.locationText && (
                <p className="text-sm mt-1">
                  {item.locationText}
                </p>
              )}

              {/* Fecha */}
              <p className="text-xs text-gray-500 mt-2">
                {new Date(
                  item.createdAt
                ).toLocaleDateString()}
              </p>

              {/* CTA */}
              <p className="text-sm underline mt-2">
                Ver detalles →
              </p>
            </a>
          )
        )}

        {opportunities.length ===
          0 && (
          <div className="border p-5 rounded">
            No hay oportunidades con ese filtro.
          </div>
        )}
      </div>
    </main>
  );
}