import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GlobalHeader from "@/components/GlobalHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  MapPin,
  Camera,
  X,
  Pencil,
  Check,
  Wifi,
  Cable,
  Save,
  ArrowLeft,
  MousePointerClick,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/* ─── Types ────────────────────────────────── */
interface DashboardFormData {
  name: string;
  description: string;
  country: string;
  place: string;
  sharedWith: string[];
  tags: string[];
}

interface PinLocation {
  lat: number;
  lng: number;
}

interface CameraItem {
  id: string;
  name: string;
  type: "wired" | "wireless";
}

type Step = "form" | "map" | "setup";

/* ─── Mock users for sharing dropdown ────────── */
const MOCK_USERS = [
  "Alex Ranger",
  "Sam Observer",
  "Maya Wildlife",
  "Jordan Field",
  "Riley Tracker",
  "Casey Monitor",
];

/* ─── Map Pin Animation ─────────────────────── */
const MapPinAnimation = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-6">
      <div className="relative w-40 h-40">
        {/* Fake map grid */}
        <div className="absolute inset-0 rounded-xl bg-muted/50 border border-border overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border border-border/30" />
            ))}
          </div>
        </div>
        {/* Animated pin dropping */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 animate-bounce">
          <MapPin className="w-8 h-8 text-primary drop-shadow-lg" />
        </div>
        {/* Ripple */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-2 w-6 h-2 bg-primary/20 rounded-full animate-pulse" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-body text-foreground font-medium flex items-center gap-1.5 justify-center">
          <MousePointerClick className="w-4 h-4 text-primary" />
          Click on the map to pin your location
        </p>
        <p className="text-xs text-muted-foreground font-body">
          Just like Google Maps — tap to place your marker
        </p>
      </div>
    </div>
  );
};

/* ─── Interactive Map (Mock) ─────────────────── */
const InteractiveMap = ({
  pin,
  onPin,
}: {
  pin: PinLocation | null;
  onPin: (loc: PinLocation) => void;
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const lat = 90 - (y / rect.height) * 180;
    const lng = (x / rect.width) * 360 - 180;
    onPin({ lat: Math.round(lat * 1000) / 1000, lng: Math.round(lng * 1000) / 1000 });
  };

  return (
    <div
      className="relative w-full aspect-[16/9] bg-muted rounded-xl border-2 border-dashed border-border cursor-crosshair overflow-hidden group"
      onClick={handleClick}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-5">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="border border-border/20" />
        ))}
      </div>
      {/* Landmass shapes */}
      <div className="absolute top-[15%] left-[20%] w-[25%] h-[30%] bg-primary/10 rounded-[40%]" />
      <div className="absolute top-[25%] left-[55%] w-[20%] h-[35%] bg-primary/10 rounded-[40%]" />
      <div className="absolute bottom-[15%] left-[35%] w-[15%] h-[20%] bg-primary/10 rounded-[40%]" />
      {/* Crosshair guide on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="text-xs text-muted-foreground font-body bg-card/80 px-2 py-1 rounded">Click to pin</div>
      </div>
      {/* Pin */}
      {pin && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full animate-fade-in"
          style={{
            left: `${((pin.lng + 180) / 360) * 100}%`,
            top: `${((90 - pin.lat) / 180) * 100}%`,
          }}
        >
          <MapPin className="w-7 h-7 text-primary drop-shadow-lg" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-primary/30 rounded-full" />
        </div>
      )}
    </div>
  );
};

/* ─── Camera Type Modal ───────────────────────── */
const CameraTypeModal = ({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (type: "wired" | "wireless") => void;
}) => (
  <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="font-display">Add Camera</DialogTitle>
        <DialogDescription className="font-body">
          Choose the camera connection type
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4 py-4">
        <button
          onClick={() => onSelect("wired")}
          className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Cable className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm font-body font-semibold text-foreground">Wired</span>
          <span className="text-xs text-muted-foreground font-body">Ethernet / PoE</span>
        </button>
        <button
          onClick={() => onSelect("wireless")}
          className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Wifi className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm font-body font-semibold text-foreground">Wireless</span>
          <span className="text-xs text-muted-foreground font-body">Wi-Fi / Cellular</span>
        </button>
      </div>
    </DialogContent>
  </Dialog>
);

