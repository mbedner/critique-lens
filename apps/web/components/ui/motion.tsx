"use client"

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
  type Variants,
} from "framer-motion"
import { useEffect, type ReactNode, type ComponentProps } from "react"
import { cn } from "@/lib/utils"

export { motion, AnimatePresence }

export const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const springSnappy = { type: "spring", stiffness: 420, damping: 32 } as const
export const springGentle = { type: "spring", stiffness: 280, damping: 24 } as const

// ── Entrance: fade + slide up ──────────────────────────────────────────────
export function FadeUp({
  children,
  delay = 0,
  duration = 0.4,
  className,
  ...props
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: easeOutExpo }}
      style={{ willChange: "opacity, transform" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ── Card entrance with sequential delay ───────────────────────────────────
export function CardEntrance({
  children,
  index = 0,
  className,
}: {
  children: ReactNode
  index?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 + index * 0.065, ease: easeOutExpo }}
      style={{ willChange: "opacity, transform" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Card hover: spring lift ────────────────────────────────────────────────
export function LiftCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      whileHover={{ y: -3, transition: springSnappy }}
      whileTap={{ scale: 0.98, transition: springSnappy }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Floating icon (empty states) ──────────────────────────────────────────
export function FloatIcon({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Stagger list (requires client rendering) ──────────────────────────────
const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
}

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: easeOutExpo } },
}

export function StaggerList({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  )
}

// ── Animated number counter ────────────────────────────────────────────────
export function CountUp({
  to,
  duration = 1.4,
  className,
}: {
  to: number
  duration?: number
  className?: string
}) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    const controls = animate(count, to, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
    })
    return controls.stop
  }, [to, duration, count])

  return <motion.span className={className}>{rounded}</motion.span>
}

// ── Page shell: wraps page main content ──────────────────────────────────
export function PageShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex-1", className)}
    >
      {children}
    </motion.div>
  )
}

// ── Press button wrapper ──────────────────────────────────────────────────
export function Pressable({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.96, transition: springSnappy }}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.div>
  )
}
