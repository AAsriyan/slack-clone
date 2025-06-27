"use client";

import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { useMemberId } from "@/hooks/use-member-id";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { LoaderIcon, TriangleAlertIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Conversation } from "@/features/conversations/components/conversation";

const MemberPage = () => {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();

  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);

  const { mutate: createOrGetConversation, isPending } =
    useCreateOrGetConversation();

  useEffect(() => {
    createOrGetConversation(
      {
        workspaceId,
        memberId,
      },
      {
        onSuccess: (conversation) => {
          if (conversation) {
            setConversationId(conversation);
          }
        },
        onError: () => {
          toast.error("Failed to create or get conversation");
        },
      }
    );
  }, [createOrGetConversation, workspaceId, memberId]);

  if (isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="h-full flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlertIcon className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Conversation not found</p>
      </div>
    );
  }

  return <Conversation id={conversationId} />;
};

export default MemberPage;
