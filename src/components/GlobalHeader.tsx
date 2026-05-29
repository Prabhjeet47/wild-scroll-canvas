import { Leaf, Moon, Sun, User, LogIn, LogOut, Settings, Shield, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const GlobalHeader = () => {
  const { user, isLoggedIn, login, logout, toggleRole } = useAuth();
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 md:px-6 bg-card/60 backdrop-blur-xl border-b border-border/50">
      {/* Animated outline logo */}
      <button
        onClick={() => navigate(isLoggedIn ? "/home" : "/")}
        className="flex items-center gap-2 group"
      >
        <div className="relative w-8 h-8">
          <Leaf
            className="w-8 h-8 text-primary transition-all duration-500 group-hover:scale-110"
            strokeWidth={1.5}
            style={{
              strokeDasharray: 100,
              animation: "logo-draw 2s ease-out forwards",
            }}
          />
        </div>
        <span className="text-lg font-display font-bold text-foreground tracking-tight">
          WildGuard
        </span>
      </button>

      {/* Right side: theme toggle + user */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5 h-9 px-2">
              <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              {isLoggedIn && (
                <span className="hidden sm:inline text-sm font-body text-foreground">
                  {user?.name?.split(" ")[0]}
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
            {isLoggedIn ? (
              <>
                <DropdownMenuLabel className="font-body">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user?.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
                    <span className="text-xs text-primary font-medium mt-0.5 capitalize">{user?.role}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/home")} className="cursor-pointer font-body">
                  <Leaf className="w-4 h-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}} className="cursor-pointer font-body">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleRole} className="cursor-pointer font-body">
                  <Shield className="w-4 h-4 mr-2" />
                  Switch to {user?.role === "admin" ? "User" : "Admin"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="cursor-pointer font-body text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuLabel className="font-body text-sm">Not signed in</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    login("admin");
                    navigate("/home");
                  }}
                  className="cursor-pointer font-body"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign in as Admin
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    login("user");
                    navigate("/home");
                  }}
                  className="cursor-pointer font-body"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign in as User
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default GlobalHeader;
