"use client";

import { Button } from "@/components/ui/button";
import { InfoIcon, SearchIcon } from "lucide-react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace } from "../api/use-get-workspace";

export const Toolbar = () => {
  const workspaceId = useWorkspaceId();

  const { data: workspace } = useGetWorkspace({ workspaceId });

  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[200px] max-w-[642px] grow-[2] shrink">
        <Button
          size="sm"
          className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2"
        >
          <SearchIcon className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {workspace?.name}</span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <InfoIcon className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
