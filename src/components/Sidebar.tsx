import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Compass, 
  Tag, 
  Users, 
  Bookmark, 
  TrendingUp,
  Award,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainLinks = [
  { href: "/", label: "Home", icon: Home },
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

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* Main Navigation */}
        <nav className="glass rounded-2xl p-4">
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
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
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
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Popular Tags */}
        <div className="glass rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 px-2">
            Popular Tags
          </h3>
          <ul className="space-y-1">
            {popularTags.map((tag) => (
              <li key={tag.name}>
                <Link
                  to={`/tags/${tag.name.toLowerCase()}`}
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
        </div>
      </div>
    </aside>
  );
}
