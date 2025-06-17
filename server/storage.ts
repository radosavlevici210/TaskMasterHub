import { users, simulations, simulationStats, type User, type InsertUser, type Simulation, type InsertSimulation, type SimulationStats, type InsertSimulationStats } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Simulation methods
  getSimulation(id: number): Promise<Simulation | undefined>;
  getSimulationsByUser(userId: number): Promise<Simulation[]>;
  getPublicSimulations(): Promise<Simulation[]>;
  createSimulation(simulation: InsertSimulation & { userId: number }): Promise<Simulation>;
  updateSimulation(id: number, updates: Partial<InsertSimulation>): Promise<Simulation | undefined>;
  deleteSimulation(id: number): Promise<boolean>;
  
  // Statistics methods
  createSimulationStats(stats: InsertSimulationStats): Promise<SimulationStats>;
  getSimulationStats(simulationId: number, limit?: number): Promise<SimulationStats[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getSimulation(id: number): Promise<Simulation | undefined> {
    const [simulation] = await db.select().from(simulations).where(eq(simulations.id, id));
    return simulation || undefined;
  }

  async getSimulationsByUser(userId: number): Promise<Simulation[]> {
    return await db.select().from(simulations).where(eq(simulations.userId, userId)).orderBy(desc(simulations.updatedAt));
  }

  async getPublicSimulations(): Promise<Simulation[]> {
    return await db.select().from(simulations).where(eq(simulations.isPublic, true)).orderBy(desc(simulations.updatedAt));
  }

  async createSimulation(simulation: InsertSimulation & { userId: number }): Promise<Simulation> {
    const [newSimulation] = await db
      .insert(simulations)
      .values(simulation)
      .returning();
    return newSimulation;
  }

  async updateSimulation(id: number, updates: Partial<InsertSimulation>): Promise<Simulation | undefined> {
    const [updatedSimulation] = await db
      .update(simulations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(simulations.id, id))
      .returning();
    return updatedSimulation || undefined;
  }

  async deleteSimulation(id: number): Promise<boolean> {
    const result = await db.delete(simulations).where(eq(simulations.id, id));
    return result.rowCount > 0;
  }

  async createSimulationStats(stats: InsertSimulationStats): Promise<SimulationStats> {
    const [newStats] = await db
      .insert(simulationStats)
      .values(stats)
      .returning();
    return newStats;
  }

  async getSimulationStats(simulationId: number, limit: number = 100): Promise<SimulationStats[]> {
    return await db
      .select()
      .from(simulationStats)
      .where(eq(simulationStats.simulationId, simulationId))
      .orderBy(desc(simulationStats.timestamp))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
