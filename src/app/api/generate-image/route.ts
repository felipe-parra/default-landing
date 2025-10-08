import { auth } from "@clerk/nextjs/server"
import { google } from "@ai-sdk/google"
import { experimental_generateImage as generateImage } from "ai"

export const runtime = "edge"
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    // Get current user from Clerk
    const { userId } = await auth()
    if (!userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { prompt, model, aspectRatio = "16:9" } = body

    if (!prompt || typeof prompt !== "string") {
      return new Response("Invalid prompt", { status: 400 })
    }

    // Map model names to supported Imagen models in Google Generative AI
    // Currently only imagen-3.0-generate-002 and imagen-3.0-fast-generate-001 are supported
    const modelMap: Record<string, string> = {
      "imagen-4.0-generate-001": "imagen-3.0-generate-002",
      "imagen-4.0-fast-generate-001": "imagen-3.0-fast-generate-001",
      "imagen-4.0-ultra-generate-001": "imagen-3.0-generate-002",
      "gemini-2.5-flash-image": "imagen-3.0-generate-002",
      "imagen-3.0-generate-002": "imagen-3.0-generate-002",
      "imagen-3.0-fast-generate-001": "imagen-3.0-fast-generate-001",
    }

    const modelName = modelMap[model] || "imagen-3.0-generate-002"

    // Generate image using Google Generative AI
    const { image } = await generateImage({
      model: google.image(modelName),
      prompt,
      aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
      providerOptions: {
        google: {
          personGeneration: "allow_all"
        }
      }
    })

    // Return the base64 image
    return new Response(
      JSON.stringify({
        image: image.base64,
        model: modelName,
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    )
  } catch (error) {
    console.error("Error in generate-image endpoint:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return new Response(
      JSON.stringify({
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}
