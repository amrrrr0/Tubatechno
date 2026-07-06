import styles, { layout } from "@/styles/style";
import { features } from "@/constants";
import Button from "./Button";
import Image from "next/image";
import { FeatredCardProps } from "@/types";

const FeaturesCard: React.FC<FeatredCardProps> = ({ icon, title, content, index }) => (
  <div
    className={`flex flex-row p-6 rounded-[20px] ${index !== features.length - 1 ? "mb-6" : "mb-0"
      } feature-card motion-card`}
    style={{ animationDelay: `${index * 120}ms` }}
  >
    <div
      className={`w-[64px] h-[64px] rounded-full bg-dimBlue ${styles.flexCenter}`}
    >
      <Image
        src={icon}
        alt="icon"
        className="h-8 w-auto object-contain"
      />
    </div>
    <div className="flex-1 flex flex-col ml-3">
      <h4 className="font-poppins font-semibold text-primary-dark text-[18px] leading-[24px]">
        {title}
      </h4>
      <p className="font-poppins font-normal text-dimWhite text-[16px] leading-[24px]">
        {content}
      </p>
    </div>
  </div>
);
const Business: React.FC = () => (
  <section id="features" className={`${layout.section}`}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Fokus pada Bisnis Anda, <br className="sm:block hidden" />
        Kami Tangani Teknologinya.
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Dengan solusi teknologi yang tepat, Anda dapat mempercepat digitalisasi bisnis, meningkatkan efisiensi operasional, dan menjangkau pelanggan lebih luas. HelioNexus hadir sebagai mitra teknologi tepercaya untuk pertumbuhan Anda.
      </p>
      <Button styles="mt-10" />
    </div>
    <div className={`${layout.sectionImg} flex-col`}>
      {features.map((feature, index) => (
        <FeaturesCard key={feature.id} {...feature} index={index} />
      ))}
    </div>
  </section>
);

export default Business;
