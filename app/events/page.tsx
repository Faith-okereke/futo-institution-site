import Image from "next/image";
import {
  CalendarDays,
  Clock3,
  Filter,
  MapPin,
} from "lucide-react";
import { getEvents } from "../lib/contentful-event";
import EventCards from "../components/events/EventCards";
import EventsCalendarPanel from "../components/events/EventsCalendarPanel";


export const revalidate = 60
export default async function EventsPage() {
  const events = await getEvents();
  const [featured, ...otherEvents] = events;

  return (
    <div className="bg-[var(--surface)] text-[var(--ink)]">
      <section className="px-4 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow text-[var(--green)]">Academic Calendar</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold leading-tight">
              University Events
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              A comprehensive dashboard for symposiums, research conferences,
              student gatherings, and institutional excellence events at FUTO.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 border border-[var(--line)] bg-[var(--soft)] px-5 py-3 text-sm font-bold cursor-pointer">
              <Filter size={17} /> Filter by type
            </button>
            <button className="inline-flex items-center gap-2 border border-[var(--line)] bg-[var(--soft)] px-5 py-3 text-sm font-bold cursor-pointer">
              <CalendarDays size={17} /> July 2026
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-20 sm:px-8 md:grid-cols-12 lg:px-16">
        <article className="group overflow-hidden border border-[var(--line)] bg-[var(--soft)] transition hover:-translate-y-1 hover:border-[var(--green)] hover:shadow-[0_16px_40px_rgba(28,27,27,0.08)] md:col-span-8 md:grid md:grid-cols-2">
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
              <div className="border border-[var(--line)] bg-white p-3 text-center">
                <p className="font-serif text-2xl font-semibold leading-none text-[var(--green)]">
                  {featured.day}
                </p>
                <p className="mt-1 text-xs font-bold uppercase text-[var(--muted)]">
                  {featured.month}
                </p>
              </div>
            </div>
            <h2 className="font-serif text-3xl font-semibold leading-tight">
              {featured.title}
            </h2>
            <p className="mt-5 flex-1 leading-7 text-[var(--muted)]">
              Join global leaders and research pioneers as they explore applied
              systems, automation, and practical technology for national
              development.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-[var(--muted)]">
              <span className="inline-flex items-center gap-2">
                <Clock3 size={16} className="text-[var(--green)]" />
                {featured.time
                  ? new Date(featured.time).toLocaleDateString()
                  : "Time not specified"}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} className="text-[var(--green)]" />
                {featured.location}
              </span>
            </div>
          </div>
        </article>

        <aside className="flex flex-col justify-between bg-[#5d5f5f] p-8 text-white md:col-span-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold">
              Upcoming Highlights
            </h2>
            <div className="mt-8 grid gap-5">
              {otherEvents.slice(0, 3).map((event, index) => (
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
              {events.length}
            </p>
          </div>
        </aside>

        <EventCards events={otherEvents} />
      </section>

      <EventsCalendarPanel events={otherEvents} />
    </div>
  );
}
