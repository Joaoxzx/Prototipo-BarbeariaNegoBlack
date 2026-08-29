'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Bell, CalendarCheck2, ChevronRight, Clock3, LogOut, Scissors, UserRound } from 'lucide-react'

const employeeAppointments = [
  { time: '08:30', client: 'André Martins', service: 'Corte clássico', duration: '40 min', status: 'Concluído' },
  { time: '10:20', client: 'Alexandre Lima', service: 'Corte executivo', duration: '50 min', status: 'Próximo' },
  { time: '13:30', client: 'Felipe Souza', service: 'Cabelo e barba', duration: '70 min', status: 'Confirmado' },
  { time: '16:10', client: 'Renato Alves', service: 'Barba premium', duration: '30 min', status: 'Confirmado' },
]

const employeeRevenue = 4930
const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

export function EmployeePortal() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [ownerShareRate, setOwnerShareRate] = useState(10)

  useEffect(() => {
    try {
      const storedRates = window.localStorage.getItem('dashboard-owner-share-rates')
      if (!storedRates) return
      const parsedRates = JSON.parse(storedRates) as Record<string, unknown>
      const diegoRate = Number(parsedRates['Diego Santos'])
      if (Number.isFinite(diegoRate)) setOwnerShareRate(Math.min(100, Math.max(0, diegoRate)))
    } catch {
      // O protótipo usa 10% para o dono quando não há uma configuração salva.
    }
  }, [])

  const enterPortal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoggedIn(true)
  }

  if (!loggedIn) {
    return (
      <main className="employee-portal-shell dashboard-background flex min-h-dvh items-center justify-center px-4 py-8 text-white">
        <div className="relative z-10 w-full max-w-sm">
          <Link href="/dashboard#equipe" className="mb-5 inline-flex min-h-11 items-center gap-2 text-xs font-medium text-white/45 transition-colors hover:text-white"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voltar para a equipe</Link>
          <section className="glass-panel rounded-3xl border p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/15"><Image src="/negoblack-logo-black.jpg" alt="Logo Nego Black" fill sizes="48px" className="object-cover" /></span>
              <div><p className="font-display text-lg font-semibold uppercase tracking-[0.12em]">Nego Black</p><p className="text-[9px] uppercase tracking-[0.22em] text-white/35">Portal do funcionário</p></div>
            </div>

            <div className="mt-8">
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-white/45">Protótipo</span>
              <h1 className="mt-4 font-display text-3xl font-semibold uppercase leading-tight">Acesse sua agenda</h1>
              <p className="mt-2 text-xs leading-relaxed text-white/40">Entre para visualizar somente os horários reservados para você.</p>
            </div>

            <form onSubmit={enterPortal} className="mt-7 space-y-4">
              <label className="block"><span className="text-[9px] font-semibold uppercase tracking-wider text-white/40">E-mail</span><input required type="email" defaultValue="diego.santos@negoblack.com" className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/35 px-3 text-sm outline-none transition-colors focus:border-white/30" /></label>
              <label className="block"><span className="text-[9px] font-semibold uppercase tracking-wider text-white/40">Senha</span><input required type="password" defaultValue="123456" className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/35 px-3 text-sm outline-none transition-colors focus:border-white/30" /></label>
              <button type="submit" className="min-h-12 w-full rounded-xl bg-white text-xs font-semibold uppercase tracking-wider text-black transition-transform active:scale-[0.98]">Entrar na agenda</button>
            </form>
            <p className="mt-4 text-center text-[10px] leading-relaxed text-white/25">Tela demonstrativa. Nenhuma credencial real é armazenada.</p>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="employee-portal-shell dashboard-background min-h-dvh overflow-x-clip text-white">
      <div className="relative z-10 min-w-0">
        <header className="employee-portal-header sticky top-0 z-30 border-b border-white/10 bg-black/65 backdrop-blur-2xl">
          <div className="mx-auto flex min-h-16 min-w-0 max-w-3xl items-center gap-3 px-4">
            <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-white/15"><Image src="/barber-diego.png" alt="Diego Santos" fill sizes="36px" className="object-cover object-top" /></span>
            <div className="min-w-0"><p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/35">Minha agenda</p><p className="truncate text-sm font-semibold">Diego Santos</p></div>
            <button type="button" aria-label="Notificações" className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50"><Bell className="h-4 w-4" /></button>
            <button type="button" onClick={() => setLoggedIn(false)} aria-label="Sair" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50"><LogOut className="h-4 w-4" /></button>
          </div>
        </header>

        <div className="mx-auto w-full min-w-0 max-w-3xl px-4 py-6 sm:py-8">
          <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="min-w-0"><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">Sexta-feira · 28 de agosto</p><h1 className="mt-2 font-display text-3xl font-semibold uppercase">Bom dia, Diego.</h1><p className="mt-2 text-xs text-white/40">Confira seus atendimentos de hoje.</p></div>
            <span className="rounded-full border border-white/10 px-3 py-1.5 text-[9px] uppercase tracking-wider text-white/40">Protótipo</span>
          </div>

          <section className="glass-panel mt-6 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border p-4 text-center">
            <div><CalendarCheck2 className="mx-auto h-4 w-4 text-white/45" /><p className="mt-2 font-display text-2xl font-semibold">4</p><p className="text-[8px] uppercase tracking-wider text-white/30">Horários</p></div>
            <div><Clock3 className="mx-auto h-4 w-4 text-white/45" /><p className="mt-2 font-display text-2xl font-semibold">3h10</p><p className="text-[8px] uppercase tracking-wider text-white/30">Reservadas</p></div>
            <div><UserRound className="mx-auto h-4 w-4 text-white/45" /><p className="mt-2 font-display text-2xl font-semibold">3</p><p className="text-[8px] uppercase tracking-wider text-white/30">Restantes</p></div>
          </section>

          <section className="glass-panel relative mt-4 overflow-hidden rounded-2xl border p-4 sm:p-5">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-300/10 blur-3xl" />
            <div className="relative flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0"><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">Seus ganhos · agosto</p><p className="mt-2 font-display text-3xl font-semibold">{currencyFormatter.format(employeeRevenue * (100 - ownerShareRate) / 100)}</p><p className="mt-1 text-xs text-emerald-300/75">Você recebe {100 - ownerShareRate}% · {ownerShareRate}% fica para o dono</p></div>
              <div className="shrink-0 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-left sm:text-right"><p className="text-[8px] uppercase tracking-wider text-white/30">Previsão</p><p className="mt-1 text-xs font-semibold">Fim do mês</p></div>
            </div>
          </section>

          <section className="mt-7">
            <div className="flex items-center justify-between"><div><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">Agenda individual</p><h2 className="mt-1 font-display text-xl font-semibold uppercase">Atendimentos do dia</h2></div><Scissors className="h-5 w-5 text-white/25" /></div>
            <div className="mt-4 space-y-3">
              {employeeAppointments.map((appointment) => (
                <article key={appointment.time} className="glass-card flex min-w-0 items-center gap-3 rounded-2xl border p-3.5">
                  <div className="w-14 shrink-0 text-center"><p className="font-display text-xl font-semibold">{appointment.time}</p><p className="text-[8px] uppercase tracking-wider text-white/30">{appointment.duration}</p></div>
                  <div className="h-10 w-px shrink-0 bg-white/10" />
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{appointment.client}</p><p className="mt-0.5 truncate text-xs text-white/40">{appointment.service}</p></div>
                  <div className="shrink-0 text-right"><span className={`hidden rounded-full border px-2 py-1 text-[8px] font-semibold uppercase tracking-wider min-[390px]:inline ${appointment.status === 'Próximo' ? 'border-white bg-white text-black' : 'border-white/10 text-white/40'}`}>{appointment.status}</span><ChevronRight className="ml-auto mt-2 h-4 w-4 text-white/25" /></div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
