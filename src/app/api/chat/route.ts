import { auth } from "@clerk/nextjs/server"
import { openai } from "@ai-sdk/openai"
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
    const { messages, model } = body

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 })
    }

    // Use the selected model or default to gpt-4o (better vision support)
    const selectedModel = model || "gpt-4o"

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
      model: openai(selectedModel),
      messages: formattedMessages,
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
