import Hero from '@/components/layout/Hero'
import CategoryCards from '@/components/layout/CategoryCards'
import Stats from '@/components/layout/Stats'
import HowItWorks from '@/components/layout/HowItWorks'
import Features from '@/components/layout/Features'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <CategoryCards />
      <HowItWorks />
      <Features />
    </>
  )
}
