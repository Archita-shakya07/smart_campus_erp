'use client';

import { useState, useEffect } from 'react';
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { Trash2, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from '@/context/AuthContext';

interface Task {
  _id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  isCompleted: boolean;
}

interface TaskStats {
  total: number;
  completed: number;
  overdue: number;
  dueToday: number;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'overdue'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<TaskStats>({ total: 0, completed: 0, overdue: 0, dueToday: 0 });
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    dueDate: '',
    priority: 'medium' as const,
  });

  // Load tasks from localStorage/API
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const sampleTasks: Task[] = [
        {
          _id: '1',
          title: 'Database Design',
          subject: 'Database',
          description: 'Design the ERP database schema with proper normalization',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'high',
          isCompleted: false,
        },
        {
          _id: '2',
          title: 'Frontend Components',
          subject: 'Web Dev',
          description: 'Create reusable UI components for dashboard',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'high',
          isCompleted: false,
        },
        {
          _id: '3',
          title: 'API Integration',
          subject: 'Backend',
          description: 'Integrate backend APIs with frontend',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'medium',
          isCompleted: false,
        },
      ];
      setTasks(sampleTasks);
      localStorage.setItem('tasks', JSON.stringify(sampleTasks));
    }
  }, []);

  // Calculate stats
  useEffect(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const total = tasks.length;
    const completed = tasks.filter((t) => t.isCompleted).length;
    const overdue = tasks.filter(
      (t) => !t.isCompleted && isPast(new Date(t.dueDate + 'T23:59:59'))
    ).length;
    const dueToday = tasks.filter((t) => {
      const taskDate = new Date(t.dueDate);
      return taskDate.getTime() === today.getTime() && !t.isCompleted;
    }).length;

    setStats({ total, completed, overdue, dueToday });
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.dueDate) {
      alert('Please fill in title and due date');
      return;
    }

    const newTask: Task = {
      _id: Date.now().toString(),
      title: formData.title,
      subject: formData.subject,
      description: formData.description,
      dueDate: formData.dueDate,
      priority: formData.priority,
      isCompleted: false,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    setFormData({
      title: '',
      subject: '',
      description: '',
      dueDate: '',
      priority: 'medium',
    });
    setShowForm(false);
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter((t) => t._id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleToggleComplete = (id: string) => {
    const updatedTasks = tasks.map((t) =>
      t._id === id ? { ...t, isCompleted: !t.isCompleted } : t
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    switch (filter) {
      case 'active':
        filtered = tasks.filter((t) => !t.isCompleted);
        break;
      case 'completed':
        filtered = tasks.filter((t) => t.isCompleted);
        break;
      case 'overdue':
        filtered = tasks.filter((t) => !t.isCompleted && isPast(new Date(t.dueDate + 'T23:59:59')));
        break;
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
      case 'medium':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' };
      case 'low':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };
    }
  };

  const getDueDateStatus = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();

    if (isPast(date) && !isToday(date)) return { label: 'Overdue', color: 'text-red-600', icon: AlertCircle };
    if (isToday(date)) return { label: 'Due Today', color: 'text-orange-600', icon: Clock };
    if (isTomorrow(date)) return { label: 'Due Tomorrow', color: 'text-blue-600', icon: Clock };

    const daysLeft = differenceInDays(date, now);
    return { label: `${daysLeft} days left`, color: 'text-green-600', icon: Clock };
  };

  const filteredTasks = getFilteredTasks();
  const colors = ['border-blue-500', 'border-green-500', 'border-purple-500', 'border-pink-500', 'border-indigo-500'];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">📋 Tasks</h1>
              <p className="text-gray-600 text-lg">Manage and track all your assignments and deadlines</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl text-lg"
            >
              <Plus size={24} />
              Add New Task
            </button>
          </div>

          {/* Stats Cards - Expanded */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-lg font-semibold">Total Tasks</p>
                <div className="text-3xl">📊</div>
              </div>
              <p className="text-5xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-lg font-semibold">Completed</p>
                <div className="text-3xl">✅</div>
              </div>
              <p className="text-5xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-lg font-semibold">Due Today</p>
                <div className="text-3xl">⏰</div>
              </div>
              <p className="text-5xl font-bold text-orange-600">{stats.dueToday}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-lg font-semibold">Overdue</p>
                <div className="text-3xl">⚠️</div>
              </div>
              <p className="text-5xl font-bold text-red-600">{stats.overdue}</p>
            </div>
          </div>

          {/* Add Task Form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-2xl p-8 mb-10 border-2 border-blue-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">✨ Create New Task</h2>
              <form onSubmit={handleAddTask} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                      placeholder="Enter task title"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                      placeholder="e.g., Mathematics, Physics"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value as any })
                      }
                      className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                    >
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🔴 High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                    placeholder="Enter task description (optional)"
                    rows={5}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                  >
                    ✅ Create Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-4 rounded-xl font-bold text-lg transition-all"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search & Filters */}
          <div className="mb-10 space-y-5">
            <input
              type="text"
              placeholder="🔍 Search tasks by title, subject, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
            />
            <div className="flex gap-3 flex-wrap">
              {['all', 'active', 'completed', 'overdue'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${
                    filter === f
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-600'
                  }`}
                >
                  {f === 'all'
                    ? '📌 All'
                    : f === 'active'
                      ? '⏳ Active'
                      : f === 'completed'
                        ? '✅ Completed'
                        : '⚠️ Overdue'}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks List - Expanded */}
          <div className="space-y-6">
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
                <p className="text-gray-600 text-2xl font-semibold">
                  🎉 No tasks found. Create one to get started!
                </p>
              </div>
            ) : (
              filteredTasks.map((task, index) => {
                const dueDateStatus = getDueDateStatus(task.dueDate);
                const StatusIcon = dueDateStatus.icon;
                const priorityColors = getPriorityColor(task.priority);

                return (
                  <div
                    key={task._id}
                    className={`bg-white rounded-2xl shadow-lg p-8 border-l-4 transition-all hover:shadow-xl ${
                      task.isCompleted ? 'border-l-green-500 opacity-75' : colors[index % colors.length]
                    }`}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4 flex-wrap">
                          <button
                            onClick={() => handleToggleComplete(task._id)}
                            className={`flex-shrink-0 transition-colors ${
                              task.isCompleted ? 'text-green-600' : 'text-gray-400 hover:text-green-600'
                            }`}
                          >
                            <CheckCircle size={32} />
                          </button>
                          <h3
                            className={`text-2xl font-bold ${
                              task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}
                          >
                            {task.title}
                          </h3>
                          <span
                            className={`px-4 py-2 text-sm font-bold rounded-full border-2 ${priorityColors.bg} ${priorityColors.text} ${priorityColors.border}`}
                          >
                            {task.priority.toUpperCase()}
                          </span>
                        </div>

                        {task.subject && (
                          <p className="text-lg font-semibold text-indigo-600 mb-3 ml-12">
                            📚 {task.subject}
                          </p>
                        )}

                        {task.description && (
                          <p className="text-gray-700 mb-5 ml-12 text-lg leading-relaxed">{task.description}</p>
                        )}

                        <div className="ml-12 space-y-4">
                          <div className="flex items-center gap-3">
                            <StatusIcon size={20} className={dueDateStatus.color} />
                            <span className={`text-lg font-bold ${dueDateStatus.color}`}>
                              {format(new Date(task.dueDate), 'MMM dd, yyyy')} • {dueDateStatus.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
