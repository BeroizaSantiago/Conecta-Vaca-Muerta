import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export async function GET() {
  const items = [
    "Oil & Gas",
    "Perforación",
    "Workover / Pulling",
    "Ingeniería",
    "Construcción",
    "Metalúrgica",
    "Soldadura",
    "Izaje",
    "Logística",
    "Transporte",
    "Mantenimiento Industrial",
    "Electricidad Industrial",
    "Instrumentación",
    "Automatización",
    "Seguridad e Higiene",
    "Salud Ocupacional",
    "Recursos Humanos",
    "Tecnología / Software",
    "Consultoría",
    "Servicios Generales",
    "Alquiler de Equipos",
    "Maquinaria Pesada",
    "Ambiental",
    "Capacitación",
    "Hotelería / Campamentos",
    "Gastronomía Industrial",
    "Limpieza Industrial",
    "Vialidad",
    "Laboratorio / Ensayos"
  ];

  for (const name of items) {
    await prisma.rubro.upsert({
      where: {
        slug: slugify(name),
      },
      update: {},
      create: {
        name,
        slug: slugify(name),
      },
    });
  }

  return NextResponse.json({
    message: "Rubros cargados correctamente",
    total: items.length,
  });
}