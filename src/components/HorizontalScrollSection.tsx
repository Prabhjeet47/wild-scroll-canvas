import { useEffect, useRef } from "react";
import { Leaf, Shield, Globe, Heart, Camera, TreePine } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const features = [
  {
    icon: Leaf,
    title: "Conservation",
    description: "Protecting endangered species and their natural habitats through direct action and community engagement.",
  },
  {
    icon: Shield,
    title: "Protection",
    description: "Enforcing anti-poaching measures and establishing safe corridors for wildlife migration.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Operating across 40+ countries to ensure wildlife conservation knows no borders.",
  },
  {
    icon: Heart,
    title: "Community",
    description: "Building local partnerships that empower communities to become guardians of their natural heritage.",
  },
  {
    icon: Camera,
    title: "Research",
    description: "Using cutting-edge technology and field research to monitor and study wildlife populations.",
  },
  {
    icon: TreePine,
    title: "Reforestation",
    description: "Restoring degraded ecosystems by planting millions of native trees each year.",
  },
];

const HorizontalScrollSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const scrollContainer = scrollContainerRef.current;
    if (!section || !scrollContainer) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      // When section is in view, translate vertical scroll to horizontal
      if (sectionTop <= 0 && sectionTop > -(sectionHeight - viewportHeight)) {
        const scrollProgress = -sectionTop / (sectionHeight - viewportHeight);
        const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        scrollContainer.scrollLeft = scrollProgress * maxScrollLeft;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Make the section tall enough to allow scroll-jacking
  // 6 cards, so ~300vh should be plenty
  return (
    <div ref={sectionRef} style={{ height: "300vh" }} className="relative">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="px-8 md:px-16 mb-8">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
              What We <span className="text-primary">Do</span>
            </h2>
            <p className="mt-3 text-muted-foreground text-lg max-w-xl font-body">
              Our mission spans continents and ecosystems — here's how we make a difference.
            </p>
          </ScrollReveal>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 px-8 md:px-16 overflow-x-hidden hide-scrollbar"
        >
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="flex-shrink-0 w-[320px] md:w-[380px] rounded-xl bg-card/80 backdrop-blur-sm border border-border p-8 flex flex-col gap-4 group hover:border-primary/40 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground font-body leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollSection;
