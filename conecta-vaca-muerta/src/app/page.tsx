import { prisma } from "@/lib/prisma";

export default async function Home() {
  const totalUsers = await prisma.user.count();

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Conecta Vaca Muerta</h1>
      <p className="mt-4">Usuarios registrados: {totalUsers}</p>
    </main>
  );
}