// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Define private routes that require authentication
const privateRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
  "/admin",
  "/api/protected",
]

const isPrivateRoute = createRouteMatcher(privateRoutes)

export default clerkMiddleware(async (auth, req) => {
  // Protect private routes
  if (isPrivateRoute(req)) {
    await auth.protect()
    //     await auth.protect((has) => {
    //   return has({ permission: 'org:admin:example1' }) || has({ permission: 'org:admin:example2' })
    // })
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
