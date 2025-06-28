import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { FaChevronDown } from "react-icons/fa";

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

export const Header = ({
  memberName = "Member",
  memberImage,
  onClick,
}: HeaderProps) => {
  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <Button
        variant="ghost"
        className="text-lg font-semibold px-2 overflow-hidden w-auto"
        size="sm"
        onClick={onClick}
      >
        <UserAvatar
          name={memberName}
          image={memberImage}
          color="sky"
          className="size-6 mr-2"
        />
        <span className="truncate">{memberName}</span>
        <FaChevronDown className="size-2.5 ml-2" />
      </Button>
    </div>
  );
};
