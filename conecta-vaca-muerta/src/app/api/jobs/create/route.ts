import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
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

    const company =
      await prisma.companyProfile.findUnique(
        {
          where: {
            userId:
              session.user.id,
          },
        }
      );

    if (!company) {
      return NextResponse.json(
        {
          message:
            "Empresa no encontrada",
        },
        { status: 404 }
      );
    }

    const activeSub =
      await prisma.subscription.findFirst(
        {
          where: {
            userId:
              session.user.id,
            status:
              "active",
          },
          orderBy: {
            createdAt:
              "desc",
          },
        }
      );

    if (!activeSub) {
      const jobsCount =
        await prisma.job.count(
          {
            where: {
              companyProfileId:
                company.id,
              status:
                "open",
            },
          }
        );

      if (jobsCount >= 1) {
        return NextResponse.json(
          {
            message:
              "Plan Free permite solo 1 vacante activa. Contratá un plan.",
          },
          { status: 403 }
        );
      }
    }

    const body =
      await req.json();

    const slug =
      slugify(
        body.title
      ) +
      "-" +
      Date.now();

    const job =
      await prisma.job.create(
        {
          data: {
            companyProfileId:
              company.id,
            title:
              body.title,
            slug,
            description:
              body.description,
            locationText:
              body.locationText,
            jobType:
              body.jobType,
            salaryMin:
              body.salaryMin
                ? Number(
                    body.salaryMin
                  )
                : null,
            salaryMax:
              body.salaryMax
                ? Number(
                    body.salaryMax
                  )
                : null,
            isRemote:
              body.isRemote,
            status:
              "open",
            publishedAt:
              new Date(),
          },
        }
      );

    const skillsText =
      String(
        body.skills || ""
      );

    const skills =
      skillsText
        .split(",")
        .map((s: string) =>
          s.trim()
        )
        .filter(Boolean);

    for (const name of skills) {
      const skill =
        await prisma.skill.upsert(
          {
            where: {
              slug:
                slugify(
                  name
                ),
            },
            update: {},
            create: {
              name,
              slug:
                slugify(
                  name
                ),
            },
          }
        );

      await prisma.jobSkill.create(
        {
          data: {
            jobId:
              job.id,
            skillId:
              skill.id,
          },
        }
      );
    }

    return NextResponse.json({
      message:
        "Vacante creada correctamente",
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