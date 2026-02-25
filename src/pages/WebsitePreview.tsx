import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, ArrowLeft, Download, Eye, Loader2, CheckCircle, Copy, Mail } from "lucide-react";

interface WebsiteData {
  id: string;
  name: string;
  business_type: string | null;
  generated_content: any;
  color_theme: string | null;
  status: string;
  published_url: string | null;
}

const ADMIN_PAYMENT_EMAIL = "ellyjazmine@gmail.com";

const getShowcaseImages = (content: any, website: WebsiteData | null): string[] => {
  const configuredImages = [
    content?.hero?.image,
    content?.hero?.image_url,
    ...(Array.isArray(content?.images) ? content.images : []),
    ...(Array.isArray(content?.gallery?.images) ? content.gallery.images : []),
  ].filter((url): url is string => typeof url === "string" && url.length > 0);

  if (configuredImages.length > 0) return configuredImages.slice(0, 3);

  const seed = encodeURIComponent(`${website?.business_type || "business"}-${website?.name || "site"}`);
  return [
    `https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80&${seed}`,
    `https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80&${seed}`,
    `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80&${seed}`,
  ];
};

const WebsitePreview = () => {
  const { id } = useParams<{ id: string }>();
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      const [{ data, error }, { data: authData }] = await Promise.all([
        supabase.from("websites").select("*").eq("id", id).maybeSingle(),
        supabase.auth.getSession(),
      ]);

      if (error || !data) {
        toast({ title: "Website not found", variant: "destructive" });
        navigate("/dashboard");
        return;
      }

      setWebsite(data as WebsiteData);

      const session = authData.session;
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("payment_confirmed")
          .eq("user_id", session.user.id)
          .maybeSingle();
        setPaymentConfirmed(Boolean(profile?.payment_confirmed));
      }

      setLoading(false);
    };

    loadData();
  }, [id, navigate, toast]);

  const showcaseImages = useMemo(
    () => getShowcaseImages(website?.generated_content, website),
    [website]
  );

  const handlePublish = async () => {
    if (!website) return;

    // Check payment status before publishing
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("payment_confirmed")
      .eq("user_id", session.user.id)
      .maybeSingle();

    const isPaid = Boolean(profile?.payment_confirmed);
    setPaymentConfirmed(isPaid);

    if (!isPaid) {
      toast({
        title: "Payment required",
        description: "Please contact the admin to confirm your payment before publishing.",
        variant: "destructive",
      });
      return;
    }

    setPublishing(true);
    const publicUrl = `${window.location.origin}/site/${website.id}`;
    const { error } = await supabase
      .from("websites")
      .update({ status: "published", published_url: publicUrl })
      .eq("id", website.id);

    if (error) {
      toast({ title: "Publish failed", description: error.message, variant: "destructive" });
    } else {
      setWebsite((w) => (w ? { ...w, status: "published", published_url: publicUrl } : w));
      toast({ title: "Website published!", description: "Your site is now live." });
    }
    setPublishing(false);
  };

  const handleCopyLink = () => {
    if (website?.published_url) {
      navigator.clipboard.writeText(website.published_url);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  const handleExport = () => {
    if (!website?.generated_content) return;
    setExporting(true);
    const content = website.generated_content as any;
    const exportImages = getShowcaseImages(content, website);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.seo?.title || website.name}</title>
  <meta name="description" content="${content.seo?.description || ""}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a2e; }
    .hero { background: linear-gradient(135deg, #D4A017, #B8860B); color: white; padding: 80px 20px; text-align: center; }
    .hero h1 { font-size: 2.5rem; margin-bottom: 16px; }
    .hero p { font-size: 1.1rem; opacity: 0.9; max-width: 600px; margin: 0 auto; }
    .gallery { padding: 32px 20px; background: #ffffff; }
    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; max-width: 1000px; margin: 0 auto; }
    .gallery-grid img { width: 100%; height: 210px; object-fit: cover; border-radius: 12px; }
    .section { padding: 60px 20px; max-width: 900px; margin: 0 auto; text-align: center; }
    .section h2 { font-size: 2rem; margin-bottom: 16px; }
    .section p { color: #555; line-height: 1.7; }
    .services { background: #f8f8f8; padding: 60px 20px; }
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; max-width: 900px; margin: 24px auto 0; }
    .service-card { background: white; border: 1px solid #eee; border-radius: 12px; padding: 24px; text-align: center; }
    .service-card h3 { font-size: 1.1rem; margin-bottom: 8px; }
    .service-card p { font-size: 0.9rem; color: #666; }
    .contact { padding: 60px 20px; text-align: center; }
    .contact h2 { font-size: 2rem; margin-bottom: 16px; }
    .contact p { color: #555; margin: 4px 0; }
    .footer { background: #1a1a2e; color: rgba(255,255,255,0.5); padding: 24px; text-align: center; font-size: 0.85rem; }
    @media (max-width: 640px) { .hero h1 { font-size: 1.8rem; } .section h2 { font-size: 1.5rem; } }
  </style>
</head>
<body>
  <div class="hero">
    <h1>${content.hero?.heading || website.name}</h1>
    <p>${content.hero?.subheading || ""}</p>
  </div>
  ${exportImages.length ? `<section class="gallery"><div class="gallery-grid">${exportImages
      .map((image: string, idx: number) => `<img src="${image}" alt="${website.name} showcase image ${idx + 1}" loading="lazy" />`)
      .join("")}</div></section>` : ""}
  ${content.about ? `<div class="section"><h2>${content.about.heading || "About Us"}</h2><p>${content.about.text}</p></div>` : ""}
  ${content.services ? `<div class="services"><h2 style="text-align:center;font-size:2rem;margin-bottom:16px;">${content.services.heading || "Our Services"}</h2><div class="services-grid">${(content.services.items || []).map((s: any) => `<div class="service-card"><h3>${s.title}</h3><p>${s.description}</p></div>`).join("")}</div></div>` : ""}
  ${content.contact ? `<div class="contact"><h2>${content.contact.heading || "Contact Us"}</h2>${content.contact.phone ? `<p>📞 ${content.contact.phone}</p>` : ""}${content.contact.email ? `<p>✉️ ${content.contact.email}</p>` : ""}${content.contact.address ? `<p>📍 ${content.contact.address}</p>` : ""}</div>` : ""}
  <div class="footer"><p>&copy; ${new Date().getFullYear()} ${website.name}. Built with DigiRise.</p></div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${website.name.replace(/\s+/g, "-").toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExporting(false);
    toast({ title: "Website exported!", description: "HTML file downloaded." });
  };

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

        {/* Showcase Images */}
        {showcaseImages.length > 0 && (
          <section className="p-8 md:p-10 bg-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {showcaseImages.map((image, index) => (
                <div key={image + index} className="overflow-hidden rounded-xl border border-border bg-background">
                  <img
                    src={image}
                    alt={`${website.name} showcase ${index + 1}`}
                    className="w-full h-56 object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold">{website?.name}</h1>
              <p className="text-muted-foreground">Preview your generated website</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
                <Download className="h-4 w-4 mr-2" /> {exporting ? "Exporting..." : "Export HTML"}
              </Button>
              {website?.status === "published" ? (
                <Button size="sm" variant="outline" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4 mr-2" /> Copy Link
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="gold-gradient text-primary-foreground gold-glow"
                  onClick={handlePublish}
                  disabled={publishing}
                >
                  {publishing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  {publishing ? "Publishing..." : "Publish"}
                </Button>
              )}
            </div>
          </div>

          {/* Payment confirmation contact */}
          {website?.status !== "published" && paymentConfirmed === false && (
            <section className="mb-6 p-4 rounded-xl border border-border bg-card">
              <p className="text-sm font-semibold mb-1">Payment confirmation required before publishing</p>
              <p className="text-sm text-muted-foreground mb-3">
                Email the admin to confirm your payment, then click Publish again.
              </p>
              <a
                href={`mailto:${ADMIN_PAYMENT_EMAIL}?subject=Payment%20Confirmation%20Request&body=Hi%20Admin,%20please%20confirm%20my%20payment%20for%20website%20publishing.`}
                className="inline-flex items-center gap-2 text-sm text-primary underline"
              >
                <Mail className="h-4 w-4" /> {ADMIN_PAYMENT_EMAIL}
              </a>
            </section>
          )}

          {/* Published URL banner */}
          {website?.status === "published" && website.published_url && (
            <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Your site is live!</p>
                <a
                  href={website.published_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary underline truncate block"
                >
                  {website.published_url}
                </a>
              </div>
            </div>
          )}

          {renderPreview()}
        </motion.div>
      </main>
    </div>
  );
};

export default WebsitePreview;

