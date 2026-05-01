import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const status =
      body.status;

    const sub =
      await prisma.subscription.update(
        {
          where: {
            id: body.id,
          },
          data: {
            status,

            startedAt:
              status ===
              "active"
                ? new Date()
                : undefined,

            endsAt:
              status ===
              "active"
                ? new Date(
                    Date.now() +
                      30 *
                        24 *
                        60 *
                        60 *
                        1000
                  )
                : undefined,

            canceledAt:
              status ===
              "canceled"
                ? new Date()
                : undefined,
          },
        }
      );

    if (
      status === "active"
    ) {
      const featured =
        sub.planType ===
          "sponsorship" ||
        sub.planType ===
          "strategic";

      await prisma.companyProfile.updateMany(
        {
          where: {
            userId:
              sub.userId,
          },
          data: {
            isFeatured:
              featured,
          },
        }
      );
    }

    if (
      status ===
      "canceled"
    ) {
      await prisma.companyProfile.updateMany(
        {
          where: {
            userId:
              sub.userId,
          },
          data: {
            isFeatured:
              false,
          },
        }
      );
    }

    return NextResponse.json(
      {
        message:
          "Actualizado",
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