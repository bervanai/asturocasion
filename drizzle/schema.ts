import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Vehicles ────────────────────────────────────────────────────────────────

export const vehicles = mysqlTable("vehicles", {
  id: int("id").autoincrement().primaryKey(),
  brand: varchar("brand", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: int("year").notNull(),
  price: int("price").notNull(),
  km: int("km").notNull(),
  fuel: mysqlEnum("fuel", ["Gasolina", "Diésel", "Híbrido", "Eléctrico", "GLP"])
    .notNull()
    .default("Gasolina"),
  transmission: mysqlEnum("transmission", ["Manual", "Automático"])
    .notNull()
    .default("Manual"),
  status: mysqlEnum("status", ["Disponible", "Reservado", "Vendido"])
    .notNull()
    .default("Disponible"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = typeof vehicles.$inferInsert;

// ─── Leads ────────────────────────────────────────────────────────────────────

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  type: mysqlEnum("type", ["Contacto", "Tasación", "Financiación"])
    .notNull()
    .default("Contacto"),
  vehicle: varchar("vehicle", { length: 200 }),
  message: text("message"),
  status: mysqlEnum("status", ["Nuevo", "En Proceso", "Completado", "Descartado"])
    .notNull()
    .default("Nuevo"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
