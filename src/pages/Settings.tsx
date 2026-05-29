import { useState } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import GlobalHeader from "@/components/GlobalHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { User, Bell, Palette, Lock, Activity, Languages } from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [requestNotif, setRequestNotif] = useState(true);

  const [language, setLanguage] = useState("en");

  const activity = [
    { id: 1, action: "Signed in", time: "Just now", ip: "192.168.1.4" },
    { id: 2, action: "Profile updated", time: "2 hours ago", ip: "192.168.1.4" },
    { id: 3, action: "Password changed", time: "3 days ago", ip: "10.0.0.21" },
    { id: 4, action: "Signed in from new device", time: "1 week ago", ip: "172.16.5.9" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <main className="pt-20 pb-10 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Manage your account, preferences, and security
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-1 mb-6 h-auto bg-muted p-1">
            <TabsTrigger value="profile" className="gap-1.5"><User className="w-3.5 h-3.5" />Profile</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5"><Bell className="w-3.5 h-3.5" />Alerts</TabsTrigger>
            <TabsTrigger value="theme" className="gap-1.5"><Palette className="w-3.5 h-3.5" />Theme</TabsTrigger>
            <TabsTrigger value="security" className="gap-1.5"><Lock className="w-3.5 h-3.5" />Security</TabsTrigger>
            <TabsTrigger value="activity" className="gap-1.5"><Activity className="w-3.5 h-3.5" />Activity</TabsTrigger>
            <TabsTrigger value="language" className="gap-1.5"><Languages className="w-3.5 h-3.5" />Language</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your public profile information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={user?.role ?? ""} disabled className="capitalize" />
                </div>
                <Button onClick={() => toast.success("Profile updated")}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Email notifications</p>
                    <p className="text-xs text-muted-foreground">Receive activity summaries by email</p>
                  </div>
                  <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Push notifications</p>
                    <p className="text-xs text-muted-foreground">Real-time alerts in your browser</p>
                  </div>
                  <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Access request alerts</p>
                    <p className="text-xs text-muted-foreground">Get notified about new dashboard access requests</p>
                  </div>
                  <Switch checked={requestNotif} onCheckedChange={setRequestNotif} />
                </div>
                <Button onClick={() => toast.success("Preferences saved")}>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Choose your preferred theme.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {["light", "dark", "system"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`p-4 rounded-lg border text-sm font-medium capitalize transition-colors ${
                        theme === t
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Password & Security</CardTitle>
                <CardDescription>Manage your password and security settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Two-factor authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch />
                </div>
                <Button onClick={() => toast.success("Password updated")}>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Account Activity</CardTitle>
                <CardDescription>Recent activity on your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {activity.map((a) => (
                    <li key={a.id} className="flex items-center justify-between p-3 rounded-md border border-border">
                      <div>
                        <p className="text-sm font-medium text-foreground">{a.action}</p>
                        <p className="text-xs text-muted-foreground">IP {a.ip}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{a.time}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle>Language</CardTitle>
                <CardDescription>Set your preferred display language.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="hi">हिन्दी</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => toast.success("Language updated")}>Save Language</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
