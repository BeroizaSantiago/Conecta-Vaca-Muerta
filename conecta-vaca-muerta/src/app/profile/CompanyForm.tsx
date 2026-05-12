"use client";

import { useEffect, useState } from "react";

/*
  Módulo: CompanyForm

  Función:
  Permite editar perfil empresa.
  Ahora carga datos existentes (edición real).
*/

type Rubro = {
  id: string;
  name: string;
};

export default function CompanyForm({
  initialData,
}: {
  initialData: any;
}) {
  const [rubros, setRubros] =
    useState<Rubro[]>([]);

  const [selected, setSelected] =
    useState<string[]>([]);

  const [form, setForm] =
    useState({
      companyName:
        initialData?.companyName ||
        "",
      description:
        initialData?.description ||
        "",
      contactEmail:
        initialData?.contactEmail ||
        "",
      contactPhone:
        initialData?.contactPhone ||
        "",
    });

  useEffect(() => {
    fetch("/api/rubros")
      .then((res) =>
        res.json()
      )
      .then((data) =>
        setRubros(data)
      );
  }, []);


  const toggleRubro = (
    id: string
  ) => {
    if (
      selected.includes(id)
    ) {
      setSelected(
        selected.filter(
          (x) => x !== id
        )
      );
    } else {
      setSelected([
        ...selected,
        id,
      ]);
    }
  };

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      const res =
        await fetch(
          "/api/profile/company",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              ...form,
              rubros:
                selected,
            }),
          }
        );

      const data =
        await res.json();

      alert(data.message);
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Nombre empresa
        </label>
        <input
          className="border p-2 w-full"
          value={form.companyName}
          onChange={(e) =>
            setForm({
              ...form,
              companyName: e.target.value,
            })
          }
        />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">
          Rubros
        </p>

        <div className="grid grid-cols-2 gap-2">
          {rubros.map((item) => (
            <label
              key={item.id}
              className="border p-2 rounded text-sm flex gap-2"
            >
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() => toggleRubro(item.id)}
              />
              {item.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Descripción
        </label>
        <textarea
          className="border p-2 w-full"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Email de contacto
        </label>
        <input
          className="border p-2 w-full"
          value={form.contactEmail}
          onChange={(e) =>
            setForm({
              ...form,
              contactEmail: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Teléfono
        </label>
        <input
          className="border p-2 w-full"
          value={form.contactPhone}
          onChange={(e) =>
            setForm({
              ...form,
              contactPhone: e.target.value,
            })
          }
        />
      </div>

      <button className="bg-black text-white px-4 py-2">
        Guardar Perfil Empresa
      </button>
    </form>
  );
}