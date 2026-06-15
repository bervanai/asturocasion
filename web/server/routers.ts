import { z } from "zod";
import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import {
  countLeads,
  countVehicles,
  createLead,
  createVehicle,
  deleteLead,
  deleteVehicle,
  getLeadById,
  getVehicleById,
  listLeads,
  listVehicles,
  updateLead,
  updateVehicle,
} from "./db";

// ─── Vehicle Router ───────────────────────────────────────────────────────────

const vehicleRouter = router({
  list: publicProcedure
    .input(z.object({ status: z.string().optional() }).optional())
    .query(({ input }) => listVehicles(input?.status)),

  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ input }) => getVehicleById(input.id)),

  stats: adminProcedure.query(() => countVehicles()),

  create: adminProcedure
    .input(
      z.object({
        brand: z.string().min(1),
        model: z.string().min(1),
        year: z.number().int().min(1900).max(2100),
        price: z.string(),
        km: z.number().int().min(0),
        fuelType: z.enum(["Gasolina", "Diésel", "Híbrido", "Eléctrico", "GLP"]),
        transmission: z.enum(["Manual", "Automático"]),
        color: z.string().optional(),
        doors: z.number().int().optional(),
        powerCv: z.number().int().optional(),
        status: z.enum(["available", "reserved", "sold"]).optional(),
        description: z.string().optional(),
        features: z.array(z.string()).optional(),
        images: z.array(z.string()).optional(),
        isFeatured: z.boolean().optional(),
      })
    )
    .mutation(({ input }) => createVehicle(input)),

  update: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        brand: z.string().min(1).optional(),
        model: z.string().min(1).optional(),
        year: z.number().int().optional(),
        price: z.string().optional(),
        km: z.number().int().optional(),
        fuelType: z.enum(["Gasolina", "Diésel", "Híbrido", "Eléctrico", "GLP"]).optional(),
        transmission: z.enum(["Manual", "Automático"]).optional(),
        color: z.string().optional(),
        doors: z.number().int().optional(),
        powerCv: z.number().int().optional(),
        status: z.enum(["available", "reserved", "sold"]).optional(),
        description: z.string().optional(),
        features: z.array(z.string()).optional(),
        images: z.array(z.string()).optional(),
        isFeatured: z.boolean().optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updateVehicle(id, data);
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(({ input }) => deleteVehicle(input.id)),
});

// ─── Lead Router ──────────────────────────────────────────────────────────────

const leadRouter = router({
  list: adminProcedure
    .input(z.object({ status: z.string().optional() }).optional())
    .query(({ input }) => listLeads(input?.status)),

  byId: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ input }) => getLeadById(input.id)),

  stats: adminProcedure.query(() => countLeads()),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        type: z.enum(["Contacto", "Tasación", "Financiación"]).optional(),
        message: z.string().optional(),
        vehicleId: z.string().uuid().optional(),
      })
    )
    .mutation(({ input }) =>
      createLead({
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        type: input.type ?? "Contacto",
        message: input.message ?? null,
        vehicleId: input.vehicleId ?? null,
      })
    ),

  update: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        type: z.enum(["Contacto", "Tasación", "Financiación"]).optional(),
        message: z.string().optional(),
        status: z.enum(["Nuevo", "En Proceso", "Completado", "Descartado"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updateLead(id, data);
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(({ input }) => deleteLead(input.id)),
});

// ─── App Router ───────────────────────────────────────────────────────────────

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  vehicle: vehicleRouter,
  lead: leadRouter,
});

export type AppRouter = typeof appRouter;
