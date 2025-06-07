import { pgTable, text, serial, integer, boolean, timestamp, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Forest Officers
export const officers = pgTable("officers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  designation: text("designation").notNull(),
  range: text("range").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  whatsappNumber: text("whatsapp_number"),
  circle: text("circle").notNull(),
  headquarters: text("headquarters"),
  isActive: boolean("is_active").notNull().default(true),
  techScore: real("tech_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Forest Ranges
export const forestRanges = pgTable("forest_ranges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  circle: text("circle").notNull(),
  area: real("area").notNull(), // in sq km
  forestCover: real("forest_cover").notNull(), // percentage
  coordinates: json("coordinates"), // GeoJSON coordinates
  rfoId: integer("rfo_id").references(() => officers.id),
  headquarters: text("headquarters"),
  isActive: boolean("is_active").notNull().default(true),
});

// Fire Alerts
export const fireAlerts = pgTable("fire_alerts", {
  id: serial("id").primaryKey(),
  rangeId: integer("range_id").references(() => forestRanges.id).notNull(),
  location: text("location").notNull(),
  coordinates: json("coordinates"),
  severity: text("severity").notNull(), // low, medium, high
  status: text("status").notNull().default("active"), // active, resolved, investigating
  detectedAt: timestamp("detected_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  responseTime: integer("response_time"), // minutes
  alertedOfficers: json("alerted_officers"), // array of officer IDs
});

// Plantation Records
export const plantationRecords = pgTable("plantation_records", {
  id: serial("id").primaryKey(),
  rangeId: integer("range_id").references(() => forestRanges.id).notNull(),
  species: text("species").notNull(),
  saplingsPlanted: integer("saplings_planted").notNull(),
  survivalCount: integer("survival_count").default(0),
  survivalRate: real("survival_rate").default(0),
  plantedDate: timestamp("planted_date").notNull(),
  lastSurveyDate: timestamp("last_survey_date"),
  coordinates: json("coordinates"),
  notes: text("notes"),
});

// Digital Permits
export const permits = pgTable("permits", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // tree_cutting, forest_produce, wildlife_rescue, research
  applicantName: text("applicant_name").notNull(),
  applicantContact: text("applicant_contact").notNull(),
  rangeId: integer("range_id").references(() => forestRanges.id).notNull(),
  status: text("status").notNull().default("pending"), // pending, under_review, approved, rejected
  description: text("description").notNull(),
  documents: json("documents"), // array of document URLs
  appliedDate: timestamp("applied_date").defaultNow(),
  processedDate: timestamp("processed_date"),
  processedBy: integer("processed_by").references(() => officers.id),
  validityPeriod: integer("validity_period"), // days
  fees: real("fees").default(0),
});

// Forest Statistics
export const forestStats = pgTable("forest_stats", {
  id: serial("id").primaryKey(),
  rangeId: integer("range_id").references(() => forestRanges.id),
  statDate: timestamp("stat_date").defaultNow(),
  forestCoverPercentage: real("forest_cover_percentage").notNull(),
  totalArea: real("total_area").notNull(),
  denseForestArea: real("dense_forest_area").default(0),
  mediumForestArea: real("medium_forest_area").default(0),
  openForestArea: real("open_forest_area").default(0),
  carbonSequestration: real("carbon_sequestration").default(0), // tons
  biodiversityIndex: real("biodiversity_index").default(0),
});

// Vision 2047 Progress
export const vision2047Progress = pgTable("vision_2047_progress", {
  id: serial("id").primaryKey(),
  rangeId: integer("range_id").references(() => forestRanges.id),
  targetYear: integer("target_year").notNull(), // 2029, 2035, 2047
  forestCoverTarget: real("forest_cover_target").notNull(),
  currentProgress: real("current_progress").default(0),
  initiativesCompleted: integer("initiatives_completed").default(0),
  totalInitiatives: integer("total_initiatives").notNull(),
  carbonCreditGenerated: real("carbon_credit_generated").default(0),
  revenueGenerated: real("revenue_generated").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Officer Performance (TECH KRAs)
export const officerPerformance = pgTable("officer_performance", {
  id: serial("id").primaryKey(),
  officerId: integer("officer_id").references(() => officers.id).notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  transparencyScore: real("transparency_score").default(0),
  efficiencyScore: real("efficiency_score").default(0),
  costEffectivenessScore: real("cost_effectiveness_score").default(0),
  humaneApproachScore: real("humane_approach_score").default(0),
  overallScore: real("overall_score").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schemas
export const insertOfficerSchema = createInsertSchema(officers).omit({
  id: true,
  createdAt: true,
});

export const insertForestRangeSchema = createInsertSchema(forestRanges).omit({
  id: true,
});

export const insertFireAlertSchema = createInsertSchema(fireAlerts).omit({
  id: true,
  detectedAt: true,
});

export const insertPlantationRecordSchema = createInsertSchema(plantationRecords).omit({
  id: true,
});

export const insertPermitSchema = createInsertSchema(permits).omit({
  id: true,
  appliedDate: true,
});

export const insertForestStatsSchema = createInsertSchema(forestStats).omit({
  id: true,
  statDate: true,
});

export const insertVision2047ProgressSchema = createInsertSchema(vision2047Progress).omit({
  id: true,
  lastUpdated: true,
});

export const insertOfficerPerformanceSchema = createInsertSchema(officerPerformance).omit({
  id: true,
  createdAt: true,
});

// Types
export type Officer = typeof officers.$inferSelect;
export type InsertOfficer = z.infer<typeof insertOfficerSchema>;
export type ForestRange = typeof forestRanges.$inferSelect;
export type InsertForestRange = z.infer<typeof insertForestRangeSchema>;
export type FireAlert = typeof fireAlerts.$inferSelect;
export type InsertFireAlert = z.infer<typeof insertFireAlertSchema>;
export type PlantationRecord = typeof plantationRecords.$inferSelect;
export type InsertPlantationRecord = z.infer<typeof insertPlantationRecordSchema>;
export type Permit = typeof permits.$inferSelect;
export type InsertPermit = z.infer<typeof insertPermitSchema>;
export type ForestStats = typeof forestStats.$inferSelect;
export type InsertForestStats = z.infer<typeof insertForestStatsSchema>;
export type Vision2047Progress = typeof vision2047Progress.$inferSelect;
export type InsertVision2047Progress = z.infer<typeof insertVision2047ProgressSchema>;
export type OfficerPerformance = typeof officerPerformance.$inferSelect;
export type InsertOfficerPerformance = z.infer<typeof insertOfficerPerformanceSchema>;
