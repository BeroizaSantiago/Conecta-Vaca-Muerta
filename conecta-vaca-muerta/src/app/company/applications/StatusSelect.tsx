"use client";

export default function StatusSelect({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: string;
}) {
  const handleChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const status = e.target.value;

    const res = await fetch(
      "/api/applications/update-status",
      {
        method: "POST",
        body: JSON.stringify({
          applicationId,
          status,
        }),
      }
    );

    const data = await res.json();

    alert(data.message);
  };

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      className="border p-2 mt-3"
    >
      <option value="applied">Applied</option>
      <option value="reviewed">Reviewed</option>
      <option value="shortlisted">Shortlisted</option>
      <option value="interviewed">Interviewed</option>
      <option value="hired">Hired</option>
      <option value="rejected">Rejected</option>
      <option value="withdrawn">Withdrawn</option>
    </select>
  );
}