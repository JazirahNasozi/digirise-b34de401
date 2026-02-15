import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, ArrowLeft, Download, Eye, Loader2 } from "lucide-react";

interface WebsiteData {
  id: string;
  name: string;
  business_type: string | null;
  generated_content: any;
  color_theme: string | null;
  status: string;
}

const WebsitePreview = () => {
  const { id } = useParams<{ id: string }>();
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    supabase
      .from("websites")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          toast({ title: "Website not found", variant: "destructive" });
          navigate("/dashboard");
          return;
        }
        setWebsite(data as WebsiteData);
        setLoading(false);
      });
  }, [id, navigate, toast]);

  const renderPreview = () => {
    if (!website?.generated_content) return null;
    const content = website.generated_content as any;

    return (
      <div className="bg-background rounded-xl border border-border overflow-hidden">
        {/* Hero */}
        <div className="gold-gradient p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
            {content.hero?.heading || website.name}
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            {content.hero?.subheading || "Welcome to our business"}
          </p>
        </div>

        {/* About */}
        {content.about && (
          <div className="p-12 text-center">
            <h2 className="text-3xl font-display font-bold mb-4">{content.about.heading || "About Us"}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{content.about.text}</p>
          </div>
        )}

        {/* Services */}
        {content.services && (
          <div className="p-12 bg-card">
            <h2 className="text-3xl font-display font-bold text-center mb-8">
              {content.services.heading || "Our Services"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {(content.services.items || []).map((item: any, i: number) => (
                <div key={i} className="bg-background rounded-xl p-6 border border-border text-center">
                  <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        {content.contact && (
          <div className="p-12 text-center">
            <h2 className="text-3xl font-display font-bold mb-4">{content.contact.heading || "Contact Us"}</h2>
            <div className="space-y-2 text-muted-foreground">
              {content.contact.phone && <p>📞 {content.contact.phone}</p>}
              {content.contact.email && <p>✉️ {content.contact.email}</p>}
              {content.contact.address && <p>📍 {content.contact.address}</p>}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="charcoal-gradient p-6 text-center">
          <p className="text-secondary-foreground/60 text-sm">
            © {new Date().getFullYear()} {website.name}. Built with DigiRise.
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
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
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold">{website?.name}</h1>
              <p className="text-muted-foreground">Preview your generated website</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
              <Button size="sm" className="gold-gradient text-primary-foreground gold-glow">
                <Eye className="h-4 w-4 mr-2" /> Publish
              </Button>
            </div>
          </div>

          {renderPreview()}
        </motion.div>
      </main>
    </div>
  );
};

export default WebsitePreview;
