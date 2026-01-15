'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

interface Class {
  _id: string;
  grade: string;
}

export default function SearchFilters({ classes }: { classes?: Class[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Debounce prevents the database from being hit on every single keystroke
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set('query', term);
    else params.delete('query');
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleFilter = (classId: string) => {
    const params = new URLSearchParams(searchParams);
    if (classId) params.set('classId', classId);
    else params.delete('classId');
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className='flex flex-col md:flex-row gap-4 mb-6'>
      <input
        className='flex-1 border border-slate-400 p-2 rounded-lg text-slate-900 font-medium outline-none focus:border-indigo-600'
        placeholder='Search by name or roll number...'
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />

      <select
        onChange={(e) => handleFilter(e.target.value)}
        className='border border-slate-400 p-2 rounded-lg bg-white text-slate-900 font-medium'
        defaultValue={searchParams.get('classId')?.toString() || ''}
      >
        <option value=''>All Classes</option>
        {classes?.map((cls) => (
          <option key={cls._id} value={cls._id}>
            {cls.grade}
          </option>
        ))}
      </select>
    </div>
  );
}
