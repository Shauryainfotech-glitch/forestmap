import { 
  officers, 
  forestRanges, 
  fireAlerts, 
  plantationRecords, 
  permits, 
  forestStats, 
  vision2047Progress, 
  officerPerformance,
  type Officer, 
  type InsertOfficer, 
  type ForestRange, 
  type InsertForestRange, 
  type FireAlert, 
  type InsertFireAlert, 
  type PlantationRecord, 
  type InsertPlantationRecord, 
  type Permit, 
  type InsertPermit, 
  type ForestStats, 
  type InsertForestStats, 
  type Vision2047Progress, 
  type InsertVision2047Progress, 
  type OfficerPerformance, 
  type InsertOfficerPerformance 
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Officers
  getOfficers(): Promise<Officer[]>;
  getOfficer(id: number): Promise<Officer | undefined>;
  getOfficerByEmail(email: string): Promise<Officer | undefined>;
  createOfficer(officer: InsertOfficer): Promise<Officer>;
  updateOfficer(id: number, officer: Partial<InsertOfficer>): Promise<Officer | undefined>;

  // Forest Ranges
  getForestRanges(): Promise<ForestRange[]>;
  getForestRange(id: number): Promise<ForestRange | undefined>;
  createForestRange(range: InsertForestRange): Promise<ForestRange>;
  updateForestRange(id: number, range: Partial<InsertForestRange>): Promise<ForestRange | undefined>;

  // Fire Alerts
  getFireAlerts(): Promise<FireAlert[]>;
  getActiveFireAlerts(): Promise<FireAlert[]>;
  getFireAlert(id: number): Promise<FireAlert | undefined>;
  createFireAlert(alert: InsertFireAlert): Promise<FireAlert>;
  updateFireAlert(id: number, alert: Partial<InsertFireAlert>): Promise<FireAlert | undefined>;

  // Plantation Records
  getPlantationRecords(): Promise<PlantationRecord[]>;
  getPlantationRecordsByRange(rangeId: number): Promise<PlantationRecord[]>;
  createPlantationRecord(record: InsertPlantationRecord): Promise<PlantationRecord>;
  updatePlantationRecord(id: number, record: Partial<InsertPlantationRecord>): Promise<PlantationRecord | undefined>;

  // Permits
  getPermits(): Promise<Permit[]>;
  getPermitsByRange(rangeId: number): Promise<Permit[]>;
  getPermitsByStatus(status: string): Promise<Permit[]>;
  createPermit(permit: InsertPermit): Promise<Permit>;
  updatePermit(id: number, permit: Partial<InsertPermit>): Promise<Permit | undefined>;

  // Forest Statistics
  getForestStats(): Promise<ForestStats[]>;
  getForestStatsByRange(rangeId: number): Promise<ForestStats[]>;
  createForestStats(stats: InsertForestStats): Promise<ForestStats>;

  // Vision 2047 Progress
  getVision2047Progress(): Promise<Vision2047Progress[]>;
  getVision2047ProgressByRange(rangeId: number): Promise<Vision2047Progress[]>;
  createVision2047Progress(progress: InsertVision2047Progress): Promise<Vision2047Progress>;
  updateVision2047Progress(id: number, progress: Partial<InsertVision2047Progress>): Promise<Vision2047Progress | undefined>;

  // Officer Performance
  getOfficerPerformance(): Promise<OfficerPerformance[]>;
  getOfficerPerformanceByOfficer(officerId: number): Promise<OfficerPerformance[]>;
  createOfficerPerformance(performance: InsertOfficerPerformance): Promise<OfficerPerformance>;
}

export class MemStorage implements IStorage {
  private officers: Map<number, Officer>;
  private forestRanges: Map<number, ForestRange>;
  private fireAlerts: Map<number, FireAlert>;
  private plantationRecords: Map<number, PlantationRecord>;
  private permits: Map<number, Permit>;
  private forestStats: Map<number, ForestStats>;
  private vision2047Progress: Map<number, Vision2047Progress>;
  private officerPerformance: Map<number, OfficerPerformance>;
  
