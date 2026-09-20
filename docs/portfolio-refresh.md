# Portfolio update, September 2026

## Content provenance

- AéroBox: original May 2026 presentation by Jean Tixeront and Matis Lebrun,
  configuration matrix, project render and manufacturing report.
- The 16 design variants combine two arm lengths, four blade counts and two
  material families. They are not flight-test results. No performance, mass,
  endurance or payload figure is claimed as measured.
- Push Quest: the original Python project and its V31 release notes,
  `LIRE_MOI_V31.md` and `RESULTATS_V31.md`. The documented 94 application tests
  and 56 inherited tests belong to that desktop release, not to the web demo.
- PLD Space and Fujifilm contributions use the existing CV-backed descriptions.
  No quantities, commercial results or efficiency improvements were invented.
- Original project images are reused. The Push Quest preview shows an explicitly
  simulated sequence. The Home Capital Studio image shows its current public UI.

## MA327 image study

The three supplied images match the original `tableau1 (1).jpg`,
`tableau2 (1).jpg` and `test5.jpg` byte-for-byte. They are inputs. Saved outputs
in `IMAGES1` supply the seascape (exponential/rational diffusion) and road
(heat diffusion) comparisons. No Starry Night output exists in that folder;
the site labels it as an additional input, without inventing a result.
The downloadable archive preserves the original Python scripts. They use
machine-specific paths and have not been presented as a validated package.

## Browser implementation

The browser experience uses self-hosted MediaPipe Tasks Vision 0.10.32 and the
official Pose Landmarker Lite float16 model v1. Inference runs in a classic web
worker because the WASM loader needs `importScripts`. The upstream CommonJS
bundle is served with a `.js` extension for static-host MIME compatibility.

The geometric counter requires a visible side-on plank, extended arms for at
least 600 ms, elbow flexion to 105 degrees or less, torso movement and return to
155 degrees. A gap over 400 ms, loss of pose or a side change discards the partial
cycle. These are prototype heuristics, not certified biomechanics thresholds.

Video is read from a camera stream or a local blob URL. No frames are uploaded.
Stopping, navigating away or cancelling a pending permission request releases
the stream and worker. Session JSON contains counts and provenance, not images.
The simulation passes synthetic landmarks through the same geometry/counter
pipeline but does not execute camera inference. It is labelled explicitly.

The demo does not port the Python trained form classifier, facial verification,
anti-fraud system or coaching system. It is not suitable for medical assessment,
official rankings or financial rewards. Real-world accuracy needs separate study.

## Verification

- `node scripts/test-push-counter.mjs` tests the geometric state machine.
- `python scripts/build-aerobox-brief.py` rebuilds the three-page English brief.
- Browser QA covers routes, static resources, native navigation, reduced motion,
  responsive layouts, simulation, real local-video inference and camera cleanup.
- Native View Transitions progressively enhance Next navigation. Unsupported
  browsers use normal links with the existing route-entry animation.
- `scripts/prepare-export.mjs` normalises the nested segment filenames produced
  by Next 16.2 on Windows. It copies them to the dot-separated names requested
  by the client, without deleting source files. Linux exports are unchanged.
