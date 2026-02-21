import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera, Map, FileText, Moon, MoreHorizontal, Plus,
  LayoutList, LayoutGrid, Square, MapPin, Clock, UserCircle, ChevronRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_DASHBOARDS, type Dashboard } from "@/data/mockDashboards";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/ScrollReveal";

type ViewMode = "vertical" | "grid" | "single";

const statusColors: Record<Dashboard["status"], string> = {
  active: "bg-primary/20 text-primary border-primary/30",
  sleeping: "bg-accent/20 text-accent-foreground border-accent/30",
  offline: "bg-destructive/20 text-destructive border-destructive/30",
};

const CameraPreview = ({ className = "" }: { className?: string }) => (
  <div className={`bg-muted rounded-md overflow-hidden flex items-center justify-center ${className}`}>
    <div className="text-center text-muted-foreground p-4">
      <Camera className="w-8 h-8 mx-auto mb-1 opacity-40" />
      <span className="text-xs opacity-60">Camera Feed</span>
    </div>
  </div>
);

const MapPreview = ({ compact = false }: { compact?: boolean }) => (
  <div className={`bg-muted/60 rounded flex items-center justify-center ${compact ? "h-10 w-10" : "h-16 w-full"}`}>
    <Map className={`text-muted-foreground opacity-40 ${compact ? "w-4 h-4" : "w-6 h-6"}`} />
  </div>
);

const LogsPreview = ({ log, compact = false }: { log: string; compact?: boolean }) => (
  <div className={`flex items-start gap-1.5 ${compact ? "" : "mt-1"}`}>
    <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
    <span className="text-xs text-muted-foreground line-clamp-1">{log}</span>
  </div>
);

const SleepButton = ({ status }: { status: Dashboard["status"] }) => (
  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground">
    <Moon className="w-3.5 h-3.5" />
    {status === "sleeping" ? "Wake" : "Sleep"}
  </Button>
);

/* ─── Vertical View ────────────────────────────────── */
const VerticalView = ({ dashboards }: { dashboards: Dashboard[] }) => (
  <div className="space-y-3">
    {dashboards.map((d, i) => (
      <ScrollReveal key={d.id} delay={i * 80}>
        <Card className="p-4 bg-card border-border hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-display font-bold text-foreground text-sm flex-1">{d.name}</h3>
            <Badge variant="outline" className={`text-[10px] ${statusColors[d.status]}`}>
              {d.status}
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <CameraPreview className="aspect-video" />
            <div className="flex flex-col gap-2">
              <MapPreview />
              <span className="text-[10px] text-muted-foreground">{d.coordinates}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Latest Log</span>
              <LogsPreview log={d.lastLog} />
            </div>
            <div className="flex items-center justify-end">
              <SleepButton status={d.status} />
            </div>
          </div>
        </Card>
      </ScrollReveal>
    ))}
  </div>
);

/* ─── Grid View ────────────────────────────────── */
const GridView = ({ dashboards }: { dashboards: Dashboard[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
    {dashboards.map((d, i) => (
      <ScrollReveal key={d.id} delay={i * 80}>
        <Card className="overflow-hidden bg-card border-border hover:border-primary/30 transition-colors group">
          <CameraPreview className="aspect-[16/10]" />
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-bold text-foreground text-sm truncate">{d.name}</h3>
              <Badge variant="outline" className={`text-[10px] shrink-0 ml-2 ${statusColors[d.status]}`}>
                {d.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 border-t border-border pt-2">
              <MapPreview compact />
              <div className="flex-1 min-w-0">
                <LogsPreview log={d.lastLog} compact />
              </div>
              <SleepButton status={d.status} />
            </div>
          </div>
        </Card>
      </ScrollReveal>
    ))}
  </div>
);

/* ─── Single View ────────────────────────────────── */
const SingleView = ({ dashboards }: { dashboards: Dashboard[] }) => {
  const [selected, setSelected] = useState(0);
  const d = dashboards[selected];
  if (!d) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Dashboard list sidebar */}
      <div className="lg:w-56 shrink-0 space-y-1">
        {dashboards.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setSelected(i)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-body transition-colors flex items-center gap-2 ${
              i === selected
                ? "bg-primary/15 text-primary border border-primary/30"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <span className="truncate flex-1">{item.name}</span>
            {i === selected && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
          </button>
        ))}
      </div>

      {/* Detail */}
      <Card className="flex-1 p-0 overflow-hidden bg-card border-border">
        <div className="flex flex-col lg:flex-row">
          <CameraPreview className="aspect-video lg:aspect-auto lg:w-[60%]" />
          <div className="p-5 lg:w-[40%] space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display font-bold text-foreground text-lg">{d.name}</h3>
                <Badge variant="outline" className={`text-[10px] ${statusColors[d.status]}`}>
                  {d.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-3 text-sm font-body">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{d.coordinates}</span>
              </div>
              <div className="flex items-start gap-2">
                <Camera className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{d.cameraCount} cameras</span>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{d.lastLog}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground">Created {d.createdAt}</span>
              </div>
              <div className="flex items-start gap-2">
                <UserCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{d.createdBy}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <SleepButton status={d.status} />
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 text-muted-foreground">
                <MoreHorizontal className="w-3.5 h-3.5" />
                More
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

/* ─── Main Component ────────────────────────────────── */
const DashboardViews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const isAdmin = user?.role === "admin";

  // Normal users with no dashboards
  const dashboards = isAdmin ? MOCK_DASHBOARDS : [];

  const viewOptions: { mode: ViewMode; icon: typeof LayoutList; label: string }[] = [
    { mode: "vertical", icon: LayoutList, label: "List" },
    { mode: "grid", icon: LayoutGrid, label: "Grid" },
    { mode: "single", icon: Square, label: "Single" },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] pt-20 pb-10 px-4 md:px-8 max-w-[1600px] mx-auto">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            {isAdmin ? "All Dashboards" : "My Dashboards"}
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            {isAdmin
              ? `${MOCK_DASHBOARDS.length} dashboards active`
              : "Dashboards assigned to you"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View switcher */}
          <div className="flex items-center bg-muted rounded-lg p-0.5">
            {viewOptions.map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-body font-medium transition-all ${
                  viewMode === mode
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Admin: Create Dashboard */}
          {isAdmin && (
            <Button
              onClick={() => navigate("/dashboard/create")}
              size="sm"
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-body"
            >
              <Plus className="w-4 h-4" />
              Create Dashboard
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {dashboards.length === 0 ? (
        <ScrollReveal>
          <Card className="p-10 text-center bg-card border-primary/20 border-dashed">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display font-bold text-foreground text-lg mb-2">
              No Dashboard Access
            </h3>
            <p className="text-muted-foreground font-body text-sm max-w-md mx-auto mb-4">
              You currently don't have access to any dashboards. Please contact your
              administrator to get dashboard access assigned to your account.
            </p>
            <Button variant="outline" size="sm" className="font-body">
              Contact Admin
            </Button>
          </Card>
        </ScrollReveal>
      ) : (
        <>
          {viewMode === "vertical" && <VerticalView dashboards={dashboards} />}
          {viewMode === "grid" && <GridView dashboards={dashboards} />}
          {viewMode === "single" && <SingleView dashboards={dashboards} />}
        </>
      )}
    </div>
  );
};

export default DashboardViews;
