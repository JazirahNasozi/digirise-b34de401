import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";
import {
  Plus, Globe, Settings, LogOut, Sparkles, LayoutDashboard,
  Clock, CheckCircle, FileText,
} from "lucide-react";

interface Website {
  id: string;
  name: string;
  business_type: string | null;
  status: string;
  created_at: string;
  published_url: string | null;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);

      // Check if admin → redirect
      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .then(({ data: roles }) => {
          if (roles && roles.length > 0) {
            navigate("/admin");
            return;
          }
        });

      fetchWebsites();
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchWebsites = async () => {
    const { data, error } = await supabase
      .from("websites")
      .select("id, name, business_type, status, created_at, published_url")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error loading websites", description: error.message, variant: "destructive" });
    } else {
      setWebsites(data || []);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleCreateClick = () => {
    navigate("/builder");
  };

  const statusIcon = (status: string) => {
    if (status === "published") return <CheckCircle className="h-4 w-4 text-primary" />;
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-display font-bold">DigiRise</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/settings")}>
              <Settings className="h-4 w-4 mr-2" /> Settings
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold mb-1">
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
          </h1>
          <p className="text-muted-foreground">Manage your AI-generated websites</p>
        </motion.div>


        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={handleCreateClick}
            className="cursor-pointer group rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all gold-gradient gold-glow"
          >
            <Plus className="h-10 w-10 text-primary-foreground mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-display font-bold text-primary-foreground">
              Create Website
            </h3>
            <p className="text-sm mt-1 text-primary-foreground/80">
              Let AI build your perfect site
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-6 border border-border shadow-sm"
          >
            <LayoutDashboard className="h-10 w-10 text-primary mb-3" />
            <h3 className="text-xl font-display font-bold">My Websites</h3>
            <p className="text-muted-foreground text-sm mt-1">
              {websites.length} website{websites.length !== 1 ? "s" : ""} created
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate("/settings")}
            className="cursor-pointer bg-card rounded-2xl p-6 border border-border shadow-sm hover:border-primary/50 transition-colors"
          >
            <Settings className="h-10 w-10 text-primary mb-3" />
            <h3 className="text-xl font-display font-bold">Account Settings</h3>
            <p className="text-muted-foreground text-sm mt-1">Update your profile & preferences</p>
          </motion.div>
        </div>

        {/* Websites Grid */}
        <div>
          <h2 className="text-2xl font-display font-bold mb-4">Your Websites</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-2xl p-6 border border-border animate-pulse h-48" />
              ))}
            </div>
          ) : websites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-card rounded-2xl border border-border"
            >
              <Globe className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold text-muted-foreground mb-2">
                No websites yet
              </h3>
              <p className="text-muted-foreground mb-6">Create your first AI-powered website in minutes</p>
              <Button
                onClick={handleCreateClick}
                className="gold-gradient text-primary-foreground gold-glow"
                disabled={false}
              >
                <Plus className="h-4 w-4 mr-2" /> Create Your First Website
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websites.map((site, i) => (
                <motion.div
                  key={site.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all cursor-pointer group"
                  onClick={() => navigate(`/builder/${site.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display font-bold text-lg group-hover:text-primary transition-colors">
                        {site.name}
                      </h3>
                      {site.business_type && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                          {site.business_type}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {statusIcon(site.status)}
                      <span className="text-xs capitalize text-muted-foreground">{site.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    {new Date(site.created_at).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
