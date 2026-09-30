"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, CircleDot, List, Pause, Play, FileText } from "lucide-react";
import Link from "./transition-link";
import { asset } from "../lib/content";
import { ProjectResources, Tags } from "./shared";
import DialogShell from "./dialog-shell";
import useReducedMotion from "./use-reduced-motion";

function FloatingField({ items, stopped, onSelect }) {
  const field = useRef(null);
  const buttons = useRef([]);
  const stop = useRef(stopped);
  stop.current = stopped;

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    import("matter-js").then((module) => {
      if (disposed) return;
      const { Engine, Bodies, Body, Composite } = module.default || module;
      const element = field.current;
      const engine = Engine.create({ gravity: { x: 0, y: 0, scale: 0 } });
      let bodies = [];
      let width = 0;
      let height = 0;
      let diameter = 0;
      let frame = 0;
      let previous = 0;
      let visible = true;
      let pointer = null;
      let hovering = false;
      let focused = false;

      const paint = () => bodies.forEach((body, index) => {
        const button = buttons.current[index];
        if (button) button.style.transform = `translate3d(${body.position.x - diameter / 2}px, ${body.position.y - diameter / 2}px, 0)`;
      });
      const layout = () => {
        const nextWidth = element.clientWidth;
        if (Math.abs(nextWidth - width) < 1 || !nextWidth) return;
        width = nextWidth;
        const columns = Math.min(items.length, Math.max(2, Math.floor(width / 235)));
        diameter = Math.min(206, Math.floor(width / columns) - 22);
        const rows = Math.ceil(items.length / columns);
        height = rows * (diameter + 58) + 28;
        element.style.height = `${height}px`;
        element.style.setProperty("--bubble-size", `${diameter}px`);
        Composite.clear(engine.world, false);
        bodies = items.map((_, index) => {
          const row = Math.floor(index / columns);
          const count = Math.min(columns, items.length - row * columns);
          const x = (width / count) * (index % columns + 0.5);
          const y = row * (diameter + 58) + diameter / 2 + 35;
          const body = Bodies.circle(x, y, diameter / 2 + 3, { restitution: 1, friction: 0, frictionAir: 0, inertia: Infinity });
          Body.setVelocity(body, { x: (index % 2 ? -1 : 1) * 0.25, y: (index % 3 ? 1 : -1) * 0.17 });
          return body;
        });
        const wall = { isStatic: true, restitution: 1, friction: 0 };
        Composite.add(engine.world, [...bodies,
          Bodies.rectangle(width / 2, -25, width + 100, 50, wall),
          Bodies.rectangle(width / 2, height + 25, width + 100, 50, wall),
          Bodies.rectangle(-25, height / 2, 50, height + 100, wall),
          Bodies.rectangle(width + 25, height / 2, 50, height + 100, wall),
        ]);
        element.dataset.physics = "ready";
        paint();
      };
      const tick = (now) => {
        const delta = Math.min(1000 / 60, now - (previous || now));
        previous = now;
        const paused = stop.current || !visible || document.hidden || hovering || focused;
        element.dataset.moving = String(!paused);
        if (!paused) {
          bodies.forEach((body) => {
            if (pointer) {
              const dx = body.position.x - pointer.x;
              const dy = body.position.y - pointer.y;
              const distance = Math.hypot(dx, dy);
              if (distance > 1 && distance < diameter * 1.1) {
                const force = body.mass * 0.000003 * (1 - distance / (diameter * 1.1));
                Body.applyForce(body, body.position, { x: dx / distance * force, y: dy / distance * force });
              }
            }
            const speed = Math.hypot(body.velocity.x, body.velocity.y);
            if (speed > 0.65) Body.setVelocity(body, { x: body.velocity.x / speed * 0.65, y: body.velocity.y / speed * 0.65 });
          });
          Engine.update(engine, delta);
          paint();
        }
        frame = requestAnimationFrame(tick);
      };
      const move = (event) => {
        if (event.pointerType !== "mouse") return;
        const rect = element.getBoundingClientRect();
        pointer = { x: event.clientX - rect.x, y: event.clientY - rect.y };
        hovering = Boolean(event.target.closest("button"));
      };
      const leave = () => { pointer = null; hovering = false; };
      const focus = (event) => { focused = event.target.matches(":focus-visible"); };
      const blur = (event) => { focused = element.contains(event.relatedTarget) && event.relatedTarget.matches(":focus-visible"); };
      const resize = new ResizeObserver(layout);
      const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
      resize.observe(element);
      intersection.observe(element);
      element.addEventListener("pointermove", move);
      element.addEventListener("pointerleave", leave);
      element.addEventListener("focusin", focus);
      element.addEventListener("focusout", blur);
      layout();
      frame = requestAnimationFrame(tick);
      cleanup = () => {
        cancelAnimationFrame(frame);
        resize.disconnect();
        intersection.disconnect();
        element.removeEventListener("pointermove", move);
        element.removeEventListener("pointerleave", leave);
        element.removeEventListener("focusin", focus);
        element.removeEventListener("focusout", blur);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      };
    }).catch(() => { /* The static circle layout remains usable if the engine cannot load. */ });
    return () => { disposed = true; cleanup(); };
  }, [items]);

  return <div ref={field} className="constellation-field">
    {items.map((project, index) => <button key={project.slug} ref={(node) => { buttons.current[index] = node; }} type="button"
      className={`project-bubble bubble-${project.filter === "Finance" ? "mint" : project.filter === "Aerospace" ? "gold" : "blue"}`}
      aria-label={`Open ${project.title}`} aria-haspopup="dialog" onClick={(event) => onSelect(project, event.currentTarget)}>
      <img src={asset(project.image)} alt="" loading="lazy" width={300} height={200} />
      <span className="bubble-copy"><span className="bubble-category">{project.filter}</span><strong>{project.title}</strong><ArrowUpRight size={16} aria-hidden="true" /></span>
    </button>)}
  </div>;
}

