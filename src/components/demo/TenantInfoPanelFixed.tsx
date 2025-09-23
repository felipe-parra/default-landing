"use client"

import { Block, Card } from "konsta/react"
import { useEffect, useRef, useState } from "react"

type Tenant = { id: string; name: string }

interface TenantInfoPanelFixedProps {
  orgId: string
  token: string
}

export default function TenantInfoPanelFixed({
  orgId,
  token,
}: Readonly<TenantInfoPanelFixedProps>) {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [requestCount, setRequestCount] = useState(0)

  // Prevent concurrent requests but allow refetch on mount
  const isLoading = useRef(false)

  useEffect(() => {
    // Don't start a new request if one is already in progress
    if (isLoading.current) {
      return
    }

    isLoading.current = true

    const controller = new AbortController()
    let cancelled = false

    ;(async () => {
      setRequestCount(prev => prev + 1)

      try {
        const res = await fetch("/api/tenant", {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Request-Source": "dashboard",
          },
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = (await res.json()) as Tenant
        if (!cancelled) {
          setTenant(data)
          setError(null)
        }
      } catch (e: unknown) {
        if (!cancelled && (!(e instanceof Error) || e.name !== "AbortError")) {
          setError(e instanceof Error ? e.message : "Network error")
        }
      } finally {
        isLoading.current = false
      }
    })()

    return () => {
      cancelled = true
      controller.abort()
      isLoading.current = false
    }
  }, [orgId, token])

  return (
    <Card className="border-2 border-green-500 p-4 rounded-lg bg-green-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-green-600">
          Tenant Info (FIXED)
        </h3>
        <div className="text-sm font-mono bg-green-500 px-2 py-1 rounded">
          Requests: {requestCount}
        </div>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded text-red-700">
          Error: {error}
        </div>
      )}

      {tenant ? (
        <pre className="bg-gray-600 p-3 rounded text-sm overflow-auto">
          {JSON.stringify(tenant, null, 2)}
        </pre>
      ) : (
        <p className="text-gray-600">Loading…</p>
      )}

      <div className="mt-3 text-xs text-green-600">
        ✅ This component uses stable dependencies and AbortController
      </div>
    </Card>
  )
}
