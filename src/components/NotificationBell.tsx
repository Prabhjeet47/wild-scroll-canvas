import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { useAccess, type AccessRequest } from "@/contexts/AccessContext";
import GrantAccessDialog from "@/components/GrantAccessDialog";

const NotificationBell = () => {
  const { user } = useAuth();
  const { notifications, requests, markNotificationRead, markAllRead } = useAccess();
  const [open, setOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState<AccessRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!user) return null;
  const audience = user.role === "admin" ? "admin" : user.id;

  const myNotifs = useMemo(
    () => notifications.filter((n) => n.audience === audience),
    [notifications, audience],
  );
  const unread = myNotifs.filter((n) => !n.read).length;

  const handleClick = (notifId: string, requestId?: string) => {
    markNotificationRead(notifId);
    if (user.role === "admin" && requestId) {
      const req = requests.find((r) => r.id === requestId);
      if (req) {
        setActiveRequest(req);
        setDialogOpen(true);
        setOpen(false);
      }
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="h-[1.1rem] w-[1.1rem]" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h4 className="font-display font-semibold text-sm">Notifications</h4>
            {myNotifs.length > 0 && (
              <button
                onClick={() => markAllRead(audience)}
                className="text-xs text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {myNotifs.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">No notifications</p>
            ) : (
              myNotifs.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n.id, n.requestId)}
                  className={`w-full text-left p-3 border-b border-border hover:bg-muted/50 transition-colors ${
                    !n.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      <GrantAccessDialog
        request={activeRequest}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};

export default NotificationBell;
