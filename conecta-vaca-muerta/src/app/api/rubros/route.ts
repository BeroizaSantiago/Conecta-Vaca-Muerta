import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const rubros =
    await prisma.rubro.findMany({
      orderBy: {
        name: "asc",
      },
    });

  return NextResponse.json(
    rubros
  );
}