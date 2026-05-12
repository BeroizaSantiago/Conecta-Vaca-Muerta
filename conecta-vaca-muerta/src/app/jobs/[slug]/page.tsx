import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import ApplyButton from "@/app/jobs/ApplyButton";

// Tipo de props que recibe la página (slug dinámico)
export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Esperamos params (clave en Next moderno)
  const { slug } = await params;
  // Obtenemos la sesión actual
  const session = await getServerSession(authOptions);

  // Buscamos el job por slug
  const job = await prisma.job.findUnique({
    where: {
      slug: slug,
    },
    include: {
      companyProfile: true, // Traemos datos de la empresa
      jobSkills: {
        include: {
          skill: true, // Traemos nombre de skills
        },
      },
    },
  });

  // Si no existe la vacante → redirigimos
  if (!job) {
    redirect("/jobs");
  }

  return (
    <main className="max-w-4xl mx-auto p-10 space-y-6">
      {/* Título */}
      <h1 className="text-3xl font-bold">
        {job.title}
      </h1>

      {/* Empresa */}
      <p className="text-gray-600">
        {job.companyProfile.companyName}
      </p>

      {/* Ubicación */}
      {job.locationText && (
        <p>Ubicación: {job.locationText}</p>
      )}

      {/* Tipo de trabajo */}
      <p>Tipo: {job.jobType}</p>

      {/* Modalidad */}
      {job.isRemote && (
        <p>Remoto disponible</p>
      )}

      {/* Salario */}
      {job.salaryMin && (
        <p>
          Salario:{" "}
          {job.salaryMin.toString()} -{" "}
          {job.salaryMax?.toString()}{" "}
          {job.currency}
        </p>
      )}

      {/* Descripción */}
      <div>
        <h2 className="font-semibold text-xl mb-2">
          Descripción
        </h2>

        <p>{job.description}</p>
      </div>

      {/* Skills requeridas */}
      <div>
        <h2 className="font-semibold text-xl mb-2">
          Skills requeridas
        </h2>

        <div className="flex flex-wrap gap-2">
          {job.jobSkills.map((js) => (
            <span
              key={`${js.jobId}-${js.skillId}`} // clave compuesta
              className="border px-2 py-1 rounded text-sm"
            >
              {js.skill.name}
            </span>
          ))}
        </div>
      </div>

      {/* Botón de postulación */}
      {session?.user?.role === "talent" && (
        <ApplyButton jobId={job.id} />
        )}
    </main>
  );
}