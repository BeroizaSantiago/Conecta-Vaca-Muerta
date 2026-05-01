import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  const session =
    await getServerSession(authOptions);

  if (!session) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  if (session.user?.role !== "company") {
    return NextResponse.redirect(
      new URL("/dashboard", req.url)
    );
  }

  const formData = await req.formData();

  const title = String(
    formData.get("title") || ""
  );

  const description = String(
    formData.get("description") || ""
  );

  const type = String(
    formData.get("type") || "need"
  );

  const locationText = String(
    formData.get("locationText") || ""
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

  await prisma.opportunity.create({
    data: {
      requesterCompanyProfileId:
        company.id,
      title,
      description,
      type:
        type === "offer"
          ? "offer"
          : "need",
      locationText,
      status: "open",
    },
  });

  return NextResponse.redirect(
    new URL(
      "/company/opportunities",
      req.url
    )
  );
}