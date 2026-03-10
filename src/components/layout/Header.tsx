import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { useEffect, useState } from 'react';
import { Clock, ShieldCheck } from 'lucide-react';

const TARGET_DATE = new Date('2027-06-01T00:00:00');

export function MilestoneHeader() {
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
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[#f01414]">
          <span className="font-black text-2xl tracking-tighter">DB</span>
          <span className="font-semibold text-slate-900">FZI Cottbus MDA</span>
        </div>
        <div className="h-6 w-px bg-slate-200 mx-2" />
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          <span className="bg-teal-50 text-teal-600 px-2 py-0.5 rounded text-xs font-mono border border-teal-200 font-bold">LIVE</span>
          <span className="font-medium">Digital Twin Stream</span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
          <Clock className="w-4 h-4 text-[#f01414]" />
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-slate-500 text-xs uppercase font-bold">SoP Countdown</span>
            <span className="text-slate-900 font-bold">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span className="font-mono font-medium">WORM: SHA-256 LOCKED</span>
        </div>
      </div>
    </div>
  );
}
