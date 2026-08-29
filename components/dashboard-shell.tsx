'use client'

import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarCheck2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Crown,
  House,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  PencilLine,
  Plus,
  Search,
  Scissors,
  Sparkles,
  TrendingUp,
  UserRound,
  UsersRound,
  WalletCards,
} from 'lucide-react'

type View = 'inicio' | 'agenda' | 'servicos' | 'clientes' | 'financeiro' | 'equipe'
type Icon = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
type TeamMember = { id: string; name: string; email: string; image?: string; active: boolean; hasAccess: boolean; role: 'owner' | 'employee' }

const navItems: { id: View; label: string; shortLabel: string; icon: Icon }[] = [
  { id: 'inicio', label: 'Visão geral', shortLabel: 'Início', icon: LayoutDashboard },
  { id: 'agenda', label: 'Agenda', shortLabel: 'Agenda', icon: CalendarDays },
  { id: 'servicos', label: 'Serviços', shortLabel: 'Serviços', icon: Scissors },
  { id: 'clientes', label: 'Clientes', shortLabel: 'Clientes', icon: UsersRound },
  { id: 'financeiro', label: 'Financeiro', shortLabel: 'Financeiro', icon: WalletCards },
  { id: 'equipe', label: 'Equipe', shortLabel: 'Equipe', icon: UserRound },
]

const mobileNavItems: { id: View; label: string; icon: Icon; featured?: boolean }[] = [
  { id: 'inicio', label: 'Início', icon: House },
  { id: 'servicos', label: 'Serviços', icon: Scissors },
  { id: 'agenda', label: 'Agenda', icon: CalendarCheck2, featured: true },
  { id: 'clientes', label: 'Clientes', icon: UsersRound },
  { id: 'financeiro', label: 'Receita', icon: WalletCards },
]

const appointments = [
  { time: '09:00', client: 'Marcos Vinícius', service: 'Cabelo + barba', barber: 'Davi', status: 'Em breve' },
  { time: '10:20', client: 'Alexandre Lima', service: 'Corte executivo', barber: 'Diego', status: 'Confirmado' },
  { time: '12:00', client: 'Michael Torres', service: 'Degradê', barber: 'Rafael', status: 'Confirmado' },
  { time: '14:40', client: 'Bruno Tavares', service: 'Barba completa', barber: 'Davi', status: 'Aguardando' },
]

const services = [
  { name: 'Corte clássico', description: 'Corte completo com acabamento, lavagem e finalização.', price: 'R$ 55', duration: '40 min', active: true },
  { name: 'Cabelo e barba', description: 'Experiência completa com toalha quente e finalização.', price: 'R$ 90', duration: '70 min', active: true },
  { name: 'Barba premium', description: 'Desenho, navalha, toalha quente e hidratação.', price: 'R$ 45', duration: '30 min', active: true },
  { name: 'Platinado', description: 'Descoloração, matização e cuidados pós-química.', price: 'R$ 180', duration: '120 min', active: false },
]

const clients = [
  { name: 'Júlio Vance', initials: 'JV', visits: 18, last: '27 ago. 2026', tag: 'Clube', spend: 'R$ 1.420', club: true, plan: 'Clube Black', usage: 3, allowance: 4 },
  { name: 'Elvis Thales', initials: 'ET', visits: 12, last: '25 ago. 2026', tag: 'VIP', spend: 'R$ 980', club: false },
  { name: 'Marcus Reed', initials: 'MR', visits: 7, last: '22 ago. 2026', tag: 'Novo', spend: 'R$ 510', club: false },
  { name: 'Silas Mercer', initials: 'SM', visits: 15, last: '20 ago. 2026', tag: 'Clube', spend: 'R$ 1.180', club: true, plan: 'Clube Black', usage: 2, allowance: 4 },
  { name: 'Danilo Rocha', initials: 'DR', visits: 11, last: '18 ago. 2026', tag: 'Clube', spend: 'R$ 890', club: true, plan: 'Clube Essencial', usage: 2, allowance: 2 },
]

const barbers = [
  { name: 'Davi Oliveira', image: '/barber-marco.png', appointments: 63, revenue: 5670 },
  { name: 'Diego Santos', image: '/barber-diego.png', appointments: 58, revenue: 4930 },
  { name: 'Rafael Nunes', image: '/barber-rafael.png', appointments: 54, revenue: 4620 },
]

const defaultOwnerShareRates = Object.fromEntries(barbers.map((barber) => [barber.name, 10])) as Record<string, number>
const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

const initialTeam: TeamMember[] = barbers.map((barber, index) => ({
  id: `barber-${index + 1}`,
  name: barber.name,
  email: `${barber.name.toLowerCase().replace(' ', '.')}@negoblack.com`,
  image: barber.image,
  active: true,
  hasAccess: index < 2,
  role: index === 0 ? 'owner' : 'employee',
}))

