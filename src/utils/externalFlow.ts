import SafeStorage from '@/utils/storage';

const PENDING_EXTERNAL_PAYMENT_KEY = 'judam_pending_external_payment';
const PENDING_EXTERNAL_PAYMENT_MAX_AGE_MS = 30 * 60 * 1000;

export async function markPendingExternalPayment() {
  await SafeStorage.setItem(
    PENDING_EXTERNAL_PAYMENT_KEY,
    JSON.stringify({
      createdAt: Date.now(),
    })
  );
}

export async function clearPendingExternalPayment() {
  await SafeStorage.removeItem(PENDING_EXTERNAL_PAYMENT_KEY);
}

export async function hasRecentPendingExternalPayment() {
  const rawValue = await SafeStorage.getItem(PENDING_EXTERNAL_PAYMENT_KEY);
  if (!rawValue) return false;

  try {
    const parsed = JSON.parse(rawValue) as { createdAt?: number };
    const createdAt = Number(parsed.createdAt);
    if (!Number.isFinite(createdAt)) {
      await clearPendingExternalPayment();
      return false;
    }
    if (Date.now() - createdAt > PENDING_EXTERNAL_PAYMENT_MAX_AGE_MS) {
      await clearPendingExternalPayment();
      return false;
    }
    return true;
  } catch {
    await clearPendingExternalPayment();
    return false;
  }
}
