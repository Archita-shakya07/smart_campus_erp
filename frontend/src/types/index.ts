export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  course: string;
  year: number;
  avatar: string;
}

export interface Task {
  _id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  description: string;
  isCompleted: boolean;
}

export interface TimetableEntry {
  _id: string;
  subject: string;
  teacher: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  colorTag: string;
}

export interface Attendance {
  _id: string;
  subject: string;
  date: string;
  status: "present" | "absent" | "late";
}

export interface Notice {
  _id: string;
  title: string;
  body: string;
  category: "general" | "exam" | "event" | "holiday";
  createdAt: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}