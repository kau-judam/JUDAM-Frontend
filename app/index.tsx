import { Redirect } from 'expo-router';

export default function Index() {
  // 스플래시 화면을 없애고 즉시 온보딩으로 이동
  return <Redirect href="/onboarding" />;
}
