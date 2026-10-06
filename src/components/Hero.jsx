import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  ChefHat,
  Clock3,
  Sparkles,
  Star,
  Tag,
  Truck,
} from 'lucide-react'

import Button from './ui/Button'
import TiltCard from './TiltCard'
import {
  CHEAPEST_COMBO,
  COMBO_DEALS,
  HERO_HIGHLIGHTS,
  PIZZA_DEALS,
  PIZZA_FLAVOURS,
  STATS,
  formatPrice,
} from '../data/menu'
import { scrollToSection } from '../lib/utils'

const HUE_MAP = {
  gold: {
    ring: 'from-gold/70 via-amber-300/25',
    text: 'text-gold-ink',
    chip: 'border-gold/30 bg-gold/12 text-gold-ink',
  },
  crimson: {
    ring: 'from-crimson/70 via-rose-400/25',
    text: 'text-crimson',
    chip: 'border-crimson/30 bg-crimson/12 text-crimson',
  },
  amber: {
    ring: 'from-amber-400/70 via-gold/25',
    text: 'text-amber-500',
    chip: 'border-amber-400/30 bg-amber-400/12 text-amber-500',
  },
}

function HighlightCard({ item, index, onSelect }) {
  const tone = HUE_MAP[item.hue] ?? HUE_MAP.gold

  return (
    <TiltCard
      intensity={8}
      lift={26}
      float
      floatDelay={index * 420}
      className="h-full w-full"
      innerClassName="h-full rounded-[1.6rem]"
    >
      <button
        type="button"
        onClick={() => onSelect(item.name)}
        aria-label={`View ${item.name} in the menu`}
        className="group relative flex h-full w-full cursor-pointer flex-row items-center gap-3 overflow-hidden rounded-[1.4rem] border border-line bg-surface/85 p-3.5 text-left shadow-elev-2 backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:border-gold/50 hover:shadow-elev-3 sm:flex-col sm:items-stretch sm:gap-0 sm:rounded-[1.6rem] sm:p-5"
      >
        <div
          className={`pointer-events-none absolute -inset-6 bg-linear-to-br ${tone.ring} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
        />
        <div className="relative flex w-14 shrink-0 flex-col items-center gap-2 sm:w-full sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <span
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-bg-deep/60 text-[1.45rem] shadow-inner transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 sm:h-14 sm:w-14 sm:rounded-2xl sm:text-[1.7rem]"
            aria-hidden="true"
          >
            {item.emoji}
          </span>
          <span
            className={`max-w-full shrink rounded-full border px-1.5 py-1 text-center text-[0.5rem] leading-tight font-bold uppercase tracking-[0.04em] sm:px-2.5 sm:text-[0.62rem] sm:tracking-[0.14em] sm:whitespace-nowrap ${tone.chip}`}
          >
            {item.tag}
          </span>
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col sm:contents">
          <h3 className="break-words font-display text-[0.95rem] font-bold leading-snug text-ink sm:mt-4 sm:text-[1.05rem]">
            {item.name}
          </h3>
          <p className="mt-1 break-words text-[0.75rem] leading-relaxed text-faint sm:text-[0.78rem]">{item.blurb}</p>

          <div className="relative mt-auto flex flex-wrap items-end justify-between gap-x-2 gap-y-1 pt-2 sm:flex-nowrap sm:pt-4">
            <span className="font-display text-base font-extrabold whitespace-nowrap text-ink sm:text-lg">
              {formatPrice(item.price)}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[0.62rem] font-bold uppercase tracking-wider whitespace-nowrap transition-transform duration-300 group-hover:translate-x-0.5 sm:text-[0.7rem] ${tone.text}`}
            >
              View
              <ArrowRight size={13} />
            </span>
          </div>
        </div>

        <span className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-linear-to-r from-transparent via-gold/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </button>
    </TiltCard>
  )
}

