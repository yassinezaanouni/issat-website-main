export const PROF_TYPES = ["prof", "chefProf"];

export const NAV_ITEMS = [
  // use lucide-react
  {
    title: "Dashboard",
    href: "/",
    icon: "Home",
    access: ["admin", "prof", "student"],
  },
  {
    title: "Groupes",
    href: "/groups",
    icon: "Users",
    access: ["admin", "prof"],
  },
  {
    title: "Fillieres",
    href: "/fillieres",
    icon: "Book",
    access: ["admin", "prof"],
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
    title: "Salles",
    href: "/rooms",
    icon: "Home",
    access: ["admin", "prof"],
  },
];
