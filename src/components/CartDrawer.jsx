import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  CheckCheck,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react'

import { useCart } from '../hooks/useCart'
import { buildOrderMessage, lineLabel, MAX_QTY } from '../lib/cart'
import {
  CONTACT,
  DEFAULT_WHATSAPP,
  formatPrice,
  whatsappLink,
} from '../data/menu'
import Button from './ui/Button'
import { cn } from '../lib/utils'

const ADDRESS_HINT = 'Enter your delivery address to continue.'
const ADDRESS_MIN = 8

export default function CartDrawer() {
  const {
    lines,
    count,
    subtotal,
    deliveryCharge,
    total,
    isCartOpen,
    closeCart,
    increment,
    decrement,
    remove,
    clear,
    openerRef,
  } = useCart()

  const [address, setAddress] = useState('')
  const [addressTouched, setAddressTouched] = useState(false)
  const [ordered, setOrdered] = useState(false)
  const [popupBlocked, setPopupBlocked] = useState(false)

  const addressRef = useRef(null)
  const panelRef = useRef(null)
  const closeRef = useRef(null)

  const addressValue = address.trim()
  const addressValid = addressValue.length >= ADDRESS_MIN
  const showError = addressTouched && !addressValid

  useEffect(() => {
    if (!isCartOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeCart()
        return
      }

      if (event.key !== 'Tab') return

      const focusables = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables || focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    closeRef.current?.focus()

    const opener = openerRef.current

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
      opener?.focus?.()
    }
  }, [isCartOpen, closeCart, openerRef])

  useEffect(() => {
    if (isCartOpen) {
      setOrdered(false)
      setPopupBlocked(false)
    }
  }, [isCartOpen])

  const checkout = () => {
    if (!addressValid) {
      setAddressTouched(true)
      addressRef.current?.focus()
      return
    }

    const message = buildOrderMessage({ lines, address: addressValue })
    const tab = window.open(whatsappLink(message, DEFAULT_WHATSAPP), '_blank')

    /* Popup blockers return null. Keep the cart intact and point the customer
       at the same link so they are never stuck with a dead button. */
    if (!tab) {
      setPopupBlocked(true)
      return
    }

    setOrdered(true)
  }

  return (
    <AnimatePresence>
      {isCartOpen ? (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <motion.button
            type="button"
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 h-full w-full cursor-pointer bg-bg-deep/80 backdrop-blur-md"
          />

          <motion.aside
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[28rem] flex-col border-l border-line bg-bg shadow-elev-3"
          >
            <header className="flex items-center justify-between gap-4 border-b border-line bg-surface/70 px-5 py-5 sm:px-6">
              <div className="flex min-w-0 items-center gap-3.5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-gold/20 bg-gold/12 text-gold-ink">
                  <ShoppingBag size={20} />
                </span>
                <div className="min-w-0">
                  <h2
                    id="cart-title"
                    className="font-display text-lg font-extrabold leading-tight text-ink"
                  >
                    Your Cart
                  </h2>
                  <p className="mt-1 text-[0.78rem] text-muted">
                    {count} {count === 1 ? 'item' : 'items'}
                    {count > 0 ? ` · ${formatPrice(total)} total` : ''}
                  </p>
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full border border-line-strong text-muted transition-colors hover:border-crimson/60 hover:text-crimson"
              >
                <X size={18} />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <span
                  className={`grid h-16 w-16 place-items-center rounded-2xl border ${
                    ordered ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-line bg-surface'
                  } text-faint`}
                >
                  {ordered ? <CheckCheck size={26} className="text-emerald-500" /> : <ShoppingBag size={26} />}
                </span>
                <p className="font-display text-lg font-bold text-ink">
                  {ordered ? 'Order details prepared' : 'Your cart is empty'}
                </p>
                <p className="max-w-[17rem] text-sm leading-relaxed text-muted">
                  {ordered
                    ? 'WhatsApp is open with your order. Press send, and we will confirm availability and delivery time.'
                    : 'Browse the menu and use “Add to Cart”. Pick a size or option first where one is offered.'}
                </p>
                <Button variant="outline" onClick={closeCart} className="mt-2">
                  Continue browsing
                </Button>
              </div>
            ) : (
              <>
                {ordered ? (
                  <p
                    role="status"
                    className="mx-5 mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-[0.78rem] leading-relaxed text-ink sm:mx-6"
                  >
                    Your order details are open in WhatsApp. This cart is still saved here until you
                    clear it.
                  </p>
                ) : null}

                <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.li
                        key={line.key}
                        layout
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 24, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="rounded-2xl border border-line bg-surface p-4 shadow-elev-1"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="break-words font-display text-[0.92rem] font-bold leading-snug text-ink">
                              {lineLabel(line)}
                            </p>
                            <p className="mt-1 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-faint">
                              {line.category}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="font-display text-base font-extrabold leading-tight text-ink">
                              {formatPrice(line.unitPrice * line.qty)}
                            </p>
                            <p className="mt-1 text-[0.68rem] text-faint">
                              {formatPrice(line.unitPrice)} each
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                          <div className="inline-flex items-center gap-1 rounded-full border border-line-strong bg-bg px-1 py-1">
                            <button
                              type="button"
                              onClick={() => decrement(line.key)}
                              disabled={line.qty <= 1}
                              aria-label={`Decrease ${lineLabel(line)}`}
                              className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="min-w-7 text-center text-[0.82rem] font-extrabold text-ink">
                              {line.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => increment(line.key)}
                              disabled={line.qty >= MAX_QTY}
                              aria-label={`Increase ${lineLabel(line)}`}
                              className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => remove(line.key)}
                            aria-label={`Remove ${lineLabel(line)}`}
                            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[0.72rem] font-semibold text-faint transition-colors hover:bg-crimson/10 hover:text-crimson"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="max-h-[64dvh] shrink-0 overflow-y-auto overscroll-contain border-t border-line bg-bg/95 px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 backdrop-blur sm:px-6">
                  <div className="rounded-2xl border border-line bg-surface p-4 shadow-elev-1">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="font-display text-[0.9rem] font-bold text-ink">Order summary</h3>
                      <span className="rounded-full bg-gold/12 px-2.5 py-1 text-[0.68rem] font-bold text-gold-ink">
                        {count} {count === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                    <dl className="space-y-2 text-[0.8rem]">
                      <div className="flex items-center justify-between gap-3 text-muted">
                        <dt>Items Subtotal</dt>
                        <dd>{formatPrice(subtotal)}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-muted">
                        <dt>Delivery Charge</dt>
                        <dd>{formatPrice(deliveryCharge)}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-3 border-t border-line pt-2.5 font-bold text-ink">
                        <dt>Grand Total</dt>
                        <dd className="font-display text-xl">{formatPrice(total)}</dd>
                      </div>
                    </dl>
                    <p className="mt-2.5 flex items-center gap-1.5 text-[0.68rem] leading-relaxed text-faint">
                      <ShieldCheck size={13} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                      {CONTACT.deliveryNote}
                    </p>
                  </div>

                  <label htmlFor="cart-address" className="mt-4 flex flex-col gap-2">
                    <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-muted">
                      Delivery Address <span className="text-crimson">*</span>
                    </span>
                    <textarea
                      id="cart-address"
                      ref={addressRef}
                      rows={2}
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      onBlur={() => setAddressTouched(true)}
                      placeholder="House / flat no, street, area, city"
                      aria-required="true"
                      aria-invalid={showError}
                      aria-describedby="cart-address-hint"
                      className={cn(
                        'w-full resize-y rounded-xl border bg-surface px-3.5 py-3 text-[0.85rem] leading-relaxed text-ink transition-colors outline-none placeholder:text-faint focus:border-gold',
                        showError ? 'field-invalid border-line-strong' : 'border-line-strong',
                      )}
                    />
                    <span
                      id="cart-address-hint"
                      className={cn(
                        'flex items-start gap-1.5 text-[0.72rem]',
                        showError ? 'font-semibold text-crimson' : 'text-faint',
                      )}
                    >
                      {showError ? <AlertCircle size={13} className="mt-px shrink-0" /> : null}
                      {showError ? ADDRESS_HINT : `At least ${ADDRESS_MIN} characters.`}
                    </span>
                  </label>

                  {popupBlocked ? (
                    <p
                      role="status"
                      className="mt-3 flex items-start gap-2 rounded-xl border border-crimson/30 bg-crimson/10 px-3.5 py-3 text-[0.78rem] text-ink"
                    >
                      <AlertCircle size={15} className="mt-px shrink-0 text-crimson" />
                      <span>
                        Your browser blocked the WhatsApp tab. Allow popups for this page, or{' '}
                        <a
                          href={whatsappLink(
                            buildOrderMessage({ lines, address: addressValue }),
                            DEFAULT_WHATSAPP,
                          )}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="font-bold text-gold-ink underline underline-offset-2"
                        >
                          open your order here
                        </a>
                        .
                      </span>
                    </p>
                  ) : null}

                  <div className="sticky bottom-0 -mx-5 mt-3 border-t border-line bg-bg/95 px-5 py-3 backdrop-blur sm:-mx-6 sm:px-6">
                    <Button
                      variant="whatsapp"
                      size="lg"
                      onClick={checkout}
                      disabled={!addressValid || ordered}
                      aria-describedby="cart-address-hint"
                      className="w-full"
                    >
                      <MessageCircle size={18} />
                      {ordered ? 'WhatsApp opened · cart saved' : 'Continue to WhatsApp'}
                    </Button>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Button variant="ghost" size="sm" onClick={closeCart}>
                      Continue browsing
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        clear()
                        setOrdered(false)
                        setAddress('')
                        setAddressTouched(false)
                      }}
                    >
                      Clear cart
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  )
}