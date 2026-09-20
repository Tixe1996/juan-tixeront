export function angle(a, b, c) {
  const u = [a.x - b.x, a.y - b.y];
  const v = [c.x - b.x, c.y - b.y];
  const length = Math.hypot(...u) * Math.hypot(...v);
  return length < 0.00001
    ? null
    : (Math.acos(
        Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / length)),
      ) *
        180) /
        Math.PI;
}

export function measurePose(landmarks, width, height) {
  if (!landmarks?.length) return null;
  const sides = [
    [11, 13, 15, 23, 25, 27],
    [12, 14, 16, 24, 26, 28],
  ];
  const visibility = (ids) =>
    Math.min(...ids.map((id) => landmarks[id]?.visibility ?? 0));
  const side = visibility(sides[0]) >= visibility(sides[1]) ? 0 : 1;
  const ids = sides[side];
  if (visibility(ids) < 0.6) return null;
  const points = ids.map((id) => ({
    x: landmarks[id].x * width,
    y: landmarks[id].y * height,
  }));
  if (
    points.some(
      (p) =>
        !Number.isFinite(p.x + p.y) ||
        p.x < 0 ||
        p.x > width ||
        p.y < 0 ||
        p.y > height,
    )
  )
    return null;
  const [shoulder, elbow, wrist, hip, knee, ankle] = points;
  const bodyLength = Math.hypot(shoulder.x - ankle.x, shoulder.y - ankle.y);
  const elbowAngle = angle(shoulder, elbow, wrist);
  const hipAngle = angle(shoulder, hip, knee);
  const kneeAngle = angle(hip, knee, ankle);
  if ([elbowAngle, hipAngle, kneeAngle].some((value) => value === null))
    return null;
  return {
    side,
    elbow: elbowAngle,
    shoulderY: shoulder.y / height,
    bodyLength: bodyLength / height,
    plank:
      bodyLength > width * 0.28 &&
      Math.abs(shoulder.y - ankle.y) / bodyLength < 0.58 &&
      hipAngle > 150 &&
      kneeAngle > 155,
  };
}

export class PushCounter {
  constructor() {
    this.reset();
  }
  reset() {
    this.count = 0;
    this.interrupted = 0;
    this.lastTime = null;
    this.lastSide = null;
    this.release();
  }
  release() {
    this.phase = "waiting";
    this.stableSince = null;
    this.stableFrames = 0;
    this.started = null;
    this.deep = false;
    this.topY = null;
  }
  snapshot(message = "Ready for a stable plank", elbow = null) {
    return {
      count: this.count,
      interrupted: this.interrupted,
      phase: this.phase,
      message,
      elbow,
    };
  }
  update(sample, time) {
    if (
      !Number.isFinite(time) ||
      (this.lastTime !== null && time <= this.lastTime)
    )
      return this.snapshot("Waiting for a new frame", sample?.elbow);
    const gap = this.lastTime !== null && time - this.lastTime > 400;
    this.lastTime = time;
    const switched =
      sample && this.lastSide !== null && sample.side !== this.lastSide;
    if (sample) this.lastSide = sample.side;
    if (
      !sample ||
      !Number.isFinite(sample.elbow) ||
      !sample.plank ||
      gap ||
      switched
    ) {
      if (this.phase === "down") this.interrupted++;
      this.release();
      return this.snapshot(
        !sample
          ? "Full body not visible"
          : !sample.plank
            ? "Waiting for a side-on plank"
            : "Reacquiring starting position",
        sample?.elbow,
      );
    }
    const { elbow, shoulderY, bodyLength } = sample;
    if (this.phase === "waiting") {
      if (elbow < 155) {
        this.stableSince = null;
        this.stableFrames = 0;
        return this.snapshot("Starting position: arms extended", elbow);
      }
      this.stableSince ??= time;
      this.stableFrames++;
      if (time - this.stableSince >= 600 && this.stableFrames >= 4) {
        this.phase = "ready";
        this.topY = shoulderY;
        return this.snapshot("Starting position detected", elbow);
      }
      return this.snapshot("Confirming a stable start", elbow);
    }
    if (this.phase === "ready") {
      if (elbow >= 155) this.topY = shoulderY;
      if (elbow < 125) {
        this.phase = "down";
        this.started = time;
        this.deep = false;
      }
    }
    if (this.phase === "down") {
      if (elbow <= 105 && shoulderY - this.topY > bodyLength * 0.035)
        this.deep = true;
      if (time - this.started > 8000) {
        this.interrupted++;
        this.release();
        return this.snapshot("Movement timed out", elbow);
      }
      if (elbow >= 155) {
        const complete = this.deep && time - this.started >= 300;
        if (complete) this.count++;
        else this.interrupted++;
        this.phase = "ready";
        this.topY = shoulderY;
        return this.snapshot(
          complete ? "Complete cycle detected" : "Incomplete cycle excluded",
          elbow,
        );
      }
    }
    return this.snapshot(
      this.phase === "down"
        ? this.deep
          ? "Lower position detected"
          : "Downward movement"
        : "Ready for the next movement",
      elbow,
    );
  }
}

export function demoPose(time) {
  const d =
    time < 1400
      ? 0
      : (1 - Math.cos((((time - 1400) % 2800) / 2800) * Math.PI * 2)) / 2;
  const points = Array.from({ length: 33 }, () => ({
    x: 0,
    y: 0,
    visibility: 0,
  }));
  const joints = [
    [11, 0.25, 0.36 + d * 0.25],
    [13, 0.255 + d * 0.16, 0.56 + d * 0.09],
    [15, 0.26, 0.78],
    [23, 0.52, 0.53 + d * 0.1],
    [25, 0.69, 0.635 + d * 0.045],
    [27, 0.86, 0.74],
  ];
  for (const [id, x, y] of joints) {
    points[id] = { x, y, visibility: 1 };
    points[id + 1] = { x: x + 0.012, y: y - 0.008, visibility: 0.7 };
  }
  points[0] = { x: 0.17, y: 0.3 + d * 0.25, visibility: 1 };
  return points;
}
