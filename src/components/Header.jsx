import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import {
  Clock3,
  Flame,
  Menu as MenuIcon,
  MessageCircle,
  Moon,
  Phone,
  Search,
  ShoppingBag,
  Sun,
  X,
} from 'lucide-react'

import Logo from './Logo'
import Button from './ui/Button'
import { useTheme } from '../hooks/useTheme'
import { useCart } from '../hooks/useCart'
import { cn, scrollToSection } from '../lib/utils'
import { NAV_LINKS } from '../lib/nav'
import {
  CONTACT,
  OPENING_HOURS,
  ORDER_MESSAGE_PREFIX,
  formatPrice,
  searchMenu,
  unitPrice,
  whatsappLink,
} from '../data/menu'

function ThemeToggle({ compact = false }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className={cn(
        'relative grid cursor-pointer place-items-center rounded-full border border-line-strong bg-surface/70 text-ink backdrop-blur transition-colors hover:border-gold/60 hover:text-gold-ink',
        compact ? 'h-10 w-10' : 'h-11 w-11',
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="absolute grid place-items-center"
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

function CartTrigger() {
  const { count, total, openCart } = useCart()

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}${count ? `, ${formatPrice(total)}` : ''}`}
      className="relative grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-line-strong bg-surface/70 text-ink backdrop-blur transition-colors hover:border-gold/60 hover:text-gold-ink"
    >
      <ShoppingBag size={18} />
      <AnimatePresence>
        {count > 0 ? (
          <motion.span
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-crimson px-1 text-[0.62rem] font-extrabold text-white"
          >
            {count}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </button>
  )
}

export default function Header({ query, onQueryChange }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [suggestions, setSuggestions] = useState([])
  const [focused, setFocused] = useState(false)
  const searchRef = useRef(null)
  const mobileSearchRef = useRef(null)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (value) => setScrolled(value > 24))

  useEffect(() => {
    const matches = searchMenu(query).slice(0, 5)
    setSuggestions(
      matches.map((item) => ({
        id: item.id,
        name: item.name,
        detail: `${item.category} · from ${formatPrice(
          unitPrice(item, item.variants?.[0]?.label),
        )}`,
      })),
    )
  }, [query])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.2, 0.6] },
    )

    for (const link of NAV_LINKS) {
      const node = document.getElementById(link.id)
      if (node) observer.observe(node)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        setSearchOpen(false)
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
        window.setTimeout(() => mobileSearchRef.current?.focus(), 60)
        scrollToSection('menu')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const go = (id) => {
    setMobileOpen(false)
    scrollToSection(id)
  }

  const submitSearch = () => {
    setSearchOpen(false)
    setMobileOpen(false)
    setFocused(false)
    scrollToSection('menu')
  }

  const orderLink = whatsappLink(ORDER_MESSAGE_PREFIX)

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500',
          scrolled ? 'glass shadow-elev-2' : 'bg-transparent',
        )}
      >
        <div className="container-fr flex h-16 items-center gap-3 sm:h-[4.5rem] sm:gap-4">
          {/* The wordmark drops below `sm`: at 320-375px the logo plus five header
                controls cannot fit the bar, and the overflow was being hidden
                rather than solved. Search and cart stay reachable in the
                mobile menu and floating bar. */}
          <Logo showTagline={false} wordmarkClassName="hidden sm:flex" />

          <nav className="ml-auto hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => go(link.id)}
                className={cn(
                  'relative cursor-pointer rounded-full px-3 py-2 text-[0.85rem] font-semibold whitespace-nowrap transition-colors',
                  active === link.id ? 'text-gold-ink' : 'text-muted hover:text-ink',
                )}
              >
                {active === link.id ? (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 -z-10 rounded-full border border-gold/40 bg-gold/12"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative">{link.label}</span>
              </button>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0 xl:ml-4">
            <div className="relative hidden xl:block">
              <div className="flex h-11 w-56 items-center gap-2 rounded-full border border-line-strong bg-surface/70 px-4 backdrop-blur transition-colors focus-within:border-gold/60">
                <Search size={16} className="shrink-0 text-faint" />
                <input
                  ref={searchRef}
                  type="search"
                  role="combobox"
                  aria-expanded={focused && suggestions.length > 0}
                  aria-controls="header-search-suggestions"
                  aria-autocomplete="list"
                  value={query}
                  onChange={(event) => onQueryChange(event.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => window.setTimeout(() => setFocused(false), 140)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') submitSearch()
                  }}
                  placeholder="Search the menu…"
                  aria-label="Search the menu"
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint"
                />
              </div>

              <AnimatePresence>
                {focused && suggestions.length > 0 ? (
                  <motion.ul
                    id="header-search-suggestions"
                    role="listbox"
                    aria-label="Menu suggestions"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 top-[calc(100%+0.6rem)] w-72 overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-elev-3"
                  >
                    {suggestions.map((item) => (
                      <li key={item.id} role="option" aria-selected="false">
                        <button
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={submitSearch}
                          className="w-full cursor-pointer rounded-xl px-3 py-2 text-left transition-colors hover:bg-surface-muted"
                        >
                          <span className="block text-[0.82rem] font-semibold text-ink">
                            {item.name}
                          </span>
                          <span className="block text-[0.72rem] text-faint">{item.detail}</span>
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                ) : null}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => {
                setSearchOpen((value) => !value)
                window.setTimeout(() => mobileSearchRef.current?.focus(), 60)
              }}
              aria-label="Search menu"
              aria-expanded={searchOpen}
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-line-strong bg-surface/70 text-ink backdrop-blur transition-colors hover:border-gold/60 hover:text-gold-ink xl:hidden"
            >
              <Search size={18} />
            </button>

            <ThemeToggle />

            <CartTrigger />

            <a
              href={`tel:${CONTACT.primaryCall.tel}`}
              aria-label={`Call ${CONTACT.primaryCall.display}`}
              className="hidden items-center gap-2 rounded-full border border-line-strong bg-surface/70 px-4 py-2.5 text-[0.82rem] font-semibold whitespace-nowrap text-ink backdrop-blur transition-colors hover:border-gold/60 hover:text-gold-ink 2xl:inline-flex"
            >
              <Phone size={15} />
              {CONTACT.primaryCall.display}
            </a>

            {/* Visibility lives on a wrapper: Button sets `inline-flex` in its own
                base, and a `hidden` utility on the Button cannot win against
                that, so the order CTA stayed visible below `sm` and pushed the
                menu button past the viewport. */}
            <span className="hidden sm:inline-flex">
              <Button
                as="a"
                href={orderLink}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Start an order on WhatsApp"
              >
                <MessageCircle size={17} />
                <span className="hidden xl:inline">Order Now</span>
              </Button>
            </span>

            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-line-strong bg-surface/70 text-ink backdrop-blur transition-colors hover:text-gold-ink lg:hidden"
            >
              {mobileOpen ? <X size={18} /> : <MenuIcon size={18} />}
            </button>
          </div>
        </div>

        <div
          className={cn(
            'h-px w-full transition-opacity duration-500',
            scrolled
              ? 'bg-linear-to-r from-transparent via-gold/50 to-transparent opacity-100'
              : 'opacity-0',
          )}
        />

        <AnimatePresence>
          {searchOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-line bg-bg/95 backdrop-blur xl:hidden"
            >
              <div className="container-fr py-3">
                <div className="flex h-12 items-center gap-2 rounded-full border border-line-strong bg-surface px-4">
                  <Search size={17} className="text-faint" />
                  <input
                    ref={mobileSearchRef}
                    type="search"
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') submitSearch()
                    }}
                    placeholder="Search zinger, biryani, pizza…"
                    aria-label="Search the menu"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
                  />
                  <button
                    type="button"
                    onClick={() => onQueryChange('')}
                    aria-label="Clear search"
                    className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full bg-line text-faint transition-colors hover:bg-crimson hover:text-white"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default bg-bg-deep/80 backdrop-blur-md"
            />
            <motion.nav
              initial={{ y: -28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -28, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Mobile navigation"
              className="absolute inset-x-3 top-[4.25rem] max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain rounded-[1.75rem] border border-line bg-surface p-5 shadow-elev-3 sm:top-[5rem]"
            >
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link, index) => (
                  <motion.button
                    key={link.id}
                    type="button"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + index * 0.05 }}
                    onClick={() => go(link.id)}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-2xl px-4 py-3.5 text-left font-display text-lg font-bold transition-colors',
                      active === link.id
                        ? 'bg-gold/12 text-gold-ink'
                        : 'text-ink hover:bg-surface-muted',
                    )}
                  >
                    {link.label}
                    <span className="text-[0.7rem] font-semibold text-faint">0{index + 1}</span>
                  </motion.button>
                ))}
              </div>

              <div className="mt-5 grid gap-2.5">
                <Button
                  as="a"
                  href={orderLink}
                  target="_blank"
                  rel="noreferrer noopener"
                  size="lg"
                  variant="whatsapp"
                >
                  <MessageCircle size={18} />
                  Order on WhatsApp
                </Button>
                <Button as="a" href={`tel:${CONTACT.primaryCall.tel}`} variant="outline" size="lg">
                  <Phone size={17} />
                  Call {CONTACT.primaryCall.display}
                </Button>
              </div>

              <div className="mt-5 flex items-center gap-2.5 rounded-2xl border border-line bg-surface-muted px-4 py-3 text-[0.78rem] text-muted">
                <Clock3 size={15} className="shrink-0 text-gold-ink" />
                <span className="min-w-0">{OPENING_HOURS.summary}</span>
              </div>

              <p className="mt-4 flex items-center justify-center gap-2 text-[0.75rem] font-semibold text-faint">
                <Flame size={14} className="text-crimson" />
                {CONTACT.slogan}
              </p>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}