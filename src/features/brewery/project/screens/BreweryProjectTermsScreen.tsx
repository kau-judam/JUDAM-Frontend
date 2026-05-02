import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { AlertCircle, Check, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';

interface TermItem {
  id: string;
  title: string;
  detail: string;
}

const termsData: TermItem[] = [
  {
    id: 'age',
    title: '대표 제조자는 만 19세 이상의 성인이어야 합니다.',
    detail:
      '주류 제조 및 통신판매를 진행하는 법적 주체로서, 프로젝트를 개설하는 대표 제조자는 「민법」 제4조 및 「청소년 보호법」 제2조에 따른 만 19세 이상의 성인이어야 합니다. 미성년자 명의 도용 또는 타인 명의의 부당 사용이 확인될 경우, 「주민등록법」 제37조(벌칙)에 따라 고발 조치될 수 있으며, 플랫폼 이용약관에 의거하여 즉각적인 펀딩 취소 및 영구적인 계정 정지 조치가 취해집니다.',
  },
  {
    id: 'contact',
    title:
      '주담에서 필요시 연락드릴 수 있도록 본인 명의의 휴대폰 번호와 이메일 주소가 필요합니다.',
    detail:
      '「전자상거래 등에서의 소비자보호에 관한 법률」 제20조 제2항에 따라 통신판매중개업자인 주담은 소비자(후원자)에게 통신판매의뢰자(양조장)의 신원 정보를 제공할 의무가 있습니다. 이를 위해 프로젝트 심사, 정산, 그리고 분쟁 발생 시 즉각적인 연락이 가능한 본인 또는 법인 명의의 유효한 연락처를 수집합니다. 수집된 정보는 「개인정보 보호법」 제15조에 따라 목적 달성 및 법정 보유 기간 경과 후 안전하게 파기됩니다.',
  },
  {
    id: 'settlement',
    title:
      '프로젝트 성공 후 정산을 위해 신분증 또는 사업자 등록증, 국내 은행 계좌가 필요합니다.',
    detail:
      '펀딩 성공에 따른 정산금 지급 및 세무 신고를 위해 「금융실명거래 및 비밀보장에 관한 법률」 제3조에 근거하여 실명 확인이 가능한 신분증 사본 또는 사업자등록증명원, 그리고 동일 명의의 국내 은행 계좌가 필요합니다. 제공된 정보는 「소득세법」 및 「부가가치세법」에 따른 세금계산서 발행 등의 증빙 자료로 활용되며, 명의 불일치 시 자금세탁방지(AML) 규정에 따라 정산이 보류될 수 있습니다.',
  },
  {
    id: 'fee',
    title: '펀딩 성공 시 수수료 정책에 동의합니다. (수수료 7%)',
    detail:
      '주담은 All-or-Nothing(목표 금액 달성 시 결제) 방식의 리워드형 크라우드펀딩 플랫폼입니다. 펀딩 최종 성공 시, 총 모금액에서 결제망 이용 및 플랫폼 서비스 제공에 대한 대가로 수수료 7%(부가가치세 별도)가 공제된 후 지정 계좌로 정산됩니다. 이는 「약관의 규제에 관한 법률」에 위배되지 않는 정당한 서비스 이용 대가이며, 목표액 미달 시에는 소비자 결제 승인이 자동 취소되므로 양조장에 어떠한 비용도 청구되지 않습니다.',
  },
  {
    id: 'responsibility',
    title:
      '펀딩 프로젝트 진행 및 리워드 제공에 대한 책임은 양조장에 있음을 이해합니다.',
    detail:
      "주담은 「전자상거래 등에서의 소비자보호에 관한 법률」상 '통신판매중개업자'로서 거래의 직접 당사자가 아닙니다. 동법 제20조 제1항에 따라, 펀딩 완료 후 약속된 리워드(전통주)의 제조, 「식품위생법」에 따른 품질 및 위생 보증, 기한 내 배송(수취인 대면 성인 인증 포함), 하자로 인한 교환·환불 등 계약 이행에 관한 모든 1차적 법적 책임은 통신판매의뢰자인 '양조장(메이커)'에게 귀속됩니다. 플랫폼은 분쟁 해결을 위한 중재적 노력만 수행합니다.",
  },
  {
    id: 'license',
    title:
      '전통주(지역특산주 등) 제조 면허 및 통신판매 승인을 보유하고 있음을 보증합니다.',
    detail:
      "플랫폼에서 펀딩되는 주류는 「전통주 등의 산업진흥에 관한 법률」 제2조에 따른 '민속주' 또는 '지역특산주' 요건을 충족해야 합니다. 또한, 양조장은 「주세법」 제53조 및 「주류의 통신판매에 관한 명령위임 고시」(국세청고시 제2024-41호)에 의거하여, 펀딩 개시 전 반드시 관할 세무서장으로부터 '주류 통신판매 승인'을 완료해야 합니다. 미승인 주류 판매나 일반 주류의 위장 판매 등 관계 법령 위반 시 발생되는 행정처분 및 민형사상 책임은 전적으로 양조장에 있습니다.",
  },
  {
    id: 'ip',
    title:
      '제안된 커스텀 레시피의 비독점적 사용 라이선스 및 지식재산권 정책에 동의합니다.',
    detail:
      "대법원 판례에 따라 주류 제조 레시피(재료, 배합 비율, 양조 순서 등) 자체는 「저작권법」 제2조 제1호의 보호 대상인 '표현'이 아닌 '아이디어'의 영역에 해당하여 저작권이 인정되지 않습니다. 이에 따라 양조장은 플랫폼을 통해 제안된 커스텀 레시피를 적법하게 제품화할 수 있는 비독점적 권리를 보장받습니다. 단, 타 양조장의 등록 특허(「특허법」) 또는 보호되는 영업비밀(「부정경쟁방지 및 영업비밀보호에 관한 법률」)을 고의로 침해하여 발생하는 분쟁에 대해서는 프로젝트를 진행한 양조장이 전적으로 책임 및 면책 의무를 집니다.",
  },
];

export default function BreweryProjectTermsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [agreedTerms, setAgreedTerms] = useState<string[]>([]);
  const [modalTerm, setModalTerm] = useState<TermItem | null>(null);

  const allTermIds = termsData.map((term) => term.id);
  const allAgreed = agreedTerms.length === allTermIds.length;

  const toggleAllTerms = () => {
    setAgreedTerms(allAgreed ? [] : allTermIds);
  };

  const toggleTerm = (id: string) => {
    setAgreedTerms((prev) => (
      prev.includes(id) ? prev.filter((termId) => termId !== id) : [...prev, id]
    ));
  };

  const handleNext = () => {
    if (allAgreed) {
      router.push('/brewery/project/create' as any);
    }
  };

  if (!user) {
    return (
      <View style={styles.root}>
        <View style={styles.screen}>
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <TouchableOpacity style={styles.headerButton} activeOpacity={0.75} onPress={() => router.back()}>
              <X size={24} color="#111827" strokeWidth={2.25} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>펀딩 프로젝트 약관</Text>
            <View style={styles.headerSpacer} />
          </View>
          <View style={styles.lockedContainer}>
            <Text style={styles.lockedTitle}>로그인이 필요합니다</Text>
            <Text style={styles.lockedDesc}>펀딩 프로젝트 등록은 로그인 후 이용할 수 있어요.</Text>
            <TouchableOpacity style={styles.lockedButton} onPress={() => router.push('/login' as any)}>
              <Text style={styles.lockedButtonText}>로그인하러 가기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.screen}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity style={styles.headerButton} activeOpacity={0.75} onPress={() => router.push('/funding' as any)}>
            <X size={24} color="#111827" strokeWidth={2.25} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>펀딩 프로젝트 약관</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 128 + insets.bottom },
          ]}
        >
          <View style={styles.heroBlock}>
            <Text style={styles.heroTitle}>
              펀딩 프로젝트 등록을 위한{'\n'}약관에 동의해주세요
            </Text>
            <Text style={styles.heroDescription}>
              모든 약관에 동의하셔야 프로젝트를 등록할 수 있습니다
            </Text>
          </View>

          <View style={styles.termsBlock}>
            <TouchableOpacity style={styles.allAgreeButton} activeOpacity={0.82} onPress={toggleAllTerms}>
              <Text style={styles.allAgreeText}>전체 동의</Text>
              <View style={[styles.allCheckBox, allAgreed && styles.checkedBox]}>
                {allAgreed && <Check size={14} color="#FFF" strokeWidth={3} />}
              </View>
            </TouchableOpacity>

            <View style={styles.termList}>
              {termsData.map((term) => {
                const checked = agreedTerms.includes(term.id);

                return (
                  <View key={term.id} style={styles.termCard}>
                    <View style={styles.termContent}>
                      <TouchableOpacity
                        accessibilityLabel={`${term.title} 동의`}
                        style={[styles.termCheckButton, checked && styles.checkedBox]}
                        activeOpacity={0.75}
                        onPress={() => toggleTerm(term.id)}
                      >
                        {checked && <Check size={13} color="#FFF" strokeWidth={3} />}
                      </TouchableOpacity>

                      <View style={styles.termTextArea}>
                        <Text style={styles.termTitle}>{term.title}</Text>
                        <View style={styles.termMetaRow}>
                          <Text style={styles.requiredText}>필수</Text>
                          <TouchableOpacity activeOpacity={0.75} onPress={() => setModalTerm(term)}>
                            <Text style={styles.detailButtonText}>자세히 보기</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.infoBox}>
              <AlertCircle size={20} color="#2563EB" strokeWidth={2.2} />
              <View style={styles.infoTextWrap}>
                <Text style={styles.infoText}>
                  프로젝트 등록 후 승인까지 3-5일이 소요됩니다. 승인 완료 후 펀딩을 시작할 수 있습니다.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={[styles.nextButton, !allAgreed && styles.nextButtonDisabled]}
            activeOpacity={allAgreed ? 0.78 : 1}
            disabled={!allAgreed}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>다음</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={modalTerm !== null} transparent animationType="fade" onRequestClose={() => setModalTerm(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalTerm(null)}>
          <View style={styles.modalCenter}>
            <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{modalTerm?.title}</Text>
                <TouchableOpacity style={styles.modalCloseButton} activeOpacity={0.75} onPress={() => setModalTerm(null)}>
                  <X size={20} color="#4B5563" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalBodyContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalDetail}>{modalTerm?.detail}</Text>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.modalConfirmButton} activeOpacity={0.78} onPress={() => setModalTerm(null)}>
                  <Text style={styles.modalConfirmText}>확인</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screen: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    minHeight: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 50,
  },
  headerButton: {
    width: 40,
    height: 40,
    marginLeft: -8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
    color: '#111827',
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  heroBlock: {
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
    fontWeight: '500',
  },
  termsBlock: {
    gap: 16,
  },
  allAgreeButton: {
    width: '100%',
    minHeight: 58,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#111827',
    backgroundColor: '#F9FAFB',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  allAgreeText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '900',
    color: '#111827',
  },
  allCheckBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkedBox: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  termList: {
    gap: 12,
  },
  termCard: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  termContent: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  termCheckButton: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    backgroundColor: '#FFFFFF',
  },
  termTextArea: {
    flex: 1,
  },
  termTitle: {
    fontSize: 12,
    lineHeight: 20,
    color: '#374151',
    fontWeight: '500',
  },
  termMetaRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  requiredText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#DC2626',
    fontWeight: '700',
  },
  detailButtonText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoBox: {
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 20,
    color: '#1E3A8A',
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    paddingHorizontal: 16,
    zIndex: 40,
  },
  nextButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '900',
  },
  lockedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  lockedTitle: { fontSize: 22, fontWeight: '900', color: '#111827', marginBottom: 10 },
  lockedDesc: { fontSize: 14, fontWeight: '600', color: '#6B7280', lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  lockedButton: { width: '100%', height: 52, borderRadius: 14, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  lockedButtonText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  modalCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '100%',
    maxWidth: 390,
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 14,
  },
  modalHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  modalTitle: {
    flex: 1,
    paddingRight: 32,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '900',
    color: '#111827',
  },
  modalCloseButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    flexGrow: 0,
  },
  modalBodyContent: {
    padding: 24,
  },
  modalDetail: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
    fontWeight: '500',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalConfirmButton: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
