import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import {
  createBeerSchema,
  beerQuerySchema,
  type Beer,
  type CreateBeer,
} from "@/lib/schemas/beer"

// In-memory storage for demo purposes
// In a real app, this would be a database
const beers: Beer[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "Hoppy IPA",
    subtitle: "A refreshing India Pale Ale",
    text: "This IPA features a perfect balance of citrus hops and malty sweetness. Brewed with Cascade and Centennial hops, it delivers a bright, floral aroma with notes of grapefruit and pine. The crisp finish makes it perfect for any occasion.",
    after: "4.5/5",
    invitedDate: new Date("2024-01-15T09:00:00Z"),
    drinkedDate: new Date("2024-01-15T19:00:00Z"),
    owner: "user-001",
    invitedBy: "user-002",
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2024-01-15T10:00:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    title: "Dark Stout",
    subtitle: "Rich and creamy stout",
    text: "A velvety smooth stout with deep chocolate and coffee notes. Roasted barley gives it its signature dark color and complex flavor profile. Perfect for cold evenings or pairing with desserts.",
    after: "4.2/5",
    invitedDate: new Date("2024-01-16T12:00:00Z"),
    drinkedDate: undefined,
    owner: "user-001",
    invitedBy: "user-003",
    createdAt: new Date("2024-01-16T14:30:00Z"),
    updatedAt: new Date("2024-01-16T14:30:00Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    title: "Golden Lager",
    subtitle: "Crisp and refreshing lager",
    text: "A clean, crisp lager with a golden color and smooth finish. Perfect for summer days or casual gatherings. Light maltiness balanced with subtle hop character.",
    after: "4.0/5",
    invitedDate: new Date("2024-01-17T15:00:00Z"),
    drinkedDate: undefined,
    owner: "user-002",
    invitedBy: "user-001",
    createdAt: new Date("2024-01-17T16:00:00Z"),
    updatedAt: new Date("2024-01-17T16:00:00Z"),
  },
]

// GET /api/beers - Retrieve beers with optional filtering and pagination
export async function GET(request: NextRequest) {
  try {
    // Get current user from Clerk
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const queryResult = beerQuerySchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
      owner: searchParams.get("owner"),
    })

    if (!queryResult.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: queryResult.error },
        { status: 400 }
      )
    }

    const { page, limit, search, owner } = queryResult.data

    // Filter beers - only show beers owned by the requesting user or specified owner
    let filteredBeers = beers.filter(beer => {
      // If owner parameter is provided, filter by that owner, otherwise use current user
      const targetOwner = owner || userId
      return beer.owner === targetOwner
    })

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase()
      filteredBeers = filteredBeers.filter(
        beer =>
          beer.title.toLowerCase().includes(searchLower) ||
          beer.subtitle.toLowerCase().includes(searchLower) ||
          beer.text.toLowerCase().includes(searchLower)
      )
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedBeers = filteredBeers.slice(startIndex, endIndex)

    return NextResponse.json({
      data: paginatedBeers,
      pagination: {
        page,
        limit,
        total: filteredBeers.length,
        totalPages: Math.ceil(filteredBeers.length / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching beers:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/beers - Create a new beer
export async function POST(request: NextRequest) {
  try {
    // Get current user from Clerk
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Parse dates from ISO strings in the request
    const processedBody = {
      ...body,
      invitedDate: body.invitedDate ? new Date(body.invitedDate) : undefined,
      drinkedDate: body.drinkedDate ? new Date(body.drinkedDate) : undefined,
    }

    const validationResult = createBeerSchema.safeParse(processedBody)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error },
        { status: 400 }
      )
    }

    const createData: CreateBeer = validationResult.data

    // Create new beer with generated fields
    const newBeer: Beer = {
      id: crypto.randomUUID(),
      ...createData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    beers.push(newBeer)

    return NextResponse.json(newBeer, { status: 201 })
  } catch (error) {
    console.error("Error creating beer:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}