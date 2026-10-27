import styles from "@/styles/style";
import { features } from "@/constants";
import Image from "next/image";
import { FeatredCardProps } from "@/types";

const FeaturesCard: React.FC<FeatredCardProps & { isShifted: boolean }> = ({ icon, title, content, index, isShifted }) => {
  // Custom glossy high-end SVGs matching image 2
  const renderIcon = () => {
    if (index === 0) {
      // Star Icon
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_4px_10px_rgba(0,229,255,0.45)]">
          <defs>
            <linearGradient id="cyanGradStar" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#00b4d8" />
            </linearGradient>
          </defs>
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill="url(#cyanGradStar)"
          />
        </svg>
      );
    } else if (index === 1) {
      // Shield / Check Icon
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_4px_10px_rgba(0,229,255,0.45)]">
          <defs>
            <linearGradient id="cyanGradCircle" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="10" fill="url(#cyanGradCircle)" />
          <path
            d="M8.5 12.5l2.2 2.2 4.8-4.8"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    } else {
      // Paper Plane Icon
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_4px_10px_rgba(0,229,255,0.45)]">
          <defs>
            <linearGradient id="cyanGradPlane" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#00b4d8" />
            </linearGradient>
          </defs>
          <path
            d="M2 21l21-9L2 3v7l15 2-15 2z"
            fill="url(#cyanGradPlane)"
          />
        </svg>
      );
    }
  };

  return (
    <div
      className={`flex flex-row p-5 sm:p-6 rounded-[22px] bg-white border-2 border-[#00e5ff]/35 shadow-[0_12px_28px_rgba(0,180,216,0.04)] hover:shadow-[0_20px_40px_rgba(0,180,216,0.08)] hover:border-[#00b4d8]/75 transition-all duration-300 motion-card cursor-default ${
        isShifted ? "lg:-translate-x-10 translate-x-0" : "lg:translate-x-0"
      }`}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div
        className={`w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-full bg-[#e0f7fa]/50 ${styles.flexCenter} flex-shrink-0 border border-[#00b4d8]/15`}
      >
        {renderIcon()}
      </div>
      <div className="flex-1 flex flex-col ml-4">
        <h4 className="font-poppins font-bold text-primary-dark text-[16px] sm:text-[17px] leading-[24px]">
          {title}
        </h4>
        <p className="font-poppins font-normal text-slate-500 text-[13px] leading-[20px] mt-1">
          {content}
        </p>
      </div>
    </div>
  );
};

const Business: React.FC = () => (
  <section
    id="features"
    className="relative flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-20 py-16 sm:py-24 w-full overflow-hidden"
  >
    {/* Geometric tech grid lines in background matching image 2 */}
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-60 select-none">
      <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[600px] text-[#00b4d8]/10" fill="none" viewBox="0 0 800 600">
        {/* Draw tech grid lines */}
        <path d="M 100,50 L 700,50 L 750,150 L 500,250 L 600,450 L 100,450 Z" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
        <path d="M 200,100 L 600,200 L 700,400" stroke="currentColor" strokeWidth="1" />
        <path d="M 150,300 L 400,150 L 650,350" stroke="currentColor" strokeWidth="1.5" />
        
        {/* Connection node circles */}
        <circle cx="100" cy="50" r="4" fill="currentColor" />
        <circle cx="700" cy="50" r="4" fill="currentColor" />
        <circle cx="750" cy="150" r="4" fill="currentColor" />
        <circle cx="500" cy="250" r="4" fill="currentColor" />
        <circle cx="600" cy="450" r="4" fill="currentColor" />
        <circle cx="200" cy="100" r="3" fill="currentColor" />
        <circle cx="600" cy="200" r="3" fill="currentColor" />
        <circle cx="400" cy="150" r="3" fill="currentColor" />
      </svg>
    </div>

    {/* Left info column shifted slightly rightwards to reduce the middle gap and align closer to the right */}
    <div className="flex-1 flex flex-col items-start max-w-xl relative z-10 lg:translate-x-10 xl:translate-x-16 translate-x-0">
      <h2 className="font-poppins font-bold text-[32px] sm:text-[42px] leading-snug sm:leading-tight text-primary-dark tracking-tight">
        Fokus pada Bisnis <br /> Anda, Kami Tangani <br /> Teknologinya.
      </h2>
      <p className="font-poppins font-normal text-slate-500 text-[14.5px] sm:text-[16px] leading-[24px] sm:leading-[26px] mt-5 max-w-[480px]">
        Dengan solusi teknologi yang tepat, Anda dapat mempercepat digitalisasi bisnis, meningkatkan efisiensi operasional, dan menjangkau pelanggan lebih luas. HelioTechno hadir sebagai mitra teknologi tepercaya untuk pertumbuhan Anda.
      </p>
      
      {/* Pelajari Lebih Lanjut button matching mockup */}
      <a
        href="#product"
        className="mt-8 px-8 py-3.5 rounded-xl font-poppins font-bold text-[14px] text-white bg-[#00d4d8] hover:bg-[#00b4d8] hover:shadow-lg hover:shadow-[#00d4d8]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer select-none"
      >
        Pelajari Lebih Lanjut
      </a>
    </div>

    {/* Right features card column with offset shift zigzag layout */}
    <div className="flex-1 w-full flex flex-col gap-5.5 max-w-xl relative z-10">
      {features.map((feature, index) => {
        // Shift Card 2 (index 1) to the left to avoid page right-clipping
        const isShifted = index === 1;
        return (
          <FeaturesCard
            key={feature.id}
            {...feature}
            index={index}
            isShifted={isShifted}
          />
        );
      })}
    </div>
  </section>
);

export default Business;
