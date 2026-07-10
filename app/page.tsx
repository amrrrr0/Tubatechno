import styles from "@/styles/style";
import {
  Navbar, Hero, Stats, Business,
  Billing, CardDeal, Testimonials,
  Clients, CTA, Footer, News
} from "@/components";
import ScrollReveal from "@/components/ScrollReveal";

const Home = () => {
  return (
    <main id="home" className="motion-page bg-primary w-full overflow-hidden">

      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>

      <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Hero />
        </div>
      </div>

      <div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <ScrollReveal>
            <Stats />
          </ScrollReveal>
        </div>
      </div>

      <div className="w-full bg-gradient-to-b from-white via-[#f4feff] to-white">
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className={`${styles.boxWidth}`}>
            <ScrollReveal>
              <Business />
            </ScrollReveal>
          </div>
        </div>
      </div>

      <div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
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
