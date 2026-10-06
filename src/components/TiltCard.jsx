import { useCallback, useRef, useState } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'

export default function TiltCard({
  children,
  className = '',
  innerClassName = '',
  innerRadius = '1.6rem',
  intensity = 9,
  lift = 26,
  glare = true,
  float = false,
  floatDelay = 0,
  floatDistance = 10,
}) {
  const reduceMotion = useReducedMotion()
  const wrapperRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const spring = { stiffness: 190, damping: 20, mass: 0.4 }

  const smoothX = useSpring(px, spring)
  const smoothY = useSpring(py, spring)

  const rotateY = useTransform(smoothX, [0, 1], [-intensity, intensity])
  const rotateX = useTransform(smoothY, [0, 1], [intensity, -intensity])

  const glareX = useTransform(smoothX, (value) => `${value * 100}%`)
  const glareY = useTransform(smoothY, (value) => `${value * 100}%`)
  const glareLayer = useMotionTemplate`radial-gradient(260px circle at ${glareX} ${glareY}, rgba(255,255,255,0.16), transparent 62%)`

  const handleMove = useCallback(
    (event) => {
      if (reduceMotion || event.pointerType === 'touch' || !wrapperRef.current) return
      const rect = wrapperRef.current.getBoundingClientRect()
      px.set((event.clientX - rect.left) / rect.width)
      py.set((event.clientY - rect.top) / rect.height)
    },
    [px, py, reduceMotion],
  )

  const handleEnter = useCallback(
    (event) => {
      if (event.pointerType === 'touch') return
      setHovered(true)
      if (reduceMotion) return
      px.set(0.5)
      py.set(0.5)
    },
    [px, py, reduceMotion],
  )

  const handleLeave = useCallback(() => {
    setHovered(false)
    px.set(0.5)
    py.set(0.5)
  }, [px, py])

  const tiltProps = reduceMotion
    ? {}
    : {
        style: {
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          transformPerspective: 1400,
        },
        animate: { z: hovered ? lift : 0, scale: hovered ? 1.015 : 1 },
        transition: spring,
      }

  return (
    <motion.div
      ref={wrapperRef}
      onPointerMove={handleMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      className={className}
      style={
        float
          ? {
              '--fr-float': `${floatDistance}px`,
              animation: `floatSlow 9s ease-in-out ${floatDelay}ms infinite`,
            }
          : undefined
      }
    >
      <motion.div className={`relative h-full preserve-3d ${innerClassName}`} {...tiltProps}>
        {children}
        {glare ? (
          <motion.span
            aria-hidden="true"
            style={{ backgroundImage: glareLayer, borderRadius: innerRadius }}
            className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null}
      </motion.div>
    </motion.div>
  )
}