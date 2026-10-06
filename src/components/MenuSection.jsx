import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Sparkles, X } from 'lucide-react'

import MenuCard from './MenuCard'
import SearchResults from './SearchResults'
import { SectionHeading } from './ui/Reveal'
import { MENU_CATEGORIES, normaliseSearch, SEARCH_TRIGGERS, searchMenu } from '../data/menu'
import { scrollToSection } from '../lib/utils'

/* Links that run inside a sentence stay inline and align to the baseline,
   while min-h-9 keeps the tap target large enough on touch screens. */
function InlineJump({ to, children }) {
  return (
    <button
      type="button"
      onClick={() => scrollToSection(to)}
      className="relative inline-flex min-h-9 cursor-pointer items-center font-bold text-gold-ink underline decoration-gold/40 underline-offset-4 transition-colors hover:decoration-gold"
    >
      {children}
    </button>
  )
}

function CategoryBody({ category }) {
  return (
    <div className="space-y-10">
      {category.groups.map((group, groupIndex) => (
        <div key={`${category.id}-${group.title ?? 'group'}-${groupIndex}`}>
          {group.title ? (
            <div className="mb-4 flex items-center gap-3">
              <h3 className="font-display text-[1.05rem] font-extrabold text-ink">
                {group.title}
              </h3>
              <span className="h-px flex-1 bg-linear-to-r from-line to-transparent" />
              <span className="shrink-0 text-[0.7rem] font-semibold text-muted">
                {group.items.length} items
              </span>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {group.items.map((item, index) => (
              <MenuCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function MenuSection({ query, onQueryChange }) {
  const [activeId, setActiveId] = useState(MENU_CATEGORIES[0].id)
  const term = normaliseSearch(query)
  const isSearching = term.length > 0
  const category = MENU_CATEGORIES.find((item) => item.id === activeId) ?? MENU_CATEGORIES[0]

  return (
    <section id="menu" className="relative py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-linear-to-b from-bg-deep to-transparent"
      />

      <div className="container-fr">
        <SectionHeading
          eyebrow="Our Signature Menu"
          title="Four cuisines,"
          highlight="one kitchen"
          description="Bar B.Q, rolls, Chinese and fast food, all cooked to order. Choose a category, pick your options and add straight to the cart."
        />

        <p className="mx-auto mt-5 max-w-2xl text-center text-[0.86rem] text-faint">
          Combo deals live in the{' '}
          <InlineJump to="deals">Specials section</InlineJump>{' '}
          and pizzas in <InlineJump to="pizza-corner">Pizza Corner</InlineJump>. Both are
          included when you search.
        </p>

        <div className="mt-12 flex flex-col gap-6">
          {isSearching ? (
            <SearchPanel query={query} onQueryChange={onQueryChange} />
          ) : (
            <>
              <div className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
                {MENU_CATEGORIES.map((item) => {
                  const isActive = item.id === category.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      aria-pressed={isActive}
                      className={`relative isolate shrink-0 cursor-pointer rounded-full border px-5 py-3 text-[0.82rem] font-bold transition-colors duration-300 ${
                        isActive
                          ? 'border-transparent text-ink-on-accent'
                          : 'border-line-strong bg-surface/70 text-muted backdrop-blur hover:border-gold/60 hover:text-ink'
                      }`}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="menu-tab-indicator"
                          className="absolute inset-0 -z-10 rounded-full bg-linear-to-r from-amber-300 via-gold to-amber-300 shadow-[0_14px_38px_-16px_rgba(217,119,6,0.85)]"
                          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                        />
                      ) : null}
                      <span className="mr-1.5">{item.emoji}</span>
                      <span className="hidden sm:inline">{item.label}</span>
                      <span className="sm:hidden">{item.short}</span>
                    </button>
                  )
                })}
              </div>

              <div className="flex flex-col gap-4 rounded-[1.5rem] border border-line bg-surface/70 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold/12 text-gold-ink">
                    <Sparkles size={18} />
                  </span>
                  <div>
                    <p className="font-display text-[0.95rem] font-extrabold text-ink">
                      {category.emoji} {category.label}
                    </p>
                    <p className="text-[0.78rem] text-muted">{category.blurb}</p>
                  </div>
                </div>

                <div className="flex h-11 w-full items-center gap-2 rounded-full border border-line-strong bg-bg-deep/50 px-4 focus-within:border-gold sm:max-w-xs">
                  <Search size={15} className="shrink-0 text-faint" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder="Search zinger, biryani, pizza…"
                    aria-label="Search the whole menu"
                    className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => onQueryChange('')}
                      aria-label="Clear search"
                      className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full bg-line text-faint transition-colors hover:bg-crimson hover:text-white"
                    >
                      <X size={13} />
                    </button>
                  ) : null}
                </div>
              </div>
            </>
          )}

          {isSearching ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={`search-${term}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <SearchResults query={query} />
              </motion.div>
            </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <CategoryBody category={category} />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  )
}

function SearchPanel({ query, onQueryChange }) {
  const count = searchMenu(query).length

  return (
    <div className="flex flex-col gap-5 rounded-[1.5rem] border border-gold/30 bg-surface/80 p-5 backdrop-blur sm:p-6">
      <div className="flex h-14 items-center gap-3 rounded-full border border-gold/50 bg-bg-deep/40 px-5 focus-within:border-gold">
        <Search size={18} className="shrink-0 text-gold-ink" />
        <input
          type="search"
          value={query}
          autoFocus
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Searching the entire menu — try Zinger, Leg, Chowmein or Pizza"
          aria-label="Search the whole menu"
          className="w-full bg-transparent text-[0.95rem] text-ink outline-none placeholder:text-faint"
        />
        <button
          type="button"
          onClick={() => onQueryChange('')}
          className="inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-line-strong px-3 text-[0.7rem] font-bold text-muted transition-colors hover:border-crimson/60 hover:text-crimson"
        >
          <X size={13} />
          Clear Search
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-[0.95rem] font-extrabold text-ink">
          {count > 0 ? (
            <>
              Found <span className="text-gold-ink">{count}</span>{' '}
              {count === 1 ? 'result' : 'results'} for{' '}
              <span className="text-gold-ink">“{query.trim()}”</span>
            </>
          ) : (
            <span className="text-muted">No matches for “{query.trim()}”</span>
          )}
        </p>
        <p className="text-[0.72rem] text-faint">Results across every category &amp; deal</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[0.72rem] text-muted">
        <span className="font-bold uppercase tracking-[0.14em] text-faint">Try searching</span>
        {SEARCH_TRIGGERS.map((trigger) => (
          <button
            key={trigger}
            type="button"
            onClick={() => onQueryChange(trigger)}
            className="inline-flex min-h-9 cursor-pointer items-center rounded-full border border-line-strong bg-bg-deep/40 px-3 font-bold text-ink-soft transition-colors hover:border-gold hover:text-gold-ink"
          >
            {trigger}
          </button>
        ))}
      </div>
    </div>
  )
}