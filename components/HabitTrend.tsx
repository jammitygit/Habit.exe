import React from 'react';
import { Habit, HabitStatus } from '../types';

interface HabitTrendProps {
  habit: Habit;
}

const HabitTrend: React.FC<HabitTrendProps> = ({ habit }) => {
  // Generate last 12 days for trend line
  const days = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (11 - i));
    return d.toISOString().split('T')[0];
  });

  // Calculate completion map for O(1) lookup
  const historyMap = new Set(
    habit.history
      .filter(h => h.status === HabitStatus.COMPLETED)
      .map(h => h.date)
  );

  // Generate Chart Data
  const chartData = days.map(date => historyMap.has(date) ? '|' : '_');

  // Trend Calculation logic
  // Compare recent half vs older half
  const midPoint = Math.floor(days.length / 2);
  const firstHalfCount = days.slice(0, midPoint).filter(d => historyMap.has(d)).length;
  const secondHalfCount = days.slice(midPoint).filter(d => historyMap.has(d)).length;
  
  // Check strict recent activity (last 3 days)
  const recentActivity = days.slice(-3).some(d => historyMap.has(d));

  // Determine Trend State
  // Negative if:
  // 1. Performance dropped (secondHalf < firstHalf)
  // 2. OR No activity in last 3 days (stagnation) while having history
  const isNegativeTrend = secondHalfCount < firstHalfCount || (!recentActivity && firstHalfCount > 0);

  // Color selection based on prompt requirements
  const trendColor = isNegativeTrend ? 'text-crt-red' : 'text-crt-white';
  const signalLabel = isNegativeTrend ? 'trace: decaying' : 'trace: stable';

  return (
    <div className={`flex items-center gap-2 text-[10px] font-mono leading-none mb-1 select-none ${trendColor} opacity-90 transition-colors duration-300`}>
      <span className="opacity-60 min-w-[80px] text-right hidden md:block">{signalLabel}</span>
      <div className="flex tracking-[3px]">
        {chartData.map((char, i) => (
          <span 
            key={i} 
            className={`${char === '|' ? 'brightness-125 font-bold drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]' : 'opacity-30'}`}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default HabitTrend;