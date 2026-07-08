import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getSchoolBySlug, getSchools } from "../../../lib/contentful-school";
import { ArrowLeft, ArrowRight } from "lucide-react";
import DepartmentBrowser from "../../components/schools/DepartmentBrowser";

export const revalidate = 3600; // Revalidate every hour

// Generate static pages for each school at build time
export async function generateStaticParams() {
  const schools = await getSchools();
  return schools.map((school) => ({
    school: school.slug,
  }));
}

type Props = {
  params: Promise<{ school: string }>;
};

export default async function SchoolPage({ params }: Props) {
  // The 'school' param is the slug, e.g., "school-of-engineering"
  const { school: schoolSlug } = await params;

  const school = await getSchoolBySlug(schoolSlug);

  if (!school) {
    notFound();
  }

  return (
    <div className="bg-(--surface) text-(--ink)">
      <section className="relative min-h-105 overflow-hidden border-b border-(--line)">
        <Image
          src={school.image || "/design/campus-courtyard.png"}
          alt={`Image for ${school.name}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative mx-auto flex min-h-105 max-w-7xl flex-col justify-end px-4 py-12 sm:px-8 lg:px-16">
          <Link
            href="/schools"
            className="mb-0 inline-flex w-fit items-center gap-2 border border-white/30 bg-black/25 px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-white backdrop-blur transition hover:border-white hover:bg-white hover:text-(--green)"
          >
            <ArrowLeft size={17} />
            Back to schools
          </Link>
          <p className="text-sm font-bold uppercase tracking-widest text-white/80">
            {school.code}
          </p>
          <h1 className="mt-2 max-w-3xl font-serif text-5xl font-bold text-white">
            {school.name}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:px-16">
        <h2 className="font-serif text-4xl font-semibold">Departments</h2>
        <p className="mt-4 max-w-2xl text-lg text-(--muted)">
          Explore the departments within the {school.name}, each offering
          specialized programs and research opportunities.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {school.departments.map((department) => (
            <Link
              href={`/schools/${school.slug}?slug=${department.slug}`}
              key={department.slug}
              className="group block border border-(--line) bg-(--soft) p-6 transition hover:border-(--green) hover:bg-white"
            >
              <h3 className="font-serif text-2xl font-semibold leading-tight text-(--ink) group-hover:text-(--green)">
                {department.name}
              </h3>
              <p className="mt-2 text-sm text-(--muted)">
                {department.courses.length} undergraduate courses
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-(--green)">
                View Department <ArrowRight size={17} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Suspense fallback={null}>
        <DepartmentBrowser school={school} />
      </Suspense>
    </div>
  );
}
