export interface Officer {
  id: number;
  name: string;
  designation: string;
  range: string;
  email: string;
  phone?: string;
  whatsappNumber?: string;
  circle: string;
  headquarters?: string;
  isActive: boolean;
  techScore?: number;
  createdAt: Date;
}

export interface ForestRange {
  id: number;
  name: string;
  circle: string;
  area: number;
  forestCover: number;
  coordinates?: any;
  rfoId?: number;
  headquarters?: string;
  isActive: boolean;
}

export interface FireAlert {
  id: number;
  rangeId: number;
  location: string;
  coordinates?: any;
  severity: 'low' | 'medium' | 'high';
  status: 'active' | 'resolved' | 'investigating';
  detectedAt: Date;
  resolvedAt?: Date;
  responseTime?: number;
  alertedOfficers?: any;
}

export interface PlantationRecord {
  id: number;
  rangeId: number;
  species: string;
  saplingsPlanted: number;
  survivalCount?: number;
  survivalRate?: number;
  plantedDate: Date;
  lastSurveyDate?: Date;
  coordinates?: any;
  notes?: string;
}

export interface Permit {
  id: number;
  type: 'tree_cutting' | 'forest_produce' | 'wildlife_rescue' | 'research';
  applicantName: string;
  applicantContact: string;
  rangeId: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  description: string;
  documents?: any;
  appliedDate: Date;
  processedDate?: Date;
  processedBy?: number;
  validityPeriod?: number;
  fees?: number;
}

export interface ForestStats {
  id: number;
  rangeId?: number;
  statDate: Date;
  forestCoverPercentage: number;
  totalArea: number;
  denseForestArea?: number;
  mediumForestArea?: number;
  openForestArea?: number;
  carbonSequestration?: number;
  biodiversityIndex?: number;
}

export interface Vision2047Progress {
  id: number;
  rangeId?: number;
  targetYear: number;
  forestCoverTarget: number;
  currentProgress?: number;
  initiativesCompleted?: number;
  totalInitiatives: number;
  carbonCreditGenerated?: number;
  revenueGenerated?: number;
  lastUpdated: Date;
}

export interface OfficerPerformance {
  id: number;
  officerId: number;
  month: number;
  year: number;
  transparencyScore?: number;
  efficiencyScore?: number;
  costEffectivenessScore?: number;
  humaneApproachScore?: number;
  overallScore?: number;
  notes?: string;
  createdAt: Date;
}
