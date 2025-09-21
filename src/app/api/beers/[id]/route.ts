import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { updateBeerSchema, type Beer } from "@/lib/schemas/beer"

// This would normally be imported from a shared data store
// For demo purposes, we'll reference the same array
// In a real app, this would be a database query

// Import the beers array from the main route (this is a simplified approach)
// In production, you'd use a proper database
const getBeersStore = (): Beer[] => {
  // This is a simplified approach for demo
  // In real app, you'd query the database
  return []
}

// GET /api/beers/[id] - Get a specific beer
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Validate UUID format
    const uuidSchema = z.string().uuid()
    const validationResult = uuidSchema.safeParse(id)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid beer ID format" },
        { status: 400 }
      )
    }

    // Note: In a real app, you'd query the database here
    // For demo purposes, this is simplified
    const beer = getBeersStore().find(b => b.id === id)

    if (!beer) {
      return NextResponse.json({ error: "Beer not found" }, { status: 404 })
    }

    return NextResponse.json(beer)
  } catch (error) {
    console.error("Error fetching beer:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/beers/[id] - Update a specific beer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // Validate the update data
    const validationResult = updateBeerSchema.safeParse({
      id,
      ...body,
    })

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error },
        { status: 400 }
      )
    }

    // Note: In a real app, you'd update the database here
    // For demo purposes, this is simplified
    const beers = getBeersStore()
    const beerIndex = beers.findIndex(b => b.id === id)

    if (beerIndex === -1) {
      return NextResponse.json({ error: "Beer not found" }, { status: 404 })
    }

    // Update the beer
    const updatedBeer: Beer = {
      ...beers[beerIndex],
      ...body,
      updatedAt: new Date(),
    }

    beers[beerIndex] = updatedBeer

    return NextResponse.json(updatedBeer)
  } catch (error) {
    console.error("Error updating beer:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/beers/[id] - Delete a specific beer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Validate UUID format
    const uuidSchema = z.string().uuid()
    const validationResult = uuidSchema.safeParse(id)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid beer ID format" },
        { status: 400 }
      )
    }

    // Note: In a real app, you'd delete from the database here
    // For demo purposes, this is simplified
    const beers = getBeersStore()
    const beerIndex = beers.findIndex(b => b.id === id)

    if (beerIndex === -1) {
      return NextResponse.json({ error: "Beer not found" }, { status: 404 })
    }

    // Remove the beer
    beers.splice(beerIndex, 1)

    return NextResponse.json({ message: "Beer deleted successfully" })
  } catch (error) {
    console.error("Error deleting beer:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}