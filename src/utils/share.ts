import { Share as NativeShare } from 'react-native';
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

export async function shareJudamLink(options: JudamShareOptions) {
  const title = options.title.trim();
  const description = options.description?.trim() || title;
  const imageUrl = options.imageUrl?.trim() || DEFAULT_JUDAM_SHARE_IMAGE_URL;
  const buttonTitle = options.buttonTitle?.trim() || '자세히 보기';

  try {
    await logKakaoDebugInfo('KakaoShare');
    const kakaoShareModule = await import('@react-native-kakao/share');
    const shareFeedTemplate = kakaoShareModule.shareFeedTemplate || kakaoShareModule.default?.shareFeedTemplate;

    if (typeof shareFeedTemplate === 'function') {
      console.info('[Share] Opening KakaoTalk share', {
        title,
        url: options.url,
        hasImage: Boolean(imageUrl),
      });
      await shareFeedTemplate({
        template: {
          content: {
            title,
            description,
            imageUrl,
            link: {
              webUrl: options.url,
              mobileWebUrl: options.url,
            },
          },
          buttons: [
            {
              title: buttonTitle,
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
      return;
    }

    console.warn('[Share] Kakao shareFeedTemplate is not available');
  } catch (error) {
    console.warn('[Share] Kakao share failed, fallback to NativeShare', error);
  }

  await NativeShare.share({
    title,
    message: buildNativeShareMessage({ ...options, title, description }),
    url: options.url,
  });
}
