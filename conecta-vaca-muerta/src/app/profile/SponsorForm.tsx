"use client";

import { useState } from "react";

export default function SponsorForm() {
  const [form, setForm] =
    useState({
      brandName: "",
      description: "",
      website: "",
      contactName: "",
      contactEmail: "",
      budgetRange: "",
    });

  const submit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const res = await fetch(
      "/api/profile/sponsor",
      {
        method: "POST",
        body: JSON.stringify(form),
      }
    );

    const data =
      await res.json();

    alert(data.message);
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-4"
    >
      <input
        className="border p-2 w-full"
        placeholder="Marca"
        onChange={(e) =>
          setForm({
            ...form,
            brandName:
              e.target.value,
          })
        }
      />

      <textarea
        className="border p-2 w-full"
        placeholder="Descripción"
        onChange={(e) =>
          setForm({
            ...form,
            description:
              e.target.value,
          })
        }
      />

      <input
        className="border p-2 w-full"
        placeholder="Website"
        onChange={(e) =>
          setForm({
            ...form,
            website:
              e.target.value,
          })
        }
      />

      <input
        className="border p-2 w-full"
        placeholder="Contacto"
        onChange={(e) =>
          setForm({
            ...form,
            contactName:
              e.target.value,
          })
        }
      />

      <input
        className="border p-2 w-full"
        placeholder="Email contacto"
        onChange={(e) =>
          setForm({
            ...form,
            contactEmail:
              e.target.value,
          })
        }
      />

      <input
        className="border p-2 w-full"
        placeholder="Budget range"
        onChange={(e) =>
          setForm({
            ...form,
            budgetRange:
              e.target.value,
          })
        }
      />

      <button className="bg-black text-white px-4 py-2">
        Guardar Sponsor
      </button>
    </form>
  );
}