import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function Card({ title, children, className, action }: CardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-white border border-slate-200 rounded-xl p-6 shadow-sm", className)}
    >
      {(title || action) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h3 className="text-slate-600 text-sm font-bold uppercase tracking-wider">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );
}
