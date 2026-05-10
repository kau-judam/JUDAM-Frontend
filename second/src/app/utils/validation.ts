/**
 * 이메일 유효성 검사
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 전화번호 유효성 검사 (한국 휴대폰 번호)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
  return phoneRegex.test(phone.replace(/-/g, ""));
}

/**
 * 사업자등록번호 유효성 검사 (000-00-00000)
 */
export function isValidBusinessNumber(businessNumber: string): boolean {
  const regex = /^\d{3}-\d{2}-\d{5}$/;
  return regex.test(businessNumber);
}

/**
 * 연락처 자동 하이픈 포맷 (010-0000-0000)
 */
export function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/[^\d]/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
}
