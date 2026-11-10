import styles from "@/styles/style";
import { Navbar, Pricing, Footer } from "@/components";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "Tubatechno",
  description: "Daftar harga dan paket layanan pembuatan website kustom, penyewaan web siap pakai, aplikasi mobile, dan IT maintenance Tubatechno.",
};

const PricingPage = () => {
  return (
    <main id="pricing-page" className="motion-page bg-[#f8fafc] text-slate-900 w-full min-h-screen flex flex-col relative overflow-hidden font-jakarta">
      {/* Global Ambient Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-[#00b4d8]/8 via-[#0077b6]/3 to-transparent rounded-full blur-[180px] pointer-events-none" />

      {/* Global Fixed Navbar */}
      <Navbar />

      {/* Main Pricing Content */}
      <div className="w-full flex flex-col relative z-10 pt-[88px] sm:pt-[100px]">
        <ScrollReveal>
          <Pricing />
        </ScrollReveal>
      </div>

      {/* Full-Bleed Edge-to-Edge Footer */}
      <div className="w-full mt-auto relative z-10">
        <Footer />
      </div>
    </main>
  );
};

export default PricingPage;
