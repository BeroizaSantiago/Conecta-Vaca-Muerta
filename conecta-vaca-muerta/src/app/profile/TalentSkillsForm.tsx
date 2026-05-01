"use client";

import { useEffect, useState } from "react";

export default function TalentSkillsForm() {
  const [name, setName] =
    useState("");

  const [skills, setSkills] =
    useState<
      {
        id: string;
        name: string;
      }[]
    >([]);

  const loadSkills =
    async () => {
      const res = await fetch(
        "/api/profile/talent-skill"
      );

      const data =
        await res.json();

      setSkills(data.skills);
    };

  useEffect(() => {
    loadSkills();
  }, []);

  const saveSkill = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const res = await fetch(
      "/api/profile/talent-skill",
      {
        method: "POST",
        body: JSON.stringify({
          name,
        }),
      }
    );

    const data =
      await res.json();

    alert(data.message);

    setName("");

    loadSkills();
  };

  return (
    <div className="mt-8">
      <form
        onSubmit={saveSkill}
        className="space-y-4"
      >
        <h2 className="text-xl font-bold">
          Skills
        </h2>

        <input
          className="border p-2 w-full"
          placeholder="Ej: Soldadura TIG"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

        <button className="bg-black text-white px-4 py-2">
          Agregar Skill
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-2">
        {skills.map((item) => (
          <span
            key={item.id}
            className="border px-3 py-1 rounded"
          >
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}