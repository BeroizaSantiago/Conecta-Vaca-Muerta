import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session =
    await getServerSession(authOptions);

  const opportunity =
    await prisma.opportunity.findUnique({
      where: { id },
      include: {
        requesterCompanyProfile: true,
      },
    });

  if (!opportunity) {
    redirect("/opportunities");
  }

  let canRespond = false;

  if (
    session &&
    session.user?.role === "company"
  ) {
    const company =
      await prisma.companyProfile.findUnique({
        where: {
          userId: session.user.id,
        },
      });

    if (
      company &&
      company.id !==
        opportunity.requesterCompanyProfileId
    ) {
      canRespond = true;
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-4">
        {opportunity.title}
      </h1>

      <p className="mb-4">
        {opportunity.description}
      </p>

      <p>
        Empresa:{" "}
        {
          opportunity
            .requesterCompanyProfile
            .companyName
        }
      </p>

      <p>
        Ubicación:{" "}
        {opportunity.locationText}
      </p>

      <p className="mb-8">
        Tipo: {opportunity.type}
      </p>

      {canRespond ? (
        <form
          action="/api/opportunities/respond"
          method="POST"
          className="space-y-4"
        >
          <input
            type="hidden"
            name="opportunityId"
            value={opportunity.id}
          />

          <textarea
            name="message"
            placeholder="Tu propuesta"
            className="border p-2 w-full h-40"
            required
          />

          <input
            name="proposedPrice"
            placeholder="Precio propuesto"
            className="border p-2 w-full"
          />

          <button className="bg-black text-white px-4 py-2">
            Enviar propuesta
          </button>
        </form>
      ) : (
        <p className="border p-4 rounded">
          Solo otra empresa puede
          responder esta oportunidad.
        </p>
      )}
    </main>
  );
}