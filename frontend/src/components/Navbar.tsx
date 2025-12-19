import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, Sparkles, Home, Compass, Users, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationPanel } from "@/components/NotificationPanel";
import { AskQuestionDialog } from "@/components/AskQuestionDialog";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/community", label: "Community", icon: Users },
  { href: "/saved", label: "Saved", icon: Bookmark },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isAskDialogOpen, setIsAskDialogOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="glass-strong border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Sparkles className="w-5 h-5 text-background" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-secondary blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              </div>
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

              {/* Notifications */}
              <NotificationPanel />

              {/* Auth */}
              <Link to="/login" className="hidden sm:block">
                <Button variant="outline" size="sm" className="border-white/20">Log In</Button>
              </Link>
              <Link to="/signup" className="hidden sm:block">
                <Button variant="hero" size="sm">Sign Up</Button>
              </Link>

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
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => { setIsOpen(false); }}>
                  <Link to="/login" className="w-full h-full block">Log In</Link>
                </Button>
                <Button variant="hero" onClick={() => { setIsOpen(false); }}>
                  <Link to="/signup" className="w-full h-full block">Sign Up</Link>
                </Button>
              </div>
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
