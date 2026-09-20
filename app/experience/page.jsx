import {
  ArrowUpRight,
  BookOpen,
  ChefHat,
  Globe2,
  Rocket,
  Trophy,
  TrendingUp,
  BrainCircuit,
  MapPin,
} from "lucide-react";
import { asset, education, experiences, profile } from "../lib/content";
import { ContactBand, PageIntro, Tags } from "../components/shared";

export const metadata = {
  title: "Experience",
  description:
    "From mechanical design and procurement at PLD Space to data, operations and international customer service.",
};
export default function Experience() {
  return (
    <>
      <PageIntro
        number="01"
        eyebrow="Experience & education"
        title="An engineer’s rigour."
        emphasis="A wider perspective."
      >
        From launcher components and supplier coordination to customer service.
        Each experience adds a different way of understanding people, products
        and decisions.
      </PageIntro>
      <section className="experience-layout wrap">
        <aside className="experience-aside">
          <p className="eyebrow">Professional journey</p>
          <p>
            Technical depth.
            <br />
            Human connection.
            <br />
            International experience.
          </p>
          <a
            className="text-link"
            href={asset(profile.cv)}
            target="_blank"
            rel="noreferrer"
          >
            View résumé <ArrowUpRight size={17} />
          </a>
        </aside>
        <div className="timeline">
          {experiences.map((item, index) => (
            <article
              className="experience-entry"
              key={item.company}
              data-reveal
            >
              <div className="experience-top">
                <span className="entry-index">0{index + 1}</span>
                <span>{item.date}</span>
                {item.current && (
                  <span className="current-label">
                    <span className="status-dot" />
                    Current
                  </span>
                )}
              </div>
              <h2>{item.company}</h2>
              <h3>{item.role}</h3>
              <p className="location">
                <MapPin size={14} />
                {item.location}
              </p>
              <p className="entry-summary">{item.summary}</p>
              <ul className="bullet-list">
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="relevance">
                <span>Commercial perspective</span>
                <p>{item.relevance}</p>
              </div>
              <Tags items={item.tags} />
            </article>
          ))}
        </div>
      </section>
      <section className="education-section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <BookOpen size={16} />
                Education
              </p>
              <h2>
                A foundation <em>in engineering.</em>
              </h2>
            </div>
          </div>
          <div className="education-list">
            {education.map((item) => (
              <article key={item.school} data-reveal>
                <span className="education-date">{item.date}</span>
                <div>
                  <h3>{item.school}</h3>
                  <p className="qualification">{item.qualification}</p>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="interests-section wrap" id="interests" data-reveal>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Beyond the work</p>
            <h2>
              Always <em>curious.</em>
            </h2>
          </div>
        </div>
        <div className="interests-grid">
          {[
            [
              TrendingUp,
              "Finance & markets",
              "Researching markets and building tools to understand capital, risk and long-term decisions.",
            ],
            [
              Rocket,
              "Aeronautics & space",
              "The systems, missions and precision behind flight and space exploration.",
            ],
            [
              BrainCircuit,
              "Machine learning",
              "Finding practical uses for data, from medical imaging to operational priorities.",
            ],
            [
              Globe2,
              "Travel & cultures",
              "A Franco-Spanish background and experiences in Madrid, Toulouse, Amsterdam, Alicante and Ibiza.",
            ],
            [
              Trophy,
              "Tennis & football",
              "Competition, team reflexes and keeping a clear head under pressure.",
            ],
            [
              ChefHat,
              "Cooking",
              "Craft, timing and the satisfaction of making something well.",
            ],
          ].map(([Icon, title, text]) => (
            <article key={title}>
              <Icon size={22} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <ContactBand />
    </>
  );
}
