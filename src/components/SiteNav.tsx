import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-page/80 backdrop-blur-md">
      <nav
        className="mx-auto flex h-[72px] max-w-content items-center justify-between gap-6 px-gutter"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 text-primary no-underline"
        >
          <BrandMark className="h-6 w-8 text-primary" />
          <span className="text-[14px] tracking-[-0.02em] text-primary">
            vemoose<span className="text-accent">.</span>
          </span>
        </Link>

        <ul className="hidden flex-1 items-center justify-center gap-6 sm:flex md:gap-8">
          <li>
            <a
              href="#projects"
              className="text-[14px] text-secondary transition-colors hover:text-primary"
            >
              Projects
            </a>
          </li>
          <li>
            <a
              href="#studio"
              className="text-[14px] text-secondary transition-colors hover:text-primary"
            >
              Studio
            </a>
          </li>
        </ul>

        <a
          href="#projects"
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[14px] text-primary transition-colors hover:border-accent-border hover:text-accent"
        >
          Explore work
          <ArrowDownRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </a>
      </nav>
    </header>
  );
}