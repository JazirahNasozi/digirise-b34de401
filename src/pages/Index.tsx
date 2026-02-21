import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles, ArrowRight, Zap, Globe, Palette, Shield, Star, Layers,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Generation",
    desc: "Describe your business and watch AI create a stunning website in seconds.",
  },
  {
    icon: Palette,
    title: "Custom Branding",
    desc: "Choose colors, logo styles, and themes that match your brand identity.",
  },
  {
    icon: Globe,
    title: "Instant Publishing",
    desc: "Your website goes live automatically with a shareable public link.",
  },
  {
    icon: Shield,
    title: "Mobile Responsive",
    desc: "Every generated site looks perfect on desktop, tablet, and mobile.",
  },
  {
    icon: Star,
    title: "SEO Optimized",
    desc: "Built-in SEO best practices so customers can find you online.",
  },
  {
    icon: Layers,
    title: "Editable Content",
    desc: "Tweak any section after generation — you're always in control.",
  },
];

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
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 charcoal-gradient opacity-90" />
        <div className="relative container mx-auto px-4 py-24 md:py-36 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Website Builder</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 max-w-4xl mx-auto leading-tight">
              <span className="text-secondary-foreground">Build Your Business Website </span>
              <span className="gold-text">In Minutes</span>
            </h1>

            <p className="text-lg md:text-xl text-secondary-foreground/70 max-w-2xl mx-auto mb-8">
              DigiRise uses AI to generate beautiful, professional websites for small and medium businesses.
              No coding required. Just describe your business and go live.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="gold-gradient text-primary-foreground text-lg h-14 px-8 gold-glow font-semibold">
                  <Sparkles className="mr-2 h-5 w-5" /> Start Building Free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg h-14 px-8 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10 bg-transparent">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Everything You Need to <span className="gold-text">Go Digital</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From AI content generation to instant deployment — all in one platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background rounded-2xl p-6 border border-border hover:border-primary/40 transition-all group"
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Three Steps to Your <span className="gold-text">Dream Website</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Describe Your Business", desc: "Enter your business details, pick a style, and choose your colors." },
              { step: "02", title: "AI Generates Your Site", desc: "Our AI engine creates professional content, layout, and branding." },
              { step: "03", title: "Publish & Share", desc: "Go live instantly with a public link. Download or export anytime." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-5xl font-display font-bold gold-text mb-4">{item.step}</div>
                <h3 className="text-xl font-display font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 charcoal-gradient">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-foreground mb-4">
              Ready to <span className="gold-text">DigiRise</span>?
            </h2>
            <p className="text-secondary-foreground/70 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of SMEs building their online presence with AI.
            </p>
            <Link to="/register">
              <Button size="lg" className="gold-gradient text-primary-foreground text-lg h-14 px-10 gold-glow font-semibold">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-secondary-foreground">DigiRise</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DigiRise. AI-Powered Website Builder for SMEs.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
