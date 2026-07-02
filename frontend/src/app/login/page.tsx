"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { GraduationCap, BookOpen, Users, Award, Lock, BarChart3, AlertCircle, CheckCircle2 } from "lucide-react";

// Fixed passkeys - change these to your desired values
const PASSKEYS = {
  student: "STUDENT2024",
  admin: "ADMIN2024",
};

export default function LoginPage() {
  const [step, setStep] = useState<"role" | "login">("role");
  const [role, setRole] = useState<"student" | "admin" | null>(null);
  const [form, setForm] = useState({ email: "", password: "", passkey: "" });
  const [loading, setLoading] = useState(false);
  const [passKeyError, setPassKeyError] = useState("");
  const [showPassKey, setShowPassKey] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleRoleSelect = (selectedRole: "student" | "admin") => {
    setRole(selectedRole);
    setStep("login");
    setForm({ email: "", password: "", passkey: "" });
    setPassKeyError("");
    setShowPassKey(false);
  };

  const handleGoBack = () => {
    setStep("role");
    setRole(null);
    setForm({ email: "", password: "", passkey: "" });
    setPassKeyError("");
    setShowPassKey(false);
  };

  const validatePasskey = () => {
    const correctPasskey = role === "admin" ? PASSKEYS.admin : PASSKEYS.student;
    
    if (form.passkey.trim() === "") {
      setPassKeyError("Passkey is required");
      return false;
    }
    
    if (form.passkey !== correctPasskey) {
      setPassKeyError("❌ Invalid passkey. Please try again.");
      return false;
    }
    
    setPassKeyError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passkey first
    if (!validatePasskey()) {
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
        role: role,
      });
      login(res.data.data.token, res.data.data.user);
      toast.success("Welcome back!");
      
      // Route based on role
      const dashboardRoute = role === "admin" ? "/admin-dashboard" : "/dashboard";
      router.push(dashboardRoute);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{background: "linear-gradient(135deg, #0D5C63 0%, #134E4A 40%, #0a3d44 100%)"}}>
        
        {/* Decorative circles */}
        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full opacity-10" style={{background: "radial-gradient(circle, #22C55E, transparent)"}}></div>
        <div className="absolute bottom-[-100px] right-[-60px] w-80 h-80 rounded-full opacity-10" style={{background: "radial-gradient(circle, #22C55E, transparent)"}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5" style={{background: "radial-gradient(circle, white, transparent)"}}></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)", backgroundSize: "40px 40px"}}></div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: "rgba(255,255,255,0.15)"}}>
              <GraduationCap className="text-white" size={22} />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">Smart Campus</p>
              <p className="text-xs" style={{color: "rgba(255,255,255,0.6)"}}>ERP System</p>
            </div>
          </div>

          {/* Center content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-white leading-tight">
                Welcome to<br />
                <span style={{color: "#22C55E"}}>Smart Campus</span><br />
                ERP
              </h1>
              <p className="mt-4 text-lg" style={{color: "rgba(255,255,255,0.7)"}}>
                Your complete academic management platform. Track everything from one place.
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BookOpen, label: "Tasks & Assignments", desc: "Never miss a deadline" },
                { icon: Award, label: "Attendance Tracker", desc: "Stay above 75%" },
                { icon: Users, label: "Notice Board", desc: "Stay updated" },
                { icon: GraduationCap, label: "Timetable", desc: "Plan your day" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl p-4" style={{background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)"}}>
                  <item.icon size={20} style={{color: "#22C55E"}} />
                  <p className="text-white font-semibold text-sm mt-2">{item.label}</p>
                  <p className="text-xs mt-1" style={{color: "rgba(255,255,255,0.5)"}}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <p className="text-sm" style={{color: "rgba(255,255,255,0.4)"}}>© 2026 Smart Campus ERP. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: "#0D5C63"}}>
              <GraduationCap className="text-white" size={22} />
            </div>
            <div>
              <p className="font-bold text-lg text-gray-800 leading-none">Smart Campus ERP</p>
            </div>
          </div>

          {/* ROLE SELECTION STEP */}
          {step === "role" ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Welcome</h2>
                <p className="text-gray-500 mt-2">Select your role to continue</p>
              </div>

              <div className="space-y-4">
                {/* Student Role Button */}
                <button
                  onClick={() => handleRoleSelect("student")}
                  className="w-full p-6 rounded-2xl border-2 border-gray-200 hover:border-teal-600 hover:bg-teal-50 transition-all duration-300 text-left group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background: "rgba(13,92,99,0.1)"}}>
                          <GraduationCap size={22} style={{color: "#0D5C63"}} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Login as Student</h3>
                      </div>
                      <p className="text-sm text-gray-500 ml-13">Access your assignments, attendance & grades</p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-teal-600 group-hover:bg-teal-600 transition-all"></div>
                  </div>
                </button>

                {/* Admin Role Button */}
                <button
                  onClick={() => handleRoleSelect("admin")}
                  className="w-full p-6 rounded-2xl border-2 border-gray-200 hover:border-teal-600 hover:bg-teal-50 transition-all duration-300 text-left group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background: "rgba(13,92,99,0.1)"}}>
                          <Lock size={22} style={{color: "#0D5C63"}} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Login as Administrator</h3>
                      </div>
                      <p className="text-sm text-gray-500 ml-13">Manage students, courses & system settings</p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-teal-600 group-hover:bg-teal-600 transition-all"></div>
                  </div>
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                  Don't have an account?{" "}
                  <a href="/register" className="font-bold hover:underline" style={{color: "#0D5C63"}}>
                    Create Account
                  </a>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* LOGIN FORM STEP */}
              <div className="mb-8">
                <button
                  onClick={handleGoBack}
                  className="flex items-center gap-2 text-sm font-semibold mb-4 hover:opacity-70 transition"
                  style={{color: "#0D5C63"}}
                >
                  ← Back
                </button>
                <h2 className="text-3xl font-bold text-gray-800">
                  {role === "admin" ? "Admin Login" : "Student Login"}
                </h2>
                <p className="text-gray-500 mt-2">Enter your credentials to access your dashboard</p>
              </div>

              {/* Role Badge */}
              <div className="mb-6 p-3 rounded-lg" style={{background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)"}}>
                <div className="flex items-center gap-2">
                  {role === "admin" ? (
                    <BarChart3 size={18} style={{color: "#22C55E"}} />
                  ) : (
                    <GraduationCap size={18} style={{color: "#22C55E"}} />
                  )}
                  <span className="text-sm font-semibold" style={{color: "#059669"}}>
                    Logging in as {role === "admin" ? "Administrator" : "Student"}
                  </span>
                </div>
              </div>

              {/* PASSKEY INFO BOX - Displayed temporarily */}
              <div className="mb-6 p-4 rounded-xl" style={{background: "rgba(59,130,246,0.08)", border: "1.5px solid rgba(59,130,246,0.3)"}}>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Lock size={18} style={{color: "#3B82F6"}} />
                    <span className="text-sm font-bold" style={{color: "#1E40AF"}}>Access Passkey</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassKey(!showPassKey)}
                    className="text-xs font-semibold px-2 py-1 rounded-md transition-all"
                    style={{
                      color: "#3B82F6",
                      background: "rgba(59,130,246,0.15)",
                      border: "1px solid rgba(59,130,246,0.3)"
                    }}
                  >
                    {showPassKey ? "Hide" : "Show"}
                  </button>
                </div>
                
                {showPassKey ? (
                  <div className="p-3 rounded-lg" style={{background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)"}}>
                    <p className="text-xs text-gray-600 mb-2">Your passkey for this session:</p>
                    <p className="text-xl font-bold tracking-widest" style={{color: "#059669", fontFamily: "monospace", letterSpacing: "0.15em"}}>
                      {role === "admin" ? PASSKEYS.admin : PASSKEYS.student}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">⚠️ Keep this passkey confidential</p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">Click "Show" to reveal your passkey</p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-600 bg-white text-gray-800 transition-colors"
                    placeholder="you@college.edu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-600 bg-white text-gray-800 transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                {/* NEW: Passkey Input Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Lock size={16} />
                      Access Passkey
                    </div>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.passkey}
                    onChange={(e) => {
                      setForm({ ...form, passkey: e.target.value });
                      setPassKeyError(""); // Clear error when user starts typing
                    }}
                    className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none bg-white text-gray-800 transition-colors font-semibold tracking-wider uppercase ${
                      passKeyError
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-teal-600"
                    }`}
                    placeholder="Enter your passkey"
                  />
                  
                  {/* Error Message */}
                  {passKeyError && (
                    <div className="mt-2 flex items-start gap-2 p-3 rounded-lg" style={{background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)"}}>
                      <AlertCircle size={16} style={{color: "#EF4444", marginTop: "2px", flexShrink: 0}} />
                      <p className="text-sm font-semibold" style={{color: "#DC2626"}}>
                        {passKeyError}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 font-bold rounded-xl text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 text-base"
                  style={{background: "linear-gradient(135deg, #0D5C63, #134E4A)"}}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Signing in...
                    </span>
                  ) : "Sign In →"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  Don't have an account?{" "}
                  <a href="/register" className="font-bold hover:underline" style={{color: "#0D5C63"}}>
                    Create Account
                  </a>
                </p>
              </div>

              {/* Demo hint */}
              <div className="mt-8 p-4 rounded-xl" style={{background: "rgba(13,92,99,0.06)", border: "1px solid rgba(13,92,99,0.15)"}}>
                <p className="text-xs font-semibold mb-3" style={{color: "#0D5C63"}}>Demo Credentials</p>
                {role === "admin" ? (
                  <>
                    <div className="space-y-1.5">
                      <div>
                        <p className="text-xs font-semibold text-gray-600">Email:</p>
                        <p className="text-xs text-gray-500 font-mono">admin@test.com</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600">Password:</p>
                        <p className="text-xs text-gray-500 font-mono">AdminPass1</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600">Passkey:</p>
                        <p className="text-xs text-gray-500 font-mono font-bold">{PASSKEYS.admin}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <div>
                        <p className="text-xs font-semibold text-gray-600">Email:</p>
                        <p className="text-xs text-gray-500 font-mono">student@test.com</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600">Password:</p>
                        <p className="text-xs text-gray-500 font-mono">StudentPass1</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600">Passkey:</p>
                        <p className="text-xs text-gray-500 font-mono font-bold">{PASSKEYS.student}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
