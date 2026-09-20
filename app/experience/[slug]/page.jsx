import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  CalendarDays,
  Check,
} from "lucide-react";
import Link from "../../components/transition-link";
import { ContactBand, Tags } from "../../components/shared";
import { experiences, asset, profile } from "../../lib/content";

export const dynamicParams = false;
export function generateStaticParams() {
  return experiences.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = experiences.find((item) => item.slug === slug);
  return { title: item?.company || "Experience", description: item?.summary };
}

export default async function ExperienceDetail({ params }) {
  const { slug } = await params;
  const index = experiences.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();
  const item = experiences[index];
  const next = experiences[(index + 1) % experiences.length];
  return (
    <>
      <article className="experience-detail wrap">
        <Link className="back-link" href="/experience/">
          <ArrowLeft size={16} />
          All experience
        </Link>
        <header className="experience-detail-heading">
          <p className="eyebrow">
            Professional experience · {String(index + 1).padStart(2, "0")}
          </p>
          <h1 style={{ viewTransitionName: `experience-${item.slug}` }}>
            {item.company}
          </h1>
          <p className="experience-role">{item.role}</p>
          <div className="experience-facts">
            <span>
              <CalendarDays size={16} />
              {item.date}
            </span>
            <span>
              <MapPin size={16} />
              {item.location}
            </span>
          </div>
        </header>
        <div className="experience-detail-body">
          <aside>
            <p className="eyebrow">Skills in practice</p>
            <Tags items={item.tags} />
            <a
              className="text-link"
              href={asset(profile.cv)}
              target="_blank"
              rel="noreferrer"
            >
              View résumé <ArrowRight size={16} />
            </a>
          </aside>
          <div className="project-narrative">
            <section data-reveal>
              <p className="eyebrow">The role</p>
              <h2>{item.summary}</h2>
            </section>
            <section data-reveal>
              <p className="eyebrow">My contribution</p>
              <ul className="project-points">
                {item.points.map((point) => (
                  <li key={point}>
                    <Check size={18} />
                    {point}
                  </li>
                ))}
              </ul>
            </section>
            <section className="contribution-band" data-reveal>
              <p className="eyebrow">Key deliverable</p>
              <p>{item.output}</p>
            </section>
            <section data-reveal>
              <p className="eyebrow">What I learned</p>
              <p>{item.perspective}</p>
            </section>
            <section data-reveal>
              <p className="eyebrow">Business relevance</p>
              <p>{item.relevance}</p>
            </section>
          </div>
        </div>
        <Link className="next-project" href={`/experience/${next.slug}/`}>
          <div>
            <span className="eyebrow">Next experience</span>
            <h2>{next.company}</h2>
          </div>
          <ArrowRight size={28} />
        </Link>
      </article>
      <ContactBand />
    </>
  );
}
