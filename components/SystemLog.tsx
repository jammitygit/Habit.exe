import React, { useEffect, useRef } from 'react';
import { SystemLogEntry } from '../types';

interface SystemLogProps {
  logs: SystemLogEntry[];
}

const SystemLog: React.FC<SystemLogProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="mt-8 border border-[var(--border-color)] relative h-48 flex flex-col bg-[var(--input-bg)]">
      <div className="absolute top-0 left-2 -mt-3 bg-[var(--bg-color)] px-2 text-xs text-gray-500 border border-[var(--border-color)]">
        sys_log.txt
      </div>
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1 custom-scrollbar">
        {logs.length === 0 && <div className="text-gray-700 italic">waiting for input stream...</div>}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2">
            <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
            <span className={`${
              log.type === 'ERROR' ? 'text-red-400' : 
              log.type === 'SUCCESS' ? 'text-green-500' : 
              log.type === 'AI' ? 'text-blue-400' : 
              log.type === 'ALERT' ? 'text-[var(--text-color)] font-bold animate-pulse' : 
              'text-gray-400'
            }`}>
              {'>'} {log.message}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default SystemLog;