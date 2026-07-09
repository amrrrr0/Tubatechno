import styles from "@/styles/style";
import { Navbar, Pricing, Footer, CTA } from "@/components";

export const metadata = {
  title: "HelioNexus",
  description: "Daftar harga dan paket layanan pembuatan website dan aplikasi HelioNexus. Solusi digital terbaik untuk bisnis Anda.",
};

const PricingPage = () => {
  return (
    <>
      <main id="pricing-page" className="motion-page bg-gradient-to-b from-[#f0f9fc] to-white w-full min-h-screen flex flex-col relative">
        {/* Navigation Bar */}
        <div className={`${styles.paddingX} ${styles.flexCenter} relative z-50 pt-4`}>
          <div className={`${styles.boxWidth}`}>
            <Navbar />
          </div>
        </div>

        {/* Main Content - Pricing Component */}
        <div className="w-full flex flex-col relative z-10">
          <Pricing />
        </div>

        {/* Footer */}
        <div className={`bg-primary ${styles.paddingX} ${styles.flexStart} mt-auto`}>
          <div className={`${styles.boxWidth}`}>
            <Footer />
          </div>
        </div>
      </main>
    </>
  );
};

export default PricingPage;
