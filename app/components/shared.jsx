import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download, ExternalLink } from "lucide-react";
import { asset } from "../lib/content";

export function PageIntro({ number, eyebrow, title, emphasis, children }) {
  return (
    <section className="page-intro wrap">
      <p className="eyebrow">
        <span className="section-number">{number}</span>
        {eyebrow}
      </p>
      <h1>
        {title}
        {emphasis && (
          <>
            <br />
            <em>{emphasis}</em>
          </>
        )}
      </h1>
      {children && <p className="page-lede">{children}</p>}
    </section>
  );
}
export function Tags({ items }) {
  return (
    <ul className="tags">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function ProjectCard({ project, index = 0 }) {
  return (
    <article
      className={`project-card tone-${project.filter === "Finance" ? "green" : project.filter === "Data & ML" ? "blue" : "neutral"}`}
    >
      <Link href={`/projects/${project.slug}/`} className="project-card-link">
        <div className="project-image">
          <img
            src={asset(project.image)}
            alt={project.imageAlt}
            loading="lazy"
            width={900}
            height={620}
          />
          <span className="project-open">
            <ArrowUpRight size={20} aria-hidden="true" />
          </span>
        </div>
        <div className="project-copy">
          <p className="project-category">
            <span>{project.category}</span>
            <span className="project-number">
              {String(index + 1).padStart(2, "0")}
            </span>
          </p>
          <h3>{project.title}</h3>
          <p className="project-summary">{project.summary}</p>
          <span className="project-more">
            View project <ArrowRight size={16} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}
export function ProjectResources({ project }) {
  return (
    <div className="button-row">
      {project.app && (
        <a
          className="button primary"
          href={asset(project.app)}
          target="_blank"
          rel="noreferrer"
        >
          Open application <ExternalLink size={17} />
        </a>
      )}
      {project.html && (
        <a
          className="button primary"
          href={asset(project.html)}
          target="_blank"
          rel="noreferrer"
        >
          Read full notebook <ExternalLink size={17} />
        </a>
      )}
      {project.pdf && (
        <a
          className={`button ${project.html ? "secondary" : "primary"}`}
          href={asset(project.pdf)}
          target="_blank"
          rel="noreferrer"
        >
          Read PDF report <ArrowUpRight size={17} />
        </a>
      )}
      {project.pdf && (
        <a
          className="icon-button download-report"
          href={asset(project.pdf)}
          download
          aria-label="Download PDF report"
          title="Download PDF report"
        >
          <Download size={19} />
        </a>
      )}
    </div>
  );
}
export function ContactBand() {
  return (
    <section className="contact-band">
      <div className="wrap contact-band-inner">
        <div>
          <p className="eyebrow">The next conversation</p>
          <h2>Let’s connect the dots.</h2>
          <p>Finance, aviation and client-facing opportunities.</p>
        </div>
        <Link className="button light" href="/contact/">
          Get in touch <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}
