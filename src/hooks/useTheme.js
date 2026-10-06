import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'fransico-theme'
const VALID = ['dark', 'light']

function readStored() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return VALID.includes(value) ? value : null
  } catch {
    return null
  }
}

function systemTheme() {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function initialTheme() {
  const stored = readStored()
  if (stored) return stored
  return systemTheme()
}

let current = initialTheme()
const listeners = new Set()

function emit() {
  for (const listener of listeners) listener()
}

function apply(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0F0F14' : '#FAFAFA')
}

export function getTheme() {
  return current
}

export function setTheme(theme) {
  const next = VALID.includes(theme) ? theme : 'dark'
  if (next === current) return
  current = next
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    void 0
  }
  apply(next)
  emit()
}

export function toggleTheme() {
  setTheme(current === 'dark' ? 'light' : 'dark')
}

export function useTheme() {
  const theme = useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getTheme,
    () => 'dark',
  )

  return {
    theme,
    isDark: theme === 'dark',
    setTheme,
    toggleTheme,
  }
}