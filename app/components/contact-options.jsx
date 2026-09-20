"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Globe2,
  Mail,
} from "lucide-react";
import { asset, profile } from "../lib/content";

const topics = [
  "Banking & finance",
  "Aviation & aerospace",
  "Sales & business development",
  "Other opportunities",
];
export default function ContactOptions() {
  const [topic, setTopic] = useState(topics[0]);
  const [copyStatus, setCopyStatus] = useState("");
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyStatus("Email copied");
    } catch {
      setCopyStatus(`Email: ${profile.email}`);
    }
  }
  return (
    <div className="contact-options">
      <label className="field-label" htmlFor="contact-topic">
        Let’s talk about
      </label>
      <select
        id="contact-topic"
        value={topic}
        onChange={(event) => setTopic(event.target.value)}
      >
        {topics.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <a
        className="contact-email"
        href={`mailto:${profile.email}?subject=${encodeURIComponent(`${topic} - Juan Tixeront`)}`}
      >
        <Mail size={24} aria-hidden="true" />
        <span>{profile.email}</span>
        <ArrowUpRight size={26} aria-hidden="true" />
      </a>
      <div className="contact-small-actions">
        <button type="button" className="text-link" onClick={copyEmail}>
          {copyStatus === "Email copied" ? (
            <Check size={16} />
          ) : (
            <Copy size={16} />
          )}
          Copy email
        </button>
        <span className="copy-status" role="status">
          {copyStatus}
        </span>
      </div>
      <div className="contact-resource-list">
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          <Globe2 size={21} />
          <span>
            Connect on LinkedIn<small>Professional profile</small>
          </span>
          <ArrowUpRight size={20} />
        </a>
        <a href={asset(profile.cv)} target="_blank" rel="noreferrer">
          <Download size={21} />
          <span>
            View my résumé<small>PDF document</small>
          </span>
          <ArrowUpRight size={20} />
        </a>
      </div>
    </div>
  );
}
