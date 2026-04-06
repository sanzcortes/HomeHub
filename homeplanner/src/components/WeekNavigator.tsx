import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Button } from './Button';

interface WeekNavigatorProps {
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onGoToCurrent: () => void;
  weekRange: string;
}

export function WeekNavigator({
  currentDate,
  onPrevWeek,
  onNextWeek,
  onGoToCurrent,
  weekRange,
}: WeekNavigatorProps) {
  const isCurrentWeek = isThisWeek(currentDate);

  return (
    <nav 
      className="flex items-center gap-2"
      aria-label="Navegación de semanas"
    >
      <Button
        variant="secondary"
        size="sm"
        onClick={onGoToCurrent}
        disabled={isCurrentWeek}
        aria-label={isCurrentWeek ? 'Semana actual' : 'Ir a semana actual'}
      >
        <CalendarDays size={18} />
        <span className="hidden sm:inline">Hoy</span>
      </Button>

      <div className="flex items-center gap-1" role="group" aria-label="Cambiar semana">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevWeek}
          aria-label="Semana anterior"
          className="!p-2"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </Button>
        
        <span 
          className="px-3 py-2 text-sm font-medium text-text-primary min-w-[140px] text-center"
          aria-current="date"
        >
          {weekRange}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNextWeek}
          aria-label="Semana siguiente"
          className="!p-2"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}

function isThisWeek(date: Date): boolean {
  const now = new Date();
  const weekStart = getWeekStart(now);
  const inputWeekStart = getWeekStart(date);
  
  return weekStart.getTime() === inputWeekStart.getTime();
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}