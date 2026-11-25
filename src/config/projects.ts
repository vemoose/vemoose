export type ProjectStatus = "live" | "in development";

export type Project = {
  slug: string;
  name: string;
  description: string;
  category: string;
  status: ProjectStatus;
  url?: string;
};

export const projects: Project[] = [
  {
    slug: "perfect-payroll",
    name: "Perfect Payroll",
    description: "Simplifying the work that happens before payroll.",
    category: "Productivity",
    status: "live",
    url: "https://payroll.vemoose.com",
  },
  {
    slug: "card-and-board",
    name: "Card & Board",
    description: "A digital playground for tabletop game creators.",
    category: "Creative tools",
    status: "in development",
  },
];