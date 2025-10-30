import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import StatsSection from '../components/StatsSection'
import Footer from '../components/Footer'

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow">
        <HeroSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage