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

      if (session.user.role !== "talent") {
        return NextResponse.json(
          { message: "Solo talentos pueden postularse" },
          { status: 403 }
        );
      }

    const talent = await prisma.talentProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!talent) {
      return NextResponse.json(
        { message: "Perfil talento no encontrado" },
        { status: 404 }
      );
    }

    const body = await req.json();

    await prisma.application.create({
      data: {
        jobId: body.jobId,
        talentProfileId: talent.id,
      },
    });

    return NextResponse.json({
      message: "Postulación enviada",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Ya postulaste o error servidor" },
      { status: 500 }
    );
  }
}