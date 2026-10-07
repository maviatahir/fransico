import { motion } from 'framer-motion'

import { Highlight } from './MenuCard'
import { buildLine } from '../lib/cart'
import { formatPrice } from '../data/menu'
import { cn } from '../lib/utils'
import CardCartControl from './CardCartControl'

export default function DealCard({ deal, index = 0, query = '', accent = 'gold' }) {
  const isCrimson = accent === 'crimson'
  const badgeGradient = isCrimson
    ? 'from-pizza-red to-pizza-red-deep'
    : 'from-amber-300 via-gold to-amber-400'
  const halo = isCrimson
    ? 'group-hover:shadow-[0_28px_70px_-30px_var(--fr-pizza-red-glow)]'
    : 'group-hover:shadow-[0_28px_70px_-30px_rgba(217,119,6,0.4)]'
  const haloColor = isCrimson ? 'bg-pizza-red/18' : 'bg-gold/18'

  const line = buildLine(deal)

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.42, delay: Math.min(index * 0.05, 0.45) }}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-line bg-surface p-5 shadow-elev-1 transition-[border-color,box-shadow,transform] duration-300 hover-lift hover:-translate-y-0.5 hover:border-gold/50',
        halo,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl transition-opacity duration-500 group-hover:opacity-100',
          haloColor,
        )}
        style={{ opacity: 0.4 }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <span className="font-display text-[2.6rem] font-extrabold leading-none text-ink/10 transition-colors duration-500 group-hover:text-ink/20">
          {String(deal.number ?? deal.n).padStart(2, '0')}
        </span>
        <span
          className={cn(
            'rounded-full bg-linear-to-br px-3 py-1.5 font-display text-[0.9rem] font-extrabold text-ink-on-accent',
            badgeGradient,
          )}
        >
          {formatPrice(deal.price)}
        </span>
      </div>

      <h3 className="relative mt-3 text-[0.9rem] font-semibold leading-relaxed text-ink">
        <Highlight text={deal.desc} query={query} />
      </h3>

      <div className="relative mt-auto pt-5">
        <CardCartControl line={line} fullWidth />
      </div>
    </motion.article>
  )
}