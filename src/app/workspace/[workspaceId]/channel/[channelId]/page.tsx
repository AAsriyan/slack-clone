"use client";

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { Header } from "@/features/channels/components/header";
import { useChannelId } from "@/hooks/use-channel-id";
import { LoaderIcon, TriangleAlertIcon } from "lucide-react";

const ChannelPage = () => {
  const channelId = useChannelId();

  const { data: channel, isLoading: isLoadingChannel } = useGetChannel({
    channelId,
  });

  if (isLoadingChannel)
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
      </div>
    );

  if (!channel) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlertIcon className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name} />
    </div>
  );
};

export default ChannelPage;
