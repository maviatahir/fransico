export function cn(...values) {
  return values.filter(Boolean).join(' ')
}

export function scrollToSection(id) {
  const target = document.getElementById(id)
  if (!target) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const top = target.getBoundingClientRect().top + window.scrollY - 88
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
}