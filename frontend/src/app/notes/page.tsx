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
        chapterName: "Algebra Basics",
        content:
          "This chapter covers the fundamentals of algebra including variables, equations, and basic algebraic operations. Topics include linear equations, quadratic equations, and polynomial expressions.",
        tags: ["algebra", "equations", "fundamentals"],
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        fileUrl: "algebra_basics.pdf",
      },
      {
        id: "m2",
        chapterNumber: 2,
        chapterName: "Calculus Introduction",
        content:
          "Introduction to calculus covering limits, derivatives, and basic integration. Essential concepts for advanced mathematics and physics applications.",
        tags: ["calculus", "derivatives", "integration"],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        fileUrl: "calculus_intro.pdf",
      },
      {
        id: "m3",
        chapterNumber: 3,
        chapterName: "Trigonometry",
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
        chapterName: "Mechanics and Motion",
        content:
          "Fundamentals of classical mechanics including kinematics, dynamics, and Newton's laws of motion. Covers velocity, acceleration, and force.",
        tags: ["mechanics", "motion", "forces"],
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        fileUrl: "mechanics.pdf",
      },
      {
        id: "p2",
        chapterNumber: 2,
        chapterName: "Energy and Work",
        content:
          "Concepts of energy, work, and power. Includes kinetic energy, potential energy, and conservation laws.",
        tags: ["energy", "work", "power"],
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        fileUrl: "energy_work.pdf",
      },
      {
        id: "p3",
        chapterNumber: 3,
        chapterName: "Waves and Sound",
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
        chapterName: "Atomic Structure",
        content:
          "Understanding atoms, electrons, protons, and neutrons. Bohr model and quantum mechanical model of atoms.",
        tags: ["atoms", "structure", "quantum"],
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        fileUrl: "atomic_structure.pdf",
      },
      {
        id: "c2",
        chapterNumber: 2,
        chapterName: "Chemical Bonding",
        content:
          "Types of chemical bonds including ionic, covalent, and metallic bonds. Electronegativity and bond polarity.",
        tags: ["bonding", "ionic", "covalent"],
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        fileUrl: "chemical_bonding.pdf",
      },
      {
        id: "c3",
        chapterNumber: 3,
        chapterName: "Organic Chemistry Basics",
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
        chapterName: "Grammar Fundamentals",
        content:
          "Complete guide to English grammar including parts of speech, sentence structure, and punctuation rules.",
        tags: ["grammar", "language", "syntax"],
        createdAt: new Date(Date.now() - 518400000).toISOString(),
        fileUrl: "grammar_fundamentals.pdf",
      },
      {
        id: "e2",
        chapterNumber: 2,
        chapterName: "Literature and Analysis",
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

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes");
      if (res.data?.data && res.data.data.length > 0) {
        // Transform API data to match our structure
        // For now, use dummy data
      }
    } catch (e) {
      console.log("Using dummy notes data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
    // fetchNotes();
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
      toast.success("Note uploaded successfully!");
    } catch (e) {
      toast.error("Failed to upload note");
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
    toast.success("Note deleted!");
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
          Back to Dashboard
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📚 Study Notes</h1>
            <p className="text-gray-500 mt-1">Access organized subject-wise notes and study materials</p>
          </div>
          {user?.role === "admin" && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium transition-all"
              style={{ background: "linear-gradient(135deg, #0D5C63, #134E4A)" }}
            >
              <Upload size={18} /> Upload Note
            </button>
          )}
        </div>

        {/* Upload Form */}
        {showForm && user?.role === "admin" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Upload New Note</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600"
                  >
                    {notesData.map((subj) => (
                      <option key={subj.subject} value={subj.subject}>
                        {subj.subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chapter Number
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
                  Chapter Name
                </label>
                <input
                  type="text"
                  required
                  value={form.chapterName}
                  onChange={(e) => setForm({ ...form, chapterName: e.target.value })}
                  placeholder="e.g., Introduction to Algebra"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content / Summary
                </label>
                <textarea
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write the chapter summary or key points..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="e.g., algebra, equations, basics"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl transition"
                >
                  Upload Note
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
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
          placeholder="Search notes by chapter name or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-600"
        />
      </div>

      {/* Notes by Subject */}
      <div className="space-y-4">
        {filteredNotes.map((subjectData) => (
          <div key={subjectData.subject} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Subject Header */}
            <button
              onClick={() => toggleSubject(subjectData.subject)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(13,92,99,0.1)" }}>
                  <FileText className="text-teal-700" size={24} />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-gray-800">{subjectData.subject}</p>
                  <p className="text-sm text-gray-500">{subjectData.chapters.length} chapters</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-teal-100 text-teal-700">
                  {subjectData.chapters.length}
                </span>
                {expandedSubject === subjectData.subject ? (
                  <ChevronUp className="text-teal-700" />
                ) : (
                  <ChevronDown className="text-teal-700" />
                )}
              </div>
            </button>

            {/* Chapters List */}
            {expandedSubject === subjectData.subject && subjectData.chapters.length > 0 && (
              <div className="border-t border-gray-100 divide-y divide-gray-100">
                {subjectData.chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => setSelectedNote(chapter)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                          Ch {chapter.chapterNumber}
                        </span>
                        <p className="font-semibold text-gray-800">{chapter.chapterName}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {chapter.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded-full bg-teal-50 text-teal-700 font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(chapter.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {user?.role === "admin" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(subjectData.subject, chapter.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </button>
                ))}
              </div>
            )}

            {expandedSubject === subjectData.subject && subjectData.chapters.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <p>No chapters found for this subject</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Note Detail Modal */}
      {selectedNote && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedNote(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-700 mb-1">
                  Chapter {selectedNote.chapterNumber}
                </p>
                <h2 className="text-2xl font-bold text-gray-800">{selectedNote.chapterName}</h2>
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedNote.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-teal-100 text-teal-700 font-medium">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3">Chapter Summary</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedNote.content}</p>
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                <span>Uploaded on {new Date(selectedNote.createdAt).toLocaleDateString()}</span>
                {selectedNote.fileUrl && (
                  <button className="flex items-center gap-1 text-teal-700 hover:text-teal-800 font-medium">
                    <Download size={14} /> Download PDF
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