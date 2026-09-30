"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, CalendarDays, Pause, Play } from "lucide-react";
import Link from "./transition-link";
import { asset } from "../lib/content";
import useReducedMotion from "./use-reduced-motion";

export default function VideoHero() {
  const video = useRef(null);
  const section = useRef(null);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [manual, setManual] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const media = video.current;
    let visible = true;
    const sync = () => {
      const allowed = manual || (!reduced && !navigator.connection?.saveData);
      if (allowed && !paused && visible && !document.hidden) {
        if (!media.getAttribute("src")) media.src = asset("/assets/video/aerobox-vtol.mp4");
        media.play().catch(() => setPlaying(false));
      } else media.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.05 });
    observer.observe(section.current);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); media.pause(); };
  }, [reduced, paused, manual]);

  return (
    <section ref={section} className={`cinematic-hero${playing ? " is-playing" : ""}`} aria-labelledby="hero-name">
      <video ref={video} className="hero-film" autoPlay loop muted playsInline preload="none"
        poster={asset("/assets/video/aerobox-vtol-poster.webp")} aria-hidden="true" tabIndex={-1}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setFailed(true); setPlaying(false); }} />
      <div className="film-overlay" />
      <div className="hero-film-copy wrap">
        <p className="eyebrow"><span className="status-dot" />Engineering · Analysis · Business</p>
        <h1 id="hero-name">Juan <em>Tixeront.</em></h1>
        <p className="hero-film-statement">Bridging engineering precision<br />with financial strategy.</p>
        <p className="hero-film-description">An analytical mind. An international outlook.<br />Technical insight for business and client relationships.</p>
        <div className="film-availability"><CalendarDays size={16} /><span><strong>January 2027</strong> · Six-month final-year internship</span></div>
        <div className="button-row">
          <Link className="button primary" href="/projects/">Explore my work <ArrowUpRight size={18} /></Link>
          <Link className="text-link" href="/experience/">View experience <ArrowUpRight size={17} /></Link>
        </div>
      </div>
      <div className="film-bottom wrap">
        <a href="#direction" className="text-link film-discover" aria-label="Explore professional direction"><ArrowDown size={17} />Discover</a>
        <span className="film-credit">AéroBox · Concept animation, not flight footage</span>
        <button type="button" className="icon-button film-control" title={playing ? "Pause background video" : "Play background video"}
          aria-label={playing ? "Pause background video" : "Play background video"} disabled={failed}
          onClick={() => { setManual(true); setPaused(playing); }}>
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>
      <div className="hero-ticker" aria-label="Analysis, strategy, data, engineering">
        <div className={`ticker-track${paused || reduced ? " is-paused" : ""}`} aria-hidden="true">
          {[0, 1].map((group) => <div className="ticker-group" key={group}>{[0, 1, 2].map((copy) => <span key={copy}>Analysis <i>·</i> Strategy <i>·</i> Data <i>·</i> Engineering <i>·</i></span>)}</div>)}
        </div>
      </div>
    </section>
  );
}
