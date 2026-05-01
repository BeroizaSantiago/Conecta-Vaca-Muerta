import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, password, role } = body;

    if (!email || !password || !role) {
      return NextResponse.json(
        { message: "Faltan datos" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "El email ya está registrado" },
        { status: 400 }
      );
    }

    const passwordHash = await hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
      },
    });

    return NextResponse.json({
      message: "Usuario creado correctamente",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error del servidor" },
      { status: 500 }
    );
  }
}