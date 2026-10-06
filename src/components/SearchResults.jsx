import { AnimatePresence, motion } from 'framer-motion'
import { SearchX } from 'lucide-react'

import MenuCard from './MenuCard'
import DealCard from './DealCard'
import { SEARCH_GROUPS, searchMenu } from '../data/menu'

export default function SearchResults({ query }) {
  const results = searchMenu(query)
  const count = results.length

  /* Several catalogue categories can share one customer-facing heading (pizza
     flavours and pizza sides are both "Fransico Pizza"). Merge by title so a
     group is never rendered twice. */
  const grouped = []
  const byTitle = new Map()

  for (const group of SEARCH_GROUPS) {
    const items = results.filter((item) => item.categoryId === group.id)
    if (items.length === 0) continue

    const existing = byTitle.get(group.title)
    if (existing) {
      existing.items.push(...items)
      continue
    }

    const entry = { id: group.id, title: group.title, emoji: group.emoji, items }
    byTitle.set(group.title, entry)
    grouped.push(entry)
  }

  if (count === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[1.75rem] border border-dashed border-line-strong bg-surface/60 px-6 py-16 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-crimson/12 text-crimson">
          <SearchX size={22} />
        </span>
        <p className="font-display text-lg font-bold text-ink">No dishes matched “{query}”</p>
        <p className="max-w-sm text-sm text-muted">
          Try a keyword such as Zinger, Malai Tikka, Chowmein, Biryani or Deal 5.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-9">
      <AnimatePresence mode="wait">
        {grouped.map((group) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="text-lg" aria-hidden="true">
                {group.emoji}
              </span>
              <h3 className="font-display text-[1.05rem] font-extrabold text-ink">
                {group.title}
              </h3>
              <span className="rounded-full border border-line bg-bg-deep/50 px-2.5 py-0.5 text-[0.68rem] font-bold text-muted">
                {group.items.length}
              </span>
              <span className="h-px flex-1 bg-linear-to-r from-line to-transparent" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.items.map((item, index) =>
                item.kind === 'deal' ? (
                  <DealCard
                    key={item.id}
                    deal={item}
                    index={index}
                    query={query}
                    accent={item.categoryId === 'pizzadeals' ? 'crimson' : 'gold'}
                  />
                ) : (
                  <MenuCard key={item.id} item={item} index={index} query={query} showCategory />
                ),
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}