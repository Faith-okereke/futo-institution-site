"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import type { Event } from "../../../lib/contentful-event";

type Props = {
  events: Event[];
  setFilterType: (type: string) => void;
  filterType: string;
};

export function FilterByType({ events, setFilterType, filterType }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const types = useMemo(() => {
    const uniqueTypes = Array.from(new Set(events.map((event) => event.type)));
    return ["all", ...uniqueTypes];
  }, [events]);

  const handleTypeChange = (type: string) => {
    setFilterType(type);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <button
          type="button"
          className="inline-flex items-center gap-2 border border-(--line) bg-(--soft) px-5 py-3 text-sm font-bold cursor-pointer"
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <Filter size={17} />
          <span>Filter by type</span>
          <ChevronDown size={17} className={isOpen ? "rotate-180" : ""} />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-lg border border-(--line) bg-(--soft) py-2 shadow-lg animate-in fade-in-0 zoom-in-95">
              {types.map((type) => (
                <button
                  key={type}
                  type="button"
                  role="option"
                  aria-selected={filterType === type}
                  onClick={() => handleTypeChange(type)}
                  className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                    filterType === type
                      ? "bg-(--green) text-white"
                      : "text-(--ink) hover:bg-(--line)"
                  }`}
                >
                  {type === "all" ? "All types" : type}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
