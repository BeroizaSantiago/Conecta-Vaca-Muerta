"use client";

import { useState } from "react";

export default function RegisterButton({
  eventId,
}: {
  eventId: string;
}) {
  const [loading, setLoading] =
    useState(false);

  async function handleClick() {
    setLoading(true);

    const res =
      await fetch(
        "/api/events/register",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            eventId,
          }),
        }
      );

    const data =
      await res.json();

    alert(data.message);

    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-black text-white px-4 py-2"
    >
      {loading
        ? "Registrando..."
        : "Registrarme"}
    </button>
  );
}