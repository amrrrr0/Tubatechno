import styles from "@/styles/style";
import { Navbar, Hero, Stats, Business, Billing, CardDeal, Testimonials, Clients, CTA, Footer, News } from "@/components"

const Home = () => {
  return (
    <>
      <main id="home" className="motion-page bg-primary w-full overflow-hidden">
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className={`${styles.boxWidth}`}>
            <Navbar />
          </div>
        </div>
        <div className={`bg-primary ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <Hero />
          </div>
        </div>
        <div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <Stats />
          </div>
        </div>

        {/* Business section is rendered full-width with a smooth vertical gradient */}
        <div className="w-full bg-gradient-to-b from-white via-[#f4feff] to-white">
          <div className={`${styles.paddingX} ${styles.flexCenter}`}>
            <div className={`${styles.boxWidth}`}>
              <Business />
            </div>
          </div>
        </div>

        <div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <Billing />
            <CardDeal />
            <News isDashboard={true} />
            <Testimonials />
            <Clients />
            <CTA />
            <Footer />
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
