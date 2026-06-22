export const getPasswordStrengthClass = (strength: string) =>
  `strength-${strength.toLowerCase().replace(' ', '-')}`;