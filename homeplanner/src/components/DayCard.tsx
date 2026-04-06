import { type ReactNode } from 'react';

interface DayCardProps {
  dayName: string;
  dayIndex: number;
  children: ReactNode;
  isToday?: boolean;
}

export function DayCard({ dayName, dayIndex, children, isToday = false }: DayCardProps) {
  return (
    <article 
      className={`
        bg-surface rounded-xl border transition-all duration-200
        ${isToday 
          ? 'border-primary shadow-md ring-1 ring-primary/20' 
          : 'border-border hover:border-slate-300'
        }
      `}
      aria-labelledby={`day-label-${dayIndex}`}
    >
      <header className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span 
            id={`day-label-${dayIndex}`}
            className={`
              text-sm font-semibold
              ${isToday ? 'text-primary' : 'text-text-primary'}
            `}
          >
            {dayName}
          </span>
          {isToday && (
            <span className="text-xs bg-primary text-white px-1.5 py-0.5 rounded">
              Hoy
            </span>
          )}
        </div>
      </header>
      
      <div className="p-3 space-y-2" role="list" aria-label={`Planes de ${dayName}`}>
        {children}
      </div>
    </article>
  );
}