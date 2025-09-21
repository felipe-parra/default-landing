import { z } from "zod"

// Schema for creating a new beer
export const createBeerSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  subtitle: z
    .string()
    .min(1, "Subtitle is required")
    .max(200, "Subtitle too long"),
  text: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description too long"),
  after: z.string().optional(), // Optional field for additional info like time/rating
  invitedDate: z.date(),
  drinkedDate: z.date().optional(), // Optional until beer is actually consumed
  owner: z.string().min(1, "Owner is required"),
  invitedBy: z.string().min(1, "InvitedBy is required"),
})

// Schema for beer retrieval (includes generated fields)
export const beerSchema = createBeerSchema.extend({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Schema for updating a beer (all fields optional except id)
export const updateBeerSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100).optional(),
  subtitle: z.string().min(1).max(200).optional(),
  text: z.string().min(1).max(1000).optional(),
  after: z.string().optional(),
  invitedDate: z.union([z.date(), z.string().transform((val) => new Date(val))]).optional(),
  drinkedDate: z.union([z.date(), z.string().transform((val) => new Date(val))]).optional(),
  owner: z.string().optional(),
  invitedBy: z.string().optional(),
})

// Schema for query parameters
export const beerQuerySchema = z.object({
  page: z
    .string()
    .nullable()
    .transform(val => val ? parseInt(val, 10) : 1)
    .pipe(z.number().min(1))
    .default(1),
  limit: z
    .string()
    .nullable()
    .transform(val => val ? parseInt(val, 10) : 10)
    .pipe(z.number().min(1).max(100))
    .default(10),
  search: z.string().nullable().optional(),
  owner: z.string().nullable().optional(), // Filter by owner ID (using Clerk user ID format)
})

// TypeScript types derived from schemas
export type CreateBeer = z.infer<typeof createBeerSchema>
export type Beer = z.infer<typeof beerSchema>
export type UpdateBeer = z.infer<typeof updateBeerSchema>
export type BeerQuery = z.infer<typeof beerQuerySchema>