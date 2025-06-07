import { apiRequest } from "./queryClient";

export interface DashboardStats {
  forestCoverPercentage: number;
  totalRanges: number;
  activeOfficers: number;
  totalSaplingsPlanted: number;
  overallSurvivalRate: number;
  activeFireAlerts: number;
  fireIncidentsThisYear: number;
  pendingPermits: number;
  approvedPermits: number;
  totalForestArea: number;
  totalForestCover: number;
}

export const api = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiRequest('GET', '/api/dashboard-stats');
    return response.json();
  },

  // Officers
  getOfficers: async () => {
    const response = await apiRequest('GET', '/api/officers');
    return response.json();
  },

  getOfficer: async (id: number) => {
    const response = await apiRequest('GET', `/api/officers/${id}`);
    return response.json();
  },

  createOfficer: async (officer: any) => {
    const response = await apiRequest('POST', '/api/officers', officer);
    return response.json();
  },

  updateOfficer: async (id: number, officer: any) => {
    const response = await apiRequest('PUT', `/api/officers/${id}`, officer);
    return response.json();
  },

  // Forest Ranges
  getForestRanges: async () => {
    const response = await apiRequest('GET', '/api/forest-ranges');
    return response.json();
  },

  getForestRange: async (id: number) => {
    const response = await apiRequest('GET', `/api/forest-ranges/${id}`);
    return response.json();
  },

  createForestRange: async (range: any) => {
    const response = await apiRequest('POST', '/api/forest-ranges', range);
    return response.json();
  },

  // Fire Alerts
  getFireAlerts: async () => {
    const response = await apiRequest('GET', '/api/fire-alerts');
    return response.json();
  },

  getActiveFireAlerts: async () => {
    const response = await apiRequest('GET', '/api/fire-alerts/active');
    return response.json();
  },

  createFireAlert: async (alert: any) => {
    const response = await apiRequest('POST', '/api/fire-alerts', alert);
    return response.json();
  },

  updateFireAlert: async (id: number, alert: any) => {
    const response = await apiRequest('PUT', `/api/fire-alerts/${id}`, alert);
    return response.json();
  },

  // Plantation Records
  getPlantationRecords: async () => {
    const response = await apiRequest('GET', '/api/plantation-records');
    return response.json();
  },

  getPlantationRecordsByRange: async (rangeId: number) => {
    const response = await apiRequest('GET', `/api/plantation-records/range/${rangeId}`);
    return response.json();
  },

  createPlantationRecord: async (record: any) => {
    const response = await apiRequest('POST', '/api/plantation-records', record);
    return response.json();
  },

  // Permits
  getPermits: async () => {
    const response = await apiRequest('GET', '/api/permits');
    return response.json();
  },

  getPermitsByStatus: async (status: string) => {
    const response = await apiRequest('GET', `/api/permits/status/${status}`);
    return response.json();
  },

  createPermit: async (permit: any) => {
    const response = await apiRequest('POST', '/api/permits', permit);
    return response.json();
  },

  updatePermit: async (id: number, permit: any) => {
    const response = await apiRequest('PUT', `/api/permits/${id}`, permit);
    return response.json();
  },

  // Forest Statistics
  getForestStats: async () => {
    const response = await apiRequest('GET', '/api/forest-stats');
    return response.json();
  },

  getForestStatsByRange: async (rangeId: number) => {
    const response = await apiRequest('GET', `/api/forest-stats/range/${rangeId}`);
    return response.json();
  },

  // Vision 2047 Progress
  getVision2047Progress: async () => {
    const response = await apiRequest('GET', '/api/vision-2047-progress');
    return response.json();
  },

  getVision2047ProgressByRange: async (rangeId: number) => {
    const response = await apiRequest('GET', `/api/vision-2047-progress/range/${rangeId}`);
    return response.json();
  },

  // Officer Performance
  getOfficerPerformance: async () => {
    const response = await apiRequest('GET', '/api/officer-performance');
    return response.json();
  },

  getOfficerPerformanceByOfficer: async (officerId: number) => {
    const response = await apiRequest('GET', `/api/officer-performance/officer/${officerId}`);
    return response.json();
  },

  createOfficerPerformance: async (performance: any) => {
    const response = await apiRequest('POST', '/api/officer-performance', performance);
    return response.json();
  },
};
