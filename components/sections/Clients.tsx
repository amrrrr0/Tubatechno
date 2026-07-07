import { clients } from "@/constants";

const Clients: React.FC = () => (
  <section className="flex justify-center items-center my-4">
    <div className="flex flex-wrap justify-center gap-x-8 gap-y-5 w-full py-2 px-4">
      {clients.map((client) => (
        <div
          key={client.id}
          className="flex flex-col items-center justify-center gap-2 px-4 py-2 min-w-[90px] sm:min-w-[120px] flex-shrink-0 group cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={client.logo}
            alt={client.name}
            className="h-[32px] sm:h-[42px] w-auto object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-300"
          />
          <span className="font-poppins font-medium text-[11px] sm:text-[13px] text-dimWhite group-hover:text-primary-dark transition-colors duration-300 whitespace-nowrap">
            {client.name}
          </span>
        </div>
      ))}
    </div>
  </section>
);

export default Clients;
