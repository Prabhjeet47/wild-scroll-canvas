import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GlobalHeader from "@/components/GlobalHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Map,
  MapPin,
  X,
  Moon,
  Sun,
  ImageIcon,
  BellOff,
  Wifi,
  Cable,
  Flame,
  Clock,
  UserCircle,
  Hash,
  Globe,
  Layers,
  Terminal,
  Eye,
  EyeOff,
  Sunset,
} from "lucide-react";
import { MOCK_DASHBOARDS } from "@/data/mockDashboards";

/* ─── Types ────────────────────────────── */
interface CameraData {
  id: string;
  name: string;
  tag: string;
  type: "wired" | "wireless";
  status: "active" | "sleeping";
  uuid: string;
  addedDate: string;
  lat: number;
  lng: number;
}

type CameraMode = "normal" | "night" | "degraded";

/* ─── Mock cameras per dashboard ────────── */
const generateCameras = (count: number, dashboardName: string): CameraData[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `cam-${i + 1}`,
    name: `camera${i + 1}`,
    tag: ["Front gate", "Waterhole", "Canopy", "Trail", "Nest box", "River crossing", "Ridge", "Den"][i % 8],
    type: i % 3 === 0 ? "wireless" : "wired" as const,
    status: i % 4 === 0 ? "sleeping" : "active" as const,
    uuid: `${dashboardName.slice(0, 3).toLowerCase()}-cam-${crypto.randomUUID().slice(0, 8)}`,
    addedDate: `2026-0${(i % 9) + 1}-${String((i * 3 + 5) % 28 + 1).padStart(2, "0")}`,
    lat: 20 + Math.random() * 40 - 20,
    lng: 30 + Math.random() * 60 - 30,
  }));

/* ─── Mock logs ─────────────────────────── */
const generateLogs = (): string[] => [
  "[14:32:07, 2026-02-22] Lion pride detected near camera3 — motion alert triggered",
  "[14:28:45, 2026-02-22] camera1 snapshot captured — clear visibility",
  "[14:15:22, 2026-02-22] Heatmap updated — 3 new motion zones identified",
  "[13:58:11, 2026-02-22] camera5 entered sleep mode — battery saving",
  "[13:42:09, 2026-02-22] Elephant herd crossing detected — camera2",
  "[13:30:00, 2026-02-22] System health check — all cameras nominal",
  "[12:55:33, 2026-02-22] Night vision auto-engaged on camera4",
  "[12:40:17, 2026-02-22] Wireless signal strength camera6 — 78%",
  "[12:22:44, 2026-02-22] Bird nesting activity logged — camera3",
  "[11:58:02, 2026-02-22] Dashboard backup completed successfully",
];

/* ─── Camera Status Dot ──────────────────── */
const StatusDot = ({ status }: { status: "active" | "sleeping" }) => (
  <span
    className={`inline-block w-2 h-2 rounded-full shrink-0 ${
      status === "active"
        ? "bg-primary shadow-[0_0_6px_hsl(var(--primary)/0.5)]"
        : "bg-muted-foreground/40"
    }`}
  />
);

