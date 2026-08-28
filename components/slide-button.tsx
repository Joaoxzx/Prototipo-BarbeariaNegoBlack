'use client'

import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Scissors, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SlideButtonProps {
  label: string
  href: string
  className?: string
}

const PADDING = 6
const THRESHOLD = 0.72

export function SlideButton({ label, href, className }: SlideButtonProps) {
  const router = useRouter()
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const [x, setX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [completed, setCompleted] = useState(false)
  const startXRef = useRef(0)
  const maxXRef = useRef(0)
  const movedRef = useRef(false)

  const getMaxX = useCallback(() => {
    const track = trackRef.current
    if (!track) return 0
    const thumbWidth = thumbRef.current?.offsetWidth ?? 80
    return Math.max(0, track.offsetWidth - thumbWidth - PADDING * 2)
  }, [])

  const triggerComplete = useCallback(() => {
    const maxX = getMaxX()
    setCompleted(true)
    setX(maxX)

    window.setTimeout(() => {
      if (href.startsWith('#')) {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      router.push(href)
    }, 220)

    window.setTimeout(() => {
      setCompleted(false)
      setX(0)
    }, 1100)
  }, [getMaxX, href, router])

  const onPointerDown = (e: React.PointerEvent) => {
    if (completed) return
    setDragging(true)
    movedRef.current = false
    startXRef.current = e.clientX - x
    maxXRef.current = getMaxX()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || completed) return
    const maxX = maxXRef.current
    const next = e.clientX - startXRef.current
    const clamped = Math.max(0, Math.min(maxX, next))
    if (Math.abs(clamped - x) > 3) movedRef.current = true
    setX(clamped)
  }

  const onPointerUp = () => {
    if (completed) return
    setDragging(false)
    const maxX = maxXRef.current || getMaxX()

    if (!movedRef.current) {
      triggerComplete()
      return
    }

    if (maxX > 0 && x >= maxX * THRESHOLD) {
      triggerComplete()
    } else {
      setX(0)
    }
  }

  const maxX = getMaxX()
  const progress = maxX > 0 ? Math.min(1, x / maxX) : 0

  return (
    <div
      ref={trackRef}
      className={cn(
        'slide-button-track relative flex h-[68px] w-full select-none items-center overflow-hidden rounded-full border border-border/70 bg-secondary/60 backdrop-blur-md sm:h-[76px]',
        className,
      )}
    >
      <span
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-2 pl-12 font-display text-sm font-semibold uppercase tracking-wide text-foreground min-[360px]:text-base sm:gap-2.5 sm:pl-0 sm:text-lg"
        style={{ opacity: Math.max(0, 1 - progress * 1.6) }}
      >
        {label}
        <ChevronsRight className="slide-button-chevrons h-4 w-4 opacity-60 sm:h-5 sm:w-5" aria-hidden="true" />
      </span>

      <div
        ref={thumbRef}
        role="button"
        tabIndex={0}
        aria-label={label}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            triggerComplete()
          }
        }}
        className={cn(
          'absolute left-[6px] z-20 flex h-14 w-[72px] shrink-0 cursor-grab touch-none items-center justify-center rounded-full bg-foreground text-background shadow-lg active:cursor-grabbing sm:h-16 sm:w-20',
          !dragging && 'transition-transform duration-300 ease-out',
        )}
        style={{ transform: `translateX(${x}px)` }}
      >
        <Scissors className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
      </div>
    </div>
  )
}
