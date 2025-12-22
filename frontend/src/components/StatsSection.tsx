import { Users, MessageCircle, Award, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, { 
      duration: 2, 
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest))
    });
    return controls.stop;
  }, [count, value]);

  return (
    <span>
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsSection() {
  // Fetch real stats from backend
  const { data: statsData } = useQuery({
    queryKey: ["homepage-stats"],
    queryFn: async () => {
      const [usersRes, questionsRes, leaderboardRes]: any[] = await Promise.all([
        api.getAllUsers({ page: 1, limit: 1 }),
        api.getAllQuestions({ page: 1, limit: 1 }),
        api.getLeaderboard("all"),
      ]);

      const totalUsers = usersRes.data?.pagination?.total || 0;
      const totalQuestions = questionsRes.data?.pagination?.total || 0;
      const topContributors = leaderboardRes.data?.length || 0;

      // Calculate solved questions (questions with accepted answers)
      const questionsData = await api.getAllQuestions({ page: 1, limit: 100 });
      const solvedCount = questionsData.data?.questions?.filter((q: any) => q.acceptedAnswerId).length || 0;

      return {
        totalUsers,
        totalQuestions,
        solvedCount,
        topContributors,
      };
    },
    staleTime: 60000, // Cache for 1 minute
  });

  const stats = [
    { 
      label: "Active Users", 
      value: statsData?.totalUsers || 0,
      suffix: "+",
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      label: "Problems Solved", 
      value: statsData?.solvedCount || 0,
      suffix: "+",
      icon: MessageCircle,
      color: "from-green-500 to-emerald-500"
    },
    { 
      label: "Total Questions", 
      value: statsData?.totalQuestions || 0,
      suffix: "+",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500"
    },
    { 
      label: "Expert Contributors", 
      value: statsData?.topContributors || 0,
      suffix: "+",
      icon: Award,
      color: "from-yellow-500 to-orange-500"
    },
  ];

  return (
    <section className="relative py-12 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-3"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            Trusted by <span className="gradient-text">Leading Developers</span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Numbers that speak for themselves. Join thousands of developers already transforming their problem-solving experience.
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="text-center group relative"
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  delay: index * 0.15, 
                  type: "spring", 
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                {/* Glow Effect on Hover */}
                <motion.div
                  className="absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})`
                  }}
                />

                {/* Circular Progress */}
                <motion.div 
                  className="relative w-28 h-28 md:w-32 md:h-32 mx-auto mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.15 + 0.3, 
                    type: "spring",
                    stiffness: 80
                  }}
                >
                  {/* Background Circle */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted/10"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke={`url(#gradient-${index})`}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 0.75 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 2, 
                        delay: index * 0.15 + 0.5, 
                        ease: "easeOut" 
                      }}
                    />
                    <defs>
                      <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" className={`text-${stat.color.split('-')[1]}-500`} stopColor="currentColor" />
                        <stop offset="100%" className={`text-${stat.color.split('-')[3]}-500`} stopColor="currentColor" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Center Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div 
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                      whileHover={{ 
                        rotate: [0, -10, 10, -10, 0],
                        scale: 1.2
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* Value */}
                <motion.div 
                  className="text-3xl md:text-4xl font-bold gradient-text mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.8, type: "spring" }}
                >
                  <Counter value={stat.value} suffix={stat.suffix} />
                </motion.div>
                
                {/* Label */}
                <motion.div 
                  className="text-sm md:text-base font-semibold text-foreground mb-1"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 1 }}
                >
                  {stat.label}
                </motion.div>
                
                {/* Description */}
                <motion.div 
                  className="text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 1.1 }}
                >
                  {index === 0 && "Growing community"}
                  {index === 1 && "Diverse solutions"}
                  {index === 2 && "Total questions"}
                  {index === 3 && "Loved by developers"}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
