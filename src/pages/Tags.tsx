import { useState } from "react";
import { Search, TrendingUp, Grid3X3, List } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const allTags = [
  { name: "React", count: 25431, trending: true, description: "A JavaScript library for building user interfaces" },
  { name: "TypeScript", count: 18923, trending: true, description: "Typed superset of JavaScript that compiles to plain JavaScript" },
  { name: "JavaScript", count: 32156, trending: false, description: "High-level, interpreted programming language" },
  { name: "Node.js", count: 14567, trending: true, description: "JavaScript runtime built on Chrome's V8 JavaScript engine" },
  { name: "Python", count: 28934, trending: false, description: "High-level, general-purpose programming language" },
  { name: "CSS", count: 12345, trending: false, description: "Style sheet language for describing presentation of documents" },
  { name: "Next.js", count: 9876, trending: true, description: "React framework for production-grade applications" },
  { name: "Docker", count: 7654, trending: true, description: "Platform for developing, shipping, and running applications" },
  { name: "PostgreSQL", count: 6543, trending: false, description: "Powerful, open source object-relational database system" },
  { name: "GraphQL", count: 5432, trending: true, description: "Query language for APIs and runtime for executing queries" },
  { name: "Tailwind CSS", count: 8765, trending: true, description: "Utility-first CSS framework for rapid UI development" },
  { name: "MongoDB", count: 7890, trending: false, description: "Source-available cross-platform document-oriented database" },
  { name: "AWS", count: 6789, trending: false, description: "Amazon Web Services cloud computing platform" },
  { name: "Git", count: 11234, trending: false, description: "Distributed version control system" },
  { name: "REST API", count: 9012, trending: false, description: "Architectural style for distributed hypermedia systems" },
  { name: "Redux", count: 5678, trending: false, description: "Predictable state container for JavaScript apps" },
  { name: "Vue.js", count: 8901, trending: false, description: "Progressive JavaScript framework for building UIs" },
  { name: "Kubernetes", count: 4567, trending: true, description: "Open-source container orchestration platform" },
  { name: "Machine Learning", count: 6789, trending: true, description: "AI that allows systems to learn from data" },
  { name: "WebSocket", count: 3456, trending: false, description: "Protocol for full-duplex communication channels" },
];

const Tags = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"popular" | "name" | "trending">("popular");

  const filteredTags = allTags
    .filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "trending") return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      return b.count - a.count;
    });

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
                <h1 className="text-3xl font-bold text-foreground mb-2">Tags</h1>
                <p className="text-muted-foreground">Browse all topics and technologies</p>
              </div>

              {/* Search & Filters */}
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
                      <option value="trending">Trending</option>
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

              {/* Tags Grid/List */}
              <div className={cn(
                "gap-4",
                viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col"
              )}>
                {filteredTags.map((tag) => (
                  <div
                    key={tag.name}
                    className="glass card-hover rounded-2xl p-5 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="neon" className="text-sm font-semibold">
                          {tag.name}
                        </Badge>
                        {tag.trending && (
                          <span className="flex items-center gap-1 text-xs text-success">
                            <TrendingUp className="w-3 h-3" />
                            Trending
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {tag.description}
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <span className="text-foreground font-medium">{tag.count.toLocaleString()}</span> questions
                    </div>
                  </div>
                ))}
              </div>

              {filteredTags.length === 0 && (
                <div className="glass rounded-2xl p-12 text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">No tags found</h3>
                  <p className="text-muted-foreground">Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tags;
