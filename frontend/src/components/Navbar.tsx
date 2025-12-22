import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, Sparkles, Home, Compass, Users, Bookmark, LogOut, LayoutDashboard, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationPanel } from "@/components/NotificationPanel";
import { AskQuestionDialog } from "@/components/AskQuestionDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/community", label: "Community", icon: Users },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/contact", label: "Contact", icon: Sparkles },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isAskDialogOpen, setIsAskDialogOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className={cn(
        "border-b transition-all duration-300",
        isScrolled ? "glass-strong border-white/5" : "border-transparent"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1 group">
              <img 
                src="/assets/Solvehub.png" 
                alt="SolveHub" 
                className="w-16 h-16 rounded-xl transition-transform duration-300 group-hover:scale-110"
              />
              <span className="font-bold text-xl hidden sm:block gradient-text">
                SolveHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      "hover:text-foreground hover:bg-muted/50",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className={cn(
                "relative transition-all duration-300",
                isSearchExpanded ? "w-64" : "w-10"
              )}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search problems..."
                    className={cn(
                      "pl-10 pr-4 h-10 transition-all duration-300",
                      isSearchExpanded 
                        ? "w-full opacity-100" 
                        : "w-10 opacity-0 cursor-pointer"
                    )}
                    onFocus={() => setIsSearchExpanded(true)}
                    onBlur={() => setIsSearchExpanded(false)}
                  />
                </div>
                {!isSearchExpanded && (
                  <button
                    onClick={() => setIsSearchExpanded(true)}
                    className="absolute inset-0 flex items-center justify-center rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <Search className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* Ask Question Button - Desktop Only */}
              {user && (
                <Button 
                  variant="default"
                  size="sm"
                  className="hidden md:flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                  onClick={() => setIsAskDialogOpen(true)}
                >
                  <Sparkles className="w-4 h-4" />
                  Ask Question
                </Button>
              )}

              {/* Notifications */}
              <NotificationPanel />

              {/* Auth - Conditional rendering */}
              {loading ? (
                <div className="h-10 w-10 rounded-full bg-muted/50 animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          @{user.username}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/login" className="hidden sm:block">
                    <Button variant="outline" size="sm" className="border-white/20">Log In</Button>
                  </Link>
                  <Link to="/signup" className="hidden sm:block">
                    <Button variant="hero" size="sm">Sign Up</Button>
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors md:hidden"
              >
                {isOpen ? (
                  <X className="w-5 h-5 text-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          isOpen ? "max-h-80 border-t border-white/5" : "max-h-0"
        )}>
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2">
              {loading ? (
                <div className="h-20 rounded-xl bg-muted/50 animate-pulse" />
              ) : user ? (
                <>
                  <div className="mb-3 p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        navigate("/dashboard");
                        setIsOpen(false);
                      }}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        navigate("/settings");
                        setIsOpen(false);
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => { setIsOpen(false); }}>
                    <Link to="/login" className="w-full h-full block">Log In</Link>
                  </Button>
                  <Button variant="hero" onClick={() => { setIsOpen(false); }}>
                    <Link to="/signup" className="w-full h-full block">Sign Up</Link>
                  </Button>
                </div>
              )}
              <Button 
                variant="secondary" 
                className="w-full mt-3"
                onClick={() => {
                  setIsAskDialogOpen(true);
                  setIsOpen(false);
                }}
              >
                Ask Question
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Ask Question Dialog */}
      <AskQuestionDialog 
        open={isAskDialogOpen} 
        onOpenChange={setIsAskDialogOpen} 
      />
    </header>
  );
}
