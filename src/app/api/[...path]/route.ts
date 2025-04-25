import { NextRequest, NextResponse } from 'next/server'
import apiConfig from '@/config/apiConfig'

export const dynamic = 'force-dynamic' // 禁用路由缓存

// 获取API基础URL，移除末尾的斜杠
const API_BASE_URL = apiConfig.baseUrl.endsWith('/') 
  ? apiConfig.baseUrl.slice(0, -1) 
  : apiConfig.baseUrl

// 处理路径的辅助函数
function processPath(pathname: string): string {
  // 移除开头的 /api
  let targetPath = pathname.replace(/^\/api/, '')

  // 如果路径为空，设置为根路径
  if (!targetPath) {
    targetPath = '/'
  }

  return targetPath
}

export async function GET(request: NextRequest) {
  console.log('=== API Route GET triggered ===')
  console.log(`Current environment: ${apiConfig.currentEnv}, API base URL: ${API_BASE_URL}`)
  const pathname = request.nextUrl.pathname
  console.log('Pathname:', pathname)

  const targetPath = processPath(pathname)
  // 使用配置的API基础URL
  const targetUrl = `${API_BASE_URL}${targetPath}`

  console.log('Forwarding to:', targetUrl)
  console.log('Request headers:', Object.fromEntries(request.headers))

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Backend response status:', response.status)
    const data = await response.json()
    console.log('Backend response data:', data)

    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error: any) {
    console.error('Proxy error:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch data', details: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
}

export async function POST(request: NextRequest) {
  console.log('=== API Route POST triggered ===')
  console.log(`Current environment: ${apiConfig.currentEnv}, API base URL: ${API_BASE_URL}`)
  const pathname = request.nextUrl.pathname
  console.log('Pathname:', pathname)

  const targetPath = processPath(pathname)
  // 使用配置的API基础URL
  const targetUrl = `${API_BASE_URL}${targetPath}`

  console.log('Forwarding to:', targetUrl)

  try {
    const body = await request.json()
    console.log('Request body:', body)

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.log('Backend response status:', response.status)
    const data = await response.json()
    console.log('Backend response data:', data)

    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error: any) {
    console.error('Proxy error:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch data', details: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
}

// 添加 OPTIONS 处理
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
export const runtime = 'edge';