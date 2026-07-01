import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  MapPin,
} from "lucide-react";
import { events, schools, stats } from "./data/site";
import LatestNews from "./components/home/latest-news";

export default function Home() {
  const spotlight = schools[3];

  return (
    <div className="bg-[var(--surface)] text-[var(--ink)]">
      <section className="relative min-h-[820px] overflow-hidden">
        <Image
          src="/design/campus-courtyard.png"
          alt="FUTO innovation courtyard"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/44 to-black/10" />
        <div className="relative mx-auto flex min-h-[740px] max-w-7xl flex-col justify-center px-4 pb-16 pt-28 sm:px-8 lg:px-16">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-white/82">
            Technology for Service
          </p>
          <h1 className="max-w-3xl font-serif text-5xl font-bold leading-[1.04] text-white sm:text-6xl">
            Empowering Innovation Through Excellence
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/88">
            Experience a world-class technological education at the heart of
            West Africa, built around practical research, industry partnership,
            and sustainable development.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link className="btn-primary rounded-none uppercase" href="/schools">
              Explore programs <ArrowRight size={18} />
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center border border-white px-6 text-sm font-bold uppercase tracking-[0.06em] text-white transition hover:bg-white hover:text-[var(--green)]"
              href="/research"
            >
              Research impact
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[var(--footer)] px-4 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.value}>
              <p className="font-serif text-3xl font-semibold text-[var(--green)]">
                {item.value}
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <LatestNews />

      <section className="bg-[var(--ink)] px-4 py-20 text-white sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b2f1bf]">
              Faculty Spotlight
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              {spotlight.name.replace("School of ", "")}
            </h2>
            <p className="mt-6 max-w-xl leading-8 text-white/76">
              {spotlight.summary} The school combines theoretical depth with
              hands-on experimentation across laboratories, field practice, and
              collaborative research studios.
            </p>
            <div className="mt-10 grid max-w-md grid-cols-2 gap-6">
              <div className="border-l-2 border-[#97d5a5] pl-4">
                <p className="font-serif text-2xl font-semibold">8+</p>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/56">
                  Departments
                </p>
              </div>
              <div className="border-l-2 border-[#97d5a5] pl-4">
                <p className="font-serif text-2xl font-semibold">150+</p>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/56">
                  Faculty members
                </p>
              </div>
            </div>
            <Link className="btn-primary mt-10 rounded-none uppercase" href="/schools">
              Learn more
            </Link>
          </div>
          <div className="relative min-h-[420px]">
            <div className="absolute inset-0 translate-x-4 translate-y-4 border-2 border-[var(--green)]/45" />
            <Image
              src="/design/professor-office.png"
              alt="FUTO faculty member in office"
              fill
              className="relative object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-[var(--soft)] px-4 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="font-serif text-3xl font-semibold">
              Upcoming Events
            </h2>
            <p className="mt-5 leading-7 text-[var(--muted)]">
              Stay connected with lectures, research forums, orientations, and
              major academic gatherings across the FUTO community.
            </p>
            <Link
              className="mt-10 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[var(--green)]"
              href="/events"
            >
              Full academic calendar <CalendarDays size={18} />
            </Link>
          </div>

          <div className="grid gap-5 lg:col-span-8">
            {events.slice(0, 3).map((event, index) => (
              <article
                className="group flex gap-5 border border-[var(--line)] bg-white p-5 transition hover:border-[var(--green)]"
                key={event.title}
              >
                <div
                  className={`flex h-20 w-20 shrink-0 flex-col items-center justify-center ${
                    index === 0
                      ? "bg-[#b2f1bf] text-[#14512d]"
                      : "bg-[var(--footer)] text-[var(--ink)]"
                  }`}
                >
                  <span className="font-serif text-2xl font-semibold leading-none">
                    {event.day}
                  </span>
                  <span className="mt-1 text-xs font-bold uppercase tracking-[0.08em]">
                    {event.month}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="rounded-full bg-[var(--green)]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--green)]">
                    {event.status}
                  </span>
                  <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight transition group-hover:text-[var(--green)]">
                    {event.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-5 text-sm text-[var(--muted)]">
                    <span className="inline-flex items-center gap-2">
                      <Clock3 size={16} /> {event.time}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={16} /> {event.location}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-20 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-16">
        <div>
          <p className="eyebrow">Admissions</p>
          <h2 className="section-title max-w-2xl">
            Ready to study in a university shaped by technology?
          </h2>
        </div>
        <Link className="btn-primary w-fit rounded-none uppercase" href="/admissions">
          Start admission journey <BookOpen size={18} />
        </Link>
      </section>
    </div>
  );
}
