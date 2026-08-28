import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import { BookingFlow } from '@/components/booking-flow'

export const metadata: Metadata = {
  title: 'Agendamento | Nego Black',
  description: 'Escolha o serviço, o barbeiro, a data e o horário do seu atendimento.',
}

export default function AppointmentPage() {
  return (
    <main className="site-background min-h-dvh">
      <header className="route-enter-header border-b border-border/70 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 md:px-6">
          <Link
            href="/"
            className="inline-flex min-h-10 items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 overflow-hidden rounded-full border border-border/70 sm:h-9 sm:w-9">
              <Image
                src="/negoblack-logo-black.jpg"
                alt="Logo Nego Black"
                width={36}
                height={36}
                sizes="36px"
                className="h-full w-full object-cover"
              />
            </span>
            <span className="hidden font-display text-base font-semibold uppercase tracking-widest text-foreground min-[360px]:inline">
              Nego Black
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-3.5 py-7 min-[360px]:px-4 min-[380px]:py-10 sm:py-14 md:px-6 md:py-16 lg:py-20">
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

        <div className="route-enter-content">
          <BookingFlow />
        </div>
      </div>
    </main>
  )
}
