import type { Metadata } from 'next'
import { EmployeePortal } from '@/components/employee-portal'

export const metadata: Metadata = {
  title: 'Portal do funcionário | Nego Black',
  description: 'Protótipo da agenda individual dos funcionários da Nego Black.',
}

export default function EmployeePage() {
  return <EmployeePortal />
}
