import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth";
import { useNavigate, Link } from "react-router-dom";
import api from "@/lib/api";
import { Github, Mail, ArrowLeft } from "lucide-react";
import GoogleIcon from "@/components/icons/GoogleIcon";
import { handleGoogleAuth, handleMicrosoftAuth, handleGitHubAuth } from "@/lib/oauth";
import { loadGoogleScript } from "@/lib/google-auth";
import { initializeMicrosoftAuth } from "@/lib/microsoft-auth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/AnimatedPage";

const quotes = [
  "Knowledge grows when it's shared.",
  "Learn boldly, give freely, grow together.",
  "Every solution begins with a question.",
  "Communities thrive on curiosity and generosity.",
  "Teach, learn, and lift others as you climb."
];

const gallery = [
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80&auto=format&fit=crop"
];

const SignUp = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const currentQuote = useMemo(() => quotes[quoteIndex], [quoteIndex]);

  // Typing / erasing animation
  useEffect(() => {
    const typeSpeed = isDeleting ? 40 : 65;
    const fullText = currentQuote;

    const timeout = setTimeout(() => {
      if (!isDeleting && displayText.length < fullText.length) {
        setDisplayText(fullText.slice(0, displayText.length + 1));
      } else if (isDeleting && displayText.length > 0) {
        setDisplayText(fullText.slice(0, displayText.length - 1));
      } else if (!isDeleting && displayText.length === fullText.length) {
        setTimeout(() => setIsDeleting(true), 500);
      } else if (isDeleting && displayText.length === 0) {
        setIsDeleting(false);
        const next = Math.floor(Math.random() * quotes.length);
        setQuoteIndex(next === quoteIndex ? (next + 1) % quotes.length : next);
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentQuote, quoteIndex]);

  // Image carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % gallery.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Load OAuth scripts
  useEffect(() => {
    loadGoogleScript().catch(() => {
      console.error("Failed to load Google OAuth");
    });

    initializeMicrosoftAuth().catch(() => {
      console.error("Failed to initialize Microsoft OAuth");
    });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!name.trim() || !username.trim()) {
        throw new Error("Name and username are required");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      await api.register({ email, username, name, password });
      await login(email, password);
      toast.success("Account created successfully! Welcome to SolveHub.");
      navigate("/dashboard");
    } catch (err: any) {
      const errorMessage = err?.message || "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    setLoading(true);
    try {
      await loadGoogleScript();
      if (!(window as any).google) {
        throw new Error("Google OAuth not loaded");
      }
      
      // Trigger Google Sign-In popup
      (window as any).google.accounts.id.prompt();
    } catch (err: any) {
      setError(err?.message || "Google authentication failed");
      toast.error(err?.message || "Google authentication failed");
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const idToken = credentialResponse.credential;
      if (!idToken) {
        throw new Error("No token received from Google");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/auth/oauth/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Google authentication failed");
      }

      // Store both token and user data
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      toast.success("Google signup successful!");
      
      // Reload to update auth context
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
      setLoading(false);
    }
  };

  const handleMicrosoftSuccess = async () => {
    setLoading(true);
    try {
      const msalInstance = await initializeMicrosoftAuth();
      if (!msalInstance) {
        throw new Error("Microsoft Auth not initialized");
      }

      const response = await msalInstance.loginPopup({
        scopes: ["user.read"],
      });

      const backendResponse = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/auth/oauth/microsoft`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: response.accessToken }),
        }
      );

      const data = await backendResponse.json();
      if (!backendResponse.ok) {
        throw new Error(data.error?.message || "Microsoft authentication failed");
      }

      // Store both token and user data
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      toast.success("Microsoft signup successful!");
      
      // Reload to update auth context
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err?.message || "Microsoft authentication failed");
      toast.error(err?.message || "Microsoft authentication failed");
      setLoading(false);
    }
  };

  const handleGitHubClick = () => {
    handleGitHubAuth((error) => {
      setError(error);
      toast.error(error);
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Back to Home button */}
      <div className="fixed top-4 left-4 z-50">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Story / Brand side */}
        <div className="relative hidden lg:block overflow-hidden">
          <div className="absolute inset-0">
            {gallery.map((src, idx) => (
              <div
                key={src}
                className="absolute inset-0 transition-opacity duration-1000"
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: idx === currentImage ? 1 : 0,
                }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/75 to-background/60" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between p-12">
            <div className="space-y-4">
              <span className="inline-flex px-4 py-2 rounded-full bg-primary/15 text-primary border border-primary/20 text-sm font-medium">
                Learn. Build. Share.
              </span>
              <h1 className="text-4xl font-bold leading-tight max-w-xl">
                Start your journey of growth and contribution today.
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Join thousands of learners who are building expertise, solving real problems, and helping others grow.
              </p>
              <div className="flex gap-3 flex-wrap pt-2">
                {["Ask Questions", "Share Solutions", "Build Network", "Grow Skills"].map((pill) => (
                  <span key={pill} className="px-3 py-1 rounded-full bg-white/5 text-sm text-foreground border border-white/10">
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Community voices</div>
              <div className="text-2xl font-semibold leading-snug min-h-[3.5rem]">
                {displayText}
                <span className="inline-block w-3 h-6 bg-primary/80 align-middle ml-1 animate-pulse" />
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>50k+ active learners</span>
                <span>125k+ problems solved</span>
                <span>Global experts onboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Signup side */}
        <div className="flex items-center justify-center px-6 py-10">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-xl space-y-8"
          >
            <FadeIn delay={0.2}>
              <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Go back</span>
            </button>
            </FadeIn>

            <FadeIn delay={0.25}>
            <div>
              <p className="text-sm text-primary font-semibold">SolveHub</p>
              <h2 className="text-2xl font-bold">Join the community</h2>
              <p className="text-sm text-muted-foreground">Create your account and start learning, sharing, and growing.</p>
            </div>
            </FadeIn>

            <FadeIn delay={0.3}>
            <div className="glass rounded-2xl p-8 shadow-xl border border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleGoogleClick}
                  disabled={loading}
                >
                  <GoogleIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Google</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleMicrosoftSuccess}
                  disabled={loading}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Microsoft</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleGitHubClick}
                  disabled={loading}
                >
                  <Github className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">GitHub</span>
                </Button>
              </div>

              <div className="relative flex items-center justify-center mb-6">
                <span className="absolute px-3 text-xs text-muted-foreground bg-background">or sign up with email</span>
                <div className="w-full h-px bg-border" />
              </div>

              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Full name *</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Johnson"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Username *</label>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="alexj"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Email address *</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Password *</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">Must be at least 6 characters</p>
                </div>

                {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Creating account..." : "Create account"}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Already have an account?{" "}
                    <button 
                      onClick={() => navigate("/login")}
                      className="text-primary hover:underline font-medium"
                    >
                      Log in
                    </button>
                  </p>
                </div>

                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  By signing up, you agree to our Terms of Service and Privacy Policy. We'll send you email updates about new features and community highlights.
                </p>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Want to explore first?{" "}
                  <Link to="/" className="text-primary hover:underline font-medium">
                    Browse as guest
                  </Link>
                </p>
              </div>
            </div>
            </FadeIn>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
