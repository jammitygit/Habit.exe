import React, { useRef, useEffect } from 'react';
import { X, Trophy, Lock, CheckCircle2 } from 'lucide-react';
import { RANKS } from '../constants';

interface RankProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentXp: number;
}

const RankProgressModal: React.FC<RankProgressModalProps> = ({
  isOpen,
  onClose,
  currentXp
}) => {
  const currentRankIndex = [...RANKS].reverse().findIndex(r => currentXp >= r.minXp);
  // reverse findIndex returns index from reversed array, we need real index
  const realRankIndex = currentRankIndex === -1 ? 0 : RANKS.length - 1 - currentRankIndex;
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-[var(--bg-color)] border border-[var(--border-color)] p-6 max-w-md w-full mx-4 shadow-2xl relative text-[var(--text-color)] flex flex-col max-h-[85vh]">
        <div className="absolute top-0 left-2 -mt-3 bg-[var(--bg-color)] px-2 text-xs text-gray-500 border border-[var(--border-color)] font-mono">
          career_ladder.exe
        </div>
        
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-[var(--text-color)]">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
           <Trophy className="w-6 h-6 text-[var(--text-color)]" />
           <h2 className="text-xl font-bold font-mono">rank_progression</h2>
        </div>
        
        <div className="flex justify-between text-xs font-mono text-gray-500 mb-4 px-2">
            <span>designation</span>
            <span>req_xp</span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar border border-[var(--border-color)] bg-[var(--input-bg)] p-2 space-y-1">
            {RANKS.map((rank, index) => {
                const isCompleted = currentXp >= rank.minXp;
                const isCurrent = index === realRankIndex;
                const isLocked = !isCompleted;
                
                // If it's the very next rank
                const isNext = index === realRankIndex + 1;

                return (
                    <div 
                        key={rank.title}
                        ref={isCurrent ? activeRef : null}
                        className={`
                            relative flex items-center justify-between p-3 font-mono text-sm border
                            ${isCurrent ? 'border-[var(--text-color)] bg-[var(--text-color)] text-[var(--bg-color)]' : 'border-transparent'}
                            ${isLocked && !isNext ? 'opacity-40 grayscale' : ''}
                            ${isNext ? 'border-[var(--border-color)] border-dashed opacity-70' : ''}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            {isCurrent && <div className="animate-pulse w-2 h-2 bg-[var(--bg-color)] rounded-full" />}
                            {isCompleted && !isCurrent && <CheckCircle2 className="w-4 h-4 text-[var(--text-color)]" />}
                            {isLocked && <Lock className="w-3 h-3" />}
                            <span className={isCurrent ? 'font-bold' : ''}>{rank.title}</span>
                        </div>
                        <span className={isCurrent ? 'font-bold' : 'opacity-60'}>{rank.minXp}xp</span>
                        
                        {/* Progress Bar for Current Rank to Next */}
                        {isCurrent && index < RANKS.length - 1 && (
                            <div className="absolute bottom-0 left-0 h-1 bg-black/20 w-full">
                                <div 
                                    className="h-full bg-[var(--bg-color)] opacity-50 transition-all duration-500"
                                    style={{ width: `${Math.min(100, Math.max(0, ((currentXp - rank.minXp) / (RANKS[index + 1].minXp - rank.minXp)) * 100))}%` }}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
        
        <div className="mt-4 text-center font-mono text-xs text-gray-500">
            current_status: {currentXp}xp_accumulated
        </div>
      </div>
    </div>
  );
};

export default RankProgressModal;
