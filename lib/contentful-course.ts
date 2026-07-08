import { EntrySkeletonType } from "contentful";

import { Course } from "../app/types/content";
import { contentfulClient } from "./contentful";
import {
  buildDepartmentCourses,
  findCourseSlugPrefix,
} from "./course-catalog";

type CourseEntrySkeleton = EntrySkeletonType<
  {
    title: string;
    slug?: string;
    courseCode: string;
  },
  "courses"
>;

function getLocalizedValue(value: unknown): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  const localizedValues = Object.values(value);
  return localizedValues[0];
}

function getStringField(value: unknown): string {
  const fieldValue = getLocalizedValue(value);
  return typeof fieldValue === "string" ? fieldValue : "";
}

function normalizeCourse(entry: {
  fields: {
    title?: unknown;
    slug?: unknown;
    courseCode?: unknown;
  };
}): Course {
  return {
    title: getStringField(entry.fields.title),
    slug: getStringField(entry.fields.slug),
    courseCode: getStringField(entry.fields.courseCode),
  };
}

const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build";

export async function getCoursesForDepartment(
  schoolSlug: string,
  schoolCode: string,
  departmentSlug: string,
  departmentName: string,
  departmentIndex: number
): Promise<Course[]> {
  const fallbackCourses = buildDepartmentCourses({
    schoolSlug,
    schoolCode,
    departmentName,
    departmentSlug,
    departmentIndex,
  });

  if (!contentfulClient || isProductionBuild) {
    return fallbackCourses;
  }

  try {
    const entries = await contentfulClient.getEntries<CourseEntrySkeleton>({
      content_type: "courses",
      limit: 1000,
    });

    const prefix = findCourseSlugPrefix(schoolSlug, departmentSlug);
    const matchedCourses = (entries.items as unknown as Array<{
      fields: {
        title?: unknown;
        slug?: unknown;
        courseCode?: unknown;
      };
    }>)
      .map(normalizeCourse)
      .filter((course) => course.slug.startsWith(prefix))
      .sort((a, b) => a.title.localeCompare(b.title));

    return matchedCourses.length > 0 ? matchedCourses : fallbackCourses;
  } catch {
    console.warn("Using local course data because Contentful failed.");
    return fallbackCourses;
  }
}
