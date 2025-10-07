import { NextResponse } from "next/server"
import suggestedPrompts from "@/config/suggested-prompts.json"

export async function GET() {
  return NextResponse.json(suggestedPrompts)
}
