import { FileText, X } from "lucide-react";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";

import type { ChatAttachment } from "./types";

export function AttachmentRow({
  attachments,
  onRemove,
}: {
  attachments: ChatAttachment[];
  onRemove?: (attachment: ChatAttachment) => void;
}) {
  if (attachments.length === 0) return null;

  return (
    <AttachmentGroup>
      {attachments.map((attachment) => (
        <Attachment key={attachment.id} state={attachment.status ?? "done"} size="sm">
          <AttachmentMedia>
            <FileText className="size-4" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{attachment.name}</AttachmentTitle>
            {attachment.description && (
              <AttachmentDescription>{attachment.description}</AttachmentDescription>
            )}
          </AttachmentContent>
          {onRemove && (
            <AttachmentActions>
              <AttachmentAction aria-label={`Remove ${attachment.name}`} onClick={() => onRemove(attachment)}>
                <X className="size-3" />
              </AttachmentAction>
            </AttachmentActions>
          )}
        </Attachment>
      ))}
    </AttachmentGroup>
  );
}
