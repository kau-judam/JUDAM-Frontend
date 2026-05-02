export function digitsOnly(value: string) {
  return value.replace(/[^0-9]/g, "");
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string) {
  return /^01[016789][0-9]{7,8}$/.test(digitsOnly(phone));
}

export function isValidBusinessNumber(value: string) {
  return /^[0-9]{10}$/.test(digitsOnly(value));
}

export function getPasswordStrength(password: string) {
  if (!password) {
    return { score: 0, label: "", color: "#E5E7EB" };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;

  if (score >= 3) return { score, label: "안전", color: "#059669" };
  if (score === 2) return { score, label: "보통", color: "#D97706" };
  return { score, label: "약함", color: "#DC2626" };
}

export function isPasswordReady(password: string) {
  return password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
}

export function formatPhoneNumber(value: string) {
  const digits = digitsOnly(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function formatBusinessNumber(value: string) {
  const digits = digitsOnly(value).slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}
