import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { AppointmentContent } from '@/components/appointment-content'

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
        <AppointmentContent />
      </div>
    </main>
  )
}
