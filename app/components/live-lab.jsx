"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Aperture, Thermometer, Waves, Play, Pause, RotateCcw, Terminal, Eye, Download } from "lucide-react";
import Link from "./transition-link";
import { asset } from "../lib/content";
import { labModels, labSamples } from "../lib/image-lab-config";
import useReducedMotion from "./use-reduced-motion";

const icons = { saturation: Aperture, heat: Thermometer, schrodinger: Waves };
const DURATION = 6000;
const GRID = 256;

export default function LiveLab() {
  const reduced = useReducedMotion();
  const [sample, setSample] = useState(labSamples[0]);
  const [model, setModel] = useState(labModels[0]);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("loading");
  const [original, setOriginal] = useState(false);
  const [retry, setRetry] = useState(0);
  const [metrics, setMetrics] = useState(null);
  const canvas = useRef(null);
  const runtime = useRef({ worker: null, ready: false, busy: false, revision: 0, desired: 0, mode: "saturation", last: "" });
  const progressRef = useRef(0);

  const requestFrame = useCallback(() => {
    const state = runtime.current;
    const key = [state.revision, state.mode, state.desired].join(":");
    if (!state.ready || state.busy || state.last === key) return;
    state.busy = true;
    state.last = key;
    state.worker.postMessage({ type: "render", revision: state.revision, mode: state.mode, progress: state.desired });
  }, []);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("lab");
    const selected = labSamples.find((item) => item.id === requested);
    if (selected) setSample(selected);
  }, []);

  useEffect(() => {
    let active = true;
    let worker;
    const image = new window.Image();
    const state = runtime.current;
    state.ready = false;
    state.busy = false;
    state.last = "";
    state.desired = 0;
    state.revision++;
    progressRef.current = 0;
    setProgress(0);
    setRunning(false);
    setMetrics(null);
    setOriginal(false);
    setStatus("loading");

    const fail = () => {
      if (!active) return;
      state.ready = false;
      state.busy = false;
      setStatus("error");
      setRunning(false);
    };

    image.onload = () => {
      if (!active) return;
      try {
        const buffer = document.createElement("canvas");
        buffer.width = GRID;
        buffer.height = GRID;
        const context = buffer.getContext("2d", { willReadFrequently: true });
        context.drawImage(image, 0, 0, GRID, GRID);
        const pixels = context.getImageData(0, 0, GRID, GRID).data;
        const output = canvas.current;
        output.width = GRID;
        output.height = Math.max(1, Math.round(GRID * image.naturalHeight / image.naturalWidth));
        worker = new Worker(new URL("../lib/image-lab.worker.js", import.meta.url), { type: "module" });
        state.worker = worker;
        worker.onerror = fail;
        worker.onmessage = ({ data }) => {
          if (!active) return;
          if (data.type === "error") { fail(); return; }
          if (data.type === "ready") {
            state.ready = true;
            requestFrame();
            return;
          }
          if (data.type === "frame") {
            state.busy = false;
            if (data.revision === state.revision) {
              context.putImageData(new ImageData(data.pixels, GRID, GRID), 0, 0);
              output.getContext("2d").drawImage(buffer, 0, 0, output.width, output.height);
              output.dataset.sample = sample.id;
              output.dataset.model = data.mode;
              output.dataset.progress = String(data.progress);
              progressRef.current = data.progress;
              setProgress(data.progress);
              setMetrics({ time: data.time, drift: data.drift, steps: data.steps });
              setStatus("ready");
              if (data.progress >= 1) setRunning(false);
            }
            requestFrame();
          }
        };
        worker.postMessage({ type: "init", pixels, size: GRID }, [pixels.buffer]);
      } catch { fail(); }
    };
    image.onerror = fail;
    image.src = asset("/assets/projects/image-math/" + sample.file);

    return () => {
      active = false;
      image.onload = null;
      image.onerror = null;
      worker?.terminate();
      state.ready = false;
      state.worker = null;
    };
  }, [sample, retry, requestFrame]);

  useEffect(() => {
    if (!running || status !== "ready") return;
    const state = runtime.current;
    if (reduced) {
      state.desired = 1;
      requestFrame();
      return;
    }
    let frame;
    let previous = 0;
    let elapsed = progressRef.current * DURATION;
    const tick = (now) => {
      if (previous && !document.hidden) elapsed += Math.min(now - previous, 80);
      previous = now;
      state.desired = Math.min(1, elapsed / DURATION);
      requestFrame();
      if (state.desired < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, reduced, status, requestFrame]);

  function seek(value) {
    const state = runtime.current;
    setRunning(false);
    state.revision++;
    state.desired = value;
    progressRef.current = value;
    setProgress(value);
    requestFrame();
  }

  function chooseModel(next) {
    runtime.current.mode = next.id;
    setModel(next);
    setMetrics(null);
    if (runtime.current.ready) setStatus("loading");
    setOriginal(false);
    seek(0);
  }

  function play() {
    if (running) { seek(progressRef.current); return; }
    if (progressRef.current >= 1) seek(0);
    setOriginal(false);
    setRunning(true);
  }

  function download() {
    canvas.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = sample.id + "-" + model.id + ".png";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  }

  return <section className="live-lab-section numerical-lab" id="live-lab">
    <div className="wrap">
      <div className="section-heading">
        <div><p className="eyebrow"><span className="section-number">03</span>Numerical experiments</p><h2>Live <em>Lab.</em></h2></div>
        <span className="lab-disclosure">Computed locally · MA327-inspired</span>
      </div>
      <div className="lab-toolbar">
        <label className="lab-sample">Input image<select aria-label="Lab input image" value={sample.id} onChange={(event) => setSample(labSamples.find((item) => item.id === event.target.value))}>
          {labSamples.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select></label>
        <div className="study-segments lab-models" role="group" aria-label="Equation model">
          {labModels.map((item) => { const Icon = icons[item.id]; return <button type="button" key={item.id} aria-pressed={model.id === item.id} onClick={() => chooseModel(item)}><Icon size={16} />{item.name}</button>; })}
        </div>
      </div>
      <div className="lab-workspace">
        <div className="lab-visual">
          <img key={sample.id + retry} className="lab-input-photo" src={asset("/assets/projects/image-math/" + sample.file)} alt={sample.alt} width={640} height={426} aria-hidden={!original && status === "ready"} style={{ opacity: original || status !== "ready" ? 1 : 0 }} />
          <canvas ref={canvas} className="lab-output" role="img" aria-label={model.name + " applied to " + sample.name} aria-hidden={original || status !== "ready"} style={{ opacity: original || status !== "ready" ? 0 : 1 }} />
          <span className="lab-image-label">{sample.name} / {original ? "Original photograph or study input" : model.name}</span>
          <div className="lab-visual-tools">
            <button className="icon-button" type="button" aria-label="Show original image" title="Original image" aria-pressed={original} onClick={() => setOriginal(!original)}><Eye size={17} /></button>
            <button className="icon-button" type="button" aria-label="Download processed image" title="Download processed image" disabled={status !== "ready"} onClick={download}><Download size={17} /></button>
          </div>
          {status === "loading" && <span className="lab-load-state" role="status">Preparing numerical grid…</span>}
          {status === "error" && <div className="lab-image-error" role="alert"><p>The image or numerical engine could not load.</p><button type="button" className="text-link" onClick={() => setRetry(retry + 1)}><RotateCcw size={16} />Retry</button></div>}
        </div>
        <div className="lab-terminal">
          <div className="terminal-heading"><span><Terminal size={16} />numerics.local</span><span className="terminal-badge">LIVE COMPUTATION</span></div>
          <div className="terminal-body">
            <p className="terminal-comment">// {model.title}</p>
            <p className="lab-equation">{model.formula}</p>
            <pre className="lab-code"><code>{model.code}</code></pre>
            <dl className="lab-readouts">
              <div><dt>Grid</dt><dd>256 × 256</dd></div>
              <div><dt>{model.id === "saturation" ? "Saturation" : "Model time"}</dt><dd>{model.id === "saturation" ? (progress * 1.5).toFixed(2) : (metrics?.time || 0).toFixed(2)}</dd></div>
              <div><dt>{model.id === "saturation" ? "Space" : "Boundary"}</dt><dd>{model.id === "saturation" ? "Display RGB" : "Periodic"}</dd></div>
              <div><dt>{model.id === "schrodinger" ? "L² norm drift" : "Method"}</dt><dd>{model.id === "schrodinger" ? (metrics?.drift || 0).toExponential(1) : model.id === "heat" ? "Fourier" : "Interpolation"}</dd></div>
            </dl>
          </div>
          <div className="lab-playback">
            <div><span aria-live="polite">{status === "error" ? "Unavailable" : status === "loading" ? "Preparing" : running ? "Computing" : progress >= 1 ? "Complete" : progress > 0 ? "Paused" : "Ready"}</span><span>{Math.round(progress * 100)}%</span></div>
            <input type="range" min="0" max="100" step="1" value={Math.round(progress * 100)} disabled={status !== "ready"} aria-label="Experiment progress" onChange={(event) => seek(Number(event.target.value) / 100)} />
          </div>
          <div className="lab-actions">
            <button type="button" className="button primary" disabled={status !== "ready"} onClick={play}>{running ? <Pause size={17} /> : <Play size={17} />}{running ? "Pause" : progress > 0 && progress < 1 ? "Resume" : "Run experiment"}</button>
            <button className="icon-button" type="button" aria-label="Reset experiment" title="Reset experiment" disabled={status !== "ready"} onClick={() => { setOriginal(false); seek(0); }}><RotateCcw size={17} /></button>
          </div>
        </div>
      </div>
      <div className="lab-footer"><p>{model.note}</p><Link className="text-link" href="/projects/image-diffusion-numerical-methods/">Explore the original study <ArrowUpRight size={17} /></Link></div>
    </div>
  </section>;
}
