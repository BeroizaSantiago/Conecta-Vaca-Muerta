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

    if (
      !session?.user?.id
    ) {
      return NextResponse.json(
        {
          message:
            "No autorizado",
        },
        { status: 401 }
      );
    }

    const body =
      await req.json();

    await prisma.sponsorProfile.upsert(
      {
        where: {
          userId:
            session.user.id,
        },

        update: {
          brandName:
            body.brandName,
          description:
            body.description,
          website:
            body.website,
          contactName:
            body.contactName,
          contactEmail:
            body.contactEmail,
          budgetRange:
            body.budgetRange,
        },

        create: {
          userId:
            session.user.id,
          brandName:
            body.brandName,
          description:
            body.description,
          website:
            body.website,
          contactName:
            body.contactName,
          contactEmail:
            body.contactEmail,
          budgetRange:
            body.budgetRange,
        },
      }
    );

    return NextResponse.json(
      {
        message:
          "Perfil sponsor guardado",
      }
    );
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