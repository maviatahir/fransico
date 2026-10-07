import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { buildLine } from '../lib/cart'
import { formatPrice, unitPrice } from '../data/menu'
import CardCartControl from './CardCartControl'

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function Highlight({ text, query }) {
  const terms = useMemo(
    () =>
      (query ?? '')
        .toLowerCase()
        .split(/\s+/)
        .filter((token) => token.length > 1 && !/^\d+$/.test(token)),
    [query],
  )

  if (!terms.length) return text

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi')
  const parts = String(text).split(pattern)

  return parts.map((part, index) => {
    const isMatch = terms.includes(part.toLowerCase())
    const key = `highlight-${index}-${String(part || '').replace(/\s+/g, '-') || 'empty'}`

    return isMatch ? (
      <mark key={key} className="fr-mark bg-transparent">
        {part}
      </mark>
    ) : (
      <span key={key}>{part}</span>
    )
  })
}

export default function MenuCard({
  item,
  query = '',
  showCategory = false,
  index = 0,
  className = '',
}) {
  const options = item.variants ?? null
  const hasToppings = Array.isArray(item.toppings) && item.toppings.length > 0

  const [option, setOption] = useState(() => options?.[0]?.label ?? null)
  const [toppings, setToppings] = useState([])

  const selected = options?.find((entry) => entry.label === option) ?? null
  const price = unitPrice(item, option, toppings)
  const line = buildLine(item, { variant: option, toppings })

  const toggleTopping = (name) => {
    setToppings((current) =>
      current.includes(name) ? current.filter((entry) => entry !== name) : [...current, name],
    )
  }

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.38, delay: Math.min(index * 0.03, 0.32) }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-4 shadow-elev-1 transition-[border-color,box-shadow,transform] duration-300 hover-lift hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-elev-2 focus-within:border-gold/50 sm:p-5 ${className}`}
    >
      <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-gold to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 font-display text-[0.98rem] font-bold leading-snug text-ink">
          <Highlight text={item.name} query={query} />
        </h3>
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold transition-transform duration-300 group-hover:scale-125" />
      </div>

      {showCategory || item.group ? (
        <p className="mt-1.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-faint">
          {item.category}
          {item.group ? ` · ${item.group}` : ''}
        </p>
      ) : null}

      {options ? (
        <div
          role="radiogroup"
          aria-label={`Choose ${item.name} option`}
          className="mt-3.5 flex flex-wrap gap-2"
        >
          {options.map((variant) => {
            const isSelected = variant.label === option
            return (
              <button
                key={variant.label}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setOption(variant.label)}
                className={`cursor-pointer rounded-xl border px-3 py-2 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-gold bg-gold/12 shadow-[0_0_0_1px_var(--fr-gold)]'
                    : 'border-line-strong bg-bg-deep/50 hover:border-gold/50'
                }`}
              >
                <span
                  className={`block text-[0.6rem] font-bold uppercase tracking-[0.12em] ${
                    isSelected ? 'text-gold-ink' : 'text-muted'
                  }`}
                >
                  {variant.label}
                </span>
                <span
                  className={`mt-0.5 block font-display text-[0.82rem] font-extrabold ${
                    isSelected ? 'text-gold-ink' : 'text-ink-soft'
                  }`}
                >
                  {formatPrice(variant.price)}
                </span>
              </button>
            )
          })}
        </div>
      ) : null}

      {hasToppings ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.toppings.map((topping) => {
            const isOn = toppings.includes(topping.name)
            return (
              <button
                key={topping.name}
                type="button"
                aria-pressed={isOn}
                onClick={() => toggleTopping(topping.name)}
                className={`inline-flex min-h-10 cursor-pointer items-center rounded-full border px-3 py-1 text-[0.68rem] font-bold transition-all duration-200 ${
                  isOn
                    ? 'border-crimson bg-crimson text-white'
                    : 'border-line-strong text-muted hover:border-crimson/60 hover:text-crimson'
                }`}
              >
                {topping.name} +{formatPrice(topping.price)}
              </button>
            )
          })}
        </div>
      ) : null}

      <div className="mt-auto flex items-end justify-between gap-3 pt-4">
        <div className="min-w-0">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-faint">
            {selected ? `${selected.label} price` : 'Price'}
          </p>
          <AnimatePresence mode="popLayout">
            <motion.p
              key={`${item.id}-${option}-${toppings.join('+')}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="font-display text-xl font-extrabold whitespace-nowrap text-ink"
            >
              {formatPrice(price)}
            </motion.p>
          </AnimatePresence>
        </div>

        <CardCartControl line={line} />
      </div>

{hasToppings ? (
          <p className="mt-2.5 text-[0.65rem] text-faint">
            {item.toppings.length} toppings available ·{' '}
            {formatPrice(item.toppings[0].price)} each
          </p>
        ) : null}
    </motion.article>
  )
}