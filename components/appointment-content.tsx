'use client'

import { useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { BookingFlow } from '@/components/booking-flow'

export function AppointmentContent() {
  const [isConfirmed, setIsConfirmed] = useState(false)

  return (
    <>
      {!isConfirmed && (
        <div className="route-enter-intro mb-6 max-w-2xl sm:mb-8 md:mb-10">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-primary sm:h-12 sm:w-12">
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-4 text-xs font-medium uppercase tracking-widest text-primary sm:mt-6">
            Reserve em segundos
          </p>
          <h1 className="mt-2 max-w-[18ch] font-display text-3xl font-bold uppercase leading-tight tracking-tight text-balance text-foreground min-[360px]:text-4xl sm:text-5xl">
            Agende seu horário
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Entre no Clube Mensal ou continue sem login para escolher serviço, barbeiro, data e horário.
          </p>
        </div>
      )}

      <div className="route-enter-content">
        <BookingFlow onConfirmationChange={setIsConfirmed} />
      </div>
    </>
  )
}
