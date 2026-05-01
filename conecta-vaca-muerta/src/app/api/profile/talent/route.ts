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
            "No autorizado",
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      fullName,
      headline,
      profession,
      experienceYears,
      currentLocationText,
      linkedinUrl,
      expectedSalaryMin,
      expectedSalaryMax,
      bio,
      openToRelocate,
      openToShiftWork,
    } = body;

    await prisma.talentProfile.upsert({
      where: {
        userId: session.user.id,
      },

      update: {
        fullName,
        headline,
        profession,
        experienceYears:
          experienceYears
            ? Number(
                experienceYears
              )
            : null,
        currentLocationText,
        linkedinUrl,
        expectedSalaryMin:
          expectedSalaryMin
            ? Number(
                expectedSalaryMin
              )
            : null,
        expectedSalaryMax:
          expectedSalaryMax
            ? Number(
                expectedSalaryMax
              )
            : null,
        bio,
        openToRelocate,
        openToShiftWork,
      },

      create: {
        userId: session.user.id,
        fullName,
        headline,
        profession,
        experienceYears:
          experienceYears
            ? Number(
                experienceYears
              )
            : null,
        currentLocationText,
        linkedinUrl,
        expectedSalaryMin:
          expectedSalaryMin
            ? Number(
                expectedSalaryMin
              )
            : null,
        expectedSalaryMax:
          expectedSalaryMax
            ? Number(
                expectedSalaryMax
              )
            : null,
        bio,
        openToRelocate,
        openToShiftWork,
      },
    });

    return NextResponse.json({
      message:
        "Perfil guardado correctamente",
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