import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>안내</Text>
      <Link href="/" dismissTo style={styles.link}>
        홈으로 돌아가기
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  title: {
    color: Colors.light.text,
    fontSize: 24,
    fontWeight: '700',
  },
  link: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 12,
  },
});
