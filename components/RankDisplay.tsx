import React from 'react';
import { UserStats } from '../types';
import { List } from 'lucide-react';

interface RankDisplayProps {
  stats: UserStats;
  onOpenRoadmap: () => void;
}

const RankDisplay: React.FC<RankDisplayProps> = ({ stats, onOpenRoadmap }) => {
  const totalRange = stats.nextRankXp;
  // Prevent division by zero if max rank
  const progressPercent = totalRange > 0 ? Math.min(100, Math.max(0, (stats.xp / totalRange) * 100)) : 100;
  
  // ASCII Progress Bar generation
  const totalBars = 20;
  const filledBars = Math.floor((progressPercent / 100) * totalBars);
  const emptyBars = totalBars - filledBars;
  const asciiBar = `[${'='.repeat(filledBars)}${'-'.repeat(emptyBars)}]`;

  return (
    <div 
      onClick={onOpenRoadmap}
      className="border border-[var(--border-color)] p-4 mb-6 relative group bg-[var(--input-bg)] cursor-pointer hover:border-[var(--text-color)] transition-all select-none"
      role="button"
      tabIndex={0}
      aria-label="View Rank Roadmap"
    >
      <div className="absolute top-0 left-2 -mt-3 bg-[var(--bg-color)] px-2 text-xs text-gray-500 border border-[var(--border-color)] group-hover:text-[var(--text-color)] group-hover:border-[var(--text-color)] transition-colors">
        status_module
      </div>
      
      {/* Subtle indicator icon in top right */}
      <div className="absolute top-2 right-2 text-gray-600 group-hover:text-[var(--text-color)] transition-colors">
        <List className="w-4 h-4" />
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-end mb-4 font-mono mt-2 md:mt-0 pointer-events-none">
        <div>
          <span className="text-gray-500 text-xs block mb-1">current rank</span>
          <span className="text-2xl md:text-3xl font-semibold text-[var(--text-color)] tracking-tight">{stats.rankTitle}</span>
        </div>
        <div className="text-right mt-2 md:mt-0">
          <span className="text-xs text-gray-500 block mb-1">xp accumulation</span>
          <span className="text-lg text-gray-400">{stats.xp} <span className="text-gray-600">/ {stats.nextRankXp}</span></span>
        </div>
      </div>

      {/* ASCII Progress Bar */}
      <div className="font-mono text-xs md:text-sm text-gray-400 tracking-widest mb-1 truncate pointer-events-none">
        {asciiBar}
      </div>
      
      <div className="flex justify-between text-[10px] text-gray-500 uppercase pointer-events-none">
        <span>maintenance_req: stable</span>
        <span>dist_to_promo: {stats.nextRankXp - stats.xp}xp</span>
      </div>
    </div>
  );
};

export default RankDisplay;