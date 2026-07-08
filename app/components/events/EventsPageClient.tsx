"use client";

import Image from "next/image";
import { CalendarDays, Clock3, MapPin, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Event } from "../../../lib/contentful-event";
import EventCards from "./EventCards";
import EventsCalendarPanel from "./EventsCalendarPanel";
import { FilterByType } from "./FilterByType";

type Props = {
  events: Event[];
};

export default function EventsPageClient({ events }: Props) {
  const [filterType, setFilterType] = useState("all");
  const [featured, ...otherEvents] = events;

  const filteredEvents = useMemo(() => {
    if (filterType === "all") return otherEvents;
    return otherEvents.filter((event) => event.type === filterType);
  }, [filterType, otherEvents]);

  const featuredVisible = filterType === "all" || featured?.type === filterType;
  const clearFilter = () => setFilterType("all");

  return (
    <div className="bg-(--surface) text-(--ink)">
      <section className="px-4 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <p className="eyebrow text-(--green)">Academic Calendar</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold leading-tight">
              University Events
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-(--muted)]">
              A comprehensive dashboard for symposiums, research conferences,
              student gatherings, and institutional excellence events at FUTO.
            </p>
          </div>

          <div className="flex w-full flex-col items-end gap-3 lg:w-auto">
            <div className="flex flex-wrap items-center justify-end gap-3">
              <FilterByType
                events={events}
                setFilterType={setFilterType}
                filterType={filterType}
              />
              <button className="inline-flex items-center gap-2 border border-(--line) bg-(--soft) px-5 py-3 text-sm font-bold cursor-pointer">
                <CalendarDays size={17} /> July 2026
              </button>
            </div>
            {filterType !== "all" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-(--green) px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-white">
                <span>Filter: {filterType}</span>
                <button
                  type="button"
                  onClick={clearFilter}
                  className="rounded-full p-0.5 hover:bg-white/30 cursor-pointer"
                  aria-label="Clear filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-20 sm:px-8 md:grid-cols-12 lg:px-16">
        {featuredVisible && featured ? (
          <article className="group overflow-hidden border border-(--line) bg-(--soft) transition hover:-translate-y-1 hover:border-(--green) hover:shadow-[0_16px_40px_rgba(28,27,27,0.08)] md:col-span-8 md:grid md:grid-cols-2">
            <div className="relative min-h-72 overflow-hidden">
              <Image
                src={featured.image}
                alt=""
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </div>
            <div className="flex flex-col p-8">
              <div className="mb-5 flex items-start justify-between gap-5">
                <span className="rounded-full bg-[#b2f1bf] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#14512d]">
                  {featured.type} - {featured.status}
                </span>
                <div className="border border-(--line) bg-white p-3 text-center">
                  <p className="font-serif text-2xl font-semibold leading-none text-(--green)">
                    {featured.day}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase text-(--muted)">
                    {featured.month}
                  </p>
                </div>
              </div>
              <h2 className="font-serif text-3xl font-semibold leading-tight">
                {featured.title}
              </h2>
              <p className="mt-5 flex-1 leading-7 text-(--muted)">
                Join global leaders and research pioneers as they explore
                applied systems, automation, and practical technology for
                national development.
              </p>
              <div className="mt-8 grid gap-3 text-sm text-(--muted)">
                <span className="inline-flex items-center gap-2">
                  <Clock3 size={16} className="text-(--green)" />
                  {featured.time
                    ? new Date(featured.time).toLocaleDateString()
                    : "Time not specified"}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} className="text-(--green)" />
                  {featured.location}
                </span>
              </div>
            </div>
          </article>
        ) : null}

        <aside className="flex flex-col justify-between bg-[#5d5f5f] p-8 text-white md:col-span-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold">
              Upcoming Highlights
            </h2>
            <div className="mt-8 grid gap-5">
              {filteredEvents.slice(0, 3).map((event, index) => (
                <div
                  className="flex gap-4 border-t border-white/12 pt-5 first:border-t-0 first:pt-0"
                  key={event.title}
                >
                  <span className="font-serif text-2xl text-[#b2f1bf]/75">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="leading-6 text-white/84">{event.title}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 border-t border-white/16 pt-8">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/64">
              Total scheduled events
            </p>
            <p className="mt-2 font-serif text-6xl font-semibold text-[#b2f1bf]">
              {filteredEvents.length}
            </p>
          </div>
        </aside>

        {filteredEvents.length > 0 ? (
          <EventCards events={filteredEvents} />
        ) : (
          <div className="md:col-span-12 rounded border border-dashed border-(--line) bg-white p-8 text-center text-(--muted)">
            No events match this filter yet.
          </div>
        )}
      </section>

      <EventsCalendarPanel events={filteredEvents} />
    </div>
  );
}
