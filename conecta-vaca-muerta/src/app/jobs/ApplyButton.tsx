"use client";

export default function ApplyButton({
  jobId,
}: {
  jobId: string;
}) {
  const handleApply = async () => {
    const res = await fetch(
      "/api/jobs/apply",
      {
        method: "POST",
        body: JSON.stringify({ jobId }),
      }
    );

    const data = await res.json();

    alert(data.message);
  };

  return (
    <button
      onClick={handleApply}
      className="bg-black text-white px-4 py-2"
    >
      Postularme
    </button>
  );
}