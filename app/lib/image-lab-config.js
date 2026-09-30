export const labSamples = [
  { id: "strawberry", name: "Strawberry", file: "strawberry-original.jpg", alt: "The original strawberry photograph supplied with the MA327 coursework" },
  { id: "seascape", name: "Seascape", file: "seascape-original.jpg", alt: "Seascape painting used as a numerical image-processing input" },
  { id: "starry", name: "Starry night", file: "starry-original.jpg", alt: "Starry night painting supplied with the MA327 coursework" },
  { id: "road", name: "Open road", file: "road-original.jpg", alt: "Road photograph used in the MA327 heat-equation experiment" },
];

export const labModels = [
  {
    id: "saturation", name: "Saturation", title: "Colour from channel arithmetic",
    formula: "C(s) = Y + s(C₀ − Y)",
    code: "Y = 0.2126 R + 0.7152 G + 0.0722 B\nC = Y + s * (RGB - Y)\noutput = clip(C, 0, 1)",
    note: "RGB interpolation from grayscale to enhanced saturation. This colour operation is separate from the differential-equation models.",
  },
  {
    id: "heat", name: "Heat equation", title: "Diffusion of image intensity",
    formula: "∂u/∂t = Δu",
    code: "u_hat = fft2(RGB)\nu_hat *= exp(-|k|² * t)\nu = real(ifft2(u_hat))",
    note: "The heat equation smooths RGB intensity fields. Fourier evolution on a resampled periodic grid; an image experiment, not a temperature model of the fruit.",
  },
  {
    id: "schrodinger", name: "Schrödinger", title: "Nonlinear wave evolution",
    formula: "i ∂ψ/∂t = −Δψ + |ψ|²ψ",
    code: "psi *= exp(-i * |psi|² * dt/2)\npsi = ifft2(exp(-i * |k|² * dt) * fft2(psi))\npsi *= exp(-i * |psi|² * dt/2)\noutput = clip(abs(real(psi)), 0, 1)",
    note: "Inspired by the nonlinear Schrödinger effect in the MA327 code. The browser version uses stable split-step Fourier evolution and periodic edges, not the original Euler update. An image-field experiment, not quantum modelling of a strawberry.",
  },
];
