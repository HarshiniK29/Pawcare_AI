import { db } from "./db";
import {
  ngos,
  rescueCases,
  pets,
  diseaseScans,
  type Ngo,
  type InsertNgo,
  type RescueCase,
  type InsertRescueCase,
  type UpdateRescueCase,
  type Pet,
  type InsertPet,
  type UpdatePet,
  type DiseaseScan,
  type InsertDiseaseScan
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // NGOs
  getNgos(): Promise<Ngo[]>;
  createNgo(ngo: InsertNgo): Promise<Ngo>;

  // Cases
  getCases(): Promise<RescueCase[]>;
  createCase(rescueCase: InsertRescueCase): Promise<RescueCase>;
  updateCase(id: number, updates: UpdateRescueCase): Promise<RescueCase>;

  // Pets
  getPets(): Promise<Pet[]>;
  createPet(pet: InsertPet): Promise<Pet>;
  updatePet(id: number, updates: UpdatePet): Promise<Pet>;

  // Scans
  getScans(): Promise<DiseaseScan[]>;
  createScan(scan: InsertDiseaseScan): Promise<DiseaseScan>;
}

export class DatabaseStorage implements IStorage {
  async getNgos(): Promise<Ngo[]> {
    return await db.select().from(ngos);
  }
  async createNgo(ngo: InsertNgo): Promise<Ngo> {
    const [newNgo] = await db.insert(ngos).values(ngo).returning();
    return newNgo;
  }

  async getCases(): Promise<RescueCase[]> {
    return await db.select().from(rescueCases);
  }
  async createCase(rescueCase: InsertRescueCase): Promise<RescueCase> {
    const [newCase] = await db.insert(rescueCases).values(rescueCase).returning();
    return newCase;
  }
  async updateCase(id: number, updates: UpdateRescueCase): Promise<RescueCase> {
    const [updated] = await db.update(rescueCases).set(updates).where(eq(rescueCases.id, id)).returning();
    return updated;
  }

  async getPets(): Promise<Pet[]> {
    return await db.select().from(pets);
  }
  async createPet(pet: InsertPet): Promise<Pet> {
    const [newPet] = await db.insert(pets).values(pet).returning();
    return newPet;
  }
  async updatePet(id: number, updates: UpdatePet): Promise<Pet> {
    const [updated] = await db.update(pets).set(updates).where(eq(pets.id, id)).returning();
    return updated;
  }

  async getScans(): Promise<DiseaseScan[]> {
    return await db.select().from(diseaseScans);
  }
  async createScan(scan: InsertDiseaseScan): Promise<DiseaseScan> {
    const [newScan] = await db.insert(diseaseScans).values(scan).returning();
    return newScan;
  }
}

export const storage = new DatabaseStorage();