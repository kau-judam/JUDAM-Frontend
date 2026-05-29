import { StyleSheet, View } from 'react-native';
import { Star } from 'lucide-react-native';

type FundingStarRatingProps = {
  rating?: number | null;
  size?: number;
  gap?: number;
};

export default function FundingStarRating({ rating, size = 16, gap = 2 }: FundingStarRatingProps) {
  const value = Number(rating ?? 0);
  const safeValue = Number.isFinite(value) ? value : 0;

  const getStarType = (index: number) => {
    const starValue = index + 1;
    if (safeValue >= starValue) return 'full';
    if (safeValue >= starValue - 0.5) return 'half';
    return 'empty';
  };

  return (
    <View style={[styles.row, { gap }]}>
      {[0, 1, 2, 3, 4].map((index) => {
        const type = getStarType(index);
        return (
          <View key={index} style={{ width: size, height: size }}>
            <Star size={size} color={type === 'empty' ? '#D1D5DB' : '#F59E0B'} fill={type === 'full' ? '#F59E0B' : 'transparent'} />
            {type === 'half' && (
              <View style={[styles.halfFill, { width: size / 2, height: size }]}>
                <Star size={size} color="#F59E0B" fill="#F59E0B" />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  halfFill: { position: 'absolute', left: 0, top: 0, overflow: 'hidden' },
});
