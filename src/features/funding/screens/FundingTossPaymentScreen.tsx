import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const TOSS_CLIENT_KEY = process.env.EXPO_PUBLIC_TOSS_CLIENT_KEY;
const TOSS_RETURN_ORIGIN = 'https://judam.app';
const APP_SCHEME = 'judamfrontend://';

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildQuery(params: Record<string, string | undefined>) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value || '')}`)
    .join('&');
}

function buildReturnUrl(kind: 'success' | 'fail', params: Record<string, string | undefined>) {
  const query = buildQuery(params);
  return `${TOSS_RETURN_ORIGIN}/funding/payment/${kind}${query ? `?${query}` : ''}`;
}

function parseUrlParams(url: string) {
  const queryString = url.split('?')[1]?.split('#')[0] || '';
  return queryString.split('&').reduce<Record<string, string>>((acc, pair) => {
    if (!pair) return acc;
    const [rawKey, rawValue = ''] = pair.split('=');
    if (!rawKey) return acc;
    const key = decodeURIComponent(rawKey.replace(/\+/g, ' '));
    const value = decodeURIComponent(rawValue.replace(/\+/g, ' '));
    acc[key] = value;
    return acc;
  }, {});
}

function isTossReturnUrl(url: string) {
  return url.startsWith(`${TOSS_RETURN_ORIGIN}/funding/payment/success`) || url.startsWith(`${TOSS_RETURN_ORIGIN}/funding/payment/fail`);
}

type ConvertedIntentUrl = {
  appLink?: string;
  fallbackUrl?: string;
  marketUrl?: string;
  packageName?: string;
};

function safeDecodeUriComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getIntentPart(fragment: string, key: string) {
  const value = fragment.match(new RegExp(`(?:^|;)${key}=([^;]+)`))?.[1];
  return value ? safeDecodeUriComponent(value) : undefined;
}

function convertIntentUrl(url: string): ConvertedIntentUrl | null {
  if (!url.startsWith('intent:')) return null;
  const [intentBase, intentFragment = ''] = url.split('#Intent;');
  const body = intentBase.replace(/^intent:/, '');
  const scheme = getIntentPart(intentFragment, 'scheme');
  const packageName = getIntentPart(intentFragment, 'package');
  const fallbackUrl = getIntentPart(intentFragment, 'S\\.browser_fallback_url');

  let appLink: string | undefined;
  if (scheme) {
    if (body.startsWith('//')) {
      appLink = `${scheme}:${body}`;
    } else if (body.includes('://')) {
      appLink = body;
    } else {
      appLink = `${scheme}://${body.replace(/^\/+/, '')}`;
    }
  } else if (body.includes('://')) {
    appLink = body;
  }

  return {
    appLink,
    fallbackUrl,
    packageName,
    marketUrl: packageName ? `market://details?id=${packageName}` : undefined,
  };
}

function shouldOpenOutsideWebView(url: string) {
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('about:blank') || url.startsWith('data:')) {
    return false;
  }
  return true;
}

async function openFirstAvailableUrl(urls: (string | undefined)[]) {
  let lastError: unknown;
  for (const url of urls) {
    if (!url) continue;
    try {
      await Linking.openURL(url);
      return true;
    } catch (error) {
      lastError = error;
    }
  }
  if (lastError) throw lastError;
  return false;
}

function makeCustomerKey(orderId: string) {
  const normalized = orderId.replace(/[^A-Za-z0-9_.=@-]/g, '_');
  const key = `judam_${normalized}`;
  return key.slice(0, 50) || `judam_${Date.now()}`;
}

function buildTossHtml(config: {
  clientKey: string;
  customerKey: string;
  amount: number;
  orderId: string;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
  customerMobilePhone?: string;
  successUrl: string;
  failUrl: string;
}) {
  const serialized = JSON.stringify(config).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <script src="https://js.tosspayments.com/v2/standard"></script>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; background: #ffffff; color: #111827; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .wrap { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 28px; text-align: center; }
    .spinner { width: 34px; height: 34px; border-radius: 50%; border: 3px solid #e5e7eb; border-top-color: #111827; animation: spin 0.8s linear infinite; }
    h1 { margin: 8px 0 0; font-size: 20px; line-height: 28px; }
    p { margin: 0; color: #6b7280; font-size: 14px; line-height: 21px; }
    button { display: none; width: 100%; max-width: 280px; height: 52px; margin-top: 8px; border: 0; border-radius: 14px; background: #111827; color: #fff; font-size: 15px; font-weight: 800; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="spinner"></div>
    <h1>토스 결제창을 여는 중입니다</h1>
    <p id="message">잠시만 기다려주세요.</p>
    <button id="retry" type="button">결제창 다시 열기</button>
  </div>
  <script>
    const config = ${serialized};

    function post(type, payload) {
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type, ...payload }));
    }

    function showRetry(message) {
      document.getElementById('message').textContent = message || '결제창을 열 수 없습니다.';
      document.getElementById('retry').style.display = 'block';
    }

    async function startPayment() {
      try {
        document.getElementById('retry').style.display = 'none';
        document.getElementById('message').textContent = '잠시만 기다려주세요.';
        if (!window.TossPayments) {
          throw new Error('토스 결제 모듈을 불러오지 못했습니다.');
        }
        const tossPayments = TossPayments(config.clientKey);
        const payment = tossPayments.payment({ customerKey: config.customerKey });
        const request = {
          method: 'CARD',
          amount: { currency: 'KRW', value: config.amount },
          orderId: config.orderId,
          orderName: config.orderName,
          successUrl: config.successUrl,
          failUrl: config.failUrl,
          customerName: config.customerName,
          customerEmail: config.customerEmail,
          customerMobilePhone: config.customerMobilePhone,
          card: {
            flowMode: 'DEFAULT',
            appScheme: '${APP_SCHEME}'
          },
          windowTarget: 'self'
        };
        Object.keys(request).forEach((key) => {
          if (request[key] === undefined || request[key] === '') delete request[key];
        });
        await payment.requestPayment(request);
      } catch (error) {
        const message = error && (error.message || error.code) ? (error.message || error.code) : '결제창을 열 수 없습니다.';
        showRetry(message);
        post('error', { message, code: error && error.code ? error.code : undefined });
      }
    }

    document.getElementById('retry').addEventListener('click', startPayment);
    window.addEventListener('load', () => setTimeout(startPayment, 250));
  </script>
</body>
</html>`;
}

export default function FundingTossPaymentScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    fundingId?: string;
    orderId?: string;
    numericOrderId?: string;
    amount?: string;
    orderName?: string;
    customerName?: string;
    customerEmail?: string;
    customerMobilePhone?: string;
    projectTitle?: string;
  }>();
  const handledReturnRef = useRef(false);
  const lastExternalUrlRef = useRef('');
  const [webViewReady, setWebViewReady] = useState(false);
  const [webError, setWebError] = useState('');

  const paymentInfo = useMemo(() => {
    const fundingId = getParam(params.fundingId) || '';
    const orderId = getParam(params.orderId) || '';
    const numericOrderId = getParam(params.numericOrderId) || '';
    const amount = Number(getParam(params.amount));
    const orderName = (getParam(params.orderName) || getParam(params.projectTitle) || '주담 펀딩 후원').slice(0, 100);
    const customerName = getParam(params.customerName) || undefined;
    const customerEmail = getParam(params.customerEmail) || undefined;
    const customerMobilePhone = getParam(params.customerMobilePhone)?.replace(/\D/g, '') || undefined;
    return {
      fundingId,
      orderId,
      numericOrderId,
      amount,
      orderName,
      customerName,
      customerEmail,
      customerMobilePhone,
    };
  }, [params]);

  const returnParams = useMemo(() => ({
    fundingId: paymentInfo.fundingId,
    numericOrderId: paymentInfo.numericOrderId,
    expectedAmount: Number.isFinite(paymentInfo.amount) ? String(paymentInfo.amount) : '',
    orderName: paymentInfo.orderName,
  }), [paymentInfo.amount, paymentInfo.fundingId, paymentInfo.numericOrderId, paymentInfo.orderName]);

  const html = useMemo(() => {
    if (!TOSS_CLIENT_KEY || !paymentInfo.orderId || !Number.isFinite(paymentInfo.amount) || paymentInfo.amount <= 0) {
      return '';
    }
    return buildTossHtml({
      clientKey: TOSS_CLIENT_KEY,
      customerKey: makeCustomerKey(paymentInfo.orderId),
      amount: paymentInfo.amount,
      orderId: paymentInfo.orderId,
      orderName: paymentInfo.orderName,
      customerName: paymentInfo.customerName,
      customerEmail: paymentInfo.customerEmail,
      customerMobilePhone: paymentInfo.customerMobilePhone,
      successUrl: buildReturnUrl('success', returnParams),
      failUrl: buildReturnUrl('fail', returnParams),
    });
  }, [paymentInfo, returnParams]);

  const goBackToFunding = useCallback(() => {
    if (paymentInfo.fundingId) {
      router.replace(`/funding/${paymentInfo.fundingId}` as any);
      return;
    }
    router.replace('/funding' as any);
  }, [paymentInfo.fundingId]);

  const handleReturnUrl = useCallback((url: string) => {
    if (!isTossReturnUrl(url) || handledReturnRef.current) return false;
    handledReturnRef.current = true;
    const urlParams = parseUrlParams(url);
    const routeParams = {
      ...returnParams,
      paymentKey: urlParams.paymentKey,
      orderId: urlParams.orderId || paymentInfo.orderId,
      amount: urlParams.amount || String(paymentInfo.amount),
      code: urlParams.code,
      message: urlParams.message,
    };
    console.log('[TossPayment] return url received', {
      type: url.startsWith(`${TOSS_RETURN_ORIGIN}/funding/payment/success`) ? 'success' : 'fail',
      hasPaymentKey: Boolean(routeParams.paymentKey),
      orderId: routeParams.orderId,
      amount: routeParams.amount,
      expectedAmount: returnParams.expectedAmount,
      fundingId: returnParams.fundingId,
      numericOrderId: returnParams.numericOrderId,
      code: routeParams.code,
      message: routeParams.message,
    });
    if (url.startsWith(`${TOSS_RETURN_ORIGIN}/funding/payment/success`)) {
      router.replace({ pathname: '/funding/payment/success', params: routeParams } as any);
      return true;
    }
    router.replace({ pathname: '/funding/payment/fail', params: routeParams } as any);
    return true;
  }, [paymentInfo.amount, paymentInfo.orderId, returnParams]);

  const handleExternalUrl = useCallback((url: string) => {
    if (!shouldOpenOutsideWebView(url)) return false;
    if (lastExternalUrlRef.current === url) return true;
    lastExternalUrlRef.current = url;
    const convertedIntentUrl = convertIntentUrl(url);
    void openFirstAvailableUrl(convertedIntentUrl ? [convertedIntentUrl.appLink, convertedIntentUrl.fallbackUrl, convertedIntentUrl.marketUrl] : [url]).catch(() => {
      const message = '외부 결제 앱을 열 수 없습니다. 시연 중에는 토스뱅크/앱카드 대신 카드번호 입력처럼 WebView 안에서 완료 가능한 테스트 결제수단을 선택해주세요.';
      setWebError(message);
      Alert.alert('결제 앱을 열 수 없습니다', message);
    });
    return true;
  }, []);

  const canOpenPayment = Boolean(TOSS_CLIENT_KEY && html);

  if (!canOpenPayment) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={goBackToFunding}>
            <X size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>결제 진행</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.center}>
          <Text style={styles.title}>결제 정보를 확인할 수 없습니다</Text>
          <Text style={styles.body}>토스 클라이언트 키 또는 주문 정보가 비어 있습니다. Expo를 재시작한 뒤 다시 시도해주세요.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={goBackToFunding}>
            <Text style={styles.primaryButtonText}>펀딩 상세로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={goBackToFunding}>
          <X size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>토스 테스트 결제</Text>
        <View style={styles.headerSpacer} />
      </View>
      {!webViewReady && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color="#111827" />
          <Text style={styles.loadingText}>결제창 준비 중</Text>
        </View>
      )}
      {webError ? <Text style={styles.errorText}>{webError}</Text> : null}
      <WebView
        style={styles.webView}
        originWhitelist={['*']}
        source={{ html, baseUrl: TOSS_RETURN_ORIGIN }}
        javaScriptEnabled
        domStorageEnabled
        javaScriptCanOpenWindowsAutomatically
        setSupportMultipleWindows={false}
        onLoadEnd={() => setWebViewReady(true)}
        onError={(event) => setWebError(event.nativeEvent.description)}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data) as { type?: string; message?: string };
            if (data.type === 'error' && data.message) setWebError(data.message);
          } catch {
            setWebError(event.nativeEvent.data);
          }
        }}
        onShouldStartLoadWithRequest={(request) => {
          if (handleReturnUrl(request.url)) return false;
          if (handleExternalUrl(request.url)) return false;
          return true;
        }}
        onNavigationStateChange={(state) => {
          if (handleReturnUrl(state.url)) return;
          handleExternalUrl(state.url);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  webView: { flex: 1 },
  header: {
    height: 56,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, color: '#111827', fontWeight: '900' },
  headerSpacer: { width: 44, height: 44 },
  loadingOverlay: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  loadingText: { fontSize: 13, color: '#6B7280', fontWeight: '800' },
  errorText: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FEF2F2',
    color: '#991B1B',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
  },
  center: { flex: 1, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, color: '#111827', fontWeight: '900', textAlign: 'center', marginBottom: 10 },
  body: { fontSize: 14, lineHeight: 22, color: '#6B7280', fontWeight: '700', textAlign: 'center', marginBottom: 24 },
  primaryButton: { width: '100%', height: 54, borderRadius: 14, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
});