/* ─── Editable Field ──────────────────────────── */
const EditableField = ({
  label,
  value,
  onSave,
  type = "text",
}: {
  label: string;
  value: string;
  onSave: (v: string) => void;
  type?: string;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (editing) {
    return (
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground font-body">{label}</Label>
        <div className="flex gap-1.5">
          {type === "textarea" ? (
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="text-sm h-16 font-body"
              autoFocus
            />
          ) : (
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="text-sm h-8 font-body"
              autoFocus
            />
          )}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 shrink-0 text-primary"
            onClick={() => {
              onSave(draft);
              setEditing(false);
            }}
          >
            <Check className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 shrink-0"
            onClick={() => {
              setDraft(value);
              setEditing(false);
            }}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0.5 group">
      <Label className="text-xs text-muted-foreground font-body">{label}</Label>
      <div
        className="flex items-center gap-1.5 cursor-pointer hover:bg-muted/50 rounded px-1.5 py-1 -mx-1.5 transition-colors"
        onClick={() => setEditing(true)}
      >
        <span className="text-sm font-body text-foreground flex-1">
          {value || <span className="text-muted-foreground italic">Not set</span>}
        </span>
        <Pencil className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

/* ─── User Search Dropdown ───────────────────── */
const UserSearchDropdown = ({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (users: string[]) => void;
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = MOCK_USERS.filter(
    (u) => u.toLowerCase().includes(search.toLowerCase()) && !selected.includes(u)
  );

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-body text-foreground">Share Dashboard</Label>
      <div className="relative">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          className="font-body text-sm"
        />
        {open && filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filtered.map((u) => (
              <button
                key={u}
                className="w-full text-left px-3 py-2 text-sm font-body hover:bg-muted transition-colors"
                onMouseDown={() => {
                  onChange([...selected, u]);
                  setSearch("");
                  setOpen(false);
                }}
              >
                {u}
              </button>
            ))}
          </div>
        )}
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((u) => (
            <Badge
              key={u}
              variant="secondary"
              className="gap-1 text-xs font-body cursor-pointer"
              onClick={() => onChange(selected.filter((s) => s !== u))}
            >
              {u}
              <X className="w-3 h-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Tags Input ─────────────────────────────── */
const TagsInput = ({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) => {
  const [input, setInput] = useState("");

  const addTag = () => {
    const t = input.trim();
    if (t && !tags.includes(t)) {
      onChange([...tags, t]);
    }
    setInput("");
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-body text-foreground">Tags</Label>
      <div className="flex gap-1.5">
        <Input
          placeholder="Add tag..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          className="font-body text-sm"
        />
        <Button type="button" variant="outline" size="sm" onClick={addTag} className="shrink-0 font-body">
          Add
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <Badge
              key={t}
              variant="outline"
              className="gap-1 text-xs font-body cursor-pointer border-primary/30 text-primary"
              onClick={() => onChange(tags.filter((x) => x !== t))}
            >
              {t}
              <X className="w-3 h-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════ */
/* ─── Main Page Component ─────────────────────── */
/* ═══════════════════════════════════════════════ */
const CreateDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("form");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCameraTypeModal, setShowCameraTypeModal] = useState(false);
  const [showMapAnimation, setShowMapAnimation] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  const [formData, setFormData] = useState<DashboardFormData>({
    name: "",
    description: "",
    country: "",
    place: "",
    sharedWith: [],
    tags: [],
  });

  const [pin, setPin] = useState<PinLocation | null>(null);
  const [cameras, setCameras] = useState<CameraItem[]>([]);

  // Track dirty state
  useEffect(() => {
    if (formData.name || formData.description || cameras.length > 0) {
      setIsDirty(true);
    }
  }, [formData, cameras]);

  // Beforeunload warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const updateForm = (partial: Partial<DashboardFormData>) =>
    setFormData((prev) => ({ ...prev, ...partial }));

  const handleFormSubmit = () => {
    if (!formData.name.trim()) return;
    setStep("map");
    setShowMapAnimation(true);
  };

  const handleMapConfirm = () => {
    if (!pin) return;
    setStep("setup");
  };

  const handleAddCamera = (type: "wired" | "wireless") => {
    const id = `cam-${Date.now()}`;
    setCameras((prev) => [
      ...prev,
      { id, name: `Camera ${prev.length + 1}`, type },
    ]);
    setShowCameraTypeModal(false);
  };

  const handleSave = () => {
    // Mock save — would persist to DB
    navigate("/home");
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelConfirm(true);
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />

      {/* ─── Step 1: Form Modal ─────────────────── */}
      <Dialog open={step === "form"} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Create Dashboard</DialogTitle>
            <DialogDescription className="font-body">
              Set up your new wildlife monitoring dashboard
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-body">Dashboard Name *</Label>
              <Input
                placeholder="e.g. Serengeti Watchtower"
                value={formData.name}
                onChange={(e) => updateForm({ name: e.target.value })}
                className="font-body"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-body">Description</Label>
              <Textarea
                placeholder="Brief description of this dashboard..."
                value={formData.description}
                onChange={(e) => updateForm({ description: e.target.value })}
                className="font-body h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-body">Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(v) => updateForm({ country: v })}
                >
                  <SelectTrigger className="font-body">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Kenya", "Brazil", "Indonesia", "USA", "Canada", "India", "Australia", "South Africa"].map((c) => (
                      <SelectItem key={c} value={c} className="font-body">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-body">Place</Label>
                <Input
                  placeholder="e.g. Masai Mara"
                  value={formData.place}
                  onChange={(e) => updateForm({ place: e.target.value })}
                  className="font-body"
                />
              </div>
            </div>

            <UserSearchDropdown
              selected={formData.sharedWith}
              onChange={(users) => updateForm({ sharedWith: users })}
            />

            <TagsInput
              tags={formData.tags}
              onChange={(tags) => updateForm({ tags })}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="font-body"
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              disabled={!formData.name.trim()}
              className="font-body bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Next: Pin Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Step 2: Map Pin Modal ─────────────── */}
      <Dialog open={step === "map"} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-2xl [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Pin Your Location
            </DialogTitle>
            <DialogDescription className="font-body">
              {formData.place ? `${formData.place}, ${formData.country}` : formData.country || "Select a location on the map"}
            </DialogDescription>
          </DialogHeader>

          {showMapAnimation ? (
            <MapPinAnimation onComplete={() => setShowMapAnimation(false)} />
          ) : (
            <div className="space-y-3">
              <InteractiveMap pin={pin} onPin={setPin} />
              {pin && (
                <p className="text-xs text-muted-foreground font-body text-center">
                  📍 {pin.lat}°, {pin.lng}° — click again to adjust
                </p>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setStep("form")} className="font-body">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back
            </Button>
            <Button
              onClick={handleMapConfirm}
              disabled={!pin}
              className="font-body bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Confirm Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Step 3: Setup (Camera + Info) ─────── */}
      {step === "setup" && (
        <div className="pt-16 min-h-screen">
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-3.5rem)]">
            {/* Left: Cameras */}
            <div className="flex-1 p-6 md:p-8 border-r border-border">
              <h2 className="text-xl font-display font-bold text-foreground mb-1">
                Add Cameras
              </h2>
              <p className="text-sm text-muted-foreground font-body mb-6">
                Add cameras to your dashboard for monitoring
              </p>

              {/* Add camera button */}
              <button
                onClick={() => setShowCameraTypeModal(true)}
                className="w-full aspect-[3/1.5] border-2 border-dashed border-primary/50 rounded-xl bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all flex flex-col items-center justify-center gap-3 group mb-6"
              >
                <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                  <Plus className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm font-body font-semibold text-primary">
                  Add Camera
                </span>
              </button>

              {/* Camera list */}
              <div className="space-y-3">
                {cameras.map((cam) => (
                  <Card
                    key={cam.id}
                    className="p-4 bg-card border-border flex items-center gap-4"
                  >
                    <div className="w-20 h-14 bg-muted rounded-md flex items-center justify-center shrink-0">
                      <Camera className="w-5 h-5 text-muted-foreground opacity-50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body font-semibold text-foreground truncate">
                        {cam.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {cam.type === "wired" ? (
                          <Cable className="w-3 h-3 text-muted-foreground" />
                        ) : (
                          <Wifi className="w-3 h-3 text-muted-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground font-body capitalize">
                          {cam.type}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() =>
                        setCameras((prev) => prev.filter((c) => c.id !== cam.id))
                      }
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right: Dashboard Info (editable) */}
            <div className="lg:w-[400px] xl:w-[440px] shrink-0 p-6 md:p-8 bg-card/50">
              <h2 className="text-xl font-display font-bold text-foreground mb-1">
                Dashboard Info
              </h2>
              <p className="text-sm text-muted-foreground font-body mb-6">
                Click any field to edit
              </p>

              <div className="space-y-4">
                <EditableField
                  label="Name"
                  value={formData.name}
                  onSave={(v) => updateForm({ name: v })}
                />
                <EditableField
                  label="Description"
                  value={formData.description}
                  onSave={(v) => updateForm({ description: v })}
                  type="textarea"
                />
                <EditableField
                  label="Country"
                  value={formData.country}
                  onSave={(v) => updateForm({ country: v })}
                />
                <EditableField
                  label="Place"
                  value={formData.place}
                  onSave={(v) => updateForm({ place: v })}
                />

                {/* Location pin */}
                <div className="space-y-0.5">
                  <Label className="text-xs text-muted-foreground font-body">
                    Coordinates
                  </Label>
                  <p className="text-sm font-body text-foreground px-1.5 py-1">
                    {pin ? `${pin.lat}°, ${pin.lng}°` : "Not set"}
                  </p>
                </div>

                {/* Shared with */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-body">
                    Shared With
                  </Label>
                  <div className="flex flex-wrap gap-1 px-1.5">
                    {formData.sharedWith.length > 0 ? (
                      formData.sharedWith.map((u) => (
                        <Badge key={u} variant="secondary" className="text-xs font-body">
                          {u}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground italic font-body">
                        Not shared
                      </span>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-body">
                    Tags
                  </Label>
                  <div className="flex flex-wrap gap-1 px-1.5">
                    {formData.tags.length > 0 ? (
                      formData.tags.map((t) => (
                        <Badge
                          key={t}
                          variant="outline"
                          className="text-xs font-body border-primary/30 text-primary"
                        >
                          {t}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground italic font-body">
                        No tags
                      </span>
                    )}
                  </div>
                </div>

                {/* Cameras count */}
                <div className="space-y-0.5">
                  <Label className="text-xs text-muted-foreground font-body">
                    Cameras
                  </Label>
                  <p className="text-sm font-body text-foreground px-1.5 py-1">
                    {cameras.length} camera{cameras.length !== 1 ? "s" : ""} added
                  </p>
                </div>

                {/* Created info */}
                <div className="space-y-0.5">
                  <Label className="text-xs text-muted-foreground font-body">
                    Created By
                  </Label>
                  <p className="text-sm font-body text-foreground px-1.5 py-1">
                    {user?.name || "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-card/80 backdrop-blur border-t border-border px-6 py-4 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="font-body"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="font-body bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Dashboard
            </Button>
          </div>
        </div>
      )}

      {/* Camera Type Modal */}
      <CameraTypeModal
        open={showCameraTypeModal}
        onClose={() => setShowCameraTypeModal(false)}
        onSelect={handleAddCamera}
      />

      {/* Cancel Confirmation */}
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Discard changes?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              All unsaved data will be lost. Are you sure you want to leave?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-body">
              No, stay
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => navigate("/home")}
              className="font-body bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CreateDashboard;
