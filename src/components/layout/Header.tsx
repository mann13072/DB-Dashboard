import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { useEffect, useState } from 'react';
import { Clock, ShieldCheck, Menu } from 'lucide-react';

const TARGET_DATE = new Date('2027-06-01T00:00:00');

interface MilestoneHeaderProps {
  onMenuClick: () => void;
}

export function MilestoneHeader({ onMenuClick }: MilestoneHeaderProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeLeft({
        days: differenceInDays(TARGET_DATE, now),
        hours: differenceInHours(TARGET_DATE, now) % 24,
        minutes: differenceInMinutes(TARGET_DATE, now) % 60,
        seconds: differenceInSeconds(TARGET_DATE, now) % 60,
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-2 text-[#f01414]">
          <span className="font-black text-xl md:text-2xl tracking-tighter">DB</span>
          <span className="font-semibold text-slate-900 hidden sm:inline">FZI Cottbus MDA</span>
        </div>
        
        <div className="hidden md:block h-6 w-px bg-slate-200 mx-2" />
        
        <div className="hidden lg:flex items-center gap-2 text-slate-500 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          <span className="bg-teal-50 text-teal-600 px-2 py-0.5 rounded text-xs font-mono border border-teal-200 font-bold">LIVE</span>
          <span className="font-medium">Digital Twin Stream</span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-2 md:gap-3 bg-slate-50 px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-slate-200">
          <Clock className="w-3.5 h-3.5 md:w-4 h-4 text-[#f01414]" />
          <div className="flex items-baseline gap-1.5 md:gap-2 font-mono">
            <span className="text-slate-500 text-[10px] md:text-xs uppercase font-bold hidden xs:inline">SoP</span>
            <span className="text-slate-900 text-xs md:text-sm font-bold whitespace-nowrap">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span className="font-mono font-medium">WORM: SHA-256</span>
        </div>
      </div>
    </div>
  );
}
