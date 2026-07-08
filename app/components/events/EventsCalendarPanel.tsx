"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Event } from "../../../lib/contentful-event";
import EventCards from "./EventCards";

type Props = {
  events: Event[];
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function monthStart(year: number, month: number) {
  return new Date(Date.UTC(year, month, 1));
}

function getDaysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function padDate(value: number) {
  return String(value).padStart(2, "0");
}

function toIsoDateString(date: Date) {
  return `${date.getUTCFullYear()}-${padDate(date.getUTCMonth() + 1)}-${padDate(date.getUTCDate())}`;
}

function parseIsoDate(date: string) {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export default function EventsCalendarPanel({ events }: Props) {
  const todayIso = toIsoDateString(new Date());

  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return monthStart(now.getUTCFullYear(), now.getUTCMonth());
  });

  const [selectedDate, setSelectedDate] = useState<string | null>(() => {
    return events.some((event) => event.date.startsWith(todayIso))
      ? todayIso
      : null;
  });

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>();
    events.forEach((event) => {
      const iso = event.date.split("T")[0];
      if (!map.has(iso)) map.set(iso, []);
      map.get(iso)?.push(event);
    });
    return map;
  }, [events]);

  const monthName = viewDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const firstWeekday = viewDate.getUTCDay();
  const totalDays = getDaysInMonth(
    viewDate.getUTCFullYear(),
    viewDate.getUTCMonth(),
  );
  const cells = Array.from({ length: firstWeekday + totalDays }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day > 0 ? day : null;
  });

  const displayedEvents = selectedDate
    ? (eventsByDate.get(selectedDate) ?? [])
    : [];

  const selectedTitle = selectedDate
    ? `Events on ${new Date(selectedDate).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
      })}`
    : "Select a date to view events";

  const changeMonth = (delta: number) => {
    const year = viewDate.getUTCFullYear();
    const month = viewDate.getUTCMonth() + delta;
    setViewDate(monthStart(year, month));
    setSelectedDate(null);
  };

  return (
    <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-20 sm:px-8 md:grid-cols-3 lg:px-16">
      <div className="border border-(--line) bg-(--soft) p-6 md:col-span-2">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-3xl font-semibold">
              Event Calendar
            </h2>
            <p className="mt-2 text-sm text-(--muted)">
              Event for the Academic Year 2026/2027.{" "}
            </p>
            <p className=" text-sm text-(--muted)">
              Explore the calendar to discover upcoming events at FUTO.
            </p>
          </div>
          <div className="flex items-center gap-3 text-(--muted)">
            <button
              type="button"
              className="rounded border border-(--line) px-3 py-2 text-sm cursor-pointer hover:bg-white"
              onClick={() => changeMonth(-1)}
            >
              <ChevronLeft />
            </button>
            <div className="font-semibold">{monthName}</div>
            <button
              type="button"
              className="rounded border border-(--line) px-3 py-2 text-sm cursor-pointer hover:bg-white"
              onClick={() => changeMonth(1)}
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase tracking-[0.08em] text-(--muted)">
          {dayNames.map((day) => (
            <div className="py-2" key={day}>
              {day}
            </div>
          ))}
          {cells.map((day, index) => {
            if (day === null) {
              return (
                <div
                  key={index}
                  className="h-16 border border-(--line) bg-white"
                />
              );
            }

            const date = new Date(
              Date.UTC(viewDate.getUTCFullYear(), viewDate.getUTCMonth(), day),
            );
            const isoDate = toIsoDateString(date);
            const hasEvent = eventsByDate.has(isoDate);
            const selected = isoDate === selectedDate;

            return (
              <button
                key={isoDate}
                type="button"
                className={`flex h-16 w-full items-start justify-start border p-2 text-left text-sm font-semibold transition ${
                  selected
                    ? "border-(--green)] bg-(--green)/15 text-(--green)"
                    : hasEvent
                      ? "border-(--green) bg-[#b2f1bf]/35"
                      : "border-(--line) bg-white"
                } cursor-pointer hover:bg-(--soft)`}
                onClick={() => setSelectedDate(selected ? null : isoDate)}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-(--ink)">
            {selectedTitle}
            {selectedDate
              ? ` · ${displayedEvents.length} event${displayedEvents.length === 1 ? "" : "s"}`
              : ""}
          </p>
          {selectedDate ? (
            <button
              type="button"
              className="text-sm font-semibold text-(--green) cursor-pointer"
              onClick={() => setSelectedDate(null)}
            >
              Clear date
            </button>
          ) : null}
        </div>

        {selectedDate && displayedEvents.length > 0 && (
          <div className="mt-6 grid gap-5">
            <EventCards
              events={displayedEvents}
              onSelectEvent={(event) => {
                const eventDate = parseIsoDate(event.date);
                if (eventDate) {
                  setViewDate(
                    monthStart(
                      eventDate.getUTCFullYear(),
                      eventDate.getUTCMonth(),
                    ),
                  );
                  setSelectedDate(toIsoDateString(eventDate));
                }
              }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center bg-(--footer) p-8">
        <h2 className="font-serif text-3xl font-semibold text-(--green)">
          Newsletter
        </h2>
        <p className="mt-4 leading-7 text-(--muted)">
          Stay informed about academic deadlines and university symposiums
          delivered to your inbox.
        </p>
        <form className="mt-8 grid gap-4">
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em]">
            Institutional email
            <input
              className="border border-(--outline) bg-white p-3 text-base font-normal normal-case tracking-normal outline-none focus:border-(--green)"
              placeholder="student.name@futo.edu.ng"
              type="email"
            />
          </label>
          <button
            className="btn-primary rounded-none uppercase cursor-pointer"
            type="submit"
          >
            Subscribe now
          </button>
        </form>
      </div>
    </section>
  );
}
