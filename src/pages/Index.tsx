import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles, ArrowRight, Zap, Globe, Palette, Shield, Star, Layers,
  MessageSquare, Lightbulb, BarChart3, Layout, Users, CheckCircle,
} from "lucide-react";

const features = [
  { icon: Zap, title: "AI Website Generator", desc: "Enter your business details and get a professional website built automatically by AI in seconds." },
  { icon: MessageSquare, title: "AI Business Assistant", desc: "Generate business descriptions, promotional messages, social media posts, and more with AI." },
  { icon: Lightbulb, title: "Name & Slogan Generator", desc: "Get creative business name ideas and catchy slogans tailored to your industry and location." },
  { icon: Palette, title: "Custom Branding", desc: "Choose from professional color themes and customize every section to match your brand identity." },
  { icon: Globe, title: "Instant Publishing", desc: "Your website goes live automatically with a shareable public link — no hosting setup needed." },
  { icon: BarChart3, title: "Smart Analytics", desc: "Track website visitors, popular pages, and get AI-powered suggestions to grow your business." },
  { icon: Layout, title: "Industry Templates", desc: "Pre-built templates for salons, restaurants, boutiques, schools, consultancies and more." },
  { icon: Shield, title: "Mobile Responsive", desc: "Every generated site looks perfect on desktop, tablet, and mobile — guaranteed." },
  { icon: Star, title: "SEO Optimized", desc: "Built-in SEO best practices so customers can find your business online easily." },
];

const testimonials = [
  { name: "Sandra K.", role: "Salon Owner, Kampala", text: "DigiRise helped me create a beautiful website for my salon in just 10 minutes. My bookings increased by 40%!" },
  { name: "Michael O.", role: "Restaurant Owner", text: "I was amazed at how professional my restaurant website looked. The AI understood exactly what I needed." },
  { name: "Grace N.", role: "Boutique Owner", text: "The AI assistant helped me write all my product descriptions and promotional messages. Absolutely incredible!" },
];

const industries = [
  "Salons & Spas", "Restaurants & Cafés", "Boutiques & Retail",
  "Private Schools", "Consultancy Firms", "Gyms & Fitness",
  "Clinics & Healthcare", "Photography Studios", "Real Estate",
];

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-display font-bold">DigiRise</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#industries" className="hover:text-foreground transition-colors">Industries</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="gold-gradient text-primary-foreground gold-glow">
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 charcoal-gradient" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-28 md:py-40 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered SME Digital Platform</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 max-w-5xl mx-auto leading-tight">
              <span className="text-secondary-foreground">Empower Your Business </span>
              <span className="gold-text">With AI</span>
            </h1>

            <p className="text-lg md:text-xl text-secondary-foreground/70 max-w-2xl mx-auto mb-10">
              DigiRise helps small and medium businesses build professional websites, generate content, 
              and grow online — all powered by artificial intelligence. No coding required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="gold-gradient text-primary-foreground text-lg h-14 px-10 gold-glow font-semibold">
                  <Sparkles className="mr-2 h-5 w-5" /> Start Building Free
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="text-lg h-14 px-10 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10 bg-transparent">
                  Explore Features
                </Button>
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-secondary-foreground/40 text-sm">
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> Free to start</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> No coding needed</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> AI-powered</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> Mobile responsive</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Built for <span className="gold-text">Every Industry</span>
            </h2>
            <p className="text-muted-foreground">Specialized templates and AI for your business type</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {industries.map((ind, i) => (
              <motion.span
                key={ind}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-5 py-2.5 rounded-full border border-border bg-background text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all cursor-default"
              >
                {ind}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Everything You Need to <span className="gold-text">Go Digital</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A complete AI-powered toolkit to build, launch, and grow your online presence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-card rounded-2xl p-6 border border-border hover:border-primary/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-4 group-hover:gold-glow transition-all">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-display font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Three Steps to Your <span className="gold-text">Dream Website</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Describe Your Business", desc: "Enter your business name, type, services, and a short description. Pick your colors and branding." },
              { step: "02", title: "AI Builds Your Website", desc: "Our AI engine generates professional content, layouts, SEO titles, and service descriptions instantly." },
              { step: "03", title: "Customize & Publish", desc: "Edit any section inline, upload your photos, and publish with one click. Share your link immediately." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-6xl font-display font-bold gold-text mb-4">{item.step}</div>
                <h3 className="text-xl font-display font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Trusted by <span className="gold-text">SME Owners</span>
            </h2>
            <p className="text-muted-foreground text-lg">See what business owners say about DigiRise</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="text-3xl gold-text mb-3">"</div>
                <p className="text-muted-foreground text-sm italic mb-4">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 charcoal-gradient relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-secondary-foreground mb-4">
              Ready to <span className="gold-text">DigiRise</span> Your Business?
            </h2>
            <p className="text-secondary-foreground/70 text-lg mb-10 max-w-xl mx-auto">
              Join SMEs across Africa building their digital presence with AI. Get started in minutes.
            </p>
            <Link to="/register">
              <Button size="lg" className="gold-gradient text-primary-foreground text-lg h-14 px-12 gold-glow font-semibold">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-10 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-display font-bold text-secondary-foreground">DigiRise</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} DigiRise · AI-Powered Digital Platform for SMEs · 24-ICTPROPOSAL-GRP 66
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link to="/login" className="hover:text-secondary-foreground transition-colors">Sign In</Link>
              <Link to="/register" className="hover:text-secondary-foreground transition-colors">Get Started</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
