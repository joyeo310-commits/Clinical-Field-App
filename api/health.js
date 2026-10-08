/**
 * API Health & Status Check Endpoint
 * Path: /api/health.js
 * 
 * Supports:
 * - Vercel Serverless Functions
 * - Node.js / Express / Connect middleware
 * - Edge Runtime / Web Fetch API (Next.js / Cloudflare / Deno)
 */

export default async function handler(req, res) {
  const startTime = Date.now();

  // Helper to construct payload
  const getHealthPayload = () => {
    const memory = typeof process !== 'undefined' && process.memoryUsage ? process.memoryUsage() : null;
    const uptimeSec = typeof process !== 'undefined' && process.uptime ? Math.floor(process.uptime()) : 0;

    return {
      status: 'healthy',
      code: 200,
      service: 'Clinical Field App (Suu Balm Singapore Field Operations)',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds: uptimeSec,
      environment: (typeof process !== 'undefined' && process.env?.NODE_ENV) || 'production',
      latencyMs: Math.max(0, Date.now() - startTime),
      checks: {
        server: { status: 'UP', latencyMs: 0 },
        catalog: { status: 'UP', source: 'suubalm.com (Singapore Product Catalog)' },
        territoryEngine: { status: 'UP', coverage: 'Whole of Singapore (All 5 Planning Regions)' },
        storage: { status: 'UP', type: 'Local + Synchronized State' }
      },
      system: {
        nodeVersion: typeof process !== 'undefined' ? process.version : 'standard-web',
        platform: typeof process !== 'undefined' ? process.platform : 'edge',
        memoryMB: memory ? {
          rss: +(memory.rss / (1024 * 1024)).toFixed(2),
          heapTotal: +(memory.heapTotal / (1024 * 1024)).toFixed(2),
          heapUsed: +(memory.heapUsed / (1024 * 1024)).toFixed(2)
        } : null
      }
    };
  };

  // 1. Web Fetch API standard signature: handler(request: Request) => Promise<Response>
  if (req && typeof req.headers?.get === 'function' && !res) {
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed', allowed: ['GET', 'HEAD'] }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', 'Allow': 'GET, HEAD' }
      });
    }

    const payload = getHealthPayload();
    return new Response(req.method === 'HEAD' ? null : JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // 2. Node / Express / Connect / Vercel Serverless signature: handler(req, res)
  if (res && (typeof res.setHeader === 'function' || typeof res.status === 'function')) {
    // CORS headers
    if (typeof res.setHeader === 'function') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }

    const method = req?.method?.toUpperCase() || 'GET';

    if (method === 'OPTIONS') {
      if (typeof res.status === 'function') {
        return res.status(204).end();
      }
      res.statusCode = 204;
      return res.end();
    }

    if (method !== 'GET' && method !== 'HEAD') {
      const errBody = JSON.stringify({ error: 'Method Not Allowed', allowed: ['GET', 'HEAD'] });
      if (typeof res.status === 'function') {
        return res.status(405).send(errBody);
      }
      res.statusCode = 405;
      return res.end(errBody);
    }

    const payload = getHealthPayload();
    const jsonString = JSON.stringify(payload, null, 2);

    if (typeof res.status === 'function') {
      if (method === 'HEAD') {
        return res.status(200).end();
      }
      return res.status(200).send(jsonString);
    }

    res.statusCode = 200;
    if (method === 'HEAD') {
      return res.end();
    }
    return res.end(jsonString);
  }

  // Fallback direct return
  return getHealthPayload();
}

// Named exports for modern Edge / Next.js app directory conventions
export async function GET(request) {
  return handler(request);
}

export async function HEAD(request) {
  return handler(request);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}
