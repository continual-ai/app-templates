import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Bubble, BubbleContent } from "@/components/ui/bubble";

import { AttachmentRow } from "./AttachmentRow";
import { StatusMarker } from "./StatusMarker";
import type { ChatMessage } from "./types";

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  return (
    <MessageScrollerProvider>
      <MessageScroller>
        <MessageScrollerViewport>
          <MessageScrollerContent className="p-4">
            {messages.map((message) => {
              const isUser = message.role === "user";
              return (
                <MessageScrollerItem key={message.id} scrollAnchor={message.status === "streaming"}>
                  {message.role === "system" ? (
                    <StatusMarker>{message.content}</StatusMarker>
                  ) : (
                    <Message align={isUser ? "end" : "start"}>
                      {!isUser && <MessageAvatar>AI</MessageAvatar>}
                      <MessageContent>
                        <MessageHeader>{isUser ? "You" : "Assistant"}</MessageHeader>
                        <Bubble variant={isUser ? "default" : "secondary"} align={isUser ? "end" : "start"}>
                          <BubbleContent>{message.content}</BubbleContent>
                        </Bubble>
                        {message.attachments && <AttachmentRow attachments={message.attachments} />}
                        {message.status === "streaming" && <MessageFooter>Streaming</MessageFooter>}
                      </MessageContent>
                    </Message>
                  )}
                </MessageScrollerItem>
              );
            })}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
