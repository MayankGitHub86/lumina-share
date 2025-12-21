import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, TrendingUp, Clock, Flame, Grid3X3, List, Plus } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { ProblemCard } from "@/components/ProblemCard";
import { AskQuestionDialog } from "@/components/AskQuestionDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";



const filters = [
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "recent", label: "Recent", icon: Clock },
  { id: "hot", label: "Hot", icon: Flame },
];

// Backend-powered list; we fall back to empty array while loading
type QuestionItem = {
  id: string;
  title: string;
  preview: string;
  author: { name: string; avatar: string };
  tags: string[];
  votes: number;
  answers: number;
  views: number;
  isSolved: boolean;
  createdAt: string;
};

const Explore = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [activeFilter, setActiveFilter] = useState("trending");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAskDialogOpen, setIsAskDialogOpen] = useState(false);

  // Set category from URL parameter
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  // Fetch tags/categories from backend
  const { data: tagsData, isError: tagsError } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res: any = await api.getAllTags();
      return res.data;
    },
    retry: 1,
    staleTime: 30000,
  });

  const sort = useMemo(() => {
    if (activeFilter === "trending") return "views";
    if (activeFilter === "hot") return "votes";
    return "recent";
  }, [activeFilter]);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["questions", { category: activeCategory, sort }],
    queryFn: async () => {
      const res: any = await api.getAllQuestions({
        category: activeCategory !== "all" ? activeCategory : undefined,
        sort,
        page: 1,
        limit: 20,
      });
      return res.data;
    },
    retry: 1,
    staleTime: 10000,
  });

  const items: QuestionItem[] = (data?.questions || []) as QuestionItem[];

  // Build dynamic categories from tags with error handling
  const tags = (tagsData || []) as Array<{ id: string; name: string; count: number }>;
  const totalQuestions = data?.pagination?.total || tags.reduce((sum, tag) => sum + tag.count, 0);
  const categories = [
    { id: "all", label: "All", count: totalQuestions },
    ...tags.slice(0, 10).map(tag => ({
      id: tag.name,
      label: tag.name.charAt(0).toUpperCase() + tag.name.slice(1),
      count: tag.count
    }))
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 flex gap-8">
          <Sidebar />
            
            <div className="flex-1">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Explore Problems</h1>
                <p className="text-muted-foreground">Discover questions and solutions from the community</p>
              </div>

              {/* Search & Filters */}
              <div className="glass rounded-2xl p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search problems, tags, or users..."
                      className="pl-12 h-12"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex bg-muted/50 rounded-xl p-1">
                      {filters.map((filter) => {
                        const Icon = filter.icon;
                        return (
                          <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                              activeFilter === filter.id
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{filter.label}</span>
                          </button>
                        );
                      })}
                    </div>
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
                    <Button variant="glass" size="icon">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {tagsError && (
                    <div className="text-xs text-muted-foreground">Unable to load categories</div>
                  )}
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                        activeCategory === category.id
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {category.label}
                      <span className="ml-2 text-xs opacity-60">{category.count.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div className={cn(
                "gap-4",
                viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col"
              )}>
                {isLoading && (
                  <div className="text-muted-foreground">Loading questions...</div>
                )}
                {isError && (
                  <div className="text-destructive">Failed to load questions.</div>
                )}
                {!isLoading && !isError && items.length === 0 && (
                  <div className="text-muted-foreground">No questions found.</div>
                )}
                {!isLoading && !isError && items.map((q) => (
                  <ProblemCard
                    key={q.id}
                    id={q.id}
                    title={q.title}
                    preview={q.preview}
                    author={{ name: q.author.name, avatar: q.author.avatar }}
                    tags={q.tags}
                    votes={q.votes}
                    answers={q.answers}
                    views={q.views}
                    timeAgo={formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}
                    isSolved={q.isSolved}
                  />
                ))}
              </div>

              {/* Load More */}
              <div className="flex justify-center mt-8">
                <Button variant="outline" size="lg" onClick={() => refetch()} disabled={isFetching}>
                  {isFetching ? "Loading..." : "Refresh"}
                </Button>
              </div>
            </div>
          </div>
      </main>
      <Footer />

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsAskDialogOpen(true)}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all hover:scale-110 z-50"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Ask Question Dialog */}
      <AskQuestionDialog 
        open={isAskDialogOpen} 
        onOpenChange={setIsAskDialogOpen} 
      />
    </div>
  );
};

export default Explore;
