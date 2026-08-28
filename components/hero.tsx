import { Button } from '@/components/ui/button'
import { Star, Clock, MapPin } from 'lucide-react'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/barbershop-hero.png"
          alt="Interior da barbearia com cadeiras de couro e iluminação âmbar"
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col justify-center px-4 py-24 md:min-h-[88vh] md:px-6 md:py-32">
        <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary">
          <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
          Desde 2012 · São Paulo
        </span>

        <h1 className="max-w-2xl font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-balance text-foreground md:text-7xl">
          O corte certo <span className="text-primary">no seu tempo</span>
        </h1>

        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
          Tradição de barbearia com agendamento sem complicação. Escolha o
          serviço, o barbeiro e o horário em menos de um minuto.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button
            render={<a href="#agendar" />}
            nativeButton={false}
            size="lg"
            className="h-12 rounded-sm px-8 text-sm font-semibold uppercase tracking-wide"
          >
            Agendar horário
          </Button>
          <Button
            render={<a href="#servicos" />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="h-12 rounded-sm border-border bg-transparent px-8 text-sm font-semibold uppercase tracking-wide hover:bg-secondary"
          >
            Ver serviços
          </Button>
        </div>

        <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
            <dt className="sr-only">Horário</dt>
            <dd>Ter–Sáb · 09h às 19h</dd>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
            <dt className="sr-only">Endereço</dt>
            <dd>Rua Augusta, 1200 · Consolação</dd>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Star className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
            <dt className="sr-only">Avaliação</dt>
            <dd>4,9 · +2.400 avaliações</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