export default function Hero({ onQueryChange }) {
  const sectionRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const cardY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 120])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 60])
  const orbY = useTransform(scrollYProgress, [0, 1], [0, -140])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduceMotion ? 1 : 0.25])

  const handleSelect = (name) => {
    onQueryChange(name)
    scrollToSection('menu')
  }

  return (
    <section id="home" ref={sectionRef} className="relative overflow-hidden pt-28 lg:pt-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
        <motion.div
          style={{ y: orbY }}
          className="aurora left-[-12%] top-[-8%] h-[26rem] w-[26rem] bg-gold/25"
        />
        <div className="aurora right-[-10%] top-[6%] h-[24rem] w-[24rem] bg-crimson/20" />
        <div className="aurora bottom-[-14%] left-[35%] h-[22rem] w-[22rem] bg-amber-500/15" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-bg to-transparent" />
      </div>

      <div className="container-fr">
        <div className="grid items-center gap-10 sm:gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12">
          <motion.div style={{ y: copyY, opacity: fade }}>
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/8 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-gold-ink backdrop-blur"
            >
              <span className="relative grid h-2 w-2 place-items-center">
                <span className="absolute h-2 w-2 rounded-full bg-emerald-400 animate-pulse-ring" />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Delivery across the town
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-[2.05rem] font-extrabold leading-[1.06] min-[380px]:text-[2.45rem] sm:text-[3.4rem] lg:text-[4.1rem]"
            >
              <span className="text-gradient-ink">Savor The </span>
              <span className="text-gradient-gold">Ultimate Fusion</span>
              <span className="text-gradient-ink"> of BBQ, Chinese, Fast Food &amp; Pizza</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.16 }}
              className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-muted sm:text-[1.08rem]"
            >
              BBQ, Chinese, fast food and pizza, prepared to order. Pick a dish, choose your
              options and send the whole order through WhatsApp.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.24 }}
              className="mt-9 flex flex-wrap items-center gap-3.5"
            >
              <Button size="lg" onClick={() => scrollToSection('menu')}>
                Explore Full Menu
                <ArrowRight size={18} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection('deals')}
              >
                <Tag size={16} />
                Combo Deals
              </Button>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.34 }}
              className="mt-12 grid max-w-lg grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4"
            >
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-2xl font-extrabold text-ink">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-[0.72rem] font-medium uppercase tracking-wider text-faint">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </motion.dl>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.44 }}
              className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.78rem] font-semibold text-muted"
            >
              <span className="inline-flex items-center gap-2">
                <ChefHat size={15} className="shrink-0 text-gold-ink" />
                4 cuisines, one kitchen
              </span>
              <span className="inline-flex items-center gap-2">
                <Truck size={15} className="shrink-0 text-gold-ink" />
                Delivery across the city
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 size={15} className="shrink-0 text-gold-ink" />
                Open till late, daily
              </span>
              <span className="inline-flex items-center gap-2">
                <Star size={15} className="shrink-0 text-gold-ink" />
                {PIZZA_FLAVOURS.length} pizza flavours
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: cardY }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5"
          >
            {HERO_HIGHLIGHTS.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 40, rotate: index % 2 ? 4 : -4 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.25 + index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={index % 3 === 0 ? 'mt-6 sm:mt-8' : ''}
              >
                <HighlightCard item={item} index={index} onSelect={handleSelect} />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="col-span-1 mt-1 mb-8 flex flex-col gap-3 rounded-[1.4rem] border border-gold/25 bg-linear-to-r from-gold/12 via-crimson/10 to-transparent p-4 backdrop-blur-xl sm:col-span-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:rounded-[1.6rem] sm:p-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-gold to-crimson text-ink-on-accent">
                  <Sparkles size={19} />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-[0.95rem] font-bold text-ink">
                    Combo deals
                  </p>
                  <p className="text-[0.75rem] text-muted">
                    {COMBO_DEALS.length} combos · {PIZZA_DEALS.length} pizza deals · from{' '}
                    {formatPrice(CHEAPEST_COMBO.price)}
                  </p>
                  <p className="text-[0.7rem] text-faint">Both live in Combo Deals</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => scrollToSection('deals')}
                className="h-10 w-full shrink-0 cursor-pointer rounded-full border border-gold/40 px-4 text-[0.78rem] font-bold whitespace-nowrap text-gold-ink transition-colors hover:bg-gold hover:text-ink-on-accent sm:w-auto"
              >
                View deals
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="mx-0 mt-20 w-full max-w-none px-0 lg:mt-24">
        <div className="relative w-full overflow-hidden rounded-none border-y border-x-0 border-line bg-surface/60 py-3 backdrop-blur">
          <div className="flex w-max animate-marquee gap-10 pr-10">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center gap-10" aria-hidden={copy === 1}>
                {[
                  'Bar B.Q',
                  'Chinese Favorites',
                  'Rolls & Reshmi',
                  'Broast & Grill',
                  'Pizza Corner',
                  'Combo Deals',
                  'Dine-in & Takeaway',
                ].map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-10 whitespace-nowrap text-[0.72rem] font-bold uppercase tracking-[0.22em] text-faint"
                  >
                    {item}
                    <span className="h-1 w-1 rounded-full bg-gold" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}