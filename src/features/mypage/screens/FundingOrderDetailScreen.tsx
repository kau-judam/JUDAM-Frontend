import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  CreditCard,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  ReceiptText,
  Star,
  Truck,
  X,
} from 'lucide-react-native';

import { getFundingMainIngredientLabel } from '@/features/funding/projectLabels';
import { useAuth } from '@/contexts/AuthContext';
import { useFunding } from '@/contexts/FundingContext';
import {
  FundingProject,
  getFundingProjectImageSource,
  getFundingStatusLabel,
  isCompletedFundingStatus,
} from '@/constants/data';

type DeliveryStatus = '예정' | '준비중' | '발송' | '완료';

type OrderTimelineStep = {
  date: string;
  label: string;
  done: boolean;
};

type DerivedOrder = {
  orderId: string;
  fundingId: number;
  drinkName: string;
  brewery: string;
  breweryPhone: string;
  option: string;
  quantity: number;
  unitPrice: number;
  shippingFee: number;
  participatedAt: string;
  paidAt: string;
  paymentMethod: string;
  deliveryStatus: DeliveryStatus;
  estimatedDate: string;
  deliveredAt: string | null;
  trackingNumber: string | null;
  courier: string | null;
  recipient: string;
  address: string;
  hasReview: boolean;
  timeline: OrderTimelineStep[];
  project: FundingProject;
};

const DUMMY_DELIVERY_PROJECT_ID = 9001;

const DUMMY_DELIVERY_PROJECT: FundingProject = {
  id: DUMMY_DELIVERY_PROJECT_ID,
  title: '달빛 담은 배 막걸리 배송 더미',
  brewery: '주담 테스트 양조장',
  location: '충북 충주',
  category: '막걸리',
  shortTitle: '달빛 담은 배 막걸리',
  shortDescription: '배송조회 확인용 참여 펀딩 더미 데이터',
  image: '',
  localImage: require('../../../../newpicutre/funding3.jpg'),
  goalAmount: 3000000,
  currentAmount: 3600000,
  backers: 128,
  daysLeft: 0,
  status: '펀딩 성공' as FundingProject['status'],
  startDate: '2026.04.01',
  endDate: '2026.05.10',
  pricePerBottle: 32000,
  bottleSize: '500ml',
  alcoholContent: '6%',
  estimatedDelivery: '2026.06.05',
  rewardItems: ['달빛 담은 배 막걸리 1병'],
  shippingFee: 3000,
  mainIngredients: '쌀, 배',
  tags: ['테스트', '배송조회'],
};

const STATUS_CONFIG: Record<DeliveryStatus, { label: string; bg: string; border: string; text: string; dot: string }> = {
  예정: { label: '배송 예정', bg: '#EFF6FF', border: '#DBEAFE', text: '#4F6DFF', dot: '#93C5FD' },
  준비중: { label: '배송 준비중', bg: '#FFFBEB', border: '#FEF3C7', text: '#B45309', dot: '#FBBF24' },
  발송: { label: '배송중', bg: '#F5F3FF', border: '#DDD6FE', text: '#7C3AED', dot: '#A78BFA' },
  완료: { label: '배송 완료', bg: '#ECFDF5', border: '#D1FAE5', text: '#059669', dot: '#34D399' },
};

const ORDER_OVERRIDES: Record<number, Partial<DerivedOrder>> = {
  [DUMMY_DELIVERY_PROJECT_ID]: {
    orderId: 'JD-2026-009001',
    breweryPhone: '043-123-4567',
    paymentMethod: '테스트 결제',
    deliveryStatus: '완료',
    estimatedDate: '2026.06.05',
    paidAt: '2026.05.21 14:20',
    participatedAt: '2026.05.21',
    recipient: '김주담',
    address: '서울시 마포구 연남동 123-45, 202호',
    trackingNumber: '624888900100',
    courier: 'CJ대한통운',
    hasReview: false,
  },
  5: {
    orderId: 'JD-2025-006102',
    breweryPhone: '033-789-0123',
    paymentMethod: '토스페이',
    deliveryStatus: '예정',
    estimatedDate: '2025.05.10',
    paidAt: '2025.03.01 11:18',
    participatedAt: '2025.03.01',
    recipient: '김주담',
    address: '서울시 마포구 연남동 123-45, 202호',
    hasReview: false,
  },
};

