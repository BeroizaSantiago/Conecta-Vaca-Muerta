import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { ApplicationStatus } from "@prisma/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "company") {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const company = await prisma.companyProfile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!company) {
    return NextResponse.json(
      { error: "Empresa no encontrada" },
      { status: 404 }
    );
  }

  const formData = await req.formData();

  const applicationId =
    formData.get("applicationId") as string;

  const status =
    formData.get("status") as ApplicationStatus;

  const application =
    await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        job: true,
      },
    });

  if (
    !application ||
    application.job.companyProfileId !== company.id
  ) {
    return NextResponse.json(
      { error: "No permitido" },
      { status: 403 }
    );
  }

  await prisma.application.update({
    where: {
      id: applicationId,
    },
    data: {
      status,
    },
  });

  return NextResponse.redirect(
    new URL(
      `/company/jobs/${application.jobId}/applications`,
      req.url
    )
  );
}