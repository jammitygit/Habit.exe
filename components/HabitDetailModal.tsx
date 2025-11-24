import React, { useState, useEffect } from 'react';
import { Habit, HabitStatus } from '../types';
import { X, Save, Trash2, Activity, Calendar } from 'lucide-react';

interface HabitDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit | null;
  onSave: (id: string, name: string, frequency: number) => void;
  onDelete: (id: string) => void;
}

const HabitDetailModal: React.FC<HabitDetailModalProps> = ({
  isOpen,
  onClose,
  habit,
  onSave,
  onDelete
}) => {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState(1);
  const [showFullHistory, setShowFullHistory] = useState(false);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setFrequency(habit.frequency || 1);
    }
    setShowFullHistory(false); // Reset on open
  }, [habit]);

  if (!isOpen || !habit) return null;

  const handleSave = () => {
    onSave(habit.id, name, frequency);
    onClose();
  };

  const handleDelete = () => {
    onDelete(habit.id);
    onClose();
  };

  // Date calculations matching App.tsx UTC logic
  // 1. Get Today as YYYY-MM-DD string (UTC)
  const todayStr = new Date().toISOString().split('T')[0];
  
  // 2. Parse as UTC Date object for manipulation
  const endDate = new Date(todayStr); 
  
  // 3. Determine Start Date
  const lookbackDays = showFullHistory ? 365 : 89; // 90 days total (0 to 89)
  let startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - lookbackDays);

  // If showing full history, check if we need to extend back to the very first log
  if (showFullHistory && habit.history.length > 0) {
    const sortedHistory = [...habit.history].sort((a, b) => a.date.localeCompare(b.date));
    const firstLogDateStr = sortedHistory[0].date;
    const firstLogDate = new Date(firstLogDateStr);
    
    if (firstLogDate < startDate) {
      startDate = firstLogDate;
    }
  }
  
  // 4. Generate array of YYYY-MM-DD strings
  const days: string[] = [];
  const currentDateIterator = new Date(startDate);
  
  while (currentDateIterator <= endDate) {
    days.push(currentDateIterator.toISOString().split('T')[0]);
    currentDateIterator.setDate(currentDateIterator.getDate() + 1);
  }

  // Stats Calculation
  const completedCount = days.filter(date => 
    habit.history.some(h => h.date === date && h.status === HabitStatus.COMPLETED)
  ).length;
  
  const efficiency = days.length > 0 ? Math.round((completedCount / days.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-[var(--bg-color)] border border-[var(--border-color)] p-6 max-w-2xl w-full mx-4 shadow-2xl relative text-[var(--text-color)] flex flex-col max-h-[90vh]">
        <div className="absolute top-0 left-2 -mt-3 bg-[var(--bg-color)] px-2 text-xs text-gray-500 border border-[var(--border-color)] font-mono">
          protocol_viewer.exe
        </div>
        
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-[var(--text-color)]">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-[var(--text-color)]" />
            <h2 className="text-xl font-bold font-mono">protocol_details</h2>
          </div>
          <div className="text-xs font-mono text-gray-500">
            efficiency: <span className="text-[var(--text-color)] font-bold">{efficiency}%</span>
            <span className="ml-2 opacity-50">({showFullHistory ? 'all_time' : 'last_90_days'})</span>
          </div>
        </div>

        {/* Edit Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 font-mono text-sm">
          <div className="space-y-2">
            <label className="text-gray-500">protocol_name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] p-2 text-[var(--text-color)] focus:outline-none focus:border-[var(--text-color)]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-gray-500 flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              frequency (every X days)
            </label>
            <input 
              type="number" 
              min="1"
              max="365"
              value={frequency}
              onChange={(e) => setFrequency(parseInt(e.target.value) || 1)}
              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] p-2 text-[var(--text-color)] focus:outline-none focus:border-[var(--text-color)]"
            />
            <div className="text-[10px] text-gray-500">
              {frequency === 1 ? 'schedule: daily execution' : `schedule: execute every ${frequency} days`}
            </div>
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="mb-8 flex-1 overflow-y-auto custom-scrollbar">
           <div className="flex justify-between items-end mb-2">
             <label className="text-gray-500 text-xs font-mono block">
               historical_data_trace {showFullHistory ? '(full_history)' : '(90_days)'}
             </label>
             <button 
               onClick={() => setShowFullHistory(!showFullHistory)}
               className="text-[10px] text-[var(--text-color)] hover:underline opacity-60 hover:opacity-100"
             >
               {showFullHistory ? '[collapse view]' : '[expand full history]'}
             </button>
           </div>
           
           <div 
             className="flex flex-wrap gap-1 content-start p-2 border border-[var(--border-color)] bg-[var(--input-bg)] cursor-pointer hover:border-[var(--text-color)] transition-colors"
             onClick={() => setShowFullHistory(!showFullHistory)}
             title={showFullHistory ? "Click to collapse" : "Click to expand full history"}
           >
              {days.map(date => {
                const log = habit.history.find(h => h.date === date);
                const status = log?.status;
                
                // Styles
                // Empty State: Transparent with faint border (looks like empty slot)
                let className = "bg-transparent border border-[var(--border-color)] opacity-30"; 
                
                // Active State: Filled with text color (White/Black depending on theme)
                if (status === HabitStatus.COMPLETED) className = "bg-[var(--text-color)] border border-[var(--text-color)] opacity-100";
                
                // Failed State: Red
                if (status === HabitStatus.FAILED) className = "bg-red-600 border border-red-600 opacity-100";
                
                return (
                  <div 
                    key={date} 
                    className={`w-3 h-3 ${className} transition-all duration-200`} 
                    title={`${date}: ${status || 'PENDING/SKIPPED'}`}
                  />
                );
              })}
           </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 font-mono text-sm mt-auto pt-4 border-t border-[var(--border-color)]">
          <button 
            onClick={handleSave}
            className="flex-1 bg-[var(--text-color)] text-[var(--bg-color)] font-bold py-2 hover:opacity-90 transition-opacity uppercase flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> save_changes
          </button>
          <button 
            onClick={handleDelete}
            className="bg-red-900/20 text-red-500 border border-red-900/50 px-4 py-2 hover:bg-red-900/40 transition-colors uppercase flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> terminate
          </button>
        </div>

      </div>
    </div>
  );
};

export default HabitDetailModal;