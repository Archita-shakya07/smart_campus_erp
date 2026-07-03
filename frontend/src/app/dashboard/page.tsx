"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Task, Notice, TimetableEntry } from "@/types";
import { CheckSquare, Bell, UserCheck, Clock, TrendingUp, AlertCircle } from "lucide-react";

// ── Dummy fallback data ──────────────────────────────────────────
const DUMMY_TASKS: Task[] = [
  { _id: "1", title: "DBMS Assignment", subject: "Database", description: "Complete DBMS assignment", isCompleted: false, dueDate: new Date(Date.now() + 86400000).toISOString(), priority: "high" },
  { _id: "2", title: "Web Project", subject: "Web Dev", description: "Build web project", isCompleted: false, dueDate: new Date(Date.now() + 3 * 86400000).toISOString(), priority: "medium" },
  { _id: "3", title: "Lab Record", subject: "Lab", description: "Complete lab record", isCompleted: false, dueDate: new Date(Date.now() + 3 * 86400000).toISOString(), priority: "low" },
  { _id: "4", title: "Math Assignment", subject: "Mathematics", description: "Solve math problems", isCompleted: true, dueDate: new Date(Date.now() - 86400000).toISOString(), priority: "medium" },
];

const DUMMY_NOTICES: Notice[] = [
  { _id: "1", title: "Internal Hackathon Registration Open", body: "Register now for the internal hackathon", category: "event", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { _id: "2", title: "Department Meeting on Friday", body: "Important department meeting scheduled", category: "general", createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { _id: "3", title: "Mid Sem Exam Schedule Released", body: "Mid semester exams schedule is now available", category: "exam", createdAt: new Date(Date.now() - 6 * 86400000).toISOString() },
  { _id: "4", title: "Holiday on 15th August", body: "College will be closed on independence day", category: "holiday", createdAt: new Date(Date.now() - 8 * 86400000).toISOString() },
  { _id: "5", title: "Library Timings Updated", body: "New library timings are now in effect", category: "general", createdAt: new Date(Date.now() - 10 * 86400000).toISOString() },
];

const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

const DUMMY_TIMETABLE: TimetableEntry[] = [
  { _id: "1", day: today, subject: "Data Structures", teacher: "Dr. Sharma", startTime: "09:00 AM", endTime: "10:00 AM", room: "301", colorTag: "#0D5C63" },
  { _id: "2", day: today, subject: "Web Development", teacher: "Prof. Patel", startTime: "11:00 AM", endTime: "12:00 PM", room: "Lab 2", colorTag: "#8B5CF6" },
  { _id: "3", day: today, subject: "DBMS", teacher: "Dr. Kumar", startTime: "01:00 PM", endTime: "02:00 PM", room: "105", colorTag: "#F59E0B" },
  { _id: "4", day: today, subject: "Software Engineering", teacher: "Prof. Singh", startTime: "03:00 PM", endTime: "04:00 PM", room: "202", colorTag: "#22C55E" },
];
const DUMMY_ATTENDANCE = { overall: 85 };
// ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [attendance, setAttendance] = useState<{ overall: number }>({ overall: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [t, n, tt, a] = await Promise.all([
          api.get("/tasks"),
          api.get("/notices"),
          api.get("/timetable"),
          api.get("/attendance/summary"),
        ]);
        const tasksData = t.data.data?.length ? t.data.data : DUMMY_TASKS;
        const noticesData = n.data.data?.length ? n.data.data : DUMMY_NOTICES;
        const ttData = tt.data.data?.length ? tt.data.data : DUMMY_TIMETABLE;
        const attData = a.data.data?.overall != null ? a.data.data : DUMMY_ATTENDANCE;

        setTasks(tasksData);
        setNotices(noticesData);
        setTimetable(ttData);
        setAttendance(attData);
      } catch (e) {
        // API fail → use dummy data
        setTasks(DUMMY_TASKS);
        setNotices(DUMMY_NOTICES);
        setTimetable(DUMMY_TIMETABLE);
        setAttendance(DUMMY_ATTENDANCE);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const pendingTasks = tasks.filter((t) => !t.isCompleted);
  const overdueTasks = tasks.filter((t) => !t.isCompleted && new Date(t.dueDate) < new Date());
  const todayClasses = timetable.filter((t) => t.day === today);
  const recentNotices = notices.slice(0, 3);
  const upcomingTasks = pendingTasks.slice(0, 4);
  const attendanceColor =
    attendance.overall >= 75 ? "#22C55E" : attendance.overall >= 60 ? "#F59E0B" : "#EF4444";

  const statCards = [
    {
      label: "Tasks Due",
      value: pendingTasks.length,
      icon: CheckSquare,
      color: "#0D5C63",
      bg: "rgba(13,92,99,0.08)",
      sub: `${overdueTasks.length} overdue`,
    },
    {
      label: "Attendance",
      value: `${attendance.overall}%`,
      icon: UserCheck,
      color: attendanceColor,
      bg: `${attendanceColor}22`,
      sub: attendance.overall >= 75 ? "Good standing" : "Needs attention",
    },
    {
      label: "New Notices",
      value: notices.length,
      icon: Bell,
      color: "#8B5CF6",
      bg: "rgba(139,92,246,0.08)",
      sub: "Total notices",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
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
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-400 mt-1 text-sm">Welcome back, {user?.name?.split(" ")[0] || "Student"}!</p>
      </div>

      {/* Stat Cards — 3 col like screenshot */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <p className="text-3xl font-bold" style={{ color: card.color }}>
              {card.value}
            </p>
            <p className="text-sm font-semibold text-gray-600 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Attendance Warning */}
      {attendance.overall < 75 && attendance.overall > 0 && (
        <div
          className="mb-6 p-4 rounded-2xl flex items-center gap-3"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-700">Attendance below 75%!</p>
            <p className="text-xs text-red-500 mt-0.5">
              Your current attendance is {attendance.overall}%. Please attend more classes.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid — Today's Schedule + Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Today's Schedule</h2>
            <span className="text-xs text-gray-400">{today}</span>
          </div>
          {todayClasses.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No classes today 🎉</p>
          ) : (
            <div className="space-y-3">
              {todayClasses.map((cls) => (
                <div key={cls._id} className="flex items-center gap-3">
                  <div className="text-xs text-gray-400 w-20 flex-shrink-0">{cls.startTime}</div>
                  <div className="flex items-center gap-3 flex-1 p-3 rounded-xl" style={{ background: "#f8fafc" }}>
                    <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: cls.colorTag || "#0D5C63" }}></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{cls.subject}</p>
                      <p className="text-xs text-gray-400">{cls.room}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Upcoming Tasks</h2>
            <a href="/tasks" className="text-xs font-semibold" style={{ color: "#0D5C63" }}>View all</a>
          </div>
          {upcomingTasks.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No pending tasks! 🎉</p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => {
                const overdue = new Date(task.dueDate) < new Date();
                const priorityColor =
                  task.priority === "high" ? "#EF4444" : task.priority === "medium" ? "#F59E0B" : "#22C55E";
                const daysLeft = Math.ceil(
                  (new Date(task.dueDate).getTime() - Date.now()) / 86400000
                );
                return (
                  <div key={task._id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#f8fafc" }}>
                    <div className="w-4 h-4 rounded border-2 flex-shrink-0" style={{ borderColor: priorityColor }}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{task.title}</p>
                    </div>
                    <p className="text-xs flex-shrink-0" style={{ color: overdue ? "#EF4444" : "#94a3b8" }}>
                      {overdue ? "Overdue" : `Due in ${daysLeft}d`}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Notices */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell size={18} style={{ color: "#0D5C63" }} />
            <h2 className="font-bold text-gray-800">Recent Notices</h2>
          </div>
          <a href="/notices" className="text-xs font-semibold" style={{ color: "#0D5C63" }}>View All</a>
        </div>
        <div className="space-y-3">
          {recentNotices.map((notice) => {
            const catColor: Record<string, string> = {
              general: "#0D5C63", exam: "#EF4444", event: "#8B5CF6", holiday: "#22C55E",
            };
            const daysAgo = Math.floor((Date.now() - new Date(notice.createdAt).getTime()) / 86400000);
            return (
              <div key={notice._id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#f8fafc" }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: catColor[notice.category] || "#0D5C63" }}></div>
                <p className="text-sm font-semibold text-gray-800 flex-1">{notice.title}</p>
                <p className="text-xs text-gray-400 flex-shrink-0">{daysAgo}d ago</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Progress */}
      {tasks.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} style={{ color: "#0D5C63" }} />
            <h2 className="font-bold text-gray-800">Task Progress</h2>
            <span className="ml-auto text-sm font-bold" style={{ color: "#0D5C63" }}>
              {tasks.filter((t) => t.isCompleted).length}/{tasks.length} completed
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.round((tasks.filter((t) => t.isCompleted).length / tasks.length) * 100)}%`,
                background: "linear-gradient(90deg, #0D5C63, #22C55E)",
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {Math.round((tasks.filter((t) => t.isCompleted).length / tasks.length) * 100)}% of tasks completed
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
