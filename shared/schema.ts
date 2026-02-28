import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const ngos = pgTable("ngos", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  description: text("description").notNull(),
});

export const rescueCases = pgTable("rescue_cases", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("reported"), // reported, in-progress, resolved
  location: text("location").notNull(),
  imageUrl: text("image_url"),
  reportedAt: timestamp("reported_at").defaultNow(),
});

export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  species: text("species").notNull(),
  breed: text("breed"),
  age: text("age"),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  status: text("status").notNull().default("available"), // available, adopted
});

export const diseaseScans = pgTable("disease_scans", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  result: text("result").notNull(),
  notes: text("notes"),
  scannedAt: timestamp("scanned_at").defaultNow(),
});

export const insertNgoSchema = createInsertSchema(ngos).omit({ id: true });
export const insertRescueCaseSchema = createInsertSchema(rescueCases).omit({ id: true, reportedAt: true });
export const insertPetSchema = createInsertSchema(pets).omit({ id: true });
export const insertDiseaseScanSchema = createInsertSchema(diseaseScans).omit({ id: true, scannedAt: true });

export type Ngo = typeof ngos.$inferSelect;
export type InsertNgo = z.infer<typeof insertNgoSchema>;

export type RescueCase = typeof rescueCases.$inferSelect;
export type InsertRescueCase = z.infer<typeof insertRescueCaseSchema>;
export type UpdateRescueCase = Partial<InsertRescueCase>;

export type Pet = typeof pets.$inferSelect;
export type InsertPet = z.infer<typeof insertPetSchema>;
export type UpdatePet = Partial<InsertPet>;

export type DiseaseScan = typeof diseaseScans.$inferSelect;
export type InsertDiseaseScan = z.infer<typeof insertDiseaseScanSchema>;