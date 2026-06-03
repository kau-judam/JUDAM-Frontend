import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { AlertCircle, ChevronLeft, Image as ImageIcon, Plus, Trash2, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BREWING_STAGES, BrewingStage, JournalEntry, fundingProjects, getFundingProjectImageSource } from '@/constants/data';
import { useAuth } from '@/contexts/AuthContext';
import { useFunding } from '@/contexts/FundingContext';
import {
  createBreweryLog,
  deleteBreweryLog,
  getFundingApiErrorMessage,
  getFundingApiSafeMessage,
  getFundingBreweryLogs,
  updateBreweryLog,
  type FundingBreweryLogStage,
  type FundingUploadFile,
} from '@/features/funding/api';
import { mapBreweryLogs } from '@/features/funding/apiMappers';
import { isFundingProjectOwnedByBrewery } from '@/features/funding/ownership';

function todayText() {
  const today = new Date();
  return `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}`;
}

const BREWING_STAGE_TO_API_STAGE: Record<BrewingStage, FundingBreweryLogStage> = {
  1: 'INGREDIENT',
  2: 'PROCESSING',
  3: 'FERMENTATION',
  4: 'FILTERING',
  5: 'BOTTLING',
};

function getImageFileName(uri: string, index: number) {
  const rawName = uri.split('/').pop()?.split('?')[0];
  if (rawName && rawName.includes('.')) return rawName;
  return `brewery-log-${Date.now()}-${index}.jpg`;
}

function getImageMimeType(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (extension === 'png') return 'image/png';
  return 'image/jpeg';
}

function isNetworkRequestFailed(error: unknown) {
  return error instanceof Error && error.message.toLowerCase().includes('network request failed');
}

function waitForRetry() {
  return new Promise((resolve) => setTimeout(resolve, 450));
}

function isSameJournalEntry(entry: JournalEntry, target: JournalEntry) {
  return (
    entry === target ||
    (entry.id === target.id &&
      entry.stage === target.stage &&
      entry.date === target.date &&
      entry.title === target.title &&
      entry.content === target.content)
  );
}

function replaceSingleJournalEntry(journals: JournalEntry[], target: JournalEntry, replacement: JournalEntry) {
  let replaced = false;
  return journals.map((entry) => {
    if (!replaced && isSameJournalEntry(entry, target)) {
      replaced = true;
      return replacement;
    }
    return entry;
  });
}

function removeSingleJournalEntry(journals: JournalEntry[], target: JournalEntry) {
  let removed = false;
  return journals.filter((entry) => {
    if (!removed && isSameJournalEntry(entry, target)) {
      removed = true;
      return false;
    }
    return true;
  });
}

