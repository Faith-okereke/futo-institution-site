import { Microscope } from "lucide-react";
import { researchAreas } from "../data/site";

export default function ResearchPage() {
  return (
    <div className="bg-[var(--surface)]">
      <section className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-16">
          <p className="eyebrow">Research</p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold leading-tight">
            Applied research shaped by laboratories, communities, and industry.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
            FUTO research groups work across energy, agriculture, automation,
            materials, health technology, and environmental resilience.
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-3 lg:px-16">
        {researchAreas.map((area) => (
          <article className="metric-card" key={area}>
            <Microscope className="text-[var(--green)]" />
            <h2>{area}</h2>
            <p className="mt-4 leading-7 text-[var(--muted)]">
              Interdisciplinary projects support student training, faculty
              publication, prototype development, and public problem-solving.
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
