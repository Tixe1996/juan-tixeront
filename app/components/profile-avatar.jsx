"use client";

import { useState } from "react";
import { asset } from "../lib/content";
import DialogShell from "./dialog-shell";

export default function ProfileAvatar() {
  const [origin, setOrigin] = useState(null);
  return <>
    <button type="button" className="profile-avatar" aria-label="View Juan Tixeront's portrait" title="View portrait"
      onClick={(event) => setOrigin(event.currentTarget.getBoundingClientRect().toJSON())}>
      <img src={asset("/assets/juan-tixeront-portrait.webp")} alt="" width={48} height={48} />
    </button>
    {origin && <DialogShell titleId="portrait-title" origin={origin} onClose={() => setOrigin(null)} className="portrait-dialog">
      <img src={asset("/assets/juan-tixeront-portrait.webp")} alt="Portrait of Juan Tixeront in his PLD Space T-shirt" width={1536} height={1024} />
      <div className="portrait-dialog-caption"><h2 id="portrait-title">Juan Tixeront</h2><p>Engineering · Aerospace · Computing</p></div>
    </DialogShell>}
  </>;
}
