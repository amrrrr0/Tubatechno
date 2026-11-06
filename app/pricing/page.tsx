import styles from "@/styles/style";
import { Navbar, Pricing, Footer } from "@/components";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "Tubatechno — Harga Layanan",
  description: "Daftar harga dan paket layanan pembuatan website kustom, penyewaan web siap pakai, aplikasi mobile, dan IT maintenance Tubatechno.",
};

const PricingPage = () => {
  return (
    <main id="pricing-page" className="motion-page bg-[#060913] text-slate-100 w-full min-h-screen flex flex-col relative overflow-hidden font-jakarta">
      {/* Global Ambient Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-[#38bdf8]/10 via-[#0284c7]/4 to-transparent rounded-full blur-[180px] pointer-events-none" />

      {/* Global Fixed Navbar */}
      <Navbar />

      {/* Main Pricing Content */}
      <div className="w-full flex flex-col relative z-10 pt-[88px] sm:pt-[100px]">
        <ScrollReveal>
          <Pricing />
        </ScrollReveal>
      </div>

      {/* Footer */}
      <div className={`${styles.paddingX} ${styles.flexStart} mt-auto relative z-10 border-t border-slate-800/80`}>
        <div className={`${styles.boxWidth}`}>
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default PricingPage;
