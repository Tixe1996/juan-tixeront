"use client";
import Link from "./transition-link";
import { useState } from "react";
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  Plane,
  BrainCircuit,
} from "lucide-react";

const directions = [
  {
    label: "Engineering & aerospace",
    Icon: Plane,
    title: "From a physical problem to an engineered solution.",
    text: "My foundation is aeronautical engineering: understanding systems, developing mechanical designs and testing assumptions through simulation. I enjoy connecting numerical analysis with practical design decisions.",
    detail: "PLD Space: mechanical design for MIURA 5, alongside technical selection, procurement and supplier coordination.",
    href: "/experience/pld-space/",
    link: "Explore my engineering experience",
    color: "blue",
  },
  {
    label: "Simulation & data",
    Icon: BrainCircuit,
    title: "Turn mathematical models into something you can inspect.",
    text: "From differential equations and image processing to computer vision and machine learning, I build experiments that make assumptions, outputs and limitations visible.",
    detail: "MA327 image experiments, the Push Quest movement detector and an academic lung cancer data-science study.",
    href: "/projects/image-diffusion-numerical-methods/",
    link: "Explore numerical methods",
    color: "green",
  },
  {
    label: "Business & finance",
    Icon: ChartNoAxesCombined,
    title: "Turning analysis into informed decisions.",
    text: "I also enjoy applying an engineer’s analytical discipline to financial decisions, technical sales and product strategy. Quantitative thinking is most useful when the reasoning is clear and the assumptions can be challenged.",
    detail:
      "Home Capital Studio: an interactive application comparing investing, property and long-term capital decisions.",
    href: "/projects/home-capital-studio/",
    link: "Explore the finance project",
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
            Engineering at the core.
            <br />
            <em>Curiosity beyond it.</em>
          </h2>
        </div>
        <p className="section-aside">
          Analytical thinking.
          <br />
          An international outlook.
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
