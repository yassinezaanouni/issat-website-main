export const PROF_TYPES = ["prof", "chefProf"];

export const NAV_ITEMS = [
  // use lucide-react
  {
    title: "Dashboard",
    href: "/",
    icon: "Home",
    access: ["admin", "chefProf", "student"],
  },
  {
    title: "Groupes",
    href: "/groups",
    icon: "Users",
    access: ["admin"],
  },
  {
    title: "Fillieres",
    href: "/fillieres",
    icon: "Book",
    access: ["admin"],
  },
  {
    title: "Etudiants",
    href: "/students",
    icon: "User",
    access: ["admin"],
  },
  {
    title: "Profs",
    href: "/profs",
    icon: "User",
    access: ["admin"],
  },
  {
    title: "Matieres",
    href: "/matieres",
    icon: "Book",
    access: ["admin", "chefProf", "prof"],
  },
  {
    title: "Salles",
    href: "/rooms",
    icon: "Home",
    access: ["admin"],
  },
  {
    title: "Cours",
    href: "/courses",
    icon: "Book",
    access: ["admin", "chefProf", "prof"],
  },
  {
    title: "Emplois",
    href: "/timeTables",
    icon: "Calendar",
    access: ["admin", "chefProf", "prof", "student"],
  },
];
