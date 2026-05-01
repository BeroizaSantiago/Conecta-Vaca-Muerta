"use client";

import { useState } from "react";

export default function UploadCvForm({
  initialUrl,
}: {
  initialUrl: string;
}) {
  const [loading, setLoading] =
    useState(false);

  const [uploadedUrl, setUploadedUrl] =
    useState(initialUrl);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const form =
      e.currentTarget;

    const input =
      form.file as HTMLInputElement;

    if (!input.files?.[0]) return;

    const data =
      new FormData();

    data.append(
      "file",
      input.files[0]
    );

    setLoading(true);

    const res =
      await fetch(
        "/api/talent/upload-cv",
        {
          method: "POST",
          body: data,
        }
      );

    const json =
      await res.json();

    alert(json.message);

    if (json.url) {
      setUploadedUrl(
        json.url
      );
    }

    setLoading(false);
  }

  return (
    <div className="border p-5 rounded mt-6">
      <h2 className="text-xl font-bold mb-4">
        CV Profesional
      </h2>

      <form
        onSubmit={
          handleSubmit
        }
      >
        <input
          type="file"
          name="file"
          accept=".pdf"
          className="mb-4 block"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2"
        >
          {loading
            ? "Subiendo..."
            : "Subir CV"}
        </button>
      </form>

      {uploadedUrl && (
        <a
          href={uploadedUrl}
          target="_blank"
          className="block mt-4 underline"
        >
          Ver CV actual
        </a>
      )}
    </div>
  );
}