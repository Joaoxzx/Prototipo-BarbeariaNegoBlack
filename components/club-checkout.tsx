'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, HandCoins, QrCode, ShieldCheck } from 'lucide-react'
import { clubPlans } from '@/lib/club-data'
import { brl } from '@/lib/booking-data'
import {
  CUSTOMER_PROFILES_KEY,
  LAST_CUSTOMER_PHONE_KEY,
  type CustomerProfile,
} from '@/lib/club-session'
import { cn } from '@/lib/utils'

type PaymentMethod = 'pix' | 'barber'
type CheckoutStatus = 'pix-pending' | 'barber-confirmed' | null

export function ClubCheckout() {
  const [selectedPlanId, setSelectedPlanId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<CheckoutStatus>(null)

  useEffect(() => {
    try {
      const lastPhone = window.localStorage.getItem(LAST_CUSTOMER_PHONE_KEY)
      const savedProfiles = window.localStorage.getItem(CUSTOMER_PROFILES_KEY)
      const profiles = savedProfiles
        ? (JSON.parse(savedProfiles) as Record<string, CustomerProfile>)
        : {}
      const profile = lastPhone ? profiles[lastPhone] : null
      if (profile) {
        setName(profile.name)
        setPhone(profile.phone)
      }
    } catch {
      // The checkout still works when local storage is unavailable.
    }
  }, [])

  const selectedPlan = useMemo(
    () => clubPlans.find((plan) => plan.id === selectedPlanId) ?? null,
    [selectedPlanId],
  )

  const canContinue = Boolean(selectedPlan && paymentMethod && name.trim() && phone.trim())

  const submitCheckout = () => {
    if (!canContinue || !paymentMethod) return
    setStatus(paymentMethod === 'pix' ? 'pix-pending' : 'barber-confirmed')
  }

  if (status && selectedPlan) {
    return (
      <section className="glass-panel flow-panel-enter mx-auto max-w-2xl rounded-xl border border-primary/30 p-4 text-center min-[360px]:p-5 sm:p-8 md:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {status === 'pix-pending' ? <QrCode className="h-7 w-7" /> : <Check className="h-7 w-7" />}
        </span>
        <p className="mt-6 text-xs font-medium uppercase tracking-widest text-primary">
          {status === 'pix-pending' ? 'Pagamento via Pix' : 'Pagamento presencial'}
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-foreground min-[360px]:text-3xl">
          {status === 'pix-pending' ? 'Plano selecionado' : 'Adesão reservada'}
        </h2>
        <p className="mx-auto mt-3 max-w-md break-words text-sm leading-relaxed text-muted-foreground">
          {status === 'pix-pending'
            ? 'Seu pedido está pronto. O QR Code seguro será exibido aqui assim que o provedor de pagamento estiver conectado.'
            : 'Tudo certo. Você poderá pagar diretamente ao barbeiro na sua próxima visita.'}
        </p>

        <dl className="glass-inset mx-auto mt-7 grid max-w-sm gap-3 rounded-lg border p-4 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Plano</dt>
            <dd className="text-right font-medium text-foreground">{selectedPlan.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Benefício</dt>
            <dd className="text-right font-medium text-foreground">{selectedPlan.monthlyBenefit}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-border pt-3">
            <dt className="text-muted-foreground">Mensalidade</dt>
            <dd className="font-display text-lg font-bold text-primary">{brl(selectedPlan.price)}</dd>
          </div>
        </dl>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => setStatus(null)}
            className="min-h-11 rounded-sm border border-border px-5 text-sm font-medium uppercase tracking-wide text-foreground transition-colors hover:bg-secondary"
          >
            Alterar escolha
          </button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-sm bg-primary px-5 text-sm font-medium uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-85"
          >
            Voltar ao início
          </a>
        </div>
      </section>
    )
  }

  return (
    <div className="grid gap-6 sm:gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(280px,300px)] lg:items-start">
      <div className="min-w-0 space-y-6 sm:space-y-8">
        <section>
          <p className="text-xs font-medium uppercase tracking-widest text-primary">1. Escolha seu plano</p>
          <div className="mt-3 grid gap-2.5 sm:mt-4 sm:gap-3 md:grid-cols-3">
            {clubPlans.map((plan) => {
              const selected = selectedPlanId === plan.id
              return (
                <button
                  key={plan.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setSelectedPlanId(plan.id)
                    setStatus(null)
                  }}
                  className={cn(
                    'relative min-h-[112px] rounded-xl border p-3.5 text-left transition-colors sm:min-h-[156px] sm:p-5',
                    selected
                      ? 'border-primary bg-primary/10 ring-1 ring-primary/25'
                      : 'glass-card hover:border-primary/50',
                  )}
                >
                  <span className="flex min-w-0 items-start justify-between gap-2 pr-7 sm:gap-3">
                    <span className="min-w-0 font-display text-lg font-semibold uppercase tracking-wide text-foreground sm:text-xl">
                      {plan.name}
                    </span>
                    <span className="shrink-0 font-display text-lg font-bold text-primary sm:text-xl">
                      {brl(plan.price)}
                    </span>
                  </span>
                  <span className="mt-2 block text-xs font-medium text-foreground sm:mt-3 sm:text-sm">{plan.monthlyBenefit}</span>
                  <span className="mt-1 hidden text-xs leading-relaxed text-muted-foreground sm:block">{plan.description}</span>
                  {selected && (
                    <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        <section className="glass-panel rounded-xl border p-3.5 min-[360px]:p-4 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">2. Seus dados</p>
          <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-2 sm:gap-4">
            <div>
              <label htmlFor="club-checkout-name" className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Nome completo
              </label>
              <input
                id="club-checkout-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Seu nome"
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="club-checkout-phone" className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Telefone / WhatsApp
              </label>
              <input
                id="club-checkout-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="(11) 90000-0000"
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary"
              />
            </div>
          </div>
        </section>

        <section>
          <p className="text-xs font-medium uppercase tracking-widest text-primary">3. Forma de pagamento</p>
          <div className="mt-3 grid gap-2.5 min-[560px]:grid-cols-2 sm:mt-4 sm:gap-3">
            {([
              ['pix', 'Pix pelo site', 'Pagamento instantâneo pelo QR Code.', QrCode],
              ['barber', 'Pagar ao barbeiro', 'Pague pessoalmente na sua próxima visita.', HandCoins],
            ] as const).map(([value, title, description, Icon]) => {
              const selected = paymentMethod === value
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setPaymentMethod(value)}
                  className={cn(
                    'flex min-h-20 items-center gap-3 rounded-xl border p-3.5 text-left transition-colors sm:min-h-24 sm:gap-4 sm:p-4',
                    selected
                      ? 'border-primary bg-primary/10 ring-1 ring-primary/25'
                      : 'glass-card hover:border-primary/50',
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-primary sm:h-11 sm:w-11">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-medium text-foreground">{title}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{description}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      </div>

      <aside className="glass-panel h-fit rounded-xl border p-4 min-[360px]:p-5 lg:sticky lg:top-6">
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          <p className="text-xs font-medium uppercase tracking-widest">Resumo</p>
        </div>
        <h2 className="mt-3 font-display text-2xl font-semibold uppercase text-foreground">
          {selectedPlan?.name ?? 'Escolha um plano'}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {selectedPlan?.monthlyBenefit ?? 'Selecione uma opção para continuar.'}
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          <span className="text-sm uppercase tracking-wide text-muted-foreground">Mensalidade</span>
          <span className="font-display text-2xl font-bold text-primary">
            {selectedPlan ? brl(selectedPlan.price) : '—'}
          </span>
        </div>
        <button
          type="button"
          disabled={!canContinue}
          onClick={submitCheckout}
          className="mt-6 min-h-12 w-full rounded-sm bg-primary px-4 text-sm font-medium uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {paymentMethod === 'pix' ? 'Continuar para o Pix' : 'Confirmar adesão'}
        </button>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
          Nenhuma mensagem será enviada automaticamente.
        </p>
      </aside>
    </div>
  )
}
