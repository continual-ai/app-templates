import { Card } from "@/components/ui/card";

import { MessageList } from "./MessageList";
import { PromptComposer } from "./PromptComposer";
import type { ChatMessage } from "./types";

export function ChatShell({
  messages,
  value,
  onValueChange,
  onSubmit,
  disabled,
}: {
  messages: ChatMessage[];
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  return (
    <Card className="h-[min(680px,calc(100dvh-8rem))] overflow-hidden p-0">
      <div className="flex min-h-0 flex-1 flex-col">
        <MessageList messages={messages} />
        <PromptComposer
          value={value}
          onValueChange={onValueChange}
          onSubmit={onSubmit}
          disabled={disabled}
        />
      </div>
    </Card>
  );
}
