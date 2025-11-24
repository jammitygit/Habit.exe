import React from 'react';
import { Habit, HabitStatus } from '../types';

interface HabitHeatmapProps {
  habit: Habit;
}

const HabitHeatmap: React.FC<HabitHeatmapProps> = ({ habit }) => {
  // Generate last 14 days for display
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="flex gap-1 mt-2 overflow-hidden">
      {days.map((date) => {
        const log = habit.history.find((h) => h.date === date);
        let bgColor = 'bg-gray-900'; // Default Empty
        let borderColor = 'border-gray-800';

        if (log?.status === HabitStatus.COMPLETED) {
          bgColor = 'bg-white';
          borderColor = 'border-white';
        } else if (log?.status === HabitStatus.FAILED) {
          bgColor = 'bg-red-600';
          borderColor = 'border-red-600';
        }

        return (
          <div 
            key={date}
            className={`w-3 h-3 md:w-4 md:h-4 border ${borderColor} ${bgColor} transition-colors duration-200`}
            title={date}
          />
        );
      })}
    </div>
  );
};

export default HabitHeatmap;