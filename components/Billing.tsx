import { apple, google } from "@/public/assets";
import styles, { layout } from "@/styles/style";
import Image from "next/image";
const Billing: React.FC = () => (
  <section id="product" className={layout.sectionReverse}>
    <div className={`${layout.sectionImgReverse} min-h-[480px]`}>
      {/* Floating Card 1: Unit Bisnis */}
      <div className="motion-float-card absolute top-[10%] right-[10%] z-[6] w-[260px] bg-white border border-gray-100 p-5 rounded-[20px] shadow-2xl hover:scale-[1.02] transition-transform duration-300">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-[10px] h-[10px] rounded-full bg-cyan-400 animate-pulse" />
          <h4 className="font-poppins font-bold text-[16px] text-primary-dark">Unit Bisnis Utama</h4>
        </div>
        <ul className="space-y-3">
          <li className="flex justify-between items-center text-[13px] text-dimWhite border-b border-gray-50 pb-2">
            <span>Software House</span>
            <span className="text-xs bg-cyan-50 text-[#00b4d8] px-2 py-0.5 rounded-full font-medium">Aktif</span>
          </li>
          <li className="flex justify-between items-center text-[13px] text-dimWhite border-b border-gray-50 pb-2">
            <span>AI & IoT Research Lab</span>
            <span className="text-xs bg-cyan-50 text-[#00b4d8] px-2 py-0.5 rounded-full font-medium">Aktif</span>
          </li>
          <li className="flex justify-between items-center text-[13px] text-dimWhite pb-1">
            <span>UI/UX & IT Consult</span>
            <span className="text-xs bg-cyan-50 text-[#00b4d8] px-2 py-0.5 rounded-full font-medium">Aktif</span>
          </li>
        </ul>
      </div>

      {/* Floating Card 2: Proyek Aktif */}
      <div className="motion-float-card motion-delay-2 absolute bottom-[10%] left-[10%] z-[5] w-[280px] bg-white border border-gray-100 p-5 rounded-[20px] shadow-xl hover:scale-[1.02] transition-transform duration-300">
        <h4 className="font-poppins font-bold text-[16px] text-primary-dark mb-3">Unit Proyek & Produk</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-xs text-primary-dark">Web Apps Koperasi</p>
              <p className="text-[10px] text-dimWhite">Mitra UMKM Surakarta</p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">Selesai</span>
          </div>
          <div className="flex items-center justify-between border-t border-gray-50 pt-2">
            <div>
              <p className="font-semibold text-xs text-primary-dark">Sistem IoT Monitoring</p>
              <p className="text-[10px] text-dimWhite">Universitas UMPKU</p>
            </div>
            <span className="text-xs bg-cyan-50 text-[#00b4d8] px-2 py-0.5 rounded-full font-semibold">Aktif</span>
          </div>
          <div className="flex items-center justify-between border-t border-gray-50 pt-2">
            <div>
              <p className="font-semibold text-xs text-primary-dark">UI/UX Aplikasi Mobile</p>
              <p className="text-[10px] text-dimWhite">Klinik PKU Surakarta</p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">Selesai</span>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      <div className="motion-float-card motion-delay-3 absolute bottom-[2%] right-[5%] z-[7] bg-emerald-50 border border-emerald-100 py-3 px-4 rounded-xl shadow-lg flex items-center gap-2 hover:scale-[1.02] transition-transform duration-300">
        <span className="text-emerald-500 font-bold">✓</span>
        <span className="text-xs text-emerald-800 font-medium">Semua Unit Bisnis Siap Melayani</span>
      </div>

      <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
      <div className="absolute z-[0] -left-1/2 bottom-0 w-[50%] h-[50%] rounded-full pink__gradient" />
    </div>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Layanan Web & <br className="sm:block hidden" /> Mobile Development.
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Kami merancang dan mengembangkan website profil perusahaan, e-commerce, hingga aplikasi mobile Android dan iOS yang cepat, responsif, serta aman. Akselerasi pertumbuhan bisnis Anda dengan platform digital yang tepat.
      </p>
      <div className="flex flex-row flex-wrap sm:mt-10 mt-6">
        <Image
          src={apple}
          alt="apple_store"
          className="motion-hover-soft w-[128px] h-[42px] object-contain mr-5 cursor-pointer"
        />
        <Image
          src={google}
          alt="google_play"
          className="motion-hover-soft w-[128px] h-[42px] object-contain cursor-pointer"
        />
      </div>
    </div>
  </section>
);

export default Billing;
