import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeft, RotateCw } from 'lucide-react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

export type DaumAddressResult = {
  zonecode: string;
  address: string;
  roadAddress?: string;
  jibunAddress?: string;
  buildingName?: string;
};

type DaumAddressSearchModalProps = {
  visible: boolean;
  insetsTop: number;
  title?: string;
  onClose: () => void;
  onSelect: (result: DaumAddressResult) => void;
};

const POSTCODE_HTML = `
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <style>
      html, body, #postcode {
        width: 100%;
        height: 100%;
        min-height: 100%;
        margin: 0;
        padding: 0;
        background: #ffffff;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .fallback {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        box-sizing: border-box;
        color: #6b7280;
        font-size: 14px;
        line-height: 1.5;
        text-align: center;
      }
    </style>
    <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
  </head>
  <body>
    <div id="postcode"></div>
    <script>
      function postMessage(type, payload) {
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(Object.assign({ type: type }, payload || {})));
      }

      function openPostcode() {
        if (!window.daum || !window.daum.Postcode) {
          document.getElementById('postcode').innerHTML = '<div class="fallback">주소 검색 화면을 불러오지 못했습니다.<br/>네트워크 연결을 확인한 뒤 다시 시도해주세요.</div>';
          postMessage('error', { message: '다음 주소 검색 스크립트를 불러오지 못했습니다.' });
          return;
        }

        new window.daum.Postcode({
          width: '100%',
          height: '100%',
          animation: true,
          oncomplete: function(data) {
            var address = data.roadAddress || data.jibunAddress || data.address || '';
            postMessage('selected', {
              zonecode: data.zonecode || '',
              address: address,
              roadAddress: data.roadAddress || '',
              jibunAddress: data.jibunAddress || '',
              buildingName: data.buildingName || ''
            });
          }
        }).embed(document.getElementById('postcode'));
      }

      if (document.readyState === 'complete') {
        setTimeout(openPostcode, 50);
      } else {
        window.addEventListener('load', function() {
          setTimeout(openPostcode, 50);
        });
      }
    </script>
  </body>
</html>
`;

export default function DaumAddressSearchModal({
  visible,
  insetsTop,
  title = '주소 검색',
  onClose,
  onSelect,
}: DaumAddressSearchModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const source = useMemo(() => ({ html: POSTCODE_HTML, baseUrl: 'https://postcode.map.daum.net' }), []);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data) as { type?: string } & DaumAddressResult & { message?: string };
      if (data.type === 'selected' && data.address) {
        onSelect({
          zonecode: data.zonecode || '',
          address: data.address,
          roadAddress: data.roadAddress,
          jibunAddress: data.jibunAddress,
          buildingName: data.buildingName,
        });
        onClose();
        return;
      }
      if (data.type === 'error') {
        setErrorMessage(data.message || '주소 검색 화면을 불러오지 못했습니다.');
      }
    } catch {
      setErrorMessage('주소 검색 결과를 처리하지 못했습니다.');
    }
  };

  const handleReload = () => {
    setErrorMessage('');
    setIsLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.screen}>
        <View style={[styles.header, { paddingTop: insetsTop }]}>
          <TouchableOpacity style={styles.headerButton} activeOpacity={0.75} onPress={onClose}>
            <ChevronLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity style={styles.headerButton} activeOpacity={0.75} onPress={handleReload}>
            <RotateCw size={19} color="#4B5563" />
          </TouchableOpacity>
        </View>

        <View style={styles.webviewWrap}>
          <WebView
            key={reloadKey}
            source={source}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            mixedContentMode="always"
            startInLoadingState
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setErrorMessage('주소 검색 화면을 불러오지 못했습니다.');
            }}
            onMessage={handleMessage}
            style={styles.webview}
          />
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color="#111827" />
              <Text style={styles.loadingText}>주소 검색을 불러오는 중입니다</Text>
            </View>
          )}
          {Boolean(errorMessage) && (
            <View style={styles.errorOverlay}>
              <Text style={styles.errorTitle}>주소 검색을 열 수 없어요</Text>
              <Text style={styles.errorText}>{errorMessage}</Text>
              <TouchableOpacity style={styles.retryButton} activeOpacity={0.85} onPress={handleReload}>
                <Text style={styles.retryText}>다시 불러오기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF' },
  header: {
    minHeight: 58,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '900', color: '#111827' },
  webviewWrap: { flex: 1, backgroundColor: '#FFF' },
  webview: { flex: 1, backgroundColor: '#FFF' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: { fontSize: 13, fontWeight: '800', color: '#6B7280' },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  errorTitle: { fontSize: 20, fontWeight: '900', color: '#111827', marginBottom: 8, textAlign: 'center' },
  errorText: { fontSize: 14, lineHeight: 22, fontWeight: '700', color: '#6B7280', textAlign: 'center', marginBottom: 18 },
  retryButton: { height: 50, borderRadius: 15, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 },
  retryText: { fontSize: 14, fontWeight: '900', color: '#FFF' },
});
