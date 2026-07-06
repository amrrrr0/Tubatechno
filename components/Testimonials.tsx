import { feedback } from "@/constants";
import { FeedBackProps } from "@/types";
import { quotes } from "@/public/assets";
import Image from "next/image";

const FeedbackCard: React.FC<FeedBackProps> = ({ content, title, name, img }) => (
  <div className="motion-card flex justify-between flex-col px-6 sm:px-10 py-8 sm:py-12 rounded-[20px] w-full sm:max-w-[370px] sm:mr-5 mr-0 mb-6 sm:mb-0 feedback-card cursor-pointer border border-gray-100/60">
    <Image
      src={quotes}
      alt="double_quotes"
      className="object-contain"
      width={36}
      height={24}
    />
    <p className="font-poppins font-normal text-[16px] sm:text-[18px] leading-[28px] sm:leading-[32px] text-primary-dark my-6 sm:my-10">
      {content}
    </p>
    <div className="flex flex-row">
      <Image
        src={img}
        alt={name}
        className="rounded-full object-contain object-center flex-shrink-0"
        width={44}
        height={44}
        style={{ width: "44px", height: "44px" }}
      />
      <div className="flex flex-col ml-4">
        <h4 className="font-poppins font-semibold text-[17px] sm:text-[20px] leading-[28px] sm:leading-[32px] text-primary-dark">
          {name}
        </h4>
        <p className="font-poppins font-normal text-[14px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-dimWhite">
          {title}
        </p>
      </div>
    </div>
  </div>
);

const Testimonials: React.FC = () => (
  <section
    id="clients"
    className={`sm:py-16 py-8 flex flex-col relative`}
  >
    <div className="absolute z-[0] w-[60%] h-[60%] -right-[50%] rounded-full blue__gradient" />
    <div className="w-full flex justify-between items-center md:flex-row flex-col sm:mb-10 mb-6 relative z-[1]">
      <h1 className="font-poppins font-semibold xs:text-[48px] text-[32px] text-primary-dark xs:leading-[76.8px] leading-[46px] w-full">
        Apa Kata Mitra <br className="sm:block hidden" /> Tentang HelioNexus.
      </h1>
      <div className="w-full md:mt-0 mt-4">
        <p className="font-poppins font-normal text-dimWhite text-[15px] sm:text-[18px] leading-[26px] sm:leading-[30.8px] text-left max-w-[450px]">
          Testimoni nyata dari pelaku UMKM dan instansi yang telah mendigitalisasi operasional mereka bersama solusi teknologi kami.
        </p>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-start justify-center w-full feedback-container relative z-[1] gap-4 sm:gap-0">
      {feedback.map((card) => (
        <FeedbackCard key={card.id} {...card} />
      ))}
    </div>
  </section>
);

export default Testimonials;
