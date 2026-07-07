import styles from "@/styles/style";
import { stats } from "@/constants";

const Stats: React.FC = () => {
  return (
    <section className="flex flex-col sm:flex-row justify-center items-center flex-wrap gap-8 sm:gap-16 py-6 sm:py-8 w-full z-10 relative my-2 sm:my-4">
      {stats.map((stat, index) => {
        // Offset shift logic:
        // Item 1 (index 0) shifted further left
        // Item 2 (index 1) remains centered
        // Item 3 (index 2) shifted further right
        let shiftClass = "lg:translate-x-0";
        if (index === 0) {
          shiftClass = "lg:-translate-x-48 xl:-translate-x-28 translate-x-0";
        } else if (index === 2) {
          shiftClass = "lg:translate-x-48 xl:translate-x-28 translate-x-0";
        }

        return (
          <div
            key={stat.id}
            className={`motion-card flex flex-col justify-center items-center text-center min-w-[180px] my-3 sm:my-0 transition-all duration-300 ${shiftClass}`}
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <h4 className="font-poppins font-extrabold text-[38px] sm:text-[48px] leading-none text-primary-dark tracking-tight">
              {stat.value}
            </h4>
            <p className="font-poppins font-semibold text-[13px] sm:text-[14.5px] text-slate-500 uppercase tracking-widest leading-normal mt-4">
              {stat.title}
            </p>
          </div>
        );
      })}
    </section>
  );
};

export default Stats;
