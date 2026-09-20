"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Download, Menu, X } from "lucide-react";
import { asset, profile } from "../lib/content";

const navigation = [
  ["/", "Overview"],
  ["/experience/", "Experience"],
  ["/projects/", "Projects"],
  ["/skills/", "Expertise"],
  ["/contact/", "Contact"],
];

export default function SiteFrame({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
    const legacy = {
      "#about": "/experience/",
      "#experience": "/experience/",
      "#interests": "/experience/#interests",
      "#skills": "/skills/",
      "#projects": "/projects/",
      "#contact": "/contact/",
    };
    if (pathname === "/" && legacy[window.location.hash])
      router.replace(legacy[window.location.hash]);
    const elements = document.querySelectorAll("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    elements.forEach((element) => {
      element.classList.add("reveal-ready");
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, [pathname, router]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner wrap">
          <Link href="/" className="brand" aria-label="Juan Tixeront, home">
            <span className="monogram">
              jt<span>.</span>
            </span>
            <span className="brand-name">JUAN TIXERONT</span>
          </Link>
          <nav
            id="main-navigation"
            className={menuOpen ? "main-nav is-open" : "main-nav"}
            aria-label="Main navigation"
          >
            {navigation.map(([href, label]) => {
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(href.slice(0, -1));
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <a
            className="header-cv"
            href={asset(profile.cv)}
            target="_blank"
            rel="noreferrer"
          >
            Résumé <Download size={15} aria-hidden="true" />
          </a>
          <button
            ref={menuButton}
            className="icon-button menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="wrap footer-inner">
          <Link className="footer-name" href="/">
            Juan Tixeront
            <span>Engineering precision. Commercial curiosity.</span>
          </Link>
          <div className="footer-links">
            <a href={`mailto:${profile.email}`}>
              Email <ArrowUpRight size={14} />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <ArrowUpRight size={14} />
            </a>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