function GlassCard({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <section className={`glass-panel rounded-2xl border ${className}`}>{children}</section>
}

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">{eyebrow}</p>
        <h2 className="mt-1 font-display text-lg font-semibold uppercase tracking-wide text-white min-[380px]:text-xl sm:text-2xl">{title}</h2>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

function MiniStat({ icon: Icon, label, value, detail, onClick }: { icon: Icon; label: string; value: string; detail: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Abrir ${label.toLowerCase()}`}
      className="glass-panel group relative w-full overflow-hidden rounded-2xl border p-3.5 text-left transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white/60 sm:p-5"
    >
      <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/[0.04] blur-2xl transition-colors group-hover:bg-white/[0.08]" />
      <div className="flex items-start justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
          <Icon className="h-4 w-4 text-white/80" aria-hidden={true} />
        </span>
        <ArrowUpRight className="h-4 w-4 text-white/25" aria-hidden="true" />
      </div>
      <p className="mt-4 min-h-7 text-[9px] font-medium uppercase leading-relaxed tracking-[0.14em] text-white/45 sm:mt-5 sm:min-h-0 sm:text-[10px]">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-white min-[380px]:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-emerald-300/80">{detail}</p>
    </button>
  )
}

function RevenueChart() {
  return (
    <div className="relative mt-5 h-36 w-full overflow-hidden sm:h-44" aria-label="Gráfico de faturamento dos últimos sete dias">
      <div className="absolute inset-0 flex flex-col justify-between py-2" aria-hidden="true">
        {[0, 1, 2, 3].map((line) => <span key={line} className="block border-t border-dashed border-white/[0.07]" />)}
      </div>
      <svg className="relative h-full w-full overflow-visible" viewBox="0 0 600 180" role="img" aria-label="Receita em crescimento ao longo da semana">
        <defs>
          <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 148 C55 140, 76 120, 122 128 S204 82, 258 100 S340 69, 382 77 S458 38, 510 48 S560 27, 600 19 L600 180 L0 180 Z" fill="url(#chart-fill)" />
        <path d="M0 148 C55 140, 76 120, 122 128 S204 82, 258 100 S340 69, 382 77 S458 38, 510 48 S560 27, 600 19" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="600" cy="19" r="5" fill="white" />
      </svg>
    </div>
  )
}

function Overview({ navigate }: { navigate: (view: View, agendaScope?: 'team' | 'mine') => void }) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <MiniStat icon={CalendarCheck2} label="Atendimentos da equipe" value="12" detail="Hoje · todos os barbeiros" onClick={() => navigate('agenda', 'team')} />
        <MiniStat icon={UserRound} label="Minha agenda hoje" value="2" detail="Próximo horário às 09:00" onClick={() => navigate('agenda', 'mine')} />
        <MiniStat icon={UsersRound} label="Clientes ativos" value="142" detail="+12 neste mês" onClick={() => navigate('clientes')} />
        <MiniStat icon={Sparkles} label="Ocupação da equipe" value="78%" detail="12 de 16 horários ocupados" onClick={() => navigate('agenda', 'team')} />
      </div>

      <GlassCard className="p-4 sm:p-6">
        <SectionHeading
          eyebrow="Movimento"
          title="Faturamento da semana"
          action={<span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-white/55">22–28 ago.</span>}
        />
        <div className="mt-5 flex items-end gap-3">
          <span className="font-display text-4xl font-semibold tracking-tight">R$ 4.250</span>
          <span className="mb-1.5 text-xs text-emerald-300">↗ 8,2%</span>
        </div>
        <RevenueChart />
        <div className="grid grid-cols-7 text-center text-[10px] uppercase tracking-wider text-white/35">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => <span key={day}>{day}</span>)}
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden p-4 sm:p-6">
        <SectionHeading
          eyebrow="Equipe"
          title="Desempenho dos barbeiros"
        />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {barbers.map((barber, index) => (
            <div key={barber.name} className="glass-card flex items-center gap-3 rounded-xl border p-3.5">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                <Image src={barber.image} alt="" fill sizes="44px" className="object-cover object-top" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{barber.name}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-white/35">{barber.appointments} atendimentos</p>
              </div>
              <span className="font-display text-lg text-white/20">0{index + 1}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]"><UsersRound className="h-4 w-4 text-white/70" aria-hidden="true" /></span>
            <div className="min-w-0"><p className="text-xs font-semibold">Funcionários e acessos</p><p className="mt-0.5 text-[10px] leading-relaxed text-white/35">Cadastre barbeiros, edite nomes e defina o dono.</p></div>
          </div>
          <button type="button" onClick={() => navigate('equipe')} className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 text-[10px] font-semibold uppercase tracking-wider text-black shadow-lg shadow-black/30 transition-transform active:scale-[0.98] sm:w-auto">
            Gerenciar equipe <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </GlassCard>
    </div>
  )
}

function Schedule({ scope, onScopeChange }: { scope: 'team' | 'mine'; onScopeChange: (scope: 'team' | 'mine') => void }) {
  const [selectedDay, setSelectedDay] = useState('28')
  const days = [
    { week: 'SEG', day: '24' }, { week: 'TER', day: '25' }, { week: 'QUA', day: '26' },
    { week: 'QUI', day: '27' }, { week: 'SEX', day: '28' }, { week: 'SÁB', day: '29' },
  ]
  const appointmentsByDay: Record<string, typeof appointments> = {
    '24': [
      { time: '09:20', client: 'Gustavo Moraes', service: 'Corte clássico', barber: 'Davi', status: 'Confirmado' },
      { time: '11:00', client: 'Henrique Dias', service: 'Barba premium', barber: 'Diego', status: 'Confirmado' },
      { time: '15:30', client: 'Caio Ferreira', service: 'Cabelo + barba', barber: 'Rafael', status: 'Aguardando' },
    ],
    '25': [
      { time: '08:40', client: 'Lucas Ribeiro', service: 'Corte executivo', barber: 'Diego', status: 'Confirmado' },
      { time: '10:30', client: 'Eduardo Melo', service: 'Degradê', barber: 'Davi', status: 'Confirmado' },
      { time: '14:20', client: 'Pedro Augusto', service: 'Cabelo + barba', barber: 'Rafael', status: 'Aguardando' },
      { time: '17:00', client: 'João Victor', service: 'Barba completa', barber: 'Davi', status: 'Confirmado' },
    ],
    '26': [
      { time: '09:00', client: 'Samuel Costa', service: 'Corte clássico', barber: 'Rafael', status: 'Confirmado' },
      { time: '12:10', client: 'Igor Almeida', service: 'Cabelo + barba', barber: 'Davi', status: 'Aguardando' },
      { time: '16:40', client: 'Leandro Silva', service: 'Corte executivo', barber: 'Diego', status: 'Confirmado' },
    ],
    '27': [
      { time: '08:30', client: 'Thiago Martins', service: 'Degradê', barber: 'Davi', status: 'Confirmado' },
      { time: '10:10', client: 'Ruan Oliveira', service: 'Corte clássico', barber: 'Rafael', status: 'Confirmado' },
      { time: '13:50', client: 'André Lopes', service: 'Barba premium', barber: 'Diego', status: 'Aguardando' },
      { time: '18:00', client: 'Felipe Rocha', service: 'Cabelo + barba', barber: 'Davi', status: 'Confirmado' },
    ],
    '28': appointments,
    '29': [
      { time: '08:00', client: 'Daniel Souza', service: 'Cabelo + barba', barber: 'Davi', status: 'Confirmado' },
      { time: '09:40', client: 'Vitor Hugo', service: 'Corte clássico', barber: 'Diego', status: 'Confirmado' },
      { time: '11:20', client: 'Arthur Lima', service: 'Degradê', barber: 'Rafael', status: 'Aguardando' },
      { time: '14:00', client: 'Matheus Reis', service: 'Barba completa', barber: 'Davi', status: 'Confirmado' },
    ],
  }
  const selectedDate = days.find((day) => day.day === selectedDay) ?? days[4]
  const selectedAppointments = appointmentsByDay[selectedDay] ?? []
  const visibleAppointments = scope === 'mine' ? selectedAppointments.filter((appointment) => appointment.barber === 'Davi') : selectedAppointments
  const filledSlots = visibleAppointments.length
  const totalSlots = scope === 'mine' ? 6 : 16

  return (
    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <GlassCard className="min-w-0 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow={`${selectedDate.week} · ${selectedDate.day} de agosto`} title={scope === 'mine' ? 'Minha agenda' : 'Agenda da equipe'} />
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold uppercase tracking-wider text-black transition-transform hover:-translate-y-0.5">
            <Plus className="h-4 w-4" aria-hidden="true" /> Novo agendamento
          </button>
        </div>
        <div className="mt-5 inline-grid min-h-11 w-full grid-cols-2 rounded-xl border border-white/10 bg-black/25 p-1 sm:w-auto sm:min-w-72">
          <button type="button" onClick={() => onScopeChange('team')} className={`rounded-lg px-3 text-[10px] font-semibold uppercase tracking-wider transition-colors ${scope === 'team' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>Agenda geral</button>
          <button type="button" onClick={() => onScopeChange('mine')} className={`rounded-lg px-3 text-[10px] font-semibold uppercase tracking-wider transition-colors ${scope === 'mine' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>Minha agenda</button>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {days.map((item) => (
            <button type="button" key={item.day} onClick={() => setSelectedDay(item.day)} aria-pressed={selectedDay === item.day} className={`min-w-0 rounded-xl border px-1 py-3 text-center transition-colors ${selectedDay === item.day ? 'border-white bg-white text-black' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.08]'}`}>
              <span className={`block text-[9px] font-semibold tracking-widest ${selectedDay === item.day ? 'text-black/50' : 'text-white/35'}`}>{item.week}</span>
              <span className="mt-1 block font-display text-xl font-semibold">{item.day}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 space-y-2.5">
          {visibleAppointments.map((appointment, index) => (
            <article key={appointment.time} className="glass-card group flex min-w-0 items-center gap-3 rounded-xl border p-3.5 transition-colors hover:bg-white/[0.08] sm:gap-5 sm:p-4">
              <div className="w-14 shrink-0 text-center sm:w-16">
                <p className="font-display text-xl font-semibold">{appointment.time}</p>
                <p className="text-[9px] uppercase tracking-wider text-white/35">{index % 2 ? '70 min' : '40 min'}</p>
              </div>
              <div className="h-10 w-px shrink-0 bg-white/10" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold sm:text-base">{appointment.client}</p>
                <p className="mt-0.5 truncate text-xs text-white/40">{appointment.service} · {appointment.barber}</p>
              </div>
              <span className={`hidden rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider sm:inline ${appointment.status === 'Em breve' ? 'border-white bg-white text-black' : 'border-white/10 text-white/45'}`}>{appointment.status}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-white/25 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </article>
          ))}
          {visibleAppointments.length === 0 && <div className="rounded-xl border border-dashed border-white/10 py-12 text-center"><CalendarDays className="mx-auto h-5 w-5 text-white/25" aria-hidden="true" /><p className="mt-3 text-sm text-white/40">Nenhum horário marcado para este dia.</p></div>}
        </div>
      </GlassCard>

      <div className="min-w-0 space-y-5">
        <GlassCard className="p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Resumo do dia</p>
          <p className="mt-3 font-display text-4xl font-semibold">{filledSlots} <span className="text-lg text-white/30">/ {totalSlots}</span></p>
          <p className="mt-1 text-xs text-white/45">horários preenchidos</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-white" style={{ width: `${filledSlots / totalSlots * 100}%` }} /></div>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">{scope === 'mine' ? 'Meu expediente' : 'Disponibilidade'}</p>
          <div className="mt-4 space-y-4">
            {(scope === 'mine' ? barbers.filter((barber) => barber.name === 'Davi Oliveira') : barbers).map((barber, index) => (
              <div key={barber.name} className="flex items-center gap-3">
                <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-black/30"><Image src={barber.image} alt="" fill sizes="36px" className="object-cover object-top" /></div>
                <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{barber.name}</p><p className="text-[10px] text-white/35">{5 - index} horários livres</p></div>
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

function Services() {
  const [filter, setFilter] = useState<'todos' | 'ativos'>('todos')
  const visible = filter === 'todos' ? services : services.filter((service) => service.active)
  return (
    <GlassCard className="p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow={`${services.length} serviços cadastrados`} title="Gestão de serviços" />
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold uppercase tracking-wider text-black"><Plus className="h-4 w-4" /> Novo serviço</button>
      </div>
      <div className="mt-6 flex gap-2 border-b border-white/10">
        {(['todos', 'ativos'] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={`border-b-2 px-1 pb-3 text-[10px] font-semibold uppercase tracking-wider ${filter === item ? 'border-white text-white' : 'border-transparent text-white/35'}`}>{item}</button>)}
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {visible.map((service) => (
          <article key={service.name} className="glass-card flex flex-col rounded-xl border p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div><p className="font-display text-lg font-semibold uppercase tracking-wide">{service.name}</p><p className="mt-2 max-w-md text-xs leading-relaxed text-white/40">{service.description}</p></div>
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${service.active ? 'bg-emerald-300' : 'bg-white/20'}`} />
            </div>
            <div className="mt-5 flex items-end justify-between border-t border-white/[0.08] pt-4">
              <div><p className="font-display text-xl font-semibold">{service.price}</p><p className="text-[10px] uppercase tracking-wider text-white/35">{service.duration}</p></div>
              <button aria-label={`Editar ${service.name}`} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/60 hover:text-white"><PencilLine className="h-3.5 w-3.5" /></button>
            </div>
          </article>
        ))}
      </div>
    </GlassCard>
  )
}

function Clients() {
  const [query, setQuery] = useState('')
  const [segment, setSegment] = useState<'todos' | 'clube'>('todos')
  const clubMembers = clients.filter((client) => client.club)
  const filtered = useMemo(
    () => clients.filter((client) => {
      const matchesSegment = segment === 'todos' || client.club
      const matchesQuery = client.name.toLowerCase().includes(query.toLowerCase())
      return matchesSegment && matchesQuery
    }),
    [query, segment],
  )

  return (
    <GlassCard className="p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow="Relacionamento" title={segment === 'clube' ? 'Clientes do clube' : 'Lista de clientes'} />
        {segment === 'clube' && <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold uppercase tracking-wider text-black"><Plus className="h-4 w-4" /> Adicionar cliente ao clube</button>}
      </div>

      <div className="dashboard-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0">
        <div className="glass-inset min-w-[74vw] snap-start rounded-xl border p-4 sm:min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">Membros ativos</p>
            <Crown className="h-3.5 w-3.5 text-white/45" aria-hidden="true" />
          </div>
          <p className="mt-3 font-display text-3xl font-semibold">{clubMembers.length}</p>
          <p className="mt-0.5 text-[10px] text-emerald-300/75">Todos em dia</p>
        </div>
        <div className="glass-inset min-w-[74vw] snap-start rounded-xl border p-4 sm:min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">Receita recorrente</p>
          <p className="mt-3 font-display text-3xl font-semibold">R$ 497</p>
          <p className="mt-0.5 text-[10px] text-white/35">por mês</p>
        </div>
        <div className="glass-inset min-w-[74vw] snap-start rounded-xl border p-4 sm:min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">Uso dos benefícios</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="font-display text-3xl font-semibold">7 <span className="text-lg text-white/25">/ 10</span></p>
            <span className="mb-1 text-[10px] text-white/35">70%</span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[70%] rounded-full bg-white" /></div>
        </div>
      </div>

      <div className="mt-6 flex border-b border-white/10">
        <button onClick={() => setSegment('todos')} className={`relative min-h-11 px-4 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${segment === 'todos' ? 'text-white' : 'text-white/35 hover:text-white/65'}`}>
          Todos <span className="ml-1.5 text-white/25">{clients.length}</span>
          {segment === 'todos' && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-white" />}
        </button>
        <button onClick={() => setSegment('clube')} className={`relative flex min-h-11 items-center gap-2 px-4 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${segment === 'clube' ? 'text-white' : 'text-white/35 hover:text-white/65'}`}>
          <Crown className="h-3.5 w-3.5" aria-hidden="true" /> Clube <span className="text-white/25">{clubMembers.length}</span>
          {segment === 'clube' && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-white" />}
        </button>
      </div>

      <label className="mt-6 flex min-h-12 items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 focus-within:border-white/30">
        <Search className="h-4 w-4 text-white/35" aria-hidden="true" />
        <span className="sr-only">Buscar clientes</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={segment === 'clube' ? 'Buscar membro do clube...' : 'Buscar cliente por nome...'} className="w-full bg-transparent text-sm outline-none placeholder:text-white/25" />
      </label>
      <div className="mt-5 space-y-2.5">
        {filtered.map((client) => (
          <article key={client.name} className="glass-card group rounded-xl border p-3.5 sm:p-4">
            <div className="flex items-center gap-3">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border font-display text-sm font-semibold ${client.club ? 'border-white/20 bg-white text-black' : 'border-white/10 bg-white/[0.05] text-white/70'}`}>{client.club ? <Crown className="h-4 w-4" aria-label="Membro do clube" /> : client.initials}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><p className="truncate text-sm font-semibold">{client.name}</p>{client.club && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" title="Assinatura ativa" />}</div>
                <p className="mt-0.5 truncate text-[10px] uppercase tracking-wider text-white/35">{segment === 'clube' ? client.plan : `Última visita · ${client.last}`}</p>
              </div>
              {segment === 'todos' && <div className="hidden text-right sm:block"><p className="text-xs font-medium">{client.visits} visitas</p><p className="text-[10px] text-white/35">{client.spend} consumidos</p></div>}
              {segment === 'todos' && <span className="hidden rounded-full border border-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white/50 sm:inline">{client.tag}</span>}
              <button type="button" aria-label={`Abrir opções de ${client.name}`} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white/35 transition-colors hover:bg-white/[0.06] hover:text-white"><MoreHorizontal className="h-4 w-4" aria-hidden="true" /></button>
            </div>

            {segment === 'clube' && client.club ? (
              <div className="mt-4 border-t border-white/[0.08] pt-4">
                <div className="max-w-md">
                  <div className="flex items-center justify-between text-[10px]"><span className="text-white/35">Uso no mês</span><span className="font-medium">{client.usage}/{client.allowance}</span></div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-white" style={{ width: `${((client.usage ?? 0) / (client.allowance ?? 1)) * 100}%` }} /></div>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-3 sm:hidden">
                <div><p className="text-xs font-medium">{client.visits} visitas</p><p className="text-[10px] text-white/35">{client.spend} consumidos</p></div>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white/50">{client.tag}</span>
              </div>
            )}
          </article>
        ))}
        {filtered.length === 0 && <p className="py-12 text-center text-sm text-white/40">Nenhum cliente encontrado.</p>}
      </div>
    </GlassCard>
  )
}

function Finance({
  ownerShareRates,
  onOwnerShareRateChange,
}: {
  ownerShareRates: Record<string, number>
  onOwnerShareRateChange: (barberName: string, rate: number) => void
}) {
  const grossRevenue = barbers.reduce((total, barber) => total + barber.revenue, 0)
  const totalEmployeePayments = barbers.reduce(
    (total, barber) => barber.name === 'Davi Oliveira'
      ? total
      : total + barber.revenue * (100 - (ownerShareRates[barber.name] ?? 0)) / 100,
    0,
  )

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <GlassCard className="p-4 sm:p-6">
          <SectionHeading eyebrow="Faturamento total · agosto" title={currencyFormatter.format(grossRevenue)} action={<TrendingUp className="h-5 w-5 text-emerald-300" />} />
          <RevenueChart />
          <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-5 text-center">
            <div><p className="font-display text-xl font-semibold">{currencyFormatter.format(Math.round(grossRevenue / 175))}</p><p className="text-[9px] uppercase tracking-wider text-white/35">Ticket médio</p></div>
            <div><p className="font-display text-xl font-semibold">175</p><p className="text-[9px] uppercase tracking-wider text-white/35">Atendimentos</p></div>
            <div><p className="font-display text-xl font-semibold">+12%</p><p className="text-[9px] uppercase tracking-wider text-white/35">Crescimento</p></div>
          </div>
        </GlassCard>
        <GlassCard className="p-4 sm:p-6">
          <SectionHeading eyebrow="Fechamento" title="Pagamento da equipe" />
          <div className="mt-6"><p className="font-display text-4xl font-semibold">{currencyFormatter.format(totalEmployeePayments)}</p><p className="mt-1 text-xs text-white/40">Total a pagar aos funcionários</p></div>
          <div className="mt-6 flex justify-between border-t border-white/10 pt-4 text-sm"><span className="text-white/40">Faturamento total</span><span className="font-semibold">{currencyFormatter.format(grossRevenue)}</span></div>
        </GlassCard>
      </div>
      <GlassCard className="overflow-hidden p-4 sm:p-6">
        <SectionHeading eyebrow="Agosto 2026" title="Repasse por barbeiro" action={<button className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-wider text-white/45">Exportar</button>} />
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/40">A porcentagem define quanto o dono recebe sobre o faturamento de cada funcionário. O restante é o valor pago ao barbeiro.</p>
        <div className="mt-5 divide-y divide-white/[0.08]">
          {barbers.map((barber) => {
            const isOwner = barber.name === 'Davi Oliveira'
            const ownerShareRate = ownerShareRates[barber.name] ?? 0
            const ownerShare = barber.revenue * ownerShareRate / 100
            const employeePayment = barber.revenue - ownerShare

            return (
              <article key={barber.name} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_100px_130px_130px] sm:gap-5">
                <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-white/10 bg-black/30"><Image src={barber.image} alt="" fill sizes="44px" className="object-cover object-top" /></div>
                <div className="min-w-0"><p className="truncate text-sm font-semibold">{barber.name}</p><p className="text-[10px] uppercase tracking-wider text-white/35">{barber.appointments} atendimentos <span className="sm:hidden">· {currencyFormatter.format(barber.revenue)} faturados</span></p></div>
                <div className="hidden sm:block"><p className="text-xs">{currencyFormatter.format(barber.revenue)}</p><p className="text-[9px] uppercase tracking-wider text-white/30">Faturado</p></div>
                <div className="col-span-2 grid grid-cols-2 gap-3 sm:contents">
                  {isOwner ? (
                    <div className="flex min-h-14 items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 sm:min-h-11"><span className="text-[9px] font-semibold uppercase tracking-wider text-white/35">Perfil</span><span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-black">Dono</span></div>
                  ) : (
                    <label className="flex min-h-14 items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 sm:min-h-11">
                      <span><span className="block text-[9px] font-semibold uppercase tracking-wider text-white/35">Parte do dono</span><span className="mt-0.5 block text-[8px] text-white/25">{currencyFormatter.format(ownerShare)}</span></span>
                      <span className="flex items-center gap-0.5"><input type="number" min="0" max="100" step="1" inputMode="decimal" value={ownerShareRate} onFocus={(event) => event.currentTarget.select()} onChange={(event) => onOwnerShareRateChange(barber.name, Math.min(100, Math.max(0, Number(event.target.value))))} aria-label={`Percentual do dono sobre ${barber.name}`} className="w-10 bg-transparent text-right font-display text-lg font-semibold outline-none" /><span className="text-xs text-white/40">%</span></span>
                    </label>
                  )}
                  <div className="flex min-h-14 flex-col justify-center rounded-xl border border-white/10 bg-white/[0.04] px-3 text-right sm:min-h-11 sm:border-transparent sm:bg-transparent sm:px-0">
                    <p className="font-display text-lg font-semibold">{currencyFormatter.format(isOwner ? barber.revenue : employeePayment)}</p>
                    <p className="text-[9px] uppercase tracking-wider text-white/30">{isOwner ? 'Faturamento próprio' : 'A pagar ao funcionário'}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}

function Team() {
  const [members, setMembers] = useState(initialTeam)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const addMember = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!newName.trim() || !newEmail.trim()) return

    setMembers((current) => [...current, {
      id: `barber-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      active: true,
      hasAccess: false,
      role: 'employee',
    }])
    setNewName('')
    setNewEmail('')
    setShowAddForm(false)
  }

  const saveName = (memberId: string) => {
    if (editingName.trim()) {
      setMembers((current) => current.map((member) => member.id === memberId ? { ...member, name: editingName.trim() } : member))
    }
    setEditingId(null)
  }

  return (
    <div className="space-y-5">
      <GlassCard className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Gestão de funcionários" title="Equipe da barbearia" />
          <button type="button" onClick={() => setShowAddForm((visible) => !visible)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold uppercase tracking-wider text-black">
            <Plus className="h-4 w-4" aria-hidden="true" /> Adicionar barbeiro
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="glass-inset rounded-xl border p-3"><p className="font-display text-2xl font-semibold">{members.length}</p><p className="text-[9px] uppercase tracking-wider text-white/35">Funcionários</p></div>
          <div className="glass-inset rounded-xl border p-3"><p className="font-display text-2xl font-semibold">{members.filter((member) => member.active).length}</p><p className="text-[9px] uppercase tracking-wider text-white/35">Ativos</p></div>
          <div className="glass-inset rounded-xl border p-3"><p className="font-display text-2xl font-semibold">{members.filter((member) => member.hasAccess).length}</p><p className="text-[9px] uppercase tracking-wider text-white/35">Com acesso</p></div>
          <div className="glass-inset rounded-xl border p-3"><p className="font-display text-2xl font-semibold">{members.filter((member) => member.role === 'owner').length}</p><p className="text-[9px] uppercase tracking-wider text-white/35">Dono</p></div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/15 bg-white/[0.07] p-4"><div className="flex items-center gap-2"><Crown className="h-4 w-4 text-white/70" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-wider">Acesso do dono</p></div><p className="mt-2 text-xs leading-relaxed text-white/40">Dashboard completo, financeiro, clientes, equipe e agenda de todos os barbeiros.</p></div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4"><div className="flex items-center gap-2"><UserRound className="h-4 w-4 text-white/50" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-wider">Acesso do funcionário</p></div><p className="mt-2 text-xs leading-relaxed text-white/40">Somente a própria agenda e o valor que receberá no período.</p></div>
        </div>

        {showAddForm && (
          <form onSubmit={addMember} className="glass-card mt-5 grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <label className="block"><span className="text-[9px] font-semibold uppercase tracking-wider text-white/40">Nome do barbeiro</span><input required value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="Ex.: Lucas Almeida" className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-sm outline-none focus:border-white/30" /></label>
            <label className="block"><span className="text-[9px] font-semibold uppercase tracking-wider text-white/40">E-mail de acesso</span><input required type="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} placeholder="lucas@negoblack.com" className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-sm outline-none focus:border-white/30" /></label>
            <button type="submit" className="min-h-11 rounded-xl bg-white px-4 text-xs font-semibold uppercase tracking-wider text-black">Adicionar</button>
          </form>
        )}
      </GlassCard>

      <GlassCard className="overflow-hidden p-4 sm:p-6">
        <SectionHeading eyebrow="Cadastro e acesso" title="Funcionários" action={<span className="rounded-full border border-white/10 px-3 py-1.5 text-[9px] uppercase tracking-wider text-white/40">Protótipo</span>} />
        <div className="mt-5 divide-y divide-white/[0.08]">
          {members.map((member) => (
            <article key={member.id} className="py-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.05]">
                  {member.image ? <Image src={member.image} alt="" fill sizes="44px" className="object-cover object-top" /> : <UserRound className="h-4 w-4 text-white/55" aria-hidden="true" />}
                </div>
                <div className="min-w-0 flex-1">
                  {editingId === member.id ? (
                    <input autoFocus value={editingName} onChange={(event) => setEditingName(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && saveName(member.id)} className="min-h-10 w-full rounded-lg border border-white/15 bg-black/30 px-3 text-sm outline-none" />
                  ) : <p className="truncate text-sm font-semibold">{member.name}</p>}
                  <p className="mt-0.5 truncate text-[10px] text-white/35">{member.email} · <span className={member.role === 'owner' ? 'text-white/70' : ''}>{member.role === 'owner' ? 'Dono' : 'Funcionário'}</span></p>
                </div>
                <div className="hidden items-center gap-2 sm:flex"><span className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider ${member.role === 'owner' ? 'border-white/25 bg-white text-black' : 'border-white/10 text-white/40'}`}>{member.role === 'owner' ? 'Dono' : 'Funcionário'}</span><span className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider ${member.hasAccess ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-300' : 'border-white/10 text-white/35'}`}>{member.hasAccess ? 'Acesso ativo' : 'Sem acesso'}</span></div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
                {editingId === member.id ? (
                  <button type="button" onClick={() => saveName(member.id)} className="min-h-11 rounded-xl border border-white/15 bg-white/[0.06] px-3 text-[10px] font-semibold uppercase tracking-wider">Salvar nome</button>
                ) : (
                  <button type="button" onClick={() => { setEditingId(member.id); setEditingName(member.name) }} className="min-h-11 rounded-xl border border-white/10 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/55 transition-colors hover:text-white"><PencilLine className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" />Editar nome</button>
                )}
                <button type="button" onClick={() => setMembers((current) => current.map((item) => item.id === member.id ? { ...item, hasAccess: true } : item))} className="min-h-11 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-[10px] font-semibold uppercase tracking-wider text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white">{member.hasAccess ? 'Reenviar acesso' : 'Criar acesso'}</button>
                <button type="button" disabled={member.role === 'owner'} onClick={() => setMembers((current) => current.map((item) => ({ ...item, role: item.id === member.id ? 'owner' : 'employee', hasAccess: item.id === member.id ? true : item.hasAccess })))} className={`col-span-2 min-h-11 rounded-xl border px-3 text-[10px] font-semibold uppercase tracking-wider sm:col-auto ${member.role === 'owner' ? 'cursor-default border-white bg-white text-black' : 'border-white/10 text-white/55 transition-colors hover:border-white/25 hover:text-white'}`}><Crown className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" />{member.role === 'owner' ? 'Dono atual' : 'Definir como dono'}</button>
              </div>
            </article>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">Portal do funcionário</p><p className="mt-1 font-display text-xl font-semibold uppercase">Veja a experiência do barbeiro</p><p className="mt-1 text-xs text-white/40">Demonstração do login e da agenda individual.</p></div>
        <Link href="/funcionario" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold uppercase tracking-wider text-black">Abrir protótipo <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
      </GlassCard>
    </div>
  )
}

function MobileBottomNav({ view, navigate }: { view: View; navigate: (view: View) => void }) {
  return (
    <footer className="dashboard-mobile-nav-shell">
      <nav className="dashboard-bottom-nav" aria-label="Navegação principal">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          const isActive = view === item.id
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => {
                window.navigator.vibrate?.(8)
                navigate(item.id)
              }}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.featured ? 'Agenda, 12 agendamentos hoje' : item.label}
              className={`dashboard-nav-item flex touch-manipulation flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${item.featured
                ? `dashboard-nav-item--featured relative -mt-1.5 rounded-[1.1rem] border border-white/90 bg-white text-black shadow-[0_8px_22px_rgb(0_0_0/0.55)] ${isActive ? 'shadow-[0_8px_26px_rgb(0_0_0/0.72)]' : ''}`
                : `rounded-xl ${isActive ? 'bg-white/[0.09] text-white' : 'text-white/45 active:bg-white/[0.06]'}`
              }`}
            >
              <span className="relative">
                <Icon className="h-4 w-4" aria-hidden={true} />
                {item.featured && (
                  <span className="absolute -right-3 -top-2.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-black px-0.5 text-[7px] font-bold text-white ring-1 ring-white" aria-hidden="true">12</span>
                )}
              </span>
              <span className="max-w-full truncate px-0.5 text-[7px] font-semibold uppercase tracking-[0.08em] min-[360px]:text-[8px]">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </footer>
  )
}

export function DashboardShell() {
  const [view, setView] = useState<View>('inicio')
  const [agendaScope, setAgendaScope] = useState<'team' | 'mine'>('team')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [ownerShareRates, setOwnerShareRates] = useState(defaultOwnerShareRates)
  const [ownerShareRatesReady, setOwnerShareRatesReady] = useState(false)
  const shellRef = useRef<HTMLElement>(null)
  const current = navItems.find((item) => item.id === view) ?? navItems[0]
  const CurrentIcon = current.icon

  useEffect(() => {
    let animationFrame = 0

    const syncViewportHeight = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(() => {
        const visualViewportHeight = window.visualViewport?.height
        const viewportHeight = visualViewportHeight && visualViewportHeight >= 240
          ? visualViewportHeight
          : window.innerHeight

        if (viewportHeight >= 240) {
          shellRef.current?.style.setProperty('--dashboard-viewport-height', `${viewportHeight}px`)
        }
      })
    }

    syncViewportHeight()
    window.addEventListener('resize', syncViewportHeight)
    window.addEventListener('orientationchange', syncViewportHeight)
    window.visualViewport?.addEventListener('resize', syncViewportHeight)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', syncViewportHeight)
      window.removeEventListener('orientationchange', syncViewportHeight)
      window.visualViewport?.removeEventListener('resize', syncViewportHeight)
    }
  }, [])

  useEffect(() => {
    try {
      const storedRates = window.localStorage.getItem('dashboard-owner-share-rates')
      if (storedRates) {
        const parsedRates = JSON.parse(storedRates) as Record<string, unknown>
        setOwnerShareRates(Object.fromEntries(barbers.map((barber) => {
          const storedRate = Number(parsedRates[barber.name])
          return [barber.name, Number.isFinite(storedRate) ? Math.min(100, Math.max(0, storedRate)) : 10]
        })))
      }
    } catch {
      // Mantém as porcentagens padrão quando o armazenamento do navegador está indisponível.
    } finally {
      setOwnerShareRatesReady(true)
    }
  }, [])

  useEffect(() => {
    if (!ownerShareRatesReady) return

    try {
      window.localStorage.setItem('dashboard-owner-share-rates', JSON.stringify(ownerShareRates))
    } catch {
      // A edição continua funcionando durante a sessão mesmo sem armazenamento local.
    }
  }, [ownerShareRates, ownerShareRatesReady])

  useEffect(() => {
    const syncViewFromUrl = () => {
      const requestedView = window.location.hash.slice(1) as View
      setView(navItems.some((item) => item.id === requestedView) ? requestedView : 'inicio')
    }

    syncViewFromUrl()
    window.addEventListener('popstate', syncViewFromUrl)
    return () => window.removeEventListener('popstate', syncViewFromUrl)
  }, [])

  const navigate = (nextView: View, nextAgendaScope: 'team' | 'mine' = 'team') => {
    if (nextView === 'agenda') setAgendaScope(nextAgendaScope)
    if (nextView !== view) {
      setView(nextView)
      window.history.pushState({ view: nextView }, '', `#${nextView}`)
    }
    document.querySelector<HTMLElement>('.dashboard-mobile-content')?.scrollTo({ top: 0, behavior: 'smooth' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main ref={shellRef} className="dashboard-background dashboard-shell text-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-black/55 p-4 backdrop-blur-2xl lg:flex">
        <Link href="/" className="flex h-16 items-center gap-3 px-2" aria-label="Voltar para o site Nego Black">
          <span className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/15"><Image src="/negoblack-logo-black.jpg" alt="Logo Nego Black" fill sizes="40px" className="object-cover" /></span>
          <div><p className="font-display text-lg font-semibold uppercase tracking-[0.14em]">Nego Black</p><p className="text-[9px] uppercase tracking-[0.25em] text-white/35">Painel de gestão</p></div>
        </Link>
        <nav className="mt-8 space-y-1.5" aria-label="Navegação da dashboard">
          {navItems.map((item) => {
            const Icon = item.icon
            return <button type="button" key={item.id} onClick={() => navigate(item.id)} aria-current={view === item.id ? 'page' : undefined} className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-sm transition-all ${view === item.id ? 'bg-white text-black shadow-lg shadow-black/20' : 'text-white/45 hover:bg-white/[0.06] hover:text-white'}`}><Icon className="h-4 w-4" aria-hidden={true} /><span className="font-medium">{item.label}</span>{view === item.id && <ChevronRight className="ml-auto h-4 w-4" />}</button>
          })}
        </nav>
        <div className="mt-auto glass-card rounded-xl border p-3">
          <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black"><UserRound className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Davi Oliveira</p><p className="text-[9px] uppercase tracking-wider text-white/35">Administrador</p></div><LogOut className="h-4 w-4 text-white/30" /></div>
        </div>
      </aside>

      <div className="dashboard-mobile-frame min-w-0 lg:ml-64">
        <div className="dashboard-mobile-content min-w-0">
          <header className="dashboard-mobile-header sticky top-0 z-30 border-b border-white/10 bg-black/45 backdrop-blur-2xl">
          <div className="relative mx-auto flex min-h-16 max-w-[1500px] items-center justify-between px-3.5 py-2 sm:min-h-20 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-2.5 lg:hidden">
              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/15"><Image src="/negoblack-logo-black.jpg" alt="Logo Nego Black" fill sizes="36px" className="object-cover" /></span>
              <div className="min-w-0"><p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/35">Painel de gestão</p><p className="mt-0.5 flex items-center gap-1.5 truncate font-display text-sm font-semibold uppercase tracking-[0.12em]"><CurrentIcon className="h-3.5 w-3.5 shrink-0" aria-hidden={true} /> {current.shortLabel}</p></div>
            </div>
            <div className="hidden lg:block"><p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/35">Painel administrativo</p><p className="mt-1 text-sm font-medium">{current.label}</p></div>
            <div className="ml-auto flex items-center gap-2">
              <button type="button" onClick={() => setNotificationsOpen((open) => !open)} aria-label="Abrir notificações" aria-expanded={notificationsOpen} aria-controls="dashboard-notifications" className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50 transition-colors hover:text-white"><Bell className="h-4 w-4" aria-hidden="true" /><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-white ring-2 ring-black" /></button>
              <div className="ml-1 hidden h-10 items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 sm:flex"><span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-black"><UserRound className="h-3 w-3" /></span><span className="text-xs font-medium">Davi</span></div>
            </div>
            {notificationsOpen && (
              <div id="dashboard-notifications" className="glass-panel absolute right-3.5 top-[calc(100%+0.5rem)] z-50 w-[min(calc(100vw-1.75rem),22rem)] rounded-2xl border p-3 shadow-2xl shadow-black/60 sm:right-6 lg:right-8">
                <div className="flex items-center justify-between px-1 pb-3"><div><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">Notificações</p><p className="mt-0.5 text-sm font-semibold">Atualizações recentes</p></div><span className="rounded-full bg-white px-2 py-1 text-[8px] font-bold text-black">2 novas</span></div>
                <button type="button" onClick={() => { setNotificationsOpen(false); navigate('agenda') }} className="flex min-h-16 w-full items-center gap-3 rounded-xl bg-white/[0.07] p-3 text-left transition-colors hover:bg-white/[0.11]"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-black"><CalendarCheck2 className="h-4 w-4" aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="block text-xs font-semibold">Novo agendamento</span><span className="mt-0.5 block truncate text-[10px] text-white/40">Alexandre marcou às 10:20 com Diego.</span></span><ChevronRight className="h-4 w-4 text-white/25" aria-hidden="true" /></button>
                <button type="button" onClick={() => { setNotificationsOpen(false); navigate('agenda') }} className="mt-1 flex min-h-14 w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-white/[0.06]"><span className="h-2 w-2 shrink-0 rounded-full bg-emerald-300" /><span className="min-w-0 flex-1"><span className="block text-xs font-medium">Horário confirmado</span><span className="mt-0.5 block truncate text-[10px] text-white/35">Michael confirmou o atendimento das 12:00.</span></span></button>
                <p className="px-2 pt-3 text-center text-[9px] text-white/25">Demonstração visual das notificações.</p>
              </div>
            )}
          </div>
          </header>

          <div className="mx-auto w-full min-w-0 max-w-[1500px] px-3.5 py-5 min-[390px]:px-4 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="mb-5 sm:mb-8">
            <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 sm:text-[10px] sm:tracking-[0.2em]"><span className="h-px w-5 bg-white/30 sm:w-6" /><span className="sm:hidden">Hoje · 28 de agosto</span><span className="hidden sm:inline">Sexta-feira, 28 de agosto</span></div>
            <h1 className="mt-3 font-display text-[1.75rem] font-semibold uppercase leading-none tracking-tight min-[380px]:text-3xl sm:text-5xl">{view === 'inicio' ? <>Bom dia, <span className="text-white/45">Davi.</span></> : current.label}</h1>
            <p className="mt-2.5 max-w-xl text-xs leading-relaxed text-white/40 sm:mt-3 sm:text-sm">{view === 'inicio' ? 'Aqui está o resumo do movimento da barbearia hoje.' : `Gerencie ${current.label.toLowerCase()} com uma visão simples e completa.`}</p>
          </div>
          <div key={view} className="dashboard-view-transition min-w-0">
            {view === 'inicio' && <Overview navigate={navigate} />}
            {view === 'agenda' && <Schedule scope={agendaScope} onScopeChange={setAgendaScope} />}
            {view === 'servicos' && <Services />}
            {view === 'clientes' && <Clients />}
            {view === 'financeiro' && (
              <Finance
                ownerShareRates={ownerShareRates}
                onOwnerShareRateChange={(barberName, rate) => setOwnerShareRates((currentRates) => ({
                  ...currentRates,
                  [barberName]: rate,
                }))}
              />
            )}
            {view === 'equipe' && <Team />}
          </div>
          </div>
        </div>

        <MobileBottomNav view={view} navigate={navigate} />
      </div>
    </main>
  )
}
