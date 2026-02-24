import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles, ArrowRight, ArrowLeft, Building2, Palette, Type, Globe, Phone, Loader2,
} from "lucide-react";

const BUSINESS_TYPES = [
  "Restaurant", "Salon", "School", "Boutique", "Consultancy",
  "Gym", "Clinic", "Real Estate", "E-commerce", "Photography", "Other",
];

const COLOR_THEMES = [
  { value: "gold", label: "Gold & Amber", colors: ["#D4A017", "#B8860B"] },
  { value: "ocean", label: "Ocean Blue", colors: ["#0077B6", "#023E8A"] },
  { value: "forest", label: "Forest Green", colors: ["#2D6A4F", "#1B4332"] },
  { value: "sunset", label: "Sunset Orange", colors: ["#E76F51", "#F4A261"] },
  { value: "royal", label: "Royal Purple", colors: ["#7B2CBF", "#5A189A"] },
  { value: "minimal", label: "Minimal Gray", colors: ["#333333", "#666666"] },
];

const LOGO_STYLES = ["Modern", "Classic", "Creative", "Minimalist"];

const Builder = () => {
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    colorTheme: "gold",
    logoStyle: "Modern",
    socialLinks: { facebook: "", instagram: "", twitter: "" },
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/login"); return; }
      setSessionChecked(true);
    });
  }, [navigate]);

  const updateForm = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));
  const updateSocial = (key: string, value: string) =>
    setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, [key]: value } }));

  const handleGenerate = async () => {
    if (!form.businessName.trim() || !form.businessType || !form.description.trim()) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }

    setGenerating(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      // Call AI to generate website content
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-website`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            businessName: form.businessName.trim(),
            businessType: form.businessType,
            description: form.description.trim(),
            colorTheme: form.colorTheme,
            logoStyle: form.logoStyle,
            contactInfo: {
              phone: form.phone.trim(),
              email: form.email.trim(),
              address: form.address.trim(),
            },
            socialLinks: form.socialLinks,
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to generate website");
      }

      const generatedContent = await response.json();

      // Save to database
      const { data: website, error } = await supabase
        .from("websites")
        .insert({
          user_id: session.user.id,
          name: form.businessName.trim(),
          business_type: form.businessType,
          generated_content: generatedContent,
          color_theme: form.colorTheme,
          status: "draft",
        })
        .select()
        .single();

      if (error) throw error;

      toast({ title: "Website generated!", description: "Your AI website is ready." });
      navigate(`/builder/${website.id}`);
    } catch (err: any) {
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  if (!sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-display font-bold">DigiRise</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step >= s ? "gold-gradient text-primary-foreground gold-glow" : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Business Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Building2 className="h-12 w-12 text-primary mx-auto mb-3" />
                <h2 className="text-2xl font-display font-bold">Tell us about your business</h2>
                <p className="text-muted-foreground">We'll use this to create the perfect website</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Business Name *</Label>
                  <Input
                    placeholder="e.g. Sunshine Salon"
                    value={form.businessName}
                    onChange={(e) => updateForm("businessName", e.target.value)}
                    maxLength={100}
                  />
                </div>

                <div>
                  <Label>Business Type *</Label>
                  <Select value={form.businessType} onValueChange={(v) => updateForm("businessType", v)}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Business Description *</Label>
                  <Textarea
                    placeholder="Describe what your business does, your unique value, and your target audience..."
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    rows={4}
                    maxLength={1000}
                  />
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full gold-gradient text-primary-foreground h-12 font-semibold gold-glow"
                disabled={!form.businessName || !form.businessType || !form.description}
              >
                Next: Contact & Branding <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Contact & Branding */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Palette className="h-12 w-12 text-primary mx-auto mb-3" />
                <h2 className="text-2xl font-display font-bold">Contact & Branding</h2>
                <p className="text-muted-foreground">Customize your website's look</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="+1 234 567 890" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} className="pl-10" maxLength={20} />
                    </div>
                  </div>
                  <div>
                    <Label>Business Email</Label>
                    <Input placeholder="info@business.com" value={form.email} onChange={(e) => updateForm("email", e.target.value)} maxLength={255} />
                  </div>
                </div>

                <div>
                  <Label>Address</Label>
                  <Input placeholder="123 Main St, City" value={form.address} onChange={(e) => updateForm("address", e.target.value)} maxLength={200} />
                </div>

                <div>
                  <Label>Color Theme</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {COLOR_THEMES.map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => updateForm("colorTheme", theme.value)}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          form.colorTheme === theme.value
                            ? "border-primary gold-glow"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <div className="flex gap-1 mb-2">
                          {theme.colors.map((c) => (
                            <div key={c} className="w-6 h-6 rounded-full" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        <span className="text-xs font-medium">{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Logo Style</Label>
                  <div className="grid grid-cols-4 gap-3 mt-2">
                    {LOGO_STYLES.map((style) => (
                      <button
                        key={style}
                        onClick={() => updateForm("logoStyle", style)}
                        className={`p-3 rounded-xl border-2 text-center text-sm font-medium transition-all ${
                          form.logoStyle === style
                            ? "border-primary gold-glow bg-primary/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1 gold-gradient text-primary-foreground h-12 font-semibold gold-glow">
                  Next: Social Links <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Social & Generate */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Globe className="h-12 w-12 text-primary mx-auto mb-3" />
                <h2 className="text-2xl font-display font-bold">Social Links & Generate</h2>
                <p className="text-muted-foreground">Add your social profiles (optional)</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Facebook URL</Label>
                  <Input placeholder="https://facebook.com/yourbusiness" value={form.socialLinks.facebook} onChange={(e) => updateSocial("facebook", e.target.value)} maxLength={200} />
                </div>
                <div>
                  <Label>Instagram URL</Label>
                  <Input placeholder="https://instagram.com/yourbusiness" value={form.socialLinks.instagram} onChange={(e) => updateSocial("instagram", e.target.value)} maxLength={200} />
                </div>
                <div>
                  <Label>Twitter / X URL</Label>
                  <Input placeholder="https://x.com/yourbusiness" value={form.socialLinks.twitter} onChange={(e) => updateSocial("twitter", e.target.value)} maxLength={200} />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-card rounded-xl border border-border p-4">
                <h4 className="font-display font-bold mb-2">Summary</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><span className="font-medium text-foreground">Business:</span> {form.businessName}</p>
                  <p><span className="font-medium text-foreground">Type:</span> {form.businessType}</p>
                  <p><span className="font-medium text-foreground">Theme:</span> {COLOR_THEMES.find(t => t.value === form.colorTheme)?.label}</p>
                  <p><span className="font-medium text-foreground">Logo Style:</span> {form.logoStyle}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex-1 gold-gradient text-primary-foreground h-14 font-semibold text-lg gold-glow"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" /> Generate Website
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Builder;
