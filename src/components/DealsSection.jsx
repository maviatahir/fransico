import { motion } from 'framer-motion'
import { Layers, Sparkles, Tag } from 'lucide-react'

import DealCard from './DealCard'
import { SectionHeading } from './ui/Reveal'
import {
  CHEAPEST_COMBO,
  COMBO_DEAL_ITEMS,
  CONTACT,
  PIZZA_DEAL_ITEMS,
  formatPrice,
} from '../data/menu'

const PERKS = [
  {
    icon: Tag,
    title: 'One fixed price',
    text: 'Everything in the deal is listed at a single price. No split payments.',
  },
  {
    icon: Layers,
    title: 'Meals, not snacks',
    text: 'Each deal names every item it contains, so you can see it before ordering.',
  },
  {
    icon: Sparkles,
    title: 'Swaps on request',
    text: 'Add your order in the cart, then mention any swaps in your message.',
  },
]

export default function DealsSection() {
  return (
    <section id="deals" className="relative py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="aurora left-[6%] top-[10%] h-[22rem] w-[22rem] bg-crimson/16" />
        <div className="aurora right-[4%] bottom-[6%] h-[26rem] w-[26rem] bg-gold/16" />
      </div>

      <div className="container-fr">
        <SectionHeading
          eyebrow="Combo Deals"
          title="Sharing bundles,"
          highlight="priced per set"
          description={`${COMBO_DEAL_ITEMS.length} combo deals, each with a main, a side and a drink. Add one to your cart and build the rest of the order around it.`}
        />

        <div className="mt-12 flex flex-col gap-8">
          <div className="flex flex-col gap-3 rounded-[1.75rem] border border-line bg-surface/70 p-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold/12 text-gold-ink">
                <Sparkles size={20} />
              </span>
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted">
                  Combo Deals 1 — {COMBO_DEAL_ITEMS.length}
                </p>
                <p className="font-display text-lg font-extrabold text-ink">
                  {COMBO_DEAL_ITEMS.length} bundles · from{' '}
                  <span className="text-gold-ink">{formatPrice(CHEAPEST_COMBO.price)}</span>
                </p>
              </div>
            </div>

            <p className="text-[0.8rem] leading-relaxed text-muted">
              Our {PIZZA_DEAL_ITEMS.length} pizza deals live in{' '}
              <a
                href="#pizza-corner"
                className="font-bold text-gold-ink underline decoration-gold/40 underline-offset-4 transition-colors hover:decoration-gold"
              >
                Pizza Corner
              </a>
              .
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {COMBO_DEAL_ITEMS.map((deal, index) => (
              <DealCard key={deal.id} deal={deal} index={index} accent="gold" />
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {PERKS.map((perk, index) => {
              const Icon = perk.icon
              return (
                <motion.div
                  key={perk.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="flex items-start gap-3 rounded-2xl border border-line bg-surface/70 p-4 backdrop-blur"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/12 text-gold-ink">
                    <Icon size={17} />
                  </span>
                  <div>
                    <p className="font-display text-[0.92rem] font-bold text-ink">{perk.title}</p>
                    <p className="mt-0.5 text-[0.78rem] leading-relaxed text-muted">
                      {perk.text}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <p className="text-center text-[0.8rem] text-muted">
            Ordering for more people?{' '}
            <a
              href={`tel:${CONTACT.primaryCall.tel}`}
              className="font-bold text-ink transition-colors hover:text-gold-ink"
            >
              Call {CONTACT.primaryCall.display}
            </a>{' '}
            and we will build the order with you. {CONTACT.deliveryNote}
          </p>
        </div>
      </div>
    </section>
  )
}