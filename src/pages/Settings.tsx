import { useState } from "react";
import { User, Bell, Shield, Palette, Globe, Key, Mail, Smartphone } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const settingsTabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "language", label: "Language", icon: Globe },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 shrink-0">
              <nav className="glass rounded-2xl p-4">
                <ul className="space-y-1">
                  {settingsTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                            activeTab === tab.id
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          {tab.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1">
              {activeTab === "profile" && (
                <div className="glass rounded-2xl p-6 space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">Profile Settings</h2>
                  
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                      alt="Avatar"
                      className="w-20 h-20 rounded-2xl ring-2 ring-white/10"
                    />
                    <div>
                      <Button variant="outline" size="sm">Change Avatar</Button>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="grid gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">First Name</label>
                        <Input placeholder="John" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Last Name</label>
                        <Input placeholder="Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Username</label>
                      <Input placeholder="@johndoe" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                      <Input type="email" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Bio</label>
                      <textarea
                        className="w-full h-24 px-4 py-3 rounded-xl border border-white/10 bg-card/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="ghost">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="glass rounded-2xl p-6 space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {[
                      { icon: Mail, title: "Email Notifications", desc: "Receive email updates about activity" },
                      { icon: Bell, title: "Push Notifications", desc: "Get notified in your browser" },
                      { icon: Smartphone, title: "Mobile Notifications", desc: "Notifications on your mobile device" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.title} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{item.title}</p>
                              <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "privacy" && (
                <div className="glass rounded-2xl p-6 space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">Privacy & Security</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Key className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Change Password</p>
                          <p className="text-sm text-muted-foreground">Update your password regularly</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Change Password</Button>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Enable 2FA</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="glass rounded-2xl p-6 space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
                  
                  <div>
                    <p className="font-medium text-foreground mb-3">Theme</p>
                    <div className="grid grid-cols-3 gap-4">
                      {["Dark", "Light", "System"].map((theme) => (
                        <button
                          key={theme}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all",
                            theme === "Dark"
                              ? "border-primary bg-primary/10"
                              : "border-white/10 hover:border-white/20"
                          )}
                        >
                          <div className={cn(
                            "w-full h-12 rounded-lg mb-2",
                            theme === "Dark" && "bg-[#0a0a12]",
                            theme === "Light" && "bg-white",
                            theme === "System" && "bg-gradient-to-r from-[#0a0a12] to-white"
                          )} />
                          <p className="text-sm font-medium text-foreground">{theme}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "language" && (
                <div className="glass rounded-2xl p-6 space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">Language & Region</h2>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Language</label>
                    <select className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-white/10 text-foreground">
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Japanese</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Timezone</label>
                    <select className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-white/10 text-foreground">
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+1 (Central European)</option>
                      <option>UTC+9 (Japan)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
