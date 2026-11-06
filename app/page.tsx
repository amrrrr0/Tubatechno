import styles from "@/styles/style";
import {
  Navbar, Hero, Business,
  Billing, CardDeal, Testimonials,
  Clients, CTA, Footer, News
} from "@/components";
import ScrollReveal from "@/components/ScrollReveal";

const Home = () => {
  return (
    <main id="home" className="motion-page bg-[#060913] text-slate-100 w-full overflow-hidden min-h-screen relative">
      {/* Global Cold Ambient Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-[#38bdf8]/8 via-[#0284c7]/3 to-transparent rounded-full blur-[180px] pointer-events-none" />

      {/* Global Fixed Navbar */}
      <Navbar />

      {/* Hero Section: Full-Bleed Edge-to-Edge 100vw Canvas */}
      <div className="w-full relative z-10 pt-[68px] sm:pt-[76px]">
        <Hero />
      </div>

      {/* Engineering Capabilities / Bento Grid */}
      <div className={`${styles.paddingX} ${styles.flexCenter} relative z-10 w-full`}>
        <div className={`${styles.boxWidth}`}>
          <ScrollReveal>
            <Business />
          </ScrollReveal>
        </div>
      </div>

      {/* Standards & Workflow */}
      <div className={`${styles.paddingX} ${styles.flexCenter} relative z-10 w-full`}>
        <div className={`${styles.boxWidth}`}>
          <ScrollReveal><Billing /></ScrollReveal>
          <ScrollReveal><CardDeal /></ScrollReveal>
          <ScrollReveal><News isDashboard={true} /></ScrollReveal>
          <ScrollReveal><Testimonials /></ScrollReveal>
          <ScrollReveal><Clients /></ScrollReveal>
          <ScrollReveal><CTA /></ScrollReveal>
          <ScrollReveal><Footer /></ScrollReveal>
        </div>
      </div>
    </main>
  );
};

export default Home;
