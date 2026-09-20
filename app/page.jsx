import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Download,
  Globe2,
} from "lucide-react";
import { asset, profile, projects } from "./lib/content";
import { ContactBand, ProjectCard } from "./components/shared";
import FocusSelector from "./components/focus-selector";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-inner wrap">
          <img
            className="hero-portrait"
            src={asset("/assets/juan-tixeront-portrait.webp")}
            alt="Juan Tixeront, wearing his PLD Space T-shirt"
            width={1536}
            height={1024}
            fetchPriority="high"
          />
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">
              <span className="status-dot" />
              Engineering background. Commercial ambition.
            </p>
            <h1>
              Juan
              <br />
              <em>
                Tixeront<span>.</span>
              </em>
            </h1>
            <p className="hero-tagline">
              Analytical by training.
              <br />
              People-focused by nature.
            </p>
            <p className="hero-lede">
              Franco-Spanish aeronautical engineering student, building a path
              into finance, aviation and client-facing business.
            </p>
            <div className="button-row">
              <Link className="button primary" href="/experience/">
                Meet my experience <ArrowUpRight size={18} />
              </Link>
              <Link className="text-link" href="/projects/">
                Explore my work <ArrowRight size={17} />
              </Link>
            </div>
            <div className="hero-location">
              <Globe2 size={15} aria-hidden="true" />
              <span>Franco-Spanish · International outlook</span>
            </div>
          </div>
          <div className="portrait-caption">
            <span className="caption-rule" />
            <div>
              <strong>Currently at PLD Space</strong>
              <span>Mechanical engineering · MIURA 5</span>
            </div>
          </div>
          <a
            className="hero-scroll"
            href="#direction"
            aria-label="Explore professional direction"
          >
            <ArrowDown size={17} />
            <span>Discover more</span>
          </a>
        </div>
      </section>
      <div className="credentials-band" id="direction">
        <div className="wrap credentials-inner">
          <p>
            A foundation
            <br />
            <strong>built in practice.</strong>
          </p>
          <span>
            PLD <b>SPACE</b>
            <small>Engineering & procurement</small>
          </span>
          <span>
            FUJIFILM <b>Sonosite</b>
            <small>Technical support & data</small>
          </span>
          <span className="ipsa-wordmark">
            IPSA<small>Aeronautical engineering</small>
          </span>
          <span className="language-credential">
            ES / FR / EN / IT<small>Languages & perspective</small>
          </span>
        </div>
      </div>
      <FocusSelector />
      <section className="selected-section wrap" data-reveal>
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span className="section-number">02</span>Selected work
            </p>
            <h2>
              Ideas, put <em>into practice.</em>
            </h2>
          </div>
          <Link className="text-link" href="/projects/">
            All {projects.length} projects <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="project-grid">
          {projects.slice(0, 3).map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </section>
      <section className="next-step wrap" data-reveal>
        <p className="eyebrow">Looking ahead</p>
        <div>
          <h2>
            The next chapter starts
            <br />
            with a conversation.
          </h2>
          <p>
            Seeking a six-month final-year internship from January 2027, with a
            particular interest in front-office banking, aviation and commercial
            roles.
          </p>
        </div>
        <a
          className="text-link"
          href={asset(profile.cv)}
          target="_blank"
          rel="noreferrer"
        >
          View résumé <Download size={17} />
        </a>
      </section>
      <ContactBand />
    </>
  );
}
