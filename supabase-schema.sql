-- =============================================
-- ASTUR OCASIÓN - Supabase Schema
-- =============================================

-- Tabla de vehículos
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  year integer not null,
  price numeric(10,2) not null,
  km integer not null default 0,
  fuel_type text not null check (fuel_type in ('Gasolina','Diésel','Híbrido','Eléctrico','GLP')),
  transmission text not null check (transmission in ('Manual','Automático')),
  color text,
  doors integer default 5,
  power_cv integer,
  description text,
  features text[],
  images text[],
  status text not null default 'available' check (status in ('available','reserved','sold')),
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabla de leads (contactos y tasaciones)
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('contact','valuation','vehicle_inquiry')),
  name text not null,
  email text not null,
  phone text,
  message text,
  vehicle_id uuid references vehicles(id) on delete set null,
  vehicle_info jsonb,   -- para tasaciones: marca, modelo, año, km del coche a tasar
  status text not null default 'new' check (status in ('new','contacted','closed')),
  notes text,
  created_at timestamptz default now()
);

-- RLS: vehículos son públicos para leer
alter table vehicles enable row level security;
create policy "Vehicles are publicly readable" on vehicles
  for select using (true);
create policy "Only authenticated can modify vehicles" on vehicles
  for all using (auth.role() = 'authenticated');

-- RLS: leads solo autenticados pueden leer, cualquiera puede insertar
alter table leads enable row level security;
create policy "Anyone can create leads" on leads
  for insert with check (true);
create policy "Only authenticated can read leads" on leads
  for select using (auth.role() = 'authenticated');
create policy "Only authenticated can update leads" on leads
  for update using (auth.role() = 'authenticated');

-- Trigger para updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger vehicles_updated_at
  before update on vehicles
  for each row execute function update_updated_at();

-- Datos de ejemplo
insert into vehicles (brand, model, year, price, km, fuel_type, transmission, color, doors, power_cv, description, is_featured, status) values
('Mercedes-Benz', 'GLE 250D', 2016, 26900, 276000, 'Diésel', 'Automático', 'Negro', 5, 204, 'Mercedes GLE en perfecto estado, revisiones al día.', true, 'available'),
('Mercedes-Benz', 'SLK 300', 2010, 18500, 145000, 'Gasolina', 'Automático', 'Plata', 2, 231, 'Descapotable en excelente estado.', true, 'available'),
('Peugeot', '3008 2.0HDI', 2014, 12900, 33000, 'Diésel', 'Manual', 'Blanco', 5, 150, 'Peugeot 3008 con muy bajos kilómetros.', true, 'available'),
('BMW', '320d', 2018, 20900, 98000, 'Diésel', 'Automático', 'Azul', 4, 190, 'BMW Serie 3 en perfecto estado.', false, 'available'),
('Audi', 'Q5 2.0TDI', 2017, 23500, 120000, 'Diésel', 'Automático', 'Gris', 5, 190, 'Audi Q5 con todos los extras.', true, 'available'),
('Volkswagen', 'Golf GTI', 2019, 21500, 65000, 'Gasolina', 'Manual', 'Rojo', 5, 245, 'Golf GTI sport edition.', false, 'available');
