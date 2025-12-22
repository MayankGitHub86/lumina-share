import { Star, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const reviews = [
  {
    id: 1,
    name: "Kavya Reddy",
    role: "Pre-Med Student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya",
    rating: 3,
    text: "The mobile experience is fantastic. I can check my assignments, submit work, and stay on top of my classes even when I'm between classes or in the library.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Computer Science Student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    rating: 5,
    text: "This platform has completely transformed how I manage my coursework. The unified dashboard saves me hours every week, and the grade analytics helped me identify areas to improve.",
  },
  {
    id: 3,
    name: "Dr. Rajesh Kumar",
    role: "Professor of Physics",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
    rating: 5,
    text: "As an educator, I've tried many platforms. This one stands out for its intuitive interface and powerful features. Assignment management and grading have never been easier.",
  },
  {
    id: 4,
    name: "Ananya Patel",
    role: "Engineering Student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    rating: 4,
    text: "The collaboration features are amazing! I can easily work with my study group, share notes, and discuss problems. It's made remote learning so much better.",
  },
  {
    id: 5,
    name: "Arjun Singh",
    role: "MBA Student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    rating: 5,
    text: "Excellent platform for managing multiple courses. The notification system keeps me updated, and I never miss a deadline anymore. Highly recommended!",
  },
];

export function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = reviews.length - 1;
      if (nextIndex >= reviews.length) nextIndex = 0;
      return nextIndex;
    });
  };

  // Calculate visible reviews (current + 2 more)
  const visibleReviews = [
    reviews[currentIndex],
    reviews[(currentIndex + 1) % reviews.length],
    reviews[(currentIndex + 2) % reviews.length],
  ];

  return (
    <section className="relative py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Loved by <span className="gradient-text">Students & Educators</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            See what our community has to say about their experience.
          </p>
          <Button variant="default" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Your Review
          </Button>
        </motion.div>

        {/* Reviews Carousel */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-primary/20 hover:bg-primary/30 backdrop-blur-sm flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>

          <button
            onClick={() => paginate(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-primary/20 hover:bg-primary/30 backdrop-blur-sm flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-16">
            {visibleReviews.map((review, index) => (
              <motion.div
                key={review.id}
                className="glass rounded-2xl p-6 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-muted-foreground mb-6 line-clamp-4">
                  "{review.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full ring-2 ring-primary/20"
                  />
                  <div>
                    <div className="font-semibold text-foreground">
                      {review.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {review.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
