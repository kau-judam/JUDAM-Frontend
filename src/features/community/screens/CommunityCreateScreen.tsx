import React, { useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ChevronLeft, Image as ImageIcon, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunity } from '@/contexts/CommunityContext';

const BOARDS = ['자유', '정보'] as const;

type Board = (typeof BOARDS)[number];
type NoticeState = {
  title: string;
  body?: string;
  onConfirm?: () => void;
} | null;

export default function CommunityCreateScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { addPost } = useCommunity();
  const [selectedBoard, setSelectedBoard] = useState<Board>('자유');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [notice, setNotice] = useState<NoticeState>(null);
  const imageCountLabel = `사진 추가 (${imageUris.length}/5)`;

  const showNotice = (titleText: string, body?: string, onConfirm?: () => void) => {
    setNotice({ title: titleText, body, onConfirm });
  };

  const handleNoticeConfirm = () => {
    const nextAction = notice?.onConfirm;
    setNotice(null);
    nextAction?.();
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { height: insets.top + 56, paddingTop: insets.top }]}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <ChevronLeft size={26} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>새 게시글 작성</Text>
          <View style={styles.iconBtn} />
        </View>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedTitle}>로그인이 필요합니다</Text>
          <Text style={styles.lockedDesc}>커뮤니티 글 작성은 로그인한 사용자만 이용할 수 있어요.</Text>
          <Button label="로그인하러 가기" onPress={() => router.push('/login' as any)} style={styles.lockedButton} />
        </View>
      </View>
    );
  }

  const handleAddImage = async () => {
    if (imageUris.length >= 5) {
      showNotice('최대 5개까지 업로드 가능합니다.');
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showNotice('갤러리 접근 권한이 필요합니다.', '사진을 추가하려면 갤러리 접근 권한을 허용해주세요.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.9,
    });

    if (!result.canceled) {
      setImageUris((prev) => [...prev, result.assets[0].uri].slice(0, 5));
    }
  };

  const handleRemoveImage = (uri: string) => {
    setImageUris((prev) => prev.filter((item) => item !== uri));
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      showNotice('제목과 내용을 모두 입력해주세요.');
      return;
    }

    addPost({
      id: Date.now(),
      author: user?.name || '나',
      authorType: user?.type || 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      title: title.trim(),
      content: content.trim(),
      likes: 0,
      comments: 0,
      timestamp: '방금',
      liked: false,
      category: selectedBoard === '자유' ? '자유게시판' : '정보게시판',
      image: imageUris[0],
      tags: [selectedBoard],
    });

    showNotice('게시글이 등록되었습니다!', undefined, () => router.replace('/community' as any));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { height: insets.top + 56, paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>새 게시글 작성</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>게시판 카테고리 선택</Text>
          <View style={styles.boardRow}>
            {BOARDS.map((board) => (
              <TouchableOpacity
                key={board}
                style={[styles.boardChip, selectedBoard === board && styles.boardChipActive]}
                activeOpacity={0.85}
                onPress={() => setSelectedBoard(board)}
              >
                <Text style={[styles.boardChipText, selectedBoard === board && styles.boardChipTextActive]}>
                  {board}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="제목을 입력하세요..."
          placeholderTextColor="#6B7280"
        />

        <TextInput
          style={styles.textarea}
          value={content}
          onChangeText={setContent}
          placeholder="전통주에 대한 자유로운 생각이나 질문을 남겨보세요..."
          placeholderTextColor="#9CA3AF"
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.imageButton} activeOpacity={0.82} onPress={handleAddImage}>
          <ImageIcon size={20} color="#4B5563" />
          <Text style={styles.imageButtonText}>{imageCountLabel}</Text>
        </TouchableOpacity>

        {imageUris.length > 0 && (
          <View style={styles.imagePreviewGrid}>
            {imageUris.map((uri) => (
              <View key={uri} style={styles.imagePreviewItem}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.imageRemoveButton}
                  onPress={() => handleRemoveImage(uri)}
                  activeOpacity={0.85}
                >
                  <X size={14} color="#FFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <Button
          label="게시글 등록하기"
          onPress={handleSubmit}
          style={styles.submitButton}
          labelStyle={styles.submitButtonText}
        />

        <View style={styles.guidelineBox}>
          <Text style={styles.guidelineText}>
            주담은 누구나 기분 좋게 참여할 수 있는 커뮤니티를 지향합니다. 타인을 비방하거나
            모욕하는 글, 무분별한 홍보 게시물은 무통보 삭제될 수 있습니다. 깨끗한 전통주 문화를
            위해 이용 규칙을 준수해 주세요.
          </Text>
        </View>
      </ScrollView>

      <NoticeModal notice={notice} onClose={() => setNotice(null)} onConfirm={handleNoticeConfirm} />
    </View>
  );
}

function NoticeModal({
  notice,
  onClose,
  onConfirm,
}: {
  notice: NoticeState;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal transparent visible={notice !== null} animationType="fade" onRequestClose={onClose}>
      <View style={styles.noticeOverlay}>
        <View style={styles.noticeCard}>
          <View style={[styles.noticeHeader, !notice?.body && styles.noticeHeaderCompact]}>
            <Text style={styles.noticeTitle}>{notice?.title}</Text>
          </View>
          {notice?.body && (
            <View style={styles.noticeBody}>
              <Text style={styles.noticeBodyText}>{notice.body}</Text>
            </View>
          )}
          <View style={styles.noticeFooter}>
            <TouchableOpacity style={styles.noticeConfirmBtn} onPress={onConfirm} activeOpacity={0.85}>
              <Text style={styles.noticeConfirmText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  content: { paddingHorizontal: 20, paddingTop: 24, gap: 20 },
  fieldGroup: { gap: 12 },
  label: { fontSize: 14, fontWeight: '700', color: '#374151' },
  boardRow: { flexDirection: 'row', gap: 8 },
  boardChip: {
    minWidth: 76,
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardChipActive: { backgroundColor: '#111' },
  boardChipText: { fontSize: 14, fontWeight: '700', color: '#4B5563' },
  boardChipTextActive: { color: '#FFF' },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  textarea: {
    minHeight: 300,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: '#111',
  },
  imageButton: {
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imageButtonText: { fontSize: 15, fontWeight: '700', color: '#4B5563' },
  imagePreviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: -8,
  },
  imagePreviewItem: {
    position: 'relative',
    width: 88,
    height: 88,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageRemoveButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: { height: 52, borderRadius: 14, backgroundColor: '#111' },
  submitButtonText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  lockedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  lockedTitle: { fontSize: 22, fontWeight: '900', color: '#111', marginBottom: 10 },
  lockedDesc: { fontSize: 14, fontWeight: '600', color: '#6B7280', lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  lockedButton: { width: '100%', height: 52, borderRadius: 14 },
  guidelineBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  guidelineText: { fontSize: 12, lineHeight: 20, fontWeight: '500', color: '#6B7280' },
  noticeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  noticeCard: {
    width: '100%',
    maxWidth: 430,
    borderRadius: 18,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  noticeHeader: {
    minHeight: 82,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 18,
  },
  noticeHeaderCompact: {
    minHeight: 94,
    paddingBottom: 14,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 28,
  },
  noticeBody: {
    paddingHorizontal: 28,
    paddingTop: 2,
    paddingBottom: 24,
  },
  noticeBodyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
    lineHeight: 26,
  },
  noticeFooter: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  noticeConfirmBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeConfirmText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
