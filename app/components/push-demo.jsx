"use client";

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Upload,
  Play,
  Pause,
  Square,
  RotateCcw,
  ShieldCheck,
  FlipHorizontal2,
  Download,
} from "lucide-react";
import { asset } from "../lib/content";
import { PushCounter, measurePose, demoPose } from "../lib/push-counter.mjs";

function drawPose(canvas, points, simulation) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width,
    h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  if (simulation) {
    ctx.fillStyle = "#eef3f1";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#d7e1dc";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.fillStyle = "#dce7e1";
    ctx.fillRect(w * 0.1, h * 0.81, w * 0.8, 5);
  }
  if (!points) return;
  ctx.lineWidth = simulation ? 9 : 4;
  ctx.lineCap = "round";
  for (const [a, b] of [
    [11, 13],
    [13, 15],
    [11, 23],
    [23, 25],
    [25, 27],
    [12, 14],
    [14, 16],
    [12, 24],
    [24, 26],
    [26, 28],
    [11, 12],
    [23, 24],
  ]) {
    if (points[a]?.visibility < 0.6 || points[b]?.visibility < 0.6) continue;
    ctx.strokeStyle = a % 2 === 0 ? "#688fbb" : "#176348";
    ctx.beginPath();
    ctx.moveTo(points[a].x * w, points[a].y * h);
    ctx.lineTo(points[b].x * w, points[b].y * h);
    ctx.stroke();
  }
  for (const id of [11, 13, 15, 23, 25, 27]) {
    const p = points[id];
    if (!p || p.visibility < 0.6) continue;
    ctx.beginPath();
    ctx.arc(p.x * w, p.y * h, simulation ? 8 : 5, 0, Math.PI * 2);
    ctx.fillStyle = "#fafcfa";
    ctx.fill();
    ctx.strokeStyle = "#176348";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  if (simulation) {
    const p = points[0];
    ctx.beginPath();
    ctx.arc(p.x * w, p.y * h, 23, 0, Math.PI * 2);
    ctx.fillStyle = "#176348";
    ctx.fill();
  }
}

