import { clients } from "@/constants";
import styles from "@/styles/style";
import Image from "next/image";
const Clients: React.FC = () => (
  <section className={`${styles.flexCenter} my-4`}>
    <div className={`${styles.flexCenter} flex-wrap w-full`}>
      {clients.map((client) => (
        <div key={client.id} className={`flex-1 ${styles.flexCenter} sm:min-w-[192px] min-x-[120px]`}>
          <Image src={client.logo} alt="client" className="motion-hover-soft sm:w-[192px] w-[100%] object-contain brightness-0 opacity-60 hover:opacity-100 cursor-pointer" />
        </div>
      ))}
    </div>
  </section>
);
export default Clients;
