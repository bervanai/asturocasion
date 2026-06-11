# Astur Ocasión — Concesionario Web + CRM

## Estructura

```
concesionario/
├── web/                 → Web pública (Next.js, puerto 3000)
├── crm/                 → Panel CRM (Next.js, puerto 3001)
└── supabase-schema.sql  → Schema completo de la base de datos
```

---

## 1. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta el contenido de `supabase-schema.sql`
3. Ve a **Authentication > Users** y crea un usuario admin para el CRM
4. Copia la **Project URL** y las **API Keys** desde **Project Settings > API**

---

## 2. Configurar variables de entorno

### Web (`web/.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### CRM (`crm/.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## 3. Instalar y arrancar

```bash
# Web
cd web && npm install && npm run dev

# CRM (otra terminal)
cd crm && npm install && npm run dev
```

- Web: http://localhost:3000
- CRM: http://localhost:3001

---

## 4. Deploy en Vercel

Sube `web/` y `crm/` como **dos proyectos separados** en Vercel:

1. `vercel import` o conecta el repo de GitHub
2. Selecciona la carpeta `web` → proyecto "concesionario-web"
3. Selecciona la carpeta `crm` → proyecto "concesionario-crm"
4. Añade las variables de entorno en cada proyecto

---

## Flujo de datos

```
Web (formulario contacto/tasación)
  → INSERT leads en Supabase
    → CRM muestra los leads en tiempo real
      → Admin cambia estado del lead (nuevo → contactado → cerrado)

CRM (añade vehículo)
  → INSERT vehicles en Supabase
    → Web muestra el vehículo en el catálogo al instante
```

---

## Páginas Web

| Ruta | Descripción |
|------|-------------|
| `/` | Homepage con vehículos destacados |
| `/catalogo` | Catálogo con filtros (marca, precio, combustible, cambio) |
| `/vehiculo/[id]` | Ficha detalle del vehículo + formulario de consulta |
| `/tasacion` | Formulario de tasación gratuita |
| `/contacto` | Formulario de contacto general |
| `/sobre-nosotros` | Página corporativa |

## Páginas CRM

| Ruta | Descripción |
|------|-------------|
| `/login` | Autenticación con Supabase Auth |
| `/` | Dashboard con estadísticas |
| `/vehiculos` | Listado + gestión de vehículos |
| `/vehiculos/nuevo` | Crear nuevo vehículo |
| `/vehiculos/[id]` | Editar / eliminar vehículo |
| `/leads` | Gestión de leads con filtros de estado |
