import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#111" />
      </View>
    );
  }

  return <Redirect href={user ? '/(tabs)' : '/onboarding'} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
});
