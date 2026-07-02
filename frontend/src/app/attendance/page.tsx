"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Check, X, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";

interface UserInfo {
  id: string;
  name: string;
  role: string;
  course: string;
  year: number;
}

interface SubjectAttendance {
  subject: string;
  total: number;
  present: number;
  percentage: number;
}

interface StudentInClass {
  id: string;
  name: string;
  email: string;
  attendance: "present" | "absent";
}

interface ClassData {
  id: string;
  className: string;
  subject: string;
  students: StudentInClass[];
  expanded: boolean;
}

// DUMMY DATA
const dummySubjectAttendance: SubjectAttendance[] = [
  { subject: "Mathematics", total: 20, present: 18, percentage: 90 },
  { subject: "Physics", total: 20, present: 15, percentage: 75 },
  { subject: "Chemistry", total: 18, present: 17, percentage: 94 },
  { subject: "English", total: 22, present: 20, percentage: 91 },
  { subject: "Computer Science", total: 20, present: 19, percentage: 95 },
];

const dummyOverallAttendance = {
  total: 100,
  present: 85,
  absent: 15,
  percentage: 85,
};

const dummyTodayAttendance = {
  date: new Date().toLocaleDateString("en-IN"),
  status: "present",
  subjects: [
    { subject: "Mathematics", time: "09:00 AM - 10:00 AM", status: "present" },
    { subject: "Physics", time: "10:15 AM - 11:15 AM", status: "present" },
    { subject: "Chemistry", time: "12:00 PM - 01:00 PM", status: "absent" },
  ],
};

const dummyMonthlyAttendance = [
  { date: "Week 1", present: 15, absent: 5 },
  { date: "Week 2", present: 17, absent: 3 },
  { date: "Week 3", present: 14, absent: 6 },
  { date: "Week 4", present: 18, absent: 2 },
  { date: "Week 5", present: 16, absent: 4 },
];

const dummyClasses: ClassData[] = [
  {
    id: "1",
    className: "Class A - Section 1",
    subject: "Mathematics",
    expanded: false,
    students: [
      { id: "s1", name: "Arjun Sharma", email: "arjun@example.com", attendance: "present" },
      { id: "s2", name: "Priya Singh", email: "priya@example.com", attendance: "present" },
      { id: "s3", name: "Rahul Kumar", email: "rahul@example.com", attendance: "absent" },
      { id: "s4", name: "Sneha Patel", email: "sneha@example.com", attendance: "present" },
    ],
  },
  {
    id: "2",
    className: "Class B - Section 2",
    subject: "Physics",
    expanded: false,
    students: [
      { id: "s5", name: "Vikas Reddy", email: "vikas@example.com", attendance: "present" },
      { id: "s6", name: "Anjali Mishra", email: "anjali@example.com", attendance: "present" },
      { id: "s7", name: "Rohan Verma", email: "rohan@example.com", attendance: "absent" },
      { id: "s8", name: "Divya Gupta", email: "divya@example.com", attendance: "present" },
      { id: "s9", name: "Arun Singh", email: "arun@example.com", attendance: "present" },
    ],
  },
  {
    id: "3",
    className: "Class C - Section 1",
    subject: "Chemistry",
    expanded: false,
    students: [
      { id: "s10", name: "Neha Joshi", email: "neha@example.com", attendance: "present" },
      { id: "s11", name: "Karan Chopra", email: "karan@example.com", attendance: "present" },
      { id: "s12", name: "Shruti Singh", email: "shruti@example.com", attendance: "present" },
    ],
  },
];