  private currentId: number;

  constructor() {
    this.officers = new Map();
    this.forestRanges = new Map();
    this.fireAlerts = new Map();
    this.plantationRecords = new Map();
    this.permits = new Map();
    this.forestStats = new Map();
    this.vision2047Progress = new Map();
    this.officerPerformance = new Map();
    this.currentId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create officers
    const dycfOfficer = await this.createOfficer({
      name: "श्री मिलद म्हैसकर",
      designation: "अपर मुख्य सचिव, वने विभाग",
      range: "Nashik East",
      email: "dycfnashikeast@mahaforest.gov.in",
      phone: "+91-253-2234567",
      whatsappNumber: "+91-9876543210",
      circle: "Nashik",
      headquarters: "Green New Hotel Forest Colony, Trimbak Road, Nashik-422002",
      techScore: 89.7
    });

    const rfoNashik = await this.createOfficer({
      name: "RFO Nashik",
      designation: "Range Forest Officer",
      range: "Nashik",
      email: "rfochandwad1@gmail.com",
      phone: "+91-253-2234568",
      whatsappNumber: "+91-9876543211",
      circle: "Nashik",
      techScore: 92.1
    });

    const rfoYeola = await this.createOfficer({
      name: "RFO Yeola",
      designation: "Range Forest Officer", 
      range: "Yeola",
      email: "rfoyeola@gmail.com",
      phone: "+91-253-2234569",
      whatsappNumber: "+91-9876543212",
      circle: "Nashik",
      techScore: 88.4
    });

    const rfoNandgaon = await this.createOfficer({
      name: "RFO Nandgaon",
      designation: "Range Forest Officer",
      range: "Nandgaon", 
      email: "rfonandt@gmail.com",
      phone: "+91-253-2234570",
      whatsappNumber: "+91-9876543213",
      circle: "Nashik",
      techScore: 76.8
    });

    // Create forest ranges
    const nashikRange = await this.createForestRange({
      name: "Nashik",
      circle: "Nashik",
      area: 1250.5,
      forestCover: 23.8,
      rfoId: rfoNashik.id,
      coordinates: { lat: 19.9975, lng: 73.7898 }
    });

    const yeolaRange = await this.createForestRange({
      name: "Yeola",
      circle: "Nashik", 
      area: 980.3,
      forestCover: 18.6,
      rfoId: rfoYeola.id,
      coordinates: { lat: 20.0426, lng: 74.4893 }
    });

    const nandgaonRange = await this.createForestRange({
      name: "Nandgaon",
      circle: "Nashik",
      area: 1105.7,
      forestCover: 25.2,
      rfoId: rfoNandgaon.id,
      coordinates: { lat: 20.0953, lng: 73.6528 }
    });

    // Create fire alerts
    await this.createFireAlert({
      rangeId: nashikRange.id,
      location: "Trimbak Forest Area - Grid A4",
      coordinates: { lat: 19.9331, lng: 73.5169 },
      severity: "medium",
      status: "active",
      alertedOfficers: [rfoNashik.id, dycfOfficer.id]
    });

    await this.createFireAlert({
      rangeId: yeolaRange.id,
      location: "Yeola Hills - Grid B7",
      coordinates: { lat: 20.0526, lng: 74.4993 },
      severity: "low",
      status: "investigating",
      alertedOfficers: [rfoYeola.id]
    });

    // Create plantation records
    await this.createPlantationRecord({
      rangeId: nashikRange.id,
      species: "Teak, Neem, Banyan",
      saplingsPlanted: 15000,
      survivalCount: 12750,
      survivalRate: 85.0,
      plantedDate: new Date('2024-06-15'),
      lastSurveyDate: new Date('2024-12-15'),
      coordinates: { lat: 19.9975, lng: 73.7898 }
    });

    await this.createPlantationRecord({
      rangeId: yeolaRange.id,
      species: "Mango, Jamun, Gulmohar", 
      saplingsPlanted: 12000,
      survivalCount: 9480,
      survivalRate: 79.0,
      plantedDate: new Date('2024-07-01'),
      lastSurveyDate: new Date('2024-12-01'),
      coordinates: { lat: 20.0426, lng: 74.4893 }
    });

    // Create permits
    await this.createPermit({
      type: "tree_cutting",
      applicantName: "Maharashtra Infrastructure Development Corporation",
      applicantContact: "contact@midc.gov.in",
      rangeId: nashikRange.id,
      status: "under_review",
      description: "Tree cutting permission for highway expansion project",
      fees: 25000.0
    });

    await this.createPermit({
      type: "research", 
      applicantName: "Dr. Arun Sharma",
      applicantContact: "arun.sharma@university.edu",
      rangeId: yeolaRange.id,
      status: "approved",
      description: "Biodiversity research on medicinal plants",
      fees: 1000.0,
      validityPeriod: 365
    });

    // Create forest statistics
    await this.createForestStats({
      rangeId: nashikRange.id,
      forestCoverPercentage: 23.8,
      totalArea: 1250.5,
      denseForestArea: 297.6,
      mediumForestArea: 402.2,
      openForestArea: 150.7,
      carbonSequestration: 1850.5,
      biodiversityIndex: 0.78
    });

    await this.createForestStats({
      rangeId: yeolaRange.id,
      forestCoverPercentage: 18.6,
      totalArea: 980.3,
      denseForestArea: 182.3,
      mediumForestArea: 245.1,
      openForestArea: 98.0,
      carbonSequestration: 1245.8,
      biodiversityIndex: 0.72
    });

    // Create Vision 2047 progress
    await this.createVision2047Progress({
      rangeId: nashikRange.id,
      targetYear: 2029,
      forestCoverTarget: 35.0,
      currentProgress: 23.8,
      initiativesCompleted: 12,
      totalInitiatives: 20,
      carbonCreditGenerated: 450.5,
      revenueGenerated: 1801800.0
    });

    // Create officer performance
    await this.createOfficerPerformance({
      officerId: rfoNashik.id,
      month: 12,
      year: 2024,
      transparencyScore: 94.2,
      efficiencyScore: 91.8,
      costEffectivenessScore: 89.5,
      humaneApproachScore: 96.1,
      overallScore: 92.9
    });
  }

