import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Rocket, ShieldCheck } from "lucide-react";

type ContentPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  highlights: string[];
  actionHref?: string;
  actionLabel?: string;
};

const timeline = [
  ["1980", "Founded as one of Nigeria's specialist technology universities."],
  ["1995", "Expanded academic schools, laboratories, and permanent-site infrastructure."],
  ["2010", "Advanced digital learning, research systems, and industry collaboration."],
  ["2026", "Focused on sustainable engineering, innovation hubs, and global partnerships."],
];

export function ContentPage({
  eyebrow,
  title,
  intro,
  highlights,
  actionHref = "/",
  actionLabel = "Return home",
}: ContentPageProps) {
  return (
    <div className="bg-[var(--surface)] text-[var(--ink)]">
      <section className="relative overflow-hidden bg-[var(--soft)] px-4 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow text-[var(--green)]">{eyebrow}</p>
            <h1 className="mt-4 font-serif text-5xl font-bold leading-tight">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              {intro}
            </p>
            <Link className="btn-primary mt-8 rounded-none uppercase" href={actionHref}>
              {actionLabel} <ArrowRight size={18} />
            </Link>
          </div>
          <div className="relative min-h-[520px]">
            <Image
              src="/design/campus-courtyard.png"
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            <div className="absolute bottom-0 left-0 bg-[var(--green)] p-8 text-white">
              <p className="font-serif text-4xl font-semibold">40+</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em]">
                Years of innovation
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-20 sm:px-8 md:grid-cols-3 lg:px-16">
        <article className="bg-[#b2f1bf] p-8 text-[#14512d] md:col-span-2">
          <Rocket className="mb-6" size={38} />
          <h2 className="font-serif text-3xl font-semibold">Our Mission</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8">
            To re-engineer society through technological advancement, first-rate
            research, and training that produces globally competitive manpower.
          </p>
          <p className="mt-10 border-t border-[#14512d]/20 pt-5 text-xs font-bold uppercase tracking-[0.12em] text-[var(--green)]">
            Strategic pillar 01
          </p>
        </article>
        <article className="border border-[var(--line)] bg-white p-8">
          <ShieldCheck className="mb-6 text-[var(--green)]" size={38} />
          <h2 className="font-serif text-3xl font-semibold">The Vision</h2>
          <p className="mt-5 leading-7 text-[var(--muted)]">
            To become a top-ranked technological university of international
            repute and a source of pride for Nigeria and Africa.
          </p>
        </article>
        {highlights.map((highlight) => (
          <article
            className="border border-[var(--line)] bg-[var(--soft)] p-6"
            key={highlight}
          >
            <CheckCircle2 className="text-[var(--green)]" />
            <p className="mt-5 leading-7 text-[var(--muted)]">{highlight}</p>
          </article>
        ))}
      </section>

      <section className="border-y border-[var(--line)] bg-white px-4 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-4xl font-semibold">
            Strategic Roadmap
          </h2>
          <p className="mt-3 text-[var(--muted)]">
            Charting the institution&apos;s journey toward practical impact.
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {timeline.map(([year, copy], index) => (
              <article
                className={`border border-[var(--line)] bg-[var(--soft)] p-6 ${
                  index % 2 === 1 ? "md:mt-10" : ""
                }`}
                key={year}
              >
                <div className="flex h-14 w-14 items-center justify-center bg-[var(--green)] font-bold text-white">
                  {year}
                </div>
                <p className="mt-5 leading-7 text-[var(--muted)]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
