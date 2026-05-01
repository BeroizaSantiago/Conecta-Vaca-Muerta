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

  const responseId = String(
    formData.get("responseId")
  );

  const status = String(
    formData.get("status")
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

  const response =
    await prisma.opportunityResponse.findUnique({
      where: {
        id: responseId,
      },
      include: {
        opportunity: true,
      },
    });

  if (!response) {
    return NextResponse.redirect(
      new URL(
        "/company/opportunities",
        req.url
      )
    );
  }

  if (
    response.opportunity
      .requesterCompanyProfileId !==
    company.id
  ) {
    return NextResponse.redirect(
      new URL(
        "/company/opportunities",
        req.url
      )
    );
  }

  await prisma.opportunityResponse.update({
    where: {
      id: responseId,
    },
    data: {
      status:
        status === "accepted"
          ? "accepted"
          : "rejected",
    },
  });

  if (status === "accepted") {
    await prisma.opportunity.update({
      where: {
        id: response.opportunityId,
      },
      data: {
        status: "in_progress",
      },
    });
  }

  return NextResponse.redirect(
    new URL(
      `/company/opportunities/${response.opportunityId}`,
      req.url
    )
  );
}