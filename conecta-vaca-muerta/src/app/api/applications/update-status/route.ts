import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "No autorizado" },
        { status: 401 }
      );
    }

    if (session.user.role !== "company") {
      return NextResponse.json(
        { message: "Solo empresas" },
        { status: 403 }
      );
    }

    const body = await req.json();

    await prisma.application.update({
      where: {
        id: body.applicationId,
      },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json({
      message: "Estado actualizado",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error servidor" },
      { status: 500 }
    );
  }
}