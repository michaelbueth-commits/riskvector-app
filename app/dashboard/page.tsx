import { EnhancedAlertFeed } from '@/components/EnhancedAlertFeed'
import { enhancedAlertService } from '@/lib/enhancedAlertService'

// Force dynamic rendering and no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function Dashboard() {
  // Fetch data directly on the server
  const alerts = await enhancedAlertService.getAllAlerts()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Global Risk Dashboard</h1>
      
      {/* The component will now receive data directly */}
      <EnhancedAlertFeed alerts={alerts} />
    </div>
  )
}

export default Dashboard