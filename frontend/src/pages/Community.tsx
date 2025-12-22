import { useState } from "react";
import { Users, Trophy, MessageCircle, Star, Search, Filter, Plus } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { AskQuestionDialog } from "@/components/AskQuestionDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AnimatedPage, FadeIn, StaggerContainer, StaggerItem } from "@/components/AnimatedPage";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { motion } from "framer-motion";

const tabs = [
  { id: "members", label: "Members", icon: Users },
  { id: "top", label: "Top Contributors", icon: Trophy },
];

type User = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  points: number;
  isOnline: boolean;
  _count: {
    questions: number;
    answers: number;
    badges: number;
  };
};

const Community = () => {
  const [activeTab, setActiveTab] = useState("members");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAskDialogOpen, setIsAskDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Fetch users from backend
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", { page, search: searchQuery, sort: activeTab === "top" ? "points" : "recent" }],
    queryFn: async () => {
      const res: any = await api.getAllUsers({
        page,
        limit: 12,
        search: searchQuery || undefined,
      });
      return res.data;
    },
    staleTime: 30000,
  });

  // Fetch community stats
  const { data: statsData } = useQuery({
    queryKey: ["community-stats"],
    queryFn: async () => {
      // Get total users count
      const usersRes: any = await api.getAllUsers({ page: 1, limit: 1 });
      const totalUsers = usersRes.data.pagination.total;

      // Get total questions
      const questionsRes: any = await api.getAllQuestions({ page: 1, limit: 1 });
      const totalQuestions = questionsRes.data.pagination?.total || 0;

      // Count online users
      const onlineUsers = data?.users?.filter((u: User) => u.isOnline).length || 0;

      return {
        totalUsers,
        totalQuestions,
        onlineUsers,
        topContributors: Math.floor(totalUsers * 0.1), // Estimate 10% are top contributors
      };
    },
    staleTime: 60000,
  });

  const users: User[] = data?.users || [];
  const pagination = data?.pagination;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset to first page on search
  };

  const handleLoadMore = () => {
    if (pagination && page < pagination.totalPages) {
      setPage(page + 1);
    }
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
                <div className="glass rounded-2xl p-8">
                  <h1 className="text-3xl font-bold text-foreground mb-2">Community</h1>
                  <p className="text-muted-foreground">Connect with developers and experts from around the world</p>
                </div>
              </FadeIn>

              {/* Stats */}
              <FadeIn delay={0.1}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Members", value: statsData?.totalUsers?.toLocaleString() || "0", icon: Users },
                    { label: "Questions", value: statsData?.totalQuestions?.toLocaleString() || "0", icon: MessageCircle },
                    { label: "Active Today", value: statsData?.onlineUsers?.toLocaleString() || "0", icon: Star },
                    { label: "Top Contributors", value: statsData?.topContributors?.toLocaleString() || "0", icon: Trophy },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div 
                        key={stat.label} 
                        className="glass rounded-2xl p-6 text-center"
                        whileHover={{ scale: 1.02, y: -2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                        <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </FadeIn>

              {/* Search & Tabs */}
              <FadeIn delay={0.2}>
                <div className="glass rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search members by name or username..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-12"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <motion.button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                            activeTab === tab.id
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className="w-4 h-4" />
                          {tab.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </FadeIn>

              {/* Loading State */}
              {isLoading && (
                <FadeIn>
                  <div className="glass rounded-2xl p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading community members...</p>
                  </div>
                </FadeIn>
              )}

              {/* Error State */}
              {isError && (
                <FadeIn>
                  <div className="glass rounded-2xl p-12 text-center">
                    <h3 className="text-lg font-semibold text-destructive mb-2">Failed to load members</h3>
                    <p className="text-muted-foreground">Please try again later</p>
                  </div>
                </FadeIn>
              )}

              {/* Members Grid */}
              {!isLoading && !isError && (
                <StaggerContainer>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {users.map((member, index) => (
                      <StaggerItem key={member.id}>
                        <motion.div
                          className="glass card-hover rounded-2xl p-6 group cursor-pointer"
                          whileHover={{ scale: 1.02, y: -2 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="flex gap-4">
                            <div className="relative">
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-16 h-16 rounded-2xl ring-2 ring-white/10"
                              />
                              {member.isOnline && (
                                <motion.span 
                                  className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-card"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: index * 0.05 }}
                                />
                              )}
                              <motion.span 
                                className={cn(
                                  "absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                                  index === 0 && "bg-yellow-500/20 text-yellow-500",
                                  index === 1 && "bg-gray-400/20 text-gray-400",
                                  index === 2 && "bg-orange-500/20 text-orange-500",
                                  index > 2 && "bg-muted text-muted-foreground"
                                )}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: index * 0.05, type: "spring" }}
                              >
                                {(page - 1) * 12 + index + 1}
                              </motion.span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                  {member.name}
                                </h3>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">@{member.username}</p>
                              {member.bio && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{member.bio}</p>
                              )}
                              
                              {member._count.badges > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <Badge variant="neon" className="text-xs">
                                    {member._count.badges} {member._count.badges === 1 ? 'Badge' : 'Badges'}
                                  </Badge>
                                </div>
                              )}

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Trophy className="w-4 h-4 text-primary" />
                                  {member.points.toLocaleString()}
                                </span>
                                <span>{member._count.answers} answers</span>
                                <span>{member._count.questions} questions</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerContainer>
              )}

              {/* No Results */}
              {!isLoading && !isError && users.length === 0 && (
                <FadeIn>
                  <div className="glass rounded-2xl p-12 text-center">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No members found</h3>
                    <p className="text-muted-foreground">Try adjusting your search query</p>
                  </div>
                </FadeIn>
              )}

              {/* Load More */}
              {!isLoading && !isError && pagination && page < pagination.totalPages && (
                <FadeIn>
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={handleLoadMore}
                    >
                      Load More Members ({pagination.total - (page * 12)} remaining)
                    </Button>
                  </div>
                </FadeIn>
              )}

              {/* Pagination Info */}
              {!isLoading && !isError && pagination && (
                <FadeIn>
                  <div className="text-center text-sm text-muted-foreground">
                    Showing {users.length} of {pagination.total} members
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <Button
          onClick={() => setIsAskDialogOpen(true)}
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all hover:scale-110 z-50"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Ask Question Dialog */}
      <AskQuestionDialog 
        open={isAskDialogOpen} 
        onOpenChange={setIsAskDialogOpen} 
      />
    </AnimatedPage>
  );
};

export default Community;
