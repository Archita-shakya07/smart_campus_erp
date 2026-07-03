"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import { Menu, X, LayoutDashboard, Calendar, CheckSquare, Users, Bell, FileText, User } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background: "#0D5C63"}}>
            <span className="text-white font-bold text-lg">SC</span>
          </div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const navigationTabs = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Timetable", path: "/timetable", icon: <Calendar size={18} /> },
    { name: "Tasks", path: "/tasks", icon: <CheckSquare size={18} /> },
    { name: "Attendance", path: "/attendance", icon: <Users size={18} /> },
    { name: "Notices", path: "/notices", icon: <Bell size={18} /> },
    { name: "Notes", path: "/notes", icon: <FileText size={18} /> },
    { name: "Profile", path: "/profile", icon: <User size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      
      {/* 📱 Mobile Top Bar */}
      <div className="md:hidden w-full text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-50" style={{ background: "#0D5C63" }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">🎓</span>
          <span className="font-bold text-sm tracking-wider uppercase">Smart Campus</span>
        </div>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
          {isMobileOpen ? <X size={20} className="text-pink-400" /> : <Menu size={20} className="text-emerald-300" />}
        </button>
      </div>

      {/* 💻 Main Layout Container */}
      <div className="flex flex-1 w-full">
        
        {/* 🧭 Fixed Desktop Sidebar */}
        <div className="hidden md:block w-64 h-screen sticky top-0 shrink-0 z-20">
          <Sidebar />
        </div>

        {/* 🚀 Main Content Area (Fixed layout overlap) */}
        <main className="flex-1 min-w-0 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>

        {/* 🚪 Mobile Drawer Menu (As It Is) */}
        <div className={`md:hidden fixed inset-y-0 left-0 w-64 z-50 p-5 transform transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-2xl ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ background: "#0D5C63" }}>
          <div>
            <div className="flex items-center gap-2.5 mb-8 pb-4 border-b border-white/10">
              <span className="text-2xl">🎓</span>
              <div>
                <h2 className="font-bold text-sm text-white tracking-wider uppercase">Smart Campus</h2>
                <span className="text-[10px] text-emerald-300 uppercase tracking-widest font-semibold">ERP System</span>
              </div>
            </div>
            <nav className="space-y-1">
              {navigationTabs.map((tab) => {
                const isActive = pathname === tab.path;
                return (
                  <button key={tab.name} onClick={() => router.push(tab.path)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${isActive ? 'bg-white/10 text-emerald-300 border-l-4 border-emerald-400' : 'text-slate-300 hover:bg-white/5'}`}>
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Backdrop */}
        {isMobileOpen && <div className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40" onClick={() => setIsMobileOpen(false)} />}
      </div>
    </div>
  );
}