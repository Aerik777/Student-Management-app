'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClassMultiSelectProps {
  classes: { _id: string; grade: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function ClassMultiSelect({
  classes,
  selected,
  onChange,
}: ClassMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((item) => item !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const selectedClasses = classes.filter((c) => selected.includes(c._id));

  return (
    <div className='relative' ref={containerRef}>
      <div
        className='border border-slate-300 rounded-lg p-2 min-h-[42px] flex flex-wrap gap-1 cursor-pointer bg-white hover:border-slate-400 transition-colors'
        onClick={() => setOpen(!open)}
      >
        {selectedClasses.length === 0 && (
          <span className='text-slate-500 text-sm py-1 px-1'>
            Select classes...
          </span>
        )}
        {selectedClasses.map((c) => (
          <div
            key={c._id}
            className='bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1'
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(c._id);
            }}
          >
            {c.grade}
            <X className='h-3 w-3 hover:text-indigo-950 cursor-pointer' />
          </div>
        ))}
        <div className='ml-auto self-center'>
          <ChevronsUpDown className='h-4 w-4 text-slate-400 shrink-0 opacity-50' />
        </div>
      </div>

      {open && (
        <div className='absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto'>
          {classes.length === 0 ? (
            <div className='p-2 text-sm text-slate-500'>No classes found.</div>
          ) : (
            classes.map((c) => (
              <div
                key={c._id}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 text-slate-900',
                  selected.includes(c._id) && 'bg-indigo-50 font-medium'
                )}
                onClick={() => handleSelect(c._id)}
              >
                <div
                  className={cn(
                    'h-4 w-4 border rounded flex items-center justify-center',
                    selected.includes(c._id)
                      ? 'bg-indigo-600 border-indigo-600'
                      : 'border-slate-300'
                  )}
                >
                  {selected.includes(c._id) && (
                    <Check className='h-3 w-3 text-white' />
                  )}
                </div>
                {c.grade}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
