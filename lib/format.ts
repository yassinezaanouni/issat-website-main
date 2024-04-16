export const formatCamelCase = (str: string) => {
  // fullName => Full Name and _creationTime => Creation Time with _ removed and capital case
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (str) => str.toUpperCase());
};
