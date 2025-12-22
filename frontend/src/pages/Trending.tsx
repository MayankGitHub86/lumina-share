import { useState } from "react";
import { TrendingUp, Clock, Flame, Calendar } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { ProblemCard } from "@/components/ProblemCard";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { AnimatedPage, FadeIn, StaggerContainer, StaggerItem } from "@/components/AnimatedPage";
import { motion } from "framer-motion";

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
    <AnimatedPage className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="flex gap-6">
            <Sidebar />
            
            <div className="flex-1 min-w-0 space-y-6">
              {/* Header */}
              <FadeIn>
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div 
                      className="w-12 h-12 rounded-2xl bg-gradient-to-br from-warning to-destructive flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Flame className="w-6 h-6 text-background" />
                    </motion.div>
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">Trending</h1>
                      <p className="text-muted-foreground">Hottest problems right now</p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Time Filters */}
              <FadeIn delay={0.1}>
                <div className="glass rounded-2xl p-4 mb-6">
                  <div className="flex flex-wrap gap-2">
                    {timeFilters.map((filter) => {
                      const Icon = filter.icon;
                      return (
                        <motion.button
                          key={filter.id}
                          onClick={() => setActiveFilter(filter.id)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                            activeFilter === filter.id
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className="w-4 h-4" />
                          {filter.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </FadeIn>

              {/* Trending Problems */}
              <StaggerContainer>
                <div className="space-y-4">
                  {isLoading && (
                    <FadeIn>
                      <div className="glass rounded-2xl p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading trending questions...</p>
                      </div>
                    </FadeIn>
                  )}
                  {isError && (
                    <FadeIn>
                      <div className="glass rounded-2xl p-12 text-center">
                        <p className="text-destructive">Failed to load trending questions</p>
                      </div>
                    </FadeIn>
                  )}
                  {!isLoading && !isError && trendingProblems.length === 0 && (
                    <FadeIn>
                      <div className="glass rounded-2xl p-12 text-center">
                        <p className="text-muted-foreground">No trending questions found</p>
                      </div>
                    </FadeIn>
                  )}
                  {!isLoading && !isError && trendingProblems.map((problem: any, index: number) => (
                    <StaggerItem key={problem.id}>
                      <motion.div 
                        className="relative"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.div 
                          className="absolute -left-4 top-6 flex items-center gap-2"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: index * 0.1, type: "spring" }}
                        >
                          <span className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                            index === 0 && "bg-yellow-500/20 text-yellow-500",
                            index === 1 && "bg-gray-400/20 text-gray-400",
                            index === 2 && "bg-orange-500/20 text-orange-500",
                            index > 2 && "bg-muted text-muted-foreground"
                          )}>
                            {index + 1}
                          </span>
                        </motion.div>
                        <div className="ml-8">
                          <ProblemCard {...problem} />
                        </div>
                        <motion.div 
                          className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-warning/20 text-warning text-xs font-medium"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                        >
                          <TrendingUp className="w-3 h-3" />
                          {problem.trendScore}% trending
                        </motion.div>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            </div>
          </div>
        </div>
      </main>
    </AnimatedPage>
  );
};

export default Trending;