export default function BreweryJournalManageScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();
  const { projects, updateProjectJournals } = useFunding();
  const projectId = Number(Array.isArray(id) ? id[0] : id);
  const project = useMemo(
    () => projects.find((item) => item.id === projectId) || fundingProjects.find((item) => item.id === projectId) || null,
    [projectId, projects],
  );
  const [selectedStage, setSelectedStage] = useState<BrewingStage | null>(null);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageFilesByUri, setImageFilesByUri] = useState<Record<string, FundingUploadFile>>({});
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [serverJournals, setServerJournals] = useState<JournalEntry[] | null>(null);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDeleteEntry, setPendingDeleteEntry] = useState<JournalEntry | null>(null);
  const [deletingEntryId, setDeletingEntryId] = useState<number | null>(null);

  const journals = serverJournals ?? project?.journals ?? [];
  const canManage = Boolean(user?.isBreweryVerified && isFundingProjectOwnedByBrewery(user, project));

  useEffect(() => {
    if (!projectId || !canManage) return;

    let mounted = true;
    getFundingBreweryLogs(projectId)
      .then((response) => {
        if (!mounted) return;
        const nextJournals = mapBreweryLogs(response.logs);
        setServerJournals(nextJournals);
        updateProjectJournals(projectId, nextJournals);
      })
      .catch((error) => {
        if (!mounted) return;
        setMessage(getFundingApiErrorMessage(error, '양조일지를 불러오지 못했습니다.'));
      });

    return () => {
      mounted = false;
    };
  }, [canManage, projectId, updateProjectJournals]);

  const resetForm = () => {
    setEditingEntry(null);
    setTitle('');
    setContent('');
    setVideoUrl('');
    setImages([]);
    setImageFilesByUri({});
    setOriginalImages([]);
  };

  const openEditor = (stage: BrewingStage, entry?: JournalEntry) => {
    setSelectedStage(stage);
    setEditingEntry(entry || null);
    setTitle(entry?.title || '');
    setContent(entry?.content || '');
    setVideoUrl(entry?.videoUrl || '');
    setImages(entry?.images || []);
    setOriginalImages(entry?.images || []);
    setImageFilesByUri({});
  };

  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setMessage('양조일지 이미지를 등록하려면 갤러리 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.9,
    });

    if (result.canceled) return;
    const selectedImages = result.assets.reduce<FundingUploadFile[]>((files, asset, index) => {
        if (!asset.uri) return files;
        const name = asset.fileName || getImageFileName(asset.uri, index);
        files.push({
          uri: asset.uri,
          name,
          mimeType: asset.mimeType || getImageMimeType(name),
        });
        return files;
      }, []);
    setImages((prev) => [...prev, ...selectedImages.map((asset) => asset.uri)].slice(0, 5));
    setImageFilesByUri((prev) => {
      const next = { ...prev };
      selectedImages.forEach((asset) => {
        next[asset.uri] = asset;
      });
      return next;
    });
  };

  const saveJournal = async () => {
    if (!project || !selectedStage || isSaving) return;
    if (!title.trim()) {
      setMessage('양조일지 제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      setMessage('양조일지 내용을 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      const localImageFiles = images.map((image) => imageFilesByUri[image]).filter((file): file is FundingUploadFile => Boolean(file));
      const submitBreweryLog = () => editingEntry
        ? updateBreweryLog(project.id, editingEntry.id, {
            stage: BREWING_STAGE_TO_API_STAGE[selectedStage],
            title: title.trim(),
            content: content.trim(),
            videoUrl: videoUrl.trim(),
            images: localImageFiles,
            deleteImageUrls: originalImages.filter((image) => !images.includes(image)),
          })
        : createBreweryLog(project.id, {
            stage: BREWING_STAGE_TO_API_STAGE[selectedStage],
            title: title.trim(),
            content: content.trim(),
            videoUrl: videoUrl.trim() || undefined,
            images: localImageFiles,
          });
      let response: Awaited<ReturnType<typeof submitBreweryLog>>;
      try {
        response = await submitBreweryLog();
      } catch (error) {
        if (!isNetworkRequestFailed(error)) throw error;
        await waitForRetry();
        response = await submitBreweryLog();
      }

      const nextEntry: JournalEntry = {
        id: response.breweryLogId || editingEntry?.id || Date.now(),
        stage: selectedStage,
        date: editingEntry?.date || todayText(),
        title: response.title || title.trim(),
        content: response.content || content.trim(),
        images: response.imageUrls?.length ? response.imageUrls : images.length > 0 ? images : undefined,
        videoUrl: response.videoUrl || undefined,
        likes: editingEntry?.likes || 0,
        comments: editingEntry?.comments || [],
      };

      const nextJournals = editingEntry
        ? replaceSingleJournalEntry(journals, editingEntry, nextEntry)
        : [nextEntry, ...journals];

      setServerJournals(nextJournals);
      updateProjectJournals(project.id, nextJournals);
      resetForm();
      setSelectedStage(null);
      setMessage(getFundingApiSafeMessage(response.message, editingEntry ? '양조일지가 수정되었습니다.' : '양조일지가 저장되었습니다.'));
    } catch (error) {
      setMessage(getFundingApiErrorMessage(error, '양조일지를 저장하지 못했습니다.'));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteJournal = async (targetEntry: JournalEntry) => {
    if (!project || deletingEntryId !== null) return;
    setDeletingEntryId(targetEntry.id);
    try {
      await deleteBreweryLog(project.id, targetEntry.id);
      const nextJournals = removeSingleJournalEntry(journals, targetEntry);
      setServerJournals(nextJournals);
      updateProjectJournals(project.id, nextJournals);
      setPendingDeleteEntry(null);
      setMessage('양조일지가 삭제되었습니다.');
    } catch (error) {
      setPendingDeleteEntry(null);
      setMessage(getFundingApiErrorMessage(error, '양조일지를 삭제하지 못했습니다.'));
    } finally {
      setDeletingEntryId(null);
    }
  };

  if (!project || !canManage) {
    return (
      <View style={[styles.noticeScreen, { paddingTop: insets.top + 32 }]}>
        <AlertCircle size={44} color="#111" />
        <Text style={styles.noticeTitle}>{project ? '접근 권한이 없습니다' : '프로젝트를 찾을 수 없습니다'}</Text>
        <Text style={styles.noticeBody}>양조일지는 해당 프로젝트를 만든 인증 양조장만 관리할 수 있습니다.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.back()}>
          <Text style={styles.primaryButtonText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>양조일지 관리</Text>
          <Text style={styles.headerSub} numberOfLines={1}>{project.title}</Text>
        </View>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.push(`/funding/${project.id}?tab=journal` as any)}>
          <Text style={styles.viewText}>보기</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 36 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.projectCard}>
          <Image source={getFundingProjectImageSource(project)} style={styles.projectImage} />
          <View style={styles.projectInfo}>
            <Text style={styles.projectBrewery}>{project.brewery}</Text>
            <Text style={styles.projectTitle} numberOfLines={2}>{project.title}</Text>
            <Text style={styles.projectSub}>{journals.length}개의 양조일지 작성됨</Text>
          </View>
        </View>

        <View style={styles.stageList}>
          {BREWING_STAGES.map((stage) => {
            const stageJournals = journals.filter((entry) => entry.stage === stage.id);
            return (
              <View key={stage.id} style={styles.stageCard}>
                <View style={styles.stageTop}>
                  <View style={[styles.stageNumber, stageJournals.length > 0 && styles.stageNumberActive]}>
                    <Text style={[styles.stageNumberText, stageJournals.length > 0 && styles.stageNumberTextActive]}>{stage.id}</Text>
                  </View>
                  <View style={styles.stageTextArea}>
                    <Text style={styles.stageTitle}>{stage.name}</Text>
                    <Text style={styles.stageSub}>{stageJournals.length > 0 ? `${stageJournals.length}개 일지` : '작성된 일지 없음'}</Text>
                  </View>
                  <TouchableOpacity style={styles.stageWriteButton} onPress={() => openEditor(stage.id)}>
                    <Plus size={16} color="#FFF" />
                    <Text style={styles.stageWriteText}>{stageJournals.length > 0 ? '추가' : '작성'}</Text>
                  </TouchableOpacity>
                </View>

                {stageJournals.map((entry, index) => (
                  <View key={`${stage.id}-${entry.id}-${index}`} style={styles.entryCard}>
                    <View style={styles.entryTop}>
                      <View style={styles.entryTextArea}>
                        <Text style={styles.entryTitle}>{entry.title}</Text>
                        <Text style={styles.entryDate}>{entry.date}</Text>
                      </View>
                      <TouchableOpacity style={styles.entryAction} onPress={() => openEditor(stage.id, entry)}>
                        <Text style={styles.entryActionText}>수정</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.entryDelete} onPress={() => setPendingDeleteEntry(entry)}>
                        <Trash2 size={16} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.entryBody} numberOfLines={3}>{entry.content}</Text>
                    {entry.images?.[0] && <Image source={{ uri: entry.images[0] }} style={styles.entryImage} />}
                    {entry.videoUrl ? (
                      <View style={styles.entryUrlBox}>
                        <Text style={styles.entryUrlLabel}>영상 URL</Text>
                        <Text style={styles.entryUrlText} numberOfLines={2}>{entry.videoUrl}</Text>
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <Modal visible={selectedStage !== null} animationType="slide" onRequestClose={() => { setSelectedStage(null); resetForm(); }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.editorScreen}>
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <TouchableOpacity style={styles.headerIcon} onPress={() => { setSelectedStage(null); resetForm(); }}>
              <X size={24} color="#111" />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>{editingEntry ? '양조일지 수정' : '양조일지 작성'}</Text>
              <Text style={styles.headerSub}>{BREWING_STAGES.find((stage) => stage.id === selectedStage)?.name}</Text>
            </View>
            <View style={styles.headerIcon} />
          </View>
          <ScrollView contentContainerStyle={[styles.editorContent, { paddingBottom: insets.bottom + 24 }]} keyboardShouldPersistTaps="handled">
            <View style={styles.formGroup}>
              <Text style={styles.label}>제목</Text>
              <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="예: 원료 검수 완료" placeholderTextColor="#9CA3AF" />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>내용</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={content}
                onChangeText={setContent}
                placeholder="후원자에게 공유할 양조 과정을 자세히 작성해주세요."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>영상 URL <Text style={styles.optionalText}>(선택)</Text></Text>
              <TextInput
                style={styles.input}
                value={videoUrl}
                onChangeText={setVideoUrl}
                placeholder="영상 링크를 입력해주세요."
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                keyboardType="url"
              />
              <Text style={styles.helper}>동영상 플레이어를 넣지 않고 URL만 후원자에게 표시합니다.</Text>
            </View>
            <View style={styles.formGroup}>
              <View style={styles.rowBetween}>
                <Text style={styles.label}>이미지</Text>
                <Text style={styles.helper}>{images.length}/5</Text>
              </View>
              <TouchableOpacity style={styles.imagePickButton} onPress={pickImages}>
                <ImageIcon size={20} color="#4B5563" />
                <Text style={styles.imagePickText}>이미지 추가</Text>
              </TouchableOpacity>
              <View style={styles.imageGrid}>
                {images.map((image, index) => (
                  <View key={`${image}-${index}`} style={styles.imageThumbWrap}>
                    <Image source={{ uri: image }} style={styles.imageThumb} />
                    <TouchableOpacity style={styles.imageRemove} onPress={() => setImages((prev) => prev.filter((_, itemIndex) => itemIndex !== index))}>
                      <X size={12} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
            <TouchableOpacity style={[styles.saveButton, isSaving && { opacity: 0.6 }]} onPress={saveJournal} disabled={isSaving}>
              <Text style={styles.saveButtonText}>{isSaving ? '저장 중...' : '저장하기'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        transparent
        visible={Boolean(pendingDeleteEntry)}
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        hardwareAccelerated
        onRequestClose={() => {
          if (deletingEntryId === null) setPendingDeleteEntry(null);
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.messageCard}>
            <Text style={styles.messageTitle}>양조일지를 삭제할까요?</Text>
            <Text style={styles.messageBody}>삭제한 양조일지는 다시 복구할 수 없습니다.</Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.confirmCancelButton]}
                onPress={() => setPendingDeleteEntry(null)}
                disabled={deletingEntryId !== null}
              >
                <Text style={styles.confirmCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.confirmDeleteButton, deletingEntryId !== null && styles.disabledButton]}
                onPress={() => {
                  if (pendingDeleteEntry) void deleteJournal(pendingDeleteEntry);
                }}
                disabled={deletingEntryId !== null}
              >
                <Text style={styles.confirmDeleteText}>{deletingEntryId !== null ? '삭제 중...' : '삭제'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={Boolean(message)} animationType="fade" statusBarTranslucent navigationBarTranslucent hardwareAccelerated>
        <View style={styles.modalBackdrop}>
          <View style={styles.messageCard}>
            <Text style={styles.messageTitle}>알림</Text>
            <Text style={styles.messageBody}>{message}</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setMessage('')}>
              <Text style={styles.primaryButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F9FAFB' },
  editorScreen: { flex: 1, backgroundColor: '#FFF' },
  header: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', minHeight: 56, paddingHorizontal: 8, paddingBottom: 8, flexDirection: 'row', alignItems: 'center' },
  headerIcon: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1, minWidth: 0 },
  headerTitle: { fontSize: 17, fontWeight: '900', color: '#111' },
  headerSub: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginTop: 2 },
  viewText: { fontSize: 13, fontWeight: '900', color: '#111' },
  content: { padding: 16, gap: 16 },
  projectCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 14, flexDirection: 'row', gap: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  projectImage: { width: 82, height: 82, borderRadius: 14, backgroundColor: '#E5E7EB' },
  projectInfo: { flex: 1, justifyContent: 'center', minWidth: 0 },
  projectBrewery: { fontSize: 12, fontWeight: '800', color: '#6B7280', marginBottom: 4 },
  projectTitle: { fontSize: 16, fontWeight: '900', color: '#111', lineHeight: 22 },
  projectSub: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', marginTop: 6 },
  stageList: { gap: 12 },
  stageCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', gap: 12 },
  stageTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stageNumber: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  stageNumberActive: { backgroundColor: '#111' },
  stageNumberText: { fontSize: 15, fontWeight: '900', color: '#6B7280' },
  stageNumberTextActive: { color: '#FFF' },
  stageTextArea: { flex: 1, minWidth: 0 },
  stageTitle: { fontSize: 15, fontWeight: '900', color: '#111', lineHeight: 20 },
  stageSub: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', marginTop: 3 },
  stageWriteButton: { height: 38, borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#111', flexDirection: 'row', alignItems: 'center', gap: 4 },
  stageWriteText: { fontSize: 12, fontWeight: '900', color: '#FFF' },
  entryCard: { backgroundColor: '#F9FAFB', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#F3F4F6', gap: 8 },
  entryTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  entryTextArea: { flex: 1, minWidth: 0 },
  entryTitle: { fontSize: 14, fontWeight: '900', color: '#111' },
  entryDate: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', marginTop: 2 },
  entryAction: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB' },
  entryActionText: { fontSize: 12, fontWeight: '900', color: '#111' },
  entryDelete: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center' },
  entryBody: { fontSize: 13, fontWeight: '600', color: '#4B5563', lineHeight: 20 },
  entryImage: { width: '100%', height: 160, borderRadius: 12, backgroundColor: '#E5E7EB' },
  entryUrlBox: { borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', padding: 10, gap: 4 },
  entryUrlLabel: { fontSize: 11, fontWeight: '900', color: '#6B7280' },
  entryUrlText: { fontSize: 12, fontWeight: '800', color: '#111', lineHeight: 18 },
  editorContent: { padding: 16, gap: 18 },
  formGroup: { gap: 8 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 14, fontWeight: '900', color: '#111' },
  optionalText: { fontSize: 12, fontWeight: '800', color: '#9CA3AF' },
  helper: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  input: { minHeight: 50, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 14, paddingHorizontal: 14, fontSize: 14, fontWeight: '700', color: '#111', backgroundColor: '#FFF' },
  textArea: { minHeight: 180, paddingTop: 14, paddingBottom: 14, lineHeight: 20 },
  imagePickButton: { height: 50, borderRadius: 14, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  imagePickText: { fontSize: 14, fontWeight: '800', color: '#4B5563' },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  imageThumbWrap: { width: 92, height: 92, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  imageThumb: { width: '100%', height: '100%' },
  imageRemove: { position: 'absolute', top: 5, right: 5, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.68)', alignItems: 'center', justifyContent: 'center' },
  saveButton: { height: 54, borderRadius: 16, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { fontSize: 16, fontWeight: '900', color: '#FFF' },
  noticeScreen: { flex: 1, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', padding: 28 },
  noticeTitle: { fontSize: 22, fontWeight: '900', color: '#111', marginTop: 16 },
  noticeBody: { fontSize: 14, fontWeight: '700', color: '#6B7280', textAlign: 'center', lineHeight: 22, marginTop: 8, marginBottom: 24 },
  primaryButton: { minHeight: 48, minWidth: 140, borderRadius: 14, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  primaryButtonText: { fontSize: 14, fontWeight: '900', color: '#FFF' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  messageCard: { width: '100%', maxWidth: 340, backgroundColor: '#FFF', borderRadius: 20, padding: 22, alignItems: 'center' },
  messageTitle: { fontSize: 18, fontWeight: '900', color: '#111', marginBottom: 8 },
  messageBody: { fontSize: 14, fontWeight: '700', color: '#4B5563', lineHeight: 20, textAlign: 'center', marginBottom: 20 },
  confirmActions: { width: '100%', flexDirection: 'row', gap: 10 },
  confirmButton: { flex: 1, minHeight: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  confirmCancelButton: { backgroundColor: '#F3F4F6' },
  confirmDeleteButton: { backgroundColor: '#DC2626' },
  confirmCancelText: { fontSize: 14, fontWeight: '900', color: '#111' },
  confirmDeleteText: { fontSize: 14, fontWeight: '900', color: '#FFF' },
  disabledButton: { opacity: 0.6 },
});
