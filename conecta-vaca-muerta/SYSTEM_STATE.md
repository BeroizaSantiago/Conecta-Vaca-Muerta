# Estado del Sistema - Conecta Vaca Muerta

> Fecha de generación: 11 de mayo de 2026

## 1. Información General del Proyecto

| Campo | Valor |
|-------|-------|
| **Nombre** | conecta-vaca-muerta |
| **Versión** | 0.1.0 |
| **Framework** | Next.js 16.2.4 |
| **Base de datos** | PostgreSQL (Prisma ORM) |
| **Autenticación** | NextAuth.js 4.24.14 |

---

## 2. Tecnologías y Dependencias

### Dependencias Principales
- `next`: 16.2.4
- `react`: 19.2.4
- `react-dom`: 19.2.4
- `@prisma/client`: 6.19.3
- `prisma`: 6.19.3
- `next-auth`: 4.24.14
- `bcrypt`: 6.0.0

### Dependencias de Desarrollo
- `typescript`: ^5
- `tailwindcss`: ^4
- `eslint`: ^9
- `eslint-config-next`: 16.2.4

---

## 3. Modelos de Base de Datos (Schema Prisma)

### 3.1 Usuarios y Perfiles

| Modelo | Descripción |
|--------|-------------|
| **User** | Usuario principal con autenticación |
| **TalentProfile** | Perfil de talento/buscador de empleo |
| **CompanyProfile** | Perfil de empresa |
| **SponsorProfile** | Perfil de sponsor/publicista |

### 3.2 Gestión de Empleos

| Modelo | Descripción |
|--------|-------------|
| **Job** | Ofertas de trabajo |
| **Application** | Postulaciones a empleos |
| **JobSkill** | Habilidades requeridas para empleos |

### 3.3 Oportunidades de Negocio

| Modelo | Descripción |
|--------|-------------|
| **Opportunity** | Oportunidades (necesidades/ofertas) |
| **OpportunityResponse** | Respuestas a oportunidades |

### 3.4 Contenido y Suscripciones

| Modelo | Descripción |
|--------|-------------|
| **Subscription** | Suscripciones de planes |
| **IAMagazineContent** | Contenido del magazine |
| **ContentCategory** | Categorías de contenido |

### 3.5 Eventos y Registros

| Modelo | Descripción |
|--------|-------------|
| **Event** | Eventos del sistema |
| **EventRegistration** | Registros a eventos |

### 3.6 Catálogos

| Modelo | Descripción |
|--------|-------------|
| **Skill** | Habilidades técnicas |
| **Rubro** | Rubros/categorías empresariales |
| **CompanyRubro** | Relación empresa-rubro |

---

## 4. Enums y Estados

### 4.1 Roles de Usuario
```
talent | company | sponsor | investor | admin
```

### 4.2 Estados de Usuario
```
active | inactive | pending | suspended
```

### 4.3 Estados de Empleo
```
draft | open | closed | paused | expired
```

### 4.4 Tipos de Trabajo
```
full_time | part_time | temporary | contract | internship | shift
```

### 4.5 Estados de Postulación
```
applied | reviewed | shortlisted | interviewed | hired | rejected | withdrawn
```

### 4.6 Estados de Verificación de Empresa
```
unverified | pending | verified | rejected
```

### 4.7 Estados de Oportunidad
```
open | in_progress | closed | canceled
```

### 4.8 Estados de Suscripción
```
pending_payment | active | canceled | expired | trial
```

### 4.9 Tipos de Plan de Suscripción
```
recruiting | sponsorship | strategic
```

### 4.10 Estados de Contenido
```
draft | published | archived
```

### 4.11 Tipos de Contenido
```
article | video | interview | podcast
```

### 4.12 Visibilidad de Eventos
```
public | premium | private
```

### 4.13 Estados de Registro a Eventos
```
registered | attended | canceled | no_show
```

---

## 5. Rutas de API

### 5.1 Autenticación
- `/api/auth/[...nextauth]` - Rutas de autenticación NextAuth

### 5.2 Administración (Admin)
- `/api/admin/change-role/` - Cambiar rol de usuario
- `/api/admin/events` - Gestión de eventos
- `/api/admin/job-status/` - Estado de empleos
- `/api/admin/magazine` - Gestión de magazine
- `/api/admin/seed-rubros/` - Semilla de rubros
- `/api/admin/subscriptions` - Gestión de suscripciones

