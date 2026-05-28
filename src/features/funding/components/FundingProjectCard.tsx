import { memo } from 'react';
import { Image, GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Heart, Image as ImageIcon } from 'lucide-react-native';

import { Progress } from '@/components/ui/progress';
import {
  getFundingProjectImageSource,
  getFundingStatusLabel,
  isCompletedFundingStatus,
} from '@/constants/data';
import type { FundingProject, TasteProfile } from '@/constants/data';
import { getFundingMainIngredientLabel } from '@/features/funding/projectLabels';
import { getTasteMatchScore } from '@/features/funding/recommendation';

interface FundingProjectCardProps {
  project: FundingProject;
  favorite: boolean;
  ownProject?: boolean;
  showTasteMatch?: boolean;
  tasteProfile?: TasteProfile | null;
  onPress: () => void;
  onFavoritePress: (projectId: number) => void;
}

function FundingProjectCard({
  project,
  favorite,
  ownProject = false,
  showTasteMatch = false,
  tasteProfile = null,
  onPress,
  onFavoritePress,
}: FundingProjectCardProps) {
  const progressPercentage = project.goalAmount > 0 ? Math.min((project.currentAmount / project.goalAmount) * 100, 100) : 0;
  const completed = isCompletedFundingStatus(project.status);
  const tasteMatchScore = getTasteMatchScore(project, tasteProfile);
  const showMatch = showTasteMatch && tasteMatchScore !== null;
  const favoriteCount = getDisplayFavoriteCount(project, favorite);
  const favoriteCountLabel = formatFavoriteCount(favoriteCount);
  const imageSource = getFundingProjectImageSource(project);

  const handleFavoritePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onFavoritePress(project.id);
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.cardInner}>
        <View style={styles.thumbBox}>
          {imageSource ? (
            <Image source={imageSource} style={styles.thumb} />
          ) : (
            <View style={styles.emptyThumb}>
              <ImageIcon size={20} color="#9CA3AF" />
              <Text style={styles.emptyThumbText}>이미지 없음</Text>
            </View>
          )}
          <TouchableOpacity style={styles.heartBtn} onPress={handleFavoritePress}>
            <Heart size={25} color={favorite ? '#EF4444' : '#FFF'} fill={favorite ? '#EF4444' : 'rgba(17,17,17,0.35)'} />
            <Text style={[styles.heartCount, favorite && styles.heartCountActive]}>{favoriteCountLabel}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoBox}>
          <View style={styles.tagRow}>
            <Text style={styles.breweryName}>{project.brewery}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryTxt} numberOfLines={1}>{getFundingMainIngredientLabel(project)}</Text>
            </View>
            <View style={[styles.statusBadge, completed ? styles.statusBadgeSuccess : styles.statusBadgeActive]}>
              <Text style={[styles.statusTxt, completed && styles.statusTxtSuccess]}>{getFundingStatusLabel(project.status)}</Text>
            </View>
          </View>
          {ownProject && (
            <View style={styles.ownProjectBadge}>
              <Text style={styles.ownProjectTxt}>내 프로젝트</Text>
            </View>
          )}
          <Text style={styles.projectTitle} numberOfLines={2}>{project.title}</Text>
          {showMatch && (
            <View style={styles.matchBadge}>
              <Text style={styles.matchBadgeTxt}>내 술BTI와 {tasteMatchScore}% 매칭</Text>
            </View>
          )}
          <View style={styles.progressRow}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressPct}>{progressPercentage.toFixed(0)}%</Text>
              <Text style={styles.amountTxt}>{(project.currentAmount / 10000).toLocaleString()}만원</Text>
            </View>
            <Text style={styles.daysLeft}>{completed ? '펀딩 종료' : `${project.daysLeft}일 남음`}</Text>
          </View>
          <Progress value={progressPercentage} style={styles.progressBar} indicatorStyle={{ backgroundColor: '#111' }} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(FundingProjectCard);

function getDisplayFavoriteCount(project: FundingProject, favorite: boolean) {
  const baseCount = Math.max(0, project.favoriteCount || 0);
  if (typeof project.liked !== 'boolean' || project.liked === favorite) return baseCount;
  return Math.max(0, baseCount + (favorite ? 1 : -1));
}

function formatFavoriteCount(count: number) {
  if (count > 999) return '999+';
  return String(count);
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', borderRadius: 28, padding: 16, borderWidth: 1, borderColor: '#F3F4F6', elevation: 3, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10 },
  cardInner: { flexDirection: 'row', gap: 16 },
  thumbBox: { width: 100, height: 100, borderRadius: 20, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  thumb: { width: '100%', height: '100%', resizeMode: 'cover' },
  emptyThumb: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 5 },
  emptyThumbText: { fontSize: 10, fontWeight: '900', color: '#9CA3AF' },
  heartBtn: { position: 'absolute', bottom: 8, left: 8, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.42)', justifyContent: 'center', alignItems: 'center' },
  heartCount: { position: 'absolute', top: 13, left: 0, right: 0, textAlign: 'center', fontSize: 7, lineHeight: 8, fontWeight: '900', color: '#FFF', includeFontPadding: false },
  heartCountActive: { color: '#FFF' },
  infoBox: { flex: 1, justifyContent: 'space-between', minWidth: 0 },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  breweryName: { fontSize: 11, fontWeight: '800', color: '#6B7280' },
  categoryBadge: { maxWidth: 104, backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  categoryTxt: { fontSize: 10, fontWeight: '800', color: '#4B5563' },
  statusBadge: { marginLeft: 'auto', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusBadgeActive: { backgroundColor: '#ECFDF5' },
  statusBadgeSuccess: { backgroundColor: '#EFF6FF' },
  statusTxt: { fontSize: 10, fontWeight: '900', color: '#059669' },
  statusTxtSuccess: { color: '#2563EB' },
  ownProjectBadge: { alignSelf: 'flex-start', backgroundColor: '#111', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 6 },
  ownProjectTxt: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  projectTitle: { fontSize: 16, fontWeight: '800', color: '#111', lineHeight: 22, marginBottom: 8 },
  matchBadge: { alignSelf: 'flex-start', minHeight: 28, borderRadius: 999, paddingHorizontal: 10, backgroundColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  matchBadgeTxt: { fontSize: 11, fontWeight: '900', color: '#111' },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 },
  progressTextRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  progressPct: { fontSize: 22, fontWeight: '900', color: '#111' },
  amountTxt: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
  daysLeft: { fontSize: 12, fontWeight: '800', color: '#111' },
  progressBar: { height: 6, borderRadius: 3 },
});
