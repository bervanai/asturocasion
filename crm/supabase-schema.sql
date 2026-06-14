-- ============================================================
-- ASTUR OCASIÓN — Schema PostgreSQL para Supabase
-- Pega este SQL en Supabase > SQL Editor > New query
-- ============================================================

-- ─── Enums ───────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE fuel_type AS ENUM ('Gasolina', 'Diésel', 'Híbrido', 'Eléctrico', 'GLP');
CREATE TYPE transmission_type AS ENUM ('Manual', 'Automático');
CREATE TYPE vehicle_status AS ENUM ('Disponible', 'Reservado', 'Vendido');
CREATE TYPE lead_type AS ENUM ('Contacto', 'Tasación', 'Financiación');
CREATE TYPE lead_status AS ENUM ('Nuevo', 'En Proceso', 'Completado', 'Descartado');

-- ─── Tabla: users ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id              SERIAL PRIMARY KEY,
  open_id         VARCHAR(64) NOT NULL UNIQUE,
  name            TEXT,
  email           VARCHAR(320),
  login_method    VARCHAR(64),
  role            user_role NOT NULL DEFAULT 'user',
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  last_signed_in  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── Tabla: vehicles ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS vehicles (
  id           SERIAL PRIMARY KEY,
  brand        VARCHAR(100) NOT NULL,
  model        VARCHAR(100) NOT NULL,
  year         INTEGER NOT NULL,
  price        INTEGER NOT NULL,
  km           INTEGER NOT NULL,
  fuel         fuel_type NOT NULL DEFAULT 'Gasolina',
  transmission transmission_type NOT NULL DEFAULT 'Manual',
  status       vehicle_status NOT NULL DEFAULT 'Disponible',
  description  TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── Tabla: leads ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS leads (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(200) NOT NULL,
  email      VARCHAR(320) NOT NULL,
  phone      VARCHAR(20) NOT NULL,
  type       lead_type NOT NULL DEFAULT 'Contacto',
  vehicle    VARCHAR(200),
  message    TEXT,
  status     lead_status NOT NULL DEFAULT 'Nuevo',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── Índices ─────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_created ON vehicles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

-- ─── Trigger: updated_at automático ─────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_vehicles
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_leads
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── RLS: desactiva Row Level Security (uso desde backend) ───
-- Si accedes desde el backend con la service_role key, no necesitas RLS.
-- Si quisieras activarlo en el futuro, descomenta estas líneas:

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- ─── Verificación ────────────────────────────────────────────

SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
