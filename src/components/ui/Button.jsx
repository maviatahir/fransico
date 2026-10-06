const base =
  'relative inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-tight transition-all duration-300 select-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none'

const variants = {
  primary:
    'sheen text-ink-on-accent bg-linear-to-r from-amber-300 via-gold to-amber-300 shadow-elev-3 hover:shadow-elev-3 hover:brightness-[1.04]',
  whatsapp:
    'text-white bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-elev-2 hover:shadow-elev-3',
  outline:
    'border border-line-strong text-ink bg-surface/60 backdrop-blur hover:border-gold/70 hover:bg-surface hover:text-gold-ink shadow-elev-1 hover:shadow-elev-2',
  ghost: 'text-muted hover:text-ink hover:bg-surface-muted',
  danger:
    'text-white bg-linear-to-r from-crimson to-crimson-deep hover:from-crimson-deep hover:to-crimson shadow-elev-2 hover:shadow-elev-3',
}

const sizes = {
  sm: 'h-9 px-4 text-[0.8rem]',
  md: 'h-11 px-5 text-[0.875rem]',
  lg: 'h-12 px-7 text-[0.95rem]',
  icon: 'h-11 w-11 shrink-0',
}

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <Tag className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </Tag>
  )
}