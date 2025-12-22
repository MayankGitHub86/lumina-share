import { useState, useEffect } from "react";
import { User, Bell, Shield, Trash2, Key, Save, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AnimatedPage, FadeIn } from "@/components/AnimatedPage";

const settingsTabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  // Profile form
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    bio: "",
    location: "",
    website: "",
    github: "",
    twitter: "",
    linkedin: "",
  });

  // Account forms
  const [emailData, setEmailData] = useState({
    email: "",
    password: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [deletePassword, setDeletePassword] = useState("");

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    questionAnswered: true,
    commentReplied: true,
    upvoteReceived: true,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        username: user.username || "",
        bio: "",
        location: "",
        website: "",
        github: "",
        twitter: "",
        linkedin: "",
      });
      setEmailData(prev => ({ ...prev, email: user.email || "" }));
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/settings/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to update profile");
      }

      // Update local storage
      localStorage.setItem("user", JSON.stringify(data.data.user));
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/settings/email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to update email");
      }

      toast.success("Email updated successfully");
      setEmailData(prev => ({ ...prev, password: "" }));
    } catch (error: any) {
      toast.error(error.message || "Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/settings/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to update password");
      }

      toast.success("Password updated successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/settings/account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ password: deletePassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to delete account");
      }

      toast.success("Account deleted successfully");
      logout();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/settings/notifications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(notifications),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to update notifications");
      }

      toast.success("Notification preferences updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update notifications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage className="min-h-screen">
      <Navbar />
      <main className="pt-16 pb-8">
        <div className="container mx-auto px-4 max-w-[1800px]">
          <div className="flex gap-4">
            <Sidebar />
            
            <div className="flex-1 min-w-0 space-y-4">
              {/* Header */}
              <FadeIn>
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
                  <p className="text-muted-foreground">Manage your account preferences</p>
                </div>
              </FadeIn>

              <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 shrink-0">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    {settingsTabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
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
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Content */}
            <div className="flex-1">
              {activeTab === "profile" && (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your personal information and profile details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Avatar */}
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Profile Picture</p>
                          <p className="text-xs text-muted-foreground">Avatar is generated from your name</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Name */}
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          placeholder="Enter your full name"
                        />
                      </div>

                      {/* Username */}
                      <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={profileData.username}
                          onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                          placeholder="Enter your username"
                        />
                      </div>

                      {/* Bio */}
                      <div className="grid gap-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          placeholder="Tell us about yourself"
                          rows={3}
                        />
                      </div>

                      {/* Location */}
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          placeholder="City, Country"
                        />
                      </div>

                      {/* Website */}
                      <div className="grid gap-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={profileData.website}
                          onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>

                      <Separator />

                      {/* Social Links */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Social Links</h3>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="github">GitHub</Label>
                          <Input
                            id="github"
                            value={profileData.github}
                            onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                            placeholder="github.com/username"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="twitter">Twitter</Label>
                          <Input
                            id="twitter"
                            value={profileData.twitter}
                            onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
                            placeholder="twitter.com/username"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={profileData.linkedin}
                            onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                            placeholder="linkedin.com/in/username"
                          />
                        </div>
                      </div>

                      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                        {loading ? <img src="/assets/Solvehub1.gif" alt="Loading" className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                      </Button>
                    </CardContent>
                  </Card>
                </form>
              )}

              {activeTab === "account" && (
                <div className="space-y-6">
                  {/* Email Update */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Email Address</CardTitle>
                      <CardDescription>Update your email address</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleEmailUpdate} className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="email">New Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={emailData.email}
                            onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                            placeholder="Enter new email"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email-password">Confirm Password</Label>
                          <Input
                            id="email-password"
                            type="password"
                            value={emailData.password}
                            onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                            placeholder="Enter your password"
                          />
                        </div>
                        <Button type="submit" disabled={loading}>
                          {loading ? <img src="/assets/Solvehub1.gif" alt="Loading" className="h-4 w-4 mr-2" /> : null}
                          Update Email
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Password Update */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>Update your password to keep your account secure</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input
                            id="current-password"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            placeholder="Enter current password"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            placeholder="Enter new password"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            placeholder="Confirm new password"
                          />
                        </div>
                        <Button type="submit" disabled={loading}>
                          {loading ? <img src="/assets/Solvehub1.gif" alt="Loading" className="h-4 w-4 mr-2" /> : <Key className="h-4 w-4 mr-2" />}
                          Update Password
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Delete Account */}
                  <Card className="border-destructive">
                    <CardHeader>
                      <CardTitle className="text-destructive">Delete Account</CardTitle>
                      <CardDescription>Permanently delete your account and all associated data</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAccountDelete} className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="delete-password">Confirm Password</Label>
                          <Input
                            id="delete-password"
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="Enter your password"
                          />
                        </div>
                        <Button type="submit" variant="destructive" disabled={loading}>
                          {loading ? <img src="/assets/Solvehub1.gif" alt="Loading" className="h-4 w-4 mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                          Delete Account
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive push notifications</p>
                      </div>
                      <Switch
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Activity Notifications</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Question Answered</Label>
                          <p className="text-sm text-muted-foreground">When someone answers your question</p>
                        </div>
                        <Switch
                          checked={notifications.questionAnswered}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, questionAnswered: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Comment Replied</Label>
                          <p className="text-sm text-muted-foreground">When someone replies to your comment</p>
                        </div>
                        <Switch
                          checked={notifications.commentReplied}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, commentReplied: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Upvote Received</Label>
                          <p className="text-sm text-muted-foreground">When someone upvotes your content</p>
                        </div>
                        <Switch
                          checked={notifications.upvoteReceived}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, upvoteReceived: checked })}
                        />
                      </div>
                    </div>

                    <Button onClick={handleNotificationUpdate} disabled={loading}>
                      {loading ? <img src="/assets/Solvehub1.gif" alt="Loading" className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
            </div>
          </div>
        </div>
      </main>
    </AnimatedPage>
  );
};

export default Settings;
