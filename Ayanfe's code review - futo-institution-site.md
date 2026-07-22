# Ayanfe's Code Review — futo-institution-site

**Reviewed:** 22 July 2026
**Scope:** Code-level review only (architecture, correctness, practices, security, performance, a11y). UI/visual feedback excluded — that's a separate conversation.
**Commit reviewed:** `2496e60` — _"feat: school, courses added, departments"_
**Verified by:** full read of all 33 source files, `tsc --noEmit`, `eslint`, a full `next build`, and an instrumented build probe to confirm the `NEXT_PHASE` behaviour described in Blocker #1.

---

## Executive summary

The engineering fundamentals here are strong, and that should be said first. `tsc --noEmit` passes clean under `strict`, and — genuinely unusual — **ESLint reports zero errors and zero warnings**. There is no `any` anywhere in the data layer; the Contentful mapping uses `unknown` with real type-narrowing helpers rather than casting its way out. That reflects real care.

The problems are of one particular kind, and it isn't carelessness — it's **architectural self-deception**: a CMS integration that is wired up, typed, and documented, but which is switched off in production by a one-line guard, unreachable behind an early return, or simply never called. The site presents itself as CMS-driven. It is, in practice, a static site backed by hardcoded arrays.

The second theme is **fabricated institutional data**. FUTO is a real university. This site publishes ~590 course listings that were generated from string templates, alongside statistics that contradict the project's own data.

**Verdict:** solid engineering fundamentals, undercut by a real gap between what the code claims and what it does. Blockers must clear before this represents FUTO publicly.

| Severity                                | Count |
| --------------------------------------- | ----- |
| 🔴 Blocker — must fix before any deploy | 5     |
| 🟠 Major — fix this sprint              | 8     |
| 🟡 Moderate — should fix                | 10    |
| 🔵 Minor / polish                       | 7     |

---

## 🔴 Blockers

### 1. The entire CMS integration is disabled during production builds

This line appears in **all four** data modules — `lib/contentful-blog.ts:34`, `lib/contentful-course.ts:47`, `lib/contentful-event.ts:36`, `lib/contentful-school.ts:18`:

```ts
const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build";
```

And every fetch function is gated on it:

```ts
// lib/contentful-blog.ts:42
if (!contentfulClient || isProductionBuild) {
  return fallbackBlogPosts;
}
```

**I confirmed empirically that this guard fires.** I added a temporary probe page, ran `next build`, and read the prerendered HTML:

```
PHASEVALUE::phase-production-build::END
```

So during `next build`, `isProductionBuild` is `true` and **every data function returns hardcoded fallback data — even when Contentful credentials are correctly configured.**

Now combine that with the rendering strategy. From the build output:

```
├ ○ /                                              1m   1y
├ ○ /blog                                          1m   1y
├ ● /blog/[id]                                     1m   1y
│ ├ /blog/breakthrough-in-renewable-energy-storage
│ ├ /blog/preparation-for-convocation-begins
│ └ /blog/new-digital-library-resources-launched
└ ● /schools/[school]                              1h   1y
```

Those three blog slugs are **not from Contentful** — they're slugified titles from the `news` array in `app/data/site.ts`, via `lib/blog-content.ts:12`. Every page is statically prerendered from fallback data.

The practical consequences:

- **`generateStaticParams` can only ever see fallback slugs.** Real CMS posts are never prerendered. They're reachable only because `dynamicParams` defaults to `true`, meaning every real article pays a cold on-demand render.
- **Every deploy ships fake content**, which is then served until the first `revalidate` window elapses (60s for blog, 3600s for schools). First visitors and any crawler that hits during that window get placeholder data.
- **The build can never fail on a CMS problem**, because it never talks to the CMS. A broken content model or revoked token surfaces in production, not in CI.

I understand why this was added — it makes `next build` succeed on a machine with no `.env`. But `!contentfulClient` already handles that case, on line 42 of the same expression. The `isProductionBuild` half only takes effect when credentials _are_ present, which is exactly when you want the fetch to happen.

**Fix:** delete `isProductionBuild` from all four files. The `!contentfulClient` guard alone gives you the "builds without credentials" behaviour you actually wanted.

---

### 2. `getSchools()` never touches the CMS, and the Contentful path is unreachable dead code

`lib/contentful-school.ts:317-320`

```ts
export async function getSchools(): Promise<School[]> {
  // In a real app, you would fetch this from your CMS
  return Promise.resolve(schoolsData.map(normalizeSchool));
}
```

That comment is still in the shipped code, as is the one at line 54:

```ts
// Mock data - replace with your actual CMS fetching logic (e.g., from Contentful)
const schoolsData: RawSchool[] = [
  /* 12 hardcoded schools, 158 lines */
];
```

