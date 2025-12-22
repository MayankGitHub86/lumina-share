import { Mail, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export function ContactSection() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send to your backend
      toast.success("Subscribed successfully!");
      setEmail("");
    }
  };

  return (
    <section className="relative py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            whileHover={{ rotate: 360 }}
          >
            <Mail className="w-10 h-10 text-primary" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Stay in the <span className="gradient-text">Loop</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-muted-foreground text-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Subscribe to our newsletter for the latest updates, educational tips,
            and exclusive features. Join our community of learners!
          </motion.p>

          {/* Email Form */}
          <motion.form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" className="gap-2">
              Subscribe
              <Send className="w-4 h-4" />
            </Button>
          </motion.form>

          {/* Privacy Note */}
          <motion.p
            className="text-xs text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            We respect your privacy. Unsubscribe at any time.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-6 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div>
              <div className="text-2xl font-bold gradient-text mb-1">10K+</div>
              <div className="text-sm text-muted-foreground">Subscribers</div>
            </div>
            <div>
              <div className="text-2xl font-bold gradient-text mb-1">Weekly</div>
              <div className="text-sm text-muted-foreground">Updates</div>
            </div>
            <div>
              <div className="text-2xl font-bold gradient-text mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Free</div>
            </div>
          </motion.div>

          {/* Contact Email */}
          <motion.div
            className="mt-12 pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-muted-foreground mb-2">
              Have questions? Reach out to us directly:
            </p>
            <a
              href="mailto:pandeymp8602@gmail.com"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              pandeymp8602@gmail.com
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
