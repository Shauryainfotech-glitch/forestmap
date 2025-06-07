import { db } from "./db";
import {
  officers,
  forestRanges,
  fireAlerts,
  plantationRecords,
  permits,
  forestStats,
  vision2047Progress,
  officerPerformance
} from "@shared/schema";

export async function seedDatabase() {
  try {
    console.log("Seeding database with sample data...");

    // Clear existing data
    await db.delete(officerPerformance);
    await db.delete(vision2047Progress);
    await db.delete(forestStats);
    await db.delete(permits);
    await db.delete(plantationRecords);
    await db.delete(fireAlerts);
    await db.delete(officers);
    await db.delete(forestRanges);

    // Seed Forest Ranges
    const forestRangeData = [
      {
        name: "Nashik",
        circle: "Nashik",
        area: 15000,
        forestCover: 12500,
        headquarters: "Nashik",
        isActive: true,
        coordinates: null,
        rfoId: null
      },
      {
        name: "Aurangabad",
        circle: "Aurangabad",
        area: 18000,
        forestCover: 14200,
        headquarters: "Aurangabad",
        isActive: true,
        coordinates: null,
        rfoId: null
      },
      {
        name: "Pune",
        circle: "Pune",
        area: 12000,
        forestCover: 9800,
        headquarters: "Pune",
        isActive: true,
        coordinates: null,
        rfoId: null
      },
      {
        name: "Nagpur",
        circle: "Nagpur",
        area: 22000,
        forestCover: 18500,
        headquarters: "Nagpur",
        isActive: true,
        coordinates: null,
        rfoId: null
      },
      {
        name: "Mumbai",
        circle: "Mumbai",
        area: 8000,
        forestCover: 6200,
        headquarters: "Mumbai",
        isActive: true,
        coordinates: null,
        rfoId: null
      }
    ];

    const insertedRanges = await db.insert(forestRanges).values(forestRangeData).returning();

    // Seed Officers
    const officerData = [
      {
        name: "श्री मिलद म्हैसकर",
        designation: "अपर मुख्य वन संरक्षक",
        range: "Nashik",
        email: "milind.mhaskar@mahaforest.gov.in",
        phone: "+91 9876543210",
        whatsappNumber: "+91 9876543210",
        circle: "Nashik",
        headquarters: "Nashik",
        isActive: true,
        techScore: 92,
        createdAt: new Date()
      },
      {
        name: "डॉ. प्रिया देशमुख",
        designation: "उप वन संरक्षक",
        range: "Aurangabad",
        email: "priya.deshmukh@mahaforest.gov.in",
        phone: "+91 9876543211",
        whatsappNumber: "+91 9876543211",
        circle: "Aurangabad",
        headquarters: "Aurangabad",
        isActive: true,
        techScore: 88,
        createdAt: new Date()
      },
      {
        name: "श्री राहुल पाटील",
        designation: "वन अधिकारी",
        range: "Pune",
        email: "rahul.patil@mahaforest.gov.in",
        phone: "+91 9876543212",
        whatsappNumber: "+91 9876543212",
        circle: "Pune",
        headquarters: "Pune",
        isActive: true,
        techScore: 85,
        createdAt: new Date()
      },
      {
        name: "श्रीमती सुनीता जोशी",
        designation: "सहायक वन संरक्षक",
        range: "Nagpur",
        email: "sunita.joshi@mahaforest.gov.in",
        phone: "+91 9876543213",
        whatsappNumber: "+91 9876543213",
        circle: "Nagpur",
        headquarters: "Nagpur",
        isActive: true,
        techScore: 90,
        createdAt: new Date()
      },
      {
        name: "श्री अनिल शर्मा",
        designation: "वन रक्षक",
        range: "Mumbai",
        email: "anil.sharma@mahaforest.gov.in",
        phone: "+91 9876543214",
        whatsappNumber: "+91 9876543214",
        circle: "Mumbai",
        headquarters: "Mumbai",
        isActive: true,
        techScore: 87,
        createdAt: new Date()
      }
    ];

    const insertedOfficers = await db.insert(officers).values(officerData).returning();

    // Seed Fire Alerts
    const fireAlertData = [
      {
        rangeId: insertedRanges[0].id,
        location: "Trimbak Forest Area",
        coordinates: null,
        severity: "high",
        status: "active",
        detectedAt: new Date(),
        resolvedAt: null,
        responseTime: null,
        alertedOfficers: null
      },
      {
        rangeId: insertedRanges[1].id,
        location: "Aurangabad Hills",
        coordinates: null,
        severity: "medium",
        status: "investigating",
        detectedAt: new Date(Date.now() - 86400000),
        resolvedAt: null,
        responseTime: 45,
        alertedOfficers: null
      },
      {
        rangeId: insertedRanges[2].id,
        location: "Sahyadri Range",
        coordinates: null,
        severity: "low",
        status: "resolved",
        detectedAt: new Date(Date.now() - 172800000),
        resolvedAt: new Date(Date.now() - 86400000),
        responseTime: 120,
        alertedOfficers: null
      }
    ];

    await db.insert(fireAlerts).values(fireAlertData);

    // Seed Plantation Records
    const plantationData = [
      {
        rangeId: insertedRanges[0].id,
        species: "Teak, Neem, Banyan",
        saplingsPlanted: 5000,
        survivalCount: 4200,
        survivalRate: 84,
        plantedDate: new Date(2024, 2, 15),
        lastSurveyDate: new Date(2024, 5, 15),
        coordinates: null,
        notes: "Monsoon plantation drive 2024"
      },
      {
        rangeId: insertedRanges[1].id,
        species: "Eucalyptus, Bamboo",
        saplingsPlanted: 3500,
        survivalCount: 2800,
        survivalRate: 80,
        plantedDate: new Date(2024, 3, 20),
        lastSurveyDate: new Date(2024, 6, 20),
        coordinates: null,
        notes: "Community plantation program"
      },
      {
        rangeId: insertedRanges[2].id,
        species: "Sandalwood, Rosewood",
        saplingsPlanted: 2000,
        survivalCount: 1750,
        survivalRate: 87.5,
        plantedDate: new Date(2024, 4, 10),
        lastSurveyDate: new Date(2024, 7, 10),
        coordinates: null,
        notes: "High-value species conservation"
      }
    ];

    await db.insert(plantationRecords).values(plantationData);

    // Seed Permits
    const permitData = [
      {
        type: "tree_cutting",
        applicantName: "Maharashtra Highway Development Corporation",
        applicantContact: "+91 9876543220",
        rangeId: insertedRanges[0].id,
        status: "pending",
        description: "Tree cutting for highway expansion project",
        documents: null,
        appliedDate: new Date(),
        processedDate: null,
        processedBy: null,
        validityPeriod: 30,
        fees: 50000
      },
      {
        type: "forest_produce",
        applicantName: "Local Tribal Cooperative",
        applicantContact: "+91 9876543221",
        rangeId: insertedRanges[1].id,
        status: "approved",
        description: "Collection of minor forest produce",
        documents: null,
        appliedDate: new Date(Date.now() - 86400000 * 7),
        processedDate: new Date(Date.now() - 86400000 * 2),
        processedBy: insertedOfficers[1].id,
        validityPeriod: 90,
        fees: 5000
      },
      {
        type: "wildlife_rescue",
        applicantName: "Wildlife SOS",
        applicantContact: "+91 9876543222",
        rangeId: insertedRanges[2].id,
        status: "under_review",
        description: "Leopard rescue and relocation",
        documents: null,
        appliedDate: new Date(Date.now() - 86400000 * 3),
        processedDate: null,
        processedBy: null,
        validityPeriod: 15,
        fees: 0
      }
    ];

    await db.insert(permits).values(permitData);

    // Seed Forest Statistics
    const forestStatsData = [
      {
        rangeId: insertedRanges[0].id,
        statDate: new Date(2024, 0, 1),
        forestCoverPercentage: 23.8,
        totalArea: 15000,
        denseForestArea: 8500,
        mediumForestArea: 4000,
        openForestArea: 2500,
        carbonSequestration: 450000,
        biodiversityIndex: 0.78
      },
      {
        rangeId: insertedRanges[1].id,
        statDate: new Date(2024, 0, 1),
        forestCoverPercentage: 21.2,
        totalArea: 18000,
        denseForestArea: 9000,
        mediumForestArea: 5200,
        openForestArea: 3800,
        carbonSequestration: 520000,
        biodiversityIndex: 0.82
      },
      {
        rangeId: insertedRanges[2].id,
        statDate: new Date(2024, 0, 1),
        forestCoverPercentage: 19.5,
        totalArea: 12000,
        denseForestArea: 6500,
        mediumForestArea: 3300,
        openForestArea: 2200,
        carbonSequestration: 380000,
        biodiversityIndex: 0.75
      }
    ];

    await db.insert(forestStats).values(forestStatsData);

    // Seed Vision 2047 Progress
    const visionProgressData = [
      {
        rangeId: insertedRanges[0].id,
        targetYear: 2029,
        forestCoverTarget: 25.0,
        currentProgress: 23.8,
        initiativesCompleted: 8,
        totalInitiatives: 15,
        carbonCreditGenerated: 1200,
        revenueGenerated: 3000000,
        lastUpdated: new Date()
      },
      {
        rangeId: insertedRanges[1].id,
        targetYear: 2035,
        forestCoverTarget: 30.0,
        currentProgress: 21.2,
        initiativesCompleted: 5,
        totalInitiatives: 20,
        carbonCreditGenerated: 1500,
        revenueGenerated: 3750000,
        lastUpdated: new Date()
      },
      {
        rangeId: insertedRanges[2].id,
        targetYear: 2047,
        forestCoverTarget: 35.0,
        currentProgress: 19.5,
        initiativesCompleted: 3,
        totalInitiatives: 25,
        carbonCreditGenerated: 900,
        revenueGenerated: 2250000,
        lastUpdated: new Date()
      }
    ];

    await db.insert(vision2047Progress).values(visionProgressData);

    // Seed Officer Performance
    const performanceData = [
      {
        officerId: insertedOfficers[0].id,
        month: 12,
        year: 2024,
        transparencyScore: 92,
        efficiencyScore: 88,
        costEffectivenessScore: 90,
        humaneApproachScore: 94,
        overallScore: 91,
        notes: "Excellent performance in community engagement",
        createdAt: new Date()
      },
      {
        officerId: insertedOfficers[1].id,
        month: 12,
        year: 2024,
        transparencyScore: 88,
        efficiencyScore: 92,
        costEffectivenessScore: 87,
        humaneApproachScore: 90,
        overallScore: 89.25,
        notes: "Strong technical skills and innovation",
        createdAt: new Date()
      },
      {
        officerId: insertedOfficers[2].id,
        month: 12,
        year: 2024,
        transparencyScore: 85,
        efficiencyScore: 89,
        costEffectivenessScore: 88,
        humaneApproachScore: 87,
        overallScore: 87.25,
        notes: "Good field operations management",
        createdAt: new Date()
      }
    ];

    await db.insert(officerPerformance).values(performanceData);

    console.log("Database seeded successfully!");
    return true;
  } catch (error) {
    console.error("Error seeding database:", error);
    return false;
  }
}