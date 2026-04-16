/**
 * The Direct Answer Block — the AEO primary signal.
 * Every major content page MUST include one: 2–4 sentences, declarative,
 * first sentence answers the implied question, last references the applicable standard.
 */
export function DirectAnswer({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg border border-accent/30 bg-accent-muted p-5 mb-8 text-text-primary leading-relaxed"
      data-aeo="direct-answer"
    >
      <div className="text-2xs font-medium uppercase tracking-widest text-accent-hover mb-2">
        Direct answer
      </div>
      <div>{children}</div>
    </div>
  );
}
