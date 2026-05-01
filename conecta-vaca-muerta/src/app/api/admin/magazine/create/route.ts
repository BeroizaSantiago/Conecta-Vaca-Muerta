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

    if (
      !session ||
      session.user?.role !==
        "admin"
    ) {
      return NextResponse.json(
        {
          message:
            "No autorizado",
        },
        { status: 401 }
      );
    }

    const form =
      await req.formData();

    const title = String(
      form.get("title")
    );

    const excerpt =
      String(
        form.get("excerpt")
      );

    const content =
      String(
        form.get("content")
      );

    const type = String(
      form.get("type")
    ) as any;

    const categoryId =
      String(
        form.get(
          "categoryId"
        ) || ""
      );

    const videoUrl =
      String(
        form.get(
          "videoUrl"
        ) || ""
      );

    const isPremium =
      form.get(
        "isPremium"
      ) === "on";

    const slug =
      slugify(title) +
      "-" +
      Date.now();

    const post =
      await prisma.iAMagazineContent.create(
        {
          data: {
            authorUserId:
              session.user.id,
            title,
            slug,
            excerpt,
            content,
            type,
            status:
              "published",
            videoUrl:
              videoUrl ||
              null,
            isPremium,
            publishedAt:
              new Date(),
          },
        }
      );

    if (categoryId) {
      await prisma.iAMagazineContentCategory.create(
        {
          data: {
            contentId:
              post.id,
            categoryId,
          },
        }
      );
    }

    return NextResponse.redirect(
      new URL(
        "/admin/magazine",
        req.url
      )
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