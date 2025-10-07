import { auth } from "@clerk/nextjs/server"
import { openai } from "@ai-sdk/openai"
import { streamText, UIMessage, convertToModelMessages } from "ai"

export const runtime = "edge"
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    // Get current user from Clerk
    const { userId } = await auth()
    if (!userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { messages }: { messages: UIMessage[] } = await req.json()

    const result = streamText({
      model: openai("gpt-4-turbo"),
      messages: convertToModelMessages(messages),
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Error in chat endpoint:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
