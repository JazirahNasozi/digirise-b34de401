import { useMemo, useState } from "react";
import { getTheme } from "@/lib/theme-colors";
import EditableText from "./EditableText";
import {
  ImagePlus, Phone, Mail, MapPin, Facebook, Instagram, Twitter,
  ChevronDown, ChevronUp, Calendar, MessageSquare, Menu, X,
  Star, Shield, Clock, Award, Users, TrendingUp, ArrowRight,
  CheckCircle2, Zap, Heart,
} from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const heroStyle = { background: theme.heroGradient };
  const heroPrimaryFg = `hsl(${theme.primaryForeground})`;
  const accentColor = `hsl(${theme.primary})`;

  const navLinks = [
    "Home",
    content?.about && "About",
    content?.services && "Services",
    images.length > 0 && "Gallery",
    content?.testimonials?.length > 0 && "Testimonials",
    content?.faq?.items?.length > 0 && "FAQ",
    content?.blog?.posts?.length > 0 && "Blog",
    content?.contact && "Contact",
  ].filter(Boolean) as string[];

  const heroImage = images.length > 0 ? images[0] : null;

  // Stats data (from AI or defaults)
  const stats = content?.stats || [
    { value: "500+", label: "Happy Clients" },
    { value: "10+", label: "Years Experience" },
    { value: "50+", label: "Projects Completed" },
    { value: "24/7", label: "Support Available" },
  ];

  // Why choose us (from AI or defaults)
  const whyChooseUs = content?.whyChooseUs || {
    heading: `Why Choose ${name}?`,
    items: [
      { title: "Expert Team", description: "Our seasoned professionals bring years of industry expertise to every project.", icon: "award" },
      { title: "Quality Guaranteed", description: "We maintain the highest standards of quality in everything we deliver.", icon: "shield" },
      { title: "Fast Turnaround", description: "Efficient processes ensure your project is completed on time, every time.", icon: "zap" },
      { title: "Customer First", description: "Your satisfaction is our top priority. We listen, adapt, and deliver.", icon: "heart" },
    ],
  };

  const getIcon = (icon: string, className: string) => {
    const props = { className };
    switch (icon) {
      case "award": return <Award {...props} />;
      case "shield": return <Shield {...props} />;
      case "zap": return <Zap {...props} />;
      case "heart": return <Heart {...props} />;
      case "clock": return <Clock {...props} />;
      case "users": return <Users {...props} />;
      case "star": return <Star {...props} />;
      case "trending": return <TrendingUp {...props} />;
      default: return <CheckCircle2 {...props} />;
    }
  };

  return (
    <div className="bg-background rounded-xl border border-border overflow-hidden">
      {/* ═══════════ STICKY NAV ═══════════ */}
      <nav className="sticky top-0 z-50 px-4 sm:px-6 py-3 flex items-center justify-between backdrop-blur-md border-b border-white/10" style={{ background: theme.heroGradient }}>
        <button onClick={() => scrollTo("home")} className="flex items-center gap-2 bg-transparent border-none cursor-pointer p-0">
          <span className="font-display font-bold text-lg sm:text-xl" style={{ color: heroPrimaryFg }}>{name}</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link.toLowerCase())}
              className="px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer bg-transparent border-none"
              style={{ color: heroPrimaryFg, font: "inherit" }}
            >
              {link}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1.5 rounded-md hover:bg-white/10 transition-colors bg-transparent border-none cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ color: heroPrimaryFg }}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border" style={{ background: theme.heroGradient }}>
          <div className="flex flex-col py-2">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link.toLowerCase())}
                className="px-6 py-3 text-left text-sm font-medium hover:bg-white/10 transition-colors bg-transparent border-none cursor-pointer"
                style={{ color: heroPrimaryFg }}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ HERO ═══════════ */}
      <header id="home" style={heroStyle} className="relative overflow-hidden">
        <div className={`px-4 sm:px-6 lg:px-12 ${heroImage ? 'py-14 md:py-20' : 'py-20 md:py-28'}`}>
          <div className={`max-w-6xl mx-auto ${heroImage ? 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center' : 'text-center'}`}>
            {/* Text side */}
            <div className={heroImage ? "text-left" : ""}>
              <EditableText
                value={content?.hero?.heading || name}
                onChange={(v) => update("hero.heading", v)}
                as="h1"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 leading-tight"
                style-color={heroPrimaryFg}
                editable={editable}
              />
              <EditableText
                value={content?.hero?.subheading || ""}
                onChange={(v) => update("hero.subheading", v)}
                as="p"
                className={`text-base sm:text-lg md:text-xl opacity-90 mb-6 ${heroImage ? 'max-w-lg' : 'max-w-2xl mx-auto'}`}
                placeholder="Add a tagline..."
                editable={editable}
              />
              {content?.hero?.cta && (
                <div className="flex flex-wrap gap-3">
                  <a
                    href={content.contact?.email ? `mailto:${content.contact.email}` : "#contact"}
                    onClick={(e) => { if (!content.contact?.email) { e.preventDefault(); scrollTo("contact"); } }}
                    className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm transition-all hover:scale-105 hover:shadow-lg"
                    style={{ backgroundColor: "rgba(255,255,255,0.95)", color: accentColor }}
                  >
                    {content.hero.cta}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => scrollTo("about")}
                    className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm transition-all hover:scale-105 bg-transparent border border-white/30 cursor-pointer"
                    style={{ color: heroPrimaryFg }}
                  >
                    Learn More
                  </button>
                </div>
              )}
            </div>

            {/* Hero image */}
            {heroImage && (
              <div className="relative order-first md:order-last">
                <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                  <img
                    src={heroImage}
                    alt={`${name} hero`}
                    className="w-full h-48 sm:h-64 md:h-80 object-cover"
                  />
                </div>
                {/* Decorative dot grid */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 opacity-20" style={{
                  backgroundImage: `radial-gradient(circle, ${heroPrimaryFg} 1.5px, transparent 1.5px)`,
                  backgroundSize: "12px 12px",
                }} />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="px-4 sm:px-6 py-8 md:py-10 border-b border-border" style={{ background: `linear-gradient(135deg, hsl(${theme.primary} / 0.05), hsl(${theme.accent} / 0.05))` }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          {stats.map((stat: any, i: number) => (
            <div key={i} className="py-2">
              <p className="text-2xl sm:text-3xl md:text-4xl font-display font-bold" style={{ color: accentColor }}>{stat.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ ABOUT ═══════════ */}
      {(content?.about || editable) && (
        <section id="about" className="px-4 sm:px-6 py-14 md:py-20 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Who We Are</p>
              <EditableText
                value={content?.about?.heading || "About Us"}
                onChange={(v) => update("about.heading", v)}
                as="h2"
                className="text-2xl sm:text-3xl font-display font-bold mb-6"
                editable={editable}
              />
              <EditableText
                value={content?.about?.text || ""}
                onChange={(v) => update("about.text", v)}
                as="p"
                className="text-muted-foreground leading-relaxed text-sm sm:text-base"
                multiline
                placeholder="Tell visitors about your business..."
                editable={editable}
              />
            </div>
            {/* About image or accent graphic */}
            {images.length > 1 ? (
              <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
                <img src={images[1]} alt={`About ${name}`} className="w-full h-48 sm:h-64 object-cover" loading="lazy" />
              </div>
            ) : (
              <div className="rounded-2xl p-8 sm:p-12 text-center border border-border" style={{ background: `linear-gradient(135deg, hsl(${theme.primary} / 0.08), hsl(${theme.accent} / 0.08))` }}>
                <Award className="h-16 w-16 mx-auto mb-4" style={{ color: accentColor }} />
                <p className="font-display font-bold text-lg">{name}</p>
                <p className="text-sm text-muted-foreground mt-1">Excellence in Every Detail</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════ WHY CHOOSE US ═══════════ */}
      <section className="px-4 sm:px-6 py-14 md:py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-center" style={{ color: accentColor }}>Our Advantages</p>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-center mb-10">
            {whyChooseUs.heading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {(whyChooseUs.items || []).map((item: any, i: number) => (
              <div key={i} className="flex gap-4 bg-background rounded-xl p-5 sm:p-6 border border-border hover:shadow-md transition-shadow">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: accentColor + "1a", color: accentColor }}
                >
                  {getIcon(item.icon || "check", "h-5 w-5")}
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-base mb-1">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SERVICES ═══════════ */}
      {content?.services && (
        <section id="services" className="px-4 sm:px-6 py-14 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-center" style={{ color: accentColor }}>What We Offer</p>
          <EditableText
            value={content.services.heading || "Our Services"}
            onChange={(v) => update("services.heading", v)}
            as="h2"
            className="text-2xl sm:text-3xl font-display font-bold text-center mb-10"
            editable={editable}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {(content.services.items || []).map((item: any, i: number) => (
              <div key={i} className="bg-background rounded-xl p-5 sm:p-6 border border-border hover:shadow-lg transition-all hover:-translate-y-1 group">
                <div
                  className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-lg font-bold transition-transform group-hover:scale-110"
                  style={{ backgroundColor: accentColor + "1a", color: accentColor }}
                >
                  {i + 1}
                </div>
                <EditableText
                  value={item.title}
                  onChange={(v) => update(`services.items.${i}.title`, v)}
                  as="h3"
                  className="font-display font-bold text-base sm:text-lg mb-2"
                  editable={editable}
                />
                <EditableText
                  value={item.description}
                  onChange={(v) => update(`services.items.${i}.description`, v)}
                  as="p"
                  className="text-xs sm:text-sm text-muted-foreground leading-relaxed"
                  editable={editable}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════ CTA BANNER ═══════════ */}
      <section className="px-4 sm:px-6 py-12 md:py-16" style={{ background: theme.heroGradient }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3" style={{ color: heroPrimaryFg }}>
            Ready to Get Started?
          </h2>
          <p className="text-sm sm:text-base opacity-80 mb-6 max-w-lg mx-auto" style={{ color: heroPrimaryFg }}>
            Join hundreds of satisfied customers who trust {name}. Let's build something amazing together.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={content?.contact?.email ? `mailto:${content.contact.email}` : content?.contact?.phone ? `tel:${content.contact.phone}` : "#contact"}
              onClick={(e) => {
                if (!content?.contact?.email && !content?.contact?.phone) { e.preventDefault(); scrollTo("contact"); }
              }}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm transition-all hover:scale-105"
              style={{ backgroundColor: "rgba(255,255,255,0.95)", color: accentColor }}
            >
              Contact Us Today
              <ArrowRight className="h-4 w-4" />
            </a>
            {content?.contact?.phone && (
              <a
                href={`tel:${content.contact.phone}`}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm border border-white/30 transition-all hover:scale-105 hover:bg-white/10"
                style={{ color: heroPrimaryFg }}
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ GALLERY ═══════════ */}
      {(images.length > 0 || editable) && (
        <section id="gallery" className="px-4 sm:px-6 py-14 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-center" style={{ color: accentColor }}>Our Work</p>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-center mb-10">Gallery</h2>
          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {images.map((img, i) => (
                <div key={img + i} className="overflow-hidden rounded-xl border border-border bg-muted group">
                  <img
                    src={img}
                    alt={`${name} photo ${i + 1}`}
                    className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
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

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      {content?.testimonials && content.testimonials.length > 0 && (
        <section id="testimonials" className="px-4 sm:px-6 py-14 md:py-20 bg-muted/30">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-center" style={{ color: accentColor }}>Testimonials</p>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-center mb-10">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {content.testimonials.map((t: any, i: number) => (
              <div key={i} className="bg-background rounded-xl p-5 sm:p-6 border border-border hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-current" style={{ color: accentColor }} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic mb-4 leading-relaxed">"{t.text}"</p>
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

      {/* ═══════════ FAQ ═══════════ */}
      {content?.faq?.items && content.faq.items.length > 0 && (
        <section id="faq" className="px-4 sm:px-6 py-14 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-center" style={{ color: accentColor }}>Questions?</p>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-center mb-10">
            {content.faq.heading || "Frequently Asked Questions"}
          </h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {content.faq.items.map((item: any, i: number) => (
              <div key={i} className="border border-border rounded-xl overflow-hidden bg-background">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm hover:bg-muted/30 transition-colors"
                >
                  <span className="pr-4">{item.question}</span>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-muted-foreground leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════ BLOG / NEWS ═══════════ */}
      {content?.blog?.posts && content.blog.posts.length > 0 && (
        <section id="blog" className="px-4 sm:px-6 py-14 md:py-20 bg-muted/30">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-center" style={{ color: accentColor }}>Stay Updated</p>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-center mb-10">
            {content.blog.heading || "Latest News & Updates"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {content.blog.posts.map((post: any, i: number) => (
              <article key={i} className="bg-background rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="h-2" style={{ background: theme.heroGradient }} />
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <h3 className="font-display font-bold text-sm sm:text-base mb-2">{post.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
                  <button className="mt-3 text-xs font-semibold inline-flex items-center gap-1 bg-transparent border-none cursor-pointer p-0" style={{ color: accentColor }}>
                    Read More <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════ CONTACT ═══════════ */}
      {content?.contact && (
        <section id="contact" className="px-4 sm:px-6 py-14 md:py-20">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-center" style={{ color: accentColor }}>Get in Touch</p>
            <EditableText
              value={content.contact.heading || "Contact Us"}
              onChange={(v) => update("contact.heading", v)}
              as="h2"
              className="text-2xl sm:text-3xl font-display font-bold mb-4 text-center"
              editable={editable}
            />
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto text-sm text-center">
              Get in touch with {name}. We'd love to hear from you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
              {content.contact.phone && (
                <a href={`tel:${content.contact.phone}`} className="flex flex-col items-center gap-2 p-5 sm:p-6 rounded-xl border border-border bg-background hover:shadow-md transition-shadow text-center no-underline text-inherit">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor + "1a", color: accentColor }}>
                    <Phone className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-sm">Call Us</p>
                  <p className="text-xs text-muted-foreground">{content.contact.phone}</p>
                </a>
              )}
              {content.contact.email && (
                <a href={`mailto:${content.contact.email}`} className="flex flex-col items-center gap-2 p-5 sm:p-6 rounded-xl border border-border bg-background hover:shadow-md transition-shadow text-center no-underline text-inherit">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor + "1a", color: accentColor }}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-sm">Email Us</p>
                  <p className="text-xs text-muted-foreground break-all">{content.contact.email}</p>
                </a>
              )}
              {content.contact.address && (
                <a href={mapsUrl(content.contact.address)} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-5 sm:p-6 rounded-xl border border-border bg-background hover:shadow-md transition-shadow text-center no-underline text-inherit">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor + "1a", color: accentColor }}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-sm">Visit Us</p>
                  <p className="text-xs text-muted-foreground">{content.contact.address}</p>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="px-4 sm:px-6 py-10 md:py-14" style={{ background: "hsl(220, 20%, 8%)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            {/* Brand column */}
            <div>
              <p className="font-display font-bold text-lg mb-2" style={{ color: "rgba(255,255,255,0.9)" }}>{name}</p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                {content?.seo?.description || `${name} — delivering excellence and quality you can trust.`}
              </p>
            </div>

            {/* Quick links */}
            <div>
              <p className="font-semibold text-sm mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>Quick Links</p>
              <div className="flex flex-col gap-2">
                {navLinks.slice(0, 5).map((link) => (
                  <button
                    key={link}
                    onClick={() => scrollTo(link.toLowerCase())}
                    className="text-left text-xs hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer p-0"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact info + social */}
            <div>
              <p className="font-semibold text-sm mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>Contact</p>
              <div className="flex flex-col gap-2 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                {content?.contact?.phone && (
                  <a href={`tel:${content.contact.phone}`} className="hover:opacity-100 transition-opacity no-underline" style={{ color: "inherit" }}>{content.contact.phone}</a>
                )}
                {content?.contact?.email && (
                  <a href={`mailto:${content.contact.email}`} className="hover:opacity-100 transition-opacity no-underline break-all" style={{ color: "inherit" }}>{content.contact.email}</a>
                )}
                {content?.contact?.address && (
                  <span>{content.contact.address}</span>
                )}
              </div>
              {socialLinks && (socialLinks.facebook || socialLinks.instagram || socialLinks.twitter) && (
                <div className="flex items-center gap-3 mt-4">
                  {socialLinks.facebook && (
                    <a href={ensureUrl(socialLinks.facebook)} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.5)" }} className="hover:opacity-80 transition-opacity">
                      <Facebook className="h-4 w-4" />
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a href={ensureUrl(socialLinks.instagram)} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.5)" }} className="hover:opacity-80 transition-opacity">
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a href={ensureUrl(socialLinks.twitter)} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.5)" }} className="hover:opacity-80 transition-opacity">
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <p style={{ color: "rgba(255,255,255,0.3)" }} className="text-xs text-center">
              © {new Date().getFullYear()} {name}. All rights reserved. Built with DigiRise.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WebsiteRenderer;
