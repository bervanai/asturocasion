# Guía de Configuración - Astur Ocasión

## 📋 Requisitos Previos

- Node.js 22.0 o superior
- pnpm 10.0 o superior
- MySQL 8.0+ o TiDB
- Git

## 🔧 Instalación Local

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/astur-ocasion.git
cd astur-ocasion
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Configurar Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
# Base de Datos
DATABASE_URL=mysql://usuario:contraseña@localhost:3306/astur_ocasion

# Autenticación
JWT_SECRET=tu-secreto-jwt-super-seguro-aqui

# OAuth (Manus)
VITE_APP_ID=tu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Información del Propietario
OWNER_NAME="Tu Nombre"
OWNER_OPEN_ID=tu-open-id

# APIs Internas (Manus)
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=tu-api-key
VITE_FRONTEND_FORGE_API_KEY=tu-frontend-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# Analytics (opcional)
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=tu-website-id
```

### 4. Configurar Base de Datos

#### Crear la Base de Datos

```bash
mysql -u root -p -e "CREATE DATABASE astur_ocasion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

#### Ejecutar Migraciones

```bash
# Generar migraciones desde el esquema
pnpm drizzle-kit generate

# Aplicar migraciones
pnpm drizzle-kit migrate
```

### 5. Iniciar Servidor de Desarrollo

```bash
# Terminal 1: Servidor backend
pnpm dev

# Terminal 2 (opcional): Compilar TypeScript en watch mode
pnpm check
```

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 🚀 Deployment

### Build para Producción

```bash
pnpm build
```

Esto genera:
- `dist/` - Aplicación frontend compilada
- `dist/index.js` - Servidor backend compilado

### Iniciar en Producción

```bash
NODE_ENV=production pnpm start
```

## 📊 Estructura de Base de Datos

### Tabla: users
```sql
- id (INT, PK, AUTO_INCREMENT)
- openId (VARCHAR, UNIQUE)
- name (TEXT)
- email (VARCHAR)
- loginMethod (VARCHAR)
- role (ENUM: 'user', 'admin')
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
- lastSignedIn (TIMESTAMP)
```

### Tabla: vehicles (Próxima a implementar)
```sql
- id (INT, PK, AUTO_INCREMENT)
- brand (VARCHAR)
- model (VARCHAR)
- year (INT)
- price (DECIMAL)
- km (INT)
- fuel (VARCHAR)
- transmission (VARCHAR)
- color (VARCHAR)
- description (TEXT)
- status (ENUM: 'available', 'sold', 'reserved')
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

### Tabla: leads (Próxima a implementar)
```sql
- id (INT, PK, AUTO_INCREMENT)
- type (ENUM: 'contact', 'trade_in', 'financing')
- name (VARCHAR)
- email (VARCHAR)
- phone (VARCHAR)
- vehicleId (INT, FK)
- message (TEXT)
- status (ENUM: 'new', 'in_progress', 'completed')
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

## 🧪 Testing

```bash
# Ejecutar tests una sola vez
pnpm test

# Ejecutar tests en modo watch
pnpm test:watch

# Generar reporte de cobertura
pnpm test:coverage
```

## 🔍 Verificación de Código

```bash
# Verificar tipos TypeScript
pnpm check

# Formatear código
pnpm format

# Linting (si está configurado)
pnpm lint
```

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Error: "Database connection failed"
- Verificar que MySQL está corriendo
- Verificar credenciales en `.env.local`
- Verificar que la base de datos existe

### Error: "Port 3000 already in use"
```bash
# Encontrar proceso en puerto 3000
lsof -i :3000

# Matar proceso
kill -9 <PID>
```

### Error: "OAuth callback failed"
- Verificar que VITE_APP_ID es correcto
- Verificar que OAUTH_SERVER_URL es accesible
- Verificar que el redirect URI está configurado en Manus

## 📚 Recursos Útiles

- [Documentación de Drizzle ORM](https://orm.drizzle.team/)
- [Documentación de tRPC](https://trpc.io/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/)
- [Documentación de React](https://react.dev/)

## 🔐 Seguridad

- Nunca commitar `.env` o `.env.local`
- Usar contraseñas fuertes para la base de datos
- Cambiar JWT_SECRET en producción
- Usar HTTPS en producción
- Validar todas las entradas de usuario
- Usar prepared statements (Drizzle ORM lo hace automáticamente)

## 📞 Soporte

Para problemas o preguntas:
1. Revisar logs en `.manus-logs/`
2. Verificar la consola del navegador (F12)
3. Contactar con el equipo de desarrollo

---

**Última actualización**: Junio 2026
