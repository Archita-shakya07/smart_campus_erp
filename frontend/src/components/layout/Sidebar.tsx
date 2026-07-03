"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, BookOpen, CheckSquare, UserCheck,
  Bell, FileText, User, LogOut, GraduationCap
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/timetable", icon: BookOpen, label: "Timetable" },
  { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/attendance", icon: UserCheck, label: "Attendance" },
  { href: "/notices", icon: Bell, label: "Notices" },
  { href: "/notes", icon: FileText, label: "Notes" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="sidebar flex flex-col w-64 h-screen sticky top-0 flex-shrink-0">
      {/* Logo */}
      <div className="p-4 sm:p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background: "rgba(255,255,255,0.15)"}}>
            <GraduationCap size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">Smart Campus</p>
            <p className="text-xs mt-0.5" style={{color: "rgba(255,255,255,0.5)"}}>ERP System</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
              style={{
                background: active ? "rgba(255,255,255,0.15)" : "transparent",
                color: active ? "white" : "rgba(255,255,255,0.6)",
              }}
            >
              <item.icon size={18} className="flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"></div>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 sm:p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-2" style={{background: "rgba(255,255,255,0.08)"}}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{background: "rgba(255,255,255,0.2)"}}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-xs truncate" style={{color: "rgba(255,255,255,0.5)"}}>{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl w-full transition-all"
          style={{color: "rgba(255,255,255,0.6)"}}
        >
          <LogOut size={16} className="flex-shrink-0" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}