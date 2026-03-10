import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const THEME = {
  colors: {
    dbRed: '#f01414',
    slate950: '#020617', // tailwind slate-950
    teal: '#2dd4bf', // tailwind teal-400
    amber: '#fbbf24', // tailwind amber-400
  }
};
