import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import TalentForm from "./TalentForm";
import CompanyForm from "./CompanyForm";
import TalentSkillsForm from "./TalentSkillsForm";
import UploadCvForm from "./UploadCvForm";

/*
  Módulo: ProfilePage

  Función:
  Centraliza edición de perfil según rol.
  Ahora también muestra una vista previa del perfil (clave UX).
*/

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

  let talentProfile = null;
  let companyProfile = null;

  if (role === "talent") {
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

  if (role === "company") {
    companyProfile =
      await prisma.companyProfile.findUnique(
        {
          where: {
            userId:
              session.user.id,
          },
        }
      );
  }

  return (
    <main className="max-w-2xl mx-auto p-10 space-y-8">
      <h1 className="text-3xl font-bold">
        Mi Perfil
      </h1>

      {/* =========================
          VISTA EMPRESA
         ========================= */}
      {role === "company" &&
        companyProfile && (
          <div className="border p-5 rounded space-y-2">
            <h2 className="text-lg font-semibold">
              Vista del perfil
            </h2>

            <p className="text-xl font-bold">
              {
                companyProfile.companyName
              }
            </p>

            {companyProfile.description && (
              <p>
                {
                  companyProfile.description
                }
              </p>
            )}

            {companyProfile.contactEmail && (
              <p className="text-sm">
                Email:{" "}
                {
                  companyProfile.contactEmail
                }
              </p>
            )}

            {companyProfile.contactPhone && (
              <p className="text-sm">
                Tel:{" "}
                {
                  companyProfile.contactPhone
                }
              </p>
            )}
          </div>
        )}

      {/* =========================
          TALENT
         ========================= */}
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

      {/* =========================
          COMPANY FORM
         ========================= */}
      {role === "company" && (
  <CompanyForm initialData={companyProfile} />
)}

      {role === "admin" && (
        <p>
          Panel administrador
        </p>
      )}
    </main>
  );
}