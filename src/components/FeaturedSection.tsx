import { TrendingUp, Clock, Flame, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProblemCard } from "@/components/ProblemCard";
import { cn } from "@/lib/utils";
import { useState } from "react";

const filters = [
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "recent", label: "Recent", icon: Clock },
  { id: "hot", label: "Hot", icon: Flame },
];

const mockProblems = [
  {
    id: 1,
    title: "How to optimize React component re-renders with useMemo and useCallback?",
    preview: "I'm building a large dashboard application and noticing performance issues. The components are re-rendering frequently even when the data hasn't changed. What's the best approach to optimize this?",
    author: { name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    tags: ["React", "Performance", "Hooks"],
    votes: 156,
    answers: 12,
    views: 3420,
    timeAgo: "2h ago",
    isSolved: true,
  },
  {
    id: 2,
    title: "Understanding TypeScript generics with constraints and conditional types",
    preview: "I'm trying to create a type-safe utility function that works with different object shapes. How can I use generics with extends constraints and conditional types effectively?",
    author: { name: "Alex Rivera", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    tags: ["TypeScript", "Generics", "Types"],
    votes: 89,
    answers: 8,
    views: 1890,
    timeAgo: "4h ago",
    isSolved: false,
  },
  {
    id: 3,
    title: "Best practices for handling authentication state in a Next.js application",
    preview: "What's the recommended pattern for managing auth state across server and client components in Next.js 14? Should I use middleware, context, or a combination?",
    author: { name: "Jordan Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan" },
    tags: ["Next.js", "Authentication", "React"],
    votes: 234,
    answers: 15,
    views: 5670,
    timeAgo: "6h ago",
    isSolved: true,
  },
  {
    id: 4,
    title: "Implementing real-time notifications with WebSockets vs Server-Sent Events",
    preview: "Building a notification system and weighing the pros and cons of WebSockets versus SSE. Which one provides better scalability and easier implementation for a medium-sized app?",
    author: { name: "Maya Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya" },
    tags: ["WebSockets", "SSE", "Real-time"],
    votes: 67,
    answers: 6,
    views: 1234,
    timeAgo: "8h ago",
    isSolved: false,
  },
  {
    id: 5,
    title: "CSS Grid vs Flexbox: When to use which layout method?",
    preview: "I often find myself confused about when to use CSS Grid versus Flexbox. Can someone explain the ideal use cases for each and how they can be combined effectively?",
    author: { name: "Chris Taylor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris" },
    tags: ["CSS", "Grid", "Flexbox"],
    votes: 198,
    answers: 14,
    views: 4560,
    timeAgo: "12h ago",
    isSolved: true,
  },
  {
    id: 6,
    title: "Implementing efficient database queries with Prisma and PostgreSQL",
    preview: "Looking for best practices on optimizing Prisma queries for a PostgreSQL database. How can I reduce query times and implement proper indexing strategies?",
    author: { name: "Sam Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam" },
    tags: ["Prisma", "PostgreSQL", "Database"],
    votes: 145,
    answers: 11,
    views: 2890,
    timeAgo: "1d ago",
    isSolved: false,
  },
];

export function FeaturedSection() {
  const [activeFilter, setActiveFilter] = useState("trending");

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Explore Problems
              </h2>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <div className="flex bg-muted/50 rounded-xl p-1">
                  {filters.map((filter) => {
                    const Icon = filter.icon;
                    const isActive = activeFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-glow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{filter.label}</span>
                      </button>
                    );
                  })}
                </div>
                <Button variant="glass" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockProblems.map((problem, index) => (
                <ProblemCard
                  key={problem.id}
                  {...problem}
                  isLarge={index === 0}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center mt-8">
              <Button variant="outline" size="lg">
                Load More Problems
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden xl:block w-80 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Top Contributors */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Top Contributors
                </h3>
                <ul className="space-y-4">
                  {[
                    { name: "Emma Watson", points: 12543, avatar: "Emma" },
                    { name: "John Doe", points: 10234, avatar: "John" },
                    { name: "Lisa Park", points: 8976, avatar: "Lisa" },
                    { name: "Mike Chen", points: 7654, avatar: "Mike" },
                    { name: "Anna Kim", points: 6543, avatar: "Anna" },
                  ].map((user, index) => (
                    <li key={user.name} className="flex items-center gap-3">
                      <span className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                        index === 0 && "bg-yellow-500/20 text-yellow-500",
                        index === 1 && "bg-gray-400/20 text-gray-400",
                        index === 2 && "bg-orange-500/20 text-orange-500",
                        index > 2 && "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </span>
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.points.toLocaleString()} points
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trending Tags */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Trending This Week
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["AI/ML", "React 19", "Bun", "Rust", "WebGPU", "Edge Functions", "tRPC"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
