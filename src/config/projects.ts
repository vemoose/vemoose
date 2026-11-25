export type ProjectStatus = "live" | "in development";

export type Project = {
  slug: string;
  name: string;
  description: string;
  category: string;
  status: ProjectStatus;
  url?: string;
  artwork: {
    src: string;
    alt: string;
  };
};

export const projects: Project[] = [
  {
    slug: "perfect-payroll",
    name: "Perfect Payroll",
    description: "Simplifying the work that happens before payroll.",
    category: "Productivity",
    status: "live",
    url: "https://payroll.vemoose.com",
    artwork: {
      src: "/projects/perfect-payroll.svg",
      alt: "Perfect Payroll product artwork",
    },
  },
  {
    slug: "card-and-board",
    name: "Card & Board",
    description: "A digital playground for tabletop game creators.",
    category: "Creative tools",
    status: "in development",
    artwork: {
      src: "/projects/card-and-board.svg",
      alt: "Card & Board product artwork",
    },
  },
];