import { ArrowRight, LogIn, UserPlus, Zap, Users, MessageCircle, Award, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { motion } from "framer-motion";

const stats = [
  { label: "Active Users", value: "50K+", icon: Users },
  { label: "Problems Solved", value: "125K+", icon: MessageCircle },
  { label: "Expert Contributors", value: "2.5K+", icon: Award },
];

export function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Knowledge Sharing</span>
            </motion.div>

            {/* Heading */}
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Share Knowledge,
              <br />
              <motion.span 
                className="gradient-text"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                Solve Problems
              </motion.span>
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              className="text-lg sm:text-xl text-muted-foreground mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Join the most innovative community of problem solvers. Ask questions, 
              share expertise, and unlock solutions with AI-enhanced discussions.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center lg:items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {user ? (
                <>
                  <Link to="/dashboard" className="w-full sm:w-auto">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="hero" size="xl" className="group w-full">
                        Go to Dashboard
                        <LayoutDashboard className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/explore" className="w-full sm:w-auto">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="xl" className="w-full">
                        Explore Problems
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </motion.div>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signup" className="w-full sm:w-auto">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="hero" size="xl" className="group w-full">
                        Join Free
                        <UserPlus className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="xl" className="w-full">
                        Log In
                        <LogIn className="w-5 h-5 ml-2" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/explore" className="w-full sm:w-auto">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="ghost" size="xl" className="w-full">
                        Explore Problems
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </motion.div>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Right Side - Device Mockups */}
          <motion.div 
            className="hidden lg:block relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              {/* Laptop Mockup */}
              <motion.div 
                className="relative z-10"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="glass rounded-2xl p-3 shadow-2xl border border-white/10">
                  {/* Laptop Screen */}
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-background">
                    {/* Browser Chrome */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-muted/50 backdrop-blur-sm border-b border-white/5 flex items-center px-3 gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-xs text-muted-foreground bg-background/50 px-3 py-1 rounded">
                          lumina-share.com
                        </div>
                      </div>
                    </div>
                    {/* Video Preview */}
                    <div className="absolute inset-0 pt-8">
                      <video 
                        src="/assets/vid1.mp4"
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    </div>
                  </div>
                  {/* Laptop Base */}
                  <div className="h-4 bg-muted/30 rounded-b-lg mt-1"></div>
                </div>
              </motion.div>

              {/* Phone Mockup */}
              <motion.div 
                className="absolute -bottom-12 -right-8 z-20"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="glass rounded-[2.5rem] p-3 shadow-2xl border border-white/10 w-56">
                  {/* Phone Screen */}
                  <div className="relative aspect-[9/19] rounded-[1.8rem] overflow-hidden bg-background">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-background rounded-b-2xl z-10"></div>
                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 h-10 bg-muted/50 backdrop-blur-sm flex items-center justify-between px-6 pt-2">
                      <span className="text-xs">9:41</span>
                      <div className="flex gap-1 items-center">
                        <div className="text-xs">5G</div>
                      </div>
                    </div>
                    {/* Video Preview */}
                    <div className="absolute inset-0 pt-10">
                      <video 
                        src="/assets/vid2.mp4"
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
