import { Alert } from 'react-native';
import { router } from 'expo-router';

export function showLoginRequired(message = '로그인 후 이용할 수 있어요.') {
  Alert.alert('로그인이 필요합니다', message, [
    { text: '취소', style: 'cancel' },
    { text: '로그인하기', onPress: () => router.push('/login' as any) },
  ]);
}
