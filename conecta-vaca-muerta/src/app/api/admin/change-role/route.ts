import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { UserRole } from "@prisma/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const formData = await req.formData();

  const userId = formData.get("userId") as string;
  const role = formData.get("role") as UserRole;
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
  });

  return NextResponse.redirect(
    new URL("/admin/users", req.url)
  );
}