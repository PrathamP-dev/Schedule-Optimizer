import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  deadlineDays: integer("deadline_days").notNull(), // Number of days to complete
  revenue: integer("revenue").notNull(), // Revenue in INR
  scheduledDay: integer("scheduled_day"), // 1: Monday, 2: Tuesday ... 5: Friday. Null if not scheduled
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  deadlineDays: true,
  revenue: true,
}).extend({
  deadlineDays: z.number().min(1, "Deadline must be at least 1 day").max(5, "Max deadline for a week is 5 days"),
  revenue: z.number().min(0, "Revenue must be positive"),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type CreateProjectRequest = InsertProject;
export type ProjectResponse = Project;
export type ProjectsListResponse = Project[];
