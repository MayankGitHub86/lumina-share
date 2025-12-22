import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StatsSection } from "@/components/StatsSection";
import { FeaturedSection } from "@/components/FeaturedSection";
import { Footer } from "@/components/Footer";
import { AnimatedPage } from "@/components/AnimatedPage";

const Index = () => {
  return (
    <AnimatedPage className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <StatsSection />
        <FeaturedSection />
      </main>
      <Footer />
    </AnimatedPage>
  );
};

export default Index;
