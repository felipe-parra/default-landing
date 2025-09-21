import { describe, it, expect } from "vitest"
import {
  createBeerSchema,
  beerQuerySchema,
  updateBeerSchema,
} from "@/lib/schemas/beer"

describe("Beer API Examples Validation", () => {
  describe("API Request Examples", () => {
    it("should validate create beer request example", () => {
      // Example from documentation
      const createBeerExample = {
        title: "Craft IPA",
        subtitle: "Hoppy craft beer",
        text: "Amazing local brewery IPA",
        after: "4.5/5",
        invitedDate: new Date("2024-01-20T15:00:00Z"),
        owner: "user-001",
        invitedBy: "user-002",
      }

      const result = createBeerSchema.safeParse(createBeerExample)
      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.title).toBe("Craft IPA")
        expect(result.data.subtitle).toBe("Hoppy craft beer")
        expect(result.data.text).toBe("Amazing local brewery IPA")
        expect(result.data.after).toBe("4.5/5")
        expect(result.data.owner).toBe("user-001")
        expect(result.data.invitedBy).toBe("user-002")
        expect(result.data.invitedDate).toBeInstanceOf(Date)
      }
    })

    it("should validate beer with optional drinkedDate", () => {
      // Example: Beer that was consumed
      const consumedBeerExample = {
        title: "Craft IPA",
        subtitle: "Hoppy craft beer",
        text: "Amazing local brewery IPA",
        after: "4.5/5",
        invitedDate: new Date("2024-01-20T15:00:00Z"),
        drinkedDate: new Date("2024-01-20T19:00:00Z"),
        owner: "user-001",
        invitedBy: "user-002",
      }

      const result = createBeerSchema.safeParse(consumedBeerExample)
      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.drinkedDate).toBeInstanceOf(Date)
      }
    })

    it("should validate update beer request example", () => {
      // Example: Mark beer as consumed
      const updateExample = {
        id: "550e8400-e29b-41d4-a716-446655440001",
        drinkedDate: new Date("2024-01-20T19:00:00Z"),
      }

      const result = updateBeerSchema.safeParse(updateExample)
      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.id).toBe("550e8400-e29b-41d4-a716-446655440001")
        expect(result.data.drinkedDate).toBeInstanceOf(Date)
      }
    })

    it("should validate query parameter examples", () => {
      // Example: Get current user's beers (default parameters)
      const defaultQuery = {}
      const defaultResult = beerQuerySchema.safeParse(defaultQuery)
      expect(defaultResult.success).toBe(true)
      if (defaultResult.success) {
        expect(defaultResult.data.page).toBe(1)
        expect(defaultResult.data.limit).toBe(10)
      }

      // Example: Get specific user's beers
      const ownerQuery = { owner: "user-001" }
      const ownerResult = beerQuerySchema.safeParse(ownerQuery)
      expect(ownerResult.success).toBe(true)
      if (ownerResult.success) {
        expect(ownerResult.data.owner).toBe("user-001")
      }

      // Example: Pagination with search
      const paginatedQuery = {
        page: "1",
        limit: "10",
        search: "IPA",
      }
      const paginatedResult = beerQuerySchema.safeParse(paginatedQuery)
      expect(paginatedResult.success).toBe(true)
      if (paginatedResult.success) {
        expect(paginatedResult.data.page).toBe(1)
        expect(paginatedResult.data.limit).toBe(10)
        expect(paginatedResult.data.search).toBe("IPA")
      }
    })
  })

  describe("Error Cases", () => {
    it("should reject invalid beer creation data", () => {
      const invalidBeer = {
        title: "", // Empty title
        subtitle: "Test subtitle",
        text: "Test description",
        invitedDate: new Date("2024-01-20T15:00:00Z"),
        owner: "user-001",
        invitedBy: "user-002",
      }

      const result = createBeerSchema.safeParse(invalidBeer)
      expect(result.success).toBe(false)
    })

    it("should reject missing required fields", () => {
      const incompleteBeer = {
        title: "Test Beer",
        // Missing required fields
      }

      const result = createBeerSchema.safeParse(incompleteBeer)
      expect(result.success).toBe(false)
    })

    it("should reject invalid query parameters", () => {
      const invalidQuery = {
        page: "0", // Invalid page number
        limit: "101", // Exceeds maximum
      }

      const result = beerQuerySchema.safeParse(invalidQuery)
      expect(result.success).toBe(false)
    })

    it("should reject invalid update data", () => {
      const invalidUpdate = {
        id: "invalid-uuid", // Invalid UUID format
        title: "Updated title",
      }

      const result = updateBeerSchema.safeParse(invalidUpdate)
      expect(result.success).toBe(false)
    })
  })

  describe("Business Logic Examples", () => {
    it("should demonstrate beer invitation flow", () => {
      // Step 1: Create invitation
      const invitation = {
        title: "After Work Beer",
        subtitle: "Join us for drinks",
        text: "Come celebrate the end of the week with some cold beers at our favorite local brewery!",
        invitedDate: new Date("2024-01-20T17:00:00Z"),
        owner: "user-123",
        invitedBy: "user-456",
      }

      const invitationResult = createBeerSchema.safeParse(invitation)
      expect(invitationResult.success).toBe(true)

      // Step 2: Mark as consumed later
      const consumption = {
        id: "550e8400-e29b-41d4-a716-446655440001", // Valid UUID
        drinkedDate: new Date("2024-01-20T20:00:00Z"),
      }

      const consumptionResult = updateBeerSchema.safeParse(consumption)
      expect(consumptionResult.success).toBe(true)
    })

    it("should demonstrate filtering and pagination", () => {
      // Filter by owner with pagination
      const ownerFilterQuery = {
        owner: "user-123",
        page: "1",
        limit: "5",
      }

      const result = beerQuerySchema.safeParse(ownerFilterQuery)
      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.owner).toBe("user-123")
        expect(result.data.page).toBe(1)
        expect(result.data.limit).toBe(5)
      }
    })
  })
})