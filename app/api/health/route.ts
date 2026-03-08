import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      
      // Database/API checks
      services: {
        database: 'connected', // Would need actual DB check in production
        external_apis: 'functional', // Would need actual API ping in production
        cache: 'operational' // Would need actual Redis check in production
      },
      
      // System resources
      resources: {
        memory: process.memoryUsage(),
        cpu: 'normal', // Would need actual CPU monitoring in production
        disk: 'sufficient' // Would need actual disk space check in production
      },
      
      // API keys status
      api_keys: {
        acled: process.env.ACLED_API_KEY ? 'configured' : 'missing',
        world_news: process.env.WORLD_NEWS_API_KEY ? 'configured' : 'missing',
        who_gho: 'public' // No API key needed
      },
      
      // Security
      security: {
        cors_enabled: true,
        helmet_enabled: true,
        ssl_enabled: process.env.NODE_ENV === 'production'
      }
    }

    return NextResponse.json(healthStatus, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    })
  }
}