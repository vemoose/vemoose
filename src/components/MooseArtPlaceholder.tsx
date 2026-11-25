"use client";

type MooseArtPlaceholderProps = {
  fading?: boolean;
  showLabel?: boolean;
  onFaded?: () => void;
};

export function MooseArtPlaceholder({
  fading = false,
  showLabel = true,
  onFaded,
}: MooseArtPlaceholderProps) {
  return (
    <div
      className={`moose-art-placeholder${fading ? " moose-art-placeholder--fade" : ""}`}
      aria-hidden={!showLabel}
      onTransitionEnd={(event) => {
        if (
          fading &&
          event.target === event.currentTarget &&
          event.propertyName === "opacity"
        ) {
          onFaded?.();
        }
      }}
    >
      <span className="moose-art-placeholder__ambient" aria-hidden />
      <span
        className="moose-art-placeholder__ambient moose-art-placeholder__ambient--delay"
        aria-hidden
      />
      {showLabel && (
        <p className="moose-art-placeholder__label">Loading sculpture</p>
      )}
    </div>
  );
}