/* ─── Camera View Modal ──────────────────── */
const CameraModal = ({
  camera,
  open,
  onClose,
  cameras,
  onSelect,
}: {
  camera: CameraData;
  open: boolean;
  onClose: () => void;
  cameras: CameraData[];
  onSelect: (cam: CameraData) => void;
}) => {
  const [mode, setMode] = useState<CameraMode>("normal");
  const [isAwake, setIsAwake] = useState(camera.status === "active");

  const modes: { key: CameraMode; label: string; icon: typeof Eye }[] = [
    { key: "normal", label: "Normal", icon: Eye },
    { key: "night", label: "Night Vision", icon: Sunset },
    { key: "degraded", label: "Degraded", icon: EyeOff },
  ];

  const modeOverlay: Record<CameraMode, string> = {
    normal: "",
    night: "bg-green-900/40",
    degraded: "bg-muted/50 backdrop-blur-sm",
  };

  const currentIdx = cameras.findIndex((c) => c.id === camera.id);
  const prevCam = cameras[(currentIdx - 1 + cameras.length) % cameras.length];
  const nextCam = cameras[(currentIdx + 1) % cameras.length];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden border-border bg-card animate-in zoom-in-95 slide-in-from-bottom-2 duration-300">
        <div className="flex flex-col md:flex-row min-h-[420px]">
          {/* Left — Camera View */}
          <div className="md:w-[60%] relative bg-muted flex items-center justify-center">
            <div className={`absolute inset-0 ${modeOverlay[mode]} transition-colors duration-500`} />
            <div className="relative z-10 text-center p-8">
              <Camera className={`w-16 h-16 mx-auto mb-2 ${mode === "night" ? "text-green-400" : "text-muted-foreground"} opacity-40`} />
              <p className="text-xs text-muted-foreground">{camera.name} — {mode} mode</p>
            </div>

            {/* Mode arrows */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20">
              {modes.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[10px] font-body font-medium transition-all ${
                    mode === key
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-card/80 text-muted-foreground hover:bg-card hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>

            {/* Prev / Next camera */}
            {cameras.length > 1 && (
              <>
                <button
                  onClick={() => onSelect(prevCam)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-card/80 flex items-center justify-center hover:bg-card transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
                <button
                  onClick={() => onSelect(nextCam)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-card/80 flex items-center justify-center hover:bg-card transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-foreground" />
                </button>
              </>
            )}
          </div>

          {/* Right — Metadata & Actions */}
          <div className="md:w-[40%] p-5 space-y-5 border-l border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-foreground text-lg">{camera.name}</h3>
              <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-3 text-sm font-body">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Hash className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs font-mono truncate">{camera.uuid}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>Tag: <span className="text-foreground">{camera.tag}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                {camera.type === "wired" ? <Cable className="w-3.5 h-3.5 shrink-0" /> : <Wifi className="w-3.5 h-3.5 shrink-0" />}
                <span>Type: <span className="text-foreground capitalize">{camera.type}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Added: <span className="text-foreground">{camera.addedDate}</span></span>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <h4 className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">Actions</h4>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-body">
                  {isAwake ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
                  <span className="text-foreground">{isAwake ? "Awake" : "Sleeping"}</span>
                </div>
                <Switch checked={isAwake} onCheckedChange={setIsAwake} />
              </div>

              <Button variant="outline" size="sm" className="w-full gap-2 text-xs font-body">
                <ImageIcon className="w-3.5 h-3.5" />
                Capture Screenshot
              </Button>

              <Button variant="outline" size="sm" className="w-full gap-2 text-xs font-body">
                <BellOff className="w-3.5 h-3.5" />
                Mute Alerts
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ─── Map Box ────────────────────────────── */
const MapBox = ({ cameras }: { cameras: CameraData[] }) => (
  <div className="relative w-full aspect-[16/9] bg-muted rounded-lg border border-border overflow-hidden">
    <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} className="border border-border/15" />
      ))}
    </div>
    {/* Continent shapes */}
    <div className="absolute top-[15%] left-[20%] w-[20%] h-[25%] bg-primary/10 rounded-[40%]" />
    <div className="absolute top-[30%] left-[55%] w-[15%] h-[30%] bg-primary/10 rounded-[40%]" />
    {/* Camera pins */}
    {cameras.map((cam, i) => (
      <div
        key={cam.id}
        className="absolute -translate-x-1/2 -translate-y-full"
        style={{
          left: `${15 + ((i * 17 + 10) % 70)}%`,
          top: `${20 + ((i * 13 + 15) % 60)}%`,
        }}
      >
        <MapPin className={`w-4 h-4 ${cam.status === "active" ? "text-primary" : "text-muted-foreground"}`} />
      </div>
    ))}
    <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground font-body bg-card/70 px-1.5 py-0.5 rounded">
      <Map className="w-3 h-3 inline mr-1" />
      Camera Locations
    </div>
  </div>
);

/* ─── Heatmap Box ────────────────────────── */
const HeatmapBox = ({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: () => void;
}) => {
  if (!show) {
    return (
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-body text-muted-foreground"
      >
        <Flame className="w-4 h-4 text-primary" />
        Show Heatmap
      </button>
    );
  }

  return (
    <div className="relative w-full aspect-[16/9] bg-muted rounded-lg border border-border overflow-hidden">
      {/* Heatmap blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-[25%] left-[30%] w-24 h-24 rounded-full bg-destructive/30 blur-xl" />
        <div className="absolute top-[40%] left-[55%] w-32 h-32 rounded-full bg-accent/30 blur-xl" />
        <div className="absolute bottom-[20%] left-[20%] w-20 h-20 rounded-full bg-primary/30 blur-xl" />
        <div className="absolute top-[15%] right-[20%] w-16 h-16 rounded-full bg-destructive/20 blur-xl" />
      </div>
      <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground font-body bg-card/70 px-1.5 py-0.5 rounded">
        <Flame className="w-3 h-3 inline mr-1 text-destructive" />
        Motion Heatmap
      </div>
      <button
        onClick={onToggle}
        className="absolute top-2 right-2 w-6 h-6 rounded-md bg-card/80 hover:bg-card flex items-center justify-center transition-colors"
      >
        <X className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    </div>
  );
};

/* ─── Logs Section ───────────────────────── */
const LogsSection = () => {
  const [open, setOpen] = useState(false);
  const logs = useMemo(generateLogs, []);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-muted/60 hover:bg-muted transition-colors cursor-pointer">
        <Terminal className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-body font-semibold text-foreground flex-1 text-left">Logs</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-1 rounded-lg bg-[hsl(150,20%,6%)] border border-border p-3 max-h-64 overflow-y-auto font-mono text-xs">
          {logs.map((log, i) => (
            <div key={i} className="py-1 text-[hsl(120,20%,70%)] leading-relaxed border-b border-[hsl(150,10%,12%)] last:border-0">
              {log}
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

/* ─── Main Page ──────────────────────────── */
const DashboardDetail = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [selectedCamera, setSelectedCamera] = useState<CameraData | null>(null);
  const [camerasOpen, setCamerasOpen] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Find dashboard by slug
  const dashboard = MOCK_DASHBOARDS.find(
    (d) => d.name.toLowerCase().replace(/\s+/g, "-") === name
  );

  const cameras = useMemo(
    () => (dashboard ? generateCameras(dashboard.cameraCount, dashboard.name) : []),
    [dashboard]
  );

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <div className="pt-20 px-4 text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">Dashboard Not Found</h1>
          <p className="text-muted-foreground font-body mb-4">The dashboard "{name}" could not be found.</p>
          <Button onClick={() => navigate("/home")} variant="outline" className="font-body">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <div className="pt-16 pb-10 px-4 md:px-8 max-w-[1600px] mx-auto">
        {/* Top bar */}
        <div className="flex items-center gap-3 mb-6 pt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/home")}
            className="shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
              {dashboard.name}
            </h1>
            <p className="text-xs text-muted-foreground font-body">
              {dashboard.coordinates}
            </p>
          </div>
          <Badge
            variant="outline"
            className={`ml-auto text-[10px] ${
              dashboard.status === "active"
                ? "bg-primary/20 text-primary border-primary/30"
                : dashboard.status === "sleeping"
                ? "bg-accent/20 text-accent-foreground border-accent/30"
                : "bg-destructive/20 text-destructive border-destructive/30"
            }`}
          >
            {dashboard.status}
          </Badge>
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* ─── Left: Camera Stack ─────────────── */}
          <div className="lg:w-72 xl:w-80 shrink-0">
            <Collapsible open={camerasOpen} onOpenChange={setCamerasOpen}>
              <CollapsibleTrigger className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors cursor-pointer mb-2">
                <Camera className="w-4 h-4 text-primary" />
                <span className="text-sm font-body font-semibold text-foreground flex-1 text-left">
                  Cameras ({cameras.length})
                </span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${camerasOpen ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-1.5">
                  {cameras.map((cam) => (
                    <button
                      key={cam.id}
                      onClick={() => setSelectedCamera(cam)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all text-left group"
                    >
                      <StatusDot status={cam.status} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-body font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {cam.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-body truncate">
                          {cam.tag}
                        </p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* ─── Right: Info Panel ──────────────── */}
          <div className="flex-1 space-y-5">
            {/* Map + Heatmap row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Map className="w-3.5 h-3.5" /> Camera Map
                </h3>
                <MapBox cameras={cameras} />
              </div>
              <div>
                <h3 className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> Heatmap
                </h3>
                <HeatmapBox show={showHeatmap} onToggle={() => setShowHeatmap(!showHeatmap)} />
              </div>
            </div>

            {/* Dashboard info */}
            <Card className="p-5 bg-card border-border">
              <h3 className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Dashboard Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm font-body">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Hash className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs">UUID:</span>
                  <span className="text-xs font-mono text-foreground truncate">
                    {dashboard.id}-{dashboard.name.slice(0, 4).toLowerCase()}-{Math.random().toString(36).slice(2, 10)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs">Created:</span>
                  <span className="text-xs text-foreground">{dashboard.createdAt}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs">Created by:</span>
                  <span className="text-xs text-foreground">{dashboard.createdBy}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Camera className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs">Cameras:</span>
                  <span className="text-xs text-foreground">{dashboard.cameraCount}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs">Country:</span>
                  <span className="text-xs text-foreground">{dashboard.coordinates.split(",")[0]?.trim()}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs">Location:</span>
                  <span className="text-xs text-foreground">{dashboard.coordinates}</span>
                </div>
              </div>
            </Card>

            {/* Logs */}
            <LogsSection />
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {selectedCamera && (
        <CameraModal
          camera={selectedCamera}
          open={!!selectedCamera}
          onClose={() => setSelectedCamera(null)}
          cameras={cameras}
          onSelect={setSelectedCamera}
        />
      )}
    </div>
  );
};

export default DashboardDetail;
