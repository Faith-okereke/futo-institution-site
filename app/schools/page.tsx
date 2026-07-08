import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { getSchools } from "../../lib/contentful-school";

export default async function SchoolsPage() {
  const schools = await getSchools();
  const featured = schools.slice(0, 4);
  const directory = schools.slice(4);

  return (
    <div className="bg-(--surface) text-(--ink)">
      <section className="border-b border-(--line) bg-white px-4 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl text-center">
          <p className="eyebrow text-(--green)">Institutional Excellence</p>
          <h1 className="mx-auto mt-4 max-w-4xl font-serif text-5xl font-bold leading-tight">
            Schools and Faculties
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-(--muted)">
            The heart of technological innovation: specialized academic homes
            advancing knowledge through rigorous research, teaching, and field
            practice.
          </p>
        </div>
      </section>

      <section className="bg-[#5d5f5f] px-4 py-12 text-white sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 text-center md:grid-cols-4">
          {[
            ["10", "Specialized schools"],
            ["65+", "Departments"],
            ["25k", "Active scholars"],
            ["1.2k", "Research fellows"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="font-serif text-4xl font-semibold">{value}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-white/76">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-20 sm:px-8 md:grid-cols-12 lg:px-16">
        {featured.map((school, index) => (
          <article
            className={`group relative min-h-112 overflow-hidden border border-(--line) bg-(--soft) ${
              index === 0 || index === 3 ? "md:col-span-8" : "md:col-span-4"
            }`}
            key={school.code}
          >
            <Image
              src={school.image || "/design/campus-courtyard.png"}
              alt=""
              fill
              className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
              sizes="(min-width: 768px) 66vw, 100vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/86 via-black/26 to-transparent" />
            <div className="absolute bottom-0 p-8 text-white">
              <span className="inline-flex bg-[#b2f1bf] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#14512d]">
                {school.code}
              </span>
              <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight">
                {school.name}
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-white/86">
                Explore the departments and programs within the {school.name}.
              </p>
              <Link
                className="mt-6 inline-flex items-center gap-2 border border-white px-5 py-3 text-sm font-bold uppercase tracking-[0.06em] transition hover:bg-white hover:text-(--green)"
                href={`/schools/${school.slug}`}
              >
                Explore departments <ArrowRight size={17} />
              </Link>
            </div>
          </article>
        ))}

        {directory.map((school, index) => (
          <article
            className={` flex min-h-72 flex-col justify-between border border-(--line) p-6 transition hover:border-(--green) hover:bg-white ${
              index === 2 ? "bg-[#b2f1bf] md:col-span-6" : "bg-(--soft) md:col-span-4"
            }`}
            key={school.code}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--green)">
                {school.code}
              </p>
              <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight">
                {school.name.replace("School of ", "")}
              </h3>
              <p className="mt-4 leading-7 text-(--muted)">
                Discover the academic offerings and research opportunities in
                this school.
              </p>
              <ul className="mt-6 grid gap-2 text-sm text-(--muted)">
                {school.departments.map((department) => (
                  <li className="flex items-center gap-2" key={department.slug}>
                    <CheckCircle2 size={16} className="text-(--green)" />
                    {department.name}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-(--green)"
              href={`/schools/${school.slug}`}
            >
              Full directory <ArrowRight size={17} />
            </Link>
          </article>
        ))}
      </section>

      <section className="border-t border-(--line) bg-(--footer) px-4 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-4xl font-semibold">
            Academic Inquiries
          </h2>
          <p className="mt-5 text-lg leading-8 text-(--muted)">
            Have questions about a department or faculty admission requirement?
            Our academic registrars can guide the next step.
          </p>
          <Link className="btn-primary mt-8 rounded-none uppercase" href="/admissions">
            Connect with us <Mail size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
