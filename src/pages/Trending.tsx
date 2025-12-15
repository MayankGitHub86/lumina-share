import { useState } from "react";
import { TrendingUp, Clock, Flame, Calendar } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { ProblemCard } from "@/components/ProblemCard";
import { cn } from "@/lib/utils";

const timeFilters = [
  { id: "today", label: "Today", icon: Clock },
  { id: "week", label: "This Week", icon: Calendar },
  { id: "month", label: "This Month", icon: Calendar },
  { id: "all", label: "All Time", icon: TrendingUp },
];

const trendingProblems = [
  {
    id: 1,
    title: "How to implement server-side rendering with React 19 and streaming?",
    preview: "With the new React 19 features, I'm trying to understand the best practices for implementing SSR with streaming. What's the recommended approach?",
    author: { name: "Kevin Zhang", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin" },
    tags: ["React 19", "SSR", "Streaming"],
    votes: 567,
    answers: 34,
    views: 12450,
    timeAgo: "6h ago",
    isSolved: true,
    trendScore: 98,
  },
  {
    id: 2,
    title: "Understanding the new use() hook in React 19",
    preview: "Can someone explain the new use() hook and when to use it instead of useEffect or useSuspense?",
    author: { name: "Maria Garcia", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" },
    tags: ["React 19", "Hooks", "use()"],
    votes: 432,
    answers: 28,
    views: 9870,
    timeAgo: "12h ago",
    isSolved: true,
    trendScore: 94,
  },
  {
    id: 3,
    title: "Bun vs Node.js: Performance benchmarks for production APIs",
    preview: "I'm considering migrating our API from Node.js to Bun. Has anyone done extensive benchmarks for real-world production workloads?",
    author: { name: "James Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James" },
    tags: ["Bun", "Node.js", "Performance"],
    votes: 389,
    answers: 21,
    views: 8760,
    timeAgo: "1d ago",
    isSolved: false,
    trendScore: 89,
  },
  {
    id: 4,
    title: "Building AI agents with LangChain and GPT-4 Turbo",
    preview: "Looking for best practices on building autonomous AI agents that can perform complex multi-step tasks using LangChain.",
    author: { name: "Priya Sharma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
    tags: ["AI", "LangChain", "GPT-4"],
    votes: 345,
    answers: 19,
    views: 7650,
    timeAgo: "1d ago",
    isSolved: true,
    trendScore: 85,
  },
  {
    id: 5,
    title: "Implementing edge computing with Cloudflare Workers",
    preview: "What are the best patterns for deploying serverless functions at the edge with Cloudflare Workers for global low-latency APIs?",
    author: { name: "Tom Brown", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom" },
    tags: ["Edge Computing", "Cloudflare", "Serverless"],
    votes: 298,
    answers: 16,
    views: 6540,
    timeAgo: "2d ago",
    isSolved: false,
    trendScore: 78,
  },
];

const Trending = () => {
  const [activeFilter, setActiveFilter] = useState("week");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <Sidebar />
            
            <div className="flex-1">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-warning to-destructive flex items-center justify-center">
                    <Flame className="w-6 h-6 text-background" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Trending</h1>
                    <p className="text-muted-foreground">Hottest problems right now</p>
                  </div>
                </div>
              </div>

              {/* Time Filters */}
              <div className="glass rounded-2xl p-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  {timeFilters.map((filter) => {
                    const Icon = filter.icon;
                    return (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                          activeFilter === filter.id
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trending Problems */}
              <div className="space-y-4">
                {trendingProblems.map((problem, index) => (
                  <div key={problem.id} className="relative">
                    <div className="absolute -left-4 top-6 flex items-center gap-2">
                      <span className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                        index === 0 && "bg-yellow-500/20 text-yellow-500",
                        index === 1 && "bg-gray-400/20 text-gray-400",
                        index === 2 && "bg-orange-500/20 text-orange-500",
                        index > 2 && "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </span>
                    </div>
                    <div className="ml-8">
                      <ProblemCard {...problem} />
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-warning/20 text-warning text-xs font-medium">
                      <TrendingUp className="w-3 h-3" />
                      {problem.trendScore}% trending
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Trending;
