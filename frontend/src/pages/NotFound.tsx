import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      <div className="relative z-10 text-center px-4">
        <div className="glass rounded-3xl p-12 max-w-lg mx-auto">
          {/* 404 Number */}
          <div className="text-8xl font-bold gradient-text mb-4">404</div>
          
          {/* Message */}
          <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild variant="hero">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/explore">
                <Search className="w-4 h-4 mr-2" />
                Explore Problems
              </Link>
            </Button>
          </div>

          {/* Back Link */}
          <button
            onClick={() => window.history.back()}
            className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
