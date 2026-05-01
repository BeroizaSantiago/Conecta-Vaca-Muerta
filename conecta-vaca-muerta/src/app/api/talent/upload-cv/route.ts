import { writeFile } from "fs/promises";
import { join } from "path";
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
        { message: "No autorizado" },
        { status: 401 }
      );
    }

    const data =
      await req.formData();

    const file =
      data.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Archivo requerido" },
        { status: 400 }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const fileName =
      `${session.user.id}-${Date.now()}-${file.name}`;

    const path = join(
      process.cwd(),
      "public",
      "uploads",
      "cv",
      fileName
    );

    await writeFile(
      path,
      buffer
    );

    const url =
      `/uploads/cv/${fileName}`;

    await prisma.talentProfile.update(
      {
        where: {
          userId:
            session.user.id,
        },
        data: {
          cvFileUrl: url,
        },
      }
    );

    return NextResponse.json({
      message:
        "CV subido correctamente",
      url,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error servidor" },
      { status: 500 }
    );
  }
}