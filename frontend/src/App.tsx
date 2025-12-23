import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import Community from "./pages/Community";
import Saved from "./pages/Saved";
import Tags from "./pages/Tags";
import Trending from "./pages/Trending";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";
import QuestionDetail from "./pages/QuestionDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Contact from "./pages/Contact";
import GoogleCallback from "./pages/GoogleCallback";
import { AuthProvider, useAuth } from "./context/auth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import useNotifications from "./hooks/use-notifications";
import { BackgroundCarousel } from "./components/BackgroundCarousel";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useAuth();
  useNotifications(user?.id);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BackgroundCarousel />
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
            <Route path="/questions/:id" element={<ProtectedRoute><QuestionDetail /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/tags/:tagName" element={<Tags />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
