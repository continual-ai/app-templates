import type { FormEvent, ReactNode } from "react";

import { Paperclip, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";

export function PromptComposer({
  value,
  onValueChange,
  onSubmit,
  disabled,
  attachments,
  onAttach,
}: {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  attachments?: ReactNode;
  onAttach?: () => void;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="border-t bg-background p-3">
      {attachments}
      <InputGroup>
        <InputGroupTextarea
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder="Ask anything..."
          disabled={disabled}
          rows={2}
        />
        {onAttach && (
          <InputGroupAddon align="inline-start">
            <InputGroupButton type="button" aria-label="Attach file" onClick={onAttach}>
              <Paperclip className="size-4" />
            </InputGroupButton>
          </InputGroupAddon>
        )}
        <InputGroupAddon align="inline-end">
          <Button type="submit" size="icon-sm" disabled={disabled || !value.trim()} aria-label="Send message">
            <Send className="size-4" />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