export default function AttendancePage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [classes, setClasses] = useState<ClassData[]>(dummyClasses);
  const [selectedSubject, setSelectedSubject] = useState<string>("Mathematics");
  const [activeTab, setActiveTab] = useState("student");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/auth/me");
        setUserInfo(response.data.data);
        if (response.data.data?.role === "admin") {
          setActiveTab("admin");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    getUserInfo();
  }, []);

  const toggleClassExpansion = (classId: string) => {
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === classId ? { ...cls, expanded: !cls.expanded } : cls
      )
    );
  };

  const updateStudentAttendance = (
    classId: string,
    studentId: string,
    status: "present" | "absent"
  ) => {
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === classId
          ? {
              ...cls,
              students: cls.students.map((student) =>
                student.id === studentId ? { ...student, attendance: status } : student
              ),
            }
          : cls
      )
    );
  };

  const getSubjectAttendanceData = () => {
    return (
      dummySubjectAttendance.find((s) => s.subject === selectedSubject) ||
      dummySubjectAttendance[0]
    );
  };

  const pieData = [
    { name: "Present", value: dummyOverallAttendance.present },
    { name: "Absent", value: dummyOverallAttendance.absent },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft size={24} className="text-teal-700" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">📊 Attendance Tracker</h1>
              <p className="text-gray-500">Attendance ko track karo aur manage karo</p>
            </div>
          </div>

          {/* Tabs - Sirf student ko dikhega, admin ke liye tabs hide */}
          {userInfo?.role !== "admin" && (
            <div className="mb-8 border-b border-gray-200">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab("student")}
                  className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                    activeTab === "student"
                      ? "border-teal-700 text-teal-700"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  👨‍🎓 Student View
                </button>
              </div>
            </div>
          )}

          {/* STUDENT VIEW */}
          {activeTab === "student" && userInfo?.role !== "admin" && (
            <div className="space-y-8">
              {/* Overall Attendance */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Overall Attendance</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Pie Chart */}
                  <div className="flex justify-center">
                    <ResponsiveContainer width={250} height={250}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          <Cell fill="#0D5C63" />
                          <Cell fill="#EF4444" />
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Stats */}
                  <div className="col-span-1 md:col-span-2 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                        <p className="text-gray-600 text-sm">Total Classes</p>
                        <p className="text-3xl font-bold text-teal-700">
                          {dummyOverallAttendance.total}
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-gray-600 text-sm">✅ Present</p>
                        <p className="text-3xl font-bold text-green-600">
                          {dummyOverallAttendance.present}
                        </p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <p className="text-gray-600 text-sm">❌ Absent</p>
                        <p className="text-3xl font-bold text-red-600">
                          {dummyOverallAttendance.absent}
                        </p>
                      </div>
                    </div>

                    {/* Percentage Bar */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 font-semibold">Overall Percentage</span>
                        <span className="text-teal-700 font-bold text-lg">
                          {dummyOverallAttendance.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-teal-600 to-teal-400 h-full"
                          style={{
                            width: `${dummyOverallAttendance.percentage}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {dummyOverallAttendance.percentage >= 75
                          ? "✅ 75% se upar - Good!"
                          : dummyOverallAttendance.percentage >= 60
                            ? "⚠️ 60-75% - Thoda kum hai"
                            : "❌ 60% se kam - Dharohar le!"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Attendance */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📅 Today's Attendance</h2>
                <p className="text-gray-500 text-sm mb-4">{dummyTodayAttendance.date}</p>
                <div className="space-y-3">
                  {dummyTodayAttendance.subjects.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-teal-300 transition-all"
                    >
                      <div>
                        <p className="text-gray-800 font-semibold">{item.subject}</p>
                        <p className="text-gray-500 text-sm">{item.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.status === "present" ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 flex items-center gap-1">
                            <Check size={14} /> Present
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 flex items-center gap-1">
                            <X size={14} /> Absent
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject Wise Attendance */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">📚 Subject-Wise Attendance</h2>
                <div className="space-y-6">
                  {/* Subject List */}
                  <div className="space-y-2">
                    {dummySubjectAttendance.map((subject) => (
                      <div
                        key={subject.subject}
                        onClick={() => setSelectedSubject(subject.subject)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedSubject === subject.subject
                            ? "bg-teal-50 border-teal-300"
                            : "bg-gray-50 border-gray-200 hover:border-teal-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                              className={`font-semibold ${
                                selectedSubject === subject.subject
                                  ? "text-teal-700"
                                  : "text-gray-800"
                              }`}
                            >
                              {subject.subject}
                            </p>
                            <p className="text-sm text-gray-500">
                              {subject.present} / {subject.total} classes attended
                            </p>
                          </div>
                          <div
                            className={`text-right ${
                              subject.percentage >= 75
                                ? "text-green-600"
                                : subject.percentage >= 60
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            <p className="text-2xl font-bold">{subject.percentage}%</p>
                          </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              subject.percentage >= 75
                                ? "bg-green-500"
                                : subject.percentage >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${subject.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Detailed Graph */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-semibold mb-4">
                      📊 {selectedSubject} - Month Wise Attendance
                    </p>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dummyMonthlyAttendance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="present"
                          stroke="#22C55E"
                          strokeWidth={2}
                          dot={{ fill: "#22C55E", r: 4 }}
                          name="Present"
                        />
                        <Line
                          type="monotone"
                          dataKey="absent"
                          stroke="#EF4444"
                          strokeWidth={2}
                          dot={{ fill: "#EF4444", r: 4 }}
                          name="Absent"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN VIEW */}
          {activeTab === "admin" && userInfo?.role === "admin" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">👥 Manage Class Attendance</h2>
                <p className="text-gray-500 mb-6">
                  Class select karo aur students ka attendance mark karo
                </p>

                <div className="space-y-4">
                  {classes.map((classData) => (
                    <div
                      key={classData.id}
                      className="border border-gray-200 rounded-lg bg-white overflow-hidden"
                    >
                      {/* Class Header */}
                      <button
                        onClick={() => toggleClassExpansion(classData.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 text-left">
                          <p className="text-gray-800 font-semibold">{classData.className}</p>
                          <p className="text-sm text-gray-500">
                            📚 {classData.subject} • {classData.students.length} Students
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-700">
                            {classData.students.filter((s) => s.attendance === "present").length}/
                            {classData.students.length} Present
                          </span>
                          {classData.expanded ? (
                            <ChevronUp className="text-teal-700" />
                          ) : (
                            <ChevronDown className="text-teal-700" />
                          )}
                        </div>
                      </button>

                      {/* Student List */}
                      {classData.expanded && (
                        <div className="bg-gray-50 border-t border-gray-200 p-4 space-y-3">
                          {classData.students.map((student) => (
                            <div
                              key={student.id}
                              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                            >
                              <div>
                                <p className="text-gray-800 font-semibold">{student.name}</p>
                                <p className="text-xs text-gray-500">{student.email}</p>
                              </div>

                              {/* Attendance Buttons */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    updateStudentAttendance(classData.id, student.id, "present")
                                  }
                                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-1 ${
                                    student.attendance === "present"
                                      ? "bg-green-600 hover:bg-green-700 text-white"
                                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                  }`}
                                >
                                  <Check size={14} /> Present
                                </button>
                                <button
                                  onClick={() =>
                                    updateStudentAttendance(classData.id, student.id, "absent")
                                  }
                                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-1 ${
                                    student.attendance === "absent"
                                      ? "bg-red-600 hover:bg-red-700 text-white"
                                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                  }`}
                                >
                                  <X size={14} /> Absent
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* Save Button */}
                          <button className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors mt-4">
                            💾 Save Attendance
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Today's Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-600 text-sm">Total Classes</p>
                    <p className="text-2xl font-bold text-gray-800">{classes.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-gray-600 text-sm">Total Present</p>
                    <p className="text-2xl font-bold text-green-600">
                      {classes.reduce(
                        (sum, cls) =>
                          sum +
                          cls.students.filter((s) => s.attendance === "present").length,
                        0
                      )}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-gray-600 text-sm">Total Absent</p>
                    <p className="text-2xl font-bold text-red-600">
                      {classes.reduce(
                        (sum, cls) =>
                          sum + cls.students.filter((s) => s.attendance === "absent").length,
                        0
                      )}
                    </p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <p className="text-gray-600 text-sm">Total Students</p>
                    <p className="text-2xl font-bold text-teal-700">
                      {classes.reduce((sum, cls) => sum + cls.students.length, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}