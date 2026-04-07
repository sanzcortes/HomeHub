import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X } from 'lucide-react';

export interface ComboBoxOption {
  value: string;
  label: string;
  description?: string;
}

interface ComboBoxProps {
  label?: string;
  options: ComboBoxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  searchable?: boolean;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}

export function ComboBox({
  label,
  options,
  value,
  onChange,
  placeholder = 'Selecciona una opción',
  error,
  searchable = true,
  emptyMessage = 'No hay opciones disponibles',
  disabled = false,
  className = '',
}: ComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, openUpward: false });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.value === value) || null;

  const calculatePosition = useCallback(() => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const dropdownHeight = 280; // Altura aproximada del dropdown
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
    
    setDropdownPosition({
      top: openUpward ? rect.top : rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      openUpward,
    });
  }, []);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      calculatePosition();
      
      const handleScroll = () => calculatePosition();
      const handleResize = () => calculatePosition();
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      highlightedElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = useCallback((option: ComboBoxOption) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }, [onChange]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setSearchQuery('');
      setHighlightedIndex(-1);
    }
  }, [disabled, isOpen]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    inputRef.current?.focus();
  }, [onChange]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          handleSelect(filteredOptions[highlightedIndex]);
        } else {
          setIsOpen(true);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery('');
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchQuery('');
        break;
    }
  }, [disabled, isOpen, highlightedIndex, filteredOptions, handleSelect]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setHighlightedIndex(-1);
  };

  const dropdownContent = isOpen && (
    <div
      className="fixed z-[100] bg-surface rounded-xl border border-border shadow-2xl overflow-hidden animate-fade-in"
      style={{
        top: dropdownPosition.openUpward ? undefined : dropdownPosition.top,
        bottom: dropdownPosition.openUpward ? window.innerHeight - dropdownPosition.top : undefined,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        maxHeight: 'min(320px, calc(100vh - 32px))',
      }}
      role="listbox"
    >
      {searchable && (
        <div className="sticky top-0 z-10 p-2 bg-surface border-b border-border">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="Buscar..."
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-slate-50 focus:outline-none focus:border-primary focus:bg-surface"
              autoFocus
            />
          </div>
        </div>
      )}

      <ul
        ref={listRef}
        className="max-h-[240px] overflow-y-auto overscroll-contain"
      >
        {filteredOptions.length === 0 ? (
          <li className="px-4 py-6 text-sm text-text-secondary text-center">
            {emptyMessage}
          </li>
        ) : (
          filteredOptions.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => handleSelect(option)}
              className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between gap-2 ${
                option.value === value
                  ? 'bg-primary/10 text-primary font-medium'
                  : index === highlightedIndex
                  ? 'bg-slate-100'
                  : 'hover:bg-slate-50'
              }`}
            >
              <span className="flex-1">
                <span>{option.label}</span>
                {option.description && (
                  <span className="ml-2 text-xs text-text-secondary">
                    ({option.description})
                  </span>
                )}
              </span>
              {option.value === value && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="shrink-0">
                  <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                </svg>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
        </label>
      )}

      <div
        className={`relative rounded-lg border transition-all duration-150 ${
          error
            ? 'border-danger focus-within:ring-2 focus-within:ring-danger/20'
            : isOpen
            ? 'border-primary ring-2 ring-primary/20'
            : 'border-border hover:border-primary/50'
        } ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-60' : 'bg-surface'}`}
      >
        <button
          type="button"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 cursor-pointer disabled:cursor-not-allowed touch-manipulation"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={`flex-1 truncate ${selectedOption ? 'text-text-primary' : 'text-text-secondary'}`}>
            {selectedOption ? (
              <span className="flex items-center gap-2">
                <span>{selectedOption.label}</span>
                {selectedOption.description && (
                  <span className="text-xs text-text-secondary bg-slate-100 px-2 py-0.5 rounded font-medium">
                    {selectedOption.description}
                  </span>
                )}
              </span>
            ) : (
              <span>{placeholder}</span>
            )}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {selectedOption && !disabled && (
              <span
                onClick={handleClear}
                className="p-1 -ml-1 hover:bg-slate-100 rounded-full transition-colors active:bg-slate-200"
                role="button"
                aria-label="Limpiar selección"
              >
                <X size={16} className="text-text-secondary" />
              </span>
            )}
            <ChevronDown
              size={18}
              className={`text-text-secondary transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}

      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
}
