import { prisma } from "@/lib/prisma";

export default async function MagazinePage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
  }>;
}) {
  const params =
    await searchParams;

  const category =
    params.category || "";

  const categories =
    await prisma.contentCategory.findMany({
      orderBy: {
        name: "asc",
      },
    });

  const posts =
    await prisma.iAMagazineContent.findMany(
      {
        where: {
          status:
            "published",

          ...(category && {
            categories: {
              some: {
                category: {
                  slug:
                    category,
                },
              },
            },
          }),
        },

        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },

        orderBy: {
          publishedAt:
            "desc",
        },
      }
    );

  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        IA Magazine
      </h1>

      <div className="flex gap-2 flex-wrap mb-8">
        <a
          href="/magazine"
          className="border px-3 py-1"
        >
          Todas
        </a>

        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/magazine?category=${cat.slug}`}
            className="border px-3 py-1"
          >
            {cat.name}
          </a>
        ))}
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <a
            key={post.id}
            href={`/magazine/${post.slug}`}
            className="block border p-5 rounded"
          >
            <h2 className="text-2xl font-bold">
              {post.title}
            </h2>

            <p className="mt-2">
              {post.excerpt}
            </p>

            <div className="flex gap-2 mt-3 flex-wrap">
              {post.categories.map(
                (item) => (
                  <span
                    key={
                      item.category.id
                    }
                    className="text-sm border px-2 py-1"
                  >
                    {
                      item.category
                        .name
                    }
                  </span>
                )
              )}
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}