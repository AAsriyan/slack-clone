import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cva, type VariantProps } from "class-variance-authority";

const avatarVariants = cva("shrink-0", {
  variants: {
    size: {
      default: "size-6",
      xs: "size-4",
      sm: "size-5",
      lg: "size-8",
      profile: "size-64",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const fallbackVariants = cva("text-white", {
  variants: {
    color: {
      default: "bg-sky-500",
      sky: "bg-sky-500",
      gray: "bg-gray-400",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

interface UserAvatarProps
  extends VariantProps<typeof avatarVariants>,
    VariantProps<typeof fallbackVariants> {
  name?: string;
  image?: string;
  className?: string;
  fallbackClassName?: string;
}

export const UserAvatar = ({
  name,
  image,
  size,
  color,
  className,
  fallbackClassName,
}: UserAvatarProps) => {
  const fallback = name?.charAt(0) ?? "M";

  return (
    <Avatar className={avatarVariants({ size, className })}>
      <AvatarImage src={image} />
      <AvatarFallback
        className={fallbackVariants({ color, className: fallbackClassName })}
      >
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
};
