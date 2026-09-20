"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  Plane,
  Handshake,
} from "lucide-react";

const directions = [
  {
    label: "Banking & finance",
    Icon: ChartNoAxesCombined,
    title: "A quantitative foundation. A people-facing ambition.",
    text: "I’m interested in front-office roles where analytical rigour supports clear financial conversations, particularly in corporate finance and financial markets. My starting point: engineering, Python and scenario modelling.",
    detail:
      "Home Capital Studio: an interactive application comparing investing, property and long-term capital decisions.",
    href: "/projects/home-capital-studio/",
    link: "Explore the finance project",
    color: "green",
  },
  {
    label: "Aviation & aerospace",
    Icon: Plane,
    title: "Technical understanding that informs commercial decisions.",
    text: "I want to bring an engineer’s understanding of products and systems into aviation business development, technical sales and customer-facing teams.",
    detail:
      "PLD Space: mechanical design for MIURA 5, alongside procurement, technical selection and supplier coordination.",
    href: "/experience/",
    link: "Explore my experience",
    color: "blue",
  },
  {
    label: "Sales & relationships",
    Icon: Handshake,
    title: "Listen carefully. Understand the detail. Build the relationship.",
    text: "I’m drawn to commercial roles where product knowledge and genuine attention to people belong together. I bring customer-facing experience, international teamwork and a technical foundation.",
    detail:
      "Customer service in Amsterdam, aerospace event coordination in Ibiza, and supplier dialogue in Alicante.",
    href: "/experience/",
    link: "See the experience behind it",
    color: "coral",
  },
];
export default function FocusSelector() {
  const [selected, setSelected] = useState(0);
  const direction = directions[selected];
  function handleKeys(event, index) {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % directions.length;
    if (event.key === "ArrowLeft")
      next = (index + directions.length - 1) % directions.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = directions.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      setSelected(next);
      document.getElementById(`focus-tab-${next}`)?.focus();
    }
  }
  return (
    <section className="focus-section wrap" data-reveal>
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <span className="section-number">01</span>Professional direction
          </p>
          <h2>
            Where I want to make
            <br />
            <em>a difference.</em>
          </h2>
        </div>
        <p className="section-aside">
          Three directions.
          <br />
          One solid engineering foundation.
        </p>
      </div>
      <div
        className="focus-tabs"
        role="tablist"
        aria-label="Professional direction"
      >
        {directions.map(({ label, Icon }, index) => (
          <button
            type="button"
            key={label}
            id={`focus-tab-${index}`}
            role="tab"
            aria-selected={selected === index}
            aria-controls="focus-panel"
            tabIndex={selected === index ? 0 : -1}
            onKeyDown={(event) => handleKeys(event, index)}
            onClick={() => setSelected(index)}
          >
            <Icon size={20} aria-hidden="true" />
            {label}
            <span>0{index + 1}</span>
          </button>
        ))}
      </div>
      <div
        id="focus-panel"
        role="tabpanel"
        aria-labelledby={`focus-tab-${selected}`}
        tabIndex={0}
        className={`focus-panel accent-${direction.color}`}
      >
        <div key={selected} className="focus-panel-copy">
          <h3>{direction.title}</h3>
          <p>{direction.text}</p>
        </div>
        <div className="focus-evidence">
          <p className="eyebrow">In practice</p>
          <p>{direction.detail}</p>
          <Link className="text-link" href={direction.href}>
            {direction.link}
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
