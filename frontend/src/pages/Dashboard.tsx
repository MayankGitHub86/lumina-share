import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AskQuestionDialog } from "@/components/AskQuestionDialog";
import { useAuth } from "@/context/auth";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  MessageSquare, 
  Bookmark, 
  TrendingUp, 
  Award, 
  Users, 
  Plus,
  Target,
  Zap,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Activity
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AnimatedPage, FadeIn, StaggerContainer, StaggerItem } from "@/components/AnimatedPage";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAskDialogOpen, setIsAskDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Fetch user stats from backend
  const { data: userStats } = useQuery({
    queryKey: ["user-stats", user.id],
    queryFn: async () => {
      const res: any = await api.getUserStats(user.id);
      return res.data;
    },
    enabled: !!user?.id,
  });

  // Fetch recent questions
  const { data: recentQuestions } = useQuery({
    queryKey: ["recent-questions"],
    queryFn: async () => {
      const res: any = await api.getAllQuestions({ page: 1, limit: 5, sort: "recent" });
      return res.data;
    },
  });

  // Fetch trending questions
  const { data: trendingQuestions } = useQuery({
    queryKey: ["trending-questions-dashboard"],
    queryFn: async () => {
      const res: any = await api.getTrendingQuestions("week");
      return res.data;
    },
  });

  const quickActions = [
    {
      title: "Ask Question",
      description: "Get help from the community by asking a question",
      icon: Plus,
      action: () => setIsAskDialogOpen(true),
      color: "text-primary",
      bgColor: "bg-gradient-to-r from-primary to-secondary",
      featured: true,
    },
    {
      title: "Explore Questions",
      description: "Browse and discover questions from the community",
      icon: Sparkles,
      href: "/explore",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Community",
      description: "Connect with other developers and share knowledge",
      icon: Users,
      href: "/community",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Saved Questions",
      description: "View your bookmarked questions and answers",
      icon: Bookmark,
      href: "/saved",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Trending",
      description: "See what's popular in the developer community",
      icon: TrendingUp,
      href: "/trending",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  const stats = [
    {
      label: "Reputation",
      value: userStats?.points || user.points || 0,
      icon: Award,
      color: "text-yellow-500",
    },
    {
      label: "Questions Asked",
      value: userStats?.questionsAsked || 0,
      icon: MessageSquare,
      color: "text-blue-500",
    },
    {
      label: "Answers Given",
      value: userStats?.answersGiven || 0,
      icon: MessageSquare,
      color: "text-green-500",
    },
    {
      label: "Saved Items",
      value: userStats?.savedItems || 0,
      icon: Bookmark,
      color: "text-purple-500",
    },
  ];

  return (
    <AnimatedPage className="min-h-screen">
      <Navbar />
      
      <main className="pt-16 pb-8">
        <div className="container mx-auto px-4 max-w-[1800px]">
          <div className="flex gap-4">
            <Sidebar />
            
            <div className="flex-1 min-w-0 space-y-4">
              {/* Compact Welcome Section */}
              <FadeIn>
                <div className="glass rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Welcome back, {user.name}! 👋
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                      Ready to share knowledge and solve problems together?
                    </p>
                  </div>
                  <Button onClick={() => setIsAskDialogOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Ask Question
                  </Button>
                </div>
              </FadeIn>

              {/* Compact Stats Grid */}
              <StaggerContainer>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <StaggerItem key={stat.label}>
                        <motion.div
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="glass rounded-xl p-4 cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Icon className={`h-5 w-5 ${stat.color}`} />
                            <Badge variant="secondary" className="text-xs">
                              {index === 0 ? "+" : ""}{stat.value}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </motion.div>
                      </StaggerItem>
                    );
                  })}
                </div>
              </StaggerContainer>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column - Quick Actions & Activity */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Quick Actions - Compact Grid */}
                  <FadeIn delay={0.2}>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Zap className="w-5 h-5 text-primary" />
                          Quick Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                              <motion.button
                                key={action.title}
                                onClick={() => action.action ? action.action() : navigate(action.href!)}
                                className={`p-3 rounded-xl text-left transition-all hover:scale-105 ${action.bgColor} ${
                                  action.featured ? 'col-span-2 md:col-span-1' : ''
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Icon className={`h-5 w-5 mb-2 ${action.color}`} />
                                <p className="font-medium text-sm">{action.title}</p>
                              </motion.button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </FadeIn>

                  {/* Recent Questions */}
                  <FadeIn delay={0.3}>
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-500" />
                            Recent Questions
                          </CardTitle>
                          <Button variant="ghost" size="sm" onClick={() => navigate("/explore")}>
                            View All
                            <ArrowUpRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {recentQuestions?.questions?.slice(0, 5).map((q: any) => (
                            <motion.div
                              key={q.id}
                              onClick={() => navigate(`/questions/${q.id}`)}
                              className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                              whileHover={{ x: 4 }}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm line-clamp-1">{q.title}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="text-xs">
                                      {q.tags?.[0]?.tag?.name || q.tags?.[0]?.name || "General"}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" />
                                    {q._count?.answers || q.answers || 0}
                                  </span>
                                  {q.isSolved && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          {(!recentQuestions?.questions || recentQuestions.questions.length === 0) && (
                            <div className="text-center py-6 text-muted-foreground text-sm">
                              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>No questions yet. Be the first to ask!</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </FadeIn>
                </div>

                {/* Right Column - Trending & Goals */}
                <div className="space-y-4">
                  {/* Daily Goals */}
                  <FadeIn delay={0.4}>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Target className="w-5 h-5 text-orange-500" />
                          Daily Goals
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Ask 1 Question</span>
                              <span className="text-muted-foreground">0/1</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-0" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Answer 2 Questions</span>
                              <span className="text-muted-foreground">0/2</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-0" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Earn 10 Points</span>
                              <span className="text-muted-foreground">0/10</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 w-0" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeIn>

                  {/* Trending This Week */}
                  <FadeIn delay={0.5}>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-orange-500" />
                          Trending
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {trendingQuestions?.slice(0, 5).map((q: any, index: number) => (
                            <motion.div
                              key={q.id}
                              onClick={() => navigate(`/questions/${q.id}`)}
                              className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                              whileHover={{ x: 4 }}
                            >
                              <span className="text-xs font-bold text-muted-foreground mt-0.5">
                                #{index + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium line-clamp-2">{q.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    {q.views} views
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          {(!trendingQuestions || trendingQuestions.length === 0) && (
                            <div className="text-center py-4 text-muted-foreground text-sm">
                              <Sparkles className="h-6 w-6 mx-auto mb-2 opacity-50" />
                              <p>No trending questions yet</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </FadeIn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Ask Question Dialog */}
      <AskQuestionDialog 
        open={isAskDialogOpen} 
        onOpenChange={setIsAskDialogOpen} 
      />
    </AnimatedPage>
  );
};

export default Dashboard;
