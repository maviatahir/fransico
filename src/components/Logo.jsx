import { useId } from 'react'

export function LogoMark({ className = 'h-10 w-10' }) {
  const gradientId = useId()

  return (
    <span className={`relative inline-grid shrink-0 place-items-center ${className}`}>
      <span className="absolute inset-0 rounded-2xl bg-linear-to-br from-gold via-amber-300 to-crimson opacity-90 shadow-[0_10px_30px_-12px_rgba(245,158,11,0.9)]" />
      <span className="absolute inset-[1.5px] rounded-[0.9rem] bg-surface" />
      <svg viewBox="0 0 32 32" className="relative h-[62%] w-[62%]" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--fr-crimson)" />
            <stop offset="55%" stopColor="var(--fr-gold)" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>
        </defs>
        <path
          d="M17.6 3c2.1 3.6.5 5.9-1 7.8-1.7 2-3.6 4.1-3.6 6.9a4.6 4.6 0 0 0 9.2 0c0-1.6-.7-3-1.6-4.3.4 1.8-.6 2.9-1.5 2.9-1 0-1.5-.9-1.1-2.1.9-2.6.2-4.6-1.5-6.1-1.1-1-1.6-2.2-.7-4.4-.8 1.7-.1 2.8.1 3.6.6 2 1.8 3.5 1.8 5.5 0 2.5-1.9 4.4-4.6 4.4"
          fill={`url(#${gradientId})`}
        />
        <path
          d="M8.5 27.2h15M10.6 29.4h10.8"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    </span>
  )
}

export default function Logo({
  compact = false,
  showTagline = true,
  wordmarkClassName = '',
  className = '',
}) {
  return (
    <a
      href="#home"
      aria-label="Fransico — home"
      className={`group flex shrink-0 items-center gap-2.5 whitespace-nowrap ${className}`}
    >
      <LogoMark className="h-10 w-10 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105" />
      {!compact ? (
        <span className={`flex min-w-0 flex-col leading-none ${wordmarkClassName}`}>
          <span className="font-display text-[1.3rem] font-extrabold tracking-[-0.045em] text-ink">
            FRANS
            <span className="text-gradient-gold">ICO</span>
          </span>
          {showTagline ? (
            <span className="mt-1 whitespace-nowrap text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-faint">
              BBQ · Chinese · Pizza
            </span>
          ) : null}
        </span>
      ) : null}
    </a>
  )
}