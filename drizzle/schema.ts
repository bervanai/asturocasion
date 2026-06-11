import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const fuelEnum = pgEnum("fuel_type", ["Gasolina", "Diésel", "Híbrido", "Eléctrico", "GLP"]);
export const transmissionEnum = pgEnum("transmission_type", ["Manual", "Automático"]);
export const vehicleStatusEnum = pgEnum("vehicle_status", ["Disponible", "Reservado", "Vendido"]);
export const leadTypeEnum = pgEnum("lead_type", ["Contacto", "Tasación", "Financiación"]);
export const leadStatusEnum = pgEnum("lead_status", ["Nuevo", "En Proceso", "Completado", "Descartado"]);

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("login_method", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Vehicles ────────────────────────────────────────────────────────────────

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  brand: varchar("brand", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year").notNull(),
  price: integer("price").notNull(),
  km: integer("km").notNull(),
  fuel: fuelEnum("fuel").notNull().default("Gasolina"),
  transmission: transmissionEnum("transmission").notNull().default("Manual"),
  status: vehicleStatusEnum("status").notNull().default("Disponible"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = typeof vehicles.$inferInsert;

// ─── Leads ────────────────────────────────────────────────────────────────────

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  type: leadTypeEnum("type").notNull().default("Contacto"),
  vehicle: varchar("vehicle", { length: 200 }),
  message: text("message"),
  status: leadStatusEnum("status").notNull().default("Nuevo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
