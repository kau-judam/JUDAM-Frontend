import { memo } from 'react';
import { Image, GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Heart, Image as ImageIcon } from 'lucide-react-native';

import { Progress } from '@/components/ui/progress';
import {
  getFundingProjectImageSource,
  getFundingProjectStatusTone,
  getFundingProjectStatusLabel,
  isFundingProjectSupportable,
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
  const progressPercentage = project.goalAmount > 0 ? (project.currentAmount / project.goalAmount) * 100 : 0;
  const progressBarValue = Math.min(progressPercentage, 100);
  const statusTone = getFundingProjectStatusTone(project);
  const statusLabel = getFundingProjectStatusLabel(project);
  const isSupportable = isFundingProjectSupportable(project);
  const tasteMatchScore = getTasteMatchScore(project, tasteProfile);
  const showMatch = showTasteMatch && tasteMatchScore !== null;
  const matchTone = showMatch ? getMatchTone(tasteMatchScore) : null;
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
            <Image
              source={imageSource}
              style={styles.thumb}
            />
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
            <View style={[styles.statusBadge, getStatusBadgeStyle(statusTone)]}>
              <Text style={[styles.statusTxt, getStatusTextStyle(statusTone)]}>{statusLabel}</Text>
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
              <View style={styles.matchSignal}>
                <View style={[styles.signalDot, styles.signalDotRed, matchTone === 'red' && styles.signalDotActive]} />
                <View style={[styles.signalDot, styles.signalDotOrange, matchTone === 'orange' && styles.signalDotActive]} />
                <View style={[styles.signalDot, styles.signalDotGreen, matchTone === 'green' && styles.signalDotActive]} />
              </View>
              <Text style={[styles.matchBadgeTxt, matchTone && getMatchTextStyle(matchTone)]} numberOfLines={1}>
                {matchTone ? getMatchLabel(matchTone) : '내 술BTI와 잘 어울려요'}
              </Text>
            </View>
          )}
          <View style={styles.progressRow}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressPct}>{progressPercentage.toFixed(0)}%</Text>
              <Text style={styles.amountTxt}>{(project.currentAmount / 10000).toLocaleString()}만원</Text>
            </View>
            <Text style={styles.daysLeft}>{isSupportable ? `${project.daysLeft}일 남음` : statusLabel}</Text>
          </View>
          <Progress value={progressBarValue} style={styles.progressBar} indicatorStyle={{ backgroundColor: '#111' }} />
          <Text style={styles.supporterText}>{Math.max(0, project.backers || 0).toLocaleString()}명 참여</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(FundingProjectCard);

function getDisplayFavoriteCount(project: FundingProject, favorite: boolean) {
  return Math.max(0, project.favoriteCount || 0);
}

function formatFavoriteCount(count: number) {
  if (count > 999) return '999+';
  return String(count);
}

function getMatchTone(score: number) {
  if (score < 30) return 'red';
  if (score < 60) return 'orange';
  return 'green';
}

function getMatchTextStyle(tone: ReturnType<typeof getMatchTone>) {
  if (tone === 'red') return styles.matchBadgeTxtRed;
  if (tone === 'orange') return styles.matchBadgeTxtOrange;
  return styles.matchBadgeTxtGreen;
}

function getMatchLabel(tone: ReturnType<typeof getMatchTone>) {
  if (tone === 'red') return '내 술BTI와 어울리지 않아요.';
  if (tone === 'orange') return '내 술BTI와 괜찮은 매칭이에요.';
  return '내 술BTI와 잘 어울려요';
}

function getStatusBadgeStyle(tone: ReturnType<typeof getFundingProjectStatusTone>) {
  if (tone === 'success') return styles.statusBadgeSuccess;
  if (tone === 'failed') return styles.statusBadgeFailed;
  if (tone === 'ended') return styles.statusBadgeEnded;
  if (tone === 'reviewing') return styles.statusBadgeReviewing;
  if (tone === 'neutral') return styles.statusBadgeNeutral;
  return styles.statusBadgeActive;
}

function getStatusTextStyle(tone: ReturnType<typeof getFundingProjectStatusTone>) {
  if (tone === 'success') return styles.statusTxtSuccess;
  if (tone === 'failed') return styles.statusTxtFailed;
  if (tone === 'ended') return styles.statusTxtEnded;
  if (tone === 'reviewing') return styles.statusTxtReviewing;
  if (tone === 'neutral') return styles.statusTxtNeutral;
  return styles.statusTxtActive;
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
  statusBadgeSuccess: { backgroundColor: '#DCFCE7' },
  statusBadgeFailed: { backgroundColor: '#F3F4F6' },
  statusBadgeEnded: { backgroundColor: '#F3F4F6' },
  statusBadgeReviewing: { backgroundColor: '#FEF3C7' },
  statusBadgeNeutral: { backgroundColor: '#F3F4F6' },
  statusTxt: { fontSize: 10, fontWeight: '900' },
  statusTxtActive: { color: '#059669' },
  statusTxtSuccess: { color: '#15803D' },
  statusTxtFailed: { color: '#6B7280' },
  statusTxtEnded: { color: '#6B7280' },
  statusTxtReviewing: { color: '#B45309' },
  statusTxtNeutral: { color: '#4B5563' },
  ownProjectBadge: { alignSelf: 'flex-start', backgroundColor: '#111', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 6 },
  ownProjectTxt: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  projectTitle: { fontSize: 16, fontWeight: '800', color: '#111', lineHeight: 22, marginBottom: 8 },
  matchBadge: { alignSelf: 'flex-start', maxWidth: '100%', minHeight: 30, borderRadius: 999, paddingHorizontal: 10, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 8 },
  matchSignal: { width: 36, height: 16, borderRadius: 999, backgroundColor: '#EEF0F3', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, paddingHorizontal: 4 },
  signalDot: { width: 7, height: 7, borderRadius: 4, opacity: 0.28 },
  signalDotActive: { width: 9, height: 9, borderRadius: 5, opacity: 1 },
  signalDotRed: { backgroundColor: '#EF4444' },
  signalDotOrange: { backgroundColor: '#F59E0B' },
  signalDotGreen: { backgroundColor: '#22C55E' },
  matchBadgeTxt: { flexShrink: 1, fontSize: 11, fontWeight: '900', color: '#111' },
  matchBadgeTxtRed: { color: '#DC2626' },
  matchBadgeTxtOrange: { color: '#D97706' },
  matchBadgeTxtGreen: { color: '#16A34A' },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 },
  progressTextRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  progressPct: { fontSize: 22, fontWeight: '900', color: '#111' },
  amountTxt: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
  daysLeft: { fontSize: 12, fontWeight: '800', color: '#111' },
  progressBar: { height: 6, borderRadius: 3 },
  supporterText: { marginTop: 6, fontSize: 11, fontWeight: '700', color: '#6B7280' },
});
