import {
  createClient,
  EntryCollection,
  EntryFieldTypes,
  EntrySkeletonType,
} from "contentful";
import type { Course } from "../app/types/content";
import { buildDepartmentCourses } from "./course-catalog";

const client =
  process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN
    ? createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      })
    : null;

const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build";

export interface Department {
  name: string;
  slug: string;
  courses: Course[];
  requirements: string;
}

export interface School {
  name: string;
  slug: string;
  code: string;
  image: string | null;
  departments: Department[];
}

interface RawSchool {
  name: string;
  slug: string;
  code: string;
  image: string | null;
  departments: string[];
}

type SchoolEntrySkeleton = EntrySkeletonType<
  {
    name: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    code: EntryFieldTypes.Symbol;
    image?: EntryFieldTypes.AssetLink;
    departments: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  },
  "schools"
>;

// Mock data - replace with your actual CMS fetching logic (e.g., from Contentful)
const schoolsData: RawSchool[] = [
  
    {
      "name": "School of Biological Sciences",
      "code": "SOBS",
      "slug": "school-of-biological-sciences",
      "departments": [
        "Biochemistry",
        "Biology",
        "Biotechnology",
        "Microbiology",
        "Forensic Science"
      ],
      "image": null
    },
    {
      "name": "Directorate of General Studies",
      "code": "DGS",
      "slug": "directorate-of-general-studies",
      "departments": [
        "General Studies"
      ],
      "image": null
    },
    {
      "name": "School of Basic Medical Sciences",
      "code": "SBMS",
      "slug": "school-of-basic-medical-sciences",
      "departments": [
        "Human Anatomy",
        "Human Physiology"
      ],
      "image": null
    },
    {
      "name": "School of Agriculture and Agricultural Technology",
      "code": "SAAT",
      "slug": "school-of-agriculture-and-agricultural-technology",
      "departments": [
        "Agribusiness",
        "Agricultural Economics",
        "Agricultural Extension",
        "Animal Science and Technology",
        "Crop Science and Technology",
        "Fisheries and Aquaculture Technology",
        "Forestry and Wildlife Technology",
        "Soil Science and Technology"
      ],
      "image": null
    },
    {
      "name": "School of Electrical Systems Engineering Technology",
      "code": "SESET",
      "slug": "school-of-electrical-systems-engineering-technology",
      "departments": [
        "Computer Engineering",
        "Electrical (Power Systems) Engineering",
        "Electronics Engineering",
        "Mechatronics Engineering",
        "Telecommunications Engineering",
        "Electrical and Electronic Engineering"
      ],
      "image": null
    },
    {
      "name": "School of Postgraduate Studies",
      "code": "SPGS",
      "slug": "school-of-postgraduate-studies",
      "departments": [
        "Postgraduate Programmes"
      ],
      "image": null
    },
    {
      "name": "School of Physical Sciences",
      "code": "SOPS",
      "slug": "school-of-physical-sciences",
      "departments": [
        "Chemistry",
        "Geology",
        "Mathematics",
        "Physics",
        "Science Laboratory Technology",
        "Statistics"
      ],
      "image": null
    },
    {
      "name": "School of Environmental Sciences",
      "code": "SOES",
      "slug": "school-of-environmental-sciences",
      "departments": [
        "Architecture",
        "Building Technology",
        "Environmental Management",
        "Quantity Surveying",
        "Surveying and Geoinformatics",
        "Urban and Regional Planning",
        "Environmental Management and Evaluation"
      ],
      "image": null
    },
    {
      "name": "School of Health Technology",
      "code": "SOHT",
      "slug": "school-of-health-technology",
      "departments": [
        "Dental Technology",
        "Environmental Health Science",
        "Optometry",
        "Prosthetics and Orthotics",
        "Public Health Technology"
      ],
      "image": null
    },
    {
      "name": "School of Engineering and Engineering Technology",
      "code": "SEET",
      "slug": "school-of-engineering-and-engineering-technology",
      "departments": [
        "Agricultural and Bio-Resources Engineering",
        "Biomedical Engineering",
        "Chemical Engineering",
        "Civil Engineering",
        "Food Science and Technology",
        "Materials and Metallurgical Engineering",
        "Mechanical Engineering",
        "Petroleum Engineering",
        "Polymer and Textile Engineering"
      ],
      "image": null
    },
    {
      "name": "School of Logistics and Innovation Technology",
      "code": "SLIT",
      "slug": "school-of-logistics-and-innovation-technology",
      "departments": [
        "Entrepreneurship and Innovation",
        "Logistics and Transport Technology",
        "Maritime Technology and Logistics",
        "Supply Chain Management",
        "Project Management Technology"
      ],
      "image": null
    },
    {
      "name": "School of Information and Communication Technology",
      "code": "SICT",
      "slug": "school-of-information-and-communication-technology",
      "departments": [
        "Computer Science",
        "Cyber Security",
        "Information Technology",
        "Software Engineering"
      ],
      "image": null
    }
  
];
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeSchool(school: RawSchool): School {
  return {
    ...school,
    departments: school.departments.map((name, index) =>
      ({
        name,
        slug: slugify(name),
        courses: buildDepartmentCourses({
          schoolSlug: school.slug,
          schoolCode: school.code,
          departmentName: name,
          departmentSlug: slugify(name),
          departmentIndex: index,
        }),
        requirements:
          "Contact the school office for current admission requirements.",
      })
    ),
  };
}

function getAssetUrl(image: unknown): string | null {
  if (!image || typeof image !== "object" || !("fields" in image)) {
    return null;
  }

  const fields = image.fields;
  if (!fields || typeof fields !== "object" || !("file" in fields)) {
    return null;
  }

  const file = fields.file;
  if (!file || typeof file !== "object" || !("url" in file)) {
    return null;
  }

  const url = file.url;
  if (typeof url !== "string") {
    return null;
  }

  return url.startsWith("//") ? `https:${url}` : url;
}

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

function getStringArrayField(value: unknown): string[] {
  const fieldValue = getLocalizedValue(value);
  return Array.isArray(fieldValue)
    ? fieldValue.filter((item): item is string => typeof item === "string")
    : [];
}

function normalizeContentfulSchool(
  entry: EntryCollection<SchoolEntrySkeleton>["items"][number]
): School {
  const schoolSlug = getStringField(entry.fields.slug);
  const schoolCode = getStringField(entry.fields.code);

  return {
    name: getStringField(entry.fields.name),
    slug: schoolSlug,
    code: schoolCode,
    image: getAssetUrl(entry.fields.image),
    departments: getStringArrayField(entry.fields.departments).map(
      (name, index) =>
        ({
          name,
          slug: slugify(name),
          courses: buildDepartmentCourses({
            schoolSlug,
            schoolCode,
            departmentName: name,
            departmentSlug: slugify(name),
            departmentIndex: index,
          }),
          requirements:
            "Contact the school office for current admission requirements.",
        })
    ),
  };
}

export async function getSchools(): Promise<School[]> {
  // In a real app, you would fetch this from your CMS
  return Promise.resolve(schoolsData.map(normalizeSchool));
}

export async function getSchoolBySlug(slug: string): Promise<School | null> {
  const localSchool = schoolsData.find((school) => school.slug === slug);
  if (localSchool) {
    return normalizeSchool(localSchool);
  }

  if (!client || isProductionBuild) {
    return null;
  }

  const queryOptions = {
    content_type: "schools", // Make sure this matches your Content Type ID in Contentful
    "fields.slug": slug,
    limit: 1,
  } as const;

  let queryResult: EntryCollection<SchoolEntrySkeleton>;
  try {
    queryResult = await client.getEntries<SchoolEntrySkeleton>(queryOptions);
  } catch {
    console.warn("Using local school data because Contentful failed.");
    return null;
  }

  if (queryResult.items.length === 0) {
    console.error(`No school found with slug: ${slug}`);
    return null;
  }

  return normalizeContentfulSchool(queryResult.items[0]);
}

export async function getDepartment(
  schoolSlug: string,
  deptSlug: string
): Promise<Department | undefined> {
  const school = await getSchoolBySlug(schoolSlug);

  return school?.departments.find(
    (dept) => dept.slug === deptSlug
  );
}
