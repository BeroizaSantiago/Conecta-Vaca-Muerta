export default function NewEventPage() {
  return (
    <main className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Nuevo Evento
      </h1>

      <form
        action="/api/admin/events/create"
        method="POST"
        className="space-y-4"
      >
        <input
          name="title"
          placeholder="Título"
          className="border p-2 w-full"
        />

        <textarea
          name="description"
          placeholder="Descripción"
          className="border p-2 w-full"
        />

        <input
          type="datetime-local"
          name="startAt"
          className="border p-2 w-full"
        />

        <input
          type="datetime-local"
          name="endAt"
          className="border p-2 w-full"
        />

        <input
          name="locationText"
          placeholder="Ubicación"
          className="border p-2 w-full"
        />

        <input
          name="zoneSlug"
          placeholder="Zona (neuquen, anelo...)"
          className="border p-2 w-full"
        />

        <input
          name="externalUrl"
          placeholder="Link externo (opcional)"
          className="border p-2 w-full"
        />

        <label className="flex gap-2">
          <input
            type="checkbox"
            name="isGlobal"
          />
          Evento Global
        </label>

        <select
          name="visibility"
          className="border p-2 w-full"
        >
          <option value="public">
            Público
          </option>

          <option value="premium">
            Premium
          </option>

          <option value="private">
            Privado
          </option>
        </select>

        <button className="bg-black text-white px-4 py-2">
          Publicar Evento
        </button>
      </form>
    </main>
  );
}