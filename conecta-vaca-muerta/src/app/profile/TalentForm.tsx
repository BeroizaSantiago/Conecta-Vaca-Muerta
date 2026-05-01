"use client";

import { useState } from "react";

export default function TalentForm() {
  const [form, setForm] = useState({
    fullName: "",
    headline: "",
    profession: "",
    experienceYears: "",
    currentLocationText: "",
    linkedinUrl: "",
    expectedSalaryMin: "",
    expectedSalaryMax: "",
    bio: "",
    openToRelocate: false,
    openToShiftWork: false,
  });

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const res = await fetch(
      "/api/profile/talent",
      {
        method: "POST",
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();

    alert(data.message);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        className="border p-2 w-full"
        placeholder="Nombre completo"
        onChange={(e) =>
          setForm({
            ...form,
            fullName: e.target.value,
          })
        }
      />

      <input
        className="border p-2 w-full"
        placeholder="Titular profesional"
        onChange={(e) =>
          setForm({
            ...form,
            headline: e.target.value,
          })
        }
      />

      <input
        className="border p-2 w-full"
        placeholder="Profesión"
        onChange={(e) =>
          setForm({
            ...form,
            profession: e.target.value,
          })
        }
      />

      <input
        className="border p-2 w-full"
        placeholder="Años experiencia"
        onChange={(e) =>
          setForm({
            ...form,
            experienceYears:
              e.target.value,
          })
        }
      />

      <input
        className="border p-2 w-full"
        placeholder="Ubicación actual"
        onChange={(e) =>
          setForm({
            ...form,
            currentLocationText:
              e.target.value,
          })
        }
      />

      <input
        className="border p-2 w-full"
        placeholder="LinkedIn"
        onChange={(e) =>
          setForm({
            ...form,
            linkedinUrl:
              e.target.value,
          })
        }
      />

      <input
        className="border p-2 w-full"
        placeholder="Salario mínimo esperado"
        onChange={(e) =>
          setForm({
            ...form,
            expectedSalaryMin:
              e.target.value,
          })
        }
      />

      <input
        className="border p-2 w-full"
        placeholder="Salario máximo esperado"
        onChange={(e) =>
          setForm({
            ...form,
            expectedSalaryMax:
              e.target.value,
          })
        }
      />

      <textarea
        className="border p-2 w-full"
        placeholder="Biografía"
        onChange={(e) =>
          setForm({
            ...form,
            bio: e.target.value,
          })
        }
      />

      <label className="block">
        <input
          type="checkbox"
          onChange={(e) =>
            setForm({
              ...form,
              openToRelocate:
                e.target.checked,
            })
          }
        />{" "}
        Disponible para relocalizarme
      </label>

      <label className="block">
        <input
          type="checkbox"
          onChange={(e) =>
            setForm({
              ...form,
              openToShiftWork:
                e.target.checked,
            })
          }
        />{" "}
        Disponible para trabajo rotativo
      </label>

      <button className="bg-black text-white px-4 py-2">
        Guardar Perfil
      </button>
    </form>
  );
}