export default function PushDemo() {
  const video = useRef(null),
    canvas = useRef(null),
    fileInput = useRef(null);
  const engine = useRef(new PushCounter());
  const session = useRef({
    generation: 0,
    stream: null,
    worker: null,
    frame: 0,
    url: null,
    paused: false,
    mode: "idle",
    source: "demo",
    busy: false,
    rejectReady: null,
  });
  const [mode, setMode] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [mirrored, setMirrored] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(engine.current.snapshot());

  function cleanup() {
    const s = session.current;
    s.generation++;
    cancelAnimationFrame(s.frame);
    s.rejectReady?.(new Error("Session cancelled"));
    s.rejectReady = null;
    s.worker?.terminate();
    s.worker = null;
    s.stream?.getTracks().forEach((track) => track.stop());
    s.stream = null;
    if (video.current) {
      video.current.pause();
      video.current.srcObject = null;
      video.current.removeAttribute("src");
      video.current.load();
    }
    if (s.url) URL.revokeObjectURL(s.url);
    s.url = null;
    s.mode = "idle";
    s.busy = false;
    s.paused = false;
  }

  useEffect(() => {
    drawPose(canvas.current, demoPose(0), true);
    return cleanup;
  }, []);

  function finish(message) {
    cleanup();
    setMode("idle");
    setLoading(false);
    setPaused(false);
    engine.current.release();
    setResult(engine.current.snapshot(message || "Session ended"));
    drawPose(canvas.current, demoPose(0), true);
  }

  function process(points, timestamp, simulation, multiple = false) {
    drawPose(canvas.current, points, simulation);
    const measured = measurePose(
      points,
      canvas.current.width,
      canvas.current.height,
    );
    const next = engine.current.update(measured, timestamp);
    setResult(
      multiple ? { ...next, message: "More than one person in frame" } : next,
    );
  }

  function startDemo() {
    cleanup();
    engine.current.reset();
    setError("");
    setLoading(false);
    setPaused(false);
    const s = session.current,
      generation = s.generation;
    s.mode = "demo";
    s.source = "demo";
    setMode("demo");
    canvas.current.width = 960;
    canvas.current.height = 600;
    let elapsed = 0,
      previous = performance.now();
    const tick = (now) => {
      if (generation !== s.generation) return;
      if (!s.paused) {
        elapsed += Math.min(now - previous, 100);
        process(demoPose(elapsed), elapsed, true);
      }
      previous = now;
      s.frame = requestAnimationFrame(tick);
    };
    s.frame = requestAnimationFrame(tick);
  }

  async function start(source, file) {
    cleanup();
    engine.current.reset();
    setResult(engine.current.snapshot("Loading pose model"));
    setError("");
    setLoading(true);
    setPaused(false);
    setMode(source);
    const s = session.current,
      generation = s.generation;
    s.mode = source;
    s.source = source;
    let frameTimeout;
    try {
      if (source === "camera") {
        if (!navigator.mediaDevices?.getUserMedia)
          throw new Error(
            "Camera access is unavailable. Use HTTPS and a browser with camera support, or choose a video.",
          );
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 960 },
            height: { ideal: 600 },
            facingMode: "user",
          },
          audio: false,
        });
        if (generation !== s.generation) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        s.stream = stream;
        video.current.srcObject = stream;
        stream.getVideoTracks()[0].addEventListener("ended", () => {
          if (generation === s.generation) finish("Camera disconnected");
        });
      } else {
        if (!file) throw new Error("Choose a video file.");
        s.url = URL.createObjectURL(file);
        video.current.src = s.url;
      }
      const worker = new Worker(asset("/push-quest/pose-worker.js"));
      s.worker = worker;
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(
          () =>
            reject(
              new Error("The model took too long to load. Please try again."),
            ),
          45000,
        );
        const fail = (error) => {
          clearTimeout(timeout);
          reject(error);
        };
        s.rejectReady = fail;
        worker.onerror = () =>
          fail(
            new Error(
              "The pose model could not start. Try a recent Chrome, Edge or Safari browser.",
            ),
          );
        worker.onmessage = ({ data }) => {
          if (data.type === "ready") {
            clearTimeout(timeout);
            s.rejectReady = null;
            resolve();
          }
          if (data.type === "error") fail(new Error(data.message));
        };
        worker.postMessage({ type: "init" });
      });
      if (generation !== s.generation) return;
      worker.onerror = () => {
        if (generation === s.generation) {
          finish();
          setError(
            "Pose processing stopped unexpectedly. Please restart the session.",
          );
        }
      };
      worker.onmessage = ({ data }) => {
        clearTimeout(frameTimeout);
        s.busy = false;
        if (generation !== s.generation || s.paused) return;
        if (data.type === "error") {
          finish();
          setError(
            "The video could not be processed. Try another video or restart the camera.",
          );
          return;
        }
        if (data.type === "pose")
          process(data.landmarks, data.timestamp, false, data.multiple);
      };
      await video.current.play();
      if (generation !== s.generation) return;
      setLoading(false);
      let lastFrame = -1,
        lastSubmit = 0;
      const tick = async (now) => {
        if (generation !== s.generation) return;
        const v = video.current;
        if (source === "file" && v.ended) {
          finish("Video analysis complete");
          return;
        }
        if (
          !s.paused &&
          !s.busy &&
          v.readyState >= 2 &&
          v.currentTime !== lastFrame &&
          now - lastSubmit >= 66
        ) {
          s.busy = true;
          lastFrame = v.currentTime;
          lastSubmit = now;
          canvas.current.width = v.videoWidth;
          canvas.current.height = v.videoHeight;
          let bitmap;
          try {
            bitmap = await createImageBitmap(v);
            if (generation !== s.generation) {
              bitmap.close();
              return;
            }
            if (s.paused) {
              bitmap.close();
              s.busy = false;
            } else {
              worker.postMessage(
                {
                  type: "frame",
                  bitmap,
                  timestamp: source === "file" ? v.currentTime * 1000 : now,
                },
                [bitmap],
              );
              frameTimeout = setTimeout(() => {
                if (generation === s.generation) {
                  finish();
                  setError("Video processing timed out. Please restart.");
                }
              }, 15000);
            }
          } catch {
            bitmap?.close();
            if (generation === s.generation) {
              finish();
              setError("This browser could not read the video frames.");
            }
            return;
          }
        }
        s.frame = requestAnimationFrame(tick);
      };
      s.frame = requestAnimationFrame(tick);
    } catch (cause) {
      if (generation !== s.generation) return;
      finish();
      setError(
        cause.name === "NotAllowedError"
          ? "Camera permission was not granted. You can allow it in your browser or choose a local video instead."
          : cause.name === "NotFoundError"
            ? "No camera was found. You can still analyse a local video or play the demo sequence."
            : cause.name === "NotReadableError"
              ? "The camera is busy or unavailable. Close other camera apps and try again."
              : cause.message,
      );
    }
  }

  async function togglePause() {
    const s = session.current;
    s.paused = !s.paused;
    setPaused(s.paused);
    engine.current.release();
    if (mode === "file") {
      if (s.paused) video.current.pause();
      else
        try {
          await video.current.play();
        } catch {
          finish();
          setError("Playback could not resume. Please choose the video again.");
        }
    }
    setResult(
      engine.current.snapshot(
        s.paused ? "Paused" : "Reacquiring starting position",
      ),
    );
  }

  function download() {
    const data = {
      project: "Push Quest browser demo",
      source: session.current.source,
      simulated: session.current.source === "demo",
      completeCycles: result.count,
      interruptedCycles: result.interrupted,
      recordedAt: new Date().toISOString(),
      note: "Experimental movement count, not a form or medical assessment.",
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "push-quest-session.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const active = mode !== "idle";
  return (
    <section className="push-studio" aria-label="Push Quest movement studio">
      <div className="studio-top">
        <span>
          <span className="status-dot" />
          {loading
            ? "Preparing session"
            : mode === "demo"
              ? "Simulated sequence"
              : mode === "camera"
                ? "Live camera"
                : mode === "file"
                  ? "Local video"
                  : "Session ready"}
        </span>
        <span>
          <ShieldCheck size={15} />
          Processed on your device
        </span>
      </div>
      <div className="studio-layout">
        <div className="studio-camera">
          <div className={`camera-surface${mirrored ? " mirrored" : ""}`}>
            <video
              ref={video}
              muted
              playsInline
              aria-label="Local video feed"
              onError={() => {
                if (session.current.mode === "file") {
                  finish();
                  setError(
                    "This video format is not supported. Try an MP4 or WebM file.",
                  );
                }
              }}
              style={{
                visibility:
                  mode === "camera" || mode === "file" ? "visible" : "hidden",
              }}
            />
            <canvas
              ref={canvas}
              width={960}
              height={600}
              aria-label={
                mode === "demo" || mode === "idle"
                  ? "Simulated body landmarks"
                  : "Detected body landmarks"
              }
            />
          </div>
          <div className="camera-badge">
            {mode === "demo" || mode === "idle"
              ? "SIMULATED POSE"
              : "LOCAL PROCESSING"}
          </div>
          {loading && (
            <div className="camera-loading">
              <span className="loader" />
              {mode === "camera"
                ? "Preparing camera and pose model…"
                : "Preparing video and pose model…"}
            </div>
          )}
          <div className="camera-feedback" role="status">
            {result.message}
          </div>
        </div>
        <aside className="studio-stats">
          <p className="eyebrow">This session</p>
          <div className="rep-total">
            <strong>{String(result.count).padStart(2, "0")}</strong>
            <span>Complete cycles</span>
          </div>
          <dl>
            <div>
              <dt>Elbow angle</dt>
              <dd>
                {result.elbow == null ? "--" : `${Math.round(result.elbow)}°`}
              </dd>
            </div>
            <div>
              <dt>Interrupted / partial</dt>
              <dd>{result.interrupted}</dd>
            </div>
            <div>
              <dt>Phase</dt>
              <dd>
                {paused
                  ? "Paused"
                  : result.phase === "down"
                    ? "Lowering"
                    : result.phase === "ready"
                      ? "Ready"
                      : "Preparation"}
              </dd>
            </div>
          </dl>
          <div className="phase-meter" aria-hidden="true">
            <span
              style={{
                width: `${result.elbow == null ? 0 : Math.max(0, Math.min(100, ((180 - result.elbow) / 90) * 100))}%`,
              }}
            />
          </div>
          <p className="studio-limit">
            Experimental counter.
            <br />
            Not a form certification.
          </p>
        </aside>
      </div>
      <div className="studio-toolbar">
        {!active ? (
          <>
            <button className="button primary" onClick={() => start("camera")}>
              <Camera size={17} />
              Use camera
            </button>
            <button
              className="button secondary"
              onClick={() => fileInput.current.click()}
            >
              <Upload size={17} />
              Choose video
            </button>
            <button className="text-link" onClick={startDemo}>
              <Play size={17} />
              Play demo
            </button>
          </>
        ) : (
          <>
            <button
              className="button primary"
              disabled={loading}
              onClick={togglePause}
            >
              {paused ? <Play size={17} /> : <Pause size={17} />}
              {paused ? "Resume" : "Pause"}
            </button>
            <button className="button secondary" onClick={() => finish()}>
              <Square size={16} />
              End session
            </button>
            <button
              className="icon-button"
              title="Reset count"
              aria-label="Reset count"
              disabled={loading}
              onClick={() => {
                engine.current.reset();
                setResult(engine.current.snapshot());
              }}
            >
              <RotateCcw size={19} />
            </button>
          </>
        )}
        <div className="studio-tools">
          <button
            className="icon-button"
            aria-label="Mirror view"
            title="Mirror view"
            aria-pressed={mirrored}
            onClick={() => setMirrored(!mirrored)}
          >
            <FlipHorizontal2 size={19} />
          </button>
          <button
            className="icon-button"
            aria-label="Download session summary"
            title="Download session summary"
            disabled={!result.count && !result.interrupted}
            onClick={download}
          >
            <Download size={19} />
          </button>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="video/*"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) start("file", file);
          }}
        />
      </div>
      {error && (
        <p className="studio-error" role="alert">
          {error}
        </p>
      )}
      <p className="studio-privacy">
        Camera and video frames stay in this browser. No recording, upload or
        facial identification.
      </p>
    </section>
  );
}
