import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAvatarUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";

export function UserAvatar({
  avatarPath,
  name,
  className,
}: {
  avatarPath?: string | null;
  name?: string | null;
  className?: string;
}) {
  const url = useAvatarUrl(avatarPath);
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={url} alt={name ?? "User"} />
      <AvatarFallback className="bg-primary/15 text-primary font-semibold">
        {(name ?? "U").slice(0, 1).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
