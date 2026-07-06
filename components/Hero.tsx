import styles from "@/styles/style";
import { discount } from "@/public/assets";
import Image from "next/image";

const Hero: React.FC = () => (
  <section id="home" className={`hero-section flex md:flex-row flex-col ${styles.paddingY}`}>
    <div
      className={`hero-copy flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}
    >
      <div className="motion-chip flex flex-row items-center py-[6px] px-4 bg-discount-gradient rounded-[10px] mb-2">
        <Image src={discount} alt="discount" className="w-[32px] h-[32px]" />
        <p className={`${styles.paragraph} ml-2`}>
          <span className="text-primary-dark font-semibold">Inovasi Riset</span> Kampus Universitas{" "}
          <span className="text-primary-dark font-semibold">Muhammadiyah PKU Surakarta</span>
        </p>
      </div>
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-primary-dark ss:leading-[80px] leading-[60px]">
          Solusi <br className="sm:block hidden" />{" "}
          <span className="text-gradient">Teknologi</span>{" "}
        </h1>
      </div>
      <h1 className="w-full font-poppins font-semibold ss:text-[68px] text-[52px] text-primary-dark ss:leading-[80px] leading-[60px] mt-2">
        Terbaik & Inovatif.
      </h1>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        HelioNexus adalah Software House tepercaya yang menghadirkan layanan Web Development, Mobile Apps, UI/UX Design, Artificial Intelligence, dan IoT untuk mendigitalisasi bisnis Anda.
      </p>
    </div>
    <div className={`${styles.flexCenter} hero-visual flex-1 flex md:my-0 my-10 relative min-h-[520px]`}>
      <div className="website-3d-stage" aria-label="Preview website HelioNexus dalam tampilan tiga dimensi">
        <div className="website-3d-scene">
          <div className="website-panel website-panel-main">
            <div className="website-browser-bar">
              <span />
              <span />
              <span />
              <div className="website-url">helionexus.id</div>
            </div>
            <div className="website-screen">
              <div className="website-sidebar">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="website-content">
                <div className="website-hero-row">
                  <div>
                    <span className="website-kicker">Software House</span>
                    <h3>Digital Product Studio</h3>
                    <p>Web, mobile, AI, dan IoT untuk bisnis yang bertumbuh.</p>
                  </div>
                  <div className="website-metric">
                    <strong>99%</strong>
                    <span>Client happy</span>
                  </div>
                </div>
                <div className="website-grid">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>

          <div className="website-panel website-panel-back">
            <div className="website-mini-head" />
            <div className="website-mini-lines">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="website-panel website-panel-side">
            <span>AI</span>
            <span>Web</span>
            <span>IoT</span>
          </div>

          <div className="website-glass website-glass-one" />
          <div className="website-glass website-glass-two" />
        </div>
      </div>
      <div className="motion-orbit absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
      <div className="motion-orbit motion-delay-2 absolute z-[1] w-[80%] h-[80%] rounded-full bottom-40 white__gradient" />
      <div className="motion-orbit motion-delay-3 absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
    </div>
  </section>
);

export default Hero;
