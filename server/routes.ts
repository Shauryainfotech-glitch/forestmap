import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertOfficerSchema, 
  insertForestRangeSchema, 
  insertFireAlertSchema, 
  insertPlantationRecordSchema, 
  insertPermitSchema, 
  insertForestStatsSchema, 
  insertVision2047ProgressSchema, 
  insertOfficerPerformanceSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Officers routes
  app.get("/api/officers", async (req, res) => {
    try {
      const officers = await storage.getOfficers();
      res.json(officers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch officers" });
    }
  });

  app.get("/api/officers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const officer = await storage.getOfficer(id);
      if (!officer) {
        return res.status(404).json({ error: "Officer not found" });
      }
      res.json(officer);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch officer" });
    }
  });

  app.post("/api/officers", async (req, res) => {
    try {
      const validatedData = insertOfficerSchema.parse(req.body);
      const officer = await storage.createOfficer(validatedData);
      res.status(201).json(officer);
    } catch (error) {
      res.status(400).json({ error: "Invalid officer data" });
    }
  });

  app.put("/api/officers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertOfficerSchema.partial().parse(req.body);
      const officer = await storage.updateOfficer(id, validatedData);
      if (!officer) {
        return res.status(404).json({ error: "Officer not found" });
      }
      res.json(officer);
    } catch (error) {
      res.status(400).json({ error: "Invalid officer data" });
    }
  });

  // Forest Ranges routes
  app.get("/api/forest-ranges", async (req, res) => {
    try {
      const ranges = await storage.getForestRanges();
      res.json(ranges);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forest ranges" });
    }
  });

  app.get("/api/forest-ranges/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const range = await storage.getForestRange(id);
      if (!range) {
        return res.status(404).json({ error: "Forest range not found" });
      }
      res.json(range);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forest range" });
    }
  });

  app.post("/api/forest-ranges", async (req, res) => {
    try {
      const validatedData = insertForestRangeSchema.parse(req.body);
      const range = await storage.createForestRange(validatedData);
      res.status(201).json(range);
    } catch (error) {
      res.status(400).json({ error: "Invalid forest range data" });
    }
  });

  // Fire Alerts routes
  app.get("/api/fire-alerts", async (req, res) => {
    try {
      const alerts = await storage.getFireAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fire alerts" });
    }
  });

  app.get("/api/fire-alerts/active", async (req, res) => {
    try {
      const alerts = await storage.getActiveFireAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active fire alerts" });
    }
  });

  app.post("/api/fire-alerts", async (req, res) => {
    try {
      const validatedData = insertFireAlertSchema.parse(req.body);
      const alert = await storage.createFireAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      res.status(400).json({ error: "Invalid fire alert data" });
    }
  });

  app.put("/api/fire-alerts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertFireAlertSchema.partial().parse(req.body);
      const alert = await storage.updateFireAlert(id, validatedData);
      if (!alert) {
        return res.status(404).json({ error: "Fire alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(400).json({ error: "Invalid fire alert data" });
    }
  });

  // Plantation Records routes
  app.get("/api/plantation-records", async (req, res) => {
    try {
      const records = await storage.getPlantationRecords();
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plantation records" });
    }
  });

  app.get("/api/plantation-records/range/:rangeId", async (req, res) => {
    try {
      const rangeId = parseInt(req.params.rangeId);
      const records = await storage.getPlantationRecordsByRange(rangeId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plantation records for range" });
    }
  });

  app.post("/api/plantation-records", async (req, res) => {
    try {
      const validatedData = insertPlantationRecordSchema.parse(req.body);
      const record = await storage.createPlantationRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ error: "Invalid plantation record data" });
    }
  });

  // Permits routes
  app.get("/api/permits", async (req, res) => {
    try {
      const permits = await storage.getPermits();
      res.json(permits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch permits" });
    }
  });

  app.get("/api/permits/status/:status", async (req, res) => {
    try {
      const status = req.params.status;
      const permits = await storage.getPermitsByStatus(status);
      res.json(permits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch permits by status" });
    }
  });

  app.post("/api/permits", async (req, res) => {
    try {
      const validatedData = insertPermitSchema.parse(req.body);
      const permit = await storage.createPermit(validatedData);
      res.status(201).json(permit);
    } catch (error) {
      res.status(400).json({ error: "Invalid permit data" });
    }
  });

  app.put("/api/permits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPermitSchema.partial().parse(req.body);
      const permit = await storage.updatePermit(id, validatedData);
      if (!permit) {
        return res.status(404).json({ error: "Permit not found" });
      }
      res.json(permit);
    } catch (error) {
      res.status(400).json({ error: "Invalid permit data" });
    }
  });

  // Forest Statistics routes
  app.get("/api/forest-stats", async (req, res) => {
    try {
      const stats = await storage.getForestStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forest statistics" });
    }
  });

  app.get("/api/forest-stats/range/:rangeId", async (req, res) => {
    try {
      const rangeId = parseInt(req.params.rangeId);
      const stats = await storage.getForestStatsByRange(rangeId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forest statistics for range" });
    }
  });

  app.post("/api/forest-stats", async (req, res) => {
    try {
      const validatedData = insertForestStatsSchema.parse(req.body);
      const stats = await storage.createForestStats(validatedData);
      res.status(201).json(stats);
    } catch (error) {
      res.status(400).json({ error: "Invalid forest statistics data" });
    }
  });

  // Vision 2047 Progress routes
  app.get("/api/vision-2047-progress", async (req, res) => {
    try {
      const progress = await storage.getVision2047Progress();
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Vision 2047 progress" });
    }
  });

  app.get("/api/vision-2047-progress/range/:rangeId", async (req, res) => {
    try {
      const rangeId = parseInt(req.params.rangeId);
      const progress = await storage.getVision2047ProgressByRange(rangeId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Vision 2047 progress for range" });
    }
  });

  app.post("/api/vision-2047-progress", async (req, res) => {
    try {
      const validatedData = insertVision2047ProgressSchema.parse(req.body);
      const progress = await storage.createVision2047Progress(validatedData);
      res.status(201).json(progress);
    } catch (error) {
      res.status(400).json({ error: "Invalid Vision 2047 progress data" });
    }
  });

  // Officer Performance routes
  app.get("/api/officer-performance", async (req, res) => {
    try {
      const performance = await storage.getOfficerPerformance();
      res.json(performance);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch officer performance" });
    }
  });

  app.get("/api/officer-performance/officer/:officerId", async (req, res) => {
    try {
      const officerId = parseInt(req.params.officerId);
      const performance = await storage.getOfficerPerformanceByOfficer(officerId);
      res.json(performance);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch officer performance" });
    }
  });

  app.post("/api/officer-performance", async (req, res) => {
    try {
      const validatedData = insertOfficerPerformanceSchema.parse(req.body);
      const performance = await storage.createOfficerPerformance(validatedData);
      res.status(201).json(performance);
    } catch (error) {
      res.status(400).json({ error: "Invalid officer performance data" });
    }
  });

  // Dashboard aggregated data route
  app.get("/api/dashboard-stats", async (req, res) => {
    try {
      const officers = await storage.getOfficers();
      const ranges = await storage.getForestRanges();
      const activeFireAlerts = await storage.getActiveFireAlerts();
      const allFireAlerts = await storage.getFireAlerts();
      const plantationRecords = await storage.getPlantationRecords();
      const forestStats = await storage.getForestStats();
      const permits = await storage.getPermits();

      // Calculate aggregated statistics
      const totalForestArea = forestStats.reduce((sum, stat) => sum + (stat.totalArea || 0), 0);
      const totalForestCover = forestStats.reduce((sum, stat) => sum + ((stat.totalArea || 0) * (stat.forestCoverPercentage || 0) / 100), 0);
      const forestCoverPercentage = totalForestArea > 0 ? (totalForestCover / totalForestArea) * 100 : 0;
      
      const totalSaplingsPlanted = plantationRecords.reduce((sum, record) => sum + record.saplingsPlanted, 0);
      const totalSurvivors = plantationRecords.reduce((sum, record) => sum + (record.survivalCount || 0), 0);
      const overallSurvivalRate = totalSaplingsPlanted > 0 ? (totalSurvivors / totalSaplingsPlanted) * 100 : 0;

      const thisYear = new Date().getFullYear();
      const fireIncidentsThisYear = allFireAlerts.filter(alert => 
        alert.detectedAt && new Date(alert.detectedAt).getFullYear() === thisYear
      ).length;

      const pendingPermits = permits.filter(permit => permit.status === 'pending').length;
      const approvedPermits = permits.filter(permit => permit.status === 'approved').length;

      res.json({
        forestCoverPercentage: Math.round(forestCoverPercentage * 100) / 100,
        totalRanges: ranges.length,
        activeOfficers: officers.filter(officer => officer.isActive).length,
        totalSaplingsPlanted,
        overallSurvivalRate: Math.round(overallSurvivalRate * 100) / 100,
        activeFireAlerts: activeFireAlerts.length,
        fireIncidentsThisYear,
        pendingPermits,
        approvedPermits,
        totalForestArea: Math.round(totalForestArea * 100) / 100,
        totalForestCover: Math.round(totalForestCover * 100) / 100
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
