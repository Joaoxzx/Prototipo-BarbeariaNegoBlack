import Image from 'next/image'
import { SlideButton } from '@/components/slide-button'
import onboardingImage from '@/public/negoblack-onboarding.png'

export function Onboarding() {
  return (
    <section
      id="top"
      className="onboarding-shell relative flex flex-col overflow-hidden bg-background"
    >
      {/* Full-bleed color photo */}
      <div className="absolute inset-0">
        <div className="onboarding-image-drift absolute inset-0">
          <Image
            src={onboardingImage}
            alt="Barbeiro aparando a barba de um cliente com navalha"
            fill
            sizes="100vw"
            preload
            placeholder="blur"
            className="onboarding-image object-cover"
          />
        </div>
        <div
          className="onboarding-overlay absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10"
          aria-hidden="true"
        />
      </div>

      {/* Bottom content */}
      <div className="onboarding-content relative z-10 mx-auto mt-auto w-full max-w-6xl px-4 min-[380px]:px-6">
        <div className="max-w-xl">
          <h1 className="onboarding-title max-w-[15ch] font-display text-[clamp(2.5rem,13vw,3rem)] font-bold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            Descubra a sua melhor versão
          </h1>

          <p className="onboarding-description mt-4 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty sm:mt-5 sm:text-base">
            Estilo, precisão e atitude. Encontre o corte que combina com você e
            saia daqui com outra postura.
          </p>

          <div className="onboarding-slider mt-6 sm:mt-8">
            <SlideButton label="Deslize para começar" href="/agendamento" />
          </div>
        </div>
      </div>
    </section>
  )
}
