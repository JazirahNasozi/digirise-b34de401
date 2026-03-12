import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Sparkles, ArrowLeft, Loader2, Lightbulb, Copy, RefreshCw,
} from "lucide-react";

interface GeneratedResult {
  names: string[];
  slogans: string[];
}

const BUSINESS_TYPES = [
  "Salon & Spa", "Restaurant & Café", "Boutique & Fashion", "Retail Shop",
  "Private School", "Consultancy Firm", "Gym & Fitness", "Clinic & Healthcare",
  "Photography Studio", "Real Estate Agency", "E-commerce Store", "Tech Startup",
];

const AINameGenerator = () => {
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/login"); return; }
      setSessionChecked(true);
    });
  }, [navigate]);

  const handleGenerate = async () => {
    if (!industry) {
      toast({ title: "Please select a business type", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-name-generator", {
        body: { industry, location: location.trim(), keywords: keywords.trim() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult({ names: data.names || [], slogans: data.slogans || [] });
    } catch (err: any) {
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
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
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-display font-bold">Name & Slogan Generator</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4 gold-glow">
              <Lightbulb className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-2">AI Business Name & Slogan Generator</h1>
            <p className="text-muted-foreground">
              Get creative business name ideas and catchy slogans tailored to your industry
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 mb-8">
            <div>
              <Label>Business Type *</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Location (optional)</Label>
              <Input
                placeholder="e.g. Kampala, Uganda"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={100}
              />
            </div>

            <div>
              <Label>Keywords (optional)</Label>
              <Input
                placeholder="e.g. modern, elegant, affordable"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                maxLength={200}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !industry}
              className="w-full gold-gradient text-primary-foreground h-12 font-semibold gold-glow"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...</>
              ) : result ? (
                <><RefreshCw className="mr-2 h-5 w-5" /> Generate Again</>
              ) : (
                <><Sparkles className="mr-2 h-5 w-5" /> Generate Names & Slogans</>
              )}
            </Button>
          </div>

          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Names */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> Business Names
                </h3>
                <div className="space-y-2">
                  {result.names.map((name, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 bg-background transition-colors group"
                    >
                      <span className="font-medium">{name}</span>
                      <button
                        onClick={() => copyText(name)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-muted"
                      >
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slogans */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" /> Slogans
                </h3>
                <div className="space-y-2">
                  {result.slogans.map((slogan, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 bg-background transition-colors group"
                    >
                      <span className="italic text-muted-foreground">"{slogan}"</span>
                      <button
                        onClick={() => copyText(slogan)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-muted"
                      >
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AINameGenerator;
