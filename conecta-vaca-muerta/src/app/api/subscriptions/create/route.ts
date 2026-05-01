import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const prices: Record<string, number> = {
      recruiting: 120000,
      sponsorship: 250000,
      strategic: 0,
    };

    const amount =
      prices[body.planType] ?? 0;

    await prisma.subscription.create({
      data: {
        userId: session.user.id,
        planType: body.planType,
        status: "pending_payment",
        amount,
        currency: "ARS",
        billingPeriod: "monthly",
      },
    });

    return NextResponse.json({
      message: "Solicitud enviada",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error servidor" },
      { status: 500 }
    );
  }
}