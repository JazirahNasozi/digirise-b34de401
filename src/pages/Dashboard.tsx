import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";
import {
  Plus, Globe, Settings, LogOut,
  Clock, CheckCircle, FileText, MessageSquare, Lightbulb,
  Trash2, Eye, Pencil,
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
      if (!session) { navigate("/login"); return; }
      setUser(session.user);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/login"); return; }
      setUser(session.user);
      supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin")
        .then(({ data: roles }) => { if (roles && roles.length > 0) navigate("/admin"); });
      fetchWebsites();
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchWebsites = async () => {
    const { data, error } = await supabase
      .from("websites")
      .select("id, name, business_type, status, created_at, published_url")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Error loading websites", description: error.message, variant: "destructive" });
    else setWebsites(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this website? This cannot be undone.")) return;
    const { error } = await supabase.from("websites").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else {
      setWebsites((w) => w.filter((s) => s.id !== id));
      toast({ title: "Website deleted" });
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/"); };

  const publishedCount = websites.filter((w) => w.status === "published").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink-0">
            <img src="/favicon.png" alt="DigiRise" className="h-7 w-7 sm:h-8 sm:w-8 shrink-0" />
            <span className="text-base sm:text-xl font-display font-bold truncate">DigiRise</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="px-2 sm:px-3" onClick={() => navigate("/settings")}>
              <Settings className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Settings</span>
            </Button>
            <Button variant="ghost" size="sm" className="px-2 sm:px-3" onClick={handleLogout}>
              <LogOut className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-1">
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
          </h1>
          <p className="text-muted-foreground">Manage your websites and AI tools</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Websites", value: websites.length, icon: Globe, color: "text-primary" },
            { label: "Published", value: publishedCount, icon: CheckCircle, color: "text-primary" },
            { label: "Drafts", value: websites.length - publishedCount, icon: Clock, color: "text-muted-foreground" },
            { label: "AI Tools", value: "3", icon: Lightbulb, color: "text-primary" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl p-4 border border-border"
            >
              <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-display font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onClick={() => navigate("/builder")}
            className="cursor-pointer group rounded-2xl p-5 bg-primary hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-8 w-8 text-primary-foreground mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-display font-bold text-primary-foreground">Create Website</h3>
            <p className="text-xs mt-1 text-primary-foreground/80">AI-powered site builder</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            onClick={() => navigate("/ai-assistant")}
            className="cursor-pointer bg-card rounded-2xl p-5 border border-border hover:border-primary/50 transition-colors group"
          >
            <MessageSquare className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-display font-bold">AI Assistant</h3>
            <p className="text-xs text-muted-foreground mt-1">Generate business content</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            onClick={() => navigate("/name-generator")}
            className="cursor-pointer bg-card rounded-2xl p-5 border border-border hover:border-primary/50 transition-colors group"
          >
            <Lightbulb className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-display font-bold">Name Generator</h3>
            <p className="text-xs text-muted-foreground mt-1">Business names & slogans</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            onClick={() => navigate("/settings")}
            className="cursor-pointer bg-card rounded-2xl p-5 border border-border hover:border-primary/50 transition-colors group"
          >
            <Settings className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-display font-bold">Settings</h3>
            <p className="text-xs text-muted-foreground mt-1">Account & preferences</p>
          </motion.div>
        </div>

        {/* Websites */}
        <div>
          <h2 className="text-2xl font-display font-bold mb-4">Your Websites</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-2xl p-6 border border-border animate-pulse h-48" />
              ))}
            </div>
          ) : websites.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-card rounded-2xl border border-border">
              <Globe className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold text-muted-foreground mb-2">No websites yet</h3>
              <p className="text-muted-foreground mb-6">Create your first AI-powered website in minutes</p>
              <Button onClick={() => navigate("/builder")} className="bg-primary text-primary-foreground hover:bg-primary/90">
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
                  className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display font-bold text-lg">{site.name}</h3>
                      {site.business_type && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{site.business_type}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {site.status === "published" ? <CheckCircle className="h-4 w-4 text-primary" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
                      <span className="text-xs capitalize text-muted-foreground">{site.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <FileText className="h-3 w-3" />
                    {new Date(site.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/builder/${site.id}`)} className="flex-1">
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    {site.status === "published" && site.published_url && (
                      <Button size="sm" variant="outline" onClick={() => window.open(site.published_url!, "_blank")}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={(e) => handleDelete(site.id, e)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
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
