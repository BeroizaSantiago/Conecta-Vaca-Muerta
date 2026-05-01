"use client";

import { useEffect, useState } from "react";

type Rubro = {
  id: string;
  name: string;
};

export default function CompanyForm() {
  const [rubros, setRubros] =
    useState<Rubro[]>([]);

  const [selected, setSelected] =
    useState<string[]>([]);

  const [form, setForm] =
    useState({
      companyName: "",
      description: "",
      contactEmail: "",
      contactPhone: "",
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
            body: JSON.stringify(
              {
                ...form,
                rubros:
                  selected,
              }
            ),
          }
        );

      const data =
        await res.json();

      alert(data.message);
    };

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-4"
    >
      <input
        className="border p-2 w-full"
        placeholder="Nombre empresa"
        onChange={(e) =>
          setForm({
            ...form,
            companyName:
              e.target.value,
          })
        }
      />

      <div>
        <p className="font-semibold mb-2">
          Rubros
        </p>

        <div className="grid grid-cols-2 gap-2">
          {rubros.map(
            (item) => (
              <label
                key={
                  item.id
                }
                className="border p-2 rounded text-sm flex gap-2"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(
                    item.id
                  )}
                  onChange={() =>
                    toggleRubro(
                      item.id
                    )
                  }
                />

                {item.name}
              </label>
            )
          )}
        </div>
      </div>

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
        placeholder="Teléfono"
        onChange={(e) =>
          setForm({
            ...form,
            contactPhone:
              e.target.value,
          })
        }
      />

      <button className="bg-black text-white px-4 py-2">
        Guardar Perfil Empresa
      </button>
    </form>
  );
}