import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

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

    const body =
      await req.json();

    const name = String(
      body.name || ""
    ).trim();

    if (!name) {
      return NextResponse.json(
        {
          message:
            "Skill requerida",
        },
        { status: 400 }
      );
    }

    const talent =
      await prisma.talentProfile.findUnique(
        {
          where: {
            userId:
              session.user.id,
          },
        }
      );

    if (!talent) {
      return NextResponse.json(
        {
          message:
            "Primero completá tu perfil",
        },
        { status: 400 }
      );
    }

    const slug =
      slugify(name);

    const skill =
      await prisma.skill.upsert({
        where: { slug },
        update: {},
        create: {
          name,
          slug,
        },
      });

    await prisma.talentSkill.upsert({
      where: {
        talentProfileId_skillId:
          {
            talentProfileId:
              talent.id,
            skillId:
              skill.id,
          },
      },
      update: {},

      create: {
        talentProfileId:
          talent.id,
        skillId:
          skill.id,
      },
    });

    return NextResponse.json({
      message:
        "Skill agregada",
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

export async function GET() {
  try {
    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          skills: [],
        },
        { status: 401 }
      );
    }

    const talent =
      await prisma.talentProfile.findUnique(
        {
          where: {
            userId:
              session.user.id,
          },
        }
      );

    if (!talent) {
      return NextResponse.json({
        skills: [],
      });
    }

    const skills =
      await prisma.talentSkill.findMany(
        {
          where: {
            talentProfileId:
              talent.id,
          },

          include: {
            skill: true,
          },

          orderBy: {
            createdAt:
              "desc",
          },
        }
      );

    return NextResponse.json({
      skills: skills.map(
        (item) => ({
          id: item.skill.id,
          name: item.skill.name,
        })
      ),
    });
  } catch (error) {
    return NextResponse.json(
      {
        skills: [],
      },
      { status: 500 }
    );
  }
}