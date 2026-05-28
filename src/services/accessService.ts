import { supabase } from "@/integrations/supabase/client";

export interface AccessRequest {
  id: string;
  user_id: string;
  message: string | null;
  status: "pending" | "approved" | "denied";
  created_at: string;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  type: string;
  payload: Record<string, any>;
  read_at: string | null;
  created_at: string;
}

const accessService = {
  createRequest: (message?: string) =>
    supabase.from("access_requests").insert({
      user_id: undefined as any, // will be enforced via RLS check
      message: message ?? null,
    } as any),

  // Convenience that injects the current user_id
  async submitRequest(userId: string, message?: string) {
    return supabase.from("access_requests").insert({ user_id: userId, message: message ?? null });
  },

  myPendingRequest: (userId: string) =>
    supabase
      .from("access_requests")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "pending")
      .maybeSingle(),

  getRequest: (id: string) =>
    supabase.from("access_requests").select("*").eq("id", id).maybeSingle(),

  approveRequest: (id: string, adminId: string) =>
    supabase
      .from("access_requests")
      .update({ status: "approved", resolved_by: adminId, resolved_at: new Date().toISOString() })
      .eq("id", id),

  grantDashboards: (dashboardIds: string[], userId: string, adminId: string) =>
    supabase
      .from("dashboard_access")
      .insert(dashboardIds.map((id) => ({ dashboard_id: id, user_id: userId, granted_by: adminId }))),

  getUserAccessIds: (userId: string) =>
    supabase.from("dashboard_access").select("dashboard_id").eq("user_id", userId),

  // Notifications
  listMyNotifications: () =>
    supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),

  markRead: (id: string) =>
    supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id),

  markAllRead: (userId: string) =>
    supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("read_at", null),
};

export default accessService;
