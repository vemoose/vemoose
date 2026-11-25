import { SiteNav } from "@/components/SiteNav";
import { Hero } from "@/components/Hero";
import { ProjectsSection } from "@/components/ProjectsSection";
import { AboutSection } from "@/components/AboutSection";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-content flex-1 px-gutter pb-8 pt-8">
        <Hero />
        <ProjectsSection />
        <AboutSection />
      </main>
      <SiteFooter />
    </>
  );
}