import { supabase } from "@/integrations/supabase/client";

export interface DashboardRow {
  id: string;
  name: string;
  slug: string;
  coordinates: string | null;
  country: string | null;
  location: string | null;
  camera_count: number;
  status: string;
  last_log: string | null;
  created_at: string;
  owner_id: string | null;
}

const dashboardService = {
  listAll: () => supabase.from("dashboards").select("*").order("created_at", { ascending: false }),

  listMine: () => supabase.from("dashboards").select("*").order("created_at", { ascending: false }),

  bySlug: (slug: string) =>
    supabase.from("dashboards").select("*").eq("slug", slug).maybeSingle(),
};

export default dashboardService;
