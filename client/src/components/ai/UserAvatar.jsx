import { User } from "lucide-react";

function UserAvatar() {
  return (
    <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
      <User size={18} className="text-white" />
    </div>
  );
}

export default UserAvatar;