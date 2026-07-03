"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { GraduationCap, BookOpen, Users, Award, Lock, BarChart3, AlertCircle } from "lucide-react";

const STREAM_OPTIONS = ["Science", "Commerce", "Arts", "Engineering", "Medical"];

// Fixed passkeys - change these to your desired values
const PASSKEYS = {
  student: "STUDENT2024",
  admin: "ADMIN2024",
};

export default function RegisterPage() {
  const [role, setRole] = useState<"student" | "admin" | null>(null);
  const [passkey, setPasskey] = useState("");
  const [passKeyError, setPassKeyError] = useState("");
  const [showPassKey, setShowPassKey] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rollNumber: "",
    dob: "",
    stream: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleRoleSelect = (selectedRole: "student" | "admin") => {
    setRole(selectedRole);
    setPasskey("");
    setPassKeyError("");
  };

  const validatePasskey = () => {
    if (!role) return false;
    const correctPasskey = role === "admin" ? PASSKEYS.admin : PASSKEYS.student;

    if (passkey.trim() === "") {
      setPassKeyError("Passkey is required");
      return false;
    }
    if (passkey.toUpperCase() !== correctPasskey) {
      setPassKeyError("❌ Invalid passkey for this role.");
      return false;
    }
    setPassKeyError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast.error("Please select a role");
      return;
    }
    if (!validatePasskey()) {
      return;
    }
    if (!form.stream) {
      toast.error("Please select stream");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        ...form,
        role: role,
      });
      login(res.data.data.token, res.data.data.user);
      toast.success("Account created successfully!");

      const dashboardRoute = role === "admin" ? "/admin-dashboard" : "/dashboard";
      router.push(dashboardRoute);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{background: "linear-gradient(135deg, #0D5C63 0%, #134E4A 40%, #0a3d44 100%)"}}>

        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full opacity-10" style={{background: "radial-gradient(circle, #22C55E, transparent)"}}></div>
        <div className="absolute bottom-[-100px] right-[-60px] w-80 h-80 rounded-full opacity-10" style={{background: "radial-gradient(circle, #22C55E, transparent)"}}></div>
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)", backgroundSize: "40px 40px"}}></div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: "rgba(255,255,255,0.15)"}}>
              <GraduationCap className="text-white" size={22} />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">Smart Campus</p>
              <p className="text-xs" style={{color: "rgba(255,255,255,0.6)"}}>ERP System</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-white leading-tight">
                Join<br />
                <span style={{color: "#22C55E"}}>Smart Campus</span><br />
                Today
              </h1>
              <p className="mt-4 text-lg" style={{color: "rgba(255,255,255,0.7)"}}>
                Create your account and start managing your academic life smarter.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: BookOpen, text: "Track all your assignments & deadlines" },
                { icon: Award, text: "Monitor attendance across all subjects" },
                { icon: Users, text: "Stay updated with college notices" },
                { icon: GraduationCap, text: "Manage your weekly timetable" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background: "rgba(34,197,94,0.2)"}}>
                    <item.icon size={16} style={{color: "#22C55E"}} />
                  </div>
                  <p className="text-sm" style={{color: "rgba(255,255,255,0.8)"}}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm" style={{color: "rgba(255,255,255,0.4)"}}>© 2026 Smart Campus ERP. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">

          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: "#0D5C63"}}>
              <GraduationCap className="text-white" size={22} />
            </div>
            <p className="font-bold text-lg text-gray-800">Smart Campus ERP</p>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 mt-2">Fill in your details to get started</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6 space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Select Your Role</label>

            <button
              type="button"
              onClick={() => handleRoleSelect("student")}
              className={`w-full p-4 rounded-xl border-2 transition ${
                role === "student"
                  ? "border-teal-600 bg-teal-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background: "rgba(13,92,99,0.1)"}}>
                  <GraduationCap size={20} style={{color: "#0D5C63"}} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Student</p>
                  <p className="text-xs text-gray-500">Access coursework & grades</p>
                </div>
                {role === "student" && (
                  <div className="ml-auto w-5 h-5 rounded-full" style={{background: "#0D5C63"}} />
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("admin")}
              className={`w-full p-4 rounded-xl border-2 transition ${
                role === "admin"
                  ? "border-teal-600 bg-teal-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background: "rgba(13,92,99,0.1)"}}>
                  <Lock size={20} style={{color: "#0D5C63"}} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Administrator</p>
                  <p className="text-xs text-gray-500">Manage system & students</p>
                </div>
                {role === "admin" && (
                  <div className="ml-auto w-5 h-5 rounded-full" style={{background: "#0D5C63"}} />
                )}
              </div>
            </button>
          </div>

          {/* NEW: Passkey field - only shows once role picked */}
          {role && (
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Lock size={16} />
                  Access Passkey
                  (Temporary : STUDENT2024 / ADMIN2024)
                </div>
              </label>
              <input
                type="text"
                required
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value.toUpperCase());
                  setPassKeyError("");
                }}
                className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none bg-white text-gray-800 transition-colors font-semibold tracking-wider uppercase ${
                  passKeyError ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-teal-600"
                }`}
                placeholder={`Enter ${role} passkey`}
              />
              <p className="text-xs text-gray-400 mt-1">
                Ask your institution admin for the correct passkey for this role.
              </p>
              {passKeyError && (
                <div className="mt-2 flex items-start gap-2 p-3 rounded-lg" style={{background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)"}}>
                  <AlertCircle size={16} style={{color: "#EF4444", marginTop: "2px", flexShrink: 0}} />
                  <p className="text-sm font-semibold" style={{color: "#DC2626"}}>{passKeyError}</p>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-600 bg-white text-gray-800 transition-colors"
                placeholder="Your full name"
              />
            </div>

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
                placeholder="Min 8 chars, 1 uppercase, 1 number"
              />
              <p className="text-xs text-gray-400 mt-1">Must have 1 uppercase letter and 1 number</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Roll Number</label>
              <input
                type="text"
                required
                value={form.rollNumber}
                onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-600 bg-white text-gray-800 transition-colors"
                placeholder="e.g. 21CS045"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                required
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-600 bg-white text-gray-800 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stream</label>
                <select
                  required
                  value={form.stream}
                  onChange={(e) => setForm({ ...form, stream: e.target.value })}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-600 bg-white text-gray-800 transition-colors"
                >
                  <option value="" disabled>Select stream</option>
                  {STREAM_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {!role && (
              <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <p className="text-xs text-yellow-700">
                  ⚠️ Please select a role before creating your account
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !role}
              className="w-full py-3.5 font-bold rounded-xl text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 text-base"
              style={{background: "linear-gradient(135deg, #0D5C63, #134E4A)"}}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating account...
                </span>
              ) : "Create Account →"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <a href="/login" className="font-bold hover:underline" style={{color: "#0D5C63"}}>
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}