import { ImageExperiment } from "./image-lab-engine.mjs";

let experiment;
self.onmessage = ({ data }) => {
  try {
    if (data.type === "init") {
      experiment = new ImageExperiment(data.pixels, data.size);
      self.postMessage({ type: "ready" });
    } else if (data.type === "render" && experiment) {
      const frame = experiment.render(data.mode, data.progress);
      self.postMessage({ type: "frame", revision: data.revision, ...frame }, [frame.pixels.buffer]);
    }
  } catch {
    self.postMessage({ type: "error" });
  }
};
