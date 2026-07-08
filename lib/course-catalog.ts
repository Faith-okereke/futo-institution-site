import type { Course } from "../app/types/content";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const courseTemplates = [
  (department: string) => `Introduction to ${department}`,
  (department: string) => `Fundamentals of ${department}`,
  (department: string) => `Principles of ${department}`,
  (department: string) => `Applied ${department} I`,
  (department: string) => `Applied ${department} II`,
  (department: string) => `${department} Laboratory Methods`,
  (department: string) => `Research Methods in ${department}`,
  (department: string) => `Data Analysis for ${department}`,
  (department: string) => `${department} Professional Practice`,
  (department: string) => `Capstone Project in ${department}`,
] as const;

export type DepartmentCourseSeed = {
  schoolSlug: string;
  schoolCode: string;
  departmentName: string;
  departmentSlug: string;
  departmentIndex: number;
};

export function buildDepartmentCourses({
  schoolSlug,
  schoolCode,
  departmentName,
  departmentSlug,
  departmentIndex,
}: DepartmentCourseSeed): Course[] {
  const prefix = `${schoolSlug}-${departmentSlug}`;
  const codePrefix = `${schoolCode}-${String(departmentIndex + 1).padStart(2, "0")}`;

  return courseTemplates.map((makeTitle, courseIndex) => {
    const title = makeTitle(departmentName);

    return {
      title,
      slug: `${prefix}-${slugify(title)}`,
      courseCode: `${codePrefix}-${String(courseIndex + 1).padStart(2, "0")}`,
    };
  });
}

export function findCourseSlugPrefix(schoolSlug: string, departmentSlug: string) {
  return `${schoolSlug}-${departmentSlug}-`;
}
