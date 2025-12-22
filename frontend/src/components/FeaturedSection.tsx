import { TrendingUp, Clock, Flame, Filter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProblemCard } from "@/components/ProblemCard";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const filters = [
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "recent", label: "Recent", icon: Clock },
  { id: "hot", label: "Hot", icon: Flame },
];

export function FeaturedSection() {
  const [activeFilter, setActiveFilter] = useState("trending");
  const navigate = useNavigate();

  // Fetch questions based on active filter
  const { data, isLoading } = useQuery({
    queryKey: ["homepage-questions", activeFilter],
    queryFn: async () => {
      const sort = activeFilter === "recent" ? "recent" : activeFilter === "hot" ? "votes" : "views";
      const res: any = await api.getAllQuestions({ page: 1, limit: 6, sort });
      return res.data;
    },
  });

  // Fetch top contributors
  const { data: contributors } = useQuery({
    queryKey: ["top-contributors"],
    queryFn: async () => {
      const res: any = await api.getLeaderboard("all");
      return res.data?.slice(0, 5) || [];
    },
  });

  // Fetch trending tags
  const { data: tags } = useQuery({
    queryKey: ["trending-tags"],
    queryFn: async () => {
      const res: any = await api.getAllTags();
      return res.data?.slice(0, 7) || [];
    },
  });

  const questions = data?.questions || [];

  return (
    <section className="py-12 px-4 overflow-hidden">
      <div className="container mx-auto max-w-7xl overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-6 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 min-w-0 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
              </div>
            </div>

            {/* Questions Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass rounded-xl p-6 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
                {questions.map((question: any) => (
                  <ProblemCard
                    key={question.id}
                    id={question.id}
                    title={question.title}
                    preview={question.preview || question.content?.substring(0, 150)}
                    author={question.author}
                    tags={question.tags?.map((t: any) => t.tag?.name || t.name) || []}
                    votes={question._count?.votes || 0}
                    answers={question._count?.answers || 0}
                    views={question.views || 0}
                    timeAgo={formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                    isSolved={question.acceptedAnswerId !== null}
                  />
                ))}
              </div>
            )}

            {/* View All Button */}
            <div className="flex justify-center mt-6">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/explore")}
                className="gap-2"
              >
                View All Problems
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden xl:block w-80 shrink-0">
            <div className="sticky top-24 space-y-4">
              {/* Top Contributors */}
              <motion.div 
                className="glass rounded-xl p-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Top Contributors
                </h3>
                <ul className="space-y-3">
                  {contributors?.map((user: any, index: number) => (
                    <motion.li 
                      key={user.id} 
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      whileHover={{ x: 4 }}
                      onClick={() => navigate("/community")}
                    >
                      <span className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                        index === 0 && "bg-yellow-500/20 text-yellow-500",
                        index === 1 && "bg-gray-400/20 text-gray-400",
                        index === 2 && "bg-orange-500/20 text-orange-500",
                        index > 2 && "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </span>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.points?.toLocaleString()} points
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Trending Tags */}
              <motion.div 
                className="glass rounded-xl p-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Trending Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags?.map((tag: any) => (
                    <motion.span
                      key={tag.id}
                      onClick={() => navigate(`/explore?category=${tag.name}`)}
                      className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {tag.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
