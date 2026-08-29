import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard-shell'

export const metadata: Metadata = {
  title: 'Painel de gestão | Nego Black',
  description: 'Agenda, clientes, serviços e financeiro da barbearia Nego Black.',
}

export default function DashboardPage() {
  return <DashboardShell />
}
