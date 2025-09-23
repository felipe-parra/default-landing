"use client"

import TenantInfoPanelFixed from "@/components/demo/TenantInfoPanelFixed"
import { Block, BlockTitle, Page } from "konsta/react"

export default function UseEffectDemoFixedPage() {
  return (
    <Page className="">
      <Block inset>
        <BlockTitle
          component="h1"
          className="text-2xl font-bold text-center mb-4 w-full mx-auto self-center flex items-center justify-center"
        >
          useEffect Fixed Demo
        </BlockTitle>
      </Block>

      <Block className="mx-auto" inset strong outline>
        <p className="text-muted-foreground mb-6">
          This demonstrates the fixed version of the React useEffect
          implementation that prevents infinite API calls by using stable
          dependencies.
        </p>

        <TenantInfoPanelFixed orgId="acme-1" token="dev-token" />

        <BlockTitle className="font-semibold text-green-800 mb-2">
          The Solution:
        </BlockTitle>
        <Block strong inset outline>
          <p className="text-green-700">
            The fix ensures that useEffect only depends on primitive values
            (orgId, token) instead of objects that get recreated on every
            render. This prevents unnecessary re-renders and API calls.
          </p>
        </Block>

        <BlockTitle className="font-semibold text-blue-800 mb-2">
          Key Improvements:
        </BlockTitle>
        <Block strong inset outline>
          <ul className="text-blue-700 space-y-1">
            <li>• Stable dependency array with only primitive values</li>
            <li>• Headers created inline to avoid reference equality issues</li>
            <li>• Proper request cancellation with AbortController</li>
            <li>• Loading state management to prevent concurrent requests</li>
          </ul>
        </Block>
      </Block>
    </Page>
  )
}