  // Officers
  async getOfficers(): Promise<Officer[]> {
    return Array.from(this.officers.values());
  }

  async getOfficer(id: number): Promise<Officer | undefined> {
    return this.officers.get(id);
  }

  async getOfficerByEmail(email: string): Promise<Officer | undefined> {
    return Array.from(this.officers.values()).find(officer => officer.email === email);
  }

  async createOfficer(officer: InsertOfficer): Promise<Officer> {
    const id = this.currentId++;
    const newOfficer: Officer = {
      ...officer,
      id,
      createdAt: new Date()
    };
    this.officers.set(id, newOfficer);
    return newOfficer;
  }

  async updateOfficer(id: number, officer: Partial<InsertOfficer>): Promise<Officer | undefined> {
    const existing = this.officers.get(id);
    if (!existing) return undefined;
    
    const updated: Officer = { ...existing, ...officer };
    this.officers.set(id, updated);
    return updated;
  }

  // Forest Ranges
  async getForestRanges(): Promise<ForestRange[]> {
    return Array.from(this.forestRanges.values());
  }

  async getForestRange(id: number): Promise<ForestRange | undefined> {
    return this.forestRanges.get(id);
  }

  async createForestRange(range: InsertForestRange): Promise<ForestRange> {
    const id = this.currentId++;
    const newRange: ForestRange = { ...range, id };
    this.forestRanges.set(id, newRange);
    return newRange;
  }

  async updateForestRange(id: number, range: Partial<InsertForestRange>): Promise<ForestRange | undefined> {
    const existing = this.forestRanges.get(id);
    if (!existing) return undefined;
    
    const updated: ForestRange = { ...existing, ...range };
    this.forestRanges.set(id, updated);
    return updated;
  }

  // Fire Alerts
  async getFireAlerts(): Promise<FireAlert[]> {
    return Array.from(this.fireAlerts.values());
  }

