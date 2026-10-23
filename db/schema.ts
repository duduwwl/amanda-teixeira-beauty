import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const appointments = sqliteTable("appointments", {
  id: text("id").primaryKey(), serviceSlug: text("service_slug").notNull(), serviceName: text("service_name").notNull(),
  customerName: text("customer_name").notNull(), whatsapp: text("whatsapp").notNull(), email: text("email"), notes: text("notes"),
  appointmentDate: text("appointment_date").notNull(), startTime: text("start_time").notNull(), endTime: text("end_time").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  status: text("status", { enum: ["pending", "confirmed", "completed", "cancelled", "no_show"] }).notNull().default("pending"),
  consentAt: text("consent_at").notNull(), createdAt: text("created_at").notNull(), updatedAt: text("updated_at").notNull(),
});

export const appointmentSlots = sqliteTable("appointment_slots", {
  id: integer("id").primaryKey({ autoIncrement: true }), appointmentId: text("appointment_id").notNull().references(() => appointments.id, { onDelete: "cascade" }), slotKey: text("slot_key").notNull(),
}, (table) => ({ slotKeyUnique: uniqueIndex("appointment_slots_slot_key_unique").on(table.slotKey) }));

export const serviceOverrides = sqliteTable("service_overrides", {
  slug: text("slug").primaryKey(), name: text("name").notNull(), short: text("short").notNull(), description: text("description").notNull(),
  durationMinutes: integer("duration_minutes").notNull(), priceLabel: text("price_label").notNull(), category: text("category").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true), sortOrder: integer("sort_order").notNull().default(0), updatedAt: text("updated_at").notNull(),
});

export const scheduleBlocks = sqliteTable("schedule_blocks", {
  id: text("id").primaryKey(), startAt: text("start_at").notNull(), endAt: text("end_at").notNull(), reason: text("reason"), createdAt: text("created_at").notNull(),
});
