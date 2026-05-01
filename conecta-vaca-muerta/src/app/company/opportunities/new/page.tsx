export default function NewOpportunityPage() {
  return (
    <main className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Nueva Oportunidad
      </h1>

      <form
        action="/api/company/opportunities/create"
        method="POST"
        className="space-y-4"
      >
        <input
          name="title"
          placeholder="Título"
          className="border p-2 w-full"
          required
        />

        <textarea
          name="description"
          placeholder="Descripción"
          className="border p-2 w-full h-40"
          required
        />

        <select
          name="type"
          className="border p-2 w-full"
        >
          <option value="need">
            Necesito algo
          </option>

          <option value="offer">
            Ofrezco servicio
          </option>
        </select>

        <input
          name="locationText"
          placeholder="Ubicación"
          className="border p-2 w-full"
        />

        <button className="bg-black text-white px-4 py-2">
          Publicar
        </button>
      </form>
    </main>
  );
}