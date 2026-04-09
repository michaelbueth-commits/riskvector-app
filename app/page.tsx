import { Metadata } from 'next'
import Dashboard from './components/DashboardClient'

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: 'RiskVector - Global Emergency Intelligence',
  description: 'Real-time risk monitoring platform for travelers and organizations',
}

export default function Home() {
  return <Dashboard />
}
