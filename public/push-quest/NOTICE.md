# Push Quest browser demo

Pose estimation uses Google's MediaPipe Tasks Vision 0.10.32 (Apache License 2.0)
and the official Pose Landmarker Lite model, float16, version 1.

- https://github.com/google-ai-edge/mediapipe
- https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js
- https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task

The JavaScript bundle and WASM runtime are unmodified copies from the pinned npm
package. The bundle uses the .js extension for static-host MIME compatibility.
The model and runtime are served by this website. Frames are processed locally
and are not uploaded. No model is loaded until a camera or video session starts.

The browser counter is an experimental adaptation of the original Python project,
not a port of its trained form classifier or facial-verification system.
The built-in demo uses simulated landmarks, explicitly labelled in the interface.
