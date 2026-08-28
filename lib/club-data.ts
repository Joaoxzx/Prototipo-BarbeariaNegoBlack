export type ClubPlan = {
  id: string
  name: string
  price: number
  monthlyBenefit: string
  description: string
}

export const clubPlans: ClubPlan[] = [
  {
    id: 'club-cabelo',
    name: 'Cabelo',
    price: 110,
    monthlyBenefit: '4 cortes por mês',
    description: 'Quatro cortes completos para manter o visual sempre alinhado.',
  },
  {
    id: 'club-combo',
    name: 'Cabelo e barba',
    price: 165,
    monthlyBenefit: '4 combos por mês',
    description: 'Quatro atendimentos completos de cabelo e barba todos os meses.',
  },
  {
    id: 'club-barba',
    name: 'Barba',
    price: 95,
    monthlyBenefit: '4 barbas por mês',
    description: 'Quatro cuidados de barba com acabamento e finalização.',
  },
]
