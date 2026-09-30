# Image Lab

The supplied `fraise.jpg` is copied unchanged to
`public/assets/projects/image-math/strawberry-original.jpg`. The original MA327
files remain available in the existing source archive. No new project entry is
created and the medical study remains in the project library.

## Models

- Saturation interpolates encoded display-RGB channels around a weighted grey
  value (0.2126 R + 0.7152 G + 0.0722 B). The gain runs from 0 to 1.5; this is a
  colour operation, not a differential equation or a colourimetric conversion.
- Heat evolves each RGB field with `exp(-|k|^2 t)` in Fourier space, with
  diffusivity 1, model time 0 to 24, and periodic boundary conditions.
- The MA327 bonus function `RKimage_schrodinger_effect` motivates the nonlinear
  model `i psi_t = -Delta psi + |psi|^2 psi`. This browser adaptation replaces its
  forward-Euler update with Strang splitting: nonlinear half-step, Fourier
  linear step, nonlinear half-step. The step is 0.025, model time runs to 1.6,
  and the display uses clipped `abs(real(psi))`, as in the original experiment.
  The displayed L2 drift is computed on the complex fields before clipping.

Images are resampled to a 256 by 256 grid; the displayed image retains its
original aspect ratio. The periodic Fourier grid differs from the original
Python boundary treatment. These are experiments on image fields, not a
temperature prediction or quantum simulation of the physical fruit. All
computation stays in a cancellable Web Worker; no remote AI API is involved.
Development and production explicitly use Webpack so the worker URL bundling
matches the verified static preview and GitHub Pages build.

The FFT implementation is [FFT.js](https://github.com/indutny/fft.js).
Background references:
[MIT heat-equation Fourier evolution](https://ocw.mit.edu/courses/18-336-numerical-methods-for-partial-differential-equations-spring-2009/4abfb0923544bc26cbbe98451dcd2157_MIT18_336S09_lec2.pdf),
[TU Berlin free Schrodinger Fourier propagation](https://www1.itp.tu-berlin.de/brandes/public_html/qm/umist_qm/node21.html).

## Checks

Run `node scripts/test-image-lab.mjs`. Tests cover reconstruction, saturation,
heat smoothing and mean preservation, norm conservation, the exact constant
nonlinear solution, seeking and input validation. Browser QA additionally checks
worker loading, all image/model combinations, cancellation, errors, downloads,
reduced motion, mobile layout and existing portfolio routes.
