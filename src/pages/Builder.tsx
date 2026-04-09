import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles, ArrowRight, ArrowLeft, Building2, Palette, Globe, Phone, Loader2,
  Briefcase, MapPin, Mail,
} from "lucide-react";
import { COLOR_THEMES } from "@/lib/theme-colors";

const BUSINESS_TYPES = [
  "Restaurant", "Salon", "School", "Boutique", "Consultancy",
  "Gym", "Clinic", "Real Estate", "E-commerce", "Photography", "Other",
];

const TOTAL_STEPS = 5;

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
      if (!session) { navigate("/login"); return; }

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
      generatedContent.socialLinks = form.socialLinks;

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Generating overlay
  if (generating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-16 w-16 text-primary" />
        </motion.div>
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold mb-2">AI is building your website</h2>
          <p className="text-muted-foreground">Generating content, layouts, and SEO for <strong>{form.businessName}</strong>...</p>
        </div>
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "90%" }}
            transition={{ duration: 12, ease: "easeOut" }}
          />
        </div>
      </div>
    );
  }

  const canProceed = (s: number) => {
    if (s === 1) return !!form.businessName.trim();
    if (s === 2) return !!form.businessType;
    if (s === 3) return !!form.description.trim();
    return true;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="DigiRise" className="h-8 w-8" />
            <span className="text-xl font-display font-bold">DigiRise</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-xl">
        {/* Progress bar */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
              {s < TOTAL_STEPS && <div className={`w-8 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {/* Step 1: Business Name */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Building2 className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h2 className="text-2xl font-display font-bold">What's your business name?</h2>
                  <p className="text-muted-foreground text-sm">This will appear on your website header, hero, and footer.</p>
                </div>
                <div>
                  <Label>Business Name *</Label>
                  <Input
                    placeholder="e.g. Sandra Salon"
                    value={form.businessName}
                    onChange={(e) => updateForm("businessName", e.target.value)}
                    maxLength={100}
                    className="h-12 text-lg"
                    autoFocus
                  />
                </div>
                <Button
                  onClick={() => setStep(2)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-semibold"
                  disabled={!canProceed(1)}
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 2: Business Type */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Briefcase className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h2 className="text-2xl font-display font-bold">What type of business?</h2>
                  <p className="text-muted-foreground text-sm">We'll use this to pick the right template and content.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {BUSINESS_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => updateForm("businessType", t)}
                      className={`p-4 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                        form.businessType === t
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-semibold"
                    disabled={!canProceed(2)}
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Services / Description */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Sparkles className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h2 className="text-2xl font-display font-bold">Describe your services</h2>
                  <p className="text-muted-foreground text-sm">Tell us what you offer. The AI will generate website content from this.</p>
                </div>
                <div>
                  <Label>Business Description & Services *</Label>
                  <Textarea
                    placeholder="e.g. We offer professional hair styling, braiding, manicure, pedicure, and makeup services in Kampala..."
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    rows={5}
                    maxLength={1000}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{form.description.length}/1000</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={() => setStep(4)}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-semibold"
                    disabled={!canProceed(3)}
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Contact Details */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Phone className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h2 className="text-2xl font-display font-bold">Contact Details</h2>
                  <p className="text-muted-foreground text-sm">Add your contact info so customers can reach you.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="+256 700 123 456" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} className="pl-10" maxLength={20} />
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="info@business.com" value={form.email} onChange={(e) => updateForm("email", e.target.value)} className="pl-10" maxLength={255} />
                    </div>
                  </div>
                  <div>
                    <Label>Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Kampala, Uganda" value={form.address} onChange={(e) => updateForm("address", e.target.value)} className="pl-10" maxLength={200} />
                    </div>
                  </div>
                </div>
                {/* Color Theme */}
                <div>
                  <Label>Color Theme</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {COLOR_THEMES.map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => updateForm("colorTheme", theme.value)}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          form.colorTheme === theme.value
                            ? "border-primary bg-primary/5"
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
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(3)} className="flex-1 h-12">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={() => setStep(5)}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-semibold"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Review & Generate */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Sparkles className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h2 className="text-2xl font-display font-bold">Ready to Generate</h2>
                  <p className="text-muted-foreground text-sm">Review your details and let AI build your website.</p>
                </div>

                {/* Summary */}
                <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Business Name</span>
                    <span className="font-semibold">{form.businessName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-semibold">{form.businessType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Theme</span>
                    <span className="font-semibold">{COLOR_THEMES.find(t => t.value === form.colorTheme)?.label}</span>
                  </div>
                  {form.phone && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phone</span>
                      <span>{form.phone}</span>
                    </div>
                  )}
                  {form.email && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email</span>
                      <span>{form.email}</span>
                    </div>
                  )}
                </div>

                {/* Social Links (optional) */}
                <div className="space-y-3">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">Social Links (optional)</Label>
                  <Input placeholder="Facebook URL" value={form.socialLinks.facebook} onChange={(e) => updateSocial("facebook", e.target.value)} maxLength={200} />
                  <Input placeholder="Instagram URL" value={form.socialLinks.instagram} onChange={(e) => updateSocial("instagram", e.target.value)} maxLength={200} />
                  <Input placeholder="Twitter / X URL" value={form.socialLinks.twitter} onChange={(e) => updateSocial("twitter", e.target.value)} maxLength={200} />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(4)} className="flex-1 h-12">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-14 font-semibold text-lg"
                  >
                    <Sparkles className="mr-2 h-5 w-5" /> Generate Website
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Builder;
