import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function MagazinePostPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } =
    await params;

  const post =
    await prisma.iAMagazineContent.findUnique(
      {
        where: {
          slug,
        },
      }
    );

  if (
    !post ||
    post.status !==
      "published"
  ) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto p-10">
      <p className="text-sm mb-3">
        {post.type}
      </p>

      <h1 className="text-4xl font-bold mb-6">
        {post.title}
      </h1>

      {post.excerpt && (
        <p className="text-lg mb-6">
          {post.excerpt}
        </p>
      )}

      {post.videoUrl && (
        <div className="mb-6">
          <a
            href={post.videoUrl}
            target="_blank"
            className="underline"
          >
            Ver Video
          </a>
        </div>
      )}

      <article className="whitespace-pre-line leading-7">
        {post.content}
      </article>
    </main>
  );
}