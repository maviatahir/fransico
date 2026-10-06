import { MessageCircle, Phone } from 'lucide-react'

import Logo from './Logo'
import Button from './ui/Button'
import { NAV_LINKS } from '../lib/nav'
import {
  CONTACT,
  MENU_CATEGORIES,
  OPENING_HOURS,
  ORDER_MESSAGE_PREFIX,
  ORDER_WHATSAPP,
  whatsappLink,
} from '../data/menu'
import { scrollToSection } from '../lib/utils'

/* Content is listed once. Deals and Pizza Corner are separate destinations —
   Pizza Deals already live inside Pizza Corner, so they get no own link. */
const EXPLORE_LINKS = [
  { label: 'Full menu', id: 'menu' },
  { label: 'Combo deals', id: 'deals' },
  { label: 'Pizza corner', id: 'pizza-corner' },
]

const MENU_LINKS = MENU_CATEGORIES.map((category) => ({
  label: category.label,
  id: 'menu',
}))

function FooterLink({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-mx-2 inline-flex min-h-9 cursor-pointer items-center rounded-lg px-2 text-left text-[0.85rem] text-muted transition-colors hover:text-gold-ink"
    >
      {label}
    </button>
  )
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-faint">{title}</p>
      <div className="mt-4 flex flex-col items-start gap-2.5">{children}</div>
    </div>
  )
}

export default function Footer() {
  const orderLink = whatsappLink(ORDER_MESSAGE_PREFIX)

  return (
    <footer className="relative border-t border-line bg-bg-deep">
      <div className="container-fr">
        <div className="grid gap-10 py-14 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:gap-8">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-[0.86rem] leading-relaxed text-muted">
              {CONTACT.tagline}, prepared to order. Four cuisines from one kitchen, with combo
              deals made for sharing.
            </p>
            <p className="mt-4 font-display text-[0.95rem] font-extrabold text-gradient-gold">
              {CONTACT.slogan}
            </p>
          </div>

          <FooterColumn title="Navigate">
            {NAV_LINKS.map((link) => (
              <FooterLink
                key={link.id}
                label={link.label}
                onClick={() => scrollToSection(link.id)}
              />
            ))}
          </FooterColumn>

          <FooterColumn title="Menu">
            {MENU_LINKS.map((link) => (
              <FooterLink
                key={link.label}
                label={link.label}
                onClick={() => scrollToSection(link.id)}
              />
            ))}
          </FooterColumn>

          <FooterColumn title="Explore">
            {EXPLORE_LINKS.map((link) => (
              <FooterLink
                key={link.id}
                label={link.label}
                onClick={() => scrollToSection(link.id)}
              />
            ))}
          </FooterColumn>
        </div>

        <div className="grid gap-6 border-t border-line py-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-7">
            <a
              href={`tel:${CONTACT.primaryCall.tel}`}
              className="inline-flex items-center gap-2.5 text-[0.85rem] transition-colors hover:text-gold-ink"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line-strong text-gold-ink">
                <Phone size={15} />
              </span>
              <span className="font-display text-[0.98rem] font-extrabold whitespace-nowrap text-ink">
                {CONTACT.primaryCall.display}
              </span>
            </a>

            <p className="flex items-center gap-2.5 text-[0.82rem] text-muted">
              <span className="relative grid h-2 w-2 place-items-center">
                <span className="absolute h-2 w-2 rounded-full bg-emerald-400 animate-pulse-ring" />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {OPENING_HOURS.summaryLong}
            </p>
          </div>

          <Button
            as="a"
            href={orderLink}
            target="_blank"
            rel="noreferrer noopener"
            variant="whatsapp"
            aria-label={`Order on WhatsApp ${ORDER_WHATSAPP.display}`}
            className="w-full sm:w-auto"
          >
            <MessageCircle size={17} />
            Order on WhatsApp
          </Button>
        </div>

        {/* Bottom clearance for the fixed floating bar lives inside the footer
            background so no lighter strip of page shows beneath it. */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-line py-6 pb-28 text-center sm:flex-row sm:text-left">
          <p className="text-[0.76rem] text-faint">
            © {new Date().getFullYear()} {CONTACT.brand}. All rights reserved.
          </p>
          <p className="text-[0.76rem] text-faint">{CONTACT.deliveryNote}</p>
        </div>
      </div>
    </footer>
  )
}