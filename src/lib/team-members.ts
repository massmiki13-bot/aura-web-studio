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

export const roles: Record<string, string> = {
  founder: "Design, 3D & Marketing",
  developer: "Business Development & Brand Ambassador",
  designer: "Sviluppo & SEO Tecnica",
};
