import Link from "./components/transition-link";
import {
  ArrowUpRight,
  Download,
} from "lucide-react";
import { asset, profile, projects } from "./lib/content";
import { ContactBand } from "./components/shared";
import FocusSelector from "./components/focus-selector";
import VideoHero from "./components/video-hero";
import ProjectConstellation from "./components/project-constellation";
import LiveLab from "./components/live-lab";

const featuredProjects = ["aerobox", "image-diffusion-numerical-methods", "push-quest", "home-capital-studio"].map((slug) => projects.find((project) => project.slug === slug));

export default function Home() {
  return (
    <>
      <VideoHero />
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
              Selected <em>projects.</em>
            </h2>
          </div>
          <Link className="text-link" href="/projects/">
            All {projects.length} projects <ArrowUpRight size={18} />
          </Link>
        </div>
        <ProjectConstellation items={featuredProjects} />
      </section>
      <LiveLab />
      <section className="next-step wrap" data-reveal>
        <p className="eyebrow">Looking ahead</p>
        <div>
          <h2>
            Engineering depth.
            <br />
            An open perspective.
          </h2>
          <p>
            I am looking for an international team where I can contribute through
            engineering, simulation and data analysis. I am particularly drawn to
            aerospace and technical product development, while remaining curious
            about finance, business decisions and customer-facing work.
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
