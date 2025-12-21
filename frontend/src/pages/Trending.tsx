import { useState } from "react";
import { TrendingUp, Clock, Flame, Calendar } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { ProblemCard } from "@/components/ProblemCard";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

const timeFilters = [
  { id: "today", label: "Today", icon: Clock },
  { id: "week", label: "This Week", icon: Calendar },
  { id: "month", label: "This Month", icon: Calendar },
  { id: "all", label: "All Time", icon: TrendingUp },
];

const Trending = () => {
  const [activeFilter, setActiveFilter] = useState("week");

  // Fetch trending questions from backend
  const { data, isLoading, isError } = useQuery({
    queryKey: ["trending-questions", activeFilter],
    queryFn: async () => {
      const res: any = await api.getTrendingQuestions(activeFilter);
      return res.data;
    },
  });

  const trendingProblems = (data || []).map((q: any, index: number) => ({
    id: q.id,
    title: q.title,
    preview: q.preview,
    author: q.author,
    tags: q.tags,
    votes: q.votes,
    answers: q.answers,
    views: q.views,
    timeAgo: formatDistanceToNow(new Date(q.createdAt), { addSuffix: true }),
    isSolved: q.isSolved,
    trendScore: Math.max(50, 100 - index * 5), // Calculate trend score based on position
  }));

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
                {isLoading && (
                  <div className="text-center text-muted-foreground py-8">Loading trending questions...</div>
                )}
                {isError && (
                  <div className="text-center text-destructive py-8">Failed to load trending questions</div>
                )}
                {!isLoading && !isError && trendingProblems.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">No trending questions found</div>
                )}
                {!isLoading && !isError && trendingProblems.map((problem: any, index: number) => (
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
