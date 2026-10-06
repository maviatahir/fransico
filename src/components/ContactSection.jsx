import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Clock3,
  MessageCircle,
  Phone,
  Plus,
  Truck,
  Wallet,
} from 'lucide-react'

import { SectionHeading } from './ui/Reveal'
import {
  CONTACT,
  FAQS,
  OPENING_HOURS,
  ORDER_MESSAGE_PREFIX,
  ORDER_WHATSAPP,
  whatsappLink,
} from '../data/menu'
import { cn } from '../lib/utils'

const CHANNELS = [
  {
    id: 'call',
    icon: Phone,
    label: 'Call us',
    value: CONTACT.primaryCall.display,
    note: 'Fastest way to reach the counter',
    href: `tel:${CONTACT.primaryCall.tel}`,
    cta: 'Call now',
    tone: 'gold',
  },
  {
    id: 'whatsapp',
    icon: MessageCircle,
    label: 'Order via WhatsApp',
    value: ORDER_WHATSAPP.display,
    note: 'Send your list and we will confirm',
    href: whatsappLink(ORDER_MESSAGE_PREFIX),
    external: true,
    cta: 'Message us',
    tone: 'emerald',
  },
]

export default function ContactSection() {
  const [openFaq, setOpenFaq] = useState(0)

  const toneClass = (tone) =>
    tone === 'gold'
      ? 'text-gold-ink bg-gold/12'
      : tone === 'emerald'
        ? 'text-emerald-500 bg-emerald-500/12'
        : 'text-crimson bg-crimson/12'

  return (
    <section id="contact" className="relative py-24 pb-16 lg:py-32 lg:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="aurora left-[-6%] bottom-[10%] h-[24rem] w-[24rem] bg-gold/16" />
        <div className="aurora right-[4%] top-[6%] h-[22rem] w-[22rem] bg-crimson/16" />
      </div>

      <div className="container-fr">
        <SectionHeading
          eyebrow="Contact"
          title="Two ways to reach us,"
          highlight="open till late"
          description="Call the counter or send your order on WhatsApp. We take orders every day and deliver across the city."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {CHANNELS.map((channel, index) => {
            const Icon = channel.icon

            return (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="group relative flex flex-col overflow-hidden rounded-[1.6rem] border border-line bg-surface/80 p-6 shadow-elev-1 backdrop-blur transition-colors duration-300 hover:border-gold/40 hover:shadow-elev-2"
              >
                {/* The hover bloom is clipped by the card so it cannot push past
                the viewport edge on narrow screens. */}
            <div className="pointer-events-none absolute inset-0 bg-gold/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative flex items-center gap-3">
                  <span className={cn('grid h-12 w-12 place-items-center rounded-2xl', toneClass(channel.tone))}>
                    <Icon size={20} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-faint">
                      {channel.label}
                    </p>
                    <p className="mt-0.5 font-display text-[1.05rem] font-extrabold whitespace-nowrap text-ink">
                      {channel.value}
                    </p>
                  </div>
                </div>

                <p className="relative mt-4 text-[0.84rem] leading-relaxed text-muted">
                  {channel.note}
                </p>

                <a
                  href={channel.href}
                  {...(channel.external
                    ? { target: '_blank', rel: 'noreferrer noopener' }
                    : {})}
                  className="relative mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line-strong px-5 text-[0.82rem] font-bold text-muted transition-all duration-300 hover:border-gold/60 hover:bg-gold hover:text-ink-on-accent"
                >
                  {channel.cta}
                </a>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col gap-5">
            <div className="rounded-[1.6rem] border border-line bg-surface/80 p-6 backdrop-blur">
              <h3 className="flex items-center gap-2 font-display text-[1.05rem] font-extrabold text-ink">
                <Clock3 size={17} className="shrink-0 text-gold-ink" />
                Opening hours
              </h3>

              <ul className="mt-4 space-y-2.5">
                {OPENING_HOURS.schedule.map((slot) => (
                  <li
                    key={slot.day}
                    className="flex items-center justify-between gap-4 text-[0.86rem]"
                  >
                    <span className="text-muted">{slot.day}</span>
                    <span className="font-bold whitespace-nowrap text-ink">{slot.time}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-[0.78rem] font-semibold text-muted">
                <span className="relative grid h-2 w-2 place-items-center">
                  <span className="absolute h-2 w-2 rounded-full bg-emerald-400 animate-pulse-ring" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                {OPENING_HOURS.summary}
              </p>
            </div>

            <div className="flex flex-col gap-3.5 rounded-[1.6rem] border border-line bg-surface/80 p-6 backdrop-blur">
              <p className="flex items-start gap-2.5 text-[0.84rem] leading-relaxed text-muted">
                <Truck size={16} className="mt-0.5 shrink-0 text-gold-ink" />
                {CONTACT.deliveryNote}
              </p>
              <p className="flex items-start gap-2.5 text-[0.84rem] leading-relaxed text-muted">
                <Wallet size={16} className="mt-0.5 shrink-0 text-gold-ink" />
                <span>
                  {CONTACT.easyPaisa.label}{' '}
                  <a
                    href={`tel:${CONTACT.easyPaisa.tel}`}
                    className="font-bold text-ink transition-colors hover:text-gold-ink"
                  >
                    {CONTACT.easyPaisa.display}
                  </a>{' '}
                  for advance payment.
                </span>
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[1.6rem] border border-gold/25 bg-linear-to-br from-gold/12 via-crimson/8 to-transparent p-6">
              <p className="font-display text-lg font-extrabold leading-snug text-ink">
                {CONTACT.slogan}
              </p>
              <p className="mt-2 text-[0.82rem] leading-relaxed text-muted">
                {CONTACT.tagline} — all cooked to order.
              </p>
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-line bg-surface/80 p-6 backdrop-blur sm:p-7">
            <h3 className="font-display text-[1.05rem] font-extrabold text-ink">
              Frequently asked questions
            </h3>

            <div className="mt-4 divide-y divide-line">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index
                const panelId = `faq-panel-${index}`
                const buttonId = `faq-button-${index}`

                return (
                  <div key={faq.q}>
                    <button
                      type="button"
                      id={buttonId}
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left"
                    >
                      <span
                        className={cn(
                          'text-[0.92rem] font-bold transition-colors',
                          isOpen ? 'text-gold-ink' : 'text-ink',
                        )}
                      >
                        {faq.q}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          'grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300',
                          isOpen
                            ? 'rotate-45 border-gold/60 bg-gold/12 text-gold-ink'
                            : 'border-line-strong text-faint',
                        )}
                      >
                        <Plus size={14} />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pb-4 text-[0.86rem] leading-relaxed text-muted">{faq.a}</p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}