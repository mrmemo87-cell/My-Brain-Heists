
import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  colorClass?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, label, colorClass = 'bg-cyan-500' }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-bold text-gray-300">{label}</span>
        <span className="text-sm font-mono text-cyan-400">{value.toLocaleString()} / {max.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-4 border border-gray-600 overflow-hidden">
        <div
          className={`${colorClass} h-4 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
