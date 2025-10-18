import React, { useState, useEffect } from 'react';

interface RadialGaugeProps {
  progress: number; // 0 to 100+
  label: string;
  colorClass?: string;
  value: string | number;
}

const RadialGauge: React.FC<RadialGaugeProps> = ({ progress, label, colorClass = 'text-cyan-500', value }) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  
  useEffect(() => {
    // Animate the gauge on mount
    const timer = setTimeout(() => setDisplayProgress(progress), 100);
    return () => clearTimeout(timer);
  }, [progress]);

  // Cap progress at 100 for visual representation of the stroke offset
  const cappedProgress = Math.min(displayProgress, 100);
  const offset = circumference - (cappedProgress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
        <circle
          className="text-gray-700/50"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="64"
          cy="64"
        />
        <circle
          className={`${colorClass} transition-all duration-700 ease-out`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="64"
          cy="64"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-orbitron font-bold text-white">{value}</span>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
    </div>
  );
};

export default RadialGauge;