import { ArrowLeft } from "lucide-react";
import Link from "../../../components/transition-link";
import PushDemo from "../../../components/push-demo";

export const metadata = {
  title: "Push Quest | Live demo",
  description:
    "Try the experimental push-up counter with a local camera, a video or a simulated sequence. Video stays on your device.",
};
export default function DemoPage() {
  return (
    <div className="demo-page wrap">
      <Link className="back-link" href="/projects/push-quest/">
        <ArrowLeft size={16} />
        About the project
      </Link>
      <header className="demo-heading">
        <div>
          <p className="eyebrow">Computer vision / Browser edition</p>
          <h1>
            Push Quest<span>.</span>
          </h1>
        </div>
        <p>Movement, measured.</p>
      </header>
      <PushDemo />
      <div className="demo-context">
        <p>
          <strong>Browser prototype</strong>
          <br />
          An experimental adaptation of the Python desktop project. Counts
          depend on visibility, camera angle and movement speed.
        </p>
        <p>
          <strong>Separate from the desktop system</strong>
          <br />
          No trained form classifier or identity verification. The demo sequence
          uses simulated landmarks, not camera inference.
        </p>
      </div>
    </div>
  );
}
