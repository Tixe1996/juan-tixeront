import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function NotFound() {
  return (
    <div className="wrap not-found">
      <p className="eyebrow">404</p>
      <h1>
        This page took
        <br />
        <em>a different route.</em>
      </h1>
      <Link href="/" className="button primary">
        <ArrowLeft size={17} />
        Back to overview
      </Link>
    </div>
  );
}
