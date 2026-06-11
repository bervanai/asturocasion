import { and, desc, eq, ne, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertLead,
  InsertUser,
  InsertVehicle,
  leads,
  users,
  vehicles,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0] ?? undefined;
}

// ─── Vehicles ────────────────────────────────────────────────────────────────

export async function listVehicles(statusFilter?: string) {
  const db = await getDb();
  if (!db) return [];

  if (statusFilter && statusFilter !== "all") {
    return db
      .select()
      .from(vehicles)
      .where(eq(vehicles.status, statusFilter as "Disponible" | "Reservado" | "Vendido"))
      .orderBy(desc(vehicles.createdAt));
  }
  return db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
}

export async function getVehicleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
  return result[0] ?? undefined;
}

export async function createVehicle(data: Omit<InsertVehicle, "id">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(vehicles).values(data);
  return { id: (result as any).insertId as number };
}

export async function updateVehicle(id: number, data: Partial<InsertVehicle>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(vehicles).set(data).where(eq(vehicles.id, id));
}

export async function deleteVehicle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(vehicles).where(eq(vehicles.id, id));
}

export async function countVehicles() {
  const db = await getDb();
  if (!db) return { total: 0, available: 0, reserved: 0, sold: 0 };
  const [row] = await db
    .select({
      total: sql<number>`COUNT(*)`,
      available: sql<number>`SUM(CASE WHEN status = 'Disponible' THEN 1 ELSE 0 END)`,
      reserved: sql<number>`SUM(CASE WHEN status = 'Reservado' THEN 1 ELSE 0 END)`,
      sold: sql<number>`SUM(CASE WHEN status = 'Vendido' THEN 1 ELSE 0 END)`,
    })
    .from(vehicles);
  return {
    total: Number(row.total) || 0,
    available: Number(row.available) || 0,
    reserved: Number(row.reserved) || 0,
    sold: Number(row.sold) || 0,
  };
}

// ─── Leads ───────────────────────────────────────────────────────────────────

export async function listLeads(statusFilter?: string) {
  const db = await getDb();
  if (!db) return [];

  if (statusFilter && statusFilter !== "all") {
    return db
      .select()
      .from(leads)
      .where(eq(leads.status, statusFilter as "Nuevo" | "En Proceso" | "Completado" | "Descartado"))
      .orderBy(desc(leads.createdAt));
  }
  return db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function getLeadById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return result[0] ?? undefined;
}

export async function createLead(data: Omit<InsertLead, "id">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(leads).values(data);
  return { id: (result as any).insertId as number };
}

export async function updateLead(id: number, data: Partial<InsertLead>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(leads).set(data).where(eq(leads.id, id));
}

export async function deleteLead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(leads).where(eq(leads.id, id));
}

export async function countLeads() {
  const db = await getDb();
  if (!db) return { total: 0, new: 0, inProgress: 0, completed: 0 };
  const [row] = await db
    .select({
      total: sql<number>`COUNT(*)`,
      newLeads: sql<number>`SUM(CASE WHEN status = 'Nuevo' THEN 1 ELSE 0 END)`,
      inProgress: sql<number>`SUM(CASE WHEN status = 'En Proceso' THEN 1 ELSE 0 END)`,
      completed: sql<number>`SUM(CASE WHEN status = 'Completado' THEN 1 ELSE 0 END)`,
    })
    .from(leads);
  return {
    total: Number(row.total) || 0,
    new: Number(row.newLeads) || 0,
    inProgress: Number(row.inProgress) || 0,
    completed: Number(row.completed) || 0,
  };
}
