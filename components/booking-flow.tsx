'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  services,
  barbers,
  timeSlots,
  isSlotTaken,
  brl,
  type Service,
  type Barber,
} from '@/lib/booking-data'
import {
  Scissors,
  User,
  CalendarDays,
  Check,
  Clock,
  ChevronLeft,
  ChevronRight,
  PartyPopper,
  Crown,
  LogIn,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { clubPlans } from '@/lib/club-data'
import {
  CLUB_SESSION_CHANGE_EVENT,
  CLUB_SESSION_KEY,
  CUSTOMER_PROFILES_KEY,
  LAST_CUSTOMER_PHONE_KEY,
  type ClubSession,
  type CustomerProfile,
} from '@/lib/club-session'
import Image from 'next/image'

type Step = 0 | 1 | 2 | 3
type EntryStage = 'checking' | 'question' | 'login' | 'booking'
type BookingRecipient = 'self' | 'other'

const stepMeta = [
  { label: 'Serviço', icon: Scissors },
  { label: 'Barbeiro', icon: User },
  { label: 'Data & Hora', icon: CalendarDays },
  { label: 'Confirmar', icon: Check },
]

const weekdayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const monthNames = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
]

function buildDays(count: number) {
  const days: { iso: string; date: Date }[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let cursor = 0
  while (days.length < count) {
    const d = new Date(today)
    d.setDate(today.getDate() + cursor)
    cursor++
    if (d.getDay() === 0) continue // closed Sundays
    days.push({ iso: d.toISOString().slice(0, 10), date: d })
  }
  return days
}

function getHorizontalScrollProgress(element: HTMLDivElement) {
  const maxScroll = element.scrollWidth - element.clientWidth
  return maxScroll > 0 ? (element.scrollLeft / maxScroll) * 100 : 0
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, '')
}

function readCustomerProfiles() {
  try {
    const savedProfiles = window.localStorage.getItem(CUSTOMER_PROFILES_KEY)
    return savedProfiles
      ? (JSON.parse(savedProfiles) as Record<string, CustomerProfile>)
      : {}
  } catch {
    return {}
  }
}

function saveCustomerProfile(profile: CustomerProfile, rememberAsLast = true) {
  const phoneKey = normalizePhone(profile.phone)
  if (!phoneKey) return

  const profiles = readCustomerProfiles()
  profiles[phoneKey] = profile
  window.localStorage.setItem(CUSTOMER_PROFILES_KEY, JSON.stringify(profiles))
  if (rememberAsLast) window.localStorage.setItem(LAST_CUSTOMER_PHONE_KEY, phoneKey)
}

