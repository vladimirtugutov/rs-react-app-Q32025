export const validateEmail = (email: string) => {
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain) return false;
  if (!domain.includes('.')) return false;
  return domain.split('.').every((p) => p !== '');
};