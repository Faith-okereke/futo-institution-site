import { Globe, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GoogleMapsEmbed } from "@next/third-parties/google";

const Footer = () => {
  const footerLinks = [
    {
      label: "History",
      href: "/history",
    },
    {
      label: "Leadership",
      href: "/leadership",
    },
    {
      label: "Faculties",
      href: "/faculties",
    },
    {
      label: "Admissions",
      href: "/admissions",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "Privacy Policies",
      href: "/privacy-policies",
    },
  ];
  return (
    <footer className="mt-auto bg-[var(--footer)] text-[var(--ink)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-16">
        <div className="max-w-sm">
          <Image
            src="/logo.png"
            alt="School Logo"
            width={64}
            height={64}
            className="h-16 w-16 object-contain"
          />
          <h2 className="mt-5 font-serif text-2xl font-semibold text-[var(--ink)]">
            Federal University of Technology, Owerri
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Driving technological advancement through research, education, and
            practical service to society.
          </p>
          <div className="mt-6 flex gap-3">
            {[Globe, Mail, ShieldCheck].map((Social, index) => (
              <Link
                href="/"
                key={index}
                aria-label="FUTO social channel"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--outline)] text-[var(--muted)] transition hover:border-[var(--green)] hover:text-[var(--green)]"
              >
                <Social size={18} />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="footer-heading">Quick links</p>
          <div className="mt-4 grid gap-3">
            {footerLinks.map((item) => (
              <Link
                className="footer-link"
                key={`${item.label}-${item.href}`}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="footer-heading">Contact</p>
          <div className="mt-4 grid gap-4 text-sm leading-6 text-[var(--muted)]">
            <p className="flex gap-3">
              <MapPin className="mt-1 shrink-0 text-[var(--green)]" size={18} />
              P.M.B. 1526, Owerri, Imo State, Nigeria
            </p>
            <p className="flex gap-3">
              <Mail className="mt-1 shrink-0 text-[var(--green)]" size={18} />
              info@futo.edu.ng
            </p>
            <p className="flex gap-3">
              <Phone className="mt-1 shrink-0 text-[var(--green)]" size={18} />
              +234 000 000 0000
            </p>
          </div>
        </div>
        <div>
          <p className=" footer-heading">campus location</p>
          <div className="mt-4 overflow-hidden rounded-md">
            <GoogleMapsEmbed
              apiKey={process.env.GOOGLE_MAPS_API_KEY!}
              mode="place"
              q="Federal University of Technology Owerri"
              height={200}
              width="100%"
              style="border:0; filter: grayscale(100%) invert(92%) contrast(83%);"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--outline)] px-5 py-5 text-center text-xs text-[var(--muted)]">
        Copyright 2026 Federal University of Technology, Owerri. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
