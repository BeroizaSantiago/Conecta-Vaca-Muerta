import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import TalentForm from "./TalentForm";
import CompanyForm from "./CompanyForm";
import TalentSkillsForm from "./TalentSkillsForm";
import UploadCvForm from "./UploadCvForm";

export default async function ProfilePage() {
  const session =
    await getServerSession(
      authOptions
    );

  if (!session) {
    redirect("/login");
  }

  const role =
    session.user?.role;

  let talentProfile =
    null;

  if (
    role === "talent"
  ) {
    talentProfile =
      await prisma.talentProfile.findUnique(
        {
          where: {
            userId:
              session.user.id,
          },
        }
      );
  }

  return (
    <main className="max-w-2xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">
        Mi Perfil
      </h1>

      {role === "talent" && (
        <>
          <TalentForm />
          <TalentSkillsForm />

          <UploadCvForm
            initialUrl={
              talentProfile?.cvFileUrl ||
              ""
            }
          />
        </>
      )}

      {role === "company" && (
        <CompanyForm />
      )}

      {role === "admin" && (
        <p>
          Panel administrador
        </p>
      )}
    </main>
  );
}