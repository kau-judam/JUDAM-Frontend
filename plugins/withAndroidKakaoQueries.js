const { withAndroidManifest } = require('@expo/config-plugins');

const KAKAO_NATIVE_APP_KEY = 'f3b606d0a36f4db4e35d523e00648e8a';
const KAKAO_REDIRECT_SCHEME = `kakao${KAKAO_NATIVE_APP_KEY}`;

const hasQueryPackage = (queries, packageName) => (
  queries.package || []
).some((item) => item?.$?.['android:name'] === packageName);

const hasQueryIntentScheme = (queries, scheme) => (
  queries.intent || []
).some((intent) => (
  intent.data || []
).some((data) => data?.$?.['android:scheme'] === scheme));

const createViewIntentQuery = (scheme) => ({
  action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
  category: [{ $: { 'android:name': 'android.intent.category.BROWSABLE' } }],
  data: [{ $: { 'android:scheme': scheme } }],
});

module.exports = function withAndroidKakaoQueries(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    manifest.queries = manifest.queries || [{}];

    const queries = manifest.queries[0];
    queries.package = queries.package || [];
    queries.intent = queries.intent || [];

    if (!hasQueryPackage(queries, 'com.kakao.talk')) {
      queries.package.push({ $: { 'android:name': 'com.kakao.talk' } });
    }

    [KAKAO_REDIRECT_SCHEME, 'kakaotalk'].forEach((scheme) => {
      if (!hasQueryIntentScheme(queries, scheme)) {
        queries.intent.push(createViewIntentQuery(scheme));
      }
    });

    return config;
  });
};
