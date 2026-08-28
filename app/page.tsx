import { Onboarding } from '@/components/onboarding'
import { ServicesSection } from '@/components/services-section'
import { ScrollReveal } from '@/components/scroll-reveal'
import { SiteHeader } from '@/components/site-header'
import { AtSign, MapPin, Clock } from 'lucide-react'
import Image from 'next/image'

export default function Page() {
  return (
    <main className="site-background min-h-screen">
      <ScrollReveal />
      <SiteHeader />
      <Onboarding />
      <ServicesSection />

      <footer data-reveal className="border-t border-border bg-sidebar">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:py-12 md:grid-cols-3 md:px-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70">
                <Image
                  src="/negoblack-logo-black.jpg"
                  alt="Logo Nego Black"
                  width={36}
                  height={36}
                  sizes="36px"
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="font-display text-xl font-bold uppercase tracking-[0.2em] text-foreground">
                Nego Black
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Barbearia de atitude no coração de São Paulo. Corte, barba e estilo
              desde 2012.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-primary">Visite</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                Rua Augusta, 1200 · Consolação
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                Ter–Sáb · 09h às 19h
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-primary">Siga</h3>
            <a
              href="#"
              className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <AtSign className="h-4 w-4" aria-hidden="true" />
              @negoblack
            </a>
          </div>
        </div>
        <div className="border-t border-border">
          <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground md:px-6">
            © {new Date().getFullYear()} NegoBlack. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </main>
  )
}
