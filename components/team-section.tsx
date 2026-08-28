import { barbers } from '@/lib/booking-data'
import Image from 'next/image'

export function TeamSection() {
  return (
    <section
      id="equipe"
      className="scroll-mt-20 border-y border-border bg-sidebar py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
          As mãos por trás do corte
        </p>
        <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
          Nossos barbeiros
        </h2>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {barbers.map((barber, index) => (
            <li
              key={barber.id}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <Image
                  src={barber.image || '/placeholder.svg'}
                  alt={`Retrato de ${barber.name}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover saturate-[1.08] transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-card/80 to-transparent"
                  aria-hidden="true"
                />
                <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                  0{index + 1}
                </span>
              </div>
              <div className="p-5 md:p-6">
                <p className="text-xs font-medium uppercase tracking-widest text-primary">
                  {barber.role}
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold uppercase tracking-wide text-foreground">
                  {barber.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{barber.specialty}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
