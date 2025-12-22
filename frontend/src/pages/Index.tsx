import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StatsSection } from "@/components/StatsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { FeaturedSection } from "@/components/FeaturedSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { AnimatedPage } from "@/components/AnimatedPage";

const Index = () => {
  return (
    <AnimatedPage className="min-h-screen">
      <Navbar />
      <main className="relative">
        <Hero />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <FeaturedSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <Footer />
    </AnimatedPage>
  );
};

export default Index;
