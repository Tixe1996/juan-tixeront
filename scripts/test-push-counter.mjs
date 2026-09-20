import assert from "node:assert/strict";
import {
  PushCounter,
  demoPose,
  measurePose,
  angle,
} from "../app/lib/push-counter.mjs";

const top = {
  plank: true,
  elbow: 170,
  shoulderY: 0.3,
  bodyLength: 0.6,
  side: 0,
};
const down = { ...top, elbow: 85, shoulderY: 0.45 };
function prepare(c, offset = 0) {
  for (let t = offset; t <= offset + 700; t += 100) c.update(top, t);
}
function cycle(c, t = 800) {
  c.update(down, t);
  c.update(down, t + 200);
  return c.update(top, t + 400);
}
let tests = 0;
function test(name, fn) {
  fn();
  tests++;
  console.log(`PASS ${name}`);
}
test("counts a complete cycle", () => {
  const c = new PushCounter();
  prepare(c);
  assert.equal(cycle(c).count, 1);
});
test("does not count a partial cycle", () => {
  const c = new PushCounter();
  prepare(c);
  c.update({ ...down, elbow: 120 }, 800);
  c.update(top, 1200);
  assert.equal(c.count, 0);
});
test("rejects standing movements", () => {
  const c = new PushCounter();
  for (let t = 0; t < 2000; t += 100)
    c.update({ ...top, plank: false, elbow: t % 200 ? 85 : 170 }, t);
  assert.equal(c.count, 0);
});
test("pose loss discards an active cycle", () => {
  const c = new PushCounter();
  prepare(c);
  c.update(down, 800);
  c.update(null, 1000);
  c.update(top, 1200);
  assert.equal(c.count, 0);
  assert.equal(c.interrupted, 1);
});
test("a side switch discards an active cycle", () => {
  const c = new PushCounter();
  prepare(c);
  c.update(down, 800);
  c.update({ ...down, side: 1 }, 1000);
  c.update({ ...top, side: 1 }, 1200);
  assert.equal(c.count, 0);
});
test("sparse or duplicate frames do not create repetitions", () => {
  const c = new PushCounter();
  prepare(c);
  c.update(down, 800);
  c.update(top, 800);
  c.update(top, 1400);
  assert.equal(c.count, 0);
});
test("elbow motion without torso descent is excluded", () => {
  const c = new PushCounter();
  prepare(c);
  c.update({ ...down, shoulderY: 0.3 }, 800);
  c.update(top, 1200);
  assert.equal(c.count, 0);
});
test("pause/release requires a new stable start", () => {
  const c = new PushCounter();
  prepare(c);
  c.update(down, 800);
  c.release();
  c.update(top, 1000);
  assert.equal(c.count, 0);
  assert.equal(c.phase, "waiting");
});
test("reset clears the session", () => {
  const c = new PushCounter();
  prepare(c);
  cycle(c);
  c.reset();
  assert.equal(c.count, 0);
  assert.equal(c.lastTime, null);
});
test("degenerate geometry is unknown", () =>
  assert.equal(angle({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 1 }), null));
test("low visibility is unknown", () => {
  const pose = demoPose(0);
  pose[15].visibility = 0;
  pose[16].visibility = 0;
  assert.equal(measurePose(pose, 960, 600), null);
});
test("simulation uses the same measurement and counter pipeline", () => {
  const c = new PushCounter();
  for (let t = 0; t < 12600; t += 50)
    c.update(measurePose(demoPose(t), 960, 600), t);
  assert.equal(c.count, 4);
});
console.log(`${tests} tests passed`);
