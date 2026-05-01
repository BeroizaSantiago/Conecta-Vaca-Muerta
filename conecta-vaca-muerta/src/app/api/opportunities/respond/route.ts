import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  const session =
    await getServerSession(authOptions);

  if (
    !session ||
    session.user?.role !== "company"
  ) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  const formData = await req.formData();

  const opportunityId = String(
    formData.get("opportunityId")
  );

  const message = String(
    formData.get("message")
  );

  const proposedPriceRaw = String(
    formData.get("proposedPrice") || ""
  );

  const company =
    await prisma.companyProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

  if (!company) {
    return NextResponse.redirect(
      new URL("/profile", req.url)
    );
  }

  const opportunity =
    await prisma.opportunity.findUnique({
      where: {
        id: opportunityId,
      },
    });

  if (!opportunity) {
    return NextResponse.redirect(
      new URL("/opportunities", req.url)
    );
  }

  if (
    opportunity
      .requesterCompanyProfileId ===
    company.id
  ) {
    return NextResponse.redirect(
      new URL("/opportunities", req.url)
    );
  }

  await prisma.opportunityResponse.create({
    data: {
      opportunityId,
      responderCompanyProfileId:
        company.id,
      message,
      proposedPrice:
        proposedPriceRaw
          ? Number(proposedPriceRaw)
          : null,
      status: "pending",
    },
  });

  return NextResponse.redirect(
    new URL("/opportunities", req.url)
  );
}