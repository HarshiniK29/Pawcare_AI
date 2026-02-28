import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  const existingNgos = await storage.getNgos();
  if (existingNgos.length === 0) {
    await storage.createNgo({
      name: "Paws & Hearts Foundation",
      address: "123 Rescue Way, CA",
      phone: "+1-555-0123",
      email: "hello@pawsandhearts.org",
      description: "Dedicated to rescuing and rehabilitating abandoned pets."
    });
    await storage.createNgo({
      name: "City Animal Shelter",
      address: "456 Downtown Ave, NY",
      phone: "+1-555-0456",
      email: "contact@cityanimalshelter.com",
      description: "Providing safe haven for homeless animals since 2005."
    });
  }

  const existingPets = await storage.getPets();
  if (existingPets.length === 0) {
    await storage.createPet({
      name: "Bella",
      species: "Dog",
      breed: "Labrador Retriever",
      age: "2 years",
      description: "Friendly, energetic, and loves to play fetch.",
      imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=500&q=80",
      status: "available"
    });
    await storage.createPet({
      name: "Oliver",
      species: "Cat",
      breed: "Domestic Shorthair",
      age: "6 months",
      description: "Curious and cuddly kitten looking for a forever home.",
      imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80",
      status: "available"
    });
  }

  const existingCases = await storage.getCases();
  if (existingCases.length === 0) {
    await storage.createCase({
      title: "Injured stray dog",
      description: "Found a dog with a limp on Main St.",
      status: "reported",
      location: "Main St. & 5th Ave",
      imageUrl: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=500&q=80"
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Call seed database
  seedDatabase().catch(console.error);

  // NGOs
  app.get(api.ngos.list.path, async (req, res) => {
    const ngos = await storage.getNgos();
    res.json(ngos);
  });
  
  app.post(api.ngos.create.path, async (req, res) => {
    try {
      const input = api.ngos.create.input.parse(req.body);
      const ngo = await storage.createNgo(input);
      res.status(201).json(ngo);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Cases
  app.get(api.cases.list.path, async (req, res) => {
    const cases = await storage.getCases();
    res.json(cases);
  });

  app.post(api.cases.create.path, async (req, res) => {
    try {
      const input = api.cases.create.input.parse(req.body);
      const rescueCase = await storage.createCase(input);
      res.status(201).json(rescueCase);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.cases.update.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const input = api.cases.update.input.parse(req.body);
      const rescueCase = await storage.updateCase(id, input);
      res.json(rescueCase);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Pets
  app.get(api.pets.list.path, async (req, res) => {
    const pets = await storage.getPets();
    res.json(pets);
  });

  app.post(api.pets.create.path, async (req, res) => {
    try {
      const input = api.pets.create.input.parse(req.body);
      const pet = await storage.createPet(input);
      res.status(201).json(pet);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.pets.update.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const input = api.pets.update.input.parse(req.body);
      const pet = await storage.updatePet(id, input);
      res.json(pet);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Scans
  app.get(api.scans.list.path, async (req, res) => {
    const scans = await storage.getScans();
    res.json(scans);
  });

  app.post(api.scans.create.path, async (req, res) => {
    try {
      const input = api.scans.create.input.parse(req.body);
      
      // Mocking AI disease detection result for MVP
      const mockResults = [
        "Healthy condition",
        "Mild dermatitis detected",
        "Signs of tick infestation",
        "Conjunctivitis spotted"
      ];
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      
      const scan = await storage.createScan({
        imageUrl: input.imageUrl,
        result: randomResult,
        notes: "Automated preliminary scan"
      });
      res.status(201).json(scan);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}