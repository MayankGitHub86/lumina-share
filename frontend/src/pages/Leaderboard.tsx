import { useState } from "react";
import { Trophy, Medal, Crown, Star, TrendingUp, Calendar } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AnimatedPage, FadeIn, StaggerContainer, StaggerItem } from "@/components/AnimatedPage";
import { motion } from "framer-motion";

const timeFilters = [
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "year", label: "This Year" },
  { id: "all", label: "All Time" },
];

type LeaderItem = {
  rank: number;
  id: string;
  name: string;
  username: string;
  avatar: string;
  points: number;
  answers: number;
  questions: number;
  badgeCount: number;
};

const Leaderboard = () => {
  const [activeFilter, setActiveFilter] = useState("month");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["leaderboard", { period: activeFilter }],
    queryFn: async () => {
      const res: any = await api.getLeaderboard(activeFilter);
      return res.data as LeaderItem[];
    },
  });
  const leaderboardData: LeaderItem[] = data || [];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-500" />;
    return <span className="text-lg font-bold text-muted-foreground">{rank}</span>;
  };

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
                      className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Trophy className="w-6 h-6 text-background" />
                    </motion.div>
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
                      <p className="text-muted-foreground">Top contributors in the community</p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Time Filters */}
              <FadeIn delay={0.1}>
                <div className="glass rounded-2xl p-4 mb-6">
                  <div className="flex flex-wrap gap-2">
                    {timeFilters.map((filter) => (
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
                        {filter.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Top 3 Podium */}
              {!isLoading && !isError && leaderboardData.length >= 3 && (
                <FadeIn delay={0.2}>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {leaderboardData.slice(0, 3).map((user, index) => {
                      const positions = [1, 0, 2]; // Silver, Gold, Bronze order for visual
                      const actualIndex = positions[index];
                      const userData = leaderboardData[actualIndex];
                      return (
                        <motion.div
                          key={userData.rank}
                          className={cn(
                            "glass rounded-2xl p-6 text-center relative",
                            actualIndex === 0 && "ring-2 ring-yellow-500/50 bg-yellow-500/5 md:-mt-4",
                            actualIndex === 1 && "ring-2 ring-gray-400/50 bg-gray-400/5",
                            actualIndex === 2 && "ring-2 ring-orange-500/50 bg-orange-500/5"
                          )}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, type: "spring" }}
                          whileHover={{ y: -8, scale: 1.02 }}
                        >
                          <motion.div 
                            className="absolute -top-3 left-1/2 -translate-x-1/2"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                          >
                            {getRankIcon(userData.rank)}
                          </motion.div>
                          <img
                            src={userData.avatar}
                            alt={userData.name}
                            className={cn(
                              "w-16 h-16 rounded-2xl mx-auto mb-3 ring-4",
                              actualIndex === 0 && "ring-yellow-500/30",
                              actualIndex === 1 && "ring-gray-400/30",
                              actualIndex === 2 && "ring-orange-500/30"
                            )}
                          />
                          <h3 className="font-semibold text-foreground">{userData.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{userData.username}</p>
                          <div className="text-2xl font-bold gradient-text">
                            {userData.points.toLocaleString()}
                          </div>
                          <p className="text-xs text-muted-foreground">points</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </FadeIn>
              )}

              {/* Full Leaderboard */}
              <FadeIn delay={0.3}>
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-sm font-medium text-muted-foreground">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-4">User</div>
                    <div className="col-span-2 text-right">Points</div>
                    <div className="col-span-2 text-right">Answers</div>
                    <div className="col-span-2 text-right">Questions</div>
                    <div className="col-span-1 text-right">Badges</div>
                  </div>
                  {isLoading && (
                    <div className="p-12 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading leaderboard...</p>
                    </div>
                  )}
                  {isError && (
                    <div className="p-12 text-center">
                      <p className="text-destructive">Failed to load leaderboard.</p>
                    </div>
                  )}
                  <StaggerContainer>
                    {!isLoading && !isError && leaderboardData.map((user) => (
                      <StaggerItem key={`${user.rank}-${user.id}`}>
                        <motion.div
                          className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 hover:bg-muted/30 transition-colors items-center"
                          whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.05)" }}
                        >
                          <div className="col-span-1 flex items-center justify-center">
                            {getRankIcon(user.rank)}
                          </div>
                          <div className="col-span-4 flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-xl"
                            />
                            <div>
                              <p className="font-medium text-foreground">{user.name}</p>
                              <p className="text-xs text-muted-foreground">@{user.username}</p>
                            </div>
                          </div>
                          <div className="col-span-2 text-right font-semibold text-foreground">
                            {user.points.toLocaleString()}
                          </div>
                          <div className="col-span-2 text-right text-muted-foreground">
                            {user.answers?.toLocaleString?.() ?? 0}
                          </div>
                          <div className="col-span-2 text-right text-muted-foreground">
                            {user.questions?.toLocaleString?.() ?? 0}
                          </div>
                          <div className="col-span-1 text-right">
                            <span className="text-warning">{user.badgeCount ?? 0}</span>
                          </div>
                        </motion.div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </main>
    </AnimatedPage>
  );
};

export default Leaderboard;
