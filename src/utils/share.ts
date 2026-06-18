import { Alert, Share as NativeShare } from 'react-native';

import { logKakaoDebugInfo } from '@/utils/kakaoDebug';

export const DEFAULT_JUDAM_SHARE_IMAGE_URL = 'https://kaujudam.com/og-image.png';

export type JudamShareOptions = {
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  buttonTitle?: string;
  nativeMessage?: string;
  serverCallbackArgs?: Record<string, string>;
};

function buildNativeShareMessage(options: JudamShareOptions) {
  return options.nativeMessage || [options.title, options.description, options.url].filter(Boolean).join('\n');
}

function getKakaoShareFunction<TArgs extends unknown[], TResult>(
  moduleValue: unknown,
  functionName: string,
): ((...args: TArgs) => TResult) | null {
  const moduleObject = moduleValue as Record<string, unknown> | null | undefined;
  const defaultObject = moduleObject?.default as Record<string, unknown> | null | undefined;
  const fn = moduleObject?.[functionName] || defaultObject?.[functionName];
  return typeof fn === 'function' ? (fn as (...args: TArgs) => TResult) : null;
}

async function tryShareWithKakao(options: JudamShareOptions & {
  title: string;
  description: string;
  imageUrl: string;
  buttonTitle: string;
}) {
  try {
    await logKakaoDebugInfo('KakaoShare');
  } catch (debugError) {
    console.warn('[Share] Kakao debug logging failed. Continue share fallback flow.', debugError);
  }

  let kakaoShareModule: unknown;
  try {
    kakaoShareModule = await import('@react-native-kakao/share');
  } catch (error) {
    console.warn('[Share] Kakao share native module is not available. Falling back to NativeShare.', error);
    return false;
  }

  const isKakaoTalkSharingAvailable = getKakaoShareFunction<[], Promise<boolean> | boolean>(
    kakaoShareModule,
    'isKakaoTalkSharingAvailable',
  );
  if (isKakaoTalkSharingAvailable) {
    try {
      const isAvailable = Boolean(await isKakaoTalkSharingAvailable());
      console.info('[Share] KakaoTalk share available', isAvailable);
    } catch (error) {
      console.warn('[Share] KakaoTalk share availability check failed. Continue safe share flow.', error);
    }
  }

  const shareFeedTemplate = getKakaoShareFunction<[Record<string, unknown>], Promise<void> | void>(
    kakaoShareModule,
    'shareFeedTemplate',
  );
  if (!shareFeedTemplate) {
    console.warn('[Share] Kakao shareFeedTemplate is not available. Falling back to NativeShare.');
    return false;
  }

  try {
    console.info('[Share] Opening KakaoTalk share', {
      title: options.title,
      url: options.url,
      hasImage: Boolean(options.imageUrl),
    });
    await shareFeedTemplate({
      template: {
        content: {
          title: options.title,
          description: options.description,
          imageUrl: options.imageUrl,
          link: {
            webUrl: options.url,
            mobileWebUrl: options.url,
          },
        },
        buttons: [
          {
            title: options.buttonTitle,
            link: {
              webUrl: options.url,
              mobileWebUrl: options.url,
            },
          },
        ],
      },
      useWebBrowserIfKakaoTalkNotAvailable: true,
      serverCallbackArgs: options.serverCallbackArgs,
    });
    console.info('[Share] KakaoTalk share completed');
    return true;
  } catch (error) {
    console.warn('[Share] Kakao share failed. Falling back to NativeShare.', error);
    return false;
  }
}

export async function shareJudamLink(options: JudamShareOptions) {
  const title = options.title.trim();
  const description = options.description?.trim() || title;
  const imageUrl = options.imageUrl?.trim() || DEFAULT_JUDAM_SHARE_IMAGE_URL;
  const buttonTitle = options.buttonTitle?.trim() || '자세히 보기';

  const didShareWithKakao = await tryShareWithKakao({
    ...options,
    title,
    description,
    imageUrl,
    buttonTitle,
  });
  if (didShareWithKakao) return true;

  try {
    await NativeShare.share({
      title,
      message: buildNativeShareMessage({ ...options, title, description }),
      url: options.url,
    });
    return true;
  } catch (error) {
    console.warn('[Share] NativeShare failed.', error);
    Alert.alert('공유 실패', '공유를 완료하지 못했습니다. 잠시 후 다시 시도해주세요.');
    return false;
  }
}
