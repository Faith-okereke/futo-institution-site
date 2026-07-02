import { Globe, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.109319187688!2d6.981575473663144!3d5.4003122351983475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10425c4a1787546f%3A0x886a2c3c3df5fe44!2sFUTO%20Main%20Gate!5e0!3m2!1sen!2sng!4v1783031513610!5m2!1sen!2sng"
              width="300"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
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
