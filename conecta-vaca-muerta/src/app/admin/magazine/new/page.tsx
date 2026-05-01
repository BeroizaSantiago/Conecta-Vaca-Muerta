import { prisma } from "@/lib/prisma";

export default async function NewMagazinePage() {
  const categories =
    await prisma.contentCategory.findMany({
      orderBy: {
        name: "asc",
      },
    });

  return (
    <main className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Nuevo Contenido Magazine
      </h1>

      <form
        action="/api/admin/magazine/create"
        method="POST"
        className="space-y-4"
      >
        <input
          name="title"
          placeholder="Título"
          className="border p-2 w-full"
        />

        <textarea
          name="excerpt"
          placeholder="Resumen"
          className="border p-2 w-full"
        />

        <textarea
          name="content"
          placeholder="Contenido"
          className="border p-2 w-full min-h-[250px]"
        />

        <select
          name="type"
          className="border p-2 w-full"
        >
          <option value="article">
            Artículo
          </option>

          <option value="video">
            Video
          </option>

          <option value="interview">
            Entrevista
          </option>

          <option value="podcast">
            Podcast
          </option>
        </select>

        <select
          name="categoryId"
          className="border p-2 w-full"
        >
          <option value="">
            Seleccionar categoría
          </option>

          {categories.map((cat) => (
            <option
              key={cat.id}
              value={cat.id}
            >
              {cat.name}
            </option>
          ))}
        </select>

        <input
          name="videoUrl"
          placeholder="YouTube URL"
          className="border p-2 w-full"
        />

        <label className="flex gap-2">
          <input
            type="checkbox"
            name="isPremium"
          />
          Premium
        </label>

        <button className="bg-black text-white px-4 py-2">
          Publicar
        </button>
      </form>
    </main>
  );
}