import { useState } from "react";
import { Search, Filter, TrendingUp, Clock, Flame, Grid3X3, List } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { ProblemCard } from "@/components/ProblemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All", count: 12543 },
  { id: "frontend", label: "Frontend", count: 3421 },
  { id: "backend", label: "Backend", count: 2876 },
  { id: "devops", label: "DevOps", count: 1234 },
  { id: "mobile", label: "Mobile", count: 987 },
  { id: "ai-ml", label: "AI/ML", count: 2156 },
  { id: "database", label: "Database", count: 1869 },
];

const filters = [
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "recent", label: "Recent", icon: Clock },
  { id: "hot", label: "Hot", icon: Flame },
];

const mockProblems = [
  {
    id: 1,
    title: "How to implement infinite scroll with React Query and intersection observer?",
    preview: "I'm building a feed that needs to load more content as the user scrolls. What's the best approach combining React Query with intersection observer?",
    author: { name: "David Kim", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" },
    tags: ["React", "React Query", "Performance"],
    votes: 234,
    answers: 18,
    views: 5670,
    timeAgo: "3h ago",
    isSolved: true,
  },
  {
    id: 2,
    title: "Best practices for error handling in Express.js middleware",
    preview: "Looking for a comprehensive error handling strategy for my Express application. How should I structure error middleware and handle async errors?",
    author: { name: "Emily Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily" },
    tags: ["Node.js", "Express", "Error Handling"],
    votes: 178,
    answers: 12,
    views: 3450,
    timeAgo: "5h ago",
    isSolved: false,
  },
  {
    id: 3,
    title: "Docker compose networking between containers not working",
    preview: "My containers can't communicate with each other in Docker compose. I've set up a network but still getting connection refused errors.",
    author: { name: "Marcus Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" },
    tags: ["Docker", "DevOps", "Networking"],
    votes: 145,
    answers: 9,
    views: 2890,
    timeAgo: "8h ago",
    isSolved: true,
  },
  {
    id: 4,
    title: "Implementing OAuth 2.0 with PKCE flow in a React Native app",
    preview: "Need guidance on implementing secure OAuth authentication in React Native using the PKCE flow. What libraries work best?",
    author: { name: "Sophia Williams", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia" },
    tags: ["React Native", "OAuth", "Security"],
    votes: 167,
    answers: 14,
    views: 4120,
    timeAgo: "12h ago",
    isSolved: false,
  },
  {
    id: 5,
    title: "Fine-tuning GPT models for domain-specific tasks",
    preview: "What's the recommended approach for fine-tuning large language models for specialized domains? Looking for best practices and cost optimization.",
    author: { name: "Alex Turner", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexT" },
    tags: ["AI", "GPT", "Machine Learning"],
    votes: 289,
    answers: 21,
    views: 7890,
    timeAgo: "1d ago",
    isSolved: true,
  },
  {
    id: 6,
    title: "Optimizing PostgreSQL queries with complex joins and aggregations",
    preview: "My queries are taking too long with multiple joins and group by clauses. How can I optimize performance without denormalizing?",
    author: { name: "Rachel Green", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel" },
    tags: ["PostgreSQL", "Database", "Performance"],
    votes: 198,
    answers: 16,
    views: 4560,
    timeAgo: "1d ago",
    isSolved: false,
  },
];

const Explore = () => {
  const [activeFilter, setActiveFilter] = useState("trending");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
                {mockProblems.map((problem) => (
                  <ProblemCard key={problem.id} {...problem} />
                ))}
              </div>

              {/* Load More */}
              <div className="flex justify-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Problems
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;
