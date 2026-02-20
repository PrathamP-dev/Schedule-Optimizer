import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.projects.list.path, async (req, res) => {
    const allProjects = await storage.getProjects();
    res.json(allProjects);
  });

  app.post(api.projects.create.path, async (req, res) => {
    try {
      const input = api.projects.create.input.parse(req.body);
      const project = await storage.createProject(input);
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.delete(api.projects.delete.path, async (req, res) => {
    await storage.deleteProject(Number(req.params.id));
    res.status(204).send();
  });

  app.post(api.projects.generateSchedule.path, async (req, res) => {
    const allProjects = await storage.getProjects();
    
    // Reset existing schedule
    await storage.resetSchedule();
    
    // Job sequencing with deadlines algorithm
    // 1. Sort projects by descending revenue
    const sorted = [...allProjects].sort((a, b) => b.revenue - a.revenue);
    
    // 2. Track free slots (index 0 is Monday, index 4 is Friday)
    // We only schedule up to 5 days.
    const slots: (typeof sorted[0] | null)[] = [null, null, null, null, null];
    
    for (const project of sorted) {
      // Find a slot starting from its deadline down to Monday
      // Cap deadline to 5 for the work week
      const maxDay = Math.min(project.deadlineDays, 5);
      
      for (let j = maxDay - 1; j >= 0; j--) {
        if (slots[j] === null) {
          slots[j] = project;
          await storage.updateProjectSchedule(project.id, j + 1);
          break;
        }
      }
    }
    
    // Return updated projects list
    const scheduled = await storage.getProjects();
    res.json(scheduled);
  });

  // Seed database
  const existingProjects = await storage.getProjects();
  if (existingProjects.length === 0) {
    await storage.createProject({ title: "UI Redesign for TechCorp", deadlineDays: 2, revenue: 150000 });
    await storage.createProject({ title: "Backend API for ShopApp", deadlineDays: 4, revenue: 250000 });
    await storage.createProject({ title: "Testing Suite for FinTech", deadlineDays: 3, revenue: 95000 });
    await storage.createProject({ title: "Cloud Migration", deadlineDays: 5, revenue: 300000 });
    await storage.createProject({ title: "Mobile App MVP", deadlineDays: 2, revenue: 200000 });
    await storage.createProject({ title: "SEO Optimization", deadlineDays: 1, revenue: 50000 });
    await storage.createProject({ title: "Database Architecture", deadlineDays: 3, revenue: 120000 });
  }

  return httpServer;
}
