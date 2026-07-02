'use client';

import { useState, useEffect } from 'react';
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { Trash2, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from '@/context/AuthContext';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  progress: number;
  category: string;
  createdAt: string;
  assignedTo?: string;
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
    description: '',
    dueDate: '',
    priority: 'medium' as const,
    category: 'General',
    progress: 0,
  });

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Sample tasks for demo
      const sampleTasks: Task[] = [
        {
          id: '1',
          title: 'Database Design',
          description: 'Design the ERP database schema',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'high',
          completed: false,
          progress: 65,
          category: 'Development',
          createdAt: new Date().toISOString(),
          assignedTo: 'You',
        },
        {
          id: '2',
          title: 'Frontend Components',
          description: 'Create reusable UI components for dashboard',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'high',
          completed: false,
          progress: 40,
          category: 'Development',
          createdAt: new Date().toISOString(),
          assignedTo: 'You',
        },
        {
          id: '3',
          title: 'API Integration',
          description: 'Integrate backend APIs with frontend',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'medium',
          completed: false,
          progress: 25,
          category: 'Development',
          createdAt: new Date().toISOString(),
          assignedTo: 'You',
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
    const completed = tasks.filter((t) => t.completed).length;
    const overdue = tasks.filter(
      (t) => !t.completed && isPast(new Date(t.dueDate + 'T23:59:59'))
    ).length;
    const dueToday = tasks.filter((t) => {
      const taskDate = new Date(t.dueDate);
      return taskDate.getTime() === today.getTime() && !t.completed;
    }).length;

    setStats({ total, completed, overdue, dueToday });
  }, [tasks]);

  // Add or update task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.dueDate) {
      alert('Please fill in title and due date');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      priority: formData.priority,
      completed: false,
      progress: formData.progress,
      category: formData.category,
      createdAt: new Date().toISOString(),
      assignedTo: 'You',
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      category: 'General',
      progress: 0,
    });
    setShowForm(false);
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  // Toggle task completion
  const handleToggleComplete = (id: string) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed, progress: !t.completed ? 100 : 0 } : t
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  // Update task progress
  const handleUpdateProgress = (id: string, newProgress: number) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, progress: newProgress, completed: newProgress === 100 } : t
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  // Filter tasks
  const getFilteredTasks = () => {
    let filtered = tasks;

    switch (filter) {
      case 'active':
        filtered = tasks.filter((t) => !t.completed);
        break;
      case 'completed':
        filtered = tasks.filter((t) => t.completed);
        break;
      case 'overdue':
        filtered = tasks.filter((t) => !t.completed && isPast(new Date(t.dueDate + 'T23:59:59')));
        break;
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDueDateStatus = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();

    if (isPast(date)) return { label: 'Overdue', color: 'text-red-600', icon: AlertCircle };
    if (isToday(date)) return { label: 'Due Today', color: 'text-orange-600', icon: Clock };
    if (isTomorrow(date)) return { label: 'Due Tomorrow', color: 'text-blue-600', icon: Clock };

    const daysLeft = differenceInDays(date, now);
    return { label: `${daysLeft} days left`, color: 'text-green-600', icon: Clock };
  };

  const filteredTasks = getFilteredTasks();

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white text-slate-800 font-sans antialiased">
        <div className="max-w-4xl mx-auto"></div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">📋 Task Tracker</h1>
                <p className="text-gray-600">Organize and track your tasks efficiently</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                Add Task
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-all">
                <p className="text-gray-600 text-sm font-semibold mb-2">📊 Total Tasks</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition-all">
                <p className="text-gray-600 text-sm font-semibold mb-2">✅ Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-all">
                <p className="text-gray-600 text-sm font-semibold mb-2">⏰ Due Today</p>
                <p className="text-3xl font-bold text-orange-600">{stats.dueToday}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500 hover:shadow-lg transition-all">
                <p className="text-gray-600 text-sm font-semibold mb-2">⚠️ Overdue</p>
                <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
              </div>
            </div>

            {/* Add Task Form */}
            {showForm && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-blue-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ Create New Task</h2>
                <form onSubmit={handleAddTask} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Task Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="Enter task title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) =>
                          setFormData({ ...formData, dueDate: e.target.value })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) =>
                          setFormData({ ...formData, priority: e.target.value as any })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      >
                        <option value="low">🟢 Low</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="high">🔴 High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      >
                        <option value="General">📌 General</option>
                        <option value="Development">💻 Development</option>
                        <option value="Study">📚 Study</option>
                        <option value="Meeting">🤝 Meeting</option>
                        <option value="Personal">🎯 Personal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Progress (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={(e) =>
                          setFormData({ ...formData, progress: parseInt(e.target.value) })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Enter task description (optional)"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 rounded-lg font-semibold transition-all"
                    >
                      ✅ Create Task
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition-all"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Filters & Search */}
            <div className="mb-8 space-y-4">
              <input
                type="text"
                placeholder="🔍 Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <div className="flex gap-2 flex-wrap">
                {['all', 'active', 'completed', 'overdue'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      filter === f
                        ? 'bg-blue-600 text-white shadow-md'
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

            {/* Tasks List */}
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <p className="text-gray-600 text-lg">
                    🎉 No tasks found. Create one to get started!
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const dueDateStatus = getDueDateStatus(task.dueDate);
                  const StatusIcon = dueDateStatus.icon;

                  return (
                    <div
                      key={task.id}
                      className={`bg-white rounded-lg shadow-md p-6 border-l-4 transition-all hover:shadow-lg ${
                        task.completed ? 'border-l-green-500 opacity-75' : 'border-l-blue-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <button
                              onClick={() => handleToggleComplete(task.id)}
                              className={`flex-shrink-0 ${
                                task.completed ? 'text-green-600' : 'text-gray-400'
                              } hover:text-green-600 transition-colors`}
                            >
                              <CheckCircle size={24} />
                            </button>
                            <h3
                              className={`text-lg font-bold ${
                                task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                              }`}
                            >
                              {task.title}
                            </h3>
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(
                                task.priority
                              )}`}
                            >
                              {task.priority.toUpperCase()}
                            </span>
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                              {task.category}
                            </span>
                          </div>

                          {task.description && (
                            <p className="text-gray-600 mb-3 ml-9">{task.description}</p>
                          )}

                          <div className="ml-9 space-y-3">
                            {/* Progress Bar */}
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-gray-700">
                                  Progress
                                </span>
                                <span className="text-sm font-bold text-blue-600">
                                  {task.progress}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-300 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all"
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={task.progress}
                                onChange={(e) =>
                                  handleUpdateProgress(task.id, parseInt(e.target.value))
                                }
                                className="w-full mt-2 cursor-pointer"
                                disabled={task.completed}
                              />
                            </div>

                            {/* Due Date */}
                            <div className="flex items-center gap-2">
                              <StatusIcon size={16} className={dueDateStatus.color} />
                              <span className={`text-sm font-semibold ${dueDateStatus.color}`}>
                                {format(new Date(task.dueDate), 'MMM dd, yyyy')} ·{' '}
                                {dueDateStatus.label}
                              </span>
                            </div>

                            {/* Created Info */}
                            <div className="text-xs text-gray-500">
                              Created {format(new Date(task.createdAt), 'MMM dd, yyyy')} • Assigned
                              to {task.assignedTo}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="flex-shrink-0 ml-4 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
        </DashboardLayout>
  );
}

