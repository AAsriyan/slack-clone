"use client";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

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
    <div className="h-full flex items-center justify-center">
      <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};

export default Home;
