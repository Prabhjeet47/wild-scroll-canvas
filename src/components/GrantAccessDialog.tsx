import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MOCK_DASHBOARDS } from "@/data/mockDashboards";
import { useAccess, type AccessRequest } from "@/contexts/AccessContext";
import { toast } from "sonner";

interface Props {
  request: AccessRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GrantAccessDialog = ({ request, open, onOpenChange }: Props) => {
  const { grantAccess, denyRequest, grantedAccess } = useAccess();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (request) setSelected(grantedAccess[request.userId] ?? []);
  }, [request, grantedAccess]);

  if (!request) return null;

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const handleGrant = () => {
    if (selected.length === 0) {
      toast.error("Select at least one dashboard");
      return;
    }
    grantAccess(request.id, selected);
    toast.success(`Granted ${selected.length} dashboard(s) to ${request.userName}`);
    onOpenChange(false);
  };

  const handleDeny = () => {
    denyRequest(request.id);
    toast("Request denied");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Access Request</DialogTitle>
          <DialogDescription>
            <span className="font-semibold text-foreground">{request.userName}</span> ({request.userEmail})
            <br />
            <span className="italic">"{request.message}"</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-72 overflow-y-auto py-2">
          <p className="text-sm font-medium text-foreground">Select dashboards to grant:</p>
          {MOCK_DASHBOARDS.map((d) => (
            <label
              key={d.id}
              className="flex items-center gap-3 p-2 rounded-md border border-border hover:bg-muted/50 cursor-pointer"
            >
              <Checkbox
                checked={selected.includes(d.id)}
                onCheckedChange={() => toggle(d.id)}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{d.name}</p>
                <p className="text-xs text-muted-foreground truncate">{d.coordinates}</p>
              </div>
            </label>
          ))}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleDeny}>Deny</Button>
          <Button onClick={handleGrant}>Grant Access</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GrantAccessDialog;
