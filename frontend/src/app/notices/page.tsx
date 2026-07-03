"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { Notice } from "@/types";
import { toast } from "sonner";
import { Trash2, Plus, Edit } from "lucide-react";
import { useAuth as useAuthContext } from "@/context/AuthContext";

const dummyNotices: Notice[] = [
  {
    _id: "n1",
    title: "📝 End Semester Examination Schedule Out",
    body: "The final examination schedule for all courses has been uploaded on the portal. Practical exams will commence from next Monday. Ensure all dues are cleared.",
    category: "exam",
    createdAt: new Date().toISOString()
  },
  {
    _id: "n2",
    title: "🎉 Annual Cultural Fest - Renaissance 2026",
    body: "Registrations are now open for main stage events, solo dancing, singing, and gaming tournaments. Contact your respective student union representative.",
    category: "event",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: "n3",
    title: "🌙 Id-ul-Zuha (Bakrid) Holiday Declaration",
    body: "The college will remain closed tomorrow on account of Id-ul-Zuha. Classes will resume as regular from the day after tomorrow.",
    category: "holiday",
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    _id: "n4",
    title: "🚀 New Python & Web Dev Coding Batches",
    body: "Special weekend coding lab classes are starting this Friday for cloud computing and JavaScript frameworks. Limited seats available per section.",
    category: "general",
    createdAt: new Date(Date.now() - 259200000).toISOString()
  }
];

export default function NoticesPage() {
  const { user } = useAuthContext();
  const [notices, setNotices] = useState<Notice[]>(dummyNotices);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [form, setForm] = useState({
    title: "",
    body: "",
    category: "general" as "general" | "exam" | "event" | "holiday",
  });

  const fetchNotices = async () => {
    try {
      const res = await api.get("/notices");
      if (res.data?.data && res.data.data.length > 0) {
        setNotices(res.data.data);
      }
    } catch (e) {
      console.log("Using temporary fallback notice data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/notices", form);
      const newNotice: Notice = {
        _id: String(Date.now()),
        title: form.title,
        body: form.body,
        category: form.category,
        createdAt: new Date().toISOString()
      };
      setNotices([newNotice, ...notices]);
      setForm({ title: "", body: "", category: "general" });
      setShowForm(false);
      toast.success("Notice posted! 🚀");
    } catch (e) {
      const newNotice: Notice = {
        _id: String(Date.now()),
        title: form.title,
        body: form.body,
        category: form.category,
        createdAt: new Date().toISOString()
      };
      setNotices([newNotice, ...notices]);
      setForm({ title: "", body: "", category: "general" });
      setShowForm(false);
      toast.success("Notice posted locally! 💾");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notices/${id}`);
      setNotices(notices.filter((n) => n._id !== id));
      toast.success("Notice deleted! 🗑️");
    } catch (e) {
      setNotices(notices.filter((n) => n._id !== id));
      toast.success("Notice deleted locally! 💾");
    }
  };

  let filtered = notices;
  if (selectedCategory !== "all") {
    filtered = notices.filter((n) => n.category === selectedCategory);
  }

  // Color mapping matching image_0674c8.png
  const cardStyles: Record<string, { bg: string; border: string; accent: string; text: string; emoji: string }> = {
    general: {
      bg: "#E6F4F1",       // Soft Dark Teal Tint (Data Structures)
      border: "#C2E2DC",
      accent: "#0D5C63",
      text: "#06373C",
      emoji: "📢"
    },
    exam: {
      bg: "#FEE2E2",       // Soft Red/Coral Tint (DBMS Assignment)
      border: "#FCA5A5",
      accent: "#EF4444",
      text: "#991B1B",
      emoji: "✍️"
    },
    event: {
      bg: "#F3E8FF",       // Soft Purple Tint (Web Development)
      border: "#E9D5FF",
      accent: "#8B5CF6",
      text: "#5B21B6",
      emoji: "✨"
    },
    holiday: {
      bg: "#DCFCE7",       // Soft Green Tint (Software Engineering)
      border: "#BBF7D0",
      accent: "#22C55E",
      text: "#166534",
      emoji: "🌴"
    },
  };

  const categoryEmojis: Record<string, string> = {
    all: "🌐",
    general: "📢",
    exam: "✍️",
    event: "✨",
    holiday: "🌴"
  };

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
          Back to Dashboard 🏠
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📌 Notice Board</h1>
            <p className="text-gray-500 mt-1">Stay updated with college announcements🔔</p>
          </div>
          {user?.role === "admin" && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium transition-all"
              style={{ background: "linear-gradient(135deg, #0D5C63, #134E4A)" }}
            >
              <Plus size={18} /> Post Notice 📝
            </button>
          )}
        </div>

        {showForm && user?.role === "admin" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Notice Title 🏷️"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600"
              />

              <textarea
                required
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Notice Content 💬"
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600"
              ></textarea>

              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600"
              >
                <option value="general">📢 General</option>
                <option value="exam">✍️ Exam</option>
                <option value="event">✨ Event</option>
                <option value="holiday">🌴 Holiday</option>
              </select>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl transition"
                >
                  Publish Notice 📣
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel ❌
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["all", "general", "exam", "event", "holiday"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all capitalize flex items-center gap-1.5"
            style={{
              background: selectedCategory === cat ? "#0D5C63" : "#f1f5f9",
              color: selectedCategory === cat ? "white" : "#64748b",
            }}
          >
            <span>{categoryEmojis[cat]}</span>
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">🔍 No notices found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((notice) => {
            const styles = cardStyles[notice.category] || cardStyles.general;
            return (
              <div
                key={notice._id}
                className="rounded-2xl p-6 border transition-all hover:shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4"
                style={{ 
                  backgroundColor: styles.bg, 
                  borderColor: styles.border,
                }}
              >
                {/* Left accent indicator from image_0674c8.png */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" 
                  style={{ backgroundColor: styles.accent }}
                />

                <div className="pl-2 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-bold uppercase px-3 py-1 rounded-full text-white flex items-center gap-1"
                      style={{ background: styles.accent }}
                    >
                      <span>{styles.emoji}</span>
                      {notice.category}
                    </span>
                    <span className="text-xs font-medium opacity-70 flex items-center gap-1" style={{ color: styles.text }}>
                      📅 {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: styles.text }}>
                    {notice.title}
                  </h3>
                  <p className="text-sm leading-relaxed opacity-90" style={{ color: styles.text }}>
                    {notice.body}
                  </p>
                </div>

                {user?.role === "admin" && (
                  <div className="self-end md:self-center pl-2">
                    <button
                      onClick={() => handleDelete(notice._id)}
                      className="transition-colors opacity-60 hover:opacity-100"
                      style={{ color: styles.accent }}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}