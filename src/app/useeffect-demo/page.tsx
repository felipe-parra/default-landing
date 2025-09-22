'use client'

import { useState } from 'react'
import TenantInfoPanelBug from '@/components/demo/TenantInfoPanelBug'
import TenantInfoPanelFixed from '@/components/demo/TenantInfoPanelFixed'

export default function UseEffectDemoPage() {
  const [mode, setMode] = useState<'bug' | 'fix'>('bug')

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">useEffect Loop Demo</h1>
        <p className="text-muted-foreground mb-6">
          This demonstrates a React useEffect pitfall similar to the Cloudflare incident -
          an unstable dependency causing infinite API calls.
        </p>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode('bug')}
            disabled={mode === 'bug'}
            className={`px-4 py-2 rounded transition-colors ${
              mode === 'bug'
                ? 'bg-red-500 text-white cursor-not-allowed'
                : 'bg-gray-200 hover:bg-red-100 text-gray-800'
            }`}
          >
            Show BUG
          </button>
          <button
            onClick={() => setMode('fix')}
            disabled={mode === 'fix'}
            className={`px-4 py-2 rounded transition-colors ${
              mode === 'fix'
                ? 'bg-green-500 text-white cursor-not-allowed'
                : 'bg-gray-200 hover:bg-green-100 text-gray-800'
            }`}
          >
            Show FIX
          </button>
        </div>

        {mode === 'bug' ? (
          <TenantInfoPanelBug orgId="acme-1" token="dev-token" />
        ) : (
          <TenantInfoPanelFixed orgId="acme-1" token="dev-token" />
        )}

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
          <ul className="text-yellow-700 space-y-1">
            <li>• Open your browser's Network tab to see the difference</li>
            <li>• The BUG version keeps fetching on every render</li>
            <li>• The FIX version only fetches when necessary</li>
            <li>• Use react-scan with: <code className="bg-yellow-100 px-1 rounded">npx react-scan@latest</code></li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold text-blue-800 mb-2">The Problem:</h3>
          <p className="text-blue-700">
            The bug occurs because an object is recreated on every render and placed in the useEffect
            dependency array. Since React compares by reference, the effect runs after every render,
            causing an infinite loop of API calls.
          </p>
        </div>
      </div>
    </div>
  )
}