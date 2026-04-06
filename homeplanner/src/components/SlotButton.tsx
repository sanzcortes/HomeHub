import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { X } from 'lucide-react';

interface SlotButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  slotType: 'Comida' | 'Cena';
  dishName?: string;
  dishCount?: number;
  onRemove?: () => void;
}

export const SlotButton = forwardRef<HTMLButtonElement, SlotButtonProps>(
  ({ slotType, dishName, dishCount = 0, onRemove, disabled, className = '', ...props }, ref) => {
    const isEmpty = dishCount === 0;
    const slotIcon = slotType === 'Comida' ? '🌅' : '🌙';
    const slotColor = slotType === 'Comida' ? 'text-amber-600' : 'text-indigo-600';

    return (
      <div className="flex items-center gap-2">
        <button
          ref={ref}
          disabled={disabled}
          className={`
            flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg text-left
            transition-all duration-150 min-h-[44px]
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            ${isEmpty 
              ? 'border-2 border-dashed border-slate-200 hover:border-primary bg-transparent hover:bg-slate-50' 
              : 'bg-primary/5 border-2 border-transparent hover:bg-primary/10'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${className}
          `}
          aria-label={isEmpty ? `Añadir ${slotType}` : `${slotType}: ${dishName}`}
          {...props}
        >
          <span className="text-base" aria-hidden="true">{slotIcon}</span>
          
          {isEmpty ? (
            <span className="text-sm text-slate-400">+ Añadir {slotType}</span>
          ) : (
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <span className={`text-xs font-medium ${slotColor}`} aria-hidden="true">
                {slotType}
              </span>
              <span className="text-sm text-text-primary font-medium truncate flex-1">
                {dishName}
              </span>
              {dishCount > 1 && (
                <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  +{dishCount - 1}
                </span>
              )}
            </div>
          )}
        </button>

        {!isEmpty && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-danger hover:bg-danger/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={`Eliminar ${dishName} de ${slotType}`}
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  }
);

SlotButton.displayName = 'SlotButton';