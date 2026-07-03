"use client";

import React, { useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from '@/context/AuthContext';

const timetableData: Record<string, any> = {
  Monday: {
    theme: 'border-l-[#EC4899]', // Pink accent line
    badgeColor: 'bg-pink-50 text-pink-700 border-pink-200',
    slots: [
      { id: 'm1', time: '09:00 - 09:45 AM', subject: 'Mathematics', teacher: 'Priya Sharma', avatar: '📐', bg: 'border-l-[#EC4899]' },
      { id: 'm2', time: '09:45 - 10:30 AM', subject: 'English', teacher: 'Anjali Verma', avatar: '📖', bg: 'border-l-[#3B82F6]' },
      { id: 'm3', time: '10:45 - 11:30 AM', subject: 'Computer Networks', teacher: 'Rahul Dev', avatar: '💻', bg: 'border-l-[#10B981]' },
      { id: 'm4', time: '11:30 - 12:15 PM', subject: 'Python Coding', teacher: 'Amit Khurana', avatar: '🐍', bg: 'border-l-[#0EA5E9]' },
      { id: 'm5', time: '01:30 - 02:15 PM', subject: 'Science', teacher: 'Vikram Malhotra', avatar: '🔬', bg: 'border-l-[#22C55E]' }
    ]
  },
  Tuesday: {
    theme: 'border-l-[#F59E0B]', // Amber accent line
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    slots: [
      { id: 't1', time: '09:00 - 09:45 AM', subject: 'History', teacher: 'Priya Sharma', avatar: '🏛️', bg: 'border-l-[#F59E0B]' },
      { id: 't2', time: '09:45 - 10:30 AM', subject: 'English', teacher: 'Anjali Verma', avatar: '📖', bg: 'border-l-[#3B82F6]' },
      { id: 't3', time: '10:45 - 11:30 AM', subject: 'Geography', teacher: 'Rahul Dev', avatar: '🧭', bg: 'border-l-[#10B981]' },
      { id: 't4', time: '11:30 - 12:15 PM', subject: 'Python Coding', teacher: 'Amit Khurana', avatar: '🐍', bg: 'border-l-[#0EA5E9]' },
      { id: 't5', time: '01:30 - 02:15 PM', subject: 'Physics', teacher: 'Kavita Rao', avatar: '⚛️', bg: 'border-l-[#D946EF]' }
    ]
  },
  Wednesday: {
    theme: 'border-l-[#3B82F6]', // Blue accent line
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    slots: [
      { id: 'w1', time: '09:00 - 09:45 AM', subject: 'Chemistry', teacher: 'Dr. Patel', avatar: '🧪', bg: 'border-l-[#3B82F6]' },
      { id: 'w2', time: '09:45 - 10:30 AM', subject: 'Biology', teacher: 'Shruti Nair', avatar: '🔬', bg: 'border-l-[#10B981]' },
      { id: 'w3', time: '10:45 - 11:30 AM', subject: 'Hindi', teacher: 'Divya Singh', avatar: '📚', bg: 'border-l-[#EC4899]' },
      { id: 'w4', time: '11:30 - 12:15 PM', subject: 'Maths', teacher: 'Priya Sharma', avatar: '📐', bg: 'border-l-[#F59E0B]' },
      { id: 'w5', time: '01:30 - 02:15 PM', subject: 'Physical Education', teacher: 'Rohan Kumar', avatar: '🏃', bg: 'border-l-[#0EA5E9]' }
    ]
  },
  Thursday: {
    theme: 'border-l-[#10B981]', // Green accent line
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    slots: [
      { id: 'th1', time: '09:00 - 09:45 AM', subject: 'Economics', teacher: 'Mr. Kapoor', avatar: '📊', bg: 'border-l-[#F59E0B]' },
      { id: 'th2', time: '09:45 - 10:30 AM', subject: 'Computer Science', teacher: 'Dr. Saxena', avatar: '💻', bg: 'border-l-[#10B981]' },
      { id: 'th3', time: '10:45 - 11:30 AM', subject: 'English Literature', teacher: 'Anjali Verma', avatar: '📖', bg: 'border-l-[#3B82F6]' },
      { id: 'th4', time: '11:30 - 12:15 PM', subject: 'Civics', teacher: 'Vikram Malhotra', avatar: '⚖️', bg: 'border-l-[#EC4899]' },
      { id: 'th5', time: '01:30 - 02:15 PM', subject: 'Art & Design', teacher: 'Neha Gupta', avatar: '🎨', bg: 'border-l-[#F59E0B]' }
    ]
  },
  Friday: {
    theme: 'border-l-[#8B5CF6]', // Purple accent line
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    slots: [
      { id: 'f1', time: '09:00 - 09:45 AM', subject: 'General Knowledge', teacher: 'Mr. Verma', avatar: '🧠', bg: 'border-l-[#8B5CF6]' },
      { id: 'f2', time: '09:45 - 10:30 AM', subject: 'Music', teacher: 'Priya Sharma', avatar: '🎵', bg: 'border-l-[#3B82F6]' },
      { id: 'f3', time: '10:45 - 11:30 AM', subject: 'Debate & Discussion', teacher: 'Anjali Verma', avatar: '🗣️', bg: 'border-l-[#10B981]' },
      { id: 'f4', time: '11:30 - 12:15 PM', subject: 'Lab Session', teacher: 'Dr. Patel', avatar: '🔭', bg: 'border-l-[#F59E0B]' },
      { id: 'f5', time: '01:30 - 02:15 PM', subject: 'Counseling Hour', teacher: 'Ms. Singh', avatar: '💬', bg: 'border-l-[#0EA5E9]' }
    ]
  },
  Saturday: {
    theme: 'border-l-[#F97316]', // Orange accent line
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    slots: [
      { id: 's1', time: '09:00 - 10:00 AM', subject: 'Sports Activity', teacher: 'Rohan Kumar', avatar: '⚽', bg: 'border-l-[#F59E0B]' },
      { id: 's2', time: '10:15 - 11:15 AM', subject: 'Extra Coaching', teacher: 'Priya Sharma', avatar: '📐', bg: 'border-l-[#FFFBEB]' },
      { id: 's3', time: '11:30 AM - 12:30 PM', subject: 'Group Project Work', teacher: 'Dr. Saxena', avatar: '👥', bg: 'border-l-[#10B981]' }
    ]
  },
  Sunday: {
    theme: 'border-l-slate-300',
    badgeColor: 'bg-slate-50 text-slate-500 border-slate-200',
    slots: []
  }
};

export default function TimetablePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { user } = useAuth();

  const getDayName = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' });
  };

  const selectedDayName = getDayName(selectedDate);
  const currentDayData = timetableData[selectedDayName];
  const maxClasses = Math.max(...Object.values(timetableData).map((d: any) => d.slots.length));

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 md:p-8 font-sans antialiased">
        <div className="w-full mx-auto">
          
          {/* Back Action Link (Styled precisely like image_06d9cc.png) */}
          <div className="mb-4">
            <button 
              onClick={() => window.history.back()} 
              className="flex items-center gap-1 text-[#0F766E] hover:text-[#0D9488] font-bold text-xs uppercase tracking-wider transition-colors"
            >
              ← BACK TO DASHBOARD 🏡
            </button>
          </div>

          {/* Page Header Layout matching header block structure */}
          <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#1E293B] flex items-center gap-2 mb-1">
                📅 Class Timetable Board
              </h1>
              <p className="text-slate-500 text-sm">
                Access organized daily period layouts, schedule graphs and timing parameters 📋
              </p>
            </div>
            
            {/* Context Stats Counter badge looking like the top right action element */}
            <div className="bg-[#0F766E] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm w-fit flex items-center gap-2">
              ⏱️ Quick Sync Active ✨
            </div>
          </header>

          {/* Date Picker Interactive Search Container */}
          <div className="bg-white border border-slate-200/80 p-4 rounded-xl mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-slate-400 text-lg">🔍</span>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Viewing Schedule:</span>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                {selectedDayName}
              </span>
            </div>
          </div>

          {/* Dynamic Timetable List Rows (Matching Card Layouts in image_06d9cc.png) */}
          <div className="space-y-3.5">
            {currentDayData && currentDayData.slots.length > 0 ? (
              currentDayData.slots.map((slot: any) => (
                <div 
                  key={slot.id} 
                  className={`bg-white border border-slate-200/90 rounded-r-xl border-l-4 ${slot.bg} shadow-sm flex items-center justify-between p-4 transition-all hover:bg-slate-50/50`}
                >
                  <div className="flex items-center gap-4">
                    {/* Inner avatar icon placeholder container */}
                    <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shadow-inner">
                      {slot.avatar}
                    </div>
                    
                    {/* Information stacking block */}
                    <div>
                      <h3 className="font-bold text-[#1E293B] text-base mb-0.5">
                        {slot.subject}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1 text-slate-400">🕒 {slot.time}</span>
                        <span className="flex items-center gap-1">👨‍🏫 Instructor: <strong className="text-slate-700">{slot.teacher}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right side badge wrapper matching container badge styling */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-3 py-1 rounded-full font-bold bg-teal-50 text-teal-700 border border-teal-200 shadow-sm">
                      Active Slot
                    </span>
                    <span className="text-slate-400 text-sm font-bold hidden sm:inline">▼</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-12 bg-white border border-slate-200 rounded-xl shadow-sm">
                <span className="text-4xl block mb-2">🏖️</span>
                <h3 className="text-base font-bold text-slate-700">No Scheduled Classes Found</h3>
                <p className="text-slate-400 text-xs mt-0.5">Enjoy your holiday or preview another target calendar date!</p>
              </div>
            )}
          </div>

          {/* Weekly Workload Graph Visualizer panel */}
          <div className="mt-8 bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              📊 Weekly Period Volume Overview
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {Object.keys(timetableData).map((day) => {
                const isSelected = day === selectedDayName;
                const classCount = timetableData[day].slots.length;
                const barHeight = maxClasses > 0 ? (classCount / maxClasses) * 100 : 0;

                return (
                  <button
                    key={day}
                    onClick={() => {
                      const newDate = new Date();
                      const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);
                      const currentDayIndex = newDate.getDay();
                      const diff = dayIndex - currentDayIndex;
                      newDate.setDate(newDate.getDate() + diff);
                      setSelectedDate(newDate.toISOString().split('T')[0]);
                    }}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/30 ring-1 ring-teal-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Visual graph pillar */}
                    <div className="w-full bg-slate-50 h-10 rounded-md flex items-end justify-center overflow-hidden mb-2">
                      <div 
                        className={`w-4/5 rounded-t-sm transition-all duration-300 ${
                          isSelected ? 'bg-teal-600' : 'bg-slate-300'
                        }`}
                        style={{ height: `${Math.max(barHeight, 12)}%` }}
                      />
                    </div>

                    <span className={`text-xs font-bold ${isSelected ? 'text-teal-700' : 'text-slate-500'}`}>
                      {day.slice(0, 3)}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 mt-0.5">
                      {classCount} <span className="text-[10px] text-slate-400 font-normal">periods</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}