'use client';

import React, { useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from '@/context/AuthContext';

const timetableData: Record<string, any> = {
  Monday: {
    theme: 'border-pink-200 bg-gradient-to-b from-pink-50 to-white',
    slots: [
      { id: 'm1', time: '09:00 - 09:45 AM', subject: 'Maths', teacher: 'Priya Sharma', avatar: '📐', bg: 'bg-[#FCE7F3] text-[#9D174D] border-[#FBCFE8]' },
      { id: 'm2', time: '09:45 - 10:30 AM', subject: 'English', teacher: 'Anjali Verma', avatar: '📖', bg: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]' },
      { id: 'm3', time: '10:45 - 11:30 AM', subject: 'Computer Networks', teacher: 'Rahul Dev', avatar: '💻', bg: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]' },
      { id: 'm4', time: '11:30 - 12:15 PM', subject: 'Python Coding', teacher: 'Amit Khurana', avatar: '🐍', bg: 'bg-[#E0F2FE] text-[#075985] border-[#BAE6FD]' },
      { id: 'm5', time: '01:30 - 02:15 PM', subject: 'Science', teacher: 'Vikram Malhotra', avatar: '🔬', bg: 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]' }
    ]
  },
  Tuesday: {
    theme: 'border-amber-200 bg-gradient-to-b from-amber-50 to-white',
    slots: [
      { id: 't1', time: '09:00 - 09:45 AM', subject: 'History', teacher: 'Priya Sharma', avatar: '🏛️', bg: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]' },
      { id: 't2', time: '09:45 - 10:30 AM', subject: 'English', teacher: 'Anjali Verma', avatar: '📖', bg: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]' },
      { id: 't3', time: '10:45 - 11:30 AM', subject: 'Geography', teacher: 'Rahul Dev', avatar: '🧭', bg: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]' },
      { id: 't4', time: '11:30 - 12:15 PM', subject: 'Python Coding', teacher: 'Amit Khurana', avatar: '🐍', bg: 'bg-[#E0F2FE] text-[#075985] border-[#BAE6FD]' },
      { id: 't5', time: '01:30 - 02:15 PM', subject: 'Physics', teacher: 'Kavita Rao', avatar: '⚛️', bg: 'bg-[#FFFBEB] text-[#78350F] border-[#FEF3C7]' }
    ]
  },
  Wednesday: {
    theme: 'border-blue-200 bg-gradient-to-b from-blue-50 to-white',
    slots: [
      { id: 'w1', time: '09:00 - 09:45 AM', subject: 'Chemistry', teacher: 'Dr. Patel', avatar: '🧪', bg: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]' },
      { id: 'w2', time: '09:45 - 10:30 AM', subject: 'Biology', teacher: 'Shruti Nair', avatar: '🔬', bg: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]' },
      { id: 'w3', time: '10:45 - 11:30 AM', subject: 'Hindi', teacher: 'Divya Singh', avatar: '📚', bg: 'bg-[#FCE7F3] text-[#9D174D] border-[#FBCFE8]' },
      { id: 'w4', time: '11:30 - 12:15 PM', subject: 'Maths', teacher: 'Priya Sharma', avatar: '📐', bg: 'bg-[#FFFBEB] text-[#78350F] border-[#FEF3C7]' },
      { id: 'w5', time: '01:30 - 02:15 PM', subject: 'Physical Education', teacher: 'Rohan Kumar', avatar: '🏃', bg: 'bg-[#E0F2FE] text-[#075985] border-[#BAE6FD]' }
    ]
  },
  Thursday: {
    theme: 'border-green-200 bg-gradient-to-b from-green-50 to-white',
    slots: [
      { id: 'th1', time: '09:00 - 09:45 AM', subject: 'Economics', teacher: 'Mr. Kapoor', avatar: '📊', bg: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]' },
      { id: 'th2', time: '09:45 - 10:30 AM', subject: 'Computer Science', teacher: 'Dr. Saxena', avatar: '💻', bg: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]' },
      { id: 'th3', time: '10:45 - 11:30 AM', subject: 'English Literature', teacher: 'Anjali Verma', avatar: '📖', bg: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]' },
      { id: 'th4', time: '11:30 - 12:15 PM', subject: 'Civics', teacher: 'Vikram Malhotra', avatar: '⚖️', bg: 'bg-[#FCE7F3] text-[#9D174D] border-[#FBCFE8]' },
      { id: 'th5', time: '01:30 - 02:15 PM', subject: 'Art & Design', teacher: 'Neha Gupta', avatar: '🎨', bg: 'bg-[#FFFBEB] text-[#78350F] border-[#FEF3C7]' }
    ]
  },
  Friday: {
    theme: 'border-purple-200 bg-gradient-to-b from-purple-50 to-white',
    slots: [
      { id: 'f1', time: '09:00 - 09:45 AM', subject: 'General Knowledge', teacher: 'Mr. Verma', avatar: '🧠', bg: 'bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]' },
      { id: 'f2', time: '09:45 - 10:30 AM', subject: 'Music', teacher: 'Priya Sharma', avatar: '🎵', bg: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]' },
      { id: 'f3', time: '10:45 - 11:30 AM', subject: 'Debate & Discussion', teacher: 'Anjali Verma', avatar: '🗣️', bg: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]' },
      { id: 'f4', time: '11:30 - 12:15 PM', subject: 'Lab Session', teacher: 'Dr. Patel', avatar: '🔭', bg: 'bg-[#FFFBEB] text-[#78350F] border-[#FEF3C7]' },
      { id: 'f5', time: '01:30 - 02:15 PM', subject: 'Counseling Hour', teacher: 'Ms. Singh', avatar: '💬', bg: 'bg-[#E0F2FE] text-[#075985] border-[#BAE6FD]' }
    ]
  },
  Saturday: {
    theme: 'border-orange-200 bg-gradient-to-b from-orange-50 to-white',
    slots: [
      { id: 's1', time: '09:00 - 10:00 AM', subject: 'Sports Activity', teacher: 'Rohan Kumar', avatar: '⚽', bg: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]' },
      { id: 's2', time: '10:15 - 11:15 AM', subject: 'Extra Coaching', teacher: 'Priya Sharma', avatar: '📐', bg: 'bg-[#FFFBEB] text-[#78350F] border-[#FEF3C7]' },
      { id: 's3', time: '11:30 AM - 12:30 PM', subject: 'Group Project Work', teacher: 'Dr. Saxena', avatar: '👥', bg: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]' }
    ]
  },
  Sunday: {
    theme: 'border-red-200 bg-gradient-to-b from-red-50 to-white',
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

  return (
      
    <DashboardLayout>
      <div className="bg-white text-slate-800 font-sans antialiased">
        <style>{`
          input[type="date"]::-webkit-calendar-picker-indicator {
            cursor: pointer;
            filter: none;
          }
        `}</style>
        
        <div className="max-w-xl mx-auto">
          <div className="mb-6 flex items-center">
            <button 
              onClick={() => window.history.back()} 
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-black text-sm uppercase tracking-wider transition-colors group"
            >
              <span className="text-2xl font-black text-indigo-600 transition-transform group-hover:-translate-x-1">←</span> 
              Back to Dashboard
            </button>
          </div>

          <header className="mb-8 text-left">
            <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-500 to-amber-500 mb-1">
              Class Schedule
            </h1>
            <p className="text-slate-500 font-medium text-sm">Select a date to preview your daily class cards.</p>
          </header>

          <div className="bg-slate-50 border-2 border-slate-200 p-5 rounded-2xl mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm">
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-extrabold uppercase tracking-widest text-indigo-600 mb-2">Pick Schedule Date</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm cursor-pointer"
              />
            </div>
            
            <div className="text-left sm:text-right flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 border-slate-200 pt-3 sm:pt-0">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 block">Selected Day</span>
              <span className="text-base font-black text-white bg-gradient-to-r from-indigo-500 to-pink-500 border border-indigo-400 px-4 py-1.5 rounded-xl inline-block mt-1 shadow-md">
                {selectedDayName}
              </span>
            </div>
          </div>

          {currentDayData ? (
            <div className={`rounded-3xl border-2 p-5 ${currentDayData.theme} shadow-xl transition-all duration-300`}>
              <div className="pb-4 mb-5 flex items-center justify-between border-b-2 border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedDayName}</h2>
                <span className="text-xs px-3 py-1 rounded-xl font-black bg-white border border-slate-200 text-indigo-600 shadow-sm">
                  {currentDayData.slots.length} Classes Loaded
                </span>
              </div>

              <div className="space-y-4">
                {currentDayData.slots.map((slot: any) => (
                  <div 
                    key={slot.id} 
                    className={`p-5 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${slot.bg} shadow-sm`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider mb-2 opacity-90">
                      <span>🕒</span>
                      <span>{slot.time}</span>
                    </div>

                    <h3 className="font-black text-xl tracking-wide mb-4">
                      Subject : {slot.subject}
                    </h3>
                    
                    <div className="flex items-center gap-3 bg-white border-2 border-slate-100 py-2 px-4 rounded-xl w-fit shadow-md">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-sm shadow-inner">
                        {slot.avatar}
                      </div>
                      <span className="text-sm font-black text-slate-900">{slot.teacher}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-12 bg-white border-2 border-slate-200 rounded-3xl shadow-lg">
              <span className="text-5xl block animate-bounce">🎉</span>
              <h3 className="text-lg font-black text-slate-800 mt-4 tracking-wide">Weekend / Rest Day</h3>
              <p className="text-slate-400 text-sm font-medium mt-1">No classes are scheduled on this day.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );


      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 sm:p-6 md:p-12 font-sans antialiased">
          <style>{`
            input[type="date"]::-webkit-calendar-picker-indicator {
              cursor: pointer;
            }
          `}</style>

          <div className="max-w-4xl">
            {/* Header */}
            <header className="mb-8 text-left">
              <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
                📅 Class Schedule
              </h1>
              <p className="text-slate-500 font-medium text-sm">
                Select a date to preview your daily class cards.
              </p>
            </header>

            {/* Date Picker & Day Display */}
            <div className="bg-white border-2 border-slate-200 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm">
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-extrabold uppercase tracking-widest text-indigo-600 mb-2">
                  Pick Schedule Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm cursor-pointer"
                />
              </div>

              <div className="text-left sm:text-right flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 block">
                  Selected Day
                </span>
                <span className="text-base font-black text-white bg-indigo-600 border border-indigo-500 px-4 py-1.5 rounded-xl inline-block mt-1 shadow-sm">
                  {selectedDayName}
                </span>
              </div>
            </div>

            {/* Classes Display */}
            {currentDayData && currentDayData.slots.length > 0 ? (
              <div className={`rounded-3xl border-2 p-6 ${currentDayData.theme} shadow-lg`}>
                <div className="pb-4 mb-5 flex items-center justify-between border-b-2 border-slate-200/60">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    {selectedDayName}
                  </h2>
                  <span className="text-xs px-4 py-1.5 rounded-xl font-black bg-slate-100 border border-slate-200 text-slate-700 shadow-sm">
                    {currentDayData.slots.length} Classes
                  </span>
                </div>

                <div className="space-y-4">
                  {currentDayData.slots.map((slot: any) => (
                    <div
                      key={slot.id}
                      className={`p-5 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer ${slot.bg}`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider mb-2 opacity-90">
                        <span>🕒</span>
                        <span>{slot.time}</span>
                      </div>

                      <h3 className="font-black text-xl tracking-wide mb-4">
                        Subject : {slot.subject}
                      </h3>

                      <div className="flex items-center gap-3 bg-white border-2 border-slate-200/60 py-2.5 px-4 rounded-xl w-fit shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-lg shadow-inner">
                          {slot.avatar}
                        </div>
                        <span className="text-sm font-black text-slate-900">{slot.teacher}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-12 bg-white border-2 border-slate-200 rounded-3xl shadow-md">
                <span className="text-6xl block mb-4">🎉</span>
                <h3 className="text-xl font-black text-slate-800 tracking-wide">
                  {selectedDayName === 'Sunday' ? 'Weekend - Rest Day' : 'No Classes Scheduled'}
                </h3>
                <p className="text-slate-500 text-sm font-medium mt-2">
                  {selectedDayName === 'Sunday'
                    ? 'Enjoy your well-deserved rest!'
                    : 'No classes are scheduled on this day.'}
                </p>
              </div>
            )}

            {/* Weekly Overview */}
            <div className="mt-8 bg-white border-2 border-slate-200 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-4">📊 Weekly Overview</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {Object.keys(timetableData).map((day) => {
                  const isSelected = day === selectedDayName;
                  const classCount = timetableData[day].slots.length;
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
                      className={`p-4 rounded-2xl border-2 text-center transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-gradient-to-b from-indigo-50 to-white shadow-md'
                          : 'border-slate-200 bg-white hover:border-indigo-400 hover:shadow-sm'
                      }`}
                    >
                      <p className={`text-xs font-extrabold uppercase tracking-widest mb-2 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`}>
                        {day.slice(0, 3)}
                      </p>
                      <p className={`text-2xl font-black ${isSelected ? 'text-indigo-600' : 'text-slate-800'}`}>
                        {classCount}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">classes</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    
}
