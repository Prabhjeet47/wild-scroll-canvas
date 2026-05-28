import { useEffect, useState } from "react";
import { Bell, CheckCircle2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import accessService, { type NotificationRow } from "@/services/accessService";
import GrantAccessDialog from "@/components/GrantAccessDialog";
import { formatDistanceToNow } from "date-fns";

export const NotificationBell = () => {
  const { user, session } = useAuth();
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState<null | { requestId: string; requesterId: string; requesterName: string }>(null);

  const unread = items.filter((n) => !n.read_at).length;

  const load = async () => {
    const { data } = await accessService.listMyNotifications();
    setItems((data ?? []) as NotificationRow[]);
  };

  useEffect(() => {
    if (!session?.user) return;
    load();
    const ch = supabase
      .channel(`notifications:${session.user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${session.user.id}` }, () => {
        load();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [session?.user?.id]);

  if (!session?.user) return null;

  const handleClick = async (n: NotificationRow) => {
    if (!n.read_at) await accessService.markRead(n.id);
    if (n.type === "access_request" && user?.role === "admin") {
      setDialog({
        requestId: n.payload.request_id,
        requesterId: n.payload.requester_id,
        requesterName: n.payload.requester_name ?? "User",
      });
      setOpen(false);
    }
    load();
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-[1.1rem] w-[1.1rem]" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0 bg-popover border-border">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <span className="text-sm font-semibold">Notifications</span>
            {unread > 0 && (
              <button
                onClick={async () => { await accessService.markAllRead(session.user.id); load(); }}
                className="text-xs text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No notifications</p>
            ) : (
              items.map((n) => {
                const isReq = n.type === "access_request";
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={`w-full text-left flex gap-3 px-3 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors ${
                      !n.read_at ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="mt-0.5">
                      {isReq ? <UserPlus className="w-4 h-4 text-primary" /> : <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        {isReq ? (
                          <><span className="font-semibold">{n.payload.requester_name}</span> is requesting dashboard access.</>
                        ) : (
                          <>You've been granted access to <span className="font-semibold">{n.payload.dashboard_name}</span>.</>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    {!n.read_at && <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>

      {dialog && (
        <GrantAccessDialog
          open={!!dialog}
          onOpenChange={(o) => !o && setDialog(null)}
          requestId={dialog.requestId}
          requesterId={dialog.requesterId}
          requesterName={dialog.requesterName}
          onResolved={load}
        />
      )}
    </>
  );
};

export default NotificationBell;
