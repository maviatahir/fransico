import { Minus, Plus } from 'lucide-react'

import { useCart } from '../hooks/useCart'
import { lineLabel, MAX_QTY } from '../lib/cart'

export default function CardCartControl({ line, fullWidth = false }) {
  const { lines, add, increment, decrement } = useCart()
  const cartLine = lines.find((entry) => entry.key === line.key)
  const quantity = cartLine?.qty ?? 0
  const label = lineLabel(line)

  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={() => add(line)}
        className={`h-10 cursor-pointer rounded-full border border-line-strong bg-surface-2 px-4 text-[0.72rem] font-bold whitespace-nowrap text-ink transition-colors hover:border-gold hover:bg-gold hover:text-ink-on-accent ${
          fullWidth ? 'w-full' : 'shrink-0'
        }`}
      >
        Add to Cart
      </button>
    )
  }

  return (
    <div
      role="group"
      aria-label={`${label} quantity controls`}
      className={`flex h-10 items-center justify-between rounded-full border border-gold bg-gold/10 p-1 text-gold-ink ${
        fullWidth ? 'w-full' : 'shrink-0'
      }`}
    >
      <button
        type="button"
        onClick={() => decrement(cartLine.key)}
        aria-label={`Remove one ${label} from cart`}
        className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full transition-colors hover:bg-gold/20"
      >
        <Minus size={16} aria-hidden="true" />
      </button>
      <span aria-live="polite" className="min-w-7 px-1 text-center text-sm font-extrabold tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => increment(cartLine.key)}
        disabled={quantity >= MAX_QTY}
        aria-label={`Add one ${label} to cart`}
        className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full transition-colors hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  )
}
