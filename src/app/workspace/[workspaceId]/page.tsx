"use client";

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { LoaderIcon, TriangleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const WorkspacePage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: isLoadingMember } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: isLoadingWorkspace } = useGetWorkspace({
    workspaceId,
  });
  const { data: channels, isLoading: isLoadingChannels } = useGetChannels({
    workspaceId,
  });

  const channelId = useMemo(() => {
    return channels?.[0]?._id;
  }, [channels]);

  const isAdmin = useMemo(() => {
    return member?.role === "admin";
  }, [member]);

  useEffect(() => {
    if (
      isLoadingWorkspace ||
      isLoadingChannels ||
      isLoadingMember ||
      !member ||
      !workspace
    )
      return;

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    isLoadingWorkspace,
    isLoadingChannels,
    channels,
    workspace,
    channelId,
    router,
    workspaceId,
    open,
    setOpen,
    isAdmin,
    isLoadingMember,
    member,
  ]);

  if (isLoadingWorkspace || isLoadingChannels)
    return (
      <div className="h-full flex-1 flex flex-col gap-2 items-center justify-center">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );

  if (!workspace) {
    return (
      <div className="h-full flex-1 flex flex-col gap-2 items-center justify-center text-muted-foreground">
        <TriangleAlertIcon className="size-6" />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex flex-col gap-2 items-center justify-center text-muted-foreground">
      <TriangleAlertIcon className="size-6" />
      <span className="text-sm text-muted-foreground">No channel found</span>
    </div>
  );
};

export default WorkspacePage;
