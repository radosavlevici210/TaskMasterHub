import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const simulations = pgTable("simulations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  config: jsonb("config").notNull(),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const simulationStats = pgTable("simulation_stats", {
  id: serial("id").primaryKey(),
  simulationId: integer("simulation_id").references(() => simulations.id),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  particleCount: integer("particle_count").notNull(),
  totalEnergy: real("total_energy").notNull(),
  kineticEnergy: real("kinetic_energy").notNull(),
  potentialEnergy: real("potential_energy").notNull(),
  temperature: real("temperature").notNull(),
  entropy: real("entropy").notNull(),
  collisionsPerSec: integer("collisions_per_sec").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSimulationSchema = createInsertSchema(simulations).pick({
  name: true,
  description: true,
  config: true,
  isPublic: true,
});

export const insertSimulationStatsSchema = createInsertSchema(simulationStats).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSimulation = z.infer<typeof insertSimulationSchema>;
export type Simulation = typeof simulations.$inferSelect;
export type InsertSimulationStats = z.infer<typeof insertSimulationStatsSchema>;
export type SimulationStats = typeof simulationStats.$inferSelect;
