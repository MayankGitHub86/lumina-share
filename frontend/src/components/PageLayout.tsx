import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface PageLayoutProps {
  children: ReactNode;
  maxWidth?: string;
}

export function PageLayout({ children, maxWidth = "1400px" }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-6" style={{ maxWidth }}>
          <div className="flex gap-6">
            <Sidebar />
            <div className="flex-1 min-w-0 space-y-6">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
