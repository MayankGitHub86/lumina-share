import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AskQuestionDialog } from "@/components/AskQuestionDialog";
import { useAuth } from "@/context/auth";
import { useNavigate } from "react-router-dom";
import { Sparkles, MessageSquare, Bookmark, TrendingUp, Award, Users, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AnimatedPage, FadeIn, StaggerContainer, StaggerItem } from "@/components/AnimatedPage";

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
    <AnimatedPage className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="flex gap-6">
            <Sidebar />
            
            <div className="flex-1 min-w-0 space-y-6">
              {/* Welcome Section */}
              <FadeIn>
                <div className="glass rounded-2xl p-8">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Welcome back, {user.name}! 👋
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Ready to share knowledge and solve problems together?
                  </p>
                </div>
              </FadeIn>

              {/* Stats Grid */}
              <StaggerContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <StaggerItem key={stat.label}>
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                              {stat.label}
                            </CardTitle>
                            <Icon className={`h-4 w-4 ${stat.color}`} />
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                          </CardContent>
                        </Card>
                      </StaggerItem>
                    );
                  })}
                </div>
              </StaggerContainer>

              {/* Quick Actions */}
              <FadeIn delay={0.3}>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Quick Actions</h2>
                  <StaggerContainer>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <StaggerItem key={action.title}>
                            <Card
                              className={`hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer group ${
                                action.featured ? 'border-primary/50 shadow-primary/10' : ''
                              }`}
                              onClick={() => action.action ? action.action() : navigate(action.href!)}
                            >
                              <CardHeader>
                                <div className="flex items-center gap-4">
                                  <div className={`p-3 rounded-lg ${action.bgColor} ${action.featured ? 'text-white' : ''}`}>
                                    <Icon className={`h-6 w-6 ${action.featured ? 'text-white' : action.color}`} />
                                  </div>
                                  <div className="flex-1">
                                    <CardTitle className={`group-hover:text-primary transition-colors ${
                                      action.featured ? 'text-primary' : ''
                                    }`}>
                                      {action.title}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                      {action.description}
                                    </CardDescription>
                                  </div>
                                </div>
                              </CardHeader>
                            </Card>
                          </StaggerItem>
                        );
                      })}
                    </div>
                  </StaggerContainer>
                </div>
              </FadeIn>

              {/* Recent Activity */}
              <FadeIn delay={0.4}>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest interactions in the community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recent activity yet. Start by exploring questions!</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate("/explore")}
                      >
                        Browse Questions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </div>
      </main>

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
    </AnimatedPage>
  );
};

export default Dashboard;
