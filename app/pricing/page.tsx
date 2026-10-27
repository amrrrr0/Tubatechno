import styles from "@/styles/style";
import { Navbar, Pricing, Footer } from "@/components";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "Harga Layanan | HelioTechno",
  description: "Daftar harga dan paket layanan pembuatan website dan aplikasi HelioTechno. Solusi digital terbaik untuk bisnis Anda.",
};

const PricingPage = () => {
  return (
    <main id="pricing-page" className="motion-page bg-gradient-to-b from-[#f0f9fc] to-white w-full min-h-screen flex flex-col relative">

      <div className={`${styles.paddingX} ${styles.flexCenter} relative z-50 pt-4`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>

      <ScrollReveal>
        <div className="w-full flex flex-col relative z-10">
          <Pricing />
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className={`bg-primary ${styles.paddingX} ${styles.flexStart} mt-auto`}>
          <div className={`${styles.boxWidth}`}>
            <Footer />
          </div>
        </div>
      </ScrollReveal>

    </main>
  );
};

export default PricingPage;
