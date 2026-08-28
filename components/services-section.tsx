import { services, brl } from '@/lib/booking-data'
import { ArrowUpRight, Clock } from 'lucide-react'

export function ServicesSection() {
  return (
    <section id="servicos" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 min-[380px]:py-12 sm:py-16 md:px-6 md:py-24">
      <div data-reveal className="flex items-end justify-between gap-6 border-b border-border pb-6 sm:pb-8">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
            O que fazemos
          </p>
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground min-[360px]:text-4xl md:text-5xl">
            Serviços
          </h2>
        </div>
        <p className="hidden max-w-xs text-right text-sm leading-relaxed text-muted-foreground sm:block">
          Escolha o cuidado que combina com o seu momento. Sem complicação.
        </p>
      </div>

      <ul className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 md:grid-cols-3">
        {services.map((service, index) => (
          <li
            key={service.id}
            data-reveal
            data-reveal-delay={index + 1}
            className="group relative flex min-h-48 flex-col overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-secondary sm:min-h-60 sm:p-6 md:min-h-64 md:p-7"
          >
            <div className="mb-5 flex items-center justify-between sm:mb-8">
              <span className="font-display text-sm font-semibold tracking-[0.2em] text-primary">
                0{index + 1}
              </span>
              <ArrowUpRight
                className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                aria-hidden="true"
              />
            </div>
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-2xl font-semibold uppercase tracking-wide text-foreground">
                {service.name}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
            <div className="mt-auto flex items-end justify-between border-t border-border pt-5">
              <span className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {service.durationMin} min
              </span>
              <span className="whitespace-nowrap font-display text-xl font-bold text-primary sm:text-2xl">
                {brl(service.price)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
