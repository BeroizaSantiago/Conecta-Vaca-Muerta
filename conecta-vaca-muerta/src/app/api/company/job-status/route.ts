import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { JobStatus } from "@prisma/client";

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

  const jobId = formData.get("jobId") as string;
  const status = formData.get("status") as JobStatus;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job || job.companyProfileId !== company.id) {
    return NextResponse.json(
      { error: "No permitido" },
      { status: 403 }
    );
  }

  await prisma.job.update({
    where: { id: jobId },
    data: { status },
  });

  return NextResponse.redirect(
    new URL("/company/jobs", req.url)
  );
}