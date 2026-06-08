export const validateName = (name: string) =>
  name.length > 0 &&
  name[0] === name[0].toUpperCase() &&
  name[0] !== name[0].toLowerCase();

export const validateEmail = (email: string) => {
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain) return false;
  if (!domain.includes('.')) return false;
  return domain.split('.').every((p) => p !== '');
};

export const validateAge = (age: number) => age > 0;
