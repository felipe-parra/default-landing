import type { Beer, CreateBeer, UpdateBeer, BeerQuery } from "@/lib/schemas/beer"

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  error: string
  details?: unknown
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Beer API specific types
export type GetBeersResponse = PaginatedResponse<Beer>
export type GetBeerResponse = ApiResponse<Beer>
export type CreateBeerResponse = ApiResponse<Beer>
export type UpdateBeerResponse = ApiResponse<Beer>
export type DeleteBeerResponse = ApiResponse<{ message: string }>

// Re-export schema types for convenience
export type { Beer, CreateBeer, UpdateBeer, BeerQuery }