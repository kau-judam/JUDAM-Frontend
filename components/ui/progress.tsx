import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface ProgressProps {
  value: number; // 0 to 100
  style?: ViewStyle;
  indicatorStyle?: ViewStyle;
}

export function Progress({ value, style, indicatorStyle }: ProgressProps) {
  const percentage = Math.max(0, Math.min(100, value));

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.indicator,
          { width: `${percentage}%` },
          indicatorStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  indicator: {
    height: '100%',
    backgroundColor: '#111111',
    borderRadius: 4,
  },
});
