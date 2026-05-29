import api from "@/lib/axios";
import type { Dashboard } from "@/data/mockDashboards";

const dashboardService = {
  getAll: () =>
    api.get<Dashboard[]>("/dashboards"),

  getById: (id: string) =>
    api.get<Dashboard>(`/dashboards/${id}`),

  create: (data: Omit<Dashboard, "id">) =>
    api.post<Dashboard>("/dashboards", data),

  update: (id: string, data: Partial<Dashboard>) =>
    api.put<Dashboard>(`/dashboards/${id}`, data),

  delete: (id: string) =>
    api.delete(`/dashboards/${id}`),
};

export default dashboardService;
