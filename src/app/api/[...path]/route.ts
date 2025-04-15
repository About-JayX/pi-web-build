import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // 禁用路由缓存

export async function GET(request: NextRequest) {
  console.log('=== API Route GET triggered ===')
  const pathname = request.nextUrl.pathname
  console.log('Pathname:', pathname)

  // 移除 /api 前缀
  const targetUrl = `https://fairmint.piweb3.xyz${targetPath}`

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
  } catch (error) {
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
  const pathname = request.nextUrl.pathname
  console.log('Pathname:', pathname)

  // 移除 /api 前缀
  const targetUrl = `https://fairmint.piweb3.xyz${targetPath}`

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
  } catch (error) {
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
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
