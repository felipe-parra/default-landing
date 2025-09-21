import { describe, it, expect, beforeEach, vi } from "vitest"
import { NextRequest } from "next/server"
import { GET, POST } from "@/app/api/beers/route"
import { auth } from "@clerk/nextjs/server"

// Mock auth function
const mockAuth = vi.mocked(auth)

// Helper function to create a mock auth response
function createMockAuthResponse(userId: string | null) {
  if (userId === null) {
    return {
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
    }
  }

  return {
    userId,
    sessionId: "sess_123",
    sessionClaims: {},
    sessionStatus: "authenticated" as const,
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
  }
}

// Helper function to create a mock NextRequest
function createMockRequest(
  url: string,
  method: string = "GET",
  body?: object
): NextRequest {
  const request = new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json",
    },
  })
  return request
}

describe("/api/beers", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("GET /api/beers", () => {
    it("should return 401 when user is not authenticated", async () => {
      mockAuth.mockResolvedValue(createMockAuthResponse(null))

      const request = createMockRequest("http://localhost:3000/api/beers")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Unauthorized")
    })

    it("should return beers owned by the current user", async () => {
      mockAuth.mockResolvedValue(createMockAuthResponse("user-001"))

      const request = createMockRequest("http://localhost:3000/api/beers")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(2) // user-001 owns 2 beers in sample data
      expect(data.data[0].owner).toBe("user-001")
      expect(data.data[1].owner).toBe("user-001")
    })

    it("should return beers filtered by specific owner", async () => {
      mockAuth.mockResolvedValue(createMockAuthResponse("user-001"))

      const request = createMockRequest(
        "http://localhost:3000/api/beers?owner=user-002"
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(1) // user-002 owns 1 beer in sample data
      expect(data.data[0].owner).toBe("user-002")
      expect(data.data[0].title).toBe("Golden Lager")
    })

    it("should support pagination", async () => {
      mockAuth.mockResolvedValue(createMockAuthResponse("user-001"))

      const request = createMockRequest(
        "http://localhost:3000/api/beers?page=1&limit=1"
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(1)
      expect(data.pagination).toEqual({
        page: 1,
        limit: 1,
        total: 2,
        totalPages: 2,
      })
    })

    it("should support search functionality", async () => {
      mockAuth.mockResolvedValue({ userId: "user-001" })

      const request = createMockRequest(
        "http://localhost:3000/api/beers?search=IPA"
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].title).toBe("Hoppy IPA")
    })

    it("should return 400 for invalid query parameters", async () => {
      mockAuth.mockResolvedValue({ userId: "user-001" })

      const request = createMockRequest(
        "http://localhost:3000/api/beers?page=invalid"
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Invalid query parameters")
    })
  })

  describe("POST /api/beers", () => {
    it("should return 401 when user is not authenticated", async () => {
      mockAuth.mockResolvedValue({ userId: null })

      const beerData = {
        title: "Test Beer",
        subtitle: "Test subtitle",
        text: "Test description",
        invitedDate: "2024-01-20T15:00:00Z",
        owner: "user-001",
        invitedBy: "user-002",
      }

      const request = createMockRequest(
        "http://localhost:3000/api/beers",
        "POST",
        beerData
      )
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Unauthorized")
    })

    it("should create a new beer with valid data", async () => {
      mockAuth.mockResolvedValue({ userId: "user-001" })

      const beerData = {
        title: "Craft IPA",
        subtitle: "Hoppy craft beer",
        text: "Amazing local brewery IPA",
        after: "4.5/5",
        invitedDate: "2024-01-20T15:00:00Z",
        owner: "user-001",
        invitedBy: "user-002",
      }

      const request = createMockRequest(
        "http://localhost:3000/api/beers",
        "POST",
        beerData
      )
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.id).toBe("test-uuid-123") // Mocked UUID
      expect(data.title).toBe("Craft IPA")
      expect(data.subtitle).toBe("Hoppy craft beer")
      expect(data.text).toBe("Amazing local brewery IPA")
      expect(data.after).toBe("4.5/5")
      expect(data.owner).toBe("user-001")
      expect(data.invitedBy).toBe("user-002")
      expect(data.invitedDate).toBeDefined()
      expect(data.drinkedDate).toBeUndefined()
      expect(data.createdAt).toBeDefined()
      expect(data.updatedAt).toBeDefined()
    })

    it("should create a beer with optional drinkedDate", async () => {
      mockAuth.mockResolvedValue({ userId: "user-001" })

      const beerData = {
        title: "Consumed Beer",
        subtitle: "Already enjoyed",
        text: "This beer was already consumed",
        invitedDate: "2024-01-20T15:00:00Z",
        drinkedDate: "2024-01-20T19:00:00Z",
        owner: "user-001",
        invitedBy: "user-002",
      }

      const request = createMockRequest(
        "http://localhost:3000/api/beers",
        "POST",
        beerData
      )
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.drinkedDate).toBeDefined()
    })

    it("should return 400 for invalid beer data", async () => {
      mockAuth.mockResolvedValue({ userId: "user-001" })

      const invalidBeerData = {
        title: "", // Empty title should fail validation
        subtitle: "Test subtitle",
        text: "Test description",
        invitedDate: "2024-01-20T15:00:00Z",
        owner: "user-001",
        invitedBy: "user-002",
      }

      const request = createMockRequest(
        "http://localhost:3000/api/beers",
        "POST",
        invalidBeerData
      )
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(data.details).toBeDefined()
    })

    it("should return 400 for missing required fields", async () => {
      mockAuth.mockResolvedValue({ userId: "user-001" })

      const incompleteBeerData = {
        title: "Test Beer",
        subtitle: "Test subtitle",
        // Missing required fields: text, invitedDate, owner, invitedBy
      }

      const request = createMockRequest(
        "http://localhost:3000/api/beers",
        "POST",
        incompleteBeerData
      )
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
    })
  })
})