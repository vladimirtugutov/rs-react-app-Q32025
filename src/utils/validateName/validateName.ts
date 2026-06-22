export const validateName = (name: string) =>
  name.length > 0 &&
  name[0] === name[0].toUpperCase() &&
  name[0] !== name[0].toLowerCase();