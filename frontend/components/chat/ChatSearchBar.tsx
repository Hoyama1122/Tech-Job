'use client';

import { useState, useEffect } from 'react';

interface ChatSearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  delay?: number;
}

export default function ChatSearchBar({
  placeholder = "ค้นหา...",
  onSearch,
  className = "",
  delay = 300
}: ChatSearchBarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, delay);

    return () => clearTimeout(handler);
  }, [query, onSearch, delay]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#4a4a4a]/40">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-[#29335c]/10 rounded-full pl-10 pr-10 py-2.5 text-sm outline-none focus:border-[#e99f0c]/40 transition-all shadow-sm"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute inset-y-0 right-4 flex items-center text-[#4a4a4a]/30 hover:text-[#4a4a4a]/60"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
