"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Clock3, MapPin, X, CalendarPlus } from "lucide-react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Event } from "../../../lib/contentful-event";

type Props = {
  events: Event[];
  onSelectEvent?: (event: Event) => void;
};

export default function EventCards({ events, onSelectEvent }: Props) {
  const [selected, setSelected] = useState<Event | null>(null);

  return (
    <>
      {events.map((event) => (
        <article
          className="group flex flex-col border border-[var(--line)] bg-white transition hover:-translate-y-1 hover:border-[var(--green)] hover:shadow-[0_16px_40px_rgba(28,27,27,0.08)] md:col-span-4"
          key={event.slug}
        >
          <div className="relative h-52 overflow-hidden">
            <Image
              src={event.image || "/design/lecture-hall.png"}
              alt={event.title}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(min-width: 768px) 33vw, 100vw"
            />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="rounded-full bg-[var(--soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
                {event.type}
              </span>
              <span className="text-sm font-bold uppercase text-[var(--green)]">
                {event.month} {event.day}
              </span>
            </div>
            <h3 className="font-serif text-2xl font-semibold leading-tight">
              {event.title}
            </h3>
            <p className="mt-4 flex-1 leading-7 text-[var(--muted)]">
              {event.location || "Not specified"} at {event.time ? new Date(event.time).toLocaleTimeString() : ""}.
            </p>
            <button
              className="mt-8 border border-[var(--green)] px-5 py-3 text-sm font-bold uppercase text-[var(--green)] transition hover:bg-[#b2f1bf] cursor-pointer"
              onClick={() => {
                setSelected(event);
                onSelectEvent?.(event);
              }}
            >
              View details
            </button>
          </div>
        </article>
      ))}

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative z-10 w-full max-w-5xl mx-auto rounded-lg bg-white p-6 shadow-lg">
            <div className="md:flex md:gap-6">
              <div className="md:w-1/2">
                <div className="relative h-64 md:h-full w-full rounded overflow-hidden">
                  <Image
                    src={selected.image || "/design/lecture-hall.png"}
                    alt={selected.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
              </div>

              <div className="md:w-1/2 flex flex-col">
                <div className="flex items-start justify-between">
                  <h2 className="font-serif text-2xl font-bold">{selected.title}</h2>
                  <button
                    aria-label="Close"
                    className="-mr-2 rounded p-1 text-[var(--muted)] hover:bg-gray-100 cursor-pointer"
                    onClick={() => setSelected(null)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-3 text-sm text-[var(--muted)]">
                  <span className="rounded-full bg-[var(--soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
                    {selected.type}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock3 size={16} className="text-[var(--green)]" />
                    {selected.time ? new Date(selected.time).toLocaleString() : "Time not specified"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={16} className="text-[var(--green)]" />
                    {selected.location || "Not specified"}
                  </span>
                  {selected.featured ? (
                    <span className="ml-auto rounded bg-[var(--green)] px-3 py-1 text-xs font-bold uppercase text-white">Featured</span>
                  ) : null}
                </div>

                <div className="mt-4 overflow-y-auto max-h-[60vh] prose max-w-none">
                  {typeof selected.description === "string"
                    ? <p>{selected.description}</p>
                    : selected.description
                    ? documentToReactComponents(selected.description)
                    : <p>No description provided.</p>}
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    className="inline-flex items-center gap-2 rounded border border-[var(--green)] bg-white px-4 py-2 text-sm font-bold text-[var(--green)] hover:bg-[#b2f1bf] cursor-pointer"
                    onClick={() => {
                      const details = `${selected.title} - ${selected.time ? new Date(selected.time).toLocaleString() : "Time not specified"} - ${selected.location || "Not specified"}`;
                      if (navigator?.clipboard) {
                        navigator.clipboard.writeText(details);
                      }
                    }}
                  >
                    <CalendarPlus size={16} />
                    Copy details
                  </button>

                  <button
                    className="ml-2 rounded bg-[var(--green)] px-4 py-2 text-sm font-bold text-white cursor-pointer"
                    onClick={() => setSelected(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
