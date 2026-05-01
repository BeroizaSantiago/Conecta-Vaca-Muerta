import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  if (session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const totalUsers = await prisma.user.count();

  const talents = await prisma.user.count({
    where: { role: "talent" },
  });

  const companies = await prisma.user.count({
    where: { role: "company" },
  });

  const jobs = await prisma.job.count();

  const applications =
    await prisma.application.count();

  return (
    <main className="max-w-6xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Panel Admin
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="border p-6 rounded">
          Usuarios: {totalUsers}
        </div>

        <div className="border p-6 rounded">
          Talents: {talents}
        </div>

        <div className="border p-6 rounded">
          Companies: {companies}
        </div>

        <div className="border p-6 rounded">
          Vacantes: {jobs}
        </div>

        <div className="border p-6 rounded col-span-2">
          Postulaciones: {applications}
        </div>
      </div>

      <div className="space-y-3">
  <a
    href="/admin/users"
    className="block border p-3 rounded"
  >
    Gestionar Usuarios
  </a>

  <a
    href="/admin/jobs"
    className="block border p-3 rounded"
  >
    Gestionar Vacantes
  </a>

  <a
    href="/admin/subscriptions"
    className="block border p-3 rounded"
  >
    Gestionar Subscripciones
  </a>

  <a
    href="/admin/magazine/new"
    className="block border p-3 rounded"
  >
    Publicar Magazine
  </a>

  <a
    href="/admin/magazine"
    className="block border p-3 rounded"
  >
    Gestionar Magazine
  </a>
</div>
    </main>
  );
}