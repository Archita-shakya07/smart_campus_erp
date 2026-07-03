"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { Note } from "@/types";
import { toast } from "sonner";
import { Trash2, Plus, Download, ChevronDown, ChevronUp, FileText, Upload } from "lucide-react";
import { useAuth as useAuthContext } from "@/context/AuthContext";

interface ChapterNote {
  id: string;
  chapterNumber: number;
  chapterName: string;
  content: string;
  tags: string[];
  createdAt: string;
  fileUrl?: string;
}

interface SubjectNotes {
  subject: string;
  chapters: ChapterNote[];
}

// DUMMY DATA
const dummyNotesData: SubjectNotes[] = [
  {
    subject: "Mathematics",
    chapters: [
      {
        id: "m1",
        chapterNumber: 1,
        chapterName: "Algebra Basics 📐",
        content:
          "This chapter covers the fundamentals of algebra including variables, equations, and basic algebraic operations. Topics include linear equations, quadratic equations, and polynomial expressions.",
        tags: ["algebra", "equations", "fundamentals"],
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        fileUrl: "algebra_basics.pdf",
      },
      {
        id: "m2",
        chapterNumber: 2,
        chapterName: "Calculus Introduction 📈",
        content:
          "Introduction to calculus covering limits, derivatives, and basic integration. Essential concepts for advanced mathematics and physics applications.",
        tags: ["calculus", "derivatives", "integration"],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        fileUrl: "calculus_intro.pdf",
      },
      {
        id: "m3",
        chapterNumber: 3,
        chapterName: "Trigonometry 🧮",
        content:
          "Study of trigonometric functions, identities, and applications. Includes sin, cos, tan functions and their real-world applications.",
        tags: ["trigonometry", "functions", "angles"],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        fileUrl: "trigonometry.pdf",
      },
    ],
  },
  {
    subject: "Physics",
    chapters: [
      {
        id: "p1",
        chapterNumber: 1,
        chapterName: "Mechanics and Motion ⚛️",
        content:
          "Fundamentals of classical mechanics including kinematics, dynamics, and Newton's laws of motion. Covers velocity, acceleration, and force.",
        tags: ["mechanics", "motion", "forces"],
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        fileUrl: "mechanics.pdf",
      },
      {
        id: "p2",
        chapterNumber: 2,
        chapterName: "Energy and Work ⚡",
        content:
          "Concepts of energy, work, and power. Includes kinetic energy, potential energy, and conservation laws.",
        tags: ["energy", "work", "power"],
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        fileUrl: "energy_work.pdf",
      },
      {
        id: "p3",
        chapterNumber: 3,
        chapterName: "Waves and Sound 🔊",
        content:
          "Study of wave properties, sound waves, and light waves. Covers frequency, wavelength, and wave equations.",
        tags: ["waves", "sound", "oscillations"],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        fileUrl: "waves_sound.pdf",
      },
    ],
  },
  {
    subject: "Chemistry",
    chapters: [
      {
        id: "c1",
        chapterNumber: 1,
        chapterName: "Atomic Structure 🧪",
        content:
          "Understanding atoms, electrons, protons, and neutrons. Bohr model and quantum mechanical model of atoms.",
        tags: ["atoms", "structure", "quantum"],
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        fileUrl: "atomic_structure.pdf",
      },
      {
        id: "c2",
        chapterNumber: 2,
        chapterName: "Chemical Bonding 🔗",
        content:
          "Types of chemical bonds including ionic, covalent, and metallic bonds. Electronegativity and bond polarity.",
        tags: ["bonding", "ionic", "covalent"],
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        fileUrl: "chemical_bonding.pdf",
      },
      {
        id: "c3",
        chapterNumber: 3,
        chapterName: "Organic Chemistry Basics 🌿",
        content:
          "Introduction to organic compounds, nomenclature, and basic reactions. Covers hydrocarbons and functional groups.",
        tags: ["organic", "compounds", "reactions"],
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        fileUrl: "organic_chemistry.pdf",
      },
    ],
  },
  {
    subject: "English",
    chapters: [
      {
        id: "e1",
        chapterNumber: 1,
        chapterName: "Grammar Fundamentals 📖",
        content:
          "Complete guide to English grammar including parts of speech, sentence structure, and punctuation rules.",
        tags: ["grammar", "language", "syntax"],
        createdAt: new Date(Date.now() - 518400000).toISOString(),
        fileUrl: "grammar_fundamentals.pdf",
      },
      {
        id: "e2",
        chapterNumber: 2,
        chapterName: "Literature and Analysis 🎭",
        content:
          "Analysis of literary works including poetry, prose, and drama. Understanding themes, symbols, and literary devices.",
        tags: ["literature", "analysis", "poetry"],
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        fileUrl: "literature.pdf",
      },
    ],
  },
];

export default function NotesPage() {
  const { user } = useAuthContext();
  const [notesData, setNotesData] = useState<SubjectNotes[]>(dummyNotesData);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<ChapterNote | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    subject: "Mathematics",
    chapterNumber: 1,
    chapterName: "",
    content: "",
    tags: "",
  });

  // Dynamic style mappings for each subject extracted from the reference design
  const subjectStyles: Record<string, { bg: string; border: string; accent: string; text: string; bgAlpha: string; emoji: string }> = {
    Mathematics: {
      bg: "#E6F4F1", // Soft Dark Teal Tint
      border: "#C2E2DC",
      accent: "#0D5C63",
      text: "#06373C",
      bgAlpha: "rgba(13, 92, 99, 0.1)",
      emoji: "🧮"
    },
    Physics: {
      bg: "#FEE2E2", // Soft Red/Coral Tint
      border: "#FCA5A5",
      accent: "#EF4444",
      text: "#991B1B",
      bgAlpha: "rgba(239, 68, 68, 0.1)",
      emoji: "⚛️"
    },
    Chemistry: {
      bg: "#F3E8FF", // Soft Purple Tint
      border: "#E9D5FF",
      accent: "#8B5CF6",
      text: "#5B21B6",
      bgAlpha: "rgba(139, 92, 246, 0.1)",
      emoji: "🧪"
    },
    English: {
      bg: "#DCFCE7", // Soft Green Tint
      border: "#BBF7D0",
      accent: "#22C55E",
      text: "#166534",
      bgAlpha: "rgba(34, 197, 94, 0.1)",
      emoji: "📖"
    },
  };

  const defaultStyle = {
    bg: "#F8FAFC",
    border: "#E2E8F0",
    accent: "#64748B",
    text: "#1E293B",
    bgAlpha: "rgba(100, 116, 139, 0.1)",
    emoji: "📁"
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newNote: ChapterNote = {
        id: String(Date.now()),
        chapterNumber: parseInt(form.chapterNumber.toString()),
        chapterName: form.chapterName,
        content: form.content,
        tags: form.tags.split(",").map((t) => t.trim()),
        createdAt: new Date().toISOString(),
      };

      setNotesData((prev) =>
        prev.map((subj) =>
          subj.subject === form.subject
            ? { ...subj, chapters: [...subj.chapters, newNote].sort((a, b) => a.chapterNumber - b.chapterNumber) }
            : subj
        )
      );

      setForm({
        subject: "Mathematics",
        chapterNumber: 1,
        chapterName: "",
        content: "",
        tags: "",
      });
      setShowForm(false);
      toast.success("Note uploaded successfully! 🚀");
    } catch (e) {
      toast.error("Failed to upload note ❌");
    }
  };

  const handleDelete = (subjectName: string, noteId: string) => {
    setNotesData((prev) =>
      prev.map((subj) =>
        subj.subject === subjectName
          ? {
              ...subj,
              chapters: subj.chapters.filter((ch) => ch.id !== noteId),
            }
          : subj
      )
    );
    setSelectedNote(null);
    toast.success("Note deleted! 🗑️");
  };

  const toggleSubject = (subject: string) => {
    setExpandedSubject(expandedSubject === subject ? null : subject);
  };

  const filteredNotes = notesData.map((subj) => ({
    ...subj,
    chapters: subj.chapters.filter(
      (ch) =>
        ch.chapterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ch.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
  }));

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
            <h1 className="text-2xl font-bold text-gray-800">📚 Study Notes Board</h1>
            <p className="text-gray-500 mt-1">Access organized subject-wise notes and study materials 📋</p>
          </div>
          {user?.role === "admin" && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium transition-all"
              style={{ background: "linear-gradient(135deg, #0D5C63, #134E4A)" }}
            >
              <Upload size={18} /> Upload Note ✨
            </button>
          )}
        </div>

        {/* Upload Form */}
        {showForm && user?.role === "admin" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📤 Upload New Note</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject 📚</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600"
                  >
                    {notesData.map((subj) => {
                      const style = subjectStyles[subj.subject] || defaultStyle;
                      return (
                        <option key={subj.subject} value={subj.subject}>
                          {style.emoji} {subj.subject}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chapter Number 🔢
                  </label>
                  <input
                    type="number"
                    required
                    value={form.chapterNumber}
                    onChange={(e) => setForm({ ...form, chapterNumber: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chapter Name 🏷️
                </label>
                <input
                  type="text"
                  required
                  value={form.chapterName}
                  onChange={(e) => setForm({ ...form, chapterName: e.target.value })}
                  placeholder="e.g., Introduction to Waves"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content / Summary 💬
                </label>
                <textarea
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write the summary or key points here..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (comma separated) 🏷️
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="e.g., waves, light, mechanics"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl transition"
                >
                  Publish Note 📢
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

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search notes by chapter name or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600 shadow-sm"
        />
      </div>

      {/* Notes by Subject */}
      <div className="space-y-4">
        {filteredNotes.map((subjectData) => {
          const style = subjectStyles[subjectData.subject] || defaultStyle;
          const isExpanded = expandedSubject === subjectData.subject;
          
          return (
            <div 
              key={subjectData.subject} 
              className="rounded-2xl shadow-sm border overflow-hidden relative transition-all"
              style={{ backgroundColor: "white", borderColor: isExpanded ? style.border : "#F1F5F9" }}
            >
              {/* Left visual accent colored border from image layout */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1.5" 
                style={{ backgroundColor: style.accent }}
              />

              {/* Subject Header */}
              <button
                onClick={() => toggleSubject(subjectData.subject)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors text-left pl-6"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: style.bgAlpha }}>
                    <span>{style.emoji}</span>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{subjectData.subject}</p>
                    <p className="text-sm text-gray-500">📖 {subjectData.chapters.length} chapters loaded</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span 
                    className="text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: style.accent }}
                  >
                    {subjectData.chapters.length} Chapters
                  </span>
                  {isExpanded ? (
                    <ChevronUp style={{ color: style.accent }} />
                  ) : (
                    <ChevronDown style={{ color: style.accent }} />
                  )}
                </div>
              </button>

              {/* Chapters List Container */}
              {isExpanded && subjectData.chapters.length > 0 && (
                <div className="border-t divide-y pl-4 pr-2 bg-gray-50/30" style={{ borderColor: style.border, divideColor: style.border }}>
                  {subjectData.chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      onClick={() => setSelectedNote(chapter)}
                      className="w-full p-4 flex items-center justify-between hover:bg-white rounded-xl my-1 transition-all cursor-pointer border border-transparent hover:border-gray-100 text-left"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span 
                            className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                            style={{ backgroundColor: style.accent }}
                          >
                            Ch {chapter.chapterNumber}
                          </span>
                          <p className="font-semibold text-gray-800">{chapter.chapterName}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {chapter.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                              style={{ backgroundColor: style.bg, color: style.text }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                          📅 Created: {new Date(chapter.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {user?.role === "admin" && (
                          <button
                            onClick={() => handleDelete(subjectData.subject, chapter.id)}
                            className="transition-colors p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isExpanded && subjectData.chapters.length === 0 && (
                <div className="p-6 text-center text-gray-500 border-t" style={{ borderColor: style.border }}>
                  <p>🔍 No chapters matching your selection</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Note Detail Modal */}
      {selectedNote && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedNote(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header inside customizable styles based on guessed keyword mapping */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
              <div>
                <p className="text-xs font-bold tracking-wide text-teal-700 uppercase mb-1 flex items-center gap-1">
                  📖 Chapter {selectedNote.chapterNumber}
                </p>
                <h2 className="text-2xl font-bold text-gray-800">{selectedNote.chapterName}</h2>
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="text-gray-400 hover:text-gray-600 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedNote.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-teal-50 text-teal-700 font-semibold">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Content */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">📝 Chapter Summary</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{selectedNote.content}</p>
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100 flex-wrap gap-2">
                <span className="flex items-center gap-1">📅 Uploaded on {new Date(selectedNote.createdAt).toLocaleDateString()}</span>
                {selectedNote.fileUrl && (
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-xl transition shadow-xs">
                    <Download size={14} /> Download Notes PDF 💾
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
