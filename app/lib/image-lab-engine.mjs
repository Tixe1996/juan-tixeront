import FFT from "fft.js";

export const LAB_MODES = ["saturation", "heat", "schrodinger"];
const STEP = 0.025;

export class ImageExperiment {
  constructor(rgba, size = 256) {
    if (!Number.isInteger(size) || size < 2 || size > 256 || (size & (size - 1))) throw new Error("Grid size must be a power of two, from 2 to 256.");
    if (rgba.length !== size * size * 4) throw new Error("Invalid RGBA input.");
    this.size = size;
    this.count = size * size;
    this.rgba = new Uint8ClampedArray(rgba);
    this.fft = new FFT(size);
    this.line = new Float64Array(size * 2);
    this.result = new Float64Array(size * 2);
    this.initial = [0, 1, 2].map((channel) => {
      const data = new Float64Array(this.count * 2);
      for (let i = 0; i < this.count; i++) data[2 * i] = rgba[4 * i + channel] / 255;
      return data;
    });
    this.spectra = this.initial.map((channel) => this.transform(channel.slice()));
    this.k2 = new Float64Array(this.count);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const kx = 2 * Math.PI * (x <= size / 2 ? x : x - size) / size;
      const ky = 2 * Math.PI * (y <= size / 2 ? y : y - size) / size;
      this.k2[y * size + x] = kx * kx + ky * ky;
    }
    this.initialMass = this.mass(this.initial);
    this.resetWave();
  }

  transform(data, inverse = false) {
    const n = this.size;
    const method = inverse ? "inverseTransform" : "transform";
    for (let y = 0; y < n; y++) {
      this.line.set(data.subarray(y * n * 2, (y + 1) * n * 2));
      this.fft[method](this.result, this.line);
      data.set(this.result, y * n * 2);
    }
    for (let x = 0; x < n; x++) {
      for (let y = 0; y < n; y++) {
        this.line[2 * y] = data[2 * (y * n + x)];
        this.line[2 * y + 1] = data[2 * (y * n + x) + 1];
      }
      this.fft[method](this.result, this.line);
      for (let y = 0; y < n; y++) {
        data[2 * (y * n + x)] = this.result[2 * y];
        data[2 * (y * n + x) + 1] = this.result[2 * y + 1];
      }
    }
    return data;
  }

  mass(channels) {
    let sum = 0;
    for (const data of channels) for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
    return sum;
  }

  resetWave() {
    this.wave = this.initial.map((channel) => channel.slice());
    this.waveStep = 0;
  }

  nonlinearPhase(data, dt) {
    for (let i = 0; i < this.count; i++) {
      const real = data[2 * i], imaginary = data[2 * i + 1];
      const phase = -(real * real + imaginary * imaginary) * dt;
      data[2 * i] = real * Math.cos(phase) - imaginary * Math.sin(phase);
      data[2 * i + 1] = real * Math.sin(phase) + imaginary * Math.cos(phase);
    }
  }

  stepWave(channels, dt) {
    // Strang splitting preserves the discrete L2 norm and avoids forward-Euler growth.
    for (const data of channels) {
      this.nonlinearPhase(data, dt / 2);
      this.transform(data);
      for (let i = 0; i < this.count; i++) {
        const phase = -this.k2[i] * dt;
        const real = data[2 * i], imaginary = data[2 * i + 1];
        data[2 * i] = real * Math.cos(phase) - imaginary * Math.sin(phase);
        data[2 * i + 1] = real * Math.sin(phase) + imaginary * Math.cos(phase);
      }
      this.transform(data, true);
      this.nonlinearPhase(data, dt / 2);
    }
  }

  render(mode, progress) {
    if (!LAB_MODES.includes(mode) || !Number.isFinite(progress) || progress < 0 || progress > 1) throw new Error("Invalid experiment parameters.");
    const pixels = new Uint8ClampedArray(this.count * 4);
    let channels, time = 0, drift = 0, steps = 0;
    if (mode === "saturation") {
      for (let i = 0; i < this.count; i++) {
        const offset = i * 4;
        const grey = .2126 * this.rgba[offset] + .7152 * this.rgba[offset + 1] + .0722 * this.rgba[offset + 2];
        for (let c = 0; c < 3; c++) pixels[offset + c] = grey + progress * 1.5 * (this.rgba[offset + c] - grey);
        pixels[offset + 3] = 255;
      }
    } else {
      if (mode === "heat") {
        time = progress * 24;
        channels = this.spectra.map((spectrum) => {
          const data = spectrum.slice();
          for (let i = 0; i < this.count; i++) {
            const damping = Math.exp(-this.k2[i] * time);
            data[2 * i] *= damping;
            data[2 * i + 1] *= damping;
          }
          return this.transform(data, true);
        });
      } else {
        time = progress * 1.6;
        const targetStep = Math.floor((time + 1e-12) / STEP);
        if (targetStep < this.waveStep) this.resetWave();
        while (this.waveStep < targetStep) { this.stepWave(this.wave, STEP); this.waveStep++; }
        channels = this.wave;
        const remainder = time - targetStep * STEP;
        if (remainder > 1e-10) {
          channels = this.wave.map((channel) => channel.slice());
          this.stepWave(channels, remainder);
        }
        drift = this.initialMass ? Math.abs(this.mass(channels) / this.initialMass - 1) : 0;
        steps = targetStep;
      }
      for (let i = 0; i < this.count; i++) {
        for (let c = 0; c < 3; c++) {
          const value = channels[c][2 * i];
          pixels[4 * i + c] = 255 * (mode === "schrodinger" ? Math.abs(value) : value);
        }
        pixels[4 * i + 3] = 255;
      }
    }
    return { pixels, time, drift, steps, size: this.size, progress, mode };
  }
}
