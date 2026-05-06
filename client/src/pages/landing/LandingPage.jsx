import React from 'react'
import HeroSection         from '../../components/landing/HeroSection'
import MarqueeTicker       from '../../components/landing/MarqueeTicker'
import StatsSection        from '../../components/landing/StatsSection'
import FeaturesSection     from '../../components/landing/FeaturesSection'
import HowItWorksSection   from '../../components/landing/HowItWorksSection'
import TestimonialsSection from '../../components/landing/TestimonialsSection'
import PricingSection      from '../../components/landing/PricingSection'
import CTASection          from '../../components/landing/CTASection'

/* Navbar and Footer are rendered by RootLayout — do NOT include them here */
const LandingPage = () => (
  <main>
    <HeroSection />
    <MarqueeTicker />
    <StatsSection />
    <FeaturesSection />
    <HowItWorksSection />
    <TestimonialsSection />
    <PricingSection />
    <CTASection />
  </main>
)

export default LandingPage