import { motion } from 'framer-motion'
import { Flame, Info, Pizza as PizzaIcon, Sparkles } from 'lucide-react'

import MenuCard from './MenuCard'
import DealCard from './DealCard'
import { SectionHeading } from './ui/Reveal'
import {
  CHEAPEST_PIZZA_DEAL,
  PIZZA_DEAL_ITEMS,
  PIZZA_FLAVOURS,
  PIZZA_FLAVOUR_ITEMS,
  PIZZA_PRICES,
  PIZZA_SIDE_ITEMS,
  PIZZA_SIDES,
  PIZZA_TOPPINGS,
  SEEKH_PIZZA_ITEM,
  formatPrice,
} from '../data/menu'

export default function PizzaCorner() {
  const flavourItems = PIZZA_FLAVOUR_ITEMS
  const seekhItem = SEEKH_PIZZA_ITEM
  const sideItems = PIZZA_SIDE_ITEMS
  const dealItems = PIZZA_DEAL_ITEMS

  return (
    <section id="pizza-corner" className="relative py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="aurora left-[12%] top-[4%] h-[24rem] w-[24rem] bg-amber-500/16" />
        <div className="aurora right-[8%] top-[30%] h-[22rem] w-[22rem] bg-crimson/14" />
      </div>

      <div className="container-fr">
        <SectionHeading
          eyebrow="Pizza Corner"
          title="Every pizza we make,"
          highlight="in one place"
          description={`${PIZZA_FLAVOURS.length} signature flavours, a Seekh Kabab special, loaded sides and ${dealItems.length} pizza deals. Pick a size, add toppings if you like, and it goes straight to your cart.`}
        />

        <div className="mt-12 flex flex-col gap-16">
          <div className="flex flex-col gap-5 overflow-hidden rounded-[1.75rem] border border-line bg-surface/70 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-7">
            <div className="max-w-md">
              <h3 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
                <Flame size={18} className="text-crimson" />
                One price, three sizes
              </h3>
              <p className="mt-2 text-[0.86rem] leading-relaxed text-muted">
                The same prices apply to all {PIZZA_FLAVOURS.length} signature flavours. Choose a
                size on the card before adding.
              </p>
            </div>

            <div className="grid w-full shrink-0 grid-cols-3 gap-2 sm:w-auto sm:gap-3">
              {Object.entries(PIZZA_PRICES).map(([size, price]) => (
                <div
                  key={size}
                  className="min-w-0 rounded-xl border border-gold/35 bg-linear-to-b from-gold/12 to-transparent px-2 py-2.5 text-center sm:rounded-2xl sm:px-4 sm:py-3"
                >
                  <p className="text-[0.56rem] font-bold uppercase tracking-[0.1em] text-gold-ink sm:text-[0.64rem] sm:tracking-[0.18em]">
                    {size}
                  </p>
                  <p className="mt-1 whitespace-nowrap font-display text-[0.78rem] font-extrabold text-ink sm:text-lg">
                    {formatPrice(price)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="text-xl">🍕</span>
              <h3 className="font-display text-xl font-extrabold text-ink">Signature Flavours</h3>
              <span className="h-px flex-1 bg-linear-to-r from-line to-transparent" />
              <span className="text-[0.72rem] font-semibold uppercase tracking-wider text-muted">
                {flavourItems.length} options
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {flavourItems.map((item, index) => (
                <MenuCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>

          {seekhItem ? (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-crimson/12 text-crimson">
                    <Sparkles size={17} />
                  </span>
                  <h3 className="font-display text-xl font-extrabold text-ink">
                    Signature Special
                  </h3>
                  <span className="h-px flex-1 bg-linear-to-r from-line to-transparent" />
                </div>
                <MenuCard item={seekhItem} />
              </div>

              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gold/12 text-gold-ink">
                    <PizzaIcon size={17} />
                  </span>
                  <h3 className="font-display text-xl font-extrabold text-ink">Extra Toppings</h3>
                  <span className="h-px flex-1 bg-linear-to-r from-line to-transparent" />
                </div>

                <div className="flex h-full flex-col gap-4 rounded-[1.5rem] border border-line bg-surface/80 p-6 backdrop-blur">
                  <p className="text-[0.86rem] leading-relaxed text-muted">
                    Stack any combination on any signature pizza —{' '}
                    <span className="font-bold text-ink">
                      {formatPrice(PIZZA_TOPPINGS[0].price)} each
                    </span>
                    . Select them on the flavour card before adding to the cart.
                  </p>

                  <ul className="grid gap-2.5 sm:grid-cols-3">
                    {PIZZA_TOPPINGS.map((topping) => (
                      <li
                        key={topping.name}
                        className="flex items-center justify-between gap-2 rounded-xl border border-line bg-bg-deep/50 px-3.5 py-3"
                      >
                        <span className="text-[0.85rem] font-bold text-ink">{topping.name}</span>
                        <span className="text-[0.8rem] font-extrabold text-gold-ink">
                          +{formatPrice(topping.price)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-auto flex items-start gap-2 text-[0.75rem] text-faint">
                    <Info size={14} className="mt-0.5 shrink-0" />
                    Seekh Kabab flavour is our chef&rsquo;s special and is{' '}
                    <span className="font-semibold text-muted">not available in deals</span>.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="text-xl">🍟</span>
              <h3 className="font-display text-xl font-extrabold text-ink">
                Sides &amp; Signatures
              </h3>
              <span className="h-px flex-1 bg-linear-to-r from-line to-transparent" />
              <span className="text-[0.72rem] font-semibold uppercase tracking-wider text-muted">
                {PIZZA_SIDES.length} items
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sideItems.map((item, index) => (
                <MenuCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-crimson/12 text-crimson">
                  <Flame size={17} />
                </span>
                <h3 className="font-display text-xl font-extrabold text-ink">
                  Pizza Deals (1 to {dealItems.length})
                </h3>
                <span className="h-px flex-1 bg-linear-to-r from-line to-transparent" />
              </div>
              <p className="text-[0.8rem] text-muted">
                From {formatPrice(CHEAPEST_PIZZA_DEAL.price)} · suited to families and groups
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {dealItems.map((deal, index) => (
                <DealCard key={deal.id} deal={deal} index={index} accent="crimson" />
              ))}
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-[0.78rem] text-muted"
          >
            Prices shown are for the base crust. Extra cheese, meat or vegetables can be added to any
            signature flavour.
          </motion.p>
        </div>
      </div>
    </section>
  )
}