"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { School } from "../../../lib/contentful-school";

type Props = {
  school: School;
};

export default function DepartmentBrowser({ school }: Props) {
  const searchParams = useSearchParams();
  const departmentSlug = searchParams.get("slug");

  if (!departmentSlug) {
    return null;
  }

  const department = school.departments.find((dept) => dept.slug === departmentSlug);

  if (!department) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-8 lg:px-16">
      <div className="border border-(--line) bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--green)">
              Department courses
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">
              {department.name}
            </h2>
            <p className="mt-3 max-w-2xl text-(--muted)">
              {department.requirements}
            </p>
          </div>

          <Link
            href={`/schools/${school.slug}`}
            className="text-sm font-bold text-[var(--green)] hover:underline"
          >
            Close
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {department.courses.map((course) => (
            <article key={course.slug} className="border border-(--line) bg-(--soft) p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--green)">
                {course.courseCode}
              </p>
              <h3 className="mt-2 font-serif text-xl font-semibold leading-tight">
                {course.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
