"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "../../data/site";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-5 px-4 sm:px-8 lg:px-16">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="FUTO logo"
            width={54}
            height={54}
            className="h-12 w-12 object-contain"
          />
          <div className="hidden sm:block">
            <p className="font-serif text-lg font-semibold leading-tight text-[var(--ink)]">
              FUTO
            </p>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
              Technology for Service
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className={`border-b-2 pb-1 text-sm font-semibold text-[var(--ink)] transition hover:border-b-[var(--green)] hover:text-[var(--green)] ${
                pathname === item.href
                  ? "border-b-[var(--green)] text-[var(--green)]"
                  : "border-b-transparent"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden w-64 items-center gap-3 rounded border border-[var(--line)] bg-white px-3 py-2 lg:flex">
          <Search className="text-[var(--muted)]" size={18} />
          <input
            type="search"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
            placeholder="Search the whole site"
            aria-label="Search the whole site"
          />
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded border border-[var(--line)] text-[var(--ink)] lg:hidden cursor-pointer"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[var(--line)] bg-white px-5 py-5 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1">
            {navItems.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className="rounded px-2 py-3 text-base font-medium text-[var(--ink)] hover:bg-[var(--soft)] hover:text-[var(--green)]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <label className="mx-auto mt-4 flex max-w-7xl items-center gap-3 rounded border border-[var(--line)] px-3 py-2">
            <Search className="text-[var(--muted)]" size={18} />
            <input
              type="search"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
              placeholder="Search the whole site"
            />
          </label>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
