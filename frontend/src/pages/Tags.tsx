import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, Grid3X3, List } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AnimatedPage, FadeIn, StaggerContainer, StaggerItem } from "@/components/AnimatedPage";
import { motion } from "framer-motion";

type Tag = {
  id: string;
  name: string;
  description?: string;
  count: number;
  createdAt: string;
};

const Tags = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"popular" | "name" | "recent">("popular");

  // Fetch tags from backend
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res: any = await api.getAllTags();
      return res.data;
    },
    staleTime: 30000, // Cache for 30 seconds
  });

  const tags: Tag[] = data || [];

  // Calculate trending tags (tags with questions created in last 7 days)
  const trendingTags = tags
    .filter(tag => {
      const tagDate = new Date(tag.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return tagDate > weekAgo && tag.count > 0;
    })
    .map(tag => tag.name);

  const filteredTags = tags
    .filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return b.count - a.count; // popular
    });

  const handleTagClick = (tagName: string) => {
    navigate(`/explore?category=${encodeURIComponent(tagName)}`);
  };

  return (
    <AnimatedPage className="min-h-screen">
      <Navbar />
      <main className="pt-16 pb-8">
        <div className="container mx-auto px-4 max-w-[1800px]">
          <div className="flex gap-4">
            <Sidebar />
            
            <div className="flex-1 min-w-0 space-y-4">
              {/* Header */}
              <FadeIn>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-2">Tags</h1>
                  <p className="text-muted-foreground">
                    Browse all topics and technologies • {tags.length} tags available
                  </p>
                </div>
              </FadeIn>

              {/* Search & Filters */}
              <FadeIn delay={0.1}>
                <div className="glass rounded-2xl p-6 mb-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                        className="h-11 px-4 rounded-xl bg-muted/50 border border-white/10 text-foreground text-sm"
                      >
                        <option value="popular">Most Popular</option>
                        <option value="name">Alphabetical</option>
                        <option value="recent">Recently Added</option>
                      </select>
                      <div className="flex bg-muted/50 rounded-xl p-1">
                        <button
                          onClick={() => setViewMode("grid")}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                          )}
                        >
                          <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode("list")}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                          )}
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Loading State */}
              {isLoading && (
                <FadeIn>
                  <div className="glass rounded-2xl p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading tags...</p>
                  </div>
                </FadeIn>
              )}

              {/* Error State */}
              {isError && (
                <FadeIn>
                  <div className="glass rounded-2xl p-12 text-center">
                    <h3 className="text-lg font-semibold text-destructive mb-2">Failed to load tags</h3>
                    <p className="text-muted-foreground">Please try again later</p>
                  </div>
                </FadeIn>
              )}

              {/* Tags Grid/List */}
              {!isLoading && !isError && (
                <StaggerContainer>
                  <div className={cn(
                    "gap-4",
                    viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col"
                  )}>
                    {filteredTags.map((tag) => {
                      const isTrending = trendingTags.includes(tag.name);
                      return (
                        <StaggerItem key={tag.id}>
                          <motion.div
                            onClick={() => handleTagClick(tag.name)}
                            className="glass card-hover rounded-2xl p-5 cursor-pointer group"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="neon" className="text-sm font-semibold">
                                  {tag.name}
                                </Badge>
                                {isTrending && (
                                  <motion.span 
                                    className="flex items-center gap-1 text-xs text-success"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                  >
                                    <TrendingUp className="w-3 h-3" />
                                    Trending
                                  </motion.span>
                                )}
                              </div>
                            </div>
                            {tag.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {tag.description}
                              </p>
                            )}
                            <div className="text-sm text-muted-foreground">
                              <span className="text-foreground font-medium">{tag.count.toLocaleString()}</span> {tag.count === 1 ? 'question' : 'questions'}
                            </div>
                          </motion.div>
                        </StaggerItem>
                      );
                    })}
                  </div>
                </StaggerContainer>
              )}

              {/* No Results */}
              {!isLoading && !isError && filteredTags.length === 0 && (
                <FadeIn>
                  <div className="glass rounded-2xl p-12 text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">No tags found</h3>
                    <p className="text-muted-foreground">Try a different search term</p>
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </div>
      </main>
    </AnimatedPage>
  );
};

export default Tags;
