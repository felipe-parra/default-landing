"use client"

import TenantInfoPanelBug from "@/components/demo/TenantInfoPanelBug"
import { Block, BlockTitle, Button, Link, Page } from "konsta/react"

export default function UseEffectDemoPage() {
  return (
    <Page className="">
      <Block inset>
        <BlockTitle
          component="h1"
          className="text-2xl font-bold text-center mb-4 w-full mx-auto self-center flex items-center justify-center"
        >
          useEffect Bug Demo
        </BlockTitle>
      </Block>

      <Block className="mx-auto" inset strong outline>
        <p className="text-muted-foreground mb-6">
          This demonstrates a React useEffect pitfall similar to the Cloudflare
          incident - an unstable dependency causing infinite API calls.
        </p>

        <Block strong inset className="flex gap-2 justify-center mb-4">
          <Link
            href="/useeffect-demo-fixed"
            className="px-4 py-2 rounded transition-colors k-color-brand-green"
          >
            <Button tonal>View Fixed Version</Button>
          </Link>
        </Block>

        <TenantInfoPanelBug orgId="acme-1" token="dev-token" />

        <BlockTitle className="font-semibold text-yellow-800 mb-2">
          Instructions:
        </BlockTitle>
        <Block strong inset outline>
          <ul className="text-yellow-700 space-y-1">
            <li>
              • Open your browser&apos;s Network tab to see the infinite
              requests
            </li>
            <li>• Watch the request counter keep incrementing</li>
            <li>• Compare with the fixed version using the button above</li>
            <li>
              • Use react-scan with:{" "}
              <code className="bg-yellow-100 px-1 rounded">
                npx react-scan@latest
              </code>
            </li>
          </ul>
        </Block>

        <BlockTitle className="font-semibold text-red-800 mb-2">
          The Problem:
        </BlockTitle>
        <Block strong inset outline>
          <p className="text-red-700">
            The bug occurs because an object is recreated on every render and
            placed in the useEffect dependency array. Since React compares by
            reference, the effect runs after every render, causing an infinite
            loop of API calls.
          </p>
        </Block>
      </Block>
    </Page>
  )
}
