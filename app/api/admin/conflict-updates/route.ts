import { NextResponse } from 'next/server'
import { conflictUpdateScheduler, ConflictZoneUpdate } from '@/lib/conflictUpdateScheduler'

// GET /api/admin/conflict-updates - Get pending conflict updates
export async function GET() {
  try {
    const pendingUpdates = conflictUpdateScheduler.getPendingUpdates()
    const status = conflictUpdateScheduler.getStatus()
    
    return NextResponse.json({
      success: true,
      data: {
        pendingUpdates,
        updateHistory: status.updateHistory,
        lastUpdate: status.lastUpdate,
        schedulerStatus: status,
        summary: {
          pendingCount: pendingUpdates.length,
          criticalPending: pendingUpdates.filter(u => u.newSeverity === 'critical').length,
          highPending: pendingUpdates.filter(u => u.newSeverity === 'high').length,
          mediumPending: pendingUpdates.filter(u => u.newSeverity === 'medium').length
        }
      }
    })
  } catch (error) {
    console.error('Failed to fetch conflict updates:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conflict updates' },
      { status: 500 }
    )
  }
}

// POST /api/admin/conflict-updates/approve - Approve a conflict update
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { country, approvedBy } = body
    
    if (!country || !approvedBy) {
      return NextResponse.json(
        { success: false, error: 'Missing country or approvedBy' },
        { status: 400 }
      )
    }
    
    const update = conflictUpdateScheduler.approveUpdate(country, approvedBy)
    
    if (!update) {
      return NextResponse.json(
        { success: false, error: 'Update not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        message: `Conflict update for ${update.country} approved`,
        update
      }
    })
  } catch (error) {
    console.error('Failed to approve conflict update:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to approve conflict update' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/conflict-updates/reject - Reject a conflict update
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { country, reason } = body
    
    if (!country || !reason) {
      return NextResponse.json(
        { success: false, error: 'Missing country or reason' },
        { status: 400 }
      )
    }
    
    const update = conflictUpdateScheduler.rejectUpdate(country, reason)
    
    if (!update) {
      return NextResponse.json(
        { success: false, error: 'Update not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        message: `Conflict update for ${update.country} rejected`,
        update
      }
    })
  } catch (error) {
    console.error('Failed to reject conflict update:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reject conflict update' },
      { status: 500 }
    )
  }
}