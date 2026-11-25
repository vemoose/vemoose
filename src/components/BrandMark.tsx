export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 24"
      aria-hidden
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 20 C6 16 5 11 7 6 C9 3 12 2 15 3 C16 6 16 9 15 12 C18 10 21 9 24 10 C25 12 24 15 22 17 C20 19 17 20 14 20 C12 20 10 20 8 20 Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M10 8 C7 6 5 4 4 2 M22 8 C25 6 27 4 28 2"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M13 14 C14 16 16 17 18 16"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}