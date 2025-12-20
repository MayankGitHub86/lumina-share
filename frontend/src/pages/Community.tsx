import { useState } from "react";
import { Users, Trophy, MessageCircle, Star, Search, Filter, Plus } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { AskQuestionDialog } from "@/components/AskQuestionDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "members", label: "Members", icon: Users },
  { id: "top", label: "Top Contributors", icon: Trophy },
  { id: "discussions", label: "Discussions", icon: MessageCircle },
];

const members = [
  {
    id: 1,
    name: "Emma Watson",
    username: "@emmawatson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    bio: "Full-stack developer passionate about React and Node.js",
    points: 12543,
    answers: 234,
    questions: 45,
    badges: ["Gold Contributor", "React Expert"],
    isOnline: true,
  },
  {
    id: 2,
    name: "John Doe",
    username: "@johndoe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    bio: "DevOps engineer | Cloud architect | Open source enthusiast",
    points: 10234,
    answers: 189,
    questions: 32,
    badges: ["Silver Contributor", "DevOps Master"],
    isOnline: true,
  },
  {
    id: 3,
    name: "Lisa Park",
    username: "@lisapark",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    bio: "AI/ML researcher exploring the frontiers of deep learning",
    points: 8976,
    answers: 156,
    questions: 67,
    badges: ["AI Pioneer", "Helpful"],
    isOnline: false,
  },
  {
    id: 4,
    name: "Mike Chen",
    username: "@mikechen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    bio: "Backend developer specializing in distributed systems",
    points: 7654,
    answers: 145,
    questions: 23,
    badges: ["Backend Pro"],
    isOnline: true,
  },
  {
    id: 5,
    name: "Anna Kim",
    username: "@annakim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna",
    bio: "Frontend developer | UI/UX enthusiast | Design systems",
    points: 6543,
    answers: 123,
    questions: 56,
    badges: ["CSS Wizard", "Design Expert"],
    isOnline: false,
  },
  {
    id: 6,
    name: "Carlos Rodriguez",
    username: "@carlosr",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    bio: "Mobile developer building beautiful iOS and Android apps",
    points: 5432,
    answers: 98,
    questions: 34,
    badges: ["Mobile Expert"],
    isOnline: true,
  },
];

const Community = () => {
  const [activeTab, setActiveTab] = useState("members");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAskDialogOpen, setIsAskDialogOpen] = useState(false);

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
                <h1 className="text-3xl font-bold text-foreground mb-2">Community</h1>
                <p className="text-muted-foreground">Connect with developers and experts from around the world</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Members", value: "52,431", icon: Users },
                  { label: "Questions Solved", value: "128,765", icon: MessageCircle },
                  { label: "Active Today", value: "3,421", icon: Star },
                  { label: "Top Contributors", value: "2,156", icon: Trophy },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="glass rounded-2xl p-6 text-center">
                      <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Search & Tabs */}
              <div className="glass rounded-2xl p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12"
                    />
                  </div>
                  <Button variant="glass">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <div className="flex gap-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                          activeTab === tab.id
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map((member, index) => (
                  <div
                    key={member.id}
                    className="glass card-hover rounded-2xl p-6 group cursor-pointer"
                  >
                    <div className="flex gap-4">
                      <div className="relative">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-16 h-16 rounded-2xl ring-2 ring-white/10"
                        />
                        {member.isOnline && (
                          <span className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-card" />
                        )}
                        <span className={cn(
                          "absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                          index === 0 && "bg-yellow-500/20 text-yellow-500",
                          index === 1 && "bg-gray-400/20 text-gray-400",
                          index === 2 && "bg-orange-500/20 text-orange-500",
                          index > 2 && "bg-muted text-muted-foreground"
                        )}>
                          {index + 1}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {member.name}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{member.username}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{member.bio}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {member.badges.map((badge) => (
                            <Badge key={badge} variant="neon" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-primary" />
                            {member.points.toLocaleString()}
                          </span>
                          <span>{member.answers} answers</span>
                          <span>{member.questions} questions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="flex justify-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Members
                </Button>
              </div>
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

export default Community;
