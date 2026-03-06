import api from "@/lib/axios";

export interface Camera {
  id: string;
  name: string;
  tag: string;
  uuid: string;
  type: "wired" | "wireless";
  status: "online" | "offline" | "sleeping";
  addedAt: string;
  dashboardId: string;
  lat?: number;
  lng?: number;
}

const cameraService = {
  getByDashboard: (dashboardId: string) =>
    api.get<Camera[]>(`/dashboards/${dashboardId}/cameras`),

  getById: (id: string) =>
    api.get<Camera>(`/cameras/${id}`),

  toggleSleep: (id: string) =>
    api.patch<Camera>(`/cameras/${id}/toggle-sleep`),

  captureScreenshot: (id: string) =>
    api.post<{ url: string }>(`/cameras/${id}/screenshot`),

  muteAlerts: (id: string, muted: boolean) =>
    api.patch(`/cameras/${id}/alerts`, { muted }),
};

export default cameraService;
