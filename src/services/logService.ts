import api from "@/lib/axios";

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  dashboardId: string;
}

const logService = {
  getByDashboard: (dashboardId: string) =>
    api.get<LogEntry[]>(`/dashboards/${dashboardId}/logs`),
};

export default logService;
