// MediaPipe's WASM loader uses importScripts, so this must be a classic worker.
const exports = {};
importScripts("./vendor/vision_bundle.js");
const { FilesetResolver, PoseLandmarker } = exports;

let detector;
self.onmessage = async ({ data }) => {
  try {
    if (data.type === "init") {
      const vision = await FilesetResolver.forVisionTasks(
        new URL("./vendor/", self.location).href,
      );
      detector = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: new URL(
            "./models/pose_landmarker_lite.task",
            self.location,
          ).href,
          delegate: "CPU",
        },
        runningMode: "VIDEO",
        numPoses: 2,
        minPoseDetectionConfidence: 0.6,
        minPosePresenceConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });
      self.postMessage({ type: "ready" });
    } else if (data.type === "frame") {
      try {
        const result = detector.detectForVideo(data.bitmap, data.timestamp);
        self.postMessage({
          type: "pose",
          timestamp: data.timestamp,
          landmarks: result.landmarks.length === 1 ? result.landmarks[0] : null,
          multiple: result.landmarks.length > 1,
        });
      } finally {
        data.bitmap.close();
      }
    }
  } catch (error) {
    self.postMessage({ type: "error", message: error.message });
  }
};