  async getActiveFireAlerts(): Promise<FireAlert[]> {
    return Array.from(this.fireAlerts.values()).filter(alert => alert.status === 'active');
  }

  async getFireAlert(id: number): Promise<FireAlert | undefined> {
    return this.fireAlerts.get(id);
  }

  async createFireAlert(alert: InsertFireAlert): Promise<FireAlert> {
    const id = this.currentId++;
    const newAlert: FireAlert = { 
      ...alert, 
      id,
      detectedAt: new Date()
    };
    this.fireAlerts.set(id, newAlert);
    return newAlert;
  }

  async updateFireAlert(id: number, alert: Partial<InsertFireAlert>): Promise<FireAlert | undefined> {
    const existing = this.fireAlerts.get(id);
    if (!existing) return undefined;
    
    const updated: FireAlert = { ...existing, ...alert };
    this.fireAlerts.set(id, updated);
    return updated;
  }

  // Plantation Records
  async getPlantationRecords(): Promise<PlantationRecord[]> {
    return Array.from(this.plantationRecords.values());
  }

  async getPlantationRecordsByRange(rangeId: number): Promise<PlantationRecord[]> {
    return Array.from(this.plantationRecords.values()).filter(record => record.rangeId === rangeId);
  }

  async createPlantationRecord(record: InsertPlantationRecord): Promise<PlantationRecord> {
    const id = this.currentId++;
    const newRecord: PlantationRecord = { ...record, id };
    this.plantationRecords.set(id, newRecord);
    return newRecord;
  }

  async updatePlantationRecord(id: number, record: Partial<InsertPlantationRecord>): Promise<PlantationRecord | undefined> {
    const existing = this.plantationRecords.get(id);
    if (!existing) return undefined;
    
    const updated: PlantationRecord = { ...existing, ...record };
    this.plantationRecords.set(id, updated);
    return updated;
  }

  // Permits
  async getPermits(): Promise<Permit[]> {
    return Array.from(this.permits.values());
  }

  async getPermitsByRange(rangeId: number): Promise<Permit[]> {
    return Array.from(this.permits.values()).filter(permit => permit.rangeId === rangeId);
  }

  async getPermitsByStatus(status: string): Promise<Permit[]> {
    return Array.from(this.permits.values()).filter(permit => permit.status === status);
  }

  async createPermit(permit: InsertPermit): Promise<Permit> {
    const id = this.currentId++;
    const newPermit: Permit = { 
      ...permit, 
      id,
      appliedDate: new Date()
    };
    this.permits.set(id, newPermit);
    return newPermit;
  }

  async updatePermit(id: number, permit: Partial<InsertPermit>): Promise<Permit | undefined> {
    const existing = this.permits.get(id);
    if (!existing) return undefined;
    
    const updated: Permit = { ...existing, ...permit };
    this.permits.set(id, updated);
    return updated;
  }

  // Forest Statistics
  async getForestStats(): Promise<ForestStats[]> {
    return Array.from(this.forestStats.values());
  }

  async getForestStatsByRange(rangeId: number): Promise<ForestStats[]> {
    return Array.from(this.forestStats.values()).filter(stats => stats.rangeId === rangeId);
  }

  async createForestStats(stats: InsertForestStats): Promise<ForestStats> {
    const id = this.currentId++;
    const newStats: ForestStats = { 
      ...stats, 
      id,
      statDate: new Date()
    };
    this.forestStats.set(id, newStats);
    return newStats;
  }

  // Vision 2047 Progress
  async getVision2047Progress(): Promise<Vision2047Progress[]> {
    return Array.from(this.vision2047Progress.values());
  }

  async getVision2047ProgressByRange(rangeId: number): Promise<Vision2047Progress[]> {
    return Array.from(this.vision2047Progress.values()).filter(progress => progress.rangeId === rangeId);
  }

