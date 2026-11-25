"use client";

import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/BrandMark";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`site-nav sticky top-0 z-50 border-b backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300 ease-out ${
        scrolled
          ? "border-border bg-page/92 shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
          : "border-transparent bg-page/70"
      }`}
    >
      <nav
        className="mx-auto flex h-[72px] max-w-content items-center justify-between gap-6 px-gutter"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-primary no-underline"
        >
          <BrandMark className="h-6 w-8 text-primary transition-transform duration-300 ease-out group-hover:scale-[1.06] group-active:scale-100" />
          <span className="text-[14px] tracking-[-0.02em] text-primary transition-colors duration-200 group-hover:text-accent">
            vemoose<span className="text-accent">.</span>
          </span>
        </Link>

        <ul className="hidden flex-1 items-center justify-center gap-6 sm:flex md:gap-8">
          <li>
            <a href="#projects" className="nav-link text-[14px] text-secondary">
              Projects
            </a>
          </li>
          <li>
            <a href="#studio" className="nav-link text-[14px] text-secondary">
              Studio
            </a>
          </li>
        </ul>

        <a href="#projects" className="cta-chip text-[14px] text-primary">
          Explore work
          <ArrowDownRight className="cta-chip__icon h-3.5 w-3.5" strokeWidth={1.75} />
        </a>
      </nav>
    </header>
  );
}