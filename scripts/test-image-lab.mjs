import assert from "node:assert/strict";
import { ImageExperiment } from "../app/lib/image-lab-engine.mjs";

let passed = 0;
function test(name, callback) { callback(); passed++; console.log("PASS " + name); }
function input(size, pixel) {
  const data = new Uint8ClampedArray(size * size * 4);
  for (let i = 0; i < size * size; i++) data.set([...pixel(i % size, Math.floor(i / size)), 255], 4 * i);
  return data;
}
function variation(pixels, size) {
  let result = 0;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) for (let c = 0; c < 3; c++) {
    const i = 4 * (y * size + x) + c;
    result += Math.abs(pixels[i] - pixels[4 * (y * size + (x + 1) % size) + c]);
    result += Math.abs(pixels[i] - pixels[4 * (((y + 1) % size) * size + x) + c]);
  }
  return result;
}
const size = 16;
const pixels = input(size, (x, y) => [(x * 13 + y * 29) % 256, (x * 31 + y * 7) % 256, (x + y) % 2 ? 40 : 220]);
const engine = new ImageExperiment(pixels, size);
test("saturation zero produces equal RGB channels", () => {
  const result = engine.render("saturation", 0).pixels;
  for (let i = 0; i < result.length; i += 4) { assert.equal(result[i], result[i + 1]); assert.equal(result[i], result[i + 2]); }
});
test("unit saturation reconstructs the original photograph", () => assert.deepEqual(engine.render("saturation", 2 / 3).pixels, pixels));
test("zero-time heat evolution reconstructs input", () => assert.deepEqual(engine.render("heat", 0).pixels, pixels));
test("heat diffusion reduces spatial variation", () => assert.ok(variation(engine.render("heat", 1).pixels, size) < variation(pixels, size) * .25));
test("heat diffusion preserves a constant RGB field", () => {
  const constant = input(size, () => [80, 140, 210]);
  assert.deepEqual(new ImageExperiment(constant, size).render("heat", 1).pixels, constant);
});
test("heat diffusion preserves channel means within output quantisation", () => {
  const result = engine.render("heat", .5).pixels;
  for (let c = 0; c < 3; c++) {
    let difference = 0;
    for (let i = c; i < pixels.length; i += 4) difference += result[i] - pixels[i];
    assert.ok(Math.abs(difference / (size * size)) <= .51);
  }
});
test("zero-time Schrodinger evolution reconstructs input", () => assert.deepEqual(engine.render("schrodinger", 0).pixels, pixels));
test("split-step evolution conserves the discrete L2 norm", () => {
  const result = engine.render("schrodinger", 1);
  assert.ok(result.drift < 1e-10, String(result.drift));
  assert.equal(result.steps, 64);
  assert.ok(engine.wave.every((channel) => channel.every(Number.isFinite)));
  assert.notDeepEqual(result.pixels, pixels);
});
test("constant nonlinear field follows its exact phase rotation", () => {
  const values = [80, 140, 210];
  const result = new ImageExperiment(input(size, () => values), size).render("schrodinger", 1);
  values.forEach((value, c) => assert.ok(Math.abs(result.pixels[c] - Math.abs(value * Math.cos((value / 255) ** 2 * 1.6))) <= .51));
});
test("seeking backwards and forwards is reproducible", () => {
  const first = engine.render("schrodinger", .413).pixels;
  engine.render("schrodinger", 1);
  assert.deepEqual(engine.render("schrodinger", .413).pixels, first);
});
test("invalid grids and parameters are rejected", () => {
  assert.throws(() => new ImageExperiment(pixels, 15));
  assert.throws(() => new ImageExperiment(pixels, 512));
  assert.throws(() => engine.render("unknown", .5));
  assert.throws(() => engine.render("heat", NaN));
  assert.throws(() => engine.render("heat", -1));
  assert.throws(() => engine.render("heat", 2));
});
console.log(passed + " tests passed");