  async createVision2047Progress(progress: InsertVision2047Progress): Promise<Vision2047Progress> {
    const id = this.currentId++;
    const newProgress: Vision2047Progress = { 
      ...progress, 
      id,
      lastUpdated: new Date()
    };
    this.vision2047Progress.set(id, newProgress);
    return newProgress;
  }

  async updateVision2047Progress(id: number, progress: Partial<InsertVision2047Progress>): Promise<Vision2047Progress | undefined> {
    const existing = this.vision2047Progress.get(id);
    if (!existing) return undefined;
    
    const updated: Vision2047Progress = { ...existing, ...progress, lastUpdated: new Date() };
    this.vision2047Progress.set(id, updated);
    return updated;
  }

  // Officer Performance
  async getOfficerPerformance(): Promise<OfficerPerformance[]> {
    return Array.from(this.officerPerformance.values());
  }

  async getOfficerPerformanceByOfficer(officerId: number): Promise<OfficerPerformance[]> {
    return Array.from(this.officerPerformance.values()).filter(performance => performance.officerId === officerId);
  }

  async createOfficerPerformance(performance: InsertOfficerPerformance): Promise<OfficerPerformance> {
    const id = this.currentId++;
    const newPerformance: OfficerPerformance = { 
      ...performance, 
      id,
      createdAt: new Date()
    };
    this.officerPerformance.set(id, newPerformance);
    return newPerformance;
  }
}

// DatabaseStorage implementation
export class DatabaseStorage implements IStorage {
  private initialized = false;

  private async ensureInitialized() {
    if (this.initialized) return;
    
    // Check if database has data
    const existingOfficers = await db.select().from(officers).limit(1);
    if (existingOfficers.length === 0) {
      // Import and run seeding
      const { seedDatabase } = await import('./seed');
      await seedDatabase();
    }
    
    this.initialized = true;
  }
  async getOfficers(): Promise<Officer[]> {
    await this.ensureInitialized();
    return await db.select().from(officers);
  }

  async getOfficer(id: number): Promise<Officer | undefined> {
    const [officer] = await db.select().from(officers).where(eq(officers.id, id));
    return officer || undefined;
  }

  async getOfficerByEmail(email: string): Promise<Officer | undefined> {
    const [officer] = await db.select().from(officers).where(eq(officers.email, email));
    return officer || undefined;
  }

  async createOfficer(insertOfficer: InsertOfficer): Promise<Officer> {
    const [officer] = await db
      .insert(officers)
      .values(insertOfficer)
      .returning();
    return officer;
  }

  async updateOfficer(id: number, officer: Partial<InsertOfficer>): Promise<Officer | undefined> {
    const [updated] = await db
      .update(officers)
      .set(officer)
      .where(eq(officers.id, id))
      .returning();
    return updated || undefined;
  }

  async getForestRanges(): Promise<ForestRange[]> {
    return await db.select().from(forestRanges);
  }

  async getForestRange(id: number): Promise<ForestRange | undefined> {
    const [range] = await db.select().from(forestRanges).where(eq(forestRanges.id, id));
    return range || undefined;
  }

  async createForestRange(range: InsertForestRange): Promise<ForestRange> {
    const [newRange] = await db
      .insert(forestRanges)
      .values(range)
      .returning();
    return newRange;
  }

  async updateForestRange(id: number, range: Partial<InsertForestRange>): Promise<ForestRange | undefined> {
    const [updated] = await db
      .update(forestRanges)
      .set(range)
      .where(eq(forestRanges.id, id))
      .returning();
    return updated || undefined;
  }

  async getFireAlerts(): Promise<FireAlert[]> {
    return await db.select().from(fireAlerts);
  }

  async getActiveFireAlerts(): Promise<FireAlert[]> {
    return await db.select().from(fireAlerts).where(eq(fireAlerts.status, 'active'));
  }

  async getFireAlert(id: number): Promise<FireAlert | undefined> {
    const [alert] = await db.select().from(fireAlerts).where(eq(fireAlerts.id, id));
    return alert || undefined;
  }

  async createFireAlert(alert: InsertFireAlert): Promise<FireAlert> {
    const [newAlert] = await db
      .insert(fireAlerts)
      .values(alert)
      .returning();
    return newAlert;
  }