function toCompactDate(date?: string) {
  if (!date) return '';
  return date.replace(/\s/g, '').replace(/\./g, '.').replace(/\.$/, '');
}

function addDays(date: string, days: number) {
  const normalized = date.replace(/\./g, '-');
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return date;
  parsed.setDate(parsed.getDate() + days);
  return `${parsed.getFullYear()}.${String(parsed.getMonth() + 1).padStart(2, '0')}.${String(parsed.getDate()).padStart(2, '0')}`;
}

function getOrderId(projectId: number, date: string) {
  const year = date.slice(0, 4) || '2025';
  return `JD-${year}-${String(6100 + projectId).padStart(6, '0')}`;
}

function isSuccessProject(project: FundingProject) {
  const label = getFundingStatusLabel(project.status);
  return label.includes('성공') || label.includes('달성');
}

function getDeliveryStatus(project: FundingProject): DeliveryStatus {
  if (!isCompletedFundingStatus(project.status)) return '예정';
  if (project.daysLeft <= 0 && isSuccessProject(project)) return '예정';
  return '완료';
}

function buildTimeline(order: Pick<DerivedOrder, 'participatedAt' | 'estimatedDate' | 'deliveryStatus'>): OrderTimelineStep[] {
  const prepared = order.deliveryStatus !== '예정';
  const collected = order.deliveryStatus === '준비중' || order.deliveryStatus === '발송' || order.deliveryStatus === '완료';
  const shipping = order.deliveryStatus === '발송' || order.deliveryStatus === '완료';
  const delivered = order.deliveryStatus === '완료';

  return [
    { date: addDays(order.participatedAt, 31), label: '상품 준비', done: prepared },
    { date: addDays(order.participatedAt, 55), label: '배송 시작', done: collected },
    { date: addDays(order.participatedAt, 65), label: '배송 중', done: shipping },
    { date: order.estimatedDate, label: '배송 완료', done: delivered },
  ];
}

function deriveOrder(project: FundingProject, participationAmount: number, participationDate: string, userName: string): DerivedOrder {
  const estimatedDate = toCompactDate(project.estimatedDelivery) || addDays(participationDate, 70);
  const shippingFee = Math.min(project.shippingFee || 2000, Math.max(0, participationAmount));
  const unitPrice = Math.max(0, participationAmount - shippingFee);
  const deliveryStatus = getDeliveryStatus(project);
  const baseOrder: DerivedOrder = {
    orderId: getOrderId(project.id, participationDate),
    fundingId: project.id,
    drinkName: project.shortTitle || project.title.replace(/\s*프로젝트$/, ''),
    brewery: project.brewery,
    breweryPhone: '033-789-0123',
    option: project.rewardItems?.[0] || `${project.bottleSize || '375ml'} x 1병`,
    quantity: 1,
    unitPrice,
    shippingFee,
    participatedAt: participationDate,
    paidAt: `${participationDate} 11:18`,
    paymentMethod: '토스페이',
    deliveryStatus,
    estimatedDate,
    deliveredAt: deliveryStatus === '완료' ? estimatedDate : null,
    trackingNumber: deliveryStatus === '예정' ? null : `62${String(4880000000 + project.id * 9173)}`,
    courier: deliveryStatus === '예정' ? null : 'CJ대한통운',
    recipient: userName || '김주담',
    address: '서울시 마포구 연남동 123-45, 202호',
    hasReview: false,
    timeline: [],
    project,
  };
  const merged = { ...baseOrder, ...ORDER_OVERRIDES[project.id] };
  return { ...merged, timeline: buildTimeline(merged) };
}

