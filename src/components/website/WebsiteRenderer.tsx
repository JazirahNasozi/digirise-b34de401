import { useMemo } from "react";
import { getTheme } from "@/lib/theme-colors";
import EditableText from "./EditableText";
import { ImagePlus, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

interface WebsiteRendererProps {
  content: any;
  name: string;
  colorTheme: string;
  images: string[];
  editable?: boolean;
  onContentChange?: (path: string, value: any) => void;
  onUploadClick?: () => void;
  socialLinks?: any;
}

const WebsiteRenderer = ({
  content,
  name,
  colorTheme,
  images,
  editable = false,
  onContentChange,
  onUploadClick,
  socialLinks,
}: WebsiteRendererProps) => {
  const theme = useMemo(() => getTheme(colorTheme), [colorTheme]);

  const update = (path: string, value: string) => {
    onContentChange?.(path, value);
  };

  const heroStyle = { background: theme.heroGradient };
  const heroPrimaryFg = `hsl(${theme.primaryForeground})`;
  const accentColor = `hsl(${theme.primary})`;

  return (
    <div className="bg-background rounded-xl border border-border overflow-hidden">
      {/* Hero */}
      <header style={heroStyle} className="px-6 py-16 md:py-24 text-center">
        <EditableText
          value={content?.hero?.heading || name}
          onChange={(v) => update("hero.heading", v)}
          as="h1"
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4"
          style-color={heroPrimaryFg}
          editable={editable}
        />
        <EditableText
          value={content?.hero?.subheading || ""}
          onChange={(v) => update("hero.subheading", v)}
          as="p"
          className="text-lg md:text-xl max-w-2xl mx-auto opacity-90"
          placeholder="Add a tagline..."
          editable={editable}
        />
        {content?.hero?.cta && (
          <div className="mt-8">
            <a
              href={content.contact?.email ? `mailto:${content.contact.email}` : "#contact"}
              className="inline-block px-8 py-3 rounded-lg font-semibold text-sm transition-transform hover:scale-105"
              style={{ backgroundColor: "rgba(255,255,255,0.2)", color: heroPrimaryFg, backdropFilter: "blur(4px)" }}
            >
              {content.hero.cta}
            </a>
          </div>
        )}
      </header>

      {/* Gallery / Images */}
      <section className="p-8 md:p-12">
        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {images.map((img, i) => (
              <div key={img + i} className="overflow-hidden rounded-xl border border-border bg-muted">
                <img src={img} alt={`${name} photo ${i + 1}`} className="w-full h-56 object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        ) : editable ? (
          <button
            onClick={onUploadClick}
            className="mx-auto flex flex-col items-center justify-center gap-2 w-full max-w-md h-48 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors text-muted-foreground hover:text-primary"
          >
            <ImagePlus className="h-10 w-10" />
            <span className="text-sm font-medium">Upload photos to your gallery</span>
          </button>
        ) : null}
      </section>

      {/* About */}
      {(content?.about || editable) && (
        <section className="px-6 py-12 md:py-16 text-center max-w-4xl mx-auto">
          <EditableText
            value={content?.about?.heading || "About Us"}
            onChange={(v) => update("about.heading", v)}
            as="h2"
            className="text-3xl font-display font-bold mb-6"
            editable={editable}
          />
          <EditableText
            value={content?.about?.text || ""}
            onChange={(v) => update("about.text", v)}
            as="p"
            className="text-muted-foreground leading-relaxed"
            multiline
            placeholder="Tell visitors about your business..."
            editable={editable}
          />
        </section>
      )}

      {/* Services */}
      {content?.services && (
        <section className="px-6 py-12 md:py-16 bg-muted/30">
          <EditableText
            value={content.services.heading || "Our Services"}
            onChange={(v) => update("services.heading", v)}
            as="h2"
            className="text-3xl font-display font-bold text-center mb-10"
            editable={editable}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(content.services.items || []).map((item: any, i: number) => (
              <div
                key={i}
                className="bg-background rounded-xl p-6 border border-border text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: accentColor + "1a", color: accentColor }}
                >
                  {i + 1}
                </div>
                <EditableText
                  value={item.title}
                  onChange={(v) => update(`services.items.${i}.title`, v)}
                  as="h3"
                  className="font-display font-bold text-lg mb-2"
                  editable={editable}
                />
                <EditableText
                  value={item.description}
                  onChange={(v) => update(`services.items.${i}.description`, v)}
                  as="p"
                  className="text-sm text-muted-foreground"
                  editable={editable}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {content?.testimonials && content.testimonials.length > 0 && (
        <section className="px-6 py-12 md:py-16">
          <h2 className="text-3xl font-display font-bold text-center mb-10">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {content.testimonials.map((t: any, i: number) => (
              <div key={i} className="bg-card rounded-xl p-6 border border-border">
                <div className="text-3xl mb-3" style={{ color: accentColor }}>"</div>
                <p className="text-muted-foreground italic mb-4">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: accentColor + "1a", color: accentColor }}
                  >
                    {t.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {content?.contact && (
        <section id="contact" className="px-6 py-12 md:py-16 bg-muted/30 text-center">
          <EditableText
            value={content.contact.heading || "Contact Us"}
            onChange={(v) => update("contact.heading", v)}
            as="h2"
            className="text-3xl font-display font-bold mb-8"
            editable={editable}
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-muted-foreground">
            {content.contact.phone && (
              <a href={`tel:${content.contact.phone}`} className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Phone className="h-4 w-4" /> {content.contact.phone}
              </a>
            )}
            {content.contact.email && (
              <a href={`mailto:${content.contact.email}`} className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Mail className="h-4 w-4" /> {content.contact.email}
              </a>
            )}
            {content.contact.address && (
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {content.contact.address}
              </span>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-6 py-8 text-center" style={{ background: "hsl(220, 20%, 10%)" }}>
        {socialLinks && (socialLinks.facebook || socialLinks.instagram || socialLinks.twitter) && (
          <div className="flex items-center justify-center gap-4 mb-4">
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-secondary-foreground/50 hover:text-secondary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-secondary-foreground/50 hover:text-secondary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-secondary-foreground/50 hover:text-secondary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            )}
          </div>
        )}
        <p className="text-secondary-foreground/40 text-sm">
          © {new Date().getFullYear()} {name}. Built with DigiRise.
        </p>
      </footer>
    </div>
  );
};

export default WebsiteRenderer;