### 5.3 Perfiles
- `/api/profile/company` - Perfil de empresa
- `/api/profile/talent` - Perfil de talento
- `/api/profile/sponsor` - Perfil de sponsor
- `/api/profile/talent-skill/` - Habilidades de talento

### 5.3.1 Talento
- `/api/talent/upload-cv/` - Subir CV del talento

### 5.4 Empleos
- `/api/jobs/create` - Crear empleo
- `/api/jobs/apply/` - Postular a empleo
- `/api/jobs/` - Listar empleos

### 5.5 Empresas
- `/api/company/application-status/` - Estado de aplicaciones
- `/api/company/job-status/` - Estado de empleos
- `/api/company/opportunities/` - Oportunidades

### 5.6 Oportunidades
- `/api/opportunities/respond/` - Responder oportunidad
- `/api/opportunities/response-status/` - Estado de respuestas

### 5.7 Aplicaciones
- `/api/applications/update-status/` - Actualizar estado de postulación

### 5.8 Eventos
- `/api/events/register/` - Registrarse a evento

### 5.9 Suscripciones
- `/api/subscriptions/create` - Crear suscripción

### 5.10 Registro
- `/api/register` - Registro de usuarios

### 5.11 Rubros
- `/api/rubros` - Gestión de rubros

---

## 6. Páginas de la Aplicación

### 6.1 Públicas
- `/` - Página principal
- `/login` - Inicio de sesión
- `/register` - Registro
- `/jobs` - Lista de empleos
- `/events` - Lista de eventos
- `/events/[slug]` - Detalle de evento
- `/events/calendar` - Calendario de eventos
- `/opportunities` - Oportunidades
- `/opportunities/[id]` - Detalle de oportunidad
- `/magazine` - Magazine
- `/magazine/[slug]` - Artículo de magazine
- `/companies` - Lista de empresas
- `/companies/[id]` - Perfil de empresa
- `/pricing` - Planes y precios
- `/my-applications` - Mis postulaciones

### 6.2 Protegidas (Dashboard)
- `/dashboard` - Panel principal
- `/dashboard/applicants` - Postulantes
- `/dashboard/events` - Mis eventos
- `/profile` - Mi perfil

### 6.3 Administración
- `/admin` - Panel de admin
- `/admin/users` - Gestión de usuarios
- `/admin/jobs` - Gestión de empleos
- `/admin/events/new` - Crear evento
- `/admin/magazine` - Gestión de magazine
- `/admin/magazine/new` - Crear artículo
- `/admin/subscriptions` - Gestión de suscripciones

---

## 7. Middleware

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

**Función**: Proteger todas las rutas del dashboard con autenticación.

---

## 8. Migraciones de Base de Datos

| Migración | Descripción |
|-----------|-------------|
| `20260416162924_init` | Inicialización del schema |
| `20260417213433_add_jobs` | Agregar modelo de empleos |
| `20260417224409_add_applications` | Agregar modelo de postulaciones |

---

## 9. Configuración

### 9.1 TypeScript (tsconfig.json)
- Modo estricto habilitado
- Rutas absolutas configuradas

### 9.2 ESLint (eslint.config.mjs)
- Configuración para Next.js 16

### 9.3 Tailwind CSS (postcss.config.mjs)
- Versión 4.x configurada

### 9.4 Prisma (prisma.config.ts)
- Cliente PostgreSQL

---

## 10. Estado Actual

| Componente | Estado |
|------------|--------|
| **Prisma Client** | ✅ Generado |
| **Base de Datos** | ✅ Conectada (PostgreSQL) |
| **Autenticación** | ✅ Configurada (NextAuth) |
| **Middleware** | ✅ Activo |
| **Build** | ✅ Exitoso |

---

## 11. Notas

- El proyecto está en desarrollo activo
- Usa autenticación basada en NextAuth.js
- Los roles de usuario determinan el acceso a funcionalidades
- El sistema soporta múltiples tipos de usuarios: talentos, empresas, sponsors e inversores
- La plataforma está orientada al sector Vaca Muerta (energía, petróleo y gas)