import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import accessService from "@/services/accessService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Camera } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  requesterId: string;
  requesterName: string;
  onResolved?: () => void;
}

export const GrantAccessDialog = ({ open, onOpenChange, requestId, requesterId, requesterName, onResolved }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dashboards, setDashboards] = useState<Array<{ id: string; name: string; location: string | null }>>([]);
  const [existingIds, setExistingIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    (async () => {
      const [{ data: dbs }, { data: access }] = await Promise.all([
        supabase.from("dashboards").select("id,name,location").order("name"),
        accessService.getUserAccessIds(requesterId),
      ]);
      setDashboards(dbs ?? []);
      const ex = new Set((access ?? []).map((a: any) => a.dashboard_id));
      setExistingIds(ex);
      setSelected(new Set(ex));
      setLoading(false);
    })();
  }, [open, requesterId]);

  const toggle = (id: string) => {
    if (existingIds.has(id)) return; // can't unselect already-granted
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleConfirm = async () => {
    if (!user) return;
    const toGrant = [...selected].filter((id) => !existingIds.has(id));
    setSaving(true);
    try {
      if (toGrant.length > 0) {
        const { error } = await accessService.grantDashboards(toGrant, requesterId, user.id);
        if (error) throw error;
      }
      await accessService.approveRequest(requestId, user.id);
      toast({
        title: "Access granted",
        description: `${requesterName} now has access to ${toGrant.length} new dashboard${toGrant.length === 1 ? "" : "s"}.`,
      });
      onResolved?.();
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Failed to grant access", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Grant dashboard access</DialogTitle>
          <DialogDescription>
            Choose which dashboards <span className="text-foreground font-semibold">{requesterName}</span> can view.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-80 overflow-y-auto space-y-2 py-2">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-6">Loading dashboards…</p>
          ) : dashboards.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No dashboards yet. Create one first.</p>
          ) : (
            dashboards.map((d) => {
              const already = existingIds.has(d.id);
              const checked = selected.has(d.id);
              return (
                <label
                  key={d.id}
                  className={`flex items-center gap-3 p-3 rounded-md border ${
                    already ? "bg-muted/40 border-border opacity-70" : "border-border hover:bg-muted/30 cursor-pointer"
                  }`}
                >
                  <Checkbox checked={checked} disabled={already} onCheckedChange={() => toggle(d.id)} />
                  <Camera className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{d.name}</p>
                    {d.location && <p className="text-xs text-muted-foreground truncate">{d.location}</p>}
                  </div>
                  {already && <Badge variant="outline" className="text-[10px]">Granted</Badge>}
                </label>
              );
            })
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={saving || loading}>
            {saving ? "Granting…" : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GrantAccessDialog;
