export interface ChatAttachment {
  id: string;
  name: string;
  description?: string;
  url?: string;
  status?: "idle" | "uploading" | "processing" | "error" | "done";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  attachments?: ChatAttachment[];
  status?: "queued" | "streaming" | "complete" | "error";
}
