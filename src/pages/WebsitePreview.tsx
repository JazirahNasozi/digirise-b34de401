import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles, ArrowLeft, Download, Eye, Loader2, CheckCircle, Copy, Mail, Palette,
  Monitor, Tablet, Smartphone,
} from "lucide-react";
import WebsiteImageManager from "@/components/WebsiteImageManager";
import WebsiteRenderer from "@/components/website/WebsiteRenderer";
import { COLOR_THEMES, getTheme } from "@/lib/theme-colors";

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

type DevicePreview = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTHS: Record<DevicePreview, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

const WebsitePreview = () => {
  const { id } = useParams<{ id: string }>();
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState<boolean | null>(null);
  const [userImages, setUserImages] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState("gold");
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [devicePreview, setDevicePreview] = useState<DevicePreview>("desktop");
  const imageManagerRef = useRef<HTMLDivElement>(null);
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
      setSelectedTheme(data.color_theme || "gold");
      const gc = data.generated_content as any;
      setUserImages(Array.isArray(gc?.user_images) ? gc.user_images : []);

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

  const handleImagesChange = useCallback(
    async (newImages: string[]) => {
      setUserImages(newImages);
      if (!website) return;
      const gc = (website.generated_content as any) || {};
      const updatedContent = { ...gc, user_images: newImages };
      await supabase.from("websites").update({ generated_content: updatedContent as any }).eq("id", website.id);
      setWebsite((w) => (w ? { ...w, generated_content: updatedContent } : w));
    },
    [website]
  );

  const handleContentChange = useCallback(
    async (path: string, value: any) => {
      if (!website) return;
      const gc = { ...((website.generated_content as any) || {}) };
      const keys = path.split(".");
      let obj = gc;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const nextKey = keys[i + 1];
        if (!isNaN(Number(nextKey))) {
          if (!Array.isArray(obj[key])) obj[key] = [];
        } else {
          if (!obj[key] || typeof obj[key] !== "object") obj[key] = {};
        }
        obj = obj[key];
      }
      const lastKey = keys[keys.length - 1];
      if (!isNaN(Number(lastKey))) obj[Number(lastKey)] = value;
      else obj[lastKey] = value;

      setWebsite((w) => (w ? { ...w, generated_content: gc } : w));
      await supabase.from("websites").update({ generated_content: gc as any }).eq("id", website.id);
    },
    [website]
  );

  const handleThemeChange = useCallback(
    async (themeValue: string) => {
      setSelectedTheme(themeValue);
      if (!website) return;
      await supabase.from("websites").update({ color_theme: themeValue }).eq("id", website.id);
      setWebsite((w) => (w ? { ...w, color_theme: themeValue } : w));
      toast({ title: "Theme updated!" });
    },
    [website, toast]
  );

  const handlePublish = async () => {
    if (!website) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/login"); return; }
    const { data: profile } = await supabase
      .from("profiles").select("payment_confirmed").eq("user_id", session.user.id).maybeSingle();
    const isPaid = Boolean(profile?.payment_confirmed);
    setPaymentConfirmed(isPaid);
    if (!isPaid) {
      toast({ title: "Payment required", description: "Contact admin to confirm payment.", variant: "destructive" });
      return;
    }
    setPublishing(true);
    const publicUrl = `${window.location.origin}/site/${website.id}`;
    const { error } = await supabase.from("websites").update({ status: "published", published_url: publicUrl }).eq("id", website.id);
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
      toast({ title: "Link copied!" });
    }
  };

  const handleExport = () => {
    if (!website?.generated_content) return;
    setExporting(true);
    const content = website.generated_content as any;
    const theme = getTheme(selectedTheme);
    const socials = content.socialLinks || {};

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${content.seo?.title || website.name}</title>
  <meta name="description" content="${content.seo?.description || ""}">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;color:#1a1a2e;line-height:1.6}h1,h2,h3{font-family:'Playfair Display',serif}.hero{background:${theme.heroGradient};color:hsl(${theme.primaryForeground});padding:80px 20px;text-align:center}.hero h1{font-size:clamp(2rem,5vw,3.5rem);margin-bottom:16px}.hero p{font-size:1.1rem;opacity:.9;max-width:600px;margin:0 auto}.section{padding:64px 20px;max-width:900px;margin:0 auto;text-align:center}.section h2{font-size:2rem;margin-bottom:20px}.services{background:#f8f8f8;padding:64px 20px}.services-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;max-width:1000px;margin:0 auto}.service-card{background:#fff;border:1px solid #eee;border-radius:16px;padding:32px 24px;text-align:center}.footer{background:#1a1a2e;color:rgba(255,255,255,.5);padding:24px;text-align:center;font-size:.85rem}@media(max-width:640px){.hero{padding:48px 16px}}</style>
</head>
<body>
  <div class="hero"><h1>${content.hero?.heading || website.name}</h1><p>${content.hero?.subheading || ""}</p></div>
  ${content.about ? `<div class="section"><h2>${content.about.heading || "About Us"}</h2><p>${content.about.text}</p></div>` : ""}
  ${content.services ? `<div class="services"><h2 style="text-align:center;font-size:2rem;margin-bottom:32px">${content.services.heading || "Our Services"}</h2><div class="services-grid">${(content.services.items || []).map((s: any) => `<div class="service-card"><h3>${s.title}</h3><p>${s.description}</p></div>`).join("")}</div></div>` : ""}
  <div class="footer"><p>&copy; ${new Date().getFullYear()} ${website.name}. Built with DigiRise.</p></div>
</body></html>`;

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
    toast({ title: "Website exported!" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const content = (website?.generated_content as any) || {};
  const socials = content.socialLinks || {};

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
              <p className="text-muted-foreground text-sm">Click any text to edit it</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => setShowThemePicker(!showThemePicker)}>
                <Palette className="h-4 w-4 mr-2" /> Theme
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
              {website?.status === "published" ? (
                <Button size="sm" variant="outline" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4 mr-2" /> Copy Link
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handlePublish}
                  disabled={publishing}
                >
                  {publishing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Eye className="h-4 w-4 mr-2" />}
                  {publishing ? "Publishing..." : "Publish"}
                </Button>
              )}
            </div>
          </div>

          {/* Device preview toggle */}
          <div className="flex items-center gap-1 mb-6 bg-card rounded-lg border border-border p-1 w-fit">
            {([
              { key: "desktop" as DevicePreview, icon: Monitor, label: "Desktop" },
              { key: "tablet" as DevicePreview, icon: Tablet, label: "Tablet" },
              { key: "mobile" as DevicePreview, icon: Smartphone, label: "Mobile" },
            ]).map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setDevicePreview(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  devicePreview === key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>

          {/* Theme Picker */}
          {showThemePicker && (
            <div className="mb-6 p-4 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold mb-3">Select Color Theme</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {COLOR_THEMES.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => handleThemeChange(theme.value)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      selectedTheme === theme.value
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex gap-1 mb-1.5">
                      {theme.colors.map((c) => (
                        <div key={c} className="w-5 h-5 rounded-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-xs font-medium">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image Manager */}
          {website && (
            <div ref={imageManagerRef}>
              <WebsiteImageManager websiteId={website.id} images={userImages} onImagesChange={handleImagesChange} />
            </div>
          )}

          {/* Payment notice */}
          {website?.status !== "published" && paymentConfirmed === false && (
            <section className="mb-6 p-4 rounded-xl border border-border bg-card">
              <p className="text-sm font-semibold mb-1">Payment confirmation required</p>
              <p className="text-sm text-muted-foreground mb-3">Email the admin to confirm your payment, then click Publish.</p>
              <a
                href={`mailto:${ADMIN_PAYMENT_EMAIL}?subject=Payment%20Confirmation%20Request`}
                className="inline-flex items-center gap-2 text-sm text-primary underline"
              >
                <Mail className="h-4 w-4" /> {ADMIN_PAYMENT_EMAIL}
              </a>
            </section>
          )}

          {/* Published URL */}
          {website?.status === "published" && website.published_url && (
            <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Your site is live!</p>
                <a href={website.published_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline truncate block">
                  {website.published_url}
                </a>
              </div>
            </div>
          )}

          {/* Website Preview with device sizing */}
          <div
            className="mx-auto transition-all duration-300"
            style={{ maxWidth: DEVICE_WIDTHS[devicePreview] }}
          >
            <WebsiteRenderer
              content={content}
              name={website?.name || ""}
              colorTheme={selectedTheme}
              images={userImages}
              editable={true}
              onContentChange={handleContentChange}
              onUploadClick={() => imageManagerRef.current?.querySelector("button")?.click()}
              socialLinks={socials}
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default WebsitePreview;
