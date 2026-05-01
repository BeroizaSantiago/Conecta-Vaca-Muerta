import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { JobStatus } from "@prisma/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const formData = await req.formData();

  const jobId = formData.get("jobId") as string;
  const status = formData.get("status") as JobStatus;

  await prisma.job.update({
    where: { id: jobId },
    data: { status },
  });

  return NextResponse.redirect(
    new URL("/admin/jobs", req.url)
  );
}