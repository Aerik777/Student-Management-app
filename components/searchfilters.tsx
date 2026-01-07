"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Debounce prevents the database from being hit on every single keystroke
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set("query", term);
    else params.delete("query");
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleFilter = (dept: string) => {
    const params = new URLSearchParams(searchParams);
    if (dept) params.set("dept", dept);
    else params.delete("dept");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <input
        className="flex-1 border p-2 rounded-lg"
        placeholder="Search by name or roll number..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
      />
      
      <select 
        onChange={(e) => handleFilter(e.target.value)}
        className="border p-2 rounded-lg bg-white"
        defaultValue={searchParams.get("dept")?.toString() || "All"}
      >
        <option value="All">All Departments</option>
        <option value="CS">Computer Science</option>
        <option value="EE">Electrical</option>
        <option value="ME">Mechanical</option>
      </select>
    </div>
  );
}