import { useState } from "react";
import { Bookmark, Folder, Clock, Tag, MoreVertical, Trash2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { ProblemCard } from "@/components/ProblemCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const collections = [
  { id: "all", label: "All Saved", count: 24, icon: Bookmark },
  { id: "react", label: "React Resources", count: 8, icon: Folder },
  { id: "backend", label: "Backend Tips", count: 6, icon: Folder },
  { id: "later", label: "Read Later", count: 10, icon: Clock },
];

const savedProblems = [
  {
    id: 1,
    title: "How to optimize React component re-renders with useMemo and useCallback?",
    preview: "I'm building a large dashboard application and noticing performance issues. The components are re-rendering frequently even when the data hasn't changed.",
    author: { name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    tags: ["React", "Performance", "Hooks"],
    votes: 156,
    answers: 12,
    views: 3420,
    timeAgo: "2h ago",
    isSolved: true,
    savedAt: "Today",
  },
  {
    id: 2,
    title: "Understanding TypeScript generics with constraints and conditional types",
    preview: "I'm trying to create a type-safe utility function that works with different object shapes. How can I use generics effectively?",
    author: { name: "Alex Rivera", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    tags: ["TypeScript", "Generics", "Types"],
    votes: 89,
    answers: 8,
    views: 1890,
    timeAgo: "4h ago",
    isSolved: false,
    savedAt: "Yesterday",
  },
  {
    id: 3,
    title: "Best practices for handling authentication state in a Next.js application",
    preview: "What's the recommended pattern for managing auth state across server and client components in Next.js 14?",
    author: { name: "Jordan Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan" },
    tags: ["Next.js", "Authentication", "React"],
    votes: 234,
    answers: 15,
    views: 5670,
    timeAgo: "6h ago",
    isSolved: true,
    savedAt: "Yesterday",
  },
  {
    id: 4,
    title: "Implementing real-time notifications with WebSockets vs Server-Sent Events",
    preview: "Building a notification system and weighing the pros and cons of WebSockets versus SSE for a medium-sized app.",
    author: { name: "Maya Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya" },
    tags: ["WebSockets", "SSE", "Real-time"],
    votes: 67,
    answers: 6,
    views: 1234,
    timeAgo: "8h ago",
    isSolved: false,
    savedAt: "3 days ago",
  },
];

const Saved = () => {
  const [activeCollection, setActiveCollection] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <Sidebar />
            
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">Saved Items</h1>
                  <p className="text-muted-foreground">Your bookmarked problems and resources</p>
                </div>
                <Button variant="outline">
                  <Folder className="w-4 h-4 mr-2" />
                  New Collection
                </Button>
              </div>

              {/* Collections */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {collections.map((collection) => {
                  const Icon = collection.icon;
                  const isActive = activeCollection === collection.id;
                  return (
                    <button
                      key={collection.id}
                      onClick={() => setActiveCollection(collection.id)}
                      className={cn(
                        "glass rounded-2xl p-4 text-left transition-all duration-200 group",
                        isActive && "ring-2 ring-primary/50 bg-primary/5"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors",
                        isActive ? "bg-primary/20" : "bg-muted/50 group-hover:bg-muted"
                      )}>
                        <Icon className={cn(
                          "w-5 h-5",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <h3 className={cn(
                        "font-medium mb-1",
                        isActive ? "text-primary" : "text-foreground"
                      )}>
                        {collection.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">{collection.count} items</p>
                    </button>
                  );
                })}
              </div>

              {/* Saved Problems */}
              <div className="space-y-4">
                {savedProblems.map((problem) => (
                  <div key={problem.id} className="relative group">
                    <ProblemCard {...problem} />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute top-4 right-14 text-xs text-muted-foreground">
                      Saved {problem.savedAt}
                    </div>
                  </div>
                ))}
              </div>

              {savedProblems.length === 0 && (
                <div className="glass rounded-2xl p-12 text-center">
                  <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No saved items yet</h3>
                  <p className="text-muted-foreground mb-4">Start bookmarking problems to access them later</p>
                  <Button variant="outline">Explore Problems</Button>
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

export default Saved;
