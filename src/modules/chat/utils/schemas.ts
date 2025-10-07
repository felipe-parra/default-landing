import { z } from "zod"

// Schema for file attachment
export const fileAttachmentSchema = z.object({
  name: z.string(),
  contentType: z.string(),
  url: z.string(), // base64 data URL or actual URL
})

// Schema for message part
export const messagePartSchema = z.union([
  z.object({
    type: z.literal("text"),
    text: z.string(),
  }),
  z.object({
    type: z.literal("image"),
    image: z.string(), // base64 or URL
    mimeType: z.string().optional(),
  }),
  z.object({
    type: z.literal("file"),
    data: z.string(),
    mimeType: z.string(),
    text: z.string().optional(),
  }),
])

// Schema for a single chat message (supporting multimodal content)
export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.union([
    z.string(),
    z.array(messagePartSchema),
  ]),
  id: z.string().optional(),
  createdAt: z.date().optional(),
  attachments: z.array(fileAttachmentSchema).optional(),
})

// Schema for chat request
export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1, "At least one message is required"),
  model: z.string().optional(),
})

// Schema for message input form
export const messageInputSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(4000, "Message too long"),
  attachments: z.array(fileAttachmentSchema).optional(),
})

// TypeScript types derived from schemas
export type FileAttachment = z.infer<typeof fileAttachmentSchema>
export type MessagePart = z.infer<typeof messagePartSchema>
export type ChatMessage = z.infer<typeof chatMessageSchema>
export type ChatRequest = z.infer<typeof chatRequestSchema>
export type MessageInput = z.infer<typeof messageInputSchema>