export default function ProjectConstellation({ items }) {
  const reduced = useReducedMotion();
  const [view, setView] = useState(null);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState(null);
  const id = useId();
  const mode = view || (reduced ? "list" : "bubbles");
  const project = selected?.project;

  return <div className="constellation">
    <div className="constellation-toolbar">
      <span className="constellation-label">{items.length === 4 ? "Selected portfolio" : "Project explorer"}</span>
      <div className="constellation-controls">
        <div className="view-switch" role="group" aria-label="Project view">
          <button type="button" title="Floating projects" aria-label="Floating projects" aria-pressed={mode === "bubbles"} onClick={() => setView("bubbles")}><CircleDot size={17} /><span>Explore</span></button>
          <button type="button" title="Project list" aria-label="Project list" aria-pressed={mode === "list"} onClick={() => setView("list")}><List size={17} /><span>List</span></button>
        </div>
        {mode === "bubbles" && <button type="button" className="icon-button" title={paused || reduced ? "Resume project motion" : "Pause project motion"}
          aria-label={paused || reduced ? "Resume project motion" : "Pause project motion"} disabled={reduced} onClick={() => setPaused(!paused)}>{paused || reduced ? <Play size={17} /> : <Pause size={17} />}</button>}
      </div>
    </div>
    {mode === "bubbles" ? <FloatingField items={items} stopped={paused || reduced || Boolean(selected)} onSelect={(item, button) => setSelected({ project: item, origin: button.getBoundingClientRect().toJSON() })} />
      : <div className="constellation-list">{items.map((item, index) => <button type="button" key={item.slug} aria-haspopup="dialog" aria-label={`Open ${item.title}`} onClick={(event) => setSelected({ project: item, origin: event.currentTarget.getBoundingClientRect().toJSON() })}>
        <span className="list-index">{String(index + 1).padStart(2, "0")}</span><img src={asset(item.image)} alt="" width={120} height={80} loading="lazy" />
        <span className="list-project-copy"><small>{item.category}</small><strong>{item.title}</strong><span>{item.summary}</span></span><ArrowUpRight size={20} />
      </button>)}</div>}
    {project && <DialogShell titleId={id} origin={selected.origin} onClose={() => setSelected(null)} className="project-dialog">
      <div className="dialog-project-visual"><img src={asset(project.image)} alt={project.imageAlt} width={900} height={620} /></div>
      <div className="dialog-project-body">
        <p className="eyebrow">{project.category}</p><h2 id={id}>{project.title}</h2><p className="dialog-summary">{project.summary}</p><p className="dialog-type">{project.type}</p>
        <Tags items={project.tools} />
        {project.metrics && <div className="project-metrics">{project.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>}
        <section><h3>{project.question}</h3><p>{project.approach}</p></section>
        <ul className="dialog-points">{project.points.map((point) => <li key={point}>{point}</li>)}</ul>
        <section><h3>What I took from it</h3><p>{project.takeaway}</p></section>
        {project.note && <p className="dialog-note">{project.note}</p>}
        <div className="dialog-resources"><ProjectResources project={project} />
          {project.supportingPdf && <a className="text-link" href={asset(project.supportingPdf)} target="_blank" rel="noreferrer"><FileText size={16} />Manufacturing report</a>}
          <Link className="text-link" href={`/projects/${project.slug}/`}>Full project study <ArrowUpRight size={17} /></Link>
        </div>
      </div>
    </DialogShell>}
  </div>;
}
