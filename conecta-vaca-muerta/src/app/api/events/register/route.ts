import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  try {
    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message:
            "Debes iniciar sesión",
        },
        { status: 401 }
      );
    }

    const body =
      await req.json();

    await prisma.eventRegistration.upsert(
      {
        where: {
          eventId_userId: {
            eventId:
              body.eventId,
            userId:
              session.user.id,
          },
        },

        update: {
          status:
            "registered",
        },

        create: {
          eventId:
            body.eventId,
          userId:
            session.user.id,
          status:
            "registered",
        },
      }
    );

    return NextResponse.json({
      message:
        "Registro exitoso",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          "Error servidor",
      },
      { status: 500 }
    );
  }
}