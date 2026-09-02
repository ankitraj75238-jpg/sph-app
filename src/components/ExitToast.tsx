import React from 'react';
import { motion } from 'motion/react';
import { LogOut } from 'lucide-react';

interface ExitToastProps {
  message?: string;
}

export const ExitToast: React.FC<ExitToastProps> = ({
  message = 'ऐप से बाहर निकलने के लिए दोबारा बैक दबाएं',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9990] max-w-[90vw] pointer-events-none"
    >
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 border border-slate-700/80 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-md text-white">
        <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
          <LogOut className="w-3 h-3 text-amber-400" />
        </div>
        <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-100 whitespace-nowrap">
          {message}
        </span>
      </div>
    </motion.div>
  );
};
