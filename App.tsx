import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UserStats, Habit, HabitLog, SystemLogEntry, HabitStatus } from './types';
import { RANKS, XP_PER_LOG, INITIAL_HABITS, XP_PENALTY_UNLOG, STREAK_BONUS_THRESHOLD, STREAK_BONUS_MULTIPLIER } from './constants';
import RankDisplay from './components/RankDisplay';
import HabitHeatmap from './components/HabitHeatmap';
import HabitTrend from './components/HabitTrend';
import SystemLog from './components/SystemLog';
import CRTOverlay from './components/CRTOverlay';
import SettingsModal from './components/SettingsModal';
import HabitDetailModal from './components/HabitDetailModal';
import RankProgressModal from './components/RankProgressModal';
import { generateTacticalAnalysis } from './services/geminiService';
import { Terminal, Check, X, ShieldAlert, Cpu, Plus, Trash2, Edit2, Save, Clock, Settings, Maximize2 } from 'lucide-react';

export default function App() {
  // State
  const [xp, setXp] = useState<number>(0);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [systemLogs, setSystemLogs] = useState<SystemLogEntry[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0); // 0: init, 1: loading, 2: ready
  const [timeRemaining, setTimeRemaining] = useState('');
  
  // Settings & Globals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [operatorName, setOperatorName] = useState('operator');
  const [isRankModalOpen, setIsRankModalOpen] = useState(false);

  // Detail View
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  // Edit/Add/Delete State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [itemToDelete, setItemToDelete] = useState<{id: string, name: string} | null>(null);

  // Refs for rank tracking
  const prevRankRef = useRef('');

  // Theme Toggle Effect
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  // Computed Stats
  const getRank = (currentXp: number) => {
    // Find the highest rank where currentXp >= minXp
    // Reverse array to find last matching element
    const rank = [...RANKS].reverse().find(r => currentXp >= r.minXp) || RANKS[0];
    const nextRank = RANKS.find(r => r.minXp > currentXp) || { minXp: 99999, title: 'max_level' };
    return { title: rank.title, nextXp: nextRank.minXp };
  };

  const { title: rankTitle, nextXp: nextRankXp } = getRank(xp);
  const userStats: UserStats = {
    xp,
    rankTitle,
    nextRankXp,
    level: Math.floor(xp / 1000) + 1
  };

  // Helper to add system log
  const addLog = useCallback((message: string, type: SystemLogEntry['type']) => {
    const newLog: SystemLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message: message.toLowerCase(),
      type
    };
    setSystemLogs(prev => [...prev.slice(-49), newLog]);
  }, []);

  // Operator Name Update Handler
  const updateOperatorName = (newName: string) => {
    if (newName !== operatorName) {
      setOperatorName(newName);
      addLog(`operator designation updated: ${operatorName} -> ${newName}`, "INFO");
    }
  };

  // Check for Rank Change
  useEffect(() => {
    if (prevRankRef.current && prevRankRef.current !== rankTitle) {
      // Rank changed
      const currentRankIndex = RANKS.findIndex(r => r.title === rankTitle);
      const prevRankIndex = RANKS.findIndex(r => r.title === prevRankRef.current);
      
      const isPromo = currentRankIndex > prevRankIndex;
      if (isPromo) {
         addLog(`*** system alert: promotion achieved *** rank: ${rankTitle}`, "ALERT");
      } else {
         addLog(`*** system alert: rank demotion detected *** rank: ${rankTitle}`, "ALERT");
      }
    }
    prevRankRef.current = rankTitle;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankTitle]);


  // Timer & Boot Sequence
  useEffect(() => {
    // Timer Logic
    const timerInterval = setInterval(() => {
      const now = new Date();
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const diff = end.getTime() - now.getTime();
      
      const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const s = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
      setTimeRemaining(`${h}:${m}:${s}`);
    }, 1000);

    // Boot Sequence
    const boot = async () => {
      addLog("bios check... ok", "INFO");
      await new Promise(r => setTimeout(r, 600));
      setLoadingPhase(1);
      addLog("> loading directives... [25%]", "INFO");
      await new Promise(r => setTimeout(r, 800));
      addLog("> verifying data integrity... [88%]", "INFO");
      await new Promise(r => setTimeout(r, 400));
      addLog(`system initialized. welcome back, ${operatorName}.`, "SUCCESS");
      
      // Weekly Summary Check (Simulated)
      addLog("weekly_audit: 12/15 directives executed. efficiency: 80%", "INFO");
      
      setLoadingPhase(2);
    };
    boot();

    return () => clearInterval(timerInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Decay Warning
  useEffect(() => {
    if (loadingPhase === 2) {
       const hours = new Date().getHours();
       // If it's late (after 8PM) and habits are pending
       const pendingCount = habits.filter(h => {
         const today = new Date().toISOString().split('T')[0];
         return !h.history.find(l => l.date === today);
       }).length;

       if (hours >= 20 && pendingCount > 0) {
         addLog("[decay warning] log window closing. immediate action required.", "ERROR");
       }
    }
  }, [loadingPhase, habits, addLog]);


  // Habit Handlers
  const handleToggleHabit = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(prevHabits => prevHabits.map(habit => {
      if (habit.id !== habitId) return habit;

      const existingLog = habit.history.find(h => h.date === today);
      const isCompleted = existingLog?.status === HabitStatus.COMPLETED;

      if (isCompleted) {
        // Reverse Action (Unlog)
        const xpToDeduct = existingLog.xpGained || XP_PENALTY_UNLOG;
        setXp(curr => Math.max(0, curr - xpToDeduct));
        addLog(`action reversed: ${habit.name} // -${xpToDeduct} xp`, "ERROR");
        
        // Remove from history
        const newHistory = habit.history.filter(h => h.date !== today);
        return { ...habit, history: newHistory, streak: Math.max(0, habit.streak - 1) };
      } else {
        // Log Action
        // Streak Bonus Logic
        const isBonus = habit.streak >= STREAK_BONUS_THRESHOLD;
        const multiplier = isBonus ? STREAK_BONUS_MULTIPLIER : 1;
        const xpGain = Math.floor(XP_PER_LOG * multiplier);

        setXp(curr => curr + xpGain);
        
        if (isBonus) {
           addLog(`logged: ${habit.name} // +${xpGain} xp [streak bonus active]`, "SUCCESS");
        } else {
           addLog(`logged: ${habit.name} // +${xpGain} xp`, "SUCCESS");
        }
        
        const newLog: HabitLog = { date: today, status: HabitStatus.COMPLETED, xpGained: xpGain };
        return { ...habit, history: [...habit.history, newLog], streak: habit.streak + 1 };
      }
    }));
  };

  const handleAIAnalysis = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    addLog("establishing uplink... requesting tactical brief.", "INFO");
    
    try {
      const response = await generateTacticalAnalysis(habits, userStats);
      addLog(response, "AI");
    } catch (e) {
      addLog("uplink failed.", "ERROR");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Manage Habits
  const handleDeleteHabit = (id: string, name?: string) => {
    const habitName = name || habits.find(h => h.id === id)?.name || 'unknown';
    setItemToDelete({ id, name: habitName });
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setHabits(prev => prev.filter(h => h.id !== itemToDelete.id));
      addLog(`directive terminated: ${itemToDelete.name}`, "ERROR");
      setItemToDelete(null);
    }
  };

  const startEditing = (habit: Habit) => {
    setEditingId(habit.id);
    setEditName(habit.name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      const formattedName = editName.trim().toLowerCase().replace(/\s+/g, '_');
      setHabits(prev => prev.map(h => 
        h.id === editingId ? { ...h, name: formattedName } : h
      ));
      addLog(`directive updated: ${formattedName}`, "INFO");
    }
    setEditingId(null);
    setEditName('');
  };

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;
    
    const formattedName = newHabitName.trim().toLowerCase().replace(/\s+/g, '_');
    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      name: formattedName,
      frequency: 1,
      history: [],
      streak: 0
    };
    
    setHabits(prev => [...prev, newHabit]);
    addLog(`new directive initialized: ${formattedName}`, "SUCCESS");
    setNewHabitName('');
    setIsAdding(false);
  };

  // Import/Export
  const exportData = () => {
    const data = {
      stats: userStats,
      habits: habits,
      operatorName: operatorName,
      logs: systemLogs,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit_exe_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    addLog("database exported successfully.", "SUCCESS");
  };

  const importData = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.habits && Array.isArray(data.habits)) {
        setHabits(data.habits);
      }
      if (data.stats && data.stats.xp) {
        setXp(data.stats.xp);
      }
      if (data.operatorName) {
        setOperatorName(data.operatorName);
      }
      addLog("database import complete. system rebooted.", "SUCCESS");
      setIsSettingsOpen(false);
    } catch (e) {
      addLog("err: corrupt_data_file // import_aborted", "ERROR");
    }
  };

  // Detailed View Save
  const updateHabitDetails = (id: string, name: string, frequency: number) => {
    setHabits(prev => prev.map(h => 
      h.id === id ? { ...h, name, frequency } : h
    ));
    addLog(`directive config updated: ${name}`, "INFO");
  };

  // Current Date Display
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' }).toLowerCase();

  return (
    <div className="min-h-screen w-full transition-colors duration-300 bg-[var(--bg-color)] text-[var(--text-color)] font-mono selection:bg-[var(--text-color)] selection:text-[var(--bg-color)] p-4 md:p-8 flex justify-center relative">
      <CRTOverlay />
      
      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
        operatorName={operatorName}
        onOperatorNameChange={updateOperatorName}
        onExport={exportData}
        onImport={importData}
      />

      <HabitDetailModal
        isOpen={!!selectedHabitId}
        onClose={() => setSelectedHabitId(null)}
        habit={habits.find(h => h.id === selectedHabitId) || null}
        onSave={updateHabitDetails}
        onDelete={handleDeleteHabit}
      />
      
      <RankProgressModal 
        isOpen={isRankModalOpen}
        onClose={() => setIsRankModalOpen(false)}
        currentXp={xp}
      />

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-[var(--bg-color)] border border-[var(--text-color)] p-6 max-w-sm w-full mx-4 shadow-2xl relative">
            <div className="absolute top-0 left-2 -mt-3 bg-[var(--bg-color)] px-2 text-xs text-red-500 border border-red-500 font-mono">
              system_alert
            </div>
            
            <h3 className="text-red-500 font-bold mb-4 flex items-center gap-2 font-mono text-lg">
              <ShieldAlert className="w-5 h-5" />
              warning: destructive_action
            </h3>
            <p className="text-gray-500 mb-6 font-mono text-sm leading-relaxed">
              confirm termination of directive:<br/>
              <span className="text-[var(--text-color)] font-bold block mt-2 p-2 border border-[var(--border-color)] bg-[var(--input-bg)]">"{itemToDelete.name}"</span>
            </p>
            
            <div className="flex gap-4 font-mono text-sm">
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-black font-bold py-2 hover:bg-red-500 transition-colors uppercase"
              >
                [ confirm ]
              </button>
              <button 
                onClick={() => setItemToDelete(null)}
                className="flex-1 border border-gray-600 text-gray-400 py-2 hover:border-[var(--text-color)] hover:text-[var(--text-color)] transition-colors uppercase"
              >
                [ cancel ]
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl relative z-10">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 border-b border-[var(--border-color)] pb-4 gap-4">
          <div className="flex items-center gap-3">
            <Terminal className="w-6 h-6 md:w-8 md:h-8 text-gray-500" />
            <h1 className="text-xl md:text-3xl font-semibold tracking-tight text-[var(--text-color)]">Habit.exe</h1>
          </div>
          <div className="text-right text-xs md:text-sm text-gray-500 font-mono flex flex-col md:flex-row md:items-center gap-4">
            <div>
              <div>date: {currentDate}</div>
              <div className="flex items-center justify-end gap-2 text-gray-400">
                 <Clock className="w-3 h-3" />
                 logging_window: <span className="text-[var(--text-color)]">{timeRemaining}</span>
              </div>
            </div>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-[var(--border-color)] hover:text-[var(--text-color)] rounded transition-colors"
              title="config"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Rank Section */}
        <RankDisplay stats={userStats} onOpenRoadmap={() => setIsRankModalOpen(true)} />

        {/* Main Habit List */}
        {loadingPhase < 2 ? (
            <div className="h-64 flex flex-col items-center justify-center border border-[var(--border-color)] bg-[var(--bg-color)] text-gray-500 animate-pulse">
                <span>[system_boot_sequence_initiated]</span>
                <span className="text-xs mt-2">loading directives...</span>
            </div>
        ) : (
        <div className="space-y-6 mb-8 animate-in fade-in duration-700">
          <div className="flex justify-between items-end border-b border-[var(--border-color)] pb-2 mb-4">
            <h2 className="text-lg font-medium text-gray-400">Active Directives</h2>
            <button 
              onClick={handleAIAnalysis}
              disabled={isAnalyzing}
              className={`flex items-center gap-2 text-xs border border-[var(--border-color)] px-3 py-1 text-gray-500 hover:border-[var(--text-color)] hover:text-[var(--text-color)] transition-colors ${isAnalyzing ? 'opacity-50 cursor-wait' : ''}`}
            >
              <Cpu className="w-3 h-3" />
              {isAnalyzing ? 'processing...' : 'run tactical analysis'}
            </button>
          </div>

          {habits.map(habit => {
            const today = new Date().toISOString().split('T')[0];
            const isDone = habit.history.some(h => h.date === today && h.status === HabitStatus.COMPLETED);
            const isEditing = editingId === habit.id;
            const hasStreakBonus = habit.streak >= STREAK_BONUS_THRESHOLD;

            return (
              <div key={habit.id} className="group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-[var(--border-color)] hover:border-gray-500 transition-colors bg-[var(--input-bg)]">
                  
                  {/* Habit Info */}
                  <div className="flex-1 w-full cursor-pointer" onClick={() => !isEditing && setSelectedHabitId(habit.id)}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 w-full">
                        <span className={`shrink-0 w-2 h-2 ${isDone ? 'bg-[#4ade80]' : 'bg-[#ef4444]'} rounded-full`}></span>
                        
                        {isEditing ? (
                          <div className="flex items-center gap-2 w-full mr-2" onClick={(e) => e.stopPropagation()}>
                             <input 
                               type="text" 
                               value={editName}
                               onChange={(e) => setEditName(e.target.value)}
                               className="bg-black border border-white text-white px-2 py-1 text-lg w-full focus:outline-none focus:ring-1 focus:ring-white font-normal placeholder-gray-600"
                               autoFocus
                               onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                             />
                             <button onClick={saveEdit} className="p-1 hover:bg-white hover:text-black rounded-sm" title="save"><Save className="w-4 h-4" /></button>
                             <button onClick={() => setEditingId(null)} className="p-1 hover:bg-red-500 hover:text-white rounded-sm" title="cancel"><X className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                             <div className="flex items-center gap-3">
                                <h3 className="text-lg md:text-xl font-normal text-[var(--text-color)] truncate">
                                    {habit.name} 
                                </h3>
                                {hasStreakBonus && isDone && <span className="text-[10px] bg-[var(--text-color)] text-[var(--bg-color)] px-1 animate-pulse">BONUS</span>}
                             </div>
                             
                             {/* Controls (Visible on Hover) */}
                             <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-4" onClick={(e) => e.stopPropagation()}>
                               <button onClick={() => setSelectedHabitId(habit.id)} className="text-gray-600 hover:text-[var(--text-color)] transition-colors p-1" title="details">
                                 <Maximize2 className="w-4 h-4" />
                               </button>
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-1">
                      <span className={hasStreakBonus ? 'text-[var(--text-color)]' : ''}>streak: {habit.streak}</span>
                      <span>status: {isDone ? 'complete' : 'pending'}</span>
                      {habit.frequency > 1 && <span>freq: {habit.frequency}d</span>}
                    </div>

                    {/* Trend & Heatmap */}
                    <HabitTrend habit={habit} />
                    <HabitHeatmap habit={habit} />
                  </div>

                  {/* Action Button */}
                  {!isEditing && (
                    <button
                      onClick={() => handleToggleHabit(habit.id)}
                      className={`
                        shrink-0 w-full md:w-32 h-10 flex items-center justify-center gap-2 text-sm border transition-all duration-100 active:scale-95
                        ${isDone 
                          ? 'bg-transparent border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444] hover:text-black' 
                          : 'bg-[var(--bg-color)] text-gray-400 border-[var(--border-color)] hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] hover:border-[var(--text-color)]'
                        }
                      `}
                    >
                      {isDone ? (
                        <>
                          <ShieldAlert className="w-4 h-4" />
                          unlog
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          log
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add Habit Section */}
          {isAdding ? (
            <div className="border border-[var(--border-color)] border-dashed p-4 flex gap-2 bg-[var(--input-bg)]">
              <input 
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="enter_protocol_name"
                className="flex-1 bg-transparent border-b border-[var(--border-color)] focus:border-[var(--text-color)] text-[var(--text-color)] font-mono focus:outline-none p-1 placeholder-gray-700"
                onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
                autoFocus
              />
              <button onClick={handleAddHabit} className="text-gray-400 hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] px-3 transition-colors text-sm">init</button>
              <button onClick={() => setIsAdding(false)} className="text-red-500 hover:bg-red-900/30 px-3 transition-colors text-sm">cancel</button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAdding(true)}
              className="w-full border border-[var(--border-color)] border-dashed p-4 text-gray-500 hover:text-[var(--text-color)] hover:border-gray-500 transition-all flex items-center justify-center gap-2 text-sm group"
            >
              <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> initialize new directive
            </button>
          )}
        </div>
        )}

        {/* System Logs */}
        <SystemLog logs={systemLogs} />
      </div>
    </div>
  );
}
