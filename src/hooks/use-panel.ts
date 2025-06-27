import { useParentMessageId } from "@/features/members/store/use-parent-message-id";
import { Id } from "../../convex/_generated/dataModel";

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();

  const onOpenMessage = (messageId: Id<"messages">) => {
    setParentMessageId(messageId);
  };

  const onClose = () => {
    setParentMessageId(null);
  };

  return {
    parentMessageId,
    onOpenMessage,
    onClose,
  };
};
