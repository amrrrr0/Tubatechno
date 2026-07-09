import { clients } from "@/constants";

const Clients: React.FC = () => {
  // Duplicate array to ensure seamless infinite scrolling
  const marqueeClients = [...clients, ...clients, ...clients, ...clients];

  return (
    <section className="flex justify-center items-center my-8 overflow-hidden relative" style={{
      maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)"
    }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes clients-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 4)); }
        }
        `
      }} />
      <div 
        className="flex w-max items-center"
        style={{
          animation: "clients-scroll 40s linear infinite"
        }}
      >
        {marqueeClients.map((client, index) => (
          <div
            key={`${client.id}-${index}`}
            className="flex flex-col items-center justify-center gap-2 px-6 sm:px-10 py-2 min-w-[100px] sm:min-w-[140px] flex-shrink-0 group cursor-pointer"
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
};

export default Clients;
