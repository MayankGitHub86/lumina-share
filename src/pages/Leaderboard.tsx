import { useState } from "react";
import { Trophy, Medal, Crown, Star, TrendingUp, Calendar } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const timeFilters = [
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "year", label: "This Year" },
  { id: "all", label: "All Time" },
];

const leaderboardData = [
  {
    rank: 1,
    name: "Emma Watson",
    username: "@emmawatson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    points: 125430,
    answers: 2341,
    acceptedRate: 94,
    streak: 127,
    badges: ["Diamond", "React Master", "Top 1%"],
  },
  {
    rank: 2,
    name: "John Doe",
    username: "@johndoe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    points: 102340,
    answers: 1892,
    acceptedRate: 91,
    streak: 89,
    badges: ["Platinum", "Node Expert"],
  },
  {
    rank: 3,
    name: "Lisa Park",
    username: "@lisapark",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    points: 89760,
    answers: 1567,
    acceptedRate: 88,
    streak: 65,
    badges: ["Gold", "AI Pioneer"],
  },
  {
    rank: 4,
    name: "Mike Chen",
    username: "@mikechen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    points: 76540,
    answers: 1456,
    acceptedRate: 85,
    streak: 43,
    badges: ["Gold", "Backend Pro"],
  },
  {
    rank: 5,
    name: "Anna Kim",
    username: "@annakim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna",
    points: 65430,
    answers: 1234,
    acceptedRate: 82,
    streak: 31,
    badges: ["Silver", "CSS Wizard"],
  },
  {
    rank: 6,
    name: "Carlos Rodriguez",
    username: "@carlosr",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    points: 54320,
    answers: 987,
    acceptedRate: 79,
    streak: 28,
    badges: ["Silver"],
  },
  {
    rank: 7,
    name: "Sophie Miller",
    username: "@sophiem",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
    points: 43210,
    answers: 876,
    acceptedRate: 76,
    streak: 21,
    badges: ["Bronze"],
  },
  {
    rank: 8,
    name: "David Lee",
    username: "@davidlee",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DavidL",
    points: 32100,
    answers: 765,
    acceptedRate: 73,
    streak: 14,
    badges: ["Bronze"],
  },
];

const Leaderboard = () => {
  const [activeFilter, setActiveFilter] = useState("month");

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-500" />;
    return <span className="text-lg font-bold text-muted-foreground">{rank}</span>;
  };

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
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-background" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
                    <p className="text-muted-foreground">Top contributors in the community</p>
                  </div>
                </div>
              </div>

              {/* Time Filters */}
              <div className="glass rounded-2xl p-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  {timeFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                        activeFilter === filter.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Top 3 Podium */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {leaderboardData.slice(0, 3).map((user, index) => {
                  const positions = [1, 0, 2]; // Silver, Gold, Bronze order for visual
                  const actualIndex = positions[index];
                  const userData = leaderboardData[actualIndex];
                  return (
                    <div
                      key={userData.rank}
                      className={cn(
                        "glass rounded-2xl p-6 text-center relative",
                        actualIndex === 0 && "ring-2 ring-yellow-500/50 bg-yellow-500/5 md:-mt-4",
                        actualIndex === 1 && "ring-2 ring-gray-400/50 bg-gray-400/5",
                        actualIndex === 2 && "ring-2 ring-orange-500/50 bg-orange-500/5"
                      )}
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        {getRankIcon(userData.rank)}
                      </div>
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
                    </div>
                  );
                })}
              </div>

              {/* Full Leaderboard */}
              <div className="glass rounded-2xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-sm font-medium text-muted-foreground">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-4">User</div>
                  <div className="col-span-2 text-right">Points</div>
                  <div className="col-span-2 text-right">Answers</div>
                  <div className="col-span-2 text-right">Accept Rate</div>
                  <div className="col-span-1 text-right">Streak</div>
                </div>
                {leaderboardData.map((user) => (
                  <div
                    key={user.rank}
                    className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 hover:bg-muted/30 transition-colors items-center"
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
                        <p className="text-xs text-muted-foreground">{user.username}</p>
                      </div>
                    </div>
                    <div className="col-span-2 text-right font-semibold text-foreground">
                      {user.points.toLocaleString()}
                    </div>
                    <div className="col-span-2 text-right text-muted-foreground">
                      {user.answers.toLocaleString()}
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-success">{user.acceptedRate}%</span>
                    </div>
                    <div className="col-span-1 text-right flex items-center justify-end gap-1">
                      <Star className="w-4 h-4 text-warning" />
                      {user.streak}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Leaderboard;
