"use client";

import { useState } from "react";

/*
  Componente: ApplyButton

  Función:
  Permite a un usuario con rol "talent" postularse a una vacante.

  Responsabilidades:
  - Ejecutar POST a la API
  - Evitar múltiples envíos
  - Mostrar feedback básico
*/

export default function ApplyButton({
  jobId,
}: {
  jobId: string;
}) {
  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  const handleApply = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch(
        "/api/jobs/apply",
        {
          method: "POST",

          // CLAVE: sin esto Next no parsea JSON correctamente
          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            jobId,
          }),
        }
      );

      const data = await res.json();

      // Manejo simple de respuesta
      if (!res.ok) {
        throw new Error(
          data.message ||
            "Error al postular"
        );
      }

      setMessage(
        "Postulación enviada correctamente"
      );
    } catch (err: any) {
      setMessage(
        err.message ||
          "Error inesperado"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleApply}
        disabled={loading}
        className="bg-black text-white px-4 py-2 disabled:opacity-50"
      >
        {loading
          ? "Enviando..."
          : "Postularme"}
      </button>

      {/* Feedback al usuario */}
      {message && (
        <p className="text-sm">
          {message}
        </p>
      )}
    </div>
  );
}