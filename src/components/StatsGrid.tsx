import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type StatsGridItem = {
  key: string;
  icon: React.ReactNode;
  value: string;
  label: string;
  description?: string;
};

type StatsGridProps = {
  items: StatsGridItem[];
};

export function StatsGrid({ items }: StatsGridProps) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.key} style={styles.card}>
          <View style={styles.iconBox}>
            {item.icon}
          </View>
          <Text style={styles.value} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.72}>
            {item.value}
          </Text>
          <Text style={styles.label} numberOfLines={2}>
            {item.label}
          </Text>
          {item.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 148,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 18,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#111827',
  },
  value: {
    width: '100%',
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 5,
  },
  label: {
    width: '100%',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    color: '#374151',
  },
  description: {
    width: '100%',
    marginTop: 3,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    color: '#9CA3AF',
  },
});