  async updateFireAlert(id: number, alert: Partial<InsertFireAlert>): Promise<FireAlert | undefined> {
    const [updated] = await db
      .update(fireAlerts)
      .set(alert)
      .where(eq(fireAlerts.id, id))
      .returning();
    return updated || undefined;
  }

  async getPlantationRecords(): Promise<PlantationRecord[]> {
    return await db.select().from(plantationRecords);
  }

  async getPlantationRecordsByRange(rangeId: number): Promise<PlantationRecord[]> {
    return await db.select().from(plantationRecords).where(eq(plantationRecords.rangeId, rangeId));
  }

  async createPlantationRecord(record: InsertPlantationRecord): Promise<PlantationRecord> {
    const [newRecord] = await db
      .insert(plantationRecords)
      .values(record)
      .returning();
    return newRecord;
  }

  async updatePlantationRecord(id: number, record: Partial<InsertPlantationRecord>): Promise<PlantationRecord | undefined> {
    const [updated] = await db
      .update(plantationRecords)
      .set(record)
      .where(eq(plantationRecords.id, id))
      .returning();
    return updated || undefined;
  }

  async getPermits(): Promise<Permit[]> {
    return await db.select().from(permits);
  }

  async getPermitsByRange(rangeId: number): Promise<Permit[]> {
    return await db.select().from(permits).where(eq(permits.rangeId, rangeId));
  }

  async getPermitsByStatus(status: string): Promise<Permit[]> {
    return await db.select().from(permits).where(eq(permits.status, status));
  }

  async createPermit(permit: InsertPermit): Promise<Permit> {
    const [newPermit] = await db
      .insert(permits)
      .values(permit)
      .returning();
    return newPermit;
  }

  async updatePermit(id: number, permit: Partial<InsertPermit>): Promise<Permit | undefined> {
    const [updated] = await db
      .update(permits)
      .set(permit)
      .where(eq(permits.id, id))
      .returning();
    return updated || undefined;
  }

  async getForestStats(): Promise<ForestStats[]> {
    return await db.select().from(forestStats);
  }

  async getForestStatsByRange(rangeId: number): Promise<ForestStats[]> {
    return await db.select().from(forestStats).where(eq(forestStats.rangeId, rangeId));
  }

  async createForestStats(stats: InsertForestStats): Promise<ForestStats> {
    const [newStats] = await db
      .insert(forestStats)
      .values(stats)
      .returning();
    return newStats;
  }

  async getVision2047Progress(): Promise<Vision2047Progress[]> {
    return await db.select().from(vision2047Progress);
  }

  async getVision2047ProgressByRange(rangeId: number): Promise<Vision2047Progress[]> {
    return await db.select().from(vision2047Progress).where(eq(vision2047Progress.rangeId, rangeId));
  }

  async createVision2047Progress(progress: InsertVision2047Progress): Promise<Vision2047Progress> {
    const [newProgress] = await db
      .insert(vision2047Progress)
      .values(progress)
      .returning();
    return newProgress;
  }

  async updateVision2047Progress(id: number, progress: Partial<InsertVision2047Progress>): Promise<Vision2047Progress | undefined> {
    const [updated] = await db
      .update(vision2047Progress)
      .set({ ...progress, lastUpdated: new Date() })
      .where(eq(vision2047Progress.id, id))
      .returning();
    return updated || undefined;
  }

  async getOfficerPerformance(): Promise<OfficerPerformance[]> {
    return await db.select().from(officerPerformance);
  }

  async getOfficerPerformanceByOfficer(officerId: number): Promise<OfficerPerformance[]> {
    return await db.select().from(officerPerformance).where(eq(officerPerformance.officerId, officerId));
  }

  async createOfficerPerformance(performance: InsertOfficerPerformance): Promise<OfficerPerformance> {
    const [newPerformance] = await db
      .insert(officerPerformance)
      .values(performance)
      .returning();
    return newPerformance;
  }
}

export const storage = new DatabaseStorage();