export default function FundingOrderDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();
  const { projects, participatedFundings } = useFunding();
  const [inquiryVisible, setInquiryVisible] = useState(false);
  const [inquiryTitle, setInquiryTitle] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState(user?.email || '');
  const [inquiryContent, setInquiryContent] = useState('');

  const projectId = Number(Array.isArray(id) ? id[0] : id);
  const hasDeliveryOrder = Object.prototype.hasOwnProperty.call(ORDER_OVERRIDES, projectId);
  const project = useMemo(
    () =>
      hasDeliveryOrder
        ? projects.find((item) => item.id === projectId) ||
          (projectId === DUMMY_DELIVERY_PROJECT_ID ? DUMMY_DELIVERY_PROJECT : null)
        : null,
    [hasDeliveryOrder, projectId, projects]
  );
  const participation = useMemo(
    () => participatedFundings.find((item) => item.fundingId === projectId) || null,
    [participatedFundings, projectId]
  );

  const order = useMemo(() => {
    if (!project) return null;
    return deriveOrder(project, participation?.amount || project.pricePerBottle || 0, participation?.date || project.endDate || '2025.03.01', user?.name || '김주담');
  }, [participation, project, user?.name]);

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={22} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>주문 상세</Text>
        </View>
        <View style={styles.emptyBox}>
          <Package size={42} color="#D1D5DB" />
          <Text style={styles.emptyText}>주문 정보를 찾을 수 없습니다</Text>
        </View>
      </View>
    );
  }

  const status = STATUS_CONFIG[order.deliveryStatus];
  const totalAmount = order.unitPrice * order.quantity + order.shippingFee;

  const copyTracking = () => {
    if (!order.trackingNumber) return;
    Alert.alert('복사 완료', `운송장 번호 ${order.trackingNumber}가 복사되었습니다.`);
  };

  const submitInquiry = () => {
    if (!inquiryTitle.trim() || !inquiryEmail.trim() || !inquiryContent.trim()) {
      Alert.alert('입력 확인', '문의 제목, 이메일, 문의 내용을 모두 입력해주세요.');
      return;
    }
    setInquiryVisible(false);
    setInquiryTitle('');
    setInquiryContent('');
    Alert.alert('문의 접수', '양조장 문의가 접수되었습니다.');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.75} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerTextBox}>
          <Text style={styles.headerTitle}>주문 상세</Text>
          <Text style={styles.headerSubtitle}>{order.orderId}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}
      >
        <View style={[styles.statusBanner, { backgroundColor: status.bg, borderColor: status.border }]}>
          <View style={styles.statusTop}>
            <View style={styles.statusLabelRow}>
              <View style={[styles.statusDot, { backgroundColor: status.dot }]} />
              <Text style={[styles.statusLabel, { color: status.text }]}>{status.label}</Text>
            </View>
            <Text style={[styles.statusDate, { color: status.text }]}>
              {order.deliveredAt ? order.deliveredAt : `예정 ${order.estimatedDate}`}
            </Text>
          </View>

          {order.trackingNumber ? (
            <View style={styles.trackingBox}>
              <View>
                <Text style={styles.trackingCourier}>{order.courier}</Text>
                <Text style={styles.trackingNumber}>{order.trackingNumber}</Text>
              </View>
              <TouchableOpacity style={styles.copyButton} onPress={copyTracking}>
                <Copy size={13} color={status.text} />
                <Text style={[styles.copyText, { color: status.text }]}>복사</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={[styles.statusHelp, { color: status.text }]}>제조가 완료되면 운송장 번호가 등록됩니다.</Text>
          )}
        </View>

        <SectionCard title="배송 타임라인">
          {order.timeline.map((step, index) => {
            const isLast = index === order.timeline.length - 1;
            return (
              <View key={`${step.label}-${index}`} style={styles.timelineRow}>
                <View style={styles.timelineRail}>
                  <View style={[styles.timelineDot, step.done ? styles.timelineDotDone : styles.timelineDotTodo]}>
                    {step.done && <CheckCircle2 size={14} color="#FFFFFF" />}
                  </View>
                  {!isLast && <View style={[styles.timelineLine, step.done ? styles.timelineLineDone : styles.timelineLineTodo]} />}
                </View>
                <View style={styles.timelineTextBox}>
                  <Text style={[styles.timelineLabel, step.done ? styles.timelineLabelDone : styles.timelineLabelTodo]}>{step.label}</Text>
                  <Text style={[styles.timelineDate, step.done ? styles.timelineDateDone : styles.timelineDateTodo]}>{step.date}</Text>
                  {isLast && order.deliveryStatus === '완료' ? (
                    <Text style={styles.deliveryCompleteHelp}>
                      배송이 완료되었습니다.{'\n'}문의사항이 있는 경우 '문의하기' 버튼을 통해 문의해주세요.
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </SectionCard>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>주문 상품</Text>
          </View>
          <View style={styles.productRow}>
            <Image source={getFundingProjectImageSource(order.project)} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productBrewery}>{order.brewery}</Text>
              <Text style={styles.productName} numberOfLines={1}>{order.drinkName}</Text>
              <Text style={styles.productOption} numberOfLines={1}>{order.option}</Text>
              <Text style={styles.productCategory}>{getFundingMainIngredientLabel(order.project)}</Text>
            </View>
            <View style={styles.productPriceBox}>
              <Text style={styles.productPrice}>{order.unitPrice.toLocaleString()}원</Text>
              <Text style={styles.productQuantity}>x {order.quantity}</Text>
            </View>
          </View>
        </View>

        <SectionCard title="결제 내역" icon={<ReceiptText size={18} color="#6B7280" />}>
          <PriceRow label="상품 금액" value={`${order.unitPrice.toLocaleString()}원`} />
          <PriceRow label="배송비" value={`+${order.shippingFee.toLocaleString()}원`} />
          <View style={styles.totalDivider} />
          <PriceRow label="총 결제 금액" value={`${totalAmount.toLocaleString()}원`} strong />
          <View style={styles.infoDivider} />
          <InfoRow label="결제 수단" value={order.paymentMethod} icon={<CreditCard size={14} color="#D1D5DB" />} />
          <InfoRow label="결제 일시" value={order.paidAt} icon={<CreditCard size={14} color="#D1D5DB" />} />
        </SectionCard>

        <SectionCard title="배송지 정보" icon={<Truck size={18} color="#6B7280" />}>
          <Text style={styles.recipient}>{order.recipient}</Text>
          <View style={styles.addressRow}>
            <MapPin size={16} color="#9CA3AF" />
            <Text style={styles.addressText}>{order.address}</Text>
          </View>
        </SectionCard>

        {order.deliveryStatus === '완료' && !order.hasReview && (
          <TouchableOpacity style={styles.reviewCta} activeOpacity={0.86} onPress={() => router.push(`/archive/review/${order.fundingId}` as any)}>
            <View style={styles.reviewIconBox}>
              <Star size={20} color="#FBBF24" fill="#FBBF24" />
            </View>
            <View style={styles.reviewTextBox}>
              <Text style={styles.reviewTitle}>후기를 작성해보세요!</Text>
              <Text style={styles.reviewDesc}>나의 경험을 다른 주담과 나눠요</Text>
            </View>
            <ChevronRight size={18} color="#6B7280" />
          </TouchableOpacity>
        )}

        {order.deliveryStatus === '완료' && order.hasReview && (
          <View style={styles.reviewDone}>
            <CheckCircle2 size={20} color="#059669" />
            <Text style={styles.reviewDoneText}>후기 작성 완료</Text>
          </View>
        )}

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.85} onPress={() => router.push(`/funding/${order.fundingId}` as any)}>
            <Package size={17} color="#374151" />
            <Text style={styles.actionText}>펀딩 상세</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.85} onPress={() => setInquiryVisible(true)}>
            <MessageSquare size={17} color="#374151" />
            <Text style={styles.actionText}>양조장 문의</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footInfo}>
          <View style={styles.footLine}>
            <Phone size={14} color="#A1AAB8" />
            <Text style={styles.footText}>{order.brewery} · {order.breweryPhone}</Text>
          </View>
          <View style={styles.footLine}>
            <Clock3 size={14} color="#A1AAB8" />
            <Text style={styles.footText}>주문일 {order.participatedAt}</Text>
          </View>
        </View>
      </ScrollView>

      <InquiryModal
        visible={inquiryVisible}
        brewery={order.brewery}
        email={inquiryEmail}
        title={inquiryTitle}
        content={inquiryContent}
        onClose={() => setInquiryVisible(false)}
        onEmailChange={setInquiryEmail}
        onTitleChange={setInquiryTitle}
        onContentChange={setInquiryContent}
        onSubmit={submitInquiry}
      />
    </View>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <View style={styles.sectionTitleRow}>
        {icon}
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function PriceRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.priceRow}>
      <Text style={[styles.priceLabel, strong && styles.priceStrong]}>{label}</Text>
      <Text style={[styles.priceValue, strong && styles.priceValueStrong]}>{value}</Text>
    </View>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoValueRow}>
        {icon}
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function InquiryModal({
  visible,
  brewery,
  email,
  title,
  content,
  onClose,
  onEmailChange,
  onTitleChange,
  onContentChange,
  onSubmit,
}: {
  visible: boolean;
  brewery: string;
  email: string;
  title: string;
  content: string;
  onClose: () => void;
  onEmailChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleRow}>
              <MessageSquare size={20} color="#374151" />
              <Text style={styles.modalTitle}>양조장 문의</Text>
            </View>
            <TouchableOpacity style={styles.modalClose} onPress={onClose}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalContent}>
            <View style={styles.targetBox}>
              <Text style={styles.targetLabel}>문의 대상</Text>
              <Text style={styles.targetName}>{brewery}</Text>
            </View>
            <FormField label="문의 제목 *" value={title} placeholder="문의하실 내용을 간단히 입력해주세요" onChangeText={onTitleChange} />
            <FormField label="답변 받을 이메일 *" value={email} placeholder="example@email.com" onChangeText={onEmailChange} keyboardType="email-address" />
            <View>
              <Text style={styles.formLabel}>문의 내용 *</Text>
              <TextInput
                value={content}
                onChangeText={onContentChange}
                placeholder="문의하실 내용을 자세히 작성해주세요"
                placeholderTextColor="#9CA3AF"
                multiline
                style={styles.textArea}
              />
            </View>
            <View style={styles.noticeBox}>
              <Text style={styles.noticeText}>작성하신 이메일로 양조장의 답변이 발송됩니다. 이메일 주소를 정확히 입력해주세요.</Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
                <Text style={styles.submitText}>문의하기</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function FormField({
  label,
  value,
  placeholder,
  keyboardType,
  onChangeText,
}: {
  label: string;
  value: string;
  placeholder: string;
  keyboardType?: 'default' | 'email-address';
  onChangeText: (value: string) => void;
}) {
  return (
    <View>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize="none"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F5' },
  header: {
    minHeight: 88,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 12,
  },
  backButton: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  headerTextBox: { flex: 1 },
  headerTitle: { fontSize: 21, fontWeight: '900', color: '#111827' },
  headerSubtitle: { fontSize: 11, fontWeight: '700', color: '#A1AAB8', marginTop: 2 },
  content: { paddingHorizontal: 16, paddingTop: 16, gap: 16 },
  statusBanner: { borderRadius: 18, borderWidth: 1, padding: 18 },
  statusTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  statusLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusLabel: { fontSize: 16, fontWeight: '900' },
  statusDate: { fontSize: 13, fontWeight: '700' },
  trackingBox: {
    borderRadius: 14,
    padding: 13,
    backgroundColor: 'rgba(255,255,255,0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackingCourier: { fontSize: 11, fontWeight: '800', color: '#6B7280', marginBottom: 2 },
  trackingNumber: { fontSize: 15, fontWeight: '900', color: '#111827', letterSpacing: 1 },
  copyButton: {
    minHeight: 32,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  copyText: { fontSize: 12, fontWeight: '900' },
  statusHelp: { fontSize: 13, fontWeight: '700', lineHeight: 20 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEF0F2',
    padding: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 17 },
  cardHeader: { paddingBottom: 15, marginHorizontal: -20, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  cardTitle: { fontSize: 16, fontWeight: '900', color: '#111827' },
  timelineRow: { flexDirection: 'row', gap: 12 },
  timelineRail: { width: 24, alignItems: 'center' },
  timelineDot: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  timelineDotDone: { backgroundColor: '#111827', borderColor: '#111827' },
  timelineDotTodo: { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' },
  timelineLine: { width: 2, height: 34, marginTop: 2 },
  timelineLineDone: { backgroundColor: '#D1D5DB' },
  timelineLineTodo: { backgroundColor: '#EEF0F2' },
  timelineTextBox: { flex: 1, paddingBottom: 15 },
  timelineLabel: { fontSize: 16, fontWeight: '900', lineHeight: 22 },
  timelineLabelDone: { color: '#111827' },
  timelineLabelTodo: { color: '#D1D5DB' },
  timelineDate: { fontSize: 12, fontWeight: '800', marginTop: 3 },
  timelineDateDone: { color: '#9CA3AF' },
  timelineDateTodo: { color: '#E5E7EB' },
  deliveryCompleteHelp: { marginTop: 6, fontSize: 11, lineHeight: 16, fontWeight: '700', color: '#9CA3AF' },
  productRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingTop: 18 },
  productImage: { width: 74, height: 74, borderRadius: 15, backgroundColor: '#F3F4F6' },
  productInfo: { flex: 1, minWidth: 0 },
  productBrewery: { fontSize: 11, fontWeight: '800', color: '#A1AAB8', marginBottom: 2 },
  productName: { fontSize: 16, fontWeight: '900', color: '#111827', marginBottom: 3 },
  productOption: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  productCategory: { alignSelf: 'flex-start', marginTop: 6, fontSize: 10, fontWeight: '900', color: '#6B7280', backgroundColor: '#F3F4F6', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  productPriceBox: { alignItems: 'flex-end', gap: 3 },
  productPrice: { fontSize: 17, fontWeight: '900', color: '#111827' },
  productQuantity: { fontSize: 11, fontWeight: '700', color: '#A1AAB8' },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  priceLabel: { fontSize: 15, fontWeight: '700', color: '#6B7280' },
  priceValue: { fontSize: 15, fontWeight: '800', color: '#374151' },
  priceStrong: { color: '#111827', fontWeight: '900' },
  priceValueStrong: { color: '#111827', fontSize: 20, fontWeight: '900' },
  totalDivider: { height: 1, backgroundColor: '#EEF0F2', marginBottom: 14 },
  infoDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 7 },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  infoLabel: { fontSize: 13, fontWeight: '800', color: '#A1AAB8' },
  infoValueRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  infoValue: { fontSize: 13, fontWeight: '800', color: '#6B7280' },
  recipient: { fontSize: 16, fontWeight: '900', color: '#111827', marginBottom: 12 },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 7 },
  addressText: { flex: 1, fontSize: 15, fontWeight: '700', color: '#4B5563', lineHeight: 22 },
  reviewCta: { borderRadius: 20, backgroundColor: '#111827', padding: 18, flexDirection: 'row', alignItems: 'center', gap: 13 },
  reviewIconBox: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  reviewTextBox: { flex: 1 },
  reviewTitle: { fontSize: 15, fontWeight: '900', color: '#FFFFFF' },
  reviewDesc: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', marginTop: 2 },
  reviewDone: { borderRadius: 20, backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#D1FAE5', padding: 18, flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewDoneText: { fontSize: 15, fontWeight: '900', color: '#047857' },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, height: 62, borderRadius: 18, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionText: { fontSize: 14, fontWeight: '900', color: '#374151' },
  footInfo: { alignItems: 'center', gap: 14, paddingVertical: 8 },
  footLine: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  footText: { fontSize: 13, fontWeight: '700', color: '#A1AAB8' },
  emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { fontSize: 14, fontWeight: '800', color: '#9CA3AF' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.48)', justifyContent: 'center', padding: 20 },
  modalCard: { maxHeight: '86%', borderRadius: 26, backgroundColor: '#FFFFFF', overflow: 'hidden' },
  modalHeader: { height: 60, borderBottomWidth: 1, borderBottomColor: '#EEF0F2', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18 },
  modalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modalTitle: { fontSize: 17, fontWeight: '900', color: '#111827' },
  modalClose: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' },
  modalContent: { padding: 18, gap: 14 },
  targetBox: { borderRadius: 14, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#EEF0F2', padding: 14 },
  targetLabel: { fontSize: 12, fontWeight: '800', color: '#9CA3AF' },
  targetName: { fontSize: 15, fontWeight: '900', color: '#111827', marginTop: 3 },
  formLabel: { fontSize: 13, fontWeight: '900', color: '#374151', marginBottom: 8 },
  input: { height: 48, borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', paddingHorizontal: 14, color: '#111827', fontSize: 14, fontWeight: '700' },
  textArea: { minHeight: 122, borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', padding: 14, color: '#111827', fontSize: 14, fontWeight: '700', textAlignVertical: 'top' },
  noticeBox: { borderRadius: 14, backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#DBEAFE', padding: 13 },
  noticeText: { fontSize: 12, fontWeight: '700', lineHeight: 18, color: '#2563EB' },
  modalActions: { flexDirection: 'row', gap: 10, paddingTop: 4 },
  cancelButton: { flex: 1, height: 50, borderRadius: 15, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 14, fontWeight: '900', color: '#4B5563' },
  submitButton: { flex: 1, height: 50, borderRadius: 15, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  submitText: { fontSize: 14, fontWeight: '900', color: '#FFFFFF' },
});
