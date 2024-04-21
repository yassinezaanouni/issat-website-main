export const NAV_ITEMS = [
  // use lucide-react
  {
    title: "Dashboard",
    href: "/",
    icon: "Home",
    access: ["admin", "teacher", "student"],
  },
  {
    title: "Groupes",
    href: "/groups",
    icon: "Users",
    access: ["admin", "teacher"],
  },
  {
    title: "Fillieres",
    href: "/fillieres",
    icon: "Book",
    access: ["admin", "teacher"],
  },
  {
    title: "Etudiants",
    href: "/students",
    icon: "User",
    access: ["admin"],
  },
  {
    title: "Salles",
    href: "/rooms",
    icon: "Home",
    access: ["admin", "teacher"],
  },
];
