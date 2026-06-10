# Astur Ocasión - Plataforma Web y CRM

Plataforma web profesional para un concesionario de vehículos de ocasión ubicado en Oviedo, Asturias. Incluye sitio web público con catálogo de vehículos y panel CRM integrado para gestión de inventario y leads.

## 🚀 Características Principales

### Sitio Web Público

- **Página de Inicio**: Hero section llamativo con propuesta de valor, servicios destacados y últimos vehículos publicados
- **Catálogo de Vehículos**: Listado completo con filtros avanzados (marca, modelo, precio, combustible, cambio, kilómetros)
- **Ficha Detallada**: Información completa de cada vehículo con galería de fotos, descripción y características
- **Formulario de Tasación**: "Compramos tu coche" con recopilación de datos del vehículo y contacto del cliente
- **Página de Contacto**: Formulario de contacto, datos de ubicación, teléfono y mapa integrado
- **Sección Sobre Nosotros**: Propuesta de valor, ventajas competitivas y testimonios

### Panel de Administración (CRM)

- **Dashboard**: Resumen de estadísticas (vehículos, leads, clientes)
- **Gestión de Inventario**: Añadir, editar y eliminar vehículos con todos sus datos
- **Gestión de Leads**: Visualizar y hacer seguimiento de solicitudes (tasación, contacto, financiación)
- **Clasificación de Leads**: Organización por tipo y estado (Nuevo, En Proceso, Completado)
- **Detalles de Lead**: Panel lateral con información completa y opciones de contacto

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Librería UI moderna
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos utilitarios
- **Wouter** - Enrutamiento ligero
- **shadcn/ui** - Componentes UI profesionales
- **Lucide React** - Iconografía

### Backend
- **Express 4** - Servidor web
- **tRPC 11** - RPC type-safe
- **Drizzle ORM** - Gestión de base de datos
- **MySQL/TiDB** - Base de datos relacional

### Herramientas
- **Vite** - Bundler y dev server
- **pnpm** - Gestor de paquetes
- **Vitest** - Testing unitario
- **TypeScript** - Lenguaje tipado

## 📁 Estructura del Proyecto

```
astur-ocasion/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── pages/                  # Páginas públicas
│   │   │   ├── Home.tsx            # Página de inicio
│   │   │   ├── Catalog.tsx         # Catálogo de vehículos
│   │   │   ├── VehicleDetail.tsx   # Detalle de vehículo
│   │   │   ├── TradeIn.tsx         # Formulario de tasación
│   │   │   ├── Contact.tsx         # Página de contacto
│   │   │   ├── About.tsx           # Sobre nosotros
│   │   │   └── admin/              # Panel administrativo
│   │   │       ├── Dashboard.tsx   # Dashboard principal
│   │   │       ├── VehicleManagement.tsx
│   │   │       └── LeadManagement.tsx
│   │   ├── components/
│   │   │   ├── Navigation.tsx      # Barra de navegación
│   │   │   ├── Footer.tsx          # Pie de página
│   │   │   └── ui/                 # Componentes shadcn/ui
│   │   ├── App.tsx                 # Enrutamiento principal
│   │   └── index.css               # Estilos globales
│   └── index.html
├── server/                          # Backend Express
│   ├── routers.ts                  # Procedimientos tRPC
│   ├── db.ts                       # Helpers de base de datos
│   └── _core/                      # Lógica central
├── drizzle/
│   └── schema.ts                   # Esquema de base de datos
├── shared/                          # Código compartido
└── package.json
```

## 🎨 Diseño Visual

- **Paleta de Colores**: Elegante y profesional con azul primario y acentos dorados
- **Tipografía**: Google Fonts (Inter para cuerpo, fuentes serifadas para títulos)
- **Estética**: Minimalista y refinada, transmitiendo confianza y distinción
- **Responsivo**: Diseño mobile-first adaptado a todos los dispositivos

## 🔐 Autenticación y Seguridad

- **Manus OAuth**: Autenticación integrada con Manus
- **Roles**: Sistema de roles (admin/user) para control de acceso
- **Protección**: Procedimientos protegidos para operaciones administrativas

## 📊 Base de Datos

### Tablas Principales

- **users**: Información de usuarios y roles
- **vehicles**: Catálogo de vehículos (marca, modelo, año, precio, km, etc.)
- **vehicle_photos**: Fotos asociadas a vehículos
- **leads**: Solicitudes de clientes (tasación, contacto, financiación)
- **lead_tracking**: Historial de seguimiento de leads

## 🚀 Instalación y Desarrollo

### Requisitos Previos
- Node.js 22+
- pnpm 10+
- MySQL/TiDB

### Configuración

1. **Instalar dependencias**:
```bash
pnpm install
```

2. **Configurar variables de entorno** (ya están configuradas en Manus):
```
DATABASE_URL=mysql://...
JWT_SECRET=...
VITE_APP_ID=...
```

3. **Ejecutar migraciones de base de datos**:
```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

4. **Iniciar servidor de desarrollo**:
```bash
pnpm dev
```

5. **Acceder a la aplicación**:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 🧪 Testing

```bash
# Ejecutar tests
pnpm test

# Tests con watch
pnpm test:watch
```

## 📦 Build y Deployment

```bash
# Build para producción
pnpm build

# Iniciar servidor de producción
pnpm start
```

## 📝 Funcionalidades Implementadas

### Frontend
- ✅ Todas las páginas públicas
- ✅ Panel CRM completo
- ✅ Navegación responsive
- ✅ Formularios con validación
- ✅ Galería de fotos
- ✅ Mapa de ubicación (integrado)
- ✅ Diseño elegante y profesional

### Backend
- ⏳ Esquema de base de datos
- ⏳ Procedimientos tRPC para CRUD
- ⏳ Gestión de fotos
- ⏳ Notificaciones de leads

## 🔄 Próximos Pasos

1. Implementar procedimientos tRPC para gestión de vehículos
2. Crear tablas de base de datos
3. Integrar carga de fotos
4. Configurar notificaciones
5. Escribir tests unitarios
6. Optimizar rendimiento

## 👨‍💼 Información del Negocio

**Astur Ocasión del Automóvil**
- Ubicación: Oviedo, Asturias
- Teléfono: 984 180 450
- WhatsApp: 629 574 957
- Email: info@asturocasion.es
- Horario: Lunes a Viernes 10:00-13:30 / 16:00-20:00

## 📄 Licencia

Proyecto privado. Todos los derechos reservados.

## 🤝 Contribuciones

Este proyecto es privado. Para cambios, contacta con el propietario.

---

**Última actualización**: Junio 2026
**Versión**: 1.0.0 (MVP)
