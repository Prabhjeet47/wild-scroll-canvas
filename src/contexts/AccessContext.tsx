import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { MOCK_DASHBOARDS, type Dashboard } from "@/data/mockDashboards";

export type RequestStatus = "pending" | "approved" | "denied";

export interface AccessRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
  grantedDashboardIds?: string[];
}

export interface AppNotification {
  id: string;
  audience: "admin" | string; // "admin" or user id
  type: "request" | "approval";
  title: string;
  body: string;
  read: boolean;
  requestId?: string;
  createdAt: string;
}

interface AccessContextType {
  requests: AccessRequest[];
  notifications: AppNotification[];
  grantedAccess: Record<string, string[]>;
  createRequest: (user: { id: string; name: string; email: string }, message: string) => void;
  grantAccess: (requestId: string, dashboardIds: string[]) => void;
  denyRequest: (requestId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: (audience: string) => void;
  getUserDashboards: (userId: string) => Dashboard[];
}

const AccessContext = createContext<AccessContextType | undefined>(undefined);

const uid = () => Math.random().toString(36).slice(2, 10);

export const AccessProvider = ({ children }: { children: ReactNode }) => {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [grantedAccess, setGrantedAccess] = useState<Record<string, string[]>>({});

  const createRequest: AccessContextType["createRequest"] = useCallback((user, message) => {
    const req: AccessRequest = {
      id: uid(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      message,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setRequests((r) => [req, ...r]);
    setNotifications((n) => [
      {
        id: uid(),
        audience: "admin",
        type: "request",
        title: "New access request",
        body: `${user.name} is requesting dashboard access`,
        read: false,
        requestId: req.id,
        createdAt: new Date().toISOString(),
      },
      ...n,
    ]);
  }, []);

  const grantAccess: AccessContextType["grantAccess"] = useCallback((requestId, dashboardIds) => {
    setRequests((rs) =>
      rs.map((r) =>
        r.id === requestId
          ? { ...r, status: "approved", grantedDashboardIds: dashboardIds }
          : r,
      ),
    );
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;
    setGrantedAccess((g) => {
      const existing = new Set(g[req.userId] ?? []);
      dashboardIds.forEach((id) => existing.add(id));
      return { ...g, [req.userId]: Array.from(existing) };
    });
    const names = MOCK_DASHBOARDS.filter((d) => dashboardIds.includes(d.id))
      .map((d) => d.name)
      .join(", ");
    setNotifications((n) => [
      {
        id: uid(),
        audience: req.userId,
        type: "approval",
        title: "Access granted",
        body: `You have been granted access to: ${names}`,
        read: false,
        requestId: req.id,
        createdAt: new Date().toISOString(),
      },
      ...n,
    ]);
  }, [requests]);

  const denyRequest: AccessContextType["denyRequest"] = useCallback((requestId) => {
    setRequests((rs) => rs.map((r) => (r.id === requestId ? { ...r, status: "denied" } : r)));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)));
  }, []);

  const markAllRead = useCallback((audience: string) => {
    setNotifications((n) => n.map((x) => (x.audience === audience ? { ...x, read: true } : x)));
  }, []);

  const getUserDashboards = useCallback(
    (userId: string) => {
      const ids = grantedAccess[userId] ?? [];
      return MOCK_DASHBOARDS.filter((d) => ids.includes(d.id));
    },
    [grantedAccess],
  );

  return (
    <AccessContext.Provider
      value={{
        requests,
        notifications,
        grantedAccess,
        createRequest,
        grantAccess,
        denyRequest,
        markNotificationRead,
        markAllRead,
        getUserDashboards,
      }}
    >
      {children}
    </AccessContext.Provider>
  );
};

export const useAccess = () => {
  const ctx = useContext(AccessContext);
  if (!ctx) throw new Error("useAccess must be used within AccessProvider");
  return ctx;
};
