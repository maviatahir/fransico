import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Phone, ShoppingBag } from 'lucide-react'

import { useCart } from '../hooks/useCart'
import {
  CONTACT,
  ORDER_MESSAGE_PREFIX,
  ORDER_WHATSAPP,
  formatPrice,
  whatsappLink,
} from '../data/menu'

export default function FloatingBar() {
  const { count, total, openCart } = useCart()

  return (
    <motion.div
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-3 bottom-3 z-40 flex justify-center pb-safe sm:inset-x-auto sm:right-6 sm:bottom-6 sm:justify-end"
    >
      <div className="glass flex w-full max-w-[24rem] items-center gap-2 rounded-full p-1.5 shadow-elev-3">
        <button
          type="button"
          onClick={openCart}
          aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'} totalling ${formatPrice(total)}`}
          className="relative flex flex-1 cursor-pointer items-center gap-2.5 rounded-full bg-linear-to-r from-amber-300 via-gold to-amber-300 px-4 py-2.5 text-left text-ink-on-accent transition-transform hover:scale-[1.02] sm:flex-none"
        >
          <span className="relative grid place-items-center">
            <ShoppingBag size={17} />
            <AnimatePresence>
              {count > 0 ? (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  className="absolute -right-2.5 -top-2 grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-crimson px-1 text-[0.62rem] font-extrabold text-white"
                >
                  {count}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] opacity-80">
              {count > 0 ? 'Your cart' : 'Start an order'}
            </span>
            <span className="mt-0.5 text-[0.85rem] font-extrabold">
              {count > 0 ? formatPrice(total) : 'Add items'}
            </span>
          </span>
        </button>

        <a
          href={`tel:${CONTACT.primaryCall.tel}`}
          aria-label={`Call ${CONTACT.primaryCall.display}`}
          className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-line-strong text-ink transition-colors hover:border-gold hover:bg-gold hover:text-ink-on-accent"
        >
          <Phone size={16} />
        </a>

        <a
          href={whatsappLink(ORDER_MESSAGE_PREFIX)}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`Order on WhatsApp ${ORDER_WHATSAPP.display}`}
          className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full bg-emerald-500 text-white transition-colors hover:bg-emerald-400"
        >
          <MessageCircle size={17} />
        </a>
      </div>
    </motion.div>
  )
}