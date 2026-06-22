export const calculatePasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 6) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/\W/.test(password)) strength++;

  switch (strength) {
    case 0:
    case 1:
      return 'Very Weak';
    case 2:
      return 'Weak';
    case 3:
      return 'Medium';
    case 4:
      return 'Strong';
    case 5:
      return 'Very Strong';
    default:
      return 'Very Weak';
  }
};