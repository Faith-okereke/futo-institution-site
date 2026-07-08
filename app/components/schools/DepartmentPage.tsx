import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSchools,
  getSchoolBySlug,
} from "../../../lib/contentful-school";
import { getCoursesForDepartment } from "../../../lib/contentful-course";

export const revalidate = 3600;

// Generate static paths for each department in each school
export async function generateStaticParams() {
  const schools = await getSchools();
  const paths = schools.flatMap((school) =>
    school.departments.map((dept) => ({
      school: school.slug,
      department: dept.slug,
    }))
  );
  return paths;
}

type Props = {
  params: Promise<{ school: string }>;
  searchParams: Promise<{ slug?: string }>;
};

export default async function DepartmentPage({ params, searchParams }: Props) {
  const { school: schoolSlug } = await params;
  const { slug: departmentSlug } = await searchParams;

  if (!departmentSlug) {
    notFound();
  }

  const school = await getSchoolBySlug(schoolSlug);

  if (!school) {
    notFound();
  }

  const department = school.departments.find((dept) => dept.slug === departmentSlug);

  if (!department) {
    notFound();
  }

  const courses = await getCoursesForDepartment(
    school.slug,
    school.code,
    department.slug,
    department.name,
    school.departments.findIndex((dept) => dept.slug === departmentSlug)
  );

  return (
    <div className="bg-(--surface) text-(--ink)">
      <section className="px-4 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <Link href={`/schools/${school.slug}`} className="text-sm font-bold text-[var(--green)] hover:underline">
            &larr; Back to School
          </Link>
          <h1 className="mt-4 font-serif text-5xl font-bold">{department.name}</h1>

          <div className="mt-12 grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-serif text-3xl font-semibold">Courses</h2>
              <div className="mt-4 grid gap-4">
                {courses.map((course) => (
                  <article
                    key={course.slug}
                    className="border border-(--line) bg-white p-4"
                  >
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
            <div>
              <h2 className="font-serif text-3xl font-semibold">Requirements</h2>
              <p className="mt-4 text-[var(--muted)]">{department.requirements}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
