"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Image as ImageIcon, Activity, Play, Pause, RotateCcw, Terminal } from "lucide-react";
import Link from "./transition-link";
import { asset } from "../lib/content";
import useReducedMotion from "./use-reduced-motion";

const presets = [
  { id: "image", name: "Image study", icon: ImageIcon, title: "Images through equations", image: "/assets/projects/image-math/seascape-exp.jpg", alt: "Saved MA327 anisotropic diffusion result of a seascape painting", project: "image-diffusion-numerical-methods", caption: "MA327 / Archived diffusion output", formula: "du/dt = div(c · grad(u))", note: "Saved Python study output. Playback restores display colour; it does not run the original equations." },
  { id: "medical", name: "Medical data", icon: Activity, title: "A closer look at the data", image: "/assets/projects/cancer-ct.png", alt: "CT nodule figures from the original academic lung cancer study", project: "lung-cancer-data-science", caption: "Data science / Archived CT figure", formula: "z = (x - mean) / std", note: "Archived academic figure. Visual simulation only: no live model, patient assessment or diagnostic output." },
];
const logs = [
  [0, "Initialising local visual preview..."],
  [650, "Archived project image loaded."],
  [1350, "Drawing illustrative overlays..."],
  [2200, "Restoring display colour..."],
  [3250, "Preparing source reference..."],
  [4000, "Complete. No model inference performed."],
];

export default function LiveLab() {
  const reduced = useReducedMotion();
  const [preset, setPreset] = useState(presets[0]);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const elapsedRef = useRef(0);
  const imageRef = useRef(null);
  const progress = elapsed / 4000;

  useEffect(() => {
    const picture = imageRef.current;
    if (picture?.complete && picture.naturalWidth) setLoaded(true);
  }, [preset]);

  useEffect(() => {
    if (!running) return;
    if (reduced) { elapsedRef.current = 4000; setElapsed(4000); setRunning(false); return; }
    let frame;
    let previous = 0;
    const tick = (now) => {
      const delta = previous ? Math.min(now - previous, 50) : 0;
      previous = now;
      if (!document.hidden) elapsedRef.current = Math.min(4000, elapsedRef.current + delta);
      setElapsed(elapsedRef.current);
      if (elapsedRef.current < 4000) frame = requestAnimationFrame(tick);
      else setRunning(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, reduced, preset]);

  function run() {
    if (elapsedRef.current >= 4000) { elapsedRef.current = 0; setElapsed(0); }
    setStarted(true);
    setRunning(true);
  }
  function choose(next) {
    if (next.id === preset.id) return;
    setRunning(false); setStarted(false); setLoaded(false); setFailed(false);
    elapsedRef.current = 0; setElapsed(0); setPreset(next);
  }

  return <section className="live-lab-section" id="live-lab">
    <div className="wrap">
      <div className="section-heading"><div><p className="eyebrow"><span className="section-number">03</span>At the intersection</p><h2>Live <em>Lab.</em></h2></div><span className="lab-disclosure">Local visual simulation</span></div>
      <div className="lab-toolbar"><div className="study-segments" role="group" aria-label="Lab dataset">{presets.map((item) => <button type="button" key={item.id} aria-pressed={preset.id === item.id} onClick={() => choose(item)}><item.icon size={16} />{item.name}</button>)}</div><span className="lab-session">SESSION / {preset.id === "image" ? "MA327" : "DATA SCIENCE"}</span></div>
      <div className={`lab-workspace${running ? " is-running" : ""}`}>
        <div className="lab-visual">
          <img key={preset.id} ref={imageRef} src={asset(preset.image)} alt={preset.alt} width={900} height={620} loading="lazy"
            style={{ filter: `grayscale(${1 - progress})` }} onLoad={() => setLoaded(true)} onError={() => { setFailed(true); setRunning(false); }} />
          <span className="lab-image-label">{preset.caption}</span>
          {failed && <p className="lab-image-error" role="alert">The reference image could not be loaded.</p>}
          <div className="lab-hud" aria-hidden="true" style={{ opacity: started ? Math.min(1, progress * 4) : 0 }}>
            <span className="hud-formula" style={{ transform: `translateY(${-progress * 12}px)` }}>{preset.formula}</span>
            <div className="hud-chart"><span>Illustrative series / not market data</span><div>{[28, 40, 34, 53, 46, 67, 58, 83, 73, 92].map((value, index) => <i key={index} style={{ height: `${value}%`, transform: `scaleY(${Math.min(1, progress * 1.5)})` }} />)}</div></div>
          </div>
        </div>
        <div className="lab-terminal">
          <div className="terminal-heading"><span><Terminal size={16} />preview.local</span><span className="terminal-badge">SIMULATION</span></div>
          <div className="terminal-body"><p className="terminal-comment">// {preset.title}</p><p className="terminal-command">$ preview --source archived --local</p>
            <div className="terminal-logs" aria-hidden="true">{started ? logs.filter(([time]) => elapsed >= time).map(([time, message]) => <p key={time}><span>{(time / 1000).toFixed(2)}s</span>{elapsed >= 4000 || reduced ? message : message.slice(0, Math.floor((elapsed - time) / 11))}</p>) : <p className="terminal-idle">Ready. No external model connected.</p>}</div>
          </div>
          <div className="lab-playback"><div><span aria-live="polite">{failed ? "Image unavailable" : !loaded ? "Loading image" : running ? "Preview running" : elapsed >= 4000 ? "Preview complete" : started ? "Paused" : "Ready"}</span><span>{Math.round(progress * 100)}%</span></div><progress max={4000} value={elapsed} aria-label="Visual playback progress" /></div>
          <div className="lab-actions"><button type="button" className="button primary" disabled={!loaded || failed} onClick={() => running ? setRunning(false) : run()}>{running ? <Pause size={17} /> : <Play size={17} />}{running ? "Pause" : started && elapsed < 4000 ? "Resume" : "Run preview"}</button><button className="icon-button" type="button" title="Reset preview" aria-label="Reset preview" onClick={() => { setRunning(false); setStarted(false); elapsedRef.current = 0; setElapsed(0); }}><RotateCcw size={17} /></button></div>
        </div>
      </div>
      <div className="lab-footer"><p>{preset.note}</p><Link className="text-link" href={`/projects/${preset.project}/`}>Read the study <ArrowUpRight size={17} /></Link></div>
    </div>
  </section>;
}
