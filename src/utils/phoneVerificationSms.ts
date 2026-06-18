import { Alert, Linking, Platform } from 'react-native';

type PhoneVerificationSmsPayload = {
  verificationCode?: string | null;
  sendTo?: string | null;
  guideMessage?: string | null;
};

export const PHONE_VERIFICATION_SMS_FALLBACK_SEND_TO = '1666-3538';
export const PHONE_VERIFICATION_SMS_AFTER_OPEN_GUIDE =
  '문자앱에서 전송 버튼을 누른 뒤 앱으로 돌아와 인증 완료를 눌러주세요.';

export function getPhoneVerificationSmsTarget(payload?: PhoneVerificationSmsPayload | null) {
  return payload?.sendTo?.trim() || PHONE_VERIFICATION_SMS_FALLBACK_SEND_TO;
}

export function buildPhoneVerificationRequestGuideMessage(payload: PhoneVerificationSmsPayload) {
  const sendTo = getPhoneVerificationSmsTarget(payload);
  const code = String(payload.verificationCode || '인증번호').trim();

  return payload.guideMessage?.trim() || `${code}를 ${sendTo}로 문자 전송해주세요.`;
}

export function buildPhoneVerificationGuideMessage(payload: PhoneVerificationSmsPayload) {
  return `${buildPhoneVerificationRequestGuideMessage(payload)}\n${PHONE_VERIFICATION_SMS_AFTER_OPEN_GUIDE}`;
}

export async function openPhoneVerificationSmsApp(payload: PhoneVerificationSmsPayload) {
  const sendTo = getPhoneVerificationSmsTarget(payload);
  const message = String(payload.verificationCode || '').trim();
  const separator = Platform.OS === 'ios' ? '&' : '?';
  const smsUrl = `sms:${sendTo}${separator}body=${encodeURIComponent(message)}`;

  try {
    await Linking.openURL(smsUrl);
    return true;
  } catch {
    Alert.alert('알림', '문자앱을 열 수 없습니다. 인증번호를 직접 문자로 전송해주세요.');
    return false;
  }
}
