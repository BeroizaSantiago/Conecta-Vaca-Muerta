import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";

/*
  API: POST /api/jobs/apply

  Función:
  Permite que un usuario con rol "talent" se postule a una vacante.

  Validaciones:
  - Usuario autenticado
  - Rol correcto
  - Tiene TalentProfile
  - No esté ya postulado (evita duplicados)
*/

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Validación de sesión
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "No autorizado" },
        { status: 401 }
      );
    }

    // Validación de rol
    if (session.user.role !== "talent") {
      return NextResponse.json(
        { message: "Solo talentos pueden postularse" },
        { status: 403 }
      );
    }

    // Buscamos el perfil del talento
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

    // Validación básica del body
    if (!body.jobId) {
      return NextResponse.json(
        { message: "JobId requerido" },
        { status: 400 }
      );
    }

    // Evitar duplicados
    const existing =
      await prisma.application.findUnique({
        where: {
          jobId_talentProfileId: {
            jobId: body.jobId,
            talentProfileId: talent.id,
          },
        },
      });

    if (existing) {
      return NextResponse.json(
        { message: "Ya postulaste a esta vacante" },
        { status: 400 }
      );
    }

    // Crear postulación
    await prisma.application.create({
      data: {
        jobId: body.jobId,
        talentProfileId: talent.id,
      },
    });

    return NextResponse.json({
      message: "Postulación enviada correctamente",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Error en el servidor" },
      { status: 500 }
    );
  }
}