import React, { useRef, useState, useEffect } from 'react';
import { Download, Upload, Moon, Sun, X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  operatorName: string;
  onOperatorNameChange: (name: string) => void;
  onExport: () => void;
  onImport: (data: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  toggleTheme,
  operatorName,
  onOperatorNameChange,
  onExport,
  onImport
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localName, setLocalName] = useState(operatorName);

  useEffect(() => {
    setLocalName(operatorName);
  }, [operatorName]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImport(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleNameCommit = () => {
    onOperatorNameChange(localName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-[var(--bg-color)] border border-[var(--border-color)] p-6 max-w-md w-full mx-4 shadow-2xl relative text-[var(--text-color)]">
        <div className="absolute top-0 left-2 -mt-3 bg-[var(--bg-color)] px-2 text-xs text-gray-500 border border-[var(--border-color)] font-mono">
          sys_config.exe
        </div>
        
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-[var(--text-color)]">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-6 font-mono flex items-center gap-2">
          system configuration
        </h2>

        <div className="space-y-6 font-mono text-sm">
          
          {/* Theme Section */}
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <span className="text-gray-500">visual_interface_mode</span>
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1 border border-[var(--border-color)] hover:border-[var(--text-color)] transition-colors"
            >
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              {isDarkMode ? 'dark_mode' : 'light_mode'}
            </button>
          </div>

          {/* Operator Name */}
          <div className="space-y-2 border-b border-[var(--border-color)] pb-4">
            <label className="text-gray-500 block">operator_designation</label>
            <input 
              type="text" 
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={handleNameCommit}
              onKeyDown={(e) => e.key === 'Enter' && handleNameCommit()}
              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] p-2 text-[var(--text-color)] focus:outline-none focus:border-[var(--text-color)] font-mono"
            />
          </div>

          {/* Data Management */}
          <div className="space-y-4">
            <div className="text-gray-500 mb-2">data_management</div>
            
            <button 
              onClick={onExport}
              className="w-full flex items-center justify-center gap-2 border border-[var(--border-color)] p-2 hover:bg-[var(--border-color)] transition-colors"
            >
              <Download className="w-4 h-4" />
              export_database.json
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 border border-[var(--border-color)] p-2 hover:bg-[var(--border-color)] transition-colors"
            >
              <Upload className="w-4 h-4" />
              import_database.json
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".json,.txt"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;