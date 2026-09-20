import Link from "../components/transition-link";
import {
  ArrowUpRight,
  BrainCircuit,
  ChartNoAxesCombined,
  Code2,
  Globe2,
  Handshake,
  Plane,
  TrendingUp,
} from "lucide-react";
import { languages, skills } from "../lib/content";
import { ContactBand, PageIntro, Tags } from "../components/shared";
export const metadata = {
  title: "Expertise",
  description:
    "Engineering, data science, finance modelling and commercial skills, supported by projects and experience.",
};
const icons = {
  finance: TrendingUp,
  people: Handshake,
  plane: Plane,
  data: BrainCircuit,
  chart: ChartNoAxesCombined,
  code: Code2,
};
export default function Skills() {
  return (
    <>
      <PageIntro
        number="03"
        eyebrow="Expertise"
        title="Technical depth."
        emphasis="Commercial relevance."
      >
        A toolkit built through engineering studies, practical projects and
        international work, with examples of how I use each skill.
      </PageIntro>
      <section className="wrap skill-grid">
        {skills.map((group, index) => {
          const Icon = icons[group.icon];
          return (
            <article className="skill-group" key={group.title} data-reveal>
              <div className="skill-heading">
                <Icon size={26} aria-hidden="true" />
                <span>0{index + 1}</span>
              </div>
              <h2>{group.title}</h2>
              <p>{group.text}</p>
              <Tags items={group.items} />
              <Link className="text-link" href={group.href}>
                {group.link}
                <ArrowUpRight size={16} />
              </Link>
            </article>
          );
        })}
      </section>
      <section className="languages-section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <Globe2 size={16} />
                Languages
              </p>
              <h2>
                Comfortable <em>across cultures.</em>
              </h2>
            </div>
            <p className="section-aside">
              Franco-Spanish dual national.
              <br />
              An international outlook.
            </p>
          </div>
          <div className="languages-grid">
            {languages.map((language) => (
              <article key={language.code}>
                <span className="language-code">{language.code}</span>
                <h3>{language.name}</h3>
                <p>{language.level}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ContactBand />
    </>
  );
}
