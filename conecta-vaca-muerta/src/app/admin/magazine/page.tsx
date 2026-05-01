import { prisma } from "@/lib/prisma";

export default async function AdminMagazinePage() {
  const posts =
    await prisma.iAMagazineContent.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Gestionar Magazine
      </h1>

      <a
        href="/admin/magazine/new"
        className="border p-3 rounded inline-block mb-6"
      >
        Nuevo Contenido
      </a>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border p-4 rounded"
          >
            <p className="text-sm">
              {post.type} | {post.status}
            </p>

            <h2 className="text-xl font-bold">
              {post.title}
            </h2>

            <p>{post.excerpt}</p>
          </div>
        ))}
      </div>
    </main>
  );
}