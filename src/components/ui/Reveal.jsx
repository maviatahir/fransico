import { motion } from 'framer-motion'

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = '',
  once = true,
  as = 'div',
}) {
  const MotionTag = motion[as] ?? motion.div

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-90px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = 'center',
  badge = true,
}) {
  const centered = align === 'center'

  return (
    <div
      className={`flex flex-col items-center gap-4 text-center ${centered ? 'items-center' : 'items-start text-left'}`}
    >
      {badge && eyebrow ? (
        <Reveal>
          <span className="inline-flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.26em] text-muted">
            <span className="h-px w-8 bg-linear-to-r from-transparent to-gold" aria-hidden="true" />
            <span className="text-gradient-gold">{eyebrow}</span>
            <span
              className="h-px w-8 bg-linear-to-l from-transparent to-gold"
              aria-hidden="true"
            />
          </span>
        </Reveal>
      ) : null}

      <Reveal delay={0.06}>
        <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.08] sm:text-4xl lg:text-[3.4rem]">
          <span className="text-gradient-ink">{title}</span>{' '}
          {highlight ? <span className="text-gradient-gold">{highlight}</span> : null}
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <span
          className="h-[3px] w-40 rounded-full bg-linear-to-r from-transparent via-gold to-transparent shadow-[0_0_18px_var(--fr-gold)] sm:w-56"
          aria-hidden="true"
        />
      </Reveal>

      {description ? (
        <Reveal delay={0.14}>
          <p className="max-w-2xl text-[0.98rem] leading-relaxed text-muted sm:text-base">
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  )
}

export default Reveal