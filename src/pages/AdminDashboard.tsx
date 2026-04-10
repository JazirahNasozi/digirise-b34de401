import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  LogOut, Users, CheckCircle, XCircle, Globe, Shield, Loader2,
  FileText, Eye, Trash2, BarChart3, Cloud, Database,
} from "lucide-react";
import AdminAnalyticsTab from "@/components/admin/AdminAnalyticsTab";
import AdminCloudTab from "@/components/admin/AdminCloudTab";

interface UserProfile {
  id: string;
  user_id: string;
  business_name: string | null;
  business_type: string | null;
  payment_confirmed: boolean;
  payment_confirmed_at: string | null;
  created_at: string;
  email?: string;
}

interface UserWebsite {
  id: string;
  name: string;
  status: string;
  user_id: string;
  created_at: string;
  published_url: string | null;
}

type Tab = "users" | "websites" | "activity";

const AdminDashboard = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [websites, setWebsites] = useState<UserWebsite[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      const { data: roles } = await supabase
        .from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin");
      if (!roles || roles.length === 0) {
        toast({ title: "Access denied", variant: "destructive" });
        navigate("/dashboard");
        return;
      }
      setIsAdmin(true);
      await fetchData();
    };
    init();
  }, [navigate, toast]);

  const fetchData = async () => {
    setLoading(true);
    const [profilesRes, websitesRes] = await Promise.all([
      supabase.from("profiles").select("id, user_id, business_name, business_type, payment_confirmed, payment_confirmed_at, created_at"),
      supabase.from("websites").select("id, name, status, user_id, created_at, published_url"),
    ]);
    if (profilesRes.data) {
      const profilesWithEmails = await Promise.all(
        profilesRes.data.map(async (p: any) => {
          const { data } = await supabase.rpc("get_user_email", { _user_id: p.user_id });
          return { ...p, email: data || "Unknown" };
        })
      );
      setProfiles(profilesWithEmails);
    }
    if (websitesRes.data) setWebsites(websitesRes.data as UserWebsite[]);
    setLoading(false);
  };

  const togglePayment = async (profile: UserProfile) => {
    setToggling(profile.id);
    const { data: { session } } = await supabase.auth.getSession();
    const newStatus = !profile.payment_confirmed;
    const { error } = await supabase.from("profiles").update({
      payment_confirmed: newStatus,
      payment_confirmed_at: newStatus ? new Date().toISOString() : null,
      payment_confirmed_by: newStatus ? session?.user.id ?? null : null,
    }).eq("id", profile.id);
    if (error) {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    } else {
      toast({ title: newStatus ? "Payment confirmed" : "Payment revoked" });
      setProfiles((prev) => prev.map((p) => p.id === profile.id ? { ...p, payment_confirmed: newStatus, payment_confirmed_at: newStatus ? new Date().toISOString() : null } : p));
    }
    setToggling(null);
  };

  const deleteWebsite = async (id: string) => {
    const { error } = await supabase.from("websites").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", variant: "destructive" });
    } else {
      setWebsites((prev) => prev.filter((w) => w.id !== id));
      toast({ title: "Website deleted" });
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/"); };
  const getUserWebsiteCount = (userId: string) => websites.filter((w) => w.user_id === userId).length;
  const getUserEmail = (userId: string) => profiles.find((p) => p.user_id === userId)?.email || "Unknown";

  const publishedCount = websites.filter((w) => w.status === "published").length;
  const paidUsers = profiles.filter((p) => p.payment_confirmed).length;

  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="DigiRise" className="h-6 w-6" />
            <span className="text-xl font-display font-bold">DigiRise</span>
            <span className="ml-2 text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Shield className="inline h-3 w-3 mr-1" />Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://lovable.dev/projects/6d5fd211-55df-4dbc-b0bf-484971f87cc3/cloud" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <Cloud className="h-4 w-4 mr-2" /> Cloud
              </Button>
            </a>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground mb-8">Platform management & analytics</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "Total Users", value: profiles.length, color: "text-primary" },
            { icon: CheckCircle, label: "Paid Users", value: paidUsers, color: "text-green-500" },
            { icon: Globe, label: "Total Websites", value: websites.length, color: "text-primary" },
            { icon: BarChart3, label: "Published", value: publishedCount, color: "text-blue-500" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-card rounded-2xl p-5 border border-border">
              <Icon className={`h-7 w-7 ${color} mb-2`} />
              <div className="text-2xl font-display font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-card rounded-lg border border-border p-1 w-fit">
          {([
            { key: "users" as Tab, label: "Users", icon: Users },
            { key: "websites" as Tab, label: "Websites", icon: Globe },
            { key: "activity" as Tab, label: "Activity", icon: BarChart3 },
          ]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-12 text-center"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></div>
        ) : (
          <>
            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h2 className="text-lg font-display font-bold">Platform Users ({profiles.length})</h2>
                </div>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-4 font-semibold">Email</th>
                        <th className="text-left p-4 font-semibold">Business</th>
                        <th className="text-left p-4 font-semibold">Sites</th>
                        <th className="text-left p-4 font-semibold">Joined</th>
                        <th className="text-left p-4 font-semibold">Payment</th>
                        <th className="text-left p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profiles.map((p) => (
                        <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-medium">{p.email}</td>
                          <td className="p-4 text-muted-foreground">{p.business_name || "—"}</td>
                          <td className="p-4">
                            <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">{getUserWebsiteCount(p.user_id)}</span>
                          </td>
                          <td className="p-4 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                          <td className="p-4">
                            {p.payment_confirmed
                              ? <span className="inline-flex items-center gap-1 text-green-600 text-xs font-semibold"><CheckCircle className="h-3.5 w-3.5" /> Confirmed</span>
                              : <span className="inline-flex items-center gap-1 text-muted-foreground text-xs"><XCircle className="h-3.5 w-3.5" /> Pending</span>
                            }
                          </td>
                          <td className="p-4">
                            <Button size="sm" variant={p.payment_confirmed ? "outline" : "default"} disabled={toggling === p.id} onClick={() => togglePayment(p)}>
                              {toggling === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : p.payment_confirmed ? "Revoke" : "Confirm"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-border">
                  {profiles.map((p) => (
                    <div key={p.id} className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate">{p.email}</span>
                        {p.payment_confirmed
                          ? <span className="text-green-600 text-xs font-semibold">Confirmed</span>
                          : <span className="text-muted-foreground text-xs">Pending</span>
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">{p.business_name || "No business"} · {getUserWebsiteCount(p.user_id)} sites</div>
                      <Button size="sm" variant={p.payment_confirmed ? "outline" : "default"} className="w-full" disabled={toggling === p.id} onClick={() => togglePayment(p)}>
                        {toggling === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : p.payment_confirmed ? "Revoke" : "Confirm Payment"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Websites Tab */}
            {activeTab === "websites" && (
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h2 className="text-lg font-display font-bold">All Websites ({websites.length})</h2>
                </div>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-4 font-semibold">Name</th>
                        <th className="text-left p-4 font-semibold">Owner</th>
                        <th className="text-left p-4 font-semibold">Status</th>
                        <th className="text-left p-4 font-semibold">Created</th>
                        <th className="text-left p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {websites.map((w) => (
                        <tr key={w.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-medium">{w.name}</td>
                          <td className="p-4 text-muted-foreground text-xs">{getUserEmail(w.user_id)}</td>
                          <td className="p-4">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${w.status === "published" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                              {w.status}
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground">{new Date(w.created_at).toLocaleDateString()}</td>
                          <td className="p-4 flex gap-2">
                            {w.published_url && (
                              <Button size="sm" variant="ghost" asChild>
                                <a href={w.published_url} target="_blank" rel="noopener noreferrer"><Eye className="h-3.5 w-3.5" /></a>
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => deleteWebsite(w.id)} className="text-destructive hover:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden divide-y divide-border">
                  {websites.map((w) => (
                    <div key={w.id} className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{w.name}</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${w.status === "published" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>{w.status}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{getUserEmail(w.user_id)} · {new Date(w.created_at).toLocaleDateString()}</div>
                      <div className="flex gap-2">
                        {w.published_url && (
                          <Button size="sm" variant="outline" className="flex-1" asChild>
                            <a href={w.published_url} target="_blank" rel="noopener noreferrer"><Eye className="h-3.5 w-3.5 mr-1" /> View</a>
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="text-destructive" onClick={() => deleteWebsite(w.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <div className="space-y-6">
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-lg font-display font-bold mb-4">Platform Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold mb-3">Recent Signups</h3>
                      <div className="space-y-2">
                        {profiles.slice(0, 5).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((p) => (
                          <div key={p.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/30">
                            <span className="truncate">{p.email}</span>
                            <span className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-3">Recent Websites</h3>
                      <div className="space-y-2">
                        {websites.slice(0, 5).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((w) => (
                          <div key={w.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/30">
                            <span className="truncate">{w.name}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${w.status === "published" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>{w.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-lg font-display font-bold mb-2">System Information</h2>
                  <p className="text-sm text-muted-foreground mb-4">Technical details for academic presentation</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {[
                      ["Frontend", "React + TypeScript + Tailwind CSS"],
                      ["Backend", "Lovable Cloud (Supabase)"],
                      ["Database", "PostgreSQL with RLS"],
                      ["AI Engine", "Google Gemini via Lovable AI"],
                      ["Authentication", "Email + Password (Supabase Auth)"],
                      ["Edge Functions", "Deno runtime (serverless)"],
                      ["Storage", "Cloud object storage (website-images bucket)"],
                      ["Deployment", "Lovable Cloud + Vercel compatible"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between p-3 rounded-lg bg-muted/30">
                        <span className="font-medium">{label}</span>
                        <span className="text-muted-foreground text-xs">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
