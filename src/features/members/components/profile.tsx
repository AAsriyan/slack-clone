import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/user-avatar";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {
  AlertTriangleIcon,
  ChevronDownIcon,
  LoaderIcon,
  MailIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { useCurrentMember } from "../api/use-current-member";
import { useGetMember } from "../api/use-get-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useUpdateMember } from "../api/use-update-member";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [UpdateDialog, confirmUpdate] = useConfirm(
    "Change role",
    "Are you sure you want to change this member's role?"
  );
  const [LeaveDialog, confirmLeave] = useConfirm(
    "Leave workspace",
    "Are you sure you want to leave this workspace?"
  );
  const [RemoveDialog, confirmRemove] = useConfirm(
    "Remove member",
    "Are you sure you want to remove this member?"
  );

  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({ workspaceId });
  const { data: member, isLoading: isLoadingMember } = useGetMember({
    memberId,
  });

  const { mutate: updateMember } = useUpdateMember();
  const { mutate: removeMember } = useRemoveMember();

  const handleUpdateMember = async (role: "admin" | "member") => {
    const ok = await confirmUpdate();
    if (!ok) return;

    updateMember(
      {
        memberId,
        role,
      },
      {
        onSuccess: () => {
          toast.success("Role changed");
          onClose();
        },
        onError: () => {
          toast.error("Failed to change role");
        },
      }
    );
  };

  const handleRemoveMember = async () => {
    const ok = await confirmRemove();
    if (!ok) return;

    removeMember(
      {
        memberId,
      },
      {
        onSuccess: () => {
          toast.success("Member removed");
          onClose();
        },
        onError: () => {
          toast.error("Failed to remove member");
        },
      }
    );
  };

  const handleLeaveWorkspace = async () => {
    const ok = await confirmLeave();
    if (!ok) return;

    removeMember(
      {
        memberId,
      },
      {
        onSuccess: () => {
          toast.success("You have left the workspace");
          onClose();
          router.push("/");
        },
        onError: () => {
          toast.error("Failed to leave workspace");
        },
      }
    );
  };

  if (isLoadingMember || isLoadingCurrentMember) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 border-b h-[49px]">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} variant="ghost" size="iconSm">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 items-center justify-center h-full">
          <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 border-b h-[49px]">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} variant="ghost" size="iconSm">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 items-center justify-center h-full">
          <AlertTriangleIcon className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RemoveDialog />
      <UpdateDialog />
      <LeaveDialog />
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 border-b h-[49px]">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} variant="ghost" size="iconSm">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <UserAvatar
            name={member.user.name}
            image={member.user.image}
            size="profile"
            color="sky"
            className="max-w-[256px] max-h-[256px]"
            fallbackClassName="aspect-square text-6xl"
          />
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>
          {/* Action buttons based on current member's role and identity */}
          {currentMember?.role === "admin" &&
            currentMember._id !== memberId && (
              <div className="flex items-center gap-2 pt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full capitalize">
                      {member.role} <ChevronDownIcon className="size-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuRadioGroup
                      value={member.role}
                      onValueChange={(role) =>
                        handleUpdateMember(role as "admin" | "member")
                      }
                    >
                      <DropdownMenuRadioItem value="admin">
                        Admin
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="member">
                        Member
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  className="w-full capitalize"
                  onClick={handleRemoveMember}
                >
                  Remove
                </Button>
              </div>
            )}
          {currentMember?._id === memberId &&
            currentMember.role !== "admin" && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full capitalize"
                  onClick={handleLeaveWorkspace}
                >
                  Leave
                </Button>
              </div>
            )}
          <p className="text-sm text-muted-foreground">{member.user.email}</p>
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4">Contact information</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-muted-foreground">
                Email Address
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-sm text-[#1264A3] hover:underline"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
