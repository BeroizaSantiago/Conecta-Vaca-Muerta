import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  if (session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Usuarios
      </h1>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border p-4 rounded"
          >
            <p>{user.email}</p>
            <p>Rol: {user.role}</p>
            <p>
              {new Date(
                user.createdAt
              ).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}