Worse is `getSchoolBySlug()` at line 322:

```ts
export async function getSchoolBySlug(slug: string): Promise<School | null> {
  const localSchool = schoolsData.find((school) => school.slug === slug);
  if (localSchool) {
    return normalizeSchool(localSchool); // ← always returns here
  }

  if (!client || isProductionBuild) return null;
  // ...Contentful query below is unreachable for every real school
}
```

The local array is checked **first** and returns early. And `generateStaticParams` in `app/schools/[school]/page.tsx:13` builds its paths from `getSchools()` — the same local array. So every slug that can ever reach this function is guaranteed to be found locally.

**The Contentful branch is unreachable by construction.** Which makes all of this dead code: the `client` at line 10, the `SchoolEntrySkeleton` type at line 43, `normalizeContentfulSchool()` at line 287, `getAssetUrl()` at line 243, `getStringArrayField()` at line 280 — roughly 120 lines written, typed, and never executed.

This also means `school.image` is always `null` (every entry in `schoolsData` has `"image": null`), so `app/schools/page.tsx:54` and `app/schools/[school]/page.tsx:37` always fall through to `/design/campus-courtyard.png`. **All 12 schools display the same photograph.**

Also note `lib/contentful-school.ts:10-16` creates a **second, separate Contentful client**, duplicating `lib/contentful.ts` but ignoring its `CONTENTFUL_PREVIEW_ACCESS_TOKEN` fallback and its `environment` setting. Two clients with different configurations is a bug waiting to happen.

**Fix:** decide whether schools are CMS-driven or not. If yes, query Contentful first and fall back to local; delete the duplicate client and import the shared one. If no, delete the ~120 lines of unreachable Contentful code and be honest that this is static data.

---

### 3. ~590 fabricated course listings published as a real university's catalogue

`lib/course-catalog.ts:11-22`

```ts
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
];
```

Ten templates, applied to every department. I counted the data: **12 schools, 59 departments**. That's **590 invented courses**, each with a synthetic course code (`SICT-01-03`), rendered on `/schools/[school]` as _"10 undergraduate courses"_ per department and listed in full by `DepartmentBrowser`.

So the site currently tells prospective students that FUTO's Department of Human Anatomy offers "Data Analysis for Human Anatomy" and "Capstone Project in Human Anatomy". None of these exist.

FUTO is a real, accredited institution. Published course catalogues are material to how students choose universities and what they believe they're enrolling in. Fabricated academic offerings on an institutional site is a reputational and arguably regulatory problem, not a content-polish issue.

The same applies to `requirements`, hardcoded identically for all 59 departments at `lib/contentful-school.ts:236`:

```ts
requirements: "Contact the school office for current admission requirements.",
```

That one is at least honest. The courses are not.

**Fix:** remove the generated catalogue. Show real courses from the CMS, or show nothing and link to the official handbook. Generated placeholder data is fine in a local fixture; it must not render as fact on a public institutional site.

---

### 4. Published statistics contradict the project's own data

`app/schools/page.tsx:29-33`

```tsx
{
  [
    ["10", "Specialized schools"],
    ["65+", "Departments"],
    ["25k", "Active scholars"],
    ["1.2k", "Research fellows"],
  ];
}
```

I counted directly from `schoolsData` in `lib/contentful-school.ts`:

| Claimed         | Actual in data |                                                                 |
| --------------- | -------------- | --------------------------------------------------------------- |
| 10 schools      | **12**         | contradicted on the same page — the grid below renders 12 cards |
| 65+ departments | **59**         | overstated, and "65+" is false regardless                       |

The "10 schools" figure is self-refuting: a visitor can count the twelve cards rendered immediately beneath the stat.

`app/page.tsx:94-104` has more hardcoded numbers attached to a _dynamically selected_ school:

```tsx
const spotlight = schools[3];   // whichever school is 4th in the array
// ...
<p>8+</p>  <p>Departments</p>
<p>150+</p><p>Faculty members</p>
```

`spotlight` is positional (`schools[3]`), so reordering the array silently reattaches "8+ departments / 150+ faculty" to a different school. Neither number is derived from anything.

Similarly `app/components/site/content-page.tsx:54` renders a hardcoded "40+ / Years of innovation" on five different pages.

**Fix:** derive counts from the data (`schools.length`, `schools.flatMap(s => s.departments).length`). For figures that genuinely can't be derived (faculty headcount), source them from the CMS or remove them — don't invent them.

---

### 5. Every static page renders a mission statement and a marketing timeline — including the privacy policy

`app/components/site/content-page.tsx` takes `{eyebrow, title, intro, highlights}` as props, then renders three **hardcoded** sections regardless of caller:

- Lines 64-82: "Our Mission" and "The Vision" cards
- Lines 14-19 + 94-118: a "Strategic Roadmap" timeline (1980 / 1995 / 2010 / 2026)

Five pages use this component: `/about`, `/history`, `/leadership`, `/admissions`, and — `app/privacy-policies/page.tsx:5` — **`/privacy-policies`**.

So the privacy policy page renders:

> **Our Mission** — To re-engineer society through technological advancement, first-rate research, and training that produces globally competitive manpower.
>
> **Strategic Roadmap** — 1980: Founded as one of Nigeria's specialist technology universities…

A privacy policy is a legal document. Users and regulators go there to find out what data is collected and how it's handled. This page contains none of that — it's the marketing template with a different heading. For an institution handling prospective-student data, a placeholder privacy policy is a compliance gap, not a content TODO.

The `/history` page has the inverse problem: it's the page whose _entire purpose_ is the timeline, but the timeline is locked inside a shared component and identical to the one on `/admissions`.

**Fix:** write a real privacy policy as its own page. Move Mission/Vision/timeline out of the shared shell and pass them as props (or `children`) so each page controls its own content.

---

## 🟠 Major

### 6. Broken navigation: `/staff` is in the main navbar and does not exist

`app/data/site.ts:3-10`

```ts
export const navItems = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Staff", href: "/staff" }, // ← no such route
  { label: "Schools", href: "/schools" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
];
```

There is no `app/staff/` directory. This renders in the desktop nav (`navbar.tsx:36`) **and** the mobile nav (`navbar.tsx:74`), on every page of the site. It's a guaranteed 404 in primary navigation.

Second one — `app/page.tsx:53`:

```tsx
<Link href="/research">Research impact</Link>
```

That's one of the two hero CTAs on the homepage. `/research` doesn't exist either.

Full audit of linked-vs-existing routes:

| Linked                                                                                                       | Exists                       |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| `/`, `/about`, `/admissions`, `/blog`, `/events`, `/history`, `/leadership`, `/privacy-policies`, `/schools` | ✅                           |
| `/staff`                                                                                                     | ❌ — main navbar, every page |
| `/research`                                                                                                  | ❌ — homepage hero CTA       |

**Fix:** build the pages or remove the links. Then add a link-integrity check to CI — this class of bug is trivially automatable.

---

### 7. `DepartmentPage.tsx` is a route file living in the components folder — so it does nothing

`app/components/schools/DepartmentPage.tsx` exports:

```ts
export const revalidate = 3600;                    // line 9
export async function generateStaticParams() {...} // line 12
export default async function DepartmentPage({ params, searchParams }: Props)
```

Those are **App Router route conventions**. In `app/components/`, they are inert — Next only honours `revalidate` and `generateStaticParams` from a `page.tsx`/`layout.tsx` in a route segment.

And nothing imports it. I checked: zero references outside the file itself. So all 93 lines are dead — including the only code path that calls `getCoursesForDepartment()` from `lib/contentful-course.ts`. **That entire 91-line module is dead too.**

Meanwhile the live implementation is `DepartmentBrowser.tsx`, a client component reading `?slug=` — a different, weaker design (see #8).

This looks like a half-finished migration from a real `/schools/[school]/[department]` route to the query-param approach, where the old file was moved into `components/` instead of deleted.

**Fix:** delete `DepartmentPage.tsx` and `lib/contentful-course.ts`, or promote it back to `app/schools/[school]/[department]/page.tsx` and delete `DepartmentBrowser` instead. Right now you're maintaining two implementations and shipping the worse one.

---

### 8. Departments use a query param instead of a route — costing SEO and shareability

`app/schools/[school]/page.tsx:71`

```tsx
<Link href={`/schools/${school.slug}?slug=${department.slug}`}>
```

Department content is then rendered client-side by `DepartmentBrowser.tsx:12-13` via `useSearchParams()`.

Consequences:

- **Not indexable.** All 59 departments share one URL per school. Crawlers see the base page; department content never appears in server HTML. For an institutional site, department pages are among the highest-value search landing pages — this forfeits all of them.
- **No metadata.** No per-department `<title>` or description is possible.
- **The param is badly named.** `?slug=` on a page whose route param is already a slug. `?department=` would say what it means.
- **Reading `useSearchParams()` opts the subtree into client rendering** and requires the `<Suspense>` wrapper at line 89 — which is correctly present, but is a workaround for a self-imposed constraint.

The irony is that `DepartmentPage.tsx` (#7) already implements the correct route-based version. It's just in the wrong folder.

**Fix:** real nested route at `app/schools/[school]/[department]/page.tsx`, with `generateStaticParams` and `generateMetadata`.

---

### 9. Time fields are formatted as dates — and will render "Invalid Date"

`app/page.tsx:174-176`

```tsx
{
  event.time ? new Date(event.time).toLocaleDateString() : "Time not specified";
}
```

This is under a **clock icon**, in a slot labelled as the event time. It calls `toLocaleDateString()` — so even in the best case it prints a date where a time belongs.

But `event.time` is a separate field from `event.date` (`lib/contentful-event.ts:11`, `time?: string`). If an editor enters `"10:00"` or `"2:00 PM"` — the natural thing to type in a field called _time_ — then `new Date("10:00")` is **Invalid Date**, and the page renders the literal string `Invalid Date`.

Three variants of the same bug:

| Location                   | Call                                           | Renders                   |
| -------------------------- | ---------------------------------------------- | ------------------------- |
| `app/page.tsx:175`         | `new Date(event.time).toLocaleDateString()`    | a date, or `Invalid Date` |
| `EventsPageClient.tsx:108` | `new Date(featured.time).toLocaleDateString()` | same                      |
| `EventCards.tsx:46`        | `new Date(event.time).toLocaleTimeString()`    | time, or `Invalid Date`   |

`EventCards.tsx:46` also produces broken copy when `time` is absent:

```tsx
{event.location || "Not specified"} at {event.time ? new Date(event.time).toLocaleTimeString() : ""}.
```

→ renders `"Main Auditorium at ."`

Note the contrast with `lib/contentful-event.ts:43-53`, where `formatDateFields()` **does** guard with `Number.isNaN(date.getTime())`. The right pattern exists in the codebase; it just wasn't applied at the call sites.

**Fix:** one shared `formatEventTime()` helper with a NaN guard, used everywhere. Decide whether `time` is a time-of-day string or an ISO datetime, and enforce it at the CMS boundary.

---

### 10. The first event is always treated as featured, silently dropping it from the list

`app/components/events/EventsPageClient.tsx:17`

```ts
const [featured, ...otherEvents] = events;
```

`featured` is just `events[0]` — whatever Contentful returned first, ordered by `fields.date` (`contentful-event.ts:109`). It has nothing to do with the `featured` boolean on the entry.

So if `events[0].featured === false`:

- It's still rendered in the large "featured" slot with the `{type} - {status}` badge
- It's still removed from `otherEvents`, so it never appears in the normal grid
- Worse, `featuredVisible` (line 24) is `filterType === "all" || featured?.type === filterType`. Filter to a type the first event doesn't match, and that event **vanishes from the page entirely** — not in the featured slot, not in the grid.

Then line 141-145:

```tsx
<p>Total scheduled events</p>
<p>{filteredEvents.length}</p>
```

`filteredEvents` derives from `otherEvents`, which excludes `events[0]`. So "Total scheduled events" is always short by one, and short by more when a filter is active. The label says total; the number is a filtered subset.

Also hardcoded at line 50 — a button reading `July 2026` with no `onClick`. It's a dead control next to a working filter, and it will read as a stale date from August onward.

**Fix:** select the featured event by its flag (`events.find(e => e.featured)`), exclude only that one from the grid, and label the count for what it is.

---

### 11. The newsletter form navigates away on submit

`app/components/events/EventsCalendarPanel.tsx:216-231`

```tsx
<form className="mt-8 grid gap-4">
  <label>
    Institutional email
    <input type="email" placeholder="student.name@futo.edu.ng" />
  </label>
  <button className="btn-primary ..." type="submit">
    Subscribe now
  </button>
</form>
```

No `onSubmit`, no `action`, no state. A `<form>` with a submit button and no handler performs a **native GET navigation to the current URL**. The user clicks "Subscribe now" and the page reloads with a query string appended. The input has no `name`, so nothing is even submitted.

The user's reasonable interpretation is "I subscribed." Nothing happened, and the visible feedback is a page flash.

Related: the two search inputs in `navbar.tsx:53` and `navbar.tsx:87` have no `onChange`, no form, and no handler. Typing does nothing; Enter does nothing. Two prominent non-functional controls.

**Fix:** wire these to a server action or an API route, or remove them. A control that looks operational and isn't is worse than an absent one.

---

### 12. `index.html` — a 746-line unrelated page committed at the project root

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Elite Corp — DevOps Engineering Division</title>
  </head>
</html>
```

This is a complete, self-contained static page for a fictional "Elite Corp" DevOps company — its own Google Fonts imports, its own ~500-line CSS design system in `<style>`. It has nothing to do with FUTO.

It's committed to the repo. Next.js ignores it (it's not in `app/` or `public/`), so it doesn't ship — but it's 24KB of confusing noise at the root of the project, and it's the first file an alphabetical listing shows after the config files.

**Fix:** delete it.

---

### 13. Repository hygiene: conflicting lockfiles, misfiled dependency, broken scripts

**Two package managers.** Both `pnpm-lock.yaml` (committed) and `package-lock.json` are present, plus a `pnpm-workspace.yaml` declaring a workspace that has no packages. The build warns:

```
⚠ We detected multiple lockfiles and selected the directory of /Users/hh/package-lock.json as the root directory.
   Detected additional lockfiles: .../futo-institution-site/pnpm-workspace.yaml
```

Next then infers the wrong workspace root, which affects output tracing and can break deployment bundles.

**`contentful-management` is in `dependencies`.** It's used only by `scripts/seed-contentfu.ts`. It's a write-capable admin SDK that ships to the server bundle for no reason. It belongs in `devDependencies`.

**Three of four seed scripts don't exist.** `package.json` declares:

```json
"seed:courses": "tsx scripts/seed-courses.ts",
"seed:blogs":   "tsx scripts/seed-contentfu.ts",
"seed:events":  "tsx scripts/seed-events.ts",
"seed:schools": "tsx scripts/seed-schools.ts"
```

Only `seed-contentfu.ts` exists (note the truncated filename — missing the `l`). The other three fail immediately.

**And `/scripts` is gitignored** (`.gitignore` last line), so none of them are in the repo at all. A fresh clone gets four npm scripts that all fail. The seed scripts are the _only_ mechanism for populating Contentful — that's exactly the thing a new contributor needs and can't get.

**Fix:** pick one package manager and delete the other lockfile; delete `pnpm-workspace.yaml` or set `turbopack.root`. Move `contentful-management` to `devDependencies`. Un-ignore `/scripts`, commit the scripts, fix the filename and the three broken entries.

---

## 🟡 Moderate

### 14. Dark mode is declared and does nothing

`app/globals.css:26-31`

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #fcf9f8; /* identical to light */
    --foreground: #1c1b1b; /* identical to light */
  }
}
```

Both values match the light-mode declarations at lines 5-6 exactly. The media query is a no-op. Either implement dark mode or delete the block — leaving it suggests support that isn't there.

---

### 15. Font variables are named for fonts that were never loaded

`app/globals.css:15-16`

```css
--font-inter: Arial, Helvetica, sans-serif;
--font-playfair: Georgia, "Times New Roman", serif;
```

There is no `next/font` import anywhere, and no `@font-face`. So `--font-inter` is Arial and `--font-playfair` is Georgia. Every `font-serif` class in the codebase — and there are dozens, on every heading — renders Georgia.

The naming actively misleads: a developer reading `font-serif` on an `<h1>` will believe they're looking at Playfair Display. (`index.html`, the unrelated file from #12, _does_ load Playfair — which is likely where the names came from.)

**Fix:** load the fonts with `next/font/google` and wire the variables, or rename them to `--font-sans` / `--font-serif` and drop the false specificity.

---

### 16. Two mixed Tailwind syntaxes, plus two malformed classes

The codebase uses both the v3 bracket form and the v4 shorthand, roughly evenly:

```
[var(--green)]  →  123 occurrences
-(--green)      →  104 occurrences
```

Often within a single file — `DepartmentBrowser.tsx:43` uses `text-[var(--green)]` eleven lines after `border-(--line)` on line 27.

Two are outright broken — a stray `]` closing nothing:

| File                      | Line | Class               |
| ------------------------- | ---- | ------------------- |
| `EventsPageClient.tsx`    | 36   | `text-(--muted)]`   |
| `EventsCalendarPanel.tsx` | 156  | `border-(--green)]` |

Tailwind emits nothing for these, so the styles silently don't apply. `EventsCalendarPanel.tsx:156` is on the _selected_ calendar day — the selected-state border just doesn't render.

**Fix:** standardise on the v4 shorthand, fix the two malformed classes, and install the Tailwind IntelliSense extension — it flags both problems as you type.

---

### 17. The footer's three "social" links all point to the homepage

`app/components/layout/footer.tsx:51-60`

```tsx
{[Globe, Mail, ShieldCheck].map((Social, index) => (
  <Link
    href="/"
    key={index}
    aria-label="FUTO social channel"
  >
```

Three links, all `href="/"`, all with the **identical** `aria-label`. A screen-reader user hears "FUTO social channel, link" three times, and all three go to the homepage.

They also aren't social icons — `Globe`, `Mail`, and `ShieldCheck` are a globe, an envelope, and a shield.

Nearby placeholders in the same component: `+234 000 000 0000` (line 92) and a hardcoded `Copyright 2026` (line 112) that will be wrong in January.

**Fix:** real URLs with distinct `aria-label`s and `rel="noopener noreferrer"`, or remove the row. Use `new Date().getFullYear()` for the copyright.

---

### 18. Modal and dropdown are missing standard interaction behaviours

**Event detail modal** (`EventCards.tsx:61-140`) has none of:

- `role="dialog"` / `aria-modal="true"` — screen readers don't announce it
- Escape to close (only the X, the backdrop, and the Close button work)
- Focus trap — Tab walks out into the page behind
- Focus restore on close
- Body scroll lock — the page scrolls under the open modal

The backdrop at line 63 is a bare `<div>` with `onClick` — not keyboard-reachable.

**Filter dropdown** (`FilterByType.tsx`) is closer — it correctly sets `aria-expanded` and `aria-haspopup="listbox"`. But:

- The options have `role="option"` (line 53) with **no parent `role="listbox"`**. An `option` outside a `listbox` is invalid ARIA and is generally ignored.
- No Escape handler, no arrow-key navigation, no focus management on open.

**Fix:** a headless primitive (Radix, React Aria) for both. Correct modal and listbox semantics are more work by hand than they appear, and `FilterByType` is 80% there — which is exactly the situation where the last 20% gets skipped.

---

### 19. Hydration-mismatch risk from `new Date()` in client component initial state

`app/components/events/EventsCalendarPanel.tsx:36-47`

```ts
const todayIso = toIsoDateString(new Date());

const [viewDate, setViewDate] = useState(() => {
  const now = new Date();
  return monthStart(now.getUTCFullYear(), now.getUTCMonth());
});

const [selectedDate, setSelectedDate] = useState<string | null>(() => {
  return events.some((event) => event.date.startsWith(todayIso))
    ? todayIso
    : null;
});
```

This is a `"use client"` component, but it still server-renders. `new Date()` runs once on the server and again on the client. `/events` is `force-dynamic` (`app/events/page.tsx:4`), so SSR happens per request — and if a request lands near a UTC midnight boundary, or the server clock differs from the client's, `todayIso` differs between the two renders and React reports a hydration mismatch.

The functions consistently use `getUTC*`, which is good and reduces (but doesn't eliminate) the window.

**Fix:** initialise to a stable value and set the real "today" in a `useEffect`, or pass the server's timestamp down as a prop so both renders agree.

---

### 20. Missing App Router special files

No `error.tsx`, `not-found.tsx`, `loading.tsx`, `sitemap.ts`, or `robots.ts` anywhere in `app/`.

- **`notFound()` is called in 5 places** — `app/blog/[id]/page.tsx:60`, `app/schools/[school]/page.tsx:30`, and three times in `DepartmentPage.tsx` — all rendering Next's unstyled default 404 with no nav, no footer, no route back.
- **No `error.tsx`** means any thrown error shows the raw error screen.
- **No `sitemap.ts`** on a content site with 26 prerendered routes. It's ~15 lines and directly affects indexing.
- **No `loading.tsx`** on `/events`, the one `force-dynamic` route — so no streaming fallback.

---

### 21. `getLocalizedValue()` is a fragile guess at locale handling, and duplicated

Identical implementations in `lib/contentful-course.ts:19-26` and `lib/contentful-school.ts:266-273`:

```ts
function getLocalizedValue(value: unknown): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const localizedValues = Object.values(value);
  return localizedValues[0]; // ← "first key wins"
}
```

The intent is to unwrap Contentful's `{ "en-US": "..." }` localised shape. But it can't distinguish a locale wrapper from any other object, so **any object-valued field gets replaced by an arbitrary property** — `Object.values()` order is insertion order, not a defined locale precedence.

The Delivery API (which this project uses, via `contentful`) already returns flattened single-locale values by default. This helper is defending against a shape the client doesn't normally produce, and would corrupt real object fields if it ever did fire.

`getStringField()` is likewise duplicated across both files, as is `slugify()` — three copies with **two different implementations**: `contentful-school.ts:214` and `course-catalog.ts:3` strip parentheses, `contentful-event.ts:78` doesn't. A department named "Electrical (Power Systems) Engineering" slugifies differently depending on which copy runs.

**Fix:** one `lib/contentful-utils.ts`. Drop `getLocalizedValue` unless you're actually querying with `locale: "*"`.

---

### 22. `catch {}` discards the error object entirely

Five sites: `contentful-blog.ts:53,78`, `contentful-course.ts:87`, `contentful-event.ts:113`, `contentful-school.ts:341`.

```ts
} catch {
  console.warn("Using fallback blog posts because Contentful failed.");
  return fallbackBlogPosts;
}
```

The parameterless `catch {}` is a deliberate choice to not even bind the error. So when Contentful fails, you get a fixed sentence and **no status code, no message, no request id**. Debugging a production CMS failure from that log line is guesswork.

`contentful-school.ts:341-343` is actively misleading:

```ts
} catch {
  console.warn("Using local school data because Contentful failed.");
  return null;                                   // ← does not return local data
}
```

It says it's using local data and returns `null`, which sends the caller to `notFound()`.

**Fix:** `catch (error)` and log it. Route to real error reporting for anything user-facing.

---

### 23. `revalidate` inconsistency and an unused fallback path

`app/blog/page.tsx:28` and `app/blog/[id]/page.tsx:159` both set `revalidate = 60`. `app/schools/[school]/page.tsx:9` sets `3600`. `app/schools/page.tsx` sets **nothing** — so the schools index is fully static and never revalidates, while individual school pages refresh hourly. Since both read the same hardcoded array today it makes no difference, but the moment #2 is fixed the index will drift permanently out of date.

Separately, `lib/blog-content.ts:40-44`:

```ts
export function getBlogImage(post: BlogPost, index = 0): string {
  const fallback = fallbackBlogPosts[index % fallbackBlogPosts.length];
  return (
    post.coverImage ?? fallback.coverImage ?? "/design/campus-courtyard.png"
  );
}
```

Nothing calls it. `formatBlogDate()` in the same file is also unused — `app/blog/page.tsx:16` and `app/blog/[id]/page.tsx:29` each define their own **identical** `formatDate()` instead.

---

## 🔵 Minor

**24. `[id]` route param actually holds a slug** — `app/blog/[id]/page.tsx` names the segment `id`, then passes it to `getBlogPostBySlug(id)`. Rename to `[slug]`.

**25. `alt=""` on meaningful images** — `content-page.tsx:49`, `schools/page.tsx:55`, `EventsPageClient.tsx:76`, `latest-news.tsx:37`. Empty alt marks an image decorative and hides it from screen readers. The news thumbnails and school hero images are content.

**26. `key={item.title}` and `key={index}`** — `latest-news.tsx:31`, `app/page.tsx:148`, `EventsPageClient.tsx:129` key on title; `footer.tsx:54` and `EventsCalendarPanel.tsx:137` key on index. `slug` is available and stable on all of these.

**27. `researchAreas` is exported and never imported** — `app/data/site.ts:168`. Dead. Also `posts` (line 246) is only consumed by the gitignored seed script, so from the app's perspective it's dead weight in a 426-line data file.

**28. Odd defensive string-splitting on categories** — `latest-news.tsx:46`: `item.category.map((cat) => cat.split(",")[0]).join(", ")`. `category` is already `Category[]`; splitting each element on a comma suggests uncertainty about whether the CMS returns an array or a comma-joined string. Validate at the boundary instead.

**29. `navigator?.clipboard` with no user feedback** — `EventCards.tsx:120-122`. Optional chaining on `navigator` (which always exists in a browser) rather than on `clipboard` (which may not be available on insecure origins). No success/failure indication, and the promise rejection is unhandled.

**30. Arbitrary positional styling** — `schools/page.tsx:49` (`index === 0 || index === 3` → wide) and `:84` (`index === 2` → green background). Layout emphasis derived from array position; reordering the data reshuffles the visual hierarchy at random.

**31. No `metadataBase` and thin metadata** — `app/layout.tsx:6-9` sets only `title` and `description`. No `metadataBase`, no Open Graph, no Twitter card, no per-page metadata on `/schools`, `/events`, `/about`, `/history`, `/leadership`, `/admissions`, or `/privacy-policies`. Only `app/blog/[id]` implements `generateMetadata`.

---

## Things done well

Genuinely worth leading the call with:

- **ESLint reports zero errors and zero warnings**, and `tsc --noEmit` passes clean under `strict: true`. I ran both. That's rare and it reflects real care.
- **No `any` in the data layer.** The CMS boundary uses `unknown` plus narrowing helpers (`getAssetUrl` in `contentful-school.ts:243-264` walks the shape with proper `typeof`/`in` guards) instead of casting past the type system. That's the harder, correct approach, and it's the thing most projects skip.
- **Proper Contentful type skeletons** — `EntrySkeletonType` with `EntryFieldTypes` at `contentful-school.ts:43-52` is the SDK's intended typing mechanism, not a cast.
- **Correct Next 16 async APIs throughout** — `params` and `searchParams` typed as `Promise<T>` and awaited in every dynamic route.
- **The client is nullable by design** (`lib/contentful.ts:9-16`), so a missing env var degrades gracefully rather than throwing at import time. Good instinct, and it makes the `isProductionBuild` guard in #1 redundant.
- **UTC-consistent date maths in the calendar** — `EventsCalendarPanel.tsx` uses `getUTC*` and `Date.UTC` throughout, avoiding the off-by-one-day timezone bug that catches most calendar implementations.
- **`formatDateFields()` guards against invalid dates** with `Number.isNaN(date.getTime())` (`contentful-event.ts:45`). The right pattern — it just needs applying at the call sites (#9).
- **`<Suspense>` around the `useSearchParams()` consumer** (`schools/[school]/page.tsx:89`) is correct and often missed.
- **Real empty states** — `blog/page.tsx:57-62` and `EventsPageClient.tsx:151-155` both handle the zero-results case with sensible copy.
- **`next.config.ts` scopes remote image patterns** with explicit `pathname` restrictions rather than a blanket wildcard host.
- **No secrets committed.** No `.env` in the repo or in history; `.gitignore` covers `.env*`. Verified across all 8 commits.

---

## Suggested order of work

**Before any deploy:**

1. Delete the `isProductionBuild` guard from all four lib files (#1) — 5 minutes, restores the whole CMS integration
2. Remove the fabricated course catalogue (#3) — this is the reputational one
3. Fix or remove `/staff` and `/research` links (#6)
4. Correct the school/department counts to derive from data (#4)
5. Write a real privacy policy; stop rendering the marketing template there (#5)
6. Delete `index.html` (#12)

**This sprint:** 7. Decide whether schools are CMS-backed; delete the unreachable branch either way (#2) 8. Delete `DepartmentPage.tsx` + `contentful-course.ts`, or promote to a real route (#7, #8) 9. Fix the event time formatting and NaN guards (#9) 10. Fix featured-event selection and the "total events" count (#10) 11. Wire or remove the newsletter form and the two search inputs (#11) 12. Lockfiles, `contentful-management` → devDependencies, un-ignore and fix `/scripts` (#13) 13. Add `error.tsx`, `not-found.tsx`, `sitemap.ts` (#20)

**Next:** 14. Load real fonts or rename the variables (#15) 15. Standardise Tailwind syntax; fix the two malformed classes (#16) 16. Modal and dropdown accessibility (#18) 17. De-duplicate `slugify` / `getStringField`; drop `getLocalizedValue` (#21) 18. `catch (error)` and real error reporting (#22)

**Process changes:**

- `npm run lint` + `tsc --noEmit` as **blocking** CI checks — they pass today, so this is free and locks in the win
- A link-integrity check (crawl `href`s against the route manifest) — catches #6 automatically
- A grep for `Mock data`, `In a real app`, `TODO` before merge
- Ban env-based branching that changes _data sources_ between build and runtime (#1)

---

## Talking points for the call

1. **Open with the toolchain result.** Zero lint errors, zero type errors, no `any` in the data layer. That is a genuinely good result and not the norm — they should know it was noticed before they hear the rest of the list.

2. **The central theme is "the code claims more than it does."** Not carelessness — most of these are the residue of _almost_ finishing something. The Contentful integration for schools is fully written and typed, and unreachable because of an early return. `DepartmentPage.tsx` is a correct route implementation sitting in the wrong folder. `FilterByType` has `aria-expanded` and `aria-haspopup` but no `role="listbox"`. The pattern is stopping at 80%, and the last 20% is where the thing actually works.

3. **`isProductionBuild` is the best single teaching moment.** Ask what problem it solved — the answer is "builds failed without credentials." Then point out `!contentfulClient` on the same line already handles that. The guard only activates when credentials _are_ present, which is precisely when you want the fetch. A workaround aimed at a real problem that ended up disabling the feature in exactly the environment that matters. I confirmed it fires by instrumenting a build, so it's demonstrable, not theoretical.

4. **The fabricated course catalogue needs to be framed as a judgement issue, not a code issue.** The code is fine — `buildDepartmentCourses` is clean, well-typed, readable. The problem is that its output is published as fact about a real institution. Good instinct (don't ship empty pages), wrong resolution. Worth drawing the line explicitly: placeholder data belongs in fixtures and dev, never rendered as institutional fact.

5. **The "10 schools" stat is a nice concrete illustration.** The page says 10; the grid below it renders 12 from the same file. Any visitor can count. It's a small bug that makes the general argument — derive from data, don't retype it — without needing abstraction.

6. **The privacy policy is the one with outside consequences.** `/privacy-policies` currently renders a mission statement and a marketing timeline. On a site collecting prospective-student interest, that's a compliance gap. Good place to talk about which pages carry obligations beyond looking finished.
