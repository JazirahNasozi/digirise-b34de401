import { useMemo } from "react";
import { getTheme } from "@/lib/theme-colors";
import EditableText from "./EditableText";
import {
  ImagePlus, Phone, Mail, MapPin, Facebook, Instagram, Twitter,
  ChevronDown, ChevronUp, Calendar, MessageSquare,
} from "lucide-react";
import { useState } from "react";

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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const update = (path: string, value: string) => {
    onContentChange?.(path, value);
  };

  const ensureUrl = (url: string) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const mapsUrl = (address: string) =>
    `https://www.google.com/maps/search/${encodeURIComponent(address)}`;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const heroStyle = { background: theme.heroGradient };
  const heroPrimaryFg = `hsl(${theme.primaryForeground})`;
  const accentColor = `hsl(${theme.primary})`;

  const navLinks = [
    content?.about && "About",
    content?.services && "Services",
    images.length > 0 && "Gallery",
    content?.testimonials?.length > 0 && "Testimonials",
    content?.faq?.items?.length > 0 && "FAQ",
    content?.blog?.posts?.length > 0 && "Blog",
    content?.contact && "Contact",
  ].filter(Boolean);

  return (
    <div className="bg-background rounded-xl border border-border overflow-hidden">
      {/* Nav */}
      <nav className="px-6 py-3 flex items-center justify-between" style={{ background: theme.heroGradient }}>
        <span className="font-display font-bold text-lg" style={{ color: heroPrimaryFg }}>{name}</span>
        <div className="hidden sm:flex items-center gap-5 text-sm font-medium" style={{ color: heroPrimaryFg, opacity: 0.85 }}>
          {navLinks.map((link) => (
            <button
              key={link as string}
              onClick={() => scrollTo((link as string).toLowerCase())}
              className="hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-none p-0"
              style={{ color: "inherit", font: "inherit" }}
            >
              {link as string}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <header id="home" style={heroStyle} className="px-6 py-20 md:py-28 text-center">
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

      {/* About */}
      {(content?.about || editable) && (
        <section id="about" className="px-6 py-14 md:py-20 text-center max-w-4xl mx-auto">
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
        <section id="services" className="px-6 py-14 md:py-20 bg-muted/30">
          <EditableText
            value={content.services.heading || "Our Services"}
            onChange={(v) => update("services.heading", v)}
            as="h2"
            className="text-3xl font-display font-bold text-center mb-10"
            editable={editable}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(content.services.items || []).map((item: any, i: number) => (
              <div key={i} className="bg-background rounded-xl p-6 border border-border text-center shadow-sm hover:shadow-md transition-shadow">
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

      {/* Gallery */}
      {(images.length > 0 || editable) && (
        <section id="gallery" className="px-6 py-14 md:py-20">
          <h2 className="text-3xl font-display font-bold text-center mb-10">Gallery</h2>
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
      )}

      {/* Testimonials */}
      {content?.testimonials && content.testimonials.length > 0 && (
        <section id="testimonials" className="px-6 py-14 md:py-20 bg-muted/30">
          <h2 className="text-3xl font-display font-bold text-center mb-10">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {content.testimonials.map((t: any, i: number) => (
              <div key={i} className="bg-background rounded-xl p-6 border border-border">
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

      {/* FAQ */}
      {content?.faq?.items && content.faq.items.length > 0 && (
        <section id="faq" className="px-6 py-14 md:py-20">
          <h2 className="text-3xl font-display font-bold text-center mb-10">
            {content.faq.heading || "Frequently Asked Questions"}
          </h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {content.faq.items.map((item: any, i: number) => (
              <div key={i} className="border border-border rounded-xl overflow-hidden bg-background">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm hover:bg-muted/30 transition-colors"
                >
                  <span>{item.question}</span>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Blog / News */}
      {content?.blog?.posts && content.blog.posts.length > 0 && (
        <section id="blog" className="px-6 py-14 md:py-20 bg-muted/30">
          <h2 className="text-3xl font-display font-bold text-center mb-10">
            {content.blog.heading || "Latest News & Updates"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {content.blog.posts.map((post: any, i: number) => (
              <article key={i} className="bg-background rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-2" style={{ background: theme.heroGradient }} />
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <h3 className="font-display font-bold text-base mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {content?.contact && (
        <section id="contact" className="px-6 py-14 md:py-20 text-center">
          <EditableText
            value={content.contact.heading || "Contact Us"}
            onChange={(v) => update("contact.heading", v)}
            as="h2"
            className="text-3xl font-display font-bold mb-4"
            editable={editable}
          />
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-sm">
            Get in touch with {name}. We'd love to hear from you.
          </p>
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
          {/* Simple contact prompt */}
          <div className="mt-10 max-w-md mx-auto bg-muted/50 rounded-xl p-6 border border-border">
            <MessageSquare className="h-8 w-8 mx-auto mb-3" style={{ color: accentColor }} />
            <p className="text-sm font-semibold mb-1">Send us a message</p>
            <p className="text-xs text-muted-foreground">
              {content.contact.email
                ? `Email us at ${content.contact.email}`
                : content.contact.phone
                ? `Call us at ${content.contact.phone}`
                : "Get in touch with us today"}
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-6 py-10 text-center" style={{ background: "hsl(220, 20%, 10%)" }}>
        <p className="font-display font-bold text-lg mb-1" style={{ color: "rgba(255,255,255,0.8)" }}>{name}</p>
        {content?.contact?.address && (
          <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>{content.contact.address}</p>
        )}
        {socialLinks && (socialLinks.facebook || socialLinks.instagram || socialLinks.twitter) && (
          <div className="flex items-center justify-center gap-4 mb-4">
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.5)" }} className="hover:opacity-80 transition-opacity">
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.5)" }} className="hover:opacity-80 transition-opacity">
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.5)" }} className="hover:opacity-80 transition-opacity">
                <Twitter className="h-5 w-5" />
              </a>
            )}
          </div>
        )}
        <p style={{ color: "rgba(255,255,255,0.3)" }} className="text-sm">
          © {new Date().getFullYear()} {name}. Built with DigiRise.
        </p>
      </footer>
    </div>
  );
};

export default WebsiteRenderer;
