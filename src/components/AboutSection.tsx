export function AboutSection() {
  return (
    <section
      id="studio"
      className="scroll-mt-24 py-section"
      aria-labelledby="studio-heading"
    >
      <div
        className="rounded-[20px] border border-border p-8"
        style={{
          background:
            "linear-gradient(135deg, #111814 0%, #151e18 48%, #101612 100%)",
        }}
      >
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            02 / The studio
          </p>
          <div>
            <h2 id="studio-heading" className="section-heading text-primary">
              Built out of <span className="text-accent">curiosity.</span>
            </h2>
            <p className="mt-4 max-w-xl text-body text-secondary">
              An independent studio exploring ideas through software and design.
              Some solve problems. Some are just for fun. All start with a simple
              question: what if?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}