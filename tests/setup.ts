import "@testing-library/jest-dom"
import { vi } from "vitest"

// Mock Clerk auth for testing
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn().mockResolvedValue({
    userId: null,
    sessionId: null,
    sessionClaims: null,
    sessionStatus: "unauthenticated",
    actor: null,
    orgId: null,
    orgRole: null,
    orgSlug: null,
    orgPermissions: null,
    redirectToSignIn: vi.fn(),
    redirectToSignUp: vi.fn(),
    has: vi.fn(),
    getToken: vi.fn(),
    debug: vi.fn(),
  }),
}))

// Mock crypto for both randomUUID and random
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: vi.fn(() => "test-uuid-123"),
    getRandomValues: vi.fn((arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
      }
      return arr
    }),
    subtle: {},
  },
})