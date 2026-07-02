"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Bell, User } from "lucide-react";

const items = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/notices", icon: Bell, label: "Notices" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-gray-200 bg-white">
      <div className="flex">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center py-3 gap-1"
              style={{color: active ? "#0D5C63" : "#94a3b8"}}
            >
              <item.icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
              {active && <div className="w-1 h-1 rounded-full" style={{background: "#0D5C63"}}></div>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}