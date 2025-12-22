import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Compass, 
  Tag, 
  Users, 
  Bookmark, 
  TrendingUp,
  Award,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const mainLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/tags", label: "Tags", icon: Tag },
  { href: "/community", label: "Community", icon: Users },
  { href: "/saved", label: "Saved", icon: Bookmark },
];

const secondaryLinks = [
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/leaderboard", label: "Leaderboard", icon: Award },
  { href: "/settings", label: "Settings", icon: Settings },
];

const popularTags = [
  { name: "React", count: 2543 },
  { name: "TypeScript", count: 1892 },
  { name: "Node.js", count: 1456 },
  { name: "Python", count: 1234 },
  { name: "CSS", count: 987 },
];

export function Sidebar() {
  const location = useLocation();
  
  // Initialize state from localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.aside 
      className="hidden lg:block shrink-0"
      animate={{ width: isCollapsed ? "80px" : "256px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="sticky top-24 space-y-6">
        {/* Main Navigation */}
        <nav className="glass rounded-2xl p-4 relative">
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-4 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform z-10"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <ul className="space-y-1">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary shadow-glow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      isCollapsed && "justify-center"
                    )}
                    title={isCollapsed ? link.label : undefined}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {link.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-4 h-px bg-border" />

          <ul className="space-y-1">
            {secondaryLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      isCollapsed && "justify-center"
                    )}
                    title={isCollapsed ? link.label : undefined}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {link.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Popular Tags - Hide when collapsed */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div 
              className="glass rounded-2xl p-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-sm font-semibold text-foreground mb-3 px-2">
                Popular Tags
              </h3>
              <ul className="space-y-1">
                {popularTags.map((tag) => (
                  <li key={tag.name}>
                    <Link
                      to={`/explore?category=${tag.name}`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        {tag.name}
                      </span>
                      <span className="text-xs bg-muted rounded-full px-2 py-0.5">
                        {tag.count.toLocaleString()}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
