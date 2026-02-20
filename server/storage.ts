import { db } from "./db";
import {
  projects,
  type CreateProjectRequest,
  type ProjectResponse
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getProjects(): Promise<ProjectResponse[]>;
  getProject(id: number): Promise<ProjectResponse | undefined>;
  createProject(project: CreateProjectRequest): Promise<ProjectResponse>;
  deleteProject(id: number): Promise<void>;
  updateProjectSchedule(id: number, day: number | null): Promise<ProjectResponse>;
  resetSchedule(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getProjects(): Promise<ProjectResponse[]> {
    return await db.select().from(projects).orderBy(projects.id);
  }

  async getProject(id: number): Promise<ProjectResponse | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: CreateProjectRequest): Promise<ProjectResponse> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async updateProjectSchedule(id: number, day: number | null): Promise<ProjectResponse> {
    const [project] = await db.update(projects)
      .set({ scheduledDay: day })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async resetSchedule(): Promise<void> {
    await db.update(projects).set({ scheduledDay: null });
  }
}

export const storage = new DatabaseStorage();
