import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { Id } from "../../../../convex/_generated/dataModel";

interface UserItemProps {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
}

const userItemVariants = cva(
  "flex items-center justify-start gap-1.5 font-normal h-7 px-4 text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#F9EDFFCC]",
        active: "bg-white/90 text-[#481349] hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const UserItem = ({
  id,
  label = "Member",
  image,
  variant = "default",
}: UserItemProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      variant="transparent"
      size="sm"
      className={cn(userItemVariants({ variant }))}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <UserAvatar
          name={label}
          image={image}
          color="sky"
          className="size-5 mr-1"
        />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};
