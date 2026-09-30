"use client";
import { useMemo, useState } from "react";
import { Search, X, RotateCcw } from "lucide-react";
import { filters, projects } from "../lib/content";
import ProjectConstellation from "./project-constellation";

const disciplineOrder = ["Aerospace", "Computation", "Data & ML", "Strategy", "Finance"];
const orderedProjects = [...projects].sort((a, b) => disciplineOrder.indexOf(a.filter) - disciplineOrder.indexOf(b.filter));

export default function ProjectBrowser() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const matches = useMemo(
    () =>
      orderedProjects.filter(
        (project) =>
          (filter === "All" || project.filter === filter) &&
          `${project.title} ${project.summary} ${project.tools.join(" ")}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [filter, query],
  );
  return (
    <section className="wrap project-library" aria-label="Project library">
      <div className="library-tools">
        <div
          className="filter-tabs"
          role="group"
          aria-label="Filter projects by discipline"
        >
          {filters.map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
              <span>
                {item === "All"
                  ? projects.length
                  : projects.filter((project) => project.filter === item)
                      .length}
              </span>
            </button>
          ))}
        </div>
        <div className="search-field">
          <Search size={17} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects"
            aria-label="Search projects"
            type="search"
          />
          {query && (
            <button
              type="button"
              className="icon-button"
              aria-label="Clear search"
              title="Clear search"
              onClick={() => setQuery("")}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="library-summary">
        <span aria-live="polite">
          {matches.length} {matches.length === 1 ? "project" : "projects"}
        </span>
        <span>Applications, research & engineering</span>
      </div>
      {matches.length > 0 && <ProjectConstellation items={matches} />}
      {!matches.length && (
        <div className="empty-state">
          <Search size={32} />
          <h2>No matching projects</h2>
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              setFilter("All");
              setQuery("");
            }}
          >
            <RotateCcw size={16} />
            Reset filters
          </button>
        </div>
      )}
    </section>
  );
}
