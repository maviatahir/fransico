import { useCallback, useState } from 'react'
import { MotionConfig } from 'framer-motion'

import Header from './components/Header'
import Hero from './components/Hero'
import MenuSection from './components/MenuSection'
import DealsSection from './components/DealsSection'
import PizzaCorner from './components/PizzaCorner'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import CartProvider from './components/CartProvider'
import CartDrawer from './components/CartDrawer'
import FloatingBar from './components/FloatingBar'

export default function App() {
  const [query, setQuery] = useState('')

  const handleQueryChange = useCallback((value) => {
    setQuery(value)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <div className="relative min-h-dvh overflow-x-clip bg-bg">
          <a
            href="#menu"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:cursor-pointer focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-ink-on-accent"
          >
            Skip to menu
          </a>

          <Header query={query} onQueryChange={handleQueryChange} />

          <main>
            <Hero onQueryChange={handleQueryChange} />
            <MenuSection query={query} onQueryChange={handleQueryChange} />
            <DealsSection />
            <PizzaCorner />
            <ContactSection />
          </main>

          <Footer />

          <FloatingBar />
          <CartDrawer />
        </div>
      </CartProvider>
    </MotionConfig>
  )
}