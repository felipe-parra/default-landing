"use client"

import { useState, useRef, useEffect } from "react"
import {
  Page,
  Messagebar,
  Messages,
  Message,
  MessagesTitle,
  Link,
  Icon,
  ToolbarPane,
  List,
  ListItem,
  Sheet,
  Toolbar,
  Block,
  Chip,
} from "konsta/react"
// @ts-expect-error - framework7-icons/react doesn't have type definitions
import { CameraFill, ArrowUpCircleFill } from "framework7-icons/react"
import { MdCameraAlt, MdSend } from "react-icons/md"
import ReactMarkdown from "react-markdown"

interface FileAttachment {
  name: string
  type: string
  data: string // base64 encoded
  preview?: string // for images
}

interface PromptCategory {
  id: string
  label: string
  icon: string
  prompts: string[]
}

interface SuggestedPromptsData {
  categories: PromptCategory[]
}

export default function ChatPage() {
  const [inputValue, setInputValue] = useState("")
  const [selectedModel, setSelectedModel] = useState("gpt-4-turbo")
  const [sheetOpened, setSheetOpened] = useState(false)
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const [suggestedPrompts, setSuggestedPrompts] = useState<SuggestedPromptsData | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("explore")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [messages, setMessages] = useState<Array<{
    id: string
    role: "user" | "assistant"
    content: string
    experimental_attachments?: Array<{
      name: string
      contentType: string
      url: string
    }>
  }>>([])

  const pageRef = useRef<HTMLDivElement>(null)
  const initiallyScrolled = useRef(false)
  const [currentDate, setCurrentDate] = useState<React.ReactNode>(null)

  const scrollToBottom = () => {
    const pageElement = pageRef.current
    if (!pageElement) return
    pageElement.scrollTo({
      top: pageElement.scrollHeight - pageElement.offsetHeight,
      behavior: initiallyScrolled.current ? "smooth" : "auto",
    })
  }

  useEffect(() => {
    scrollToBottom()
    initiallyScrolled.current = true
  }, [messages])

  useEffect(() => {
    setCurrentDate(
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })
        .formatToParts(new Date())
        .map(part => {
          if (["weekday", "month'", "day"].includes(part.type)) {
            return <b key={part.type}>{part.value}</b>
          }
          return part.value
        })
    )
  }, [])

  useEffect(() => {
    // Fetch suggested prompts
    fetch("/api/suggested-prompts")
      .then(res => res.json())
      .then(data => setSuggestedPrompts(data))
      .catch(err => console.error("Failed to load suggested prompts:", err))
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newAttachments: FileAttachment[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Check file type
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        alert(`File ${file.name} is not an image or PDF`)
        continue
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB`)
        continue
      }

      // Read file as base64
      const reader = new FileReader()
      await new Promise<void>((resolve) => {
        reader.onload = () => {
          const base64 = reader.result as string
          const attachment: FileAttachment = {
            name: file.name,
            type: file.type,
            data: base64,
          }

          // Add preview for images
          if (file.type.startsWith("image/")) {
            attachment.preview = base64
          }

          newAttachments.push(attachment)
          resolve()
        }
        reader.readAsDataURL(file)
      })
    }

    setAttachments(prev => [...prev, ...newAttachments])

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSendClick = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim().length > 0 || attachments.length > 0) {
      // Build experimental_attachments for AI SDK
      const experimental_attachments = attachments.map(a => ({
        name: a.name,
        contentType: a.type,
        url: a.data
      }))

      // Add user message to the messages array
      const userMessage = {
        id: Date.now().toString(),
        role: "user" as const,
        content: inputValue,
        experimental_attachments,
      }

      setMessages([...messages, userMessage])

      // Clear input immediately
      setInputValue("")
      setAttachments([])

      // Call API
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            model: selectedModel
          })
        })

        if (!response.ok) {
          throw new Error("Failed to get response")
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let assistantMessage = ""

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            assistantMessage += chunk

            // Update messages with streaming response
            setMessages(prev => {
              const newMessages = [...prev]
              const lastMessage = newMessages[newMessages.length - 1]

              if (lastMessage?.role === "assistant") {
                newMessages[newMessages.length - 1] = {
                  ...lastMessage,
                  content: assistantMessage
                }
              } else {
                newMessages.push({
                  id: (Date.now() + 1).toString(),
                  role: "assistant",
                  content: assistantMessage
                })
              }

              return newMessages
            })
          }
        }
      } catch (error) {
        console.error("Error sending message:", error)
      }
    }
  }

  const inputOpacity = inputValue || attachments.length > 0 ? 1 : 0.3
  const isClickable = inputValue.trim().length > 0 || attachments.length > 0

  const models = [
    { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  ]

  const selectedModelLabel =
    models.find(m => m.value === selectedModel)?.label || "GPT-4 Turbo"

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt)
  }

  const getCategoryIcon = (icon: string) => {
    const icons: Record<string, string> = {
      create: "🎨",
      explore: "📚",
      code: "</>",
      learn: "🎓"
    }
    return icons[icon] || "💡"
  }

  const currentCategoryPrompts = suggestedPrompts?.categories.find(
    cat => cat.id === selectedCategory
  )?.prompts || []

  return (
    <Page className="" colors={{ bgIos: "bg-transparent" }} ref={pageRef}>
      {/* <Navbar title="Messages" data-testid="chat-navbar" /> */}
      <div className="px-4 pt-4 pb-2">
        <List strongIos insetIos>
          <ListItem
            label
            title="AI Model"
            after={selectedModelLabel}
            link
            onClick={() => setSheetOpened(true)}
          />
        </List>
      </div>
      <Messages>
        <MessagesTitle>{currentDate}</MessagesTitle>

        {/* Show suggested prompts when no messages */}
        {messages.length === 0 && suggestedPrompts && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">
              How can I help you?
            </h1>

            {/* Category tabs */}
            <div className="flex gap-2 mb-6 flex-wrap justify-center">
              {suggestedPrompts.categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    selectedCategory === category.id
                      ? "bg-primary text-white"
                      : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <span>{getCategoryIcon(category.icon)}</span>
                  <span className="font-medium">{category.label}</span>
                </button>
              ))}
            </div>

            {/* Suggested prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
              {currentCategoryPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="text-left p-4 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                >
                  <p className="text-sm dark:text-gray-200">{prompt}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => {
          // Handle experimental_attachments from user messages
          const attachmentImages = message.experimental_attachments?.filter(
            (att) => att.contentType?.startsWith("image/")
          )

          return (
            <Message
              key={message.id || `chat-idx-${index}`}
              type={message.role === "user" ? "sent" : "received"}
              name={message.role === "assistant" ? "AI Assistant" : undefined}
              text={
                <div className="space-y-2">
                  {attachmentImages && attachmentImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {attachmentImages.map((att, idx) => (
                        <img
                          key={idx}
                          src={att.url}
                          alt={att.name || `attachment-${idx}`}
                          className="max-w-xs max-h-64 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}
                  {message.content && <ReactMarkdown>{message.content}</ReactMarkdown>}
                </div>
              }
              avatar={
                message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    AI
                  </div>
                )
              }
            />
          )
        })}
      </Messages>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Attachment preview above messagebar */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-black">
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment, index) => (
              <Chip
                key={index}
                deleteButton
                onDelete={() => handleRemoveAttachment(index)}
                className="flex items-center gap-2"
              >
                {attachment.preview ? (
                  <img
                    src={attachment.preview}
                    alt={attachment.name}
                    className="w-6 h-6 rounded object-cover"
                  />
                ) : (
                  <span>📄</span>
                )}
                <span className="text-xs max-w-[100px] truncate">
                  {attachment.name}
                </span>
              </Chip>
            ))}
          </div>
        </div>
      )}

      <Messagebar
        className="z-20"
        placeholder="Message"
        value={inputValue}
        onInput={e => setInputValue(e.target.value)}
        left={
          <ToolbarPane className="ios:h-10">
            <Link
              onClick={() => fileInputRef.current?.click()}
              iconOnly
            >
              <Icon
                ios={<CameraFill className="w-5 h-5" />}
                material={
                  <MdCameraAlt className="w-6 h-6 fill-black dark:fill-md-dark-on-surface" />
                }
              />
            </Link>
          </ToolbarPane>
        }
        right={
          <ToolbarPane className="ios:h-10">
            <Link
              onClick={isClickable ? handleSendClick : undefined}
              iconOnly
              style={{
                opacity: inputOpacity,
                cursor: isClickable ? "pointer" : "default",
              }}
            >
              <Icon
                ios={
                  <ArrowUpCircleFill
                    className={`w-7 h-7${isClickable ? " text-primary" : ""}`}
                  />
                }
                material={
                  <MdSend className="w-6 h-6 fill-black dark:fill-md-dark-on-surface" />
                }
              />
            </Link>
          </ToolbarPane>
        }
      />
      <Sheet
        className="pb-safe"
        opened={sheetOpened}
        onBackdropClick={() => setSheetOpened(false)}
      >
        <Toolbar top className="justify-end ios:pt-4">
          <div className="ios:hidden" />
          <ToolbarPane>
            <Link iconOnly onClick={() => setSheetOpened(false)}>
              <Icon
                ios={<span className="text-2xl">×</span>}
                material={<span className="text-2xl">×</span>}
              />
            </Link>
          </ToolbarPane>
        </Toolbar>
        <Block className="ios:mt-4">
          <h3 className="text-xl font-bold mb-4">Select AI Model</h3>
          <List strongIos insetIos>
            {models.map(model => (
              <ListItem
                key={model.value}
                title={model.label}
                link
                onClick={() => {
                  setSelectedModel(model.value)
                  setSheetOpened(false)
                }}
                after={
                  selectedModel === model.value ? (
                    <span className="text-primary">✓</span>
                  ) : null
                }
              />
            ))}
          </List>
        </Block>
      </Sheet>
    </Page>
  )
}
