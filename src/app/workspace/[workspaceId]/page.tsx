"use client";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";

const WorkspacePage = () => {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading } = useGetWorkspace({ workspaceId });

  if (isLoading) return <div>Loading...</div>;

  return <div>ID: {workspace?.name}</div>;
};

export default WorkspacePage;
