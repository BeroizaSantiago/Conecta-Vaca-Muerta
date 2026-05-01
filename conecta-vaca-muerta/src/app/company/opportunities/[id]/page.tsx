import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export default async function CompanyOpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  const opportunity =
    await prisma.opportunity.findUnique({
      where: { id },
      include: {
        responses: {
          include: {
            responderCompanyProfile:
              true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

  if (
    !opportunity ||
    opportunity
      .requesterCompanyProfileId !==
      company.id
  ) {
    redirect(
      "/company/opportunities"
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        {opportunity.title}
      </h1>

      <div className="space-y-4">
        {opportunity.responses.map(
  (item) => (
    <div
      key={item.id}
      className="border p-5 rounded"
    >
      <p className="font-bold">
        {
          item
            .responderCompanyProfile
            .companyName
        }
      </p>

      <p>
        $
        {item.proposedPrice?.toString() ||
          "Sin precio"}
      </p>

      <p className="mt-2">
        {item.message}
      </p>

      <p className="text-sm mt-2">
        Estado: {item.status}
      </p>

      {item.status ===
        "pending" && (
        <div className="flex gap-2 mt-4">
          <form
            action="/api/opportunities/response-status"
            method="POST"
          >
            <input
              type="hidden"
              name="responseId"
              value={item.id}
            />

            <input
              type="hidden"
              name="status"
              value="accepted"
            />

            <button className="bg-black text-white px-3 py-2">
              Aceptar
            </button>
          </form>

          <form
            action="/api/opportunities/response-status"
            method="POST"
          >
            <input
              type="hidden"
              name="responseId"
              value={item.id}
            />

            <input
              type="hidden"
              name="status"
              value="rejected"
            />

            <button className="border px-3 py-2">
              Rechazar
            </button>
          </form>
        </div>
      )}
    </div>
  )
)}

        {opportunity.responses
          .length === 0 && (
          <p>
            No hay propuestas aún.
          </p>
        )}
      </div>
    </main>
  );
}