"use client";

import { Button } from "@/components/ui/button";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useJoinWorkspace } from "@/features/workspaces/api/use-join-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import VerificationInput from "react-verification-input";
import { toast } from "sonner";

const JoinPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { data: workspaceInfo, isLoading: isLoadingWorkspaceInfo } =
    useGetWorkspaceInfo({ workspaceId });
  const { mutate: joinWorkspace, isPending: isJoiningWorkspace } =
    useJoinWorkspace();

  const isMember = useMemo(() => {
    return workspaceInfo?.isMember;
  }, [workspaceInfo?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.replace(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  const handleComplete = (code: string) => {
    joinWorkspace(
      {
        workspaceId,
        joinCode: code,
      },
      {
        onSuccess: (id) => {
          toast.success("Joined workspace");
          router.replace(`/workspace/${id}`);
        },
        onError: () => {
          toast.error("Failed to join workspace");
        },
      }
    );
  };

  if (isLoadingWorkspaceInfo)
    return (
      <div className="h-full flex items-center justify-center">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src="/logo.svg" alt="logo" width={60} height={60} />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join {workspaceInfo?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter the code to join the workspace
          </p>
        </div>
        <VerificationInput
          length={6}
          classNames={{
            container: cn(
              "flex gap-x-2",
              isJoiningWorkspace && "cursor-not-allowed opacity-50"
            ),
            character:
              "uppercase h-auto border border-gray-300 flex items-center justify-center rounded-md text-lg font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          autoFocus
          onComplete={handleComplete}
        />
      </div>
      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
