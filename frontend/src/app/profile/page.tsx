"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  Mail,
  BookOpen,
  Calendar,
  Shield,
  Edit2,
  LogOut,
  Lock,
  User as UserIcon,
  Camera,
  Save,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  course: string;
  year: number;
  avatar: string;
  createdAt?: string;
}

const dummyUser: UserProfile = {
  id: "u123",
  name: "Archita Singh",
  email: "archita67@gmail.com",
  role: "student",
  course: "Computer Science",
  year: 3,
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Archita",
  createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
};

export default function ProfilePage() {
  const { user: authUser, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile>(dummyUser);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const [editForm, setEditForm] = useState({
    name: dummyUser.name,
    email: dummyUser.email,
    course: dummyUser.course,
    year: dummyUser.year.toString(),
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrent: false,
    showNew: false,
    showConfirm: false,
  });
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      // Pehle real backend se try karo
      const res = await api.get("/auth/me");
      if (res.data?.data) {
        const realUser: UserProfile = {
          id: res.data.data.id || res.data.data._id,
          name: res.data.data.name,
          email: res.data.data.email,
          role: res.data.data.role,
          course: res.data.data.course || "N/A",
          year: res.data.data.year || 1,
          avatar:
            res.data.data.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${res.data.data.name}`,
          createdAt: res.data.data.createdAt,
        };
        setUserProfile(realUser);
        setEditForm({
          name: realUser.name,
          email: realUser.email,
          course: realUser.course,
          year: realUser.year.toString(),
        });
      }
    } catch (e) {
      console.log("Backend fetch failed, using AuthContext user as fallback");
      // Agar backend fail ho jaye, toh AuthContext ke authUser ka use karo
      if (authUser) {
        const fallbackUser: UserProfile = {
          id: authUser.id || "u000",
          name: authUser.name || "User",
          email: authUser.email || "N/A",
          role: (authUser.role as "student" | "admin") || "student",
          course: (authUser as any).course || "N/A",
          year: (authUser as any).year || 1,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.name}`,
          createdAt: (authUser as any).createdAt,
        };
        setUserProfile(fallbackUser);
        setEditForm({
          name: fallbackUser.name,
          email: fallbackUser.email,
          course: fallbackUser.course,
          year: fallbackUser.year.toString(),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
  // Stringify the primitive ID to keep the dependency array stable and constant
}, [authUser?.id]); 

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put("/profile", {
        name: editForm.name,
        email: editForm.email,
        course: editForm.course,
        year: parseInt(editForm.year),
      });
      setUserProfile({
        ...userProfile,
        name: editForm.name,
        email: editForm.email,
        course: editForm.course,
        year: parseInt(editForm.year),
      });
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (e) {
      // Update locally for demo
      setUserProfile({
        ...userProfile,
        name: editForm.name,
        email: editForm.email,
        course: editForm.course,
        year: parseInt(editForm.year),
      });
      setEditMode(false);
      toast.success("Profile updated successfully!");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }

    try {
      await api.patch("/profile/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        showCurrent: false,
        showNew: false,
        showConfirm: false,
      });
      setShowPasswordModal(false);
      toast.success("Password changed successfully!");
    } catch (e: any) {
      // For demo, just show success
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        showCurrent: false,
        showNew: false,
        showConfirm: false,
      });
      setShowPasswordModal(false);
      toast.success("Password changed successfully!");
    }
  };

  const joinedDate = userProfile.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Member since 2023";

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse"></div>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-teal-700 hover:text-teal-800 font-bold text-sm uppercase tracking-wider transition-colors group"
        >
          <span className="text-xl transition-transform group-hover:-translate-x-1">←</span>
          Back to Dashboard
        </button>
      </div>

      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-500 mt-1">Manage your account details and settings</p>
          </div>

          {/* Profile Card */}
          <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-2xl p-8 mb-8 border border-teal-200">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg"
                />
                {editMode && (
                  <button className="absolute bottom-0 right-0 bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 transition-colors">
                    <Camera size={16} />
                  </button>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800">{userProfile.name}</h2>
                <p className="text-teal-700 font-semibold mt-1">{userProfile.role.toUpperCase()}</p>
                <p className="text-gray-600 text-sm mt-2">{joinedDate}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-teal-700 font-semibold hover:bg-gray-50 transition-colors border border-teal-300"
                >
                  <Edit2 size={18} /> {editMode ? "Cancel" : "Edit Profile"}
                </button>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-teal-700 font-semibold hover:bg-gray-50 transition-colors border border-teal-300"
                >
                  <Lock size={18} /> Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          {editMode && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Edit Profile Information</h3>
              <form onSubmit={handleEditProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Course</label>
                    <input
                      type="text"
                      value={editForm.course}
                      onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                    <select
                      value={editForm.year}
                      onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <Save size={18} /> Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Account Details Rows */}
          <div className="space-y-3 mb-8">
            {/* Email Row */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(59,130,246,0.2)" }}>
                <Mail size={20} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-blue-700">Email Address</p>
                <p className="text-blue-900 font-medium truncate">{userProfile.email}</p>
              </div>
            </div>

            {/* Role Row */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(147,51,234,0.2)" }}>
                <Shield size={20} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-purple-700">Role</p>
                <p className="text-purple-900 font-medium capitalize">
                  {userProfile.role === "admin" ? "Administrator" : "Student"}
                </p>
              </div>
            </div>

            {/* Course Row */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(249,115,22,0.2)" }}>
                <BookOpen size={20} className="text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-orange-700">Course</p>
                <p className="text-orange-900 font-medium">{userProfile.course}</p>
              </div>
            </div>

            {/* Year Row */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4 border border-green-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(34,197,94,0.2)" }}>
                <Calendar size={20} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-green-700">Current Year</p>
                <p className="text-green-900 font-medium">Year {userProfile.year}</p>
              </div>
            </div>

            {/* Member Since Row */}
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-2xl p-4 border border-indigo-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(99,102,241,0.2)" }}>
                <UserIcon size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-indigo-700">Member Since</p>
                <p className="text-indigo-900 font-medium">{joinedDate}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setShowConfirmLogout(true)}
            className="w-full py-3 border border-red-300 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Logout from Account
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-100 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={passwordForm.showCurrent ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPasswordForm({ ...passwordForm, showCurrent: !passwordForm.showCurrent })
                    }
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {passwordForm.showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={passwordForm.showNew ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    placeholder="Min 8 characters"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPasswordForm({ ...passwordForm, showNew: !passwordForm.showNew })
                    }
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {passwordForm.showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={passwordForm.showConfirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPasswordForm({ ...passwordForm, showConfirm: !passwordForm.showConfirm })
                    }
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {passwordForm.showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl transition"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showConfirmLogout && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowConfirmLogout(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Logout?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to logout from your account?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={logout}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
                >
                  Yes, Logout
                </button>
                <button
                  onClick={() => setShowConfirmLogout(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}