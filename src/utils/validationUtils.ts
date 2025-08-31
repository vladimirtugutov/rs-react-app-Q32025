export const validateName = (name: string): boolean => /^[A-Z]/.test(name);
export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validateAge = (age: number): boolean => age > 0;
