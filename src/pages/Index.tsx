import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles, ArrowRight, Zap, Globe, Palette, Shield, Star,
  MessageSquare, Lightbulb, BarChart3, Layout, CheckCircle,
  Scissors, UtensilsCrossed, ShoppingBag, Store, GraduationCap, Briefcase,
} from "lucide-react";

const features = [
  { icon: Zap, title: "AI Website Generation", desc: "Enter your business details and get a professional website built automatically in seconds." },
  { icon: Layout, title: "Professional Templates", desc: "Pre-built templates for salons, restaurants, boutiques, schools, consultancies and more." },
  { icon: Palette, title: "Easy Editing", desc: "Click any text to edit it. Change colors, upload images, and rearrange sections effortlessly." },
  { icon: Star, title: "SEO Optimization", desc: "Built-in SEO best practices so customers can find your business online easily." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Track website visitors, popular pages, and get AI-powered suggestions to grow." },
];

const templates = [
  { icon: Scissors, title: "Salon", desc: "Beauty salons, barbershops, and spas" },
  { icon: UtensilsCrossed, title: "Restaurant", desc: "Restaurants, cafés, and food businesses" },
  { icon: ShoppingBag, title: "Boutique", desc: "Fashion boutiques and clothing stores" },
  { icon: Store, title: "Retail Shop", desc: "General retail and product stores" },
  { icon: Briefcase, title: "Consultancy", desc: "Professional consulting firms" },
  { icon: GraduationCap, title: "Private School", desc: "Schools, academies, and training centres" },
];

const steps = [
  { step: "01", title: "Enter Business Details", desc: "Provide your business name, type, services, and a short description." },
  { step: "02", title: "AI Generates Website", desc: "Our AI engine creates professional content, layouts, SEO titles, and descriptions instantly." },
  { step: "03", title: "Customize and Publish", desc: "Edit any section, upload photos, pick your colors, and publish with one click." },
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
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#templates" className="hover:text-foreground transition-colors">Templates</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
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
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/8 rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-28 md:py-40 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Website Builder for SMEs</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 max-w-5xl mx-auto leading-tight">
              <span className="text-secondary-foreground">Build Your Business Website </span>
              <span className="text-secondary-foreground">in Minutes </span>
              <span className="gold-text">with AI</span>
            </h1>

            <p className="text-lg md:text-xl text-secondary-foreground/70 max-w-2xl mx-auto mb-10">
              DigiRise helps small businesses create professional websites instantly without coding. Just enter your details and let AI do the rest.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg h-14 px-10 font-semibold">
                  <Sparkles className="mr-2 h-5 w-5" /> Start Building
                </Button>
              </Link>
              <Link to="/site/example">
                <Button size="lg" variant="outline" className="text-lg h-14 px-10 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10 bg-transparent">
                  See Example Website
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-secondary-foreground/40 text-sm">
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> Free to start</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> No coding needed</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> AI-powered</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> Mobile responsive</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How DigiRise Works */}
      <section id="how-it-works" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              How DigiRise <span className="gold-text">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Three simple steps to your professional business website.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {steps.map((item, i) => (
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

      {/* Templates */}
      <section id="templates" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Templates for <span className="gold-text">Every Business</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Professionally designed templates optimized for your industry.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {templates.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-card rounded-2xl p-6 border border-border hover:border-primary/40 transition-all group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <t.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-display font-bold mb-1">{t.title}</h3>
                <p className="text-muted-foreground text-sm">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Powerful <span className="gold-text">Features</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Everything you need to build, launch, and grow your online presence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-background rounded-2xl p-6 border border-border hover:border-primary/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-display font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 charcoal-gradient relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-primary/8 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-secondary-foreground mb-4">
              Start building your professional business website today.
            </h2>
            <p className="text-secondary-foreground/70 text-lg mb-10 max-w-xl mx-auto">
              Join SMEs building their digital presence with AI. Get started in minutes.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg h-14 px-12 font-semibold">
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
