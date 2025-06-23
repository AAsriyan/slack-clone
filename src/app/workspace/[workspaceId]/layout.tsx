"use client";

import { Toolbar } from "@/features/workspaces/components/toolbar";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
  return (
    <div className="h-full">
      <Toolbar />
      {children}
    </div>
  );
};

export default WorkspaceLayout;
