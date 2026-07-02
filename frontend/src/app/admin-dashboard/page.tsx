"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Users, BookOpen, TrendingUp, AlertCircle, BarChart3, Bell, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

// Dummy data
const DUMMY_STATS = {
  totalStudents: 1234,
  activeCourses: 24,
  avgAttendance: 82,
  alerts: 7,
};

const DUMMY_ACTIVITIES = [
  { id: 1, action: "New student registered", name: "John Doe", time: "2 hours ago", type: "info" },
  { id: 2, action: "Course updated", name: "Physics 101", time: "5 hours ago", type: "info" },
  { id: 3, action: "Attendance alert", name: "Class XI-A", time: "1 hour ago", type: "alert" },
  { id: 4, action: "Assignment submitted", name: "Math Assignment 5", time: "30 mins ago", type: "info" },
  { id: 5, action: "New notice posted", name: "Exam Schedule", time: "45 mins ago", type: "info" },
];

const DUMMY_SYSTEM_HEALTH = [
  { name: "Server Status", value: 98, status: "healthy" },
  { name: "Database Performance", value: 95, status: "healthy" },
  { name: "API Response Time", value: 89, status: "healthy" },
  { name: "Backup Status", value: 100, status: "healthy" },
];

const DUMMY_RECENT_STUDENTS = [
  { id: 1, name: "Rahul Kumar", email: "rahul@college.edu", joinDate: "2 days ago", status: "active" },
  { id: 2, name: "Priya Singh", email: "priya@college.edu", joinDate: "5 days ago", status: "active" },
  { id: 3, name: "Amit Patel", email: "amit@college.edu", joinDate: "1 week ago", status: "active" },
  { id: 4, name: "Neha Sharma", email: "neha@college.edu", joinDate: "10 days ago", status: "active" },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(DUMMY_STATS);
  const [activities, setActivities] = useState(DUMMY_ACTIVITIES);
  const [systemHealth, setSystemHealth] = useState(DUMMY_SYSTEM_HEALTH);
  const [recentStudents, setRecentStudents] = useState(DUMMY_RECENT_STUDENTS);
  const [loading, setLoading] = useState(true);

  // ✅ Role check - redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Attempt to fetch from API
        const statsRes = await api.get("/admin/stats");
        const activitiesRes = await api.get("/admin/activities");
        const healthRes = await api.get("/admin/system-health");
        const studentsRes = await api.get("/admin/recent-students");

        setStats(statsRes.data.data || DUMMY_STATS);
        setActivities(activitiesRes.data.data || DUMMY_ACTIVITIES);
        setSystemHealth(healthRes.data.data || DUMMY_SYSTEM_HEALTH);
        setRecentStudents(studentsRes.data.data || DUMMY_RECENT_STUDENTS);
      } catch (e) {
        // Use dummy data on error
        setStats(DUMMY_STATS);
        setActivities(DUMMY_ACTIVITIES);
        setSystemHealth(DUMMY_SYSTEM_HEALTH);
        setRecentStudents(DUMMY_RECENT_STUDENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const adminStats = [
    { label: "Total Students", value: stats.totalStudents, icon: Users, color: "#0D5C63" },
    { label: "Active Courses", value: stats.activeCourses, icon: BookOpen, color: "#22C55E" },
    { label: "Avg Attendance", value: `${stats.avgAttendance}%`, icon: TrendingUp, color: "#06B6D4" },
    { label: "Alerts", value: stats.alerts, icon: AlertCircle, color: "#F59E0B", badge: "Action Needed" },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse"></div>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard 🔐</h1>
        <p className="text-gray-400 mt-1 text-sm">Manage students, courses, and monitor system health</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {adminStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{background: `${stat.color}15`}}
                >
                  <Icon size={24} style={{color: stat.color}} />
                </div>
                {stat.badge && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-semibold">
                    {stat.badge}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock size={24} style={{color: "#0D5C63"}} />
              Recent Activities
            </h2>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: activity.type === "alert" ? "rgba(239,68,68,0.1)" : "rgba(13,92,99,0.1)",
                      }}
                    >
                      <span
                        style={{
                          color: activity.type === "alert" ? "#EF4444" : "#0D5C63",
                          fontSize: "18px",
                        }}
                      >
                        {activity.type === "alert" ? "!" : "✓"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{activity.action}</h3>
                      <p className="text-sm text-gray-500">{activity.name}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BarChart3 size={24} style={{color: "#0D5C63"}} />
              System Health
            </h2>
            <div className="space-y-5">
              {systemHealth.map((health) => (
                <div key={health.name}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-800">{health.name}</h3>
                    <span className="text-xs font-bold text-green-600">{health.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${health.value}%`,
                        background: health.value > 90 ? "#22C55E" : health.value > 70 ? "#F59E0B" : "#EF4444",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Students */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Users size={24} style={{color: "#0D5C63"}} />
            Recent Student Registrations
          </h2>
          <a href="#" className="text-xs font-semibold" style={{color: "#0D5C63"}}>View All</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Join Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-gray-800">{student.name}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-gray-600">{student.email}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-gray-500">{student.joinDate}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Add Student", color: "#0D5C63", onClick: () => toast.info("Feature coming soon") },
            { icon: BookOpen, label: "Create Course", color: "#22C55E", onClick: () => toast.info("Feature coming soon") },
            { icon: Bell, label: "Send Notice", color: "#06B6D4", onClick: () => toast.info("Feature coming soon") },
            { icon: BarChart3, label: "View Reports", color: "#F59E0B", onClick: () => toast.info("Feature coming soon") },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={action.onClick}
                className="p-4 rounded-lg border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition text-left group"
              >
                <Icon size={24} style={{color: action.color}} className="mb-2 group-hover:scale-110 transition" />
                <p className="font-semibold text-gray-800 text-sm">{action.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* System Alert */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <AlertCircle size={24} style={{color: "#F59E0B"}} className="flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-yellow-900 mb-2">⚠️ Low Attendance Alert</h3>
            <p className="text-sm text-yellow-800">7 students in Class XI-B have attendance below 75%. Review and take action immediately.</p>
            <button
              onClick={() => toast.info("Redirecting to attendance management")}
              className="mt-3 px-4 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition font-semibold"
            >
              Review Now
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
