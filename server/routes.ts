import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertSimulationSchema, insertSimulationStatsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time simulation data
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('WebSocket client connected');

    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket client disconnected');
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        // Handle different message types for real-time simulation updates
        broadcastToClients({ type: 'simulation_update', data: message });
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
  });

  function broadcastToClients(data: any) {
    const message = JSON.stringify(data);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Get public simulations
  app.get("/api/simulations/public", async (req, res) => {
    try {
      const simulations = await storage.getPublicSimulations();
      res.json(simulations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch public simulations" });
    }
  });

  // Get user simulations
  app.get("/api/simulations/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const simulations = await storage.getSimulationsByUser(userId);
      res.json(simulations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user simulations" });
    }
  });

  // Get specific simulation
  app.get("/api/simulations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid simulation ID" });
      }

      const simulation = await storage.getSimulation(id);
      if (!simulation) {
        return res.status(404).json({ message: "Simulation not found" });
      }

      res.json(simulation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch simulation" });
    }
  });

  // Create simulation
  app.post("/api/simulations", async (req, res) => {
    try {
      const validatedData = insertSimulationSchema.parse(req.body);
      const userId = req.body.userId; // In a real app, this would come from authentication
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const simulation = await storage.createSimulation({ ...validatedData, userId });
      res.status(201).json(simulation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid simulation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create simulation" });
    }
  });

  // Update simulation
  app.put("/api/simulations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid simulation ID" });
      }

      const validatedData = insertSimulationSchema.partial().parse(req.body);
      const simulation = await storage.updateSimulation(id, validatedData);
      
      if (!simulation) {
        return res.status(404).json({ message: "Simulation not found" });
      }

      res.json(simulation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid simulation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update simulation" });
    }
  });

  // Delete simulation
  app.delete("/api/simulations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid simulation ID" });
      }

      const deleted = await storage.deleteSimulation(id);
      if (!deleted) {
        return res.status(404).json({ message: "Simulation not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete simulation" });
    }
  });

  // Record simulation statistics
  app.post("/api/simulations/:id/stats", async (req, res) => {
    try {
      const simulationId = parseInt(req.params.id);
      if (isNaN(simulationId)) {
        return res.status(400).json({ message: "Invalid simulation ID" });
      }

      const validatedData = insertSimulationStatsSchema.parse({ ...req.body, simulationId });
      const stats = await storage.createSimulationStats(validatedData);
      
      // Broadcast stats to connected WebSocket clients
      broadcastToClients({ type: 'stats_update', data: stats });
      
      res.status(201).json(stats);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid stats data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to record simulation stats" });
    }
  });

  // Get simulation statistics
  app.get("/api/simulations/:id/stats", async (req, res) => {
    try {
      const simulationId = parseInt(req.params.id);
      if (isNaN(simulationId)) {
        return res.status(400).json({ message: "Invalid simulation ID" });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const stats = await storage.getSimulationStats(simulationId, limit);
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch simulation statistics" });
    }
  });

  return httpServer;
}
