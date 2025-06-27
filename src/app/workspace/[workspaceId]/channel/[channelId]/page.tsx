"use client";

import { MessageList } from "@/components/message-list";
import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { ChatInput } from "@/features/channels/components/chat-input";
import { Header } from "@/features/channels/components/header";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useChannelId } from "@/hooks/use-channel-id";
import { LoaderIcon, TriangleAlertIcon } from "lucide-react";

const ChannelPage = () => {
  const channelId = useChannelId();

  const { results, status, loadMore } = useGetMessages({
    channelId,
  });

  const { data: channel, isLoading: isLoadingChannel } = useGetChannel({
    channelId,
  });

  if (isLoadingChannel || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
        variant="channel"
      />
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
};

export default ChannelPage;
