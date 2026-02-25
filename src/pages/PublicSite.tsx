import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const getShowcaseImages = (content: any, name: string): string[] => {
  const configuredImages = [
    content?.hero?.image,
    content?.hero?.image_url,
    ...(Array.isArray(content?.images) ? content.images : []),
    ...(Array.isArray(content?.gallery?.images) ? content.gallery.images : []),
  ].filter((url): url is string => typeof url === "string" && url.length > 0);

  if (configuredImages.length > 0) return configuredImages.slice(0, 3);

  const seed = encodeURIComponent(name || "business-site");
  return [
    `https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80&${seed}`,
    `https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80&${seed}`,
    `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80&${seed}`,
  ];
};

const PublicSite = () => {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<any>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    // Fetch published website (uses published status check)
    supabase
      .from("websites")
      .select("name, generated_content, color_theme")
      .eq("id", id)
      .eq("status", "published")
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setContent(data.generated_content);
          setName(data.name);
        }
        setLoading(false);
      });
  }, [id]);

  const showcaseImages = useMemo(() => getShowcaseImages(content, name), [content, name]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold mb-2">404</h1>
          <p className="text-muted-foreground">This website is not published or doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="gold-gradient p-16 text-center">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-4">
          {content?.hero?.heading || name}
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
          {content?.hero?.subheading || "Welcome"}
        </p>
      </header>

      {/* Showcase Images */}
      {showcaseImages.length > 0 && (
        <section className="p-8 md:p-12 bg-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {showcaseImages.map((image, index) => (
              <div key={image + index} className="overflow-hidden rounded-xl border border-border bg-background">
                <img
                  src={image}
                  alt={`${name} showcase image ${index + 1}`}
                  className="w-full h-56 object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About */}
      {content?.about && (
        <section className="p-12 md:p-16 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold mb-4">{content.about.heading || "About Us"}</h2>
          <p className="text-muted-foreground leading-relaxed">{content.about.text}</p>
        </section>
      )}

      {/* Services */}
      {content?.services && (
        <section className="p-12 md:p-16 bg-card">
          <h2 className="text-3xl font-display font-bold text-center mb-10">
            {content.services.heading || "Our Services"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(content.services.items || []).map((item: any, i: number) => (
              <div key={i} className="bg-background rounded-xl p-6 border border-border text-center">
                <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {content?.testimonials && content.testimonials.length > 0 && (
        <section className="p-12 md:p-16">
          <h2 className="text-3xl font-display font-bold text-center mb-10">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {content.testimonials.map((t: any, i: number) => (
              <div key={i} className="bg-card rounded-xl p-6 border border-border">
                <p className="text-muted-foreground italic mb-3">"{t.text}"</p>
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {content?.contact && (
        <section className="p-12 md:p-16 bg-card text-center">
          <h2 className="text-3xl font-display font-bold mb-6">{content.contact.heading || "Contact Us"}</h2>
          <div className="space-y-2 text-muted-foreground">
            {content.contact.phone && <p>📞 {content.contact.phone}</p>}
            {content.contact.email && <p>✉️ {content.contact.email}</p>}
            {content.contact.address && <p>📍 {content.contact.address}</p>}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="charcoal-gradient p-6 text-center">
        <p className="text-secondary-foreground/60 text-sm">
          © {new Date().getFullYear()} {name}. Built with DigiRise.
        </p>
      </footer>
    </div>
  );
};

export default PublicSite;

