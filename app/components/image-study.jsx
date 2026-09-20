"use client";

import { useState } from "react";
import { ArrowLeftRight, Image as ImageIcon } from "lucide-react";
import { asset } from "../lib/content";

const samples = [
  {
    name: "Seascape",
    original: "seascape-original.jpg",
    outputs: [
      { name: "Exponential", file: "seascape-exp.jpg" },
      { name: "Rational", file: "seascape-frac.jpg" },
    ],
    description: "Two saved anisotropic-diffusion outputs, with exponential and rational conduction functions. Their different treatment of local gradients changes the texture of the painting.",
  },
  {
    name: "Starry night",
    original: "starry-original.jpg",
    outputs: [],
    description: "An additional painting supplied with the original coursework. No corresponding processed output is stored in the project folder, so this image is presented as an input only.",
  },
  {
    name: "Open road",
    original: "road-original.jpg",
    outputs: [{ name: "Heat diffusion", file: "road-heat.png" }],
    description: "The saved heat-equation result smooths high-frequency detail across the RGB channels. Road markings, cloud edges and fine texture illustrate the visual effect of diffusion.",
  },
];

export default function ImageStudy() {
  const [selected, setSelected] = useState(0);
  const [variant, setVariant] = useState(0);
  const [position, setPosition] = useState(50);
  const sample = samples[selected];
  const output = sample.outputs[variant];
  const imagePath = (file) => asset(`/assets/projects/image-math/${file}`);

  return (
    <section className="image-study" aria-labelledby="image-study-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Inside the experiment</p>
          <h2 id="image-study-title">From pixels to <em>numerical fields.</em></h2>
        </div>
        <span className="study-provenance">Original project files · MA327</span>
      </div>
      <div className="image-study-controls">
        <div className="study-segments" role="group" aria-label="Study image">
          {samples.map((item, index) => (
            <button key={item.name} type="button" aria-pressed={selected === index}
              onClick={() => { setSelected(index); setVariant(0); setPosition(50); }}>
              <ImageIcon size={15} aria-hidden="true" />{item.name}
            </button>
          ))}
        </div>
        {sample.outputs.length > 1 && (
          <div className="study-segments study-variants" role="group" aria-label="Diffusion function">
            {sample.outputs.map((item, index) => (
              <button key={item.name} type="button" aria-pressed={variant === index}
                onClick={() => setVariant(index)}>{item.name}</button>
            ))}
          </div>
        )}
      </div>
      <figure className="image-comparison" key={sample.name}>
        <div className="comparison-frame">
          <img className="comparison-image" src={imagePath(sample.original)} alt={`${sample.name}: original study input`} width={640} height={512} />
          {output && <>
            <img className="comparison-image comparison-result" src={imagePath(output.file)} alt={`${sample.name}: saved ${output.name.toLowerCase()} result`}
              width={640} height={512} style={{ clipPath: `inset(0 0 0 ${position}%)` }} />
            <div className="comparison-divider" style={{ left: `${position}%` }} aria-hidden="true"><ArrowLeftRight size={18} /></div>
          </>}
          <span className="comparison-label original-label">Original input</span>
          {output && <span className="comparison-label result-label">Saved result</span>}
        </div>
        {output && <label className="comparison-range">
          <span>Original</span>
          <input type="range" min="0" max="100" value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            aria-label="Original and processed image comparison" aria-valuetext={`${position}% original image`} />
          <span>{output.name}</span>
        </label>}
        <figcaption>{sample.description}</figcaption>
      </figure>
    </section>
  );
}
