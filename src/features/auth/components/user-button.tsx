"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { useAuthActions } from "@convex-dev/auth/react";
import { LoaderIcon, LogOutIcon } from "lucide-react";
import { useCurrentUser } from "../api/use-current-user";

export const UserButton = () => {
  const { data: user, isLoading } = useCurrentUser();
  const { signOut } = useAuthActions();

  if (isLoading) {
    return <LoaderIcon className="size-4 animate-spin text-muted-foreground" />;
  }

  if (!user) {
    return null;
  }

  const { name, image } = user;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <UserAvatar
          name={name}
          image={image}
          color="sky"
          className="size-10 hover:opacity-75 transition"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem onClick={() => signOut()} className="h-10">
          <LogOutIcon className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
