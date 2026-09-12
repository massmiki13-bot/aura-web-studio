export type TeamMember = {
  name: string;
  surname: string;
  roleKey: string;
  image: string;
  phone: string;
  pec: string;
  email: string;
  accent: string;
};

export const members: TeamMember[] = [
  {
    name: "Michele",
    surname: "Massardi",
    roleKey: "founder",
    image: "/team/member-1.jpg",
    phone: "+39 334 1924697",
    pec: "michele.mass@pec.it",
    email: "mass.miki13@gmail.com",
    accent: "oklch(0.85 0.005 260)",
  },
  {
    name: "Emanuele",
    surname: "Driussi",
    roleKey: "developer",
    image: "/team/member-2.jpg",
    phone: "+39 339 5717099",
    pec: "driussi.emanuele0@pec.it",
    email: "emadriu07@gmail.com",
    accent: "oklch(0.75 0.005 260)",
  },
  {
    name: "Leonardo",
    surname: "Parisi",
    roleKey: "designer",
    image: "/team/member-3.jpg",
    phone: "+39 345 7354180",
    pec: "parisileonardo15@pec.it",
    email: "parisileonardo15@gmail.com",
    accent: "oklch(0.65 0.005 260)",
  },
];

/**
 * People who work with the studio without being part of the trio that founded
 * it. A separate list, and a separate section on the team page, because the
 * difference is real and flattening it into one grid of six would misrepresent
 * both sides of it.
 *
 * No PEC here: a founder has one because the company's paperwork goes through
 * it. A collaborator abroad does not.
 */
export type Collaborator = {
  name: string;
  surname: string;
  roleKey: string;
  /** Where they work from, shown next to the role. */
  based: string;
  image: string;
  phone: string;
  email: string;
};

export const collaborators: Collaborator[] = [
  {
    name: "Martino",
    surname: "Galleni",
    // Neutral on purpose: nobody has said what Martino actually does on the
    // projects, and a job title invented for him would be the one thing on
    // this page that isn't true. Swap the key when the real one is known.
    roleKey: "collaborator",
    based: "Germania",
    image: "/team/collaborator-1.jpg",
    phone: "+49 15906654533",
    email: "martino.galleni@gmail.com",
  },
];

export const roles: Record<string, string> = {
  founder: "Design, 3D & Marketing",
  developer: "Business Development & Brand Ambassador",
  designer: "Sviluppo & SEO Tecnica",
  collaborator: "Collaboratore",
};
