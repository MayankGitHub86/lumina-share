import { useState } from "react";
import { Bookmark, Folder, Clock, Trash2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { ProblemCard } from "@/components/ProblemCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/context/auth";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const Saved = () => {
  const [activeCollection, setActiveCollection] = useState("all");
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch saved questions
  const { data: savedQuestionsData, isLoading } = useQuery({
    queryKey: ["saved-questions", user?.id],
    queryFn: async () => {
      if (!user?.id) return { data: [] };
      const res: any = await api.getSavedQuestions(user.id);
      return res;
    },
    enabled: !!user?.id,
  });

  const savedProblems = savedQuestionsData?.data || [];

  // Unsave mutation
  const unsaveMutation = useMutation({
    mutationFn: (questionId: string) => api.unsaveQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-questions"] });
    },
  });

  const handleUnsave = (questionId: string) => {
    unsaveMutation.mutate(questionId);
  };

  const collections = [
    { id: "all", label: "All Saved", count: savedProblems.length, icon: Bookmark },
  ];

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
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading saved questions...</p>
                </div>
              ) : savedProblems.length > 0 ? (
                <div className="space-y-4">
                  {savedProblems.map((problem: any) => {
                    const formattedProblem = {
                      id: problem.id,
                      title: problem.title,
                      preview: problem.content?.substring(0, 200) || "",
                      author: problem.author,
                      tags: problem.tags?.map((t: any) => t.name) || [],
                      votes: problem._count?.votes || 0,
                      answers: problem._count?.answers || 0,
                      views: problem.views || 0,
                      timeAgo: formatDistanceToNow(new Date(problem.createdAt), { addSuffix: true }),
                      isSolved: problem.acceptedAnswerId !== null,
                      isSaved: true,
                      savedAt: new Date(problem.savedAt).toLocaleDateString(),
                    };

                    return (
                      <div key={problem.id} className="relative group">
                        <ProblemCard {...formattedProblem} />
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleUnsave(problem.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="absolute top-4 right-14 text-xs text-muted-foreground">
                          Saved {formattedProblem.savedAt}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="glass rounded-2xl p-12 text-center">
                  <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No saved items yet</h3>
                  <p className="text-muted-foreground mb-4">Start bookmarking problems to access them later</p>
                  <Button variant="outline" onClick={() => navigate("/explore")}>Explore Problems</Button>
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
