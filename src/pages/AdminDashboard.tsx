import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles, LogOut, Users, CheckCircle, XCircle, Globe, Shield, Loader2,
} from "lucide-react";

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
}

const AdminDashboard = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [websites, setWebsites] = useState<UserWebsite[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }

      // Check admin role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");

      if (!roles || roles.length === 0) {
        toast({ title: "Access denied", description: "You are not an admin.", variant: "destructive" });
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
      supabase.from("websites").select("id, name, status, user_id"),
    ]);

    if (profilesRes.data) {
      // Fetch emails using the security definer function
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

    const { error } = await supabase
      .from("profiles")
      .update({
        payment_confirmed: newStatus,
        payment_confirmed_at: newStatus ? new Date().toISOString() : null,
        payment_confirmed_by: newStatus ? session?.user.id ?? null : null,
      })
      .eq("id", profile.id);

    if (error) {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    } else {
      toast({ title: newStatus ? "Payment confirmed" : "Payment revoked" });
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profile.id
            ? { ...p, payment_confirmed: newStatus, payment_confirmed_at: newStatus ? new Date().toISOString() : null }
            : p
        )
      );
    }
    setToggling(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getUserWebsiteCount = (userId: string) =>
    websites.filter((w) => w.user_id === userId).length;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-display font-bold">DigiRise</span>
            <span className="ml-2 text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Shield className="inline h-3 w-3 mr-1" />Admin
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground mb-8">Manage users and payment confirmations</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <Users className="h-8 w-8 text-primary mb-2" />
            <div className="text-3xl font-display font-bold">{profiles.length}</div>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border">
            <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
            <div className="text-3xl font-display font-bold">
              {profiles.filter((p) => p.payment_confirmed).length}
            </div>
            <p className="text-sm text-muted-foreground">Paid Users</p>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border">
            <Globe className="h-8 w-8 text-primary mb-2" />
            <div className="text-3xl font-display font-bold">{websites.length}</div>
            <p className="text-sm text-muted-foreground">Total Websites</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-display font-bold">Platform Users</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-semibold">Email</th>
                    <th className="text-left p-4 font-semibold">Business</th>
                    <th className="text-left p-4 font-semibold">Websites</th>
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
                        <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                          {getUserWebsiteCount(p.user_id)}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {p.payment_confirmed ? (
                          <span className="inline-flex items-center gap-1 text-green-600 text-xs font-semibold">
                            <CheckCircle className="h-3.5 w-3.5" /> Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
                            <XCircle className="h-3.5 w-3.5" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <Button
                          size="sm"
                          variant={p.payment_confirmed ? "outline" : "default"}
                          className={!p.payment_confirmed ? "gold-gradient text-primary-foreground" : ""}
                          disabled={toggling === p.id}
                          onClick={() => togglePayment(p)}
                        >
                          {toggling === p.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : p.payment_confirmed ? (
                            "Revoke"
                          ) : (
                            "Confirm Payment"
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
