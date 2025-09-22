'use client'

import { useEffect, useState } from 'react'

type Tenant = { id: string; name: string }

interface TenantInfoPanelBugProps {
  orgId: string
  token: string
}

export default function TenantInfoPanelBug({ orgId, token }: TenantInfoPanelBugProps) {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [requestCount, setRequestCount] = useState(0)

  // ❌ BUG: "options" is a fresh object on every render.
  // Adding it to deps guarantees the effect re-runs even if orgId/token didn't change.
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Request-Source': 'dashboard'
    }
  }

  useEffect(() => {
    let cancelled = false

    const go = async () => {
      setRequestCount(prev => prev + 1)

      try {
        const res = await fetch('/api/tenant', options)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = (await res.json()) as Tenant
        if (!cancelled) {
          setTenant(data)
          setError(null)
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? 'Network error')
        }
      }
    }

    go()

    // Effect runs again because 'options' identity keeps changing → more requests.
    return () => {
      cancelled = true
    }
  }, [orgId, options]) // ⚠️ 'options' is always "new"

  return (
    <section className="border-2 border-red-300 p-4 rounded-lg bg-red-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-red-800">Tenant Info (BUG)</h3>
        <div className="text-sm font-mono bg-red-200 px-2 py-1 rounded">
          Requests: {requestCount}
        </div>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded text-red-700">
          Error: {error}
        </div>
      )}

      {tenant ? (
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
          {JSON.stringify(tenant, null, 2)}
        </pre>
      ) : (
        <p className="text-gray-600">Loading…</p>
      )}

      <div className="mt-3 text-xs text-red-600">
        ⚠️ This component has an unstable dependency causing infinite re-renders
      </div>
    </section>
  )
}