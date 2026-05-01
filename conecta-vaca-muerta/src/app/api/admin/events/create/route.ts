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

    const slug =
      slugify(title) +
      "-" +
      Date.now();

    await prisma.event.create({
      data: {
        organizerUserId:
          session.user.id,

        title,
        slug,

        description: String(
          form.get(
            "description"
          ) || ""
        ),

        startAt: new Date(
          String(
            form.get(
              "startAt"
            )
          )
        ),

        endAt: new Date(
          String(
            form.get(
              "endAt"
            )
          )
        ),

        locationText: String(
          form.get(
            "locationText"
          ) || ""
        ),

        zoneSlug: String(
          form.get(
            "zoneSlug"
          ) || ""
        ),

        externalUrl: String(
          form.get(
            "externalUrl"
          ) || ""
        ),

        isGlobal:
          form.get(
            "isGlobal"
          ) === "on",

        visibility:
          String(
            form.get(
              "visibility"
            )
          ) as any,
      },
    });

    return NextResponse.redirect(
      new URL(
        "/admin",
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