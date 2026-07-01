import { news } from "@/app/data/site";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const LatestNews = () => {
  return (
    <section className="bg-[var(--surface)] px-4 py-20 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-[var(--ink)]">
              Latest News
            </h2>
            <div className="mt-3 h-1 w-20 bg-[var(--green)]" />
          </div>

          <Link
            className="hidden items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[var(--green)] sm:flex"
            href="/blog"
          >
            View all news <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {news.map((item) => (
            <article
              className="group flex min-h-[30rem] flex-col border border-[var(--line)] bg-[var(--soft)] transition hover:-translate-y-1 hover:border-[var(--green)] hover:bg-white hover:shadow-[0_16px_40px_rgba(28,27,27,0.08)]"
              key={item.title}
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--green)]">
                  {item.category}
                </p>
                <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-[var(--ink)]">
                  {item.title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-6 text-[var(--muted)]">
                  {item.excerpt}
                </p>
                <time className="mt-8 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                  {item.date}
                </time>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