export function BookingFlow() {
  const [entryStage, setEntryStage] = useState<EntryStage>('checking')
  const [isClubMember, setIsClubMember] = useState(false)
  const [remainingCuts, setRemainingCuts] = useState(2)
  const [memberName, setMemberName] = useState('')
  const [memberPhone, setMemberPhone] = useState('')
  const [bookingRecipient, setBookingRecipient] = useState<BookingRecipient>('self')
  const [recipientChoiceConfirmed, setRecipientChoiceConfirmed] = useState(false)
  const [clubPhone, setClubPhone] = useState('')
  const [clubPin, setClubPin] = useState('')
  const [step, setStep] = useState<Step>(0)
  const [service, setService] = useState<Service | null>(null)
  const [barber, setBarber] = useState<Barber | null>(null)
  const [dateISO, setDateISO] = useState<string>('')
  const [time, setTime] = useState<string>('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [confirmedWithClubCredit, setConfirmedWithClubCredit] = useState(false)
  const [dayScrollProgress, setDayScrollProgress] = useState(0)
  const [timeScrollProgress, setTimeScrollProgress] = useState(0)

  useEffect(() => {
    try {
      const savedSession = window.sessionStorage.getItem(CLUB_SESSION_KEY)
      if (savedSession) {
        const session = JSON.parse(savedSession) as ClubSession
        setIsClubMember(true)
        setRemainingCuts(session.remainingCuts ?? 2)
        setMemberName(session.name ?? '')
        setMemberPhone(session.phone ?? '')
        setName(session.name ?? '')
        setPhone(session.phone ?? '')
        if (session.name && session.phone) {
          saveCustomerProfile({ name: session.name, phone: session.phone })
        }
        setEntryStage('booking')
        return
      }

      const lastPhoneKey = window.localStorage.getItem(LAST_CUSTOMER_PHONE_KEY)
      const rememberedProfile = lastPhoneKey ? readCustomerProfiles()[lastPhoneKey] : null
      if (rememberedProfile) {
        setClubPhone(rememberedProfile.phone)
        setName(rememberedProfile.name)
        setPhone(rememberedProfile.phone)
      }
    } catch {
      window.sessionStorage.removeItem(CLUB_SESSION_KEY)
    }

    setEntryStage('question')
  }, [])

  const days = useMemo(() => buildDays(12), [])

  const selectedDay = days.find((d) => d.iso === dateISO)?.date ?? null
  const usesClubCredit =
    isClubMember && bookingRecipient === 'self' && remainingCuts > 0

  const canNext =
    (step === 0 && service) ||
    (step === 1 && barber) ||
    (step === 2 && dateISO && time) ||
    step === 3

  function reset() {
    setStep(0)
    setService(null)
    setBarber(null)
    setDateISO('')
    setTime('')
    setBookingRecipient('self')
    setRecipientChoiceConfirmed(false)
    setName(isClubMember ? memberName : '')
    setPhone(isClubMember ? memberPhone : '')
    setConfirmed(false)
    setConfirmedWithClubCredit(false)
    setDayScrollProgress(0)
    setTimeScrollProgress(0)
  }

  function loginToClub() {
    const phoneKey = normalizePhone(clubPhone)
    if (!phoneKey || !/^\d{4}$/.test(clubPin)) return

    const savedProfile = readCustomerProfiles()[phoneKey]
    const session = {
      name: savedProfile?.name,
      remainingCuts: 2,
      phone: savedProfile?.phone ?? clubPhone.trim(),
    }
    window.sessionStorage.setItem(CLUB_SESSION_KEY, JSON.stringify(session))
    setIsClubMember(true)
    setRemainingCuts(session.remainingCuts)
    setMemberName(session.name ?? '')
    setMemberPhone(session.phone)
    setBookingRecipient('self')
    setRecipientChoiceConfirmed(false)
    if (session.name) setName(session.name)
    setPhone(session.phone)
    setClubPin('')
    setEntryStage('booking')
    window.dispatchEvent(new Event(CLUB_SESSION_CHANGE_EVENT))
  }

  function leaveClubSession() {
    window.sessionStorage.removeItem(CLUB_SESSION_KEY)
    setIsClubMember(false)
    setMemberName('')
    setMemberPhone('')
    setRecipientChoiceConfirmed(false)
    setClubPhone('')
    setClubPin('')
    reset()
    setName('')
    setPhone('')
    setEntryStage('question')
    window.dispatchEvent(new Event(CLUB_SESSION_CHANGE_EVENT))
  }

  function confirmBooking() {
    if (!name.trim() || !phone.trim()) return
    saveCustomerProfile(
      { name: name.trim(), phone: phone.trim() },
      !isClubMember || bookingRecipient === 'self',
    )
    setConfirmedWithClubCredit(usesClubCredit)

    if (usesClubCredit) {
      const nextRemainingCuts = Math.max(0, remainingCuts - 1)
      setRemainingCuts(nextRemainingCuts)

      try {
        const savedSession = window.sessionStorage.getItem(CLUB_SESSION_KEY)
        const session = savedSession ? (JSON.parse(savedSession) as ClubSession) : {}
        window.sessionStorage.setItem(
          CLUB_SESSION_KEY,
          JSON.stringify({ ...session, remainingCuts: nextRemainingCuts }),
        )
      } catch {
        // The booking remains valid even if this browser blocks session storage.
      }
    }

    setConfirmed(true)
  }

  function selectBookingRecipient(recipient: BookingRecipient) {
    setBookingRecipient(recipient)
    setRecipientChoiceConfirmed(true)
    if (recipient === 'self') {
      setName(memberName)
      setPhone(memberPhone)
      return
    }

    setName('')
    setPhone('')
  }

  if (entryStage === 'checking') {
    return (
      <div className="glass-panel flow-panel-enter rounded-lg border p-5 text-center sm:p-8" aria-busy="true">
        <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-secondary" />
        <p className="mt-4 text-sm text-muted-foreground">Preparando seu agendamento...</p>
      </div>
    )
  }

  if (entryStage === 'question') {
    return (
      <div className="glass-panel flow-panel-enter mx-auto max-w-2xl rounded-xl border p-4 text-center min-[360px]:p-5 sm:p-6 md:p-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-primary">
          <Crown className="h-5 w-5" aria-hidden="true" />
        </div>
        <p className="mt-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Antes de começar
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-foreground min-[360px]:text-3xl md:text-4xl">
          Você faz parte do Clube Mensal?
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Se você já é membro, entre para consultar seus cortes. Se ainda não é, pode agendar
          normalmente sem criar uma conta.
        </p>
        <div className="mt-6 grid gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-3">
          <Button
            type="button"
            onClick={() => setEntryStage('login')}
            className="h-12 rounded-sm uppercase tracking-wide"
          >
            <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
            Sim, sou do clube
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsClubMember(false)
              setEntryStage('booking')
            }}
            className="h-12 whitespace-normal rounded-sm border-border bg-transparent px-3 uppercase leading-tight tracking-wide hover:bg-secondary"
          >
            Não, continuar sem login
          </Button>
        </div>
      </div>
    )
  }

  if (entryStage === 'login') {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault()
          loginToClub()
        }}
        className="glass-panel flow-panel-enter mx-auto max-w-xl rounded-xl border p-4 min-[360px]:p-5 sm:p-6 md:p-10"
      >
        <button
          type="button"
          onClick={() => setEntryStage('question')}
          className="inline-flex items-center text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
          Voltar
        </button>
        <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-primary">
          <Crown className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="mt-5 font-display text-3xl font-bold uppercase tracking-tight text-foreground">
          Entrar no Clube
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Entre com seu telefone e PIN de 4 dígitos. Os dados lembrados são preenchidos separadamente.
        </p>
        <div className="mt-7 space-y-4">
          <div>
            <label htmlFor="club-phone" className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Telefone
            </label>
            <input
              id="club-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={clubPhone}
              onChange={(event) => setClubPhone(event.target.value)}
              placeholder="(11) 90000-0000"
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="club-pin" className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
              PIN de 4 dígitos
            </label>
            <input
              id="club-pin"
              type="password"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{4}"
              maxLength={4}
              value={clubPin}
              onChange={(event) => setClubPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-center font-display text-xl tracking-[0.5em] text-foreground outline-none transition-colors placeholder:tracking-[0.5em] placeholder:text-muted-foreground/60 focus:border-primary"
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={!clubPhone.trim() || clubPin.length !== 4}
          className="mt-6 h-12 w-full rounded-sm uppercase tracking-wide"
        >
          Entrar e continuar
        </Button>
      </form>
    )
  }

  if (confirmed && service && barber && selectedDay) {
    return (
      <div className="glass-panel flow-panel-enter rounded-lg border border-primary/30 p-4 text-center min-[360px]:p-5 sm:p-8 md:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <PartyPopper className="h-7 w-7" aria-hidden="true" />
        </div>
        <h3 className="mt-6 font-display text-2xl font-bold uppercase tracking-tight text-foreground min-[360px]:text-3xl">
          Agendamento confirmado
        </h3>
        <p className="mx-auto mt-3 max-w-sm break-words text-muted-foreground text-pretty">
          Pronto, {name.split(' ')[0] || 'chefe'}! Guardamos seu horário. Enviamos os detalhes por
          SMS para {phone || 'seu telefone'}.
        </p>

        <dl className="glass-inset mx-auto mt-8 grid max-w-sm gap-3 rounded-md border p-5 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Serviço</dt>
            <dd className="text-right font-medium text-foreground">{service.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Barbeiro</dt>
            <dd className="text-right font-medium text-foreground">{barber.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Data</dt>
            <dd className="text-right font-medium text-foreground">
              {weekdayNames[selectedDay.getDay()]}, {selectedDay.getDate()}{' '}
              {monthNames[selectedDay.getMonth()]} · {time}
            </dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3">
            <dt className="text-muted-foreground">Total</dt>
            <dd className="text-right font-display text-lg font-bold text-primary">
              {confirmedWithClubCredit ? 'Incluso no clube' : brl(service.price)}
            </dd>
          </div>
        </dl>

        {!isClubMember && (
          <section className="mx-auto mt-8 max-w-2xl rounded-lg border border-border bg-background/80 p-5 text-left md:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Clube Mensal
                </p>
                <h4 className="mt-1 font-display text-xl font-semibold uppercase text-foreground">
                  Seu cuidado garantido todo mês
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Escolha o plano que combina com a sua rotina.
                </p>
              </div>
            </div>

            <ul className="mt-5 grid gap-2 sm:grid-cols-3">
              {clubPlans.map((plan) => (
                <li key={plan.id} className="rounded-md border border-border bg-card p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{plan.name}</p>
                  <p className="mt-1 font-display text-xl font-bold text-foreground">
                    {brl(plan.price)}
                    <span className="ml-1 font-sans text-[10px] font-normal uppercase text-muted-foreground">
                      /mês
                    </span>
                  </p>
                  <p className="mt-2 text-xs font-medium text-primary">{plan.monthlyBenefit}</p>
                </li>
              ))}
            </ul>

            <a
              href="/clube"
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-sm border border-border bg-transparent px-4 text-sm font-medium uppercase tracking-wide text-foreground transition-colors hover:bg-secondary sm:w-auto"
            >
              Quero conhecer o clube
            </a>
          </section>
        )}

        <Button
          onClick={reset}
          variant="outline"
          className="mt-8 h-auto min-h-11 w-full whitespace-normal rounded-sm border-border bg-transparent py-2 uppercase leading-tight tracking-wide hover:bg-secondary sm:w-auto"
        >
          Fazer novo agendamento
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)] lg:items-start">
      {/* Main panel */}
      <div className="glass-panel flow-panel-enter min-w-0 rounded-lg border p-3.5 min-[360px]:p-4 sm:p-5 md:p-8">
        {isClubMember && (
          <div className="mb-5 rounded-lg border border-primary/25 bg-primary/10 p-3.5 sm:mb-6 sm:p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Crown className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Clube Mensal ativo
                  </p>
                  <p className="mt-0.5 font-medium text-foreground">
                    Você tem {remainingCuts} {remainingCuts === 1 ? 'corte restante' : 'cortes restantes'} neste mês.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={leaveClubSession}
                className="self-start text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground sm:self-auto"
              >
                Sair
              </button>
            </div>

            {!recipientChoiceConfirmed ? (
              <div className="mt-4 border-t border-primary/20 pt-4">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Para quem é o agendamento?
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {([
                    ['self', 'Para mim'],
                    ['other', 'Outra pessoa'],
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => selectBookingRecipient(value)}
                      className="min-h-11 rounded-md border border-border bg-background/70 px-3 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-secondary"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 border-t border-primary/20 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                      Agendamento
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {bookingRecipient === 'self' ? 'Para mim' : 'Para outra pessoa'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRecipientChoiceConfirmed(false)}
                    className="inline-flex min-h-10 items-center rounded-md border border-border bg-background/70 px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ChevronLeft className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    Voltar
                  </button>
                </div>

                {bookingRecipient === 'other' && (
                  <div className="mt-3 rounded-md border border-border bg-background/65 p-3">
                    <p className="text-xs font-medium leading-relaxed text-foreground">
                      Este agendamento é avulso e não gastará seu saldo mensal.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {(!isClubMember || recipientChoiceConfirmed) && (
          <>
          {/* Stepper */}
          <ol className="mb-6 flex items-center gap-1 sm:mb-8 sm:gap-2">
          {stepMeta.map((s, i) => {
            const Icon = s.icon
            const active = i === step
            const done = i < step
            return (
              <li key={s.label} className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs transition-colors min-[360px]:h-9 min-[360px]:w-9 min-[360px]:text-sm',
                    active && 'border-primary bg-primary text-primary-foreground',
                    done && 'border-primary/40 bg-primary/15 text-primary',
                    !active && !done && 'border-border bg-background text-muted-foreground',
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span
                  className={cn(
                    'hidden text-xs font-medium uppercase tracking-wide sm:inline',
                    active ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {s.label}
                </span>
                {i < stepMeta.length - 1 && (
                  <span
                    className={cn(
                      'h-px flex-1',
                      done ? 'bg-primary/40' : 'bg-border',
                    )}
                    aria-hidden="true"
                  />
                )}
              </li>
            )
          })}
        </ol>

        {/* Step 0: Service */}
        {step === 0 && (
          <div className="flow-step-enter grid gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3">
            {services.map((s) => {
              const selected = service?.id === s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setService(s)}
                  aria-pressed={selected}
                  className={cn(
                    'flex flex-col gap-1.5 rounded-md border p-3 text-left transition-colors sm:gap-2 sm:p-5',
                    selected
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background hover:border-primary/50',
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <span className="font-display text-base font-semibold uppercase tracking-wide text-foreground sm:text-lg">
                      {s.name}
                    </span>
                    <span className="font-display text-sm font-bold text-primary sm:text-base">{brl(s.price)}</span>
                  </div>
                  <span className="line-clamp-1 text-xs leading-snug text-muted-foreground sm:line-clamp-none sm:text-sm">{s.description}</span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground sm:mt-1 sm:text-xs">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {s.durationMin} min
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Step 1: Barber */}
        {step === 1 && (
          <div className="flow-step-enter">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Escolha quem vai cuidar do seu visual
            </p>
            <div className="grid gap-3 md:grid-cols-2">
            {barbers.map((b) => {
              const selected = barber?.id === b.id
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBarber(b)}
                  aria-pressed={selected}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg border p-3 text-left transition-all min-[360px]:gap-4',
                    selected
                      ? 'border-primary bg-primary/10 ring-1 ring-primary/20'
                      : 'border-border bg-background hover:border-primary/50 hover:bg-secondary',
                  )}
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted min-[360px]:h-16 min-[360px]:w-16">
                    <Image
                      src={b.image || '/placeholder.svg'}
                      alt={`Retrato de ${b.name}`}
                      fill
                      sizes="64px"
                      className="object-cover saturate-[1.05] transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-base font-semibold uppercase tracking-wide text-foreground">
                      {b.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{b.specialty}</p>
                  </div>
                  <span
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors',
                      selected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-transparent',
                    )}
                    aria-hidden="true"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </button>
              )
            })}
            </div>
          </div>
        )}

        {/* Step 2: Date & time */}
        {step === 2 && (
          <div className="flow-step-enter space-y-5 sm:space-y-6">
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Escolha o dia
                </p>
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground sm:hidden">
                  Deslize →
                </span>
              </div>
              <div
                onScroll={(event) =>
                  setDayScrollProgress(getHorizontalScrollProgress(event.currentTarget))
                }
                className="flex touch-pan-x snap-x snap-mandatory gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {days.map(({ iso, date }) => {
                  const selected = dateISO === iso
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => {
                        setDateISO(iso)
                        setTime('')
                      }}
                      aria-pressed={selected}
                      className={cn(
                        'flex min-w-[68px] shrink-0 snap-start flex-col items-center gap-1 rounded-md border px-3 py-3 transition-colors',
                        selected
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background hover:border-primary/50',
                      )}
                    >
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        {weekdayNames[date.getDay()]}
                      </span>
                      <span className="font-display text-xl font-bold text-foreground">
                        {date.getDate()}
                      </span>
                      <span className="text-xs uppercase text-muted-foreground">
                        {monthNames[date.getMonth()]}
                      </span>
                    </button>
                  )
                })}
              </div>
              <ScrollProgress value={dayScrollProgress} />
            </div>

            {dateISO && (
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Horários disponíveis
                  </p>
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground sm:hidden">
                    Deslize →
                  </span>
                </div>
                <div
                  onScroll={(event) =>
                    setTimeScrollProgress(getHorizontalScrollProgress(event.currentTarget))
                  }
                  className="flex touch-pan-x snap-x snap-mandatory gap-2 overflow-x-auto pb-3 [scrollbar-width:none] sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0 md:grid-cols-5 [&::-webkit-scrollbar]:hidden"
                >
                  {timeSlots.map((t) => {
                    const taken = barber ? isSlotTaken(barber.id, dateISO, t) : false
                    const selected = time === t
                    return (
                      <button
                        key={t}
                        type="button"
                        disabled={taken}
                        onClick={() => setTime(t)}
                        aria-pressed={selected}
                        className={cn(
                          'min-w-[76px] shrink-0 snap-start rounded-md border px-3 py-2.5 text-sm font-medium transition-colors sm:min-w-0',
                          taken &&
                            'cursor-not-allowed border-border/50 bg-background text-muted-foreground/40 line-through',
                          !taken &&
                            selected &&
                            'border-primary bg-primary text-primary-foreground',
                          !taken &&
                            !selected &&
                            'border-border bg-background text-foreground hover:border-primary/50',
                        )}
                      >
                        {t}
                      </button>
                    )
                  })}
                </div>
                <ScrollProgress value={timeScrollProgress} />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <div className="flow-step-enter space-y-4 sm:space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground"
              >
                {isClubMember && bookingRecipient === 'other'
                  ? 'Nome da outra pessoa'
                  : 'Nome completo'}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como devemos te chamar?"
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground"
              >
                {isClubMember && bookingRecipient === 'other'
                  ? 'Telefone da outra pessoa'
                  : 'Telefone / WhatsApp'}
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 90000-0000"
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
              />
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Ao confirmar, você concorda com a política de cancelamento: avise com no mínimo 2h de
              antecedência.
            </p>
          </div>
        )}

        {/* Nav buttons */}
        <div className="mt-8 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              if (step === 3) {
                setDayScrollProgress(0)
                setTimeScrollProgress(0)
              }
              setStep((s) => (s > 0 ? ((s - 1) as Step) : s))
            }}
            disabled={step === 0}
            className="h-11 w-full uppercase tracking-wide text-muted-foreground hover:text-foreground disabled:hidden sm:w-auto sm:disabled:inline-flex sm:disabled:opacity-0"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Voltar
          </Button>

          {step < 3 ? (
            <Button
              type="button"
              onClick={() => {
                if (!canNext) return
                if (step === 1) {
                  setDayScrollProgress(0)
                  setTimeScrollProgress(0)
                }
                setStep((s) => (s + 1) as Step)
              }}
              disabled={!canNext}
              className="h-11 w-full rounded-sm px-5 uppercase tracking-wide sm:w-auto sm:px-8"
            >
              Continuar
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={confirmBooking}
              disabled={!name || !phone}
              className="h-auto min-h-11 w-full whitespace-normal rounded-sm px-5 py-2 uppercase leading-tight tracking-wide sm:w-auto sm:px-8"
            >
              Confirmar agendamento
            </Button>
          )}
          </div>
          </>
        )}
      </div>

      {/* Summary sidebar */}
      <aside
        className={cn(
          'glass-panel h-fit rounded-lg border p-5 sm:p-6 lg:sticky lg:top-24',
          isClubMember && !recipientChoiceConfirmed && 'hidden',
        )}
      >
        <p className="text-xs font-medium uppercase tracking-widest text-primary">Resumo</p>
        <h3 className="mt-1 font-display text-2xl font-semibold uppercase tracking-wide text-foreground">
          Seu agendamento
        </h3>

        <dl className="mt-6 space-y-4 text-sm">
          {isClubMember && (
            <SummaryRow
              icon={User}
              label="Agendamento"
              value={bookingRecipient === 'self' ? 'Para mim' : 'Para outra pessoa'}
            />
          )}
          <SummaryRow icon={Scissors} label="Serviço" value={service?.name} extra={service ? brl(service.price) : undefined} />
          <SummaryRow icon={User} label="Barbeiro" value={barber?.name} />
          <SummaryRow
            icon={CalendarDays}
            label="Data & hora"
            value={
              selectedDay
                ? `${weekdayNames[selectedDay.getDay()]}, ${selectedDay.getDate()} ${monthNames[selectedDay.getMonth()]}${time ? ` · ${time}` : ''}`
                : undefined
            }
          />
        </dl>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          <span className="text-sm uppercase tracking-wide text-muted-foreground">Total</span>
          <span className="text-right font-display text-xl font-bold text-primary sm:text-2xl">
            {service ? (usesClubCredit ? 'Incluso no clube' : brl(service.price)) : '—'}
          </span>
        </div>
        {isClubMember && bookingRecipient === 'other' && service && (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Valor avulso. Seu saldo mensal não será alterado.
          </p>
        )}
        {service && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            Duração aproximada de {service.durationMin} min
          </p>
        )}
      </aside>
    </div>
  )
}

function ScrollProgress({ value }: { value: number }) {
  return (
    <div
      className="relative mt-1 h-1 overflow-hidden rounded-full bg-border sm:hidden"
      aria-hidden="true"
    >
      <span
        className="absolute inset-y-0 w-[35%] rounded-full bg-primary transition-[left] duration-150"
        style={{ left: `${value * 0.65}%` }}
      />
    </div>
  )
}

function SummaryRow({
  icon: Icon,
  label,
  value,
  extra,
}: {
  icon: React.ElementType
  label: string
  value?: string
  extra?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
        <dd className="break-words font-medium text-foreground">
          {value ?? <span className="text-muted-foreground/50">A escolher</span>}
          {extra && <span className="ml-2 text-primary">{extra}</span>}
        </dd>
      </div>
    </div>
  )
}
