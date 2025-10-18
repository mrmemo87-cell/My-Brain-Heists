
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="glassmorphism rounded-lg border border-cyan-500/50 shadow-lg shadow-cyan-500/20 w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-gray-900/50 border-b border-cyan-500/30">
          <h2 className="text-xl font-orbitron text-cyan-400">{title}</h2>
        </div>
        <div className="p-6 text-gray-300">
          {children}
        </div>
        <div className="p-4 bg-gray-900/50 border-t border-cyan-500/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition-colors font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
