"use client";

import { useState } from "react";

export default function CreateJobPage() {
  const [form, setForm] =
    useState({
      title: "",
      description: "",
      locationText: "",
      jobType:
        "full_time",
      salaryMin: "",
      salaryMax: "",
      skills: "",
      isRemote: false,
    });

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      const res =
        await fetch(
          "/api/jobs/create",
          {
            method: "POST",
            body: JSON.stringify(
              form
            ),
          }
        );

      const data =
        await res.json();

      alert(data.message);
    };

  return (
    <main className="max-w-2xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">
        Publicar Vacante
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >
        <input
          className="border p-2 w-full"
          placeholder="Título"
          onChange={(e) =>
            setForm({
              ...form,
              title:
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
          placeholder="Ubicación"
          onChange={(e) =>
            setForm({
              ...form,
              locationText:
                e.target.value,
            })
          }
        />

        <select
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              jobType:
                e.target.value,
            })
          }
        >
          <option value="full_time">
            Full Time
          </option>

          <option value="part_time">
            Part Time
          </option>

          <option value="contract">
            Contract
          </option>

          <option value="shift">
            Shift
          </option>
        </select>

        <input
          className="border p-2 w-full"
          placeholder="Salario mínimo"
          onChange={(e) =>
            setForm({
              ...form,
              salaryMin:
                e.target.value,
            })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Salario máximo"
          onChange={(e) =>
            setForm({
              ...form,
              salaryMax:
                e.target.value,
            })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Skills (separadas por coma)"
          onChange={(e) =>
            setForm({
              ...form,
              skills:
                e.target.value,
            })
          }
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={
              form.isRemote
            }
            onChange={(e) =>
              setForm({
                ...form,
                isRemote:
                  e.target
                    .checked,
              })
            }
          />

          Trabajo remoto
        </label>

        <button className="bg-black text-white px-4 py-2">
          Crear Vacante
        </button>
      </form>
    </main>
  );
}