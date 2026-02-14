import { useNavigate } from "react-router-dom";
import { Leaf, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import HorizontalScrollSection from "@/components/HorizontalScrollSection";
import wildlifeHero from "@/assets/wildlife-hero.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Fixed background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${wildlifeHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="animate-fade-up flex items-center gap-3 mb-8">
            <Leaf className="w-10 h-10 text-primary" />
            <span className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight">
              WildGuard
            </span>
          </div>

          <h1 className="animate-fade-up-delay-1 text-4xl md:text-6xl lg:text-7xl font-display font-900 text-foreground max-w-4xl leading-tight">
            Guardians of the <span className="text-primary italic">Wild</span>
          </h1>

          <blockquote className="animate-fade-up-delay-2 mt-8 max-w-2xl text-lg md:text-xl text-muted-foreground font-body italic border-l-4 border-primary/50 pl-6 text-left">
            "The greatness of a nation and its moral progress can be judged by the way its animals are treated."
            <cite className="block mt-2 text-sm text-primary not-italic font-semibold">— Mahatma Gandhi</cite>
          </blockquote>

          <div className="animate-fade-up-delay-3 mt-12">
            <ArrowDown className="w-6 h-6 text-muted-foreground animate-bounce" />
          </div>
        </section>

        {/* About Section */}
        <section className="min-h-screen flex items-center justify-center px-6 py-24">
          <div className="max-w-3xl text-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
                Who We <span className="text-accent">Are</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <p className="text-lg text-muted-foreground font-body leading-relaxed mb-6">
                WildGuard is a global wildlife conservation initiative dedicated to preserving 
                Earth's most vulnerable species and ecosystems. From the dense rainforests of 
                the Amazon to the vast savannas of Africa, we work tirelessly to ensure that 
                future generations inherit a planet teeming with life.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <p className="text-lg text-muted-foreground font-body leading-relaxed">
                Founded in 2010, we've grown from a small team of passionate naturalists 
                into a worldwide network of conservationists, researchers, and volunteers — 
                united by a single belief: every creature deserves a fighting chance.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Horizontal Scroll Features */}
        <HorizontalScrollSection />

        {/* CTA Section */}
        <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Ready to Make a <span className="text-primary">Difference</span>?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="text-muted-foreground font-body text-lg max-w-xl mb-10">
              Join thousands of wildlife champions working to protect our planet's biodiversity.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <Button
              size="lg"
              onClick={() => navigate("/home")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-lg px-10 py-6 rounded-full shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
            >
              Get Started
            </Button>
          </ScrollReveal>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center border-t border-white/10 bg-card/20 backdrop-blur-lg">
          <p className="text-muted-foreground text-sm font-body">
            © 2026 WildGuard. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
