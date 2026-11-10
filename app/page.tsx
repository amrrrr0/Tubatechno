import styles from "@/styles/style";
import {
  Navbar, Hero, Business,
  Billing, CardDeal, Testimonials,
  Clients, CTA, Footer, News
} from "@/components";
import ScrollReveal from "@/components/ScrollReveal";

const Home = () => {
  return (
    <main id="home" className="motion-page bg-[#f8fafc] text-slate-900 w-full overflow-hidden min-h-screen relative font-jakarta">
      {/* Soft Ambient Logo White-Blue Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-[#00b4d8]/8 via-[#0077b6]/4 to-transparent rounded-full blur-[180px] pointer-events-none" />

      {/* Global Fixed Navbar */}
      <Navbar />

      {/* Hero Section: Full-Bleed Edge-to-Edge 100vw Canvas */}
      <div className="w-full relative z-10 pt-[68px] sm:pt-[76px]">
        <Hero />
      </div>

      {/* Engineering Capabilities / Bento Grid */}
      <div className={`${styles.paddingX} ${styles.flexCenter} relative z-10 w-full`}>
        <div className={`${styles.boxWidth}`}>
          <ScrollReveal variant="fade-up" duration={750}>
            <Business />
          </ScrollReveal>
        </div>
      </div>

      {/* Standards & Workflow */}
      <div className={`${styles.paddingX} ${styles.flexCenter} relative z-10 w-full`}>
        <div className={`${styles.boxWidth}`}>
          <ScrollReveal variant="fade-up" duration={750}>
            <Billing />
          </ScrollReveal>
          <ScrollReveal variant="zoom-in" duration={750}>
            <CardDeal />
          </ScrollReveal>
          <ScrollReveal variant="fade-up" duration={750}>
            <News isDashboard={true} />
          </ScrollReveal>
          <ScrollReveal variant="fade-up" duration={750}>
            <Testimonials />
          </ScrollReveal>
          <ScrollReveal variant="zoom-in" duration={750}>
            <Clients />
          </ScrollReveal>
          <ScrollReveal variant="fade-up" duration={750}>
            <CTA />
          </ScrollReveal>
        </div>
      </div>

      {/* Full-Bleed Edge-to-Edge Footer */}
      <Footer />
    </main>
  );
};

export default Home;
