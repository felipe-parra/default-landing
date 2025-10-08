import { auth } from "@clerk/nextjs/server"
import { openai } from "@ai-sdk/openai"
import { google } from "@ai-sdk/google"
import { streamText } from "ai"

export const runtime = "edge"
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    // Get current user from Clerk
    const { userId } = await auth()
    if (!userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { messages, model, category } = body

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 })
    }

    // Use the selected model or default to gpt-4o (better vision support)
    const selectedModel = model || "gpt-4o"

    // Determine which provider to use based on model name
    const isGeminiModel = selectedModel.startsWith("gemini")
    const modelProvider = isGeminiModel ? google(selectedModel) : openai(selectedModel)

    // Add system prompt for image category
    let systemPrompt = ""
    if (category === "image") {
      systemPrompt = "You are an expert image prompt writer and visual creative director. When given an image description request, provide a detailed, vivid, and professional description that could be used as a prompt for AI image generation. Focus on composition, lighting, mood, technical details, and artistic style. Be specific and descriptive."
    }

    // Convert messages to the format expected by the AI SDK
    const formattedMessages = messages.map((msg) => {
      interface Attachment {
        contentType?: string
        url: string
      }

      // Handle experimental_attachments (images)
      if (msg.experimental_attachments && msg.experimental_attachments.length > 0) {
        const content: Array<{ type: string; text?: string; image?: string }> = []

        // Add text if present
        if (msg.content) {
          content.push({ type: "text", text: msg.content })
        }

        // Add images
        msg.experimental_attachments.forEach((attachment: Attachment) => {
          if (attachment.contentType?.startsWith("image/")) {
            content.push({
              type: "image",
              image: attachment.url
            })
          }
        })

        return {
          role: msg.role as "user" | "assistant" | "system",
          content
        }
      }

      return {
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content || ""
      }
    })

    const result = streamText({
      model: modelProvider,
      messages: formattedMessages,
      system: systemPrompt || undefined,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error in chat endpoint:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}
