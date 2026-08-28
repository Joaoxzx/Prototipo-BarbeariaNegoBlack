export type Service = {
  id: string
  name: string
  description: string
  durationMin: number
  price: number
}

export type Barber = {
  id: string
  name: string
  role: string
  image: string
  specialty: string
}

export const services: Service[] = [
  {
    id: 'corte',
    name: 'Cabelo',
    description: 'Corte na tesoura ou máquina, com acabamento e finalização.',
    durationMin: 40,
    price: 55,
  },
  {
    id: 'combo',
    name: 'Cabelo e barba',
    description: 'Corte completo e barba alinhada no mesmo atendimento.',
    durationMin: 70,
    price: 90,
  },
  {
    id: 'barba',
    name: 'Só barba',
    description: 'Barba desenhada com toalha quente, navalha e finalização.',
    durationMin: 30,
    price: 45,
  },
]

export const barbers: Barber[] = [
  {
    id: 'marco',
    name: 'Marco Vieira',
    role: 'Barbeiro Master',
    image: '/barber-marco.png',
    specialty: 'Degradês e cortes clássicos',
  },
  {
    id: 'diego',
    name: 'Diego Santos',
    role: 'Barbeiro Sênior',
    image: '/barber-diego.png',
    specialty: 'Cortes modernos e freestyle',
  },
  {
    id: 'rafael',
    name: 'Rafael Nunes',
    role: 'Mestre Navalha',
    image: '/barber-rafael.png',
    specialty: 'Barba e navalhado tradicional',
  },
]

export const timeSlots: string[] = [
  '09:00',
  '09:40',
  '10:20',
  '11:00',
  '11:40',
  '13:00',
  '13:40',
  '14:20',
  '15:00',
  '15:40',
  '16:20',
  '17:00',
  '17:40',
  '18:20',
]

// Deterministic pseudo-unavailability so the UI feels alive without a backend.
export function isSlotTaken(barberId: string, dateISO: string, time: string): boolean {
  const key = `${barberId}-${dateISO}-${time}`
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % 10 < 3
}

export const brl = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
