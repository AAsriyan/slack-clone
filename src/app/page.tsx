"use client";

import { UserButton } from "@/features/auth/components/user-button";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const { data: workspaces, isLoading } = useGetWorkspaces();

  const [open, setOpen] = useCreateWorkspaceModal();

  const workspaceId = useMemo(() => {
    if (!workspaces) return null;
    return workspaces[0]?._id;
  }, [workspaces]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [workspaceId, isLoading, open, setOpen, router]);

  return (
    <div>
      <UserButton />
    </div>
  );
};

export default Home;
