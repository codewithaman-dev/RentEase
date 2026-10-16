// Routes /api/* requests to the existing Vercel-style handlers under /api,
// which were previously only reachable through the Vite dev-server middleware
// (vite.config.ts) and had no equivalent in production, so every /api/*
// request there fell through to the SPA redirect instead of returning JSON.
import products from '../../api/products.js'
import productDetail from '../../api/product-detail.js'
import categories from '../../api/categories.js'
import serviceAreas from '../../api/service-areas.js'
import serviceAreasCheck from '../../api/service-areas/check.js'
import rentals from '../../api/rentals.js'
import rentalsReturn from '../../api/rentals/return.js'
import rentalsExtend from '../../api/rentals/extend.js'
import checkout from '../../api/checkout.js'
import cart from '../../api/cart.js'
import reviews from '../../api/reviews.js'
import tickets from '../../api/tickets.js'
import maintenance from '../../api/maintenance.js'
import relocations from '../../api/relocations.js'
import stats from '../../api/stats.js'
import authLogin from '../../api/auth/login.js'
import authRegister from '../../api/auth/register.js'
import authMe from '../../api/auth/me.js'
import adminProducts from '../../api/admin/products.js'
import adminRentals from '../../api/admin/rentals.js'
import adminUsers from '../../api/admin/users.js'
import adminMaintenance from '../../api/admin/maintenance.js'
import adminDisputes from '../../api/admin/disputes.js'
import adminReports from '../../api/admin/reports.js'
import adminServiceAreas from '../../api/admin/service-areas.js'
import vendorProducts from '../../api/vendor/products.js'
import vendorRentals from '../../api/vendor/rentals.js'
import vendorMaintenance from '../../api/vendor/maintenance.js'
import vendorReturns from '../../api/vendor/returns.js'

type NodeHandler = (req: NodeRequest, res: NodeResponse) => Promise<unknown>

interface NodeRequest {
  method: string
  query: Record<string, string>
  headers: Record<string, string>
  body: unknown
}

interface NodeResponse {
  setHeader(name: string, value: string): NodeResponse
  status(code: number): NodeResponse
  json(data: unknown): NodeResponse
  end(data?: unknown): NodeResponse
}

const routes: Record<string, NodeHandler> = {
  '/api/products': products,
  '/api/product-detail': productDetail,
  '/api/categories': categories,
  '/api/service-areas': serviceAreas,
  '/api/service-areas/check': serviceAreasCheck,
  '/api/rentals': rentals,
  '/api/rentals/return': rentalsReturn,
  '/api/rentals/extend': rentalsExtend,
  '/api/checkout': checkout,
  '/api/cart': cart,
  '/api/reviews': reviews,
  '/api/tickets': tickets,
  '/api/maintenance': maintenance,
  '/api/relocations': relocations,
  '/api/stats': stats,
  '/api/auth/login': authLogin,
  '/api/auth/register': authRegister,
  '/api/auth/me': authMe,
  '/api/admin/products': adminProducts,
  '/api/admin/rentals': adminRentals,
  '/api/admin/users': adminUsers,
  '/api/admin/maintenance': adminMaintenance,
  '/api/admin/disputes': adminDisputes,
  '/api/admin/reports': adminReports,
  '/api/admin/service-areas': adminServiceAreas,
  '/api/vendor/products': vendorProducts,
  '/api/vendor/rentals': vendorRentals,
  '/api/vendor/maintenance': vendorMaintenance,
  '/api/vendor/returns': vendorReturns,
}

export default async (req: Request) => {
  const url = new URL(req.url)
  const pathname = url.pathname.replace(/\/+$/, '') || '/'
  const handler = routes[pathname]

  if (!handler) {
    return Response.json({ success: false, error: 'Not found' }, { status: 404 })
  }

  const query = Object.fromEntries(url.searchParams.entries())
  const headers = Object.fromEntries(req.headers.entries())

  let body: unknown = undefined
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    try {
      body = await req.json()
    } catch {
      body = {}
    }
  }

  const nodeReq: NodeRequest = { method: req.method, query, headers, body }

  let statusCode = 200
  const resHeaders: Record<string, string> = {}
  let responseBody: unknown
  let bodyIsRaw = false
  let hasBody = false

  const nodeRes: NodeResponse = {
    setHeader(name, value) {
      resHeaders[name] = value
      return nodeRes
    },
    status(code) {
      statusCode = code
      return nodeRes
    },
    json(data) {
      responseBody = data
      hasBody = true
      return nodeRes
    },
    end(data) {
      if (data !== undefined) {
        responseBody = data
        bodyIsRaw = true
      }
      hasBody = true
      return nodeRes
    },
  }

  await handler(nodeReq, nodeRes)

  if (hasBody && !bodyIsRaw && !('content-type' in Object.fromEntries(Object.entries(resHeaders).map(([k, v]) => [k.toLowerCase(), v])))) {
    resHeaders['Content-Type'] = 'application/json'
  }

  const payload = !hasBody ? null : bodyIsRaw ? (responseBody as string) : JSON.stringify(responseBody)

  return new Response(payload, { status: statusCode, headers: resHeaders })
}

export const config = {
  path: '/api/*',
}
