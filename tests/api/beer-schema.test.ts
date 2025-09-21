import { describe, it, expect } from "vitest"
import {
  createBeerSchema,
  updateBeerSchema,
  beerQuerySchema,
} from "@/lib/schemas/beer"

describe("Beer Schema Validation", () => {
  describe("createBeerSchema", () => {
    it("should validate a complete beer creation request", () => {
      const validBeer = {
        title: "Craft IPA",
        subtitle: "Hoppy craft beer",
        text: "Amazing local brewery IPA",
        after: "4.5/5",
        invitedDate: new Date("2024-01-20T15:00:00Z"),
        owner: "user-001",
        invitedBy: "user-002",
      }

      const result = createBeerSchema.safeParse(validBeer)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe("Craft IPA")
        expect(result.data.subtitle).toBe("Hoppy craft beer")
        expect(result.data.text).toBe("Amazing local brewery IPA")
        expect(result.data.after).toBe("4.5/5")
        expect(result.data.owner).toBe("user-001")
        expect(result.data.invitedBy).toBe("user-002")
        expect(result.data.invitedDate).toBeInstanceOf(Date)
        expect(result.data.drinkedDate).toBeUndefined()
      }
    })

    it("should validate a beer with drinkedDate", () => {
      const beerWithDrinkedDate = {
        title: "Consumed Beer",
        subtitle: "Already enjoyed",
        text: "This beer was already consumed",
        invitedDate: new Date("2024-01-20T15:00:00Z"),
        drinkedDate: new Date("2024-01-20T19:00:00Z"),
        owner: "user-001",
        invitedBy: "user-002",
      }

      const result = createBeerSchema.safeParse(beerWithDrinkedDate)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.drinkedDate).toBeInstanceOf(Date)
      }
    })

    it("should reject beer with missing required fields", () => {
      const incompleteBeer = {
        title: "Test Beer",
        subtitle: "Test subtitle",
        // Missing: text, invitedDate, owner, invitedBy
      }

      const result = createBeerSchema.safeParse(incompleteBeer)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(4) // 4 missing required fields
      }
    })

    it("should reject beer with empty title", () => {
      const invalidBeer = {
        title: "",
        subtitle: "Test subtitle",
        text: "Test description",
        invitedDate: new Date("2024-01-20T15:00:00Z"),
        owner: "user-001",
        invitedBy: "user-002",
      }

      const result = createBeerSchema.safeParse(invalidBeer)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Title is required")
      }
    })

    it("should reject beer with text too long", () => {
      const longText = "x".repeat(1001) // Exceeds 1000 character limit

      const invalidBeer = {
        title: "Test Beer",
        subtitle: "Test subtitle",
        text: longText,
        invitedDate: new Date("2024-01-20T15:00:00Z"),
        owner: "user-001",
        invitedBy: "user-002",
      }

      const result = createBeerSchema.safeParse(invalidBeer)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Description too long")
      }
    })
  })

  describe("beerQuerySchema", () => {
    it("should parse valid query parameters", () => {
      const queryParams = {
        page: "2",
        limit: "5",
        search: "IPA",
        owner: "user-001",
      }

      const result = beerQuerySchema.safeParse(queryParams)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(2)
        expect(result.data.limit).toBe(5)
        expect(result.data.search).toBe("IPA")
        expect(result.data.owner).toBe("user-001")
      }
    })

    it("should apply default values", () => {
      const emptyQuery = {}

      const result = beerQuerySchema.safeParse(emptyQuery)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(1)
        expect(result.data.limit).toBe(10)
        expect(result.data.search).toBeUndefined()
        expect(result.data.owner).toBeUndefined()
      }
    })

    it("should reject invalid page numbers", () => {
      const invalidQuery = { page: "0" }

      const result = beerQuerySchema.safeParse(invalidQuery)
      expect(result.success).toBe(false)
    })

    it("should reject limit exceeding maximum", () => {
      const invalidQuery = { limit: "101" }

      const result = beerQuerySchema.safeParse(invalidQuery)
      expect(result.success).toBe(false)
    })
  })

  describe("updateBeerSchema", () => {
    it("should validate partial updates", () => {
      const partialUpdate = {
        id: "550e8400-e29b-41d4-a716-446655440001",
        drinkedDate: new Date("2024-01-20T19:00:00Z"),
      }

      const result = updateBeerSchema.safeParse(partialUpdate)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe("550e8400-e29b-41d4-a716-446655440001")
        expect(result.data.drinkedDate).toBeInstanceOf(Date)
        expect(result.data.title).toBeUndefined()
      }
    })

    it("should require valid UUID for id", () => {
      const invalidUpdate = {
        id: "invalid-id",
        title: "Updated title",
      }

      const result = updateBeerSchema.safeParse(invalidUpdate)
      expect(result.success).toBe(false)
    })
  })
})

describe("API Examples Validation", () => {
  it("should validate the create beer example", () => {
    const createExample = {
      title: "Craft IPA",
      subtitle: "Hoppy craft beer",
      text: "Amazing local brewery IPA",
      after: "4.5/5",
      invitedDate: new Date("2024-01-20T15:00:00Z"),
      owner: "user-001",
      invitedBy: "user-002",
    }

    const result = createBeerSchema.safeParse(createExample)
    expect(result.success).toBe(true)
  })

  it("should validate the update beer example", () => {
    const updateExample = {
      id: "550e8400-e29b-41d4-a716-446655440001",
      drinkedDate: new Date("2024-01-20T19:00:00Z"),
    }

    const result = updateBeerSchema.safeParse(updateExample)
    expect(result.success).toBe(true)
  })

  it("should validate query parameter examples", () => {
    // Example: Get current user's beers
    const currentUserQuery = {}
    expect(beerQuerySchema.safeParse(currentUserQuery).success).toBe(true)

    // Example: Get specific user's beers
    const specificUserQuery = { owner: "user-001" }
    expect(beerQuerySchema.safeParse(specificUserQuery).success).toBe(true)

    // Example: Pagination and search
    const paginatedSearchQuery = {
      page: "1",
      limit: "10",
      search: "IPA",
    }
    expect(beerQuerySchema.safeParse(paginatedSearchQuery).success).toBe(true)
  })
})