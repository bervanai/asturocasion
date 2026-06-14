-- ================================================================
-- ASTUR OCASIÓN — SQL completo para Supabase
-- ================================================================
-- Instrucciones:
-- 1. Ve a supabase.com → tu proyecto → SQL Editor → New query
-- 2. Pega TODO este contenido y pulsa RUN
-- ================================================================

-- ─── 1. Limpiar si existe (útil para reinstalar) ──────────────

DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS lead_status CASCADE;
DROP TYPE IF EXISTS lead_type CASCADE;
DROP TYPE IF EXISTS vehicle_status CASCADE;
DROP TYPE IF EXISTS transmission_type CASCADE;
DROP TYPE IF EXISTS fuel_type CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- ─── 2. Enums ─────────────────────────────────────────────────

CREATE TYPE user_role        AS ENUM ('user', 'admin');
CREATE TYPE fuel_type        AS ENUM ('Gasolina', 'Diésel', 'Híbrido', 'Eléctrico', 'GLP');
CREATE TYPE transmission_type AS ENUM ('Manual', 'Automático');
CREATE TYPE vehicle_status   AS ENUM ('Disponible', 'Reservado', 'Vendido');
CREATE TYPE lead_type        AS ENUM ('Contacto', 'Tasación', 'Financiación');
CREATE TYPE lead_status      AS ENUM ('Nuevo', 'En Proceso', 'Completado', 'Descartado');

-- ─── 3. Tabla: users ──────────────────────────────────────────

CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  open_id         VARCHAR(64)  NOT NULL UNIQUE,
  name            TEXT,
  email           VARCHAR(320),
  login_method    VARCHAR(64),
  role            user_role    NOT NULL DEFAULT 'user',
  created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
  last_signed_in  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ─── 4. Tabla: vehicles ───────────────────────────────────────

CREATE TABLE vehicles (
  id           SERIAL PRIMARY KEY,
  brand        VARCHAR(100)      NOT NULL,
  model        VARCHAR(100)      NOT NULL,
  year         INTEGER           NOT NULL,
  price        INTEGER           NOT NULL,   -- en euros
  km           INTEGER           NOT NULL,
  fuel         fuel_type         NOT NULL DEFAULT 'Gasolina',
  transmission transmission_type NOT NULL DEFAULT 'Manual',
  status       vehicle_status    NOT NULL DEFAULT 'Disponible',
  description  TEXT,
  created_at   TIMESTAMP         NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP         NOT NULL DEFAULT NOW()
);

-- ─── 5. Tabla: leads ─────────────────────────────────────────

CREATE TABLE leads (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(200) NOT NULL,
  email      VARCHAR(320) NOT NULL,
  phone      VARCHAR(20)  NOT NULL,
  type       lead_type    NOT NULL DEFAULT 'Contacto',
  vehicle    VARCHAR(200),             -- nombre del vehículo de interés
  message    TEXT,
  status     lead_status  NOT NULL DEFAULT 'Nuevo',
  created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ─── 6. Índices ───────────────────────────────────────────────

CREATE INDEX idx_vehicles_status  ON vehicles(status);
CREATE INDEX idx_vehicles_created ON vehicles(created_at DESC);
CREATE INDEX idx_leads_status     ON leads(status);
CREATE INDEX idx_leads_created    ON leads(created_at DESC);
CREATE INDEX idx_users_open_id    ON users(open_id);

-- ─── 7. Trigger updated_at automático ────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── 8. Verificación ─────────────────────────────────────────

SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns
   WHERE table_name = t.table_name AND table_schema = 'public') AS columnas
FROM information_schema.tables t
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;
