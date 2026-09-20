"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const NavigationContext = createContext(null);

export function TransitionProvider({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const pending = useRef(null);
  const active = useRef(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    pending.current?.();
    pending.current = null;
  }, [pathname]);

  useEffect(
    () => () => {
      pending.current?.();
      active.current?.skipTransition();
    },
    [],
  );

  function navigate(event, href) {
    if (
      typeof href !== "string" ||
      href.includes("#") ||
      href.replace(/\/$/, "") === pathname.replace(/\/$/, "") ||
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    event.preventDefault();
    pending.current?.();
    active.current?.skipTransition();
    setBusy(true);
    document.documentElement.dataset.pageTransition = "active";
    const transition = document.startViewTransition(
      () =>
        new Promise((resolve) => {
          // Resolve after the new route commits, with a bounded fallback for slow loads.
          const timeout = window.setTimeout(resolve, 1800);
          pending.current = () => {
            window.clearTimeout(timeout);
            resolve();
          };
          router.push(href);
        }),
    );
    active.current = transition;
    transition.finished
      .catch(() => {})
      .finally(() => {
        if (active.current === transition) {
          active.current = null;
          setBusy(false);
          delete document.documentElement.dataset.pageTransition;
        }
      });
  }

  return (
    <NavigationContext.Provider value={navigate}>
      <div
        className={`route-progress${busy ? " is-active" : ""}`}
        aria-hidden="true"
      />
      {children}
    </NavigationContext.Provider>
  );
}

export default function TransitionLink({ href, onNavigate, ...props }) {
  const navigate = useContext(NavigationContext);
  return (
    <Link
      {...props}
      href={href}
      onNavigate={(event) => {
        onNavigate?.(event);
        if (!event.defaultPrevented) navigate?.(event, href);
      }}
    />
  );
}
