import { PrismaClient } from "@prisma/client";

const prisma =
  new PrismaClient();

function slugify(
  text: string
) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

async function main() {
  const items = [
    "Industria",
    "Educación",
    "Análisis",
    "Tecnología",
    "Mercado Laboral",
    "Inversiones",
    "Oil & Gas",
    "Minería",
    "Logística",
    "Sustentabilidad",
  ];

  for (const name of items) {
    await prisma.contentCategory.upsert(
      {
        where: {
          slug:
            slugify(name),
        },
        update: {},
        create: {
          name,
          slug:
            slugify(name),
        },
      }
    );
  }

  console.log(
    "Magazine categorías OK"
  );
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });