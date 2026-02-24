import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Sparkles, ArrowLeft, Save, Mail, Lock, User, Trash2 } from "lucide-react";

const Settings = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
        return;
      }
      setEmail(session.user.email || "");
      setFullName(session.user.user_metadata?.full_name || "");
    });
  }, [navigate]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates: Record<string, any> = {};
      if (fullName.trim()) updates.data = { full_name: fullName.trim() };
      if (newPassword.length >= 6) updates.password = newPassword;

      if (Object.keys(updates).length === 0) {
        toast({ title: "No changes to save" });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;

      toast({ title: "Settings updated!" });
      setNewPassword("");
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke("delete-user", {
        body: { action: "delete-self" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      await supabase.auth.signOut();
      toast({ title: "Account deleted", description: "Your account has been permanently removed." });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Failed to delete account", description: err.message, variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-display font-bold">DigiRise</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold mb-6">Account Settings</h1>

          <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10" maxLength={100} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={email} disabled className="pl-10 opacity-60" />
              </div>
              <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
            </div>

            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full gold-gradient text-primary-foreground h-12 font-semibold gold-glow"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          {/* Danger Zone */}
          <div className="mt-8 bg-card rounded-2xl border border-destructive/30 p-6">
            <h2 className="text-lg font-display font-bold text-destructive mb-2">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full h-12 font-semibold">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your account, all your websites, and all associated data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting ? "Deleting..." : "Yes, delete my account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
