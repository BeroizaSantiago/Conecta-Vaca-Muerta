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
        {
          status: 401,
        }
      );
    }

    const body =
      await req.json();

    const {
      companyName,
      description,
      contactEmail,
      contactPhone,
      rubros,
    } = body;

    const company =
      await prisma.companyProfile.upsert(
        {
          where: {
            userId:
              session
                .user.id,
          },

          update: {
            companyName,
            description,
            contactEmail,
            contactPhone,
          },

          create: {
            userId:
              session
                .user.id,
            companyName,
            description,
            contactEmail,
            contactPhone,
          },
        }
      );

    await prisma.companyRubro.deleteMany(
      {
        where: {
          companyProfileId:
            company.id,
        },
      }
    );

    if (
      rubros &&
      rubros.length > 0
    ) {
      await prisma.companyRubro.createMany(
        {
          data:
            rubros.map(
              (
                rubroId: string
              ) => ({
                companyProfileId:
                  company.id,
                rubroId,
              })
            ),
        }
      );
    }

    return NextResponse.json(
      {
        message:
          "Perfil empresa guardado",
      }
    );
  } catch (
    error
  ) {
    return NextResponse.json(
      {
        message:
          "Error servidor",
      },
      {
        status: 500,
      }
    );
  }
}