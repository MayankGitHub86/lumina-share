import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedPage, FadeIn } from "@/components/AnimatedPage";
import { Mail, MessageSquare, Send, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send to your backend
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AnimatedPage className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <FadeIn>
            <div className="text-center mb-12">
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                whileHover={{ rotate: 360 }}
              >
                <Mail className="w-10 h-10 text-primary" />
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Get in <span className="gradient-text">Touch</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              className="glass rounded-2xl p-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-primary" />
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full gap-2">
                  Send Message
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

                <div className="space-y-6">
                  <motion.div
                    className="flex items-start gap-4"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a
                        href="mailto:pandeymp8602@gmail.com"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        pandeymp8602@gmail.com
                      </a>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-4"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Support</h3>
                      <p className="text-muted-foreground">
                        We typically respond within 24 hours
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-4"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Location</h3>
                      <p className="text-muted-foreground">
                        Serving developers worldwide
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="glass rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <a
                    href="/explore"
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    → Browse Questions
                  </a>
                  <a
                    href="/community"
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    → Join Community
                  </a>
                  <a
                    href="/tags"
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    → Explore Topics
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </AnimatedPage>
  );
};

export default Contact;
