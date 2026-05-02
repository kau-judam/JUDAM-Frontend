import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
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
import { router, useLocalSearchParams } from 'expo-router';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  CreditCard,
  Landmark,
  MapPin,
  MessageCircle,
  Package,
  Search,
  ShieldCheck,
  Smartphone,
  UserRound,
  X,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Progress } from '@/components/ui/progress';
import { FundingProject, getFundingProjectImageSource, isSupportableFundingStatus } from '@/constants/data';
import { useAuth } from '@/contexts/AuthContext';
import { useFunding } from '@/contexts/FundingContext';

type PaymentMethod = 'card' | 'npay' | 'account';
type InfoModalType = 'terms' | 'privacy' | null;

const messageOptions = [
  '이 프로젝트의 성공을 응원합니다!',
  '우리 술의 미래를 함께 만들어요!',
  '전통주의 새로운 도전을 지지합니다.',
  '맛있는 술 기대하겠습니다. 화이팅!',
  '정성스럽게 빚어주세요.',
];

const paymentMethods: {
  id: PaymentMethod;
  title: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  { id: 'card', title: '카드 간편결제', desc: '할부 가능', icon: <CreditCard size={20} color="#111" /> },
  { id: 'npay', title: '네이버페이', desc: '간편 결제', icon: <Smartphone size={20} color="#111" /> },
  { id: 'account', title: '계좌이체', desc: '무통장 입금', icon: <Landmark size={20} color="#111" /> },
];

const mockAddresses = [
  { zipCode: '06234', address: '서울특별시 강남구 테헤란로 123' },
  { zipCode: '06235', address: '서울특별시 강남구 테헤란로 456' },
  { zipCode: '04524', address: '서울특별시 중구 세종대로 110' },
  { zipCode: '03088', address: '서울특별시 종로구 종로 1' },
  { zipCode: '13494', address: '경기도 성남시 분당구 판교역로 235' },
  { zipCode: '63309', address: '제주특별자치도 제주시 첨단로 242' },
];

function digitsOnly(value: string) {
  return value.replace(/[^0-9]/g, '');
}

function getInitialQuantity(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return Math.max(1, Number(raw) || 1);
}

function getFundingId(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return Number(raw);
}

export default function FundingSupportScreen() {
  const insets = useSafeAreaInsets();
  const { id, quantity: quantityParam } = useLocalSearchParams();
  const { user } = useAuth();
  const { projects, addParticipation, updateProjectFunding } = useFunding();
  const fundingId = getFundingId(id);
  const project = useMemo(
    () => projects.find((item) => item.id === fundingId) || null,
    [fundingId, projects]
  );
  const [quantity, setQuantity] = useState(getInitialQuantity(quantityParam));
  const [additionalSupport, setAdditionalSupport] = useState('0');
  const [supportMessage, setSupportMessage] = useState('');
  const [showMessageOptions, setShowMessageOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeRefund, setAgreeRefund] = useState(false);
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressSearch, setAddressSearch] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [infoModal, setInfoModal] = useState<InfoModalType>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [supporterInfo, setSupporterInfo] = useState({
    phone: user?.phone || '',
    email: user?.email || '',
  });
  const [shippingInfo, setShippingInfo] = useState({
    recipientName: user?.name || '',
    address: '',
    detailAddress: '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (!user) return;
    setSupporterInfo((prev) => ({
      phone: prev.phone || user.phone || '',
      email: prev.email || user.email || '',
    }));
    setShippingInfo((prev) => ({
      ...prev,
      recipientName: prev.recipientName || user.name,
      phone: prev.phone || user.phone || '',
    }));
  }, [user]);

  const unitPrice = project?.pricePerBottle || 35000;
  const shippingFee = project?.shippingFee ?? 2000;
  const rewardAmount = unitPrice * quantity;
  const extraAmount = Number(additionalSupport) || 0;
  const totalAmount = rewardAmount + shippingFee + extraAmount;
  const progressPercentage = project ? Math.min((project.currentAmount / project.goalAmount) * 100, 100) : 0;
  const filteredAddresses = mockAddresses.filter(
    (addr) => addr.address.includes(addressSearch) || addr.zipCode.includes(addressSearch)
  );
  const canSubmit = Boolean(selectedPaymentMethod && agreeTerms && agreeRefund && !isProcessing);
  const currentBreweryName = user?.breweryName || user?.name;
  const isOwnBreweryProject =
    user?.type === 'brewery' &&
    project !== null &&
    Boolean(currentBreweryName) &&
    currentBreweryName?.trim() === project.brewery.trim();

  const handleAdditionalSupportChange = (value: string) => {
    const next = digitsOnly(value);
    setAdditionalSupport(next || '0');
  };

  const handleAddressSelect = (zipCode: string, address: string) => {
    setShippingInfo((prev) => ({ ...prev, address: `[${zipCode}] ${address}` }));
    setShowAddressModal(false);
    setAddressSearch('');
  };

  const handlePayment = () => {
    if (!canSubmit || !project) return;
    if (!supporterInfo.phone || !supporterInfo.email) {
      Alert.alert('알림', '후원자 정보를 입력해주세요.');
      return;
    }
    if (!shippingInfo.recipientName || !shippingInfo.address || !shippingInfo.phone) {
      Alert.alert('알림', '배송지 정보를 입력해주세요.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      addParticipation(project.id, totalAmount);
      updateProjectFunding(project.id, totalAmount);
      setIsProcessing(false);
      setShowSuccessModal(true);
    }, 700);
  };

  if (!project) {
    return (
      <AccessNotice
        insetsTop={insets.top}
        title="프로젝트를 찾을 수 없습니다"
        body="후원하려는 프로젝트 정보가 없어요. 펀딩 목록에서 다시 선택해주세요."
        primaryLabel="펀딩 목록으로"
        onPrimaryPress={() => router.replace('/funding' as any)}
      />
    );
  }

  if (!user) {
    return (
      <AccessNotice
        insetsTop={insets.top}
        title="로그인이 필요합니다"
        body="프로젝트 후원은 로그인한 뒤 참여할 수 있어요."
        primaryLabel="로그인하기"
        onPrimaryPress={() => router.replace('/login' as any)}
        secondaryLabel="펀딩으로 돌아가기"
        onSecondaryPress={() => router.replace('/funding' as any)}
      />
    );
  }

  if (isOwnBreweryProject) {
    return (
      <AccessNotice
        insetsTop={insets.top}
        title="내 프로젝트입니다"
        body={
          user.isBreweryVerified
            ? '직접 만든 프로젝트는 후원할 수 없고 관리 화면에서 진행 현황을 확인할 수 있어요.'
            : '직접 만든 프로젝트를 관리하려면 양조장 인증을 먼저 진행해주세요.'
        }
        primaryLabel={user.isBreweryVerified ? '프로젝트 관리하기' : '양조장 인증하기'}
        onPrimaryPress={() => router.replace(user.isBreweryVerified ? '/brewery/dashboard' as any : '/brewery/verification' as any)}
        secondaryLabel="펀딩으로 돌아가기"
        onSecondaryPress={() => router.replace('/funding' as any)}
      />
    );
  }

  if (!isSupportableFundingStatus(project.status)) {
    return (
      <AccessNotice
        insetsTop={insets.top}
        title="종료된 펀딩입니다"
        body="이미 종료된 프로젝트는 새 후원을 받을 수 없어요. 진행 중인 다른 프로젝트를 둘러보세요."
        primaryLabel="진행 펀딩 보기"
        onPrimaryPress={() => router.replace('/funding' as any)}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>후원하기</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 148 }]}
      >
        <View style={styles.projectSection}>
          <Image source={getFundingProjectImageSource(project)} style={styles.projectImage} />
          <View style={styles.projectInfo}>
            <View style={styles.metaRow}>
              <Text style={styles.breweryText}>{project.brewery}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{project.category}</Text>
              </View>
            </View>
            <Text style={styles.projectTitle} numberOfLines={2}>{project.title}</Text>
            <View style={styles.priceLine}>
              <Text style={styles.rewardPrice}>{unitPrice.toLocaleString()}원</Text>
              <Text style={styles.daysLeft}>펀딩 {project.daysLeft}일 남음</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <Text style={styles.progressPct}>{progressPercentage.toFixed(0)}%</Text>
            <Text style={styles.progressAmount}>{(project.currentAmount / 10000).toLocaleString()}만원 달성</Text>
          </View>
          <Progress value={progressPercentage} style={styles.progressBar} indicatorStyle={{ backgroundColor: '#111' }} />
          <Text style={styles.progressSub}>목표 {(project.goalAmount / 10000).toLocaleString()}만원 · {project.backers}명 참여</Text>
        </View>

        <Section title="가격 안내">
          <View style={styles.rewardItems}>
            {(project.rewardItems || [`${project.title} ${project.bottleSize || '375ml'} x 1`]).map((item) => (
              <View key={item} style={styles.rewardItemRow}>
                <View style={styles.dot} />
                <Text style={styles.rewardItemText}>{item}</Text>
              </View>
            ))}
          </View>
          <View style={styles.deliveryRow}>
            <Package size={16} color="#EF4444" />
            <Text style={styles.deliveryText}>예상 전달일 <Text style={styles.deliveryDate}>{project.estimatedDelivery || '펀딩 종료 후 순차 안내'}</Text></Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>리워드 금액</Text>
            <Text style={styles.amountValue}>{unitPrice.toLocaleString()}원</Text>
          </View>
        </Section>

        <Section title="수량 선택">
          <View style={styles.quantityBox}>
            <TouchableOpacity style={styles.quantityBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              <Text style={styles.quantityBtnText}>-</Text>
            </TouchableOpacity>
            <View style={styles.quantityCenter}>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <Text style={styles.quantityUnit}>병</Text>
            </View>
            <TouchableOpacity style={styles.quantityBtn} onPress={() => setQuantity(quantity + 1)}>
              <Text style={styles.quantityBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.calculationBox}>
            <SummaryRow label="상품 금액" value={`${rewardAmount.toLocaleString()}원`} />
            <SummaryRow label="배송비" value={`${shippingFee.toLocaleString()}원`} />
          </View>
        </Section>

        <Section title="추가 후원금" optional>
          <View style={styles.moneyInputRow}>
            <TextInput
              style={styles.moneyInput}
              value={additionalSupport}
              onChangeText={handleAdditionalSupportChange}
              keyboardType="number-pad"
              textAlign="right"
              placeholder="0"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.moneyUnit}>원</Text>
          </View>
          <Text style={styles.helperText}>추가 후원으로 프로젝트를 더 응원할 수 있어요.</Text>
        </Section>

        <Section title="후원자 정보">
          <LabeledInput
            label="연락처"
            value={supporterInfo.phone}
            placeholder="010-0000-0000"
            keyboardType="phone-pad"
            onChangeText={(phone) => setSupporterInfo((prev) => ({ ...prev, phone }))}
          />
          <LabeledInput
            label="이메일"
            value={supporterInfo.email}
            placeholder="example@email.com"
            keyboardType="email-address"
            onChangeText={(email) => setSupporterInfo((prev) => ({ ...prev, email }))}
          />
          <View style={styles.infoBox}>
            <UserRound size={15} color="#6B7280" />
            <Text style={styles.infoText}>위 연락처와 이메일로 후원 관련 소식이 전달됩니다.</Text>
          </View>
        </Section>

        <Section
          title="배송지"
          trailing={<View style={styles.adultBadge}><Text style={styles.adultBadgeText}>성인인증 필수</Text></View>}
        >
          <LabeledInput
            label="받는 분"
            value={shippingInfo.recipientName}
            placeholder="이름을 입력하세요"
            onChangeText={(recipientName) => setShippingInfo((prev) => ({ ...prev, recipientName }))}
          />
          <Text style={styles.inputLabel}>주소</Text>
          <View style={styles.addressRow}>
            <TextInput
              style={[styles.input, styles.addressInput]}
              value={shippingInfo.address}
              placeholder="기본 주소"
              placeholderTextColor="#9CA3AF"
              onChangeText={(address) => setShippingInfo((prev) => ({ ...prev, address }))}
            />
            <TouchableOpacity style={styles.addressBtn} onPress={() => setShowAddressModal(true)}>
              <Text style={styles.addressBtnText}>검색</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={shippingInfo.detailAddress}
            placeholder="상세 주소"
            placeholderTextColor="#9CA3AF"
            onChangeText={(detailAddress) => setShippingInfo((prev) => ({ ...prev, detailAddress }))}
          />
          <LabeledInput
            label="연락처"
            value={shippingInfo.phone}
            placeholder="010-0000-0000"
            keyboardType="phone-pad"
            onChangeText={(phone) => setShippingInfo((prev) => ({ ...prev, phone }))}
          />
          <View style={styles.alcoholNotice}>
            <ShieldCheck size={16} color="#991B1B" />
            <Text style={styles.alcoholNoticeText}>전통주는 성인만 구매 및 수령 가능합니다. 배송 시 본인 확인이 진행될 수 있어요.</Text>
          </View>
        </Section>

        <Section title="양조장에게 한마디" optional>
          <TouchableOpacity style={styles.messageSelect} onPress={() => setShowMessageOptions((prev) => !prev)}>
            <Text style={[styles.messageText, !supportMessage && { color: '#9CA3AF' }]}>
              {supportMessage || '응원 메시지를 선택하세요'}
            </Text>
            {showMessageOptions ? <ChevronUp size={18} color="#6B7280" /> : <ChevronDown size={18} color="#6B7280" />}
          </TouchableOpacity>
          {showMessageOptions && (
            <View style={styles.messageOptions}>
              {messageOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.messageOption}
                  onPress={() => {
                    setSupportMessage(option);
                    setShowMessageOptions(false);
                  }}
                >
                  <MessageCircle size={15} color="#6B7280" />
                  <Text style={styles.messageOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Section>

        <Section title="결제수단">
          <View style={styles.paymentList}>
            {paymentMethods.map((method) => {
              const selected = selectedPaymentMethod === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[styles.paymentOption, selected && styles.paymentOptionSelected]}
                  onPress={() => setSelectedPaymentMethod(method.id)}
                >
                  <View style={styles.paymentIcon}>{method.icon}</View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.paymentTitle}>{method.title}</Text>
                    <Text style={styles.paymentDesc}>{method.desc}</Text>
                  </View>
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected && <Check size={14} color="#FFF" />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>

        <Section title="최종 확인">
          <View style={styles.finalAmountBox}>
            <SummaryRow label="리워드" value={`${rewardAmount.toLocaleString()}원`} strong />
            <SummaryRow label="배송비" value={`${shippingFee.toLocaleString()}원`} />
            <SummaryRow label="추가 후원금" value={`${extraAmount.toLocaleString()}원`} />
            <View style={styles.finalDivider} />
            <View style={styles.finalTotalRow}>
              <Text style={styles.finalTotalLabel}>최종 후원 금액</Text>
              <Text style={styles.finalTotalValue}>{totalAmount.toLocaleString()}원</Text>
            </View>
            <Text style={styles.finalGuide}>프로젝트가 무산되거나 중단된 경우 예약된 결제는 자동으로 취소됩니다.</Text>
          </View>

          <AgreementRow
            checked={agreeTerms}
            label="개인정보 제3자 제공 동의"
            actionLabel="내용보기"
            onPress={() => setAgreeTerms((prev) => !prev)}
            onActionPress={() => setInfoModal('privacy')}
          />
          <AgreementRow
            checked={agreeRefund}
            label="후원 유의사항 확인"
            actionLabel={showRefundPolicy ? '접기' : '펼치기'}
            onPress={() => setAgreeRefund((prev) => !prev)}
            onActionPress={() => setShowRefundPolicy((prev) => !prev)}
          />

          {showRefundPolicy && (
            <View style={styles.refundPolicy}>
              <Text style={styles.refundPolicyTitle}>후원은 구매가 아닌 창의적인 계획을 지원하는 일입니다.</Text>
              <Text style={styles.refundPolicyText}>전통주 펀딩은 아직 실현되지 않은 프로젝트가 완성될 수 있도록 제작비를 후원하는 과정입니다. 진행 과정에서 일정이 지연되거나 계획이 일부 변경될 수 있습니다.</Text>
            </View>
          )}
        </Section>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[styles.payButton, !canSubmit && styles.payButtonDisabled]}
          disabled={!canSubmit}
          onPress={handlePayment}
        >
          <Text style={styles.payButtonText}>{isProcessing ? '처리 중...' : `${totalAmount.toLocaleString()}원 후원하기`}</Text>
        </TouchableOpacity>
        <View style={styles.bottomLinks}>
          <TouchableOpacity onPress={() => setInfoModal('terms')}>
            <Text style={styles.bottomLinkText}>이용약관</Text>
          </TouchableOpacity>
          <Text style={styles.bottomDot}>·</Text>
          <TouchableOpacity onPress={() => setInfoModal('privacy')}>
            <Text style={styles.bottomLinkText}>개인정보 처리방침</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AddressModal
        visible={showAddressModal}
        insetsTop={insets.top}
        search={addressSearch}
        results={filteredAddresses}
        onChangeSearch={setAddressSearch}
        onClose={() => {
          setShowAddressModal(false);
          setAddressSearch('');
        }}
        onSelect={handleAddressSelect}
      />

      <SuccessModal
        visible={showSuccessModal}
        project={project}
        totalAmount={totalAmount}
        onClose={() => {
          setShowSuccessModal(false);
          router.replace('/funding' as any);
        }}
      />

      <InfoModal
        type={infoModal}
        onClose={() => setInfoModal(null)}
      />
    </KeyboardAvoidingView>
  );
}

function AccessNotice({
  insetsTop,
  title,
  body,
  primaryLabel,
  onPrimaryPress,
  secondaryLabel,
  onSecondaryPress,
}: {
  insetsTop: number;
  title: string;
  body: string;
  primaryLabel: string;
  onPrimaryPress: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
}) {
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insetsTop }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>후원하기</Text>
        <View style={styles.iconBtn} />
      </View>
      <View style={styles.noticeWrap}>
        <View style={styles.noticeIcon}>
          <ShieldCheck size={34} color="#111" />
        </View>
        <Text style={styles.noticeTitle}>{title}</Text>
        <Text style={styles.noticeBody}>{body}</Text>
        <TouchableOpacity style={styles.noticePrimary} onPress={onPrimaryPress}>
          <Text style={styles.noticePrimaryText}>{primaryLabel}</Text>
        </TouchableOpacity>
        {secondaryLabel && onSecondaryPress && (
          <TouchableOpacity style={styles.noticeSecondary} onPress={onSecondaryPress}>
            <Text style={styles.noticeSecondaryText}>{secondaryLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function Section({
  title,
  optional,
  trailing,
  children,
}: {
  title: string;
  optional?: boolean;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {title}
          {optional && <Text style={styles.optionalText}> (선택)</Text>}
        </Text>
        {trailing}
      </View>
      {children}
    </View>
  );
}

function LabeledInput({
  label,
  value,
  placeholder,
  keyboardType,
  onChangeText,
}: {
  label: string;
  value: string;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  onChangeText: (text: string) => void;
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        onChangeText={onChangeText}
      />
    </View>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, strong && { color: '#111' }]}>{label}</Text>
      <Text style={[styles.summaryValue, strong && { fontWeight: '900' }]}>{value}</Text>
    </View>
  );
}

function AgreementRow({
  checked,
  label,
  actionLabel,
  onPress,
  onActionPress,
}: {
  checked: boolean;
  label: string;
  actionLabel: string;
  onPress: () => void;
  onActionPress: () => void;
}) {
  return (
    <View style={styles.agreementRow}>
      <TouchableOpacity style={styles.agreementMain} onPress={onPress}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <Check size={14} color="#FFF" />}
        </View>
        <Text style={styles.agreementText}>{label}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onActionPress}>
        <Text style={styles.agreementAction}>{actionLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

function AddressModal({
  visible,
  insetsTop,
  search,
  results,
  onChangeSearch,
  onClose,
  onSelect,
}: {
  visible: boolean;
  insetsTop: number;
  search: string;
  results: typeof mockAddresses;
  onChangeSearch: (text: string) => void;
  onClose: () => void;
  onSelect: (zipCode: string, address: string) => void;
}) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.addressModal}>
        <View style={[styles.addressModalHeader, { paddingTop: insetsTop }]}>
          <View style={styles.addressTitleRow}>
            <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
              <ChevronLeft size={24} color="#111" />
            </TouchableOpacity>
            <Text style={styles.addressModalTitle}>주소 검색</Text>
            <View style={styles.iconBtn} />
          </View>
          <View style={styles.addressSearchBox}>
            <Search size={18} color="#9CA3AF" />
            <TextInput
              style={styles.addressSearchInput}
              value={search}
              onChangeText={onChangeSearch}
              placeholder="도로명, 건물명, 지역명 입력"
              placeholderTextColor="#9CA3AF"
              autoFocus
            />
            {Boolean(search) && (
              <TouchableOpacity onPress={() => onChangeSearch('')}>
                <X size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <ScrollView style={styles.addressResultArea} contentContainerStyle={styles.addressResultContent}>
          {!search ? (
            <View style={styles.addressEmpty}>
              <MapPin size={34} color="#D1D5DB" />
              <Text style={styles.addressEmptyTitle}>주소를 검색해주세요</Text>
              <Text style={styles.addressEmptyText}>도로명, 건물명 또는 지역명으로 검색할 수 있습니다.</Text>
            </View>
          ) : (
            <>
              <Text style={styles.resultCount}>검색 결과 {results.length}건</Text>
              {results.map((item) => (
                <TouchableOpacity
                  key={`${item.zipCode}-${item.address}`}
                  style={styles.addressResultCard}
                  onPress={() => onSelect(item.zipCode, item.address)}
                >
                  <Text style={styles.zipCode}>우편번호 {item.zipCode}</Text>
                  <Text style={styles.addressResultText}>{item.address}</Text>
                </TouchableOpacity>
              ))}
              {results.length === 0 && (
                <View style={styles.noResult}>
                  <Text style={styles.noResultTitle}>검색 결과가 없습니다</Text>
                  <Text style={styles.noResultText}>다른 검색어로 시도해보세요.</Text>
                </View>
              )}
            </>
          )}
          <View style={styles.addressGuideBox}>
            <Text style={styles.addressGuideText}>실제 서비스에서는 주소 검색 API를 연결할 수 있지만, 현재는 프론트 mock 주소 목록만 사용합니다.</Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

function SuccessModal({
  visible,
  project,
  totalAmount,
  onClose,
}: {
  visible: boolean;
  project: FundingProject;
  totalAmount: number;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.successCard}>
          <View style={styles.successIcon}>
            <Check size={32} color="#FFF" />
          </View>
          <Text style={styles.successTitle}>후원 성공했어요!</Text>
          <Text style={styles.successBody}>{project.brewery}의 프로젝트를 후원해주셔서 감사합니다.</Text>
          <View style={styles.successAmountBox}>
            <Text style={styles.successAmountLabel}>후원 금액</Text>
            <Text style={styles.successAmountValue}>{totalAmount.toLocaleString()}원</Text>
          </View>
          <TouchableOpacity style={styles.successBtn} onPress={onClose}>
            <Text style={styles.successBtnText}>펀딩 목록 보기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function InfoModal({ type, onClose }: { type: InfoModalType; onClose: () => void }) {
  const title = type === 'privacy' ? '개인정보 처리방침' : '이용약관';
  const body =
    type === 'privacy'
      ? '후원 진행을 위해 이름, 연락처, 이메일, 배송지 주소를 수집하며, 결제와 배송 안내 목적으로만 사용합니다. 실제 서버 연동 전까지는 화면 내 mock 데이터로만 처리됩니다.'
      : '주담은 전통주 크라우드 펀딩 플랫폼입니다. 후원은 프로젝트 제작을 지원하는 행위이며, 프로젝트 진행 상황에 따라 일정과 세부 내용이 변경될 수 있습니다.';

  return (
    <Modal visible={Boolean(type)} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.infoModalCard}>
          <View style={styles.infoModalHeader}>
            <Text style={styles.infoModalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <Text style={styles.infoModalBody}>{body}</Text>
          <TouchableOpacity style={styles.infoModalBtn} onPress={onClose}>
            <Text style={styles.infoModalBtnText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', height: 104, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  content: { padding: 16, gap: 12 },
  projectSection: { backgroundColor: '#FFF', borderRadius: 18, padding: 14, flexDirection: 'row', gap: 14, borderWidth: 1, borderColor: '#E5E7EB' },
  projectImage: { width: 96, height: 96, borderRadius: 14, backgroundColor: '#E5E7EB' },
  projectInfo: { flex: 1, justifyContent: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  breweryText: { fontSize: 12, color: '#6B7280', fontWeight: '800' },
  categoryBadge: { backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  categoryText: { fontSize: 11, color: '#374151', fontWeight: '800' },
  projectTitle: { fontSize: 15, lineHeight: 21, color: '#111', fontWeight: '900', marginBottom: 8 },
  priceLine: { flexDirection: 'row', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' },
  rewardPrice: { fontSize: 18, color: '#111', fontWeight: '900' },
  daysLeft: { fontSize: 12, color: '#EF4444', fontWeight: '900' },
  progressCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', gap: 10 },
  progressTop: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  progressPct: { fontSize: 22, color: '#111', fontWeight: '900' },
  progressAmount: { fontSize: 13, color: '#4B5563', fontWeight: '800' },
  progressBar: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 999 },
  progressSub: { fontSize: 12, color: '#6B7280', fontWeight: '700' },
  section: { backgroundColor: '#FFF', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#E5E7EB', gap: 14 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  sectionTitle: { fontSize: 16, color: '#111', fontWeight: '900' },
  optionalText: { color: '#6B7280', fontWeight: '600' },
  rewardItems: { gap: 8 },
  rewardItemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#111', marginTop: 8 },
  rewardItemText: { flex: 1, fontSize: 14, color: '#374151', lineHeight: 22, fontWeight: '700' },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  deliveryText: { fontSize: 13, color: '#6B7280', fontWeight: '700' },
  deliveryDate: { color: '#EF4444', fontWeight: '900' },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  amountLabel: { fontSize: 14, color: '#111', fontWeight: '900' },
  amountValue: { fontSize: 18, color: '#111', fontWeight: '900' },
  quantityBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FAFB', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E5E7EB' },
  quantityBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  quantityBtnText: { fontSize: 24, color: '#111', fontWeight: '800', marginTop: -2 },
  quantityCenter: { alignItems: 'center' },
  quantityValue: { fontSize: 27, color: '#111', fontWeight: '900' },
  quantityUnit: { fontSize: 12, color: '#6B7280', fontWeight: '800' },
  calculationBox: { backgroundColor: '#F9FAFB', borderRadius: 14, padding: 14, gap: 8 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 14, color: '#6B7280', fontWeight: '700' },
  summaryValue: { fontSize: 14, color: '#111', fontWeight: '800' },
  moneyInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  moneyInput: { flex: 1, height: 50, borderRadius: 14, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFF', paddingHorizontal: 16, fontSize: 16, color: '#111', fontWeight: '900' },
  moneyUnit: { fontSize: 15, color: '#374151', fontWeight: '800' },
  helperText: { fontSize: 12, color: '#DB2777', fontWeight: '700' },
  fieldBlock: { gap: 8 },
  inputLabel: { fontSize: 13, color: '#111', fontWeight: '900' },
  input: { height: 50, borderRadius: 14, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFF', paddingHorizontal: 14, fontSize: 15, color: '#111', fontWeight: '700' },
  infoBox: { backgroundColor: '#F9FAFB', borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  infoText: { flex: 1, fontSize: 12, color: '#6B7280', lineHeight: 18, fontWeight: '700' },
  adultBadge: { backgroundColor: '#FEF2F2', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  adultBadgeText: { fontSize: 11, color: '#B91C1C', fontWeight: '900' },
  addressRow: { flexDirection: 'row', gap: 8 },
  addressInput: { flex: 1 },
  addressBtn: { width: 72, height: 50, borderRadius: 14, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  addressBtnText: { color: '#FFF', fontSize: 13, fontWeight: '900' },
  alcoholNotice: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 14, padding: 12, flexDirection: 'row', gap: 8 },
  alcoholNoticeText: { flex: 1, fontSize: 12, color: '#991B1B', lineHeight: 18, fontWeight: '700' },
  messageSelect: { height: 50, borderRadius: 14, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFF', paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  messageText: { flex: 1, fontSize: 14, color: '#111', fontWeight: '700' },
  messageOptions: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, overflow: 'hidden' },
  messageOption: { minHeight: 46, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  messageOptionText: { flex: 1, fontSize: 13, color: '#374151', fontWeight: '700' },
  paymentList: { gap: 10 },
  paymentOption: { minHeight: 64, borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  paymentOptionSelected: { borderColor: '#111', backgroundColor: '#F9FAFB' },
  paymentIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  paymentTitle: { fontSize: 14, color: '#111', fontWeight: '900', marginBottom: 2 },
  paymentDesc: { fontSize: 12, color: '#6B7280', fontWeight: '700' },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  radioSelected: { backgroundColor: '#111', borderColor: '#111' },
  finalAmountBox: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 14, gap: 9 },
  finalDivider: { height: 1, backgroundColor: '#E5E7EB' },
  finalTotalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  finalTotalLabel: { fontSize: 16, color: '#EF4444', fontWeight: '900' },
  finalTotalValue: { fontSize: 24, color: '#111', fontWeight: '900' },
  finalGuide: { fontSize: 12, color: '#6B7280', lineHeight: 18, fontWeight: '700' },
  agreementRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  agreementMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: { width: 22, height: 22, borderRadius: 7, borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#111', borderColor: '#111' },
  agreementText: { flex: 1, fontSize: 13, color: '#111', fontWeight: '800' },
  agreementAction: { fontSize: 12, color: '#2563EB', fontWeight: '900' },
  refundPolicy: { backgroundColor: '#F9FAFB', borderRadius: 14, padding: 14, gap: 8 },
  refundPolicyTitle: { fontSize: 13, color: '#111', fontWeight: '900', lineHeight: 19 },
  refundPolicyText: { fontSize: 12, color: '#4B5563', lineHeight: 19, fontWeight: '700' },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingHorizontal: 16, paddingTop: 12 },
  payButton: { height: 54, borderRadius: 16, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  payButtonDisabled: { backgroundColor: '#D1D5DB' },
  payButtonText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  bottomLinks: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingTop: 10 },
  bottomLinkText: { fontSize: 12, color: '#6B7280', fontWeight: '800' },
  bottomDot: { fontSize: 12, color: '#D1D5DB', fontWeight: '900' },
  noticeWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  noticeIcon: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  noticeTitle: { fontSize: 22, color: '#111', fontWeight: '900', marginBottom: 10, textAlign: 'center' },
  noticeBody: { fontSize: 14, color: '#6B7280', lineHeight: 22, fontWeight: '700', textAlign: 'center', marginBottom: 24 },
  noticePrimary: { width: '100%', height: 52, borderRadius: 16, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  noticePrimaryText: { color: '#FFF', fontSize: 15, fontWeight: '900' },
  noticeSecondary: { marginTop: 10, width: '100%', height: 52, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  noticeSecondaryText: { color: '#374151', fontSize: 15, fontWeight: '900' },
  addressModal: { flex: 1, backgroundColor: '#F9FAFB' },
  addressModalHeader: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingHorizontal: 12, paddingBottom: 14 },
  addressTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addressModalTitle: { fontSize: 18, color: '#111', fontWeight: '900' },
  addressSearchBox: { height: 48, borderRadius: 14, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  addressSearchInput: { flex: 1, fontSize: 14, color: '#111', fontWeight: '700' },
  addressResultArea: { flex: 1 },
  addressResultContent: { padding: 16, gap: 10 },
  addressEmpty: { alignItems: 'center', paddingVertical: 54 },
  addressEmptyTitle: { fontSize: 16, color: '#6B7280', fontWeight: '900', marginTop: 12, marginBottom: 6 },
  addressEmptyText: { fontSize: 12, color: '#9CA3AF', fontWeight: '700', textAlign: 'center' },
  resultCount: { fontSize: 12, color: '#6B7280', fontWeight: '800', marginBottom: 4 },
  addressResultCard: { backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', padding: 14, gap: 8 },
  zipCode: { alignSelf: 'flex-start', backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, fontSize: 11, color: '#6B7280', fontWeight: '900' },
  addressResultText: { fontSize: 14, color: '#111', lineHeight: 21, fontWeight: '800' },
  noResult: { alignItems: 'center', paddingVertical: 44 },
  noResultTitle: { fontSize: 15, color: '#6B7280', fontWeight: '900', marginBottom: 6 },
  noResultText: { fontSize: 12, color: '#9CA3AF', fontWeight: '700' },
  addressGuideBox: { backgroundColor: '#EFF6FF', borderRadius: 14, borderWidth: 1, borderColor: '#DBEAFE', padding: 14, marginTop: 8 },
  addressGuideText: { fontSize: 12, color: '#1D4ED8', lineHeight: 18, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  successCard: { width: '100%', maxWidth: 360, backgroundColor: '#FFF', borderRadius: 24, padding: 24, alignItems: 'center' },
  successIcon: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successTitle: { fontSize: 22, color: '#111', fontWeight: '900', marginBottom: 8 },
  successBody: { fontSize: 14, color: '#6B7280', lineHeight: 22, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  successAmountBox: { width: '100%', backgroundColor: '#F9FAFB', borderRadius: 16, padding: 14, alignItems: 'center', marginBottom: 16 },
  successAmountLabel: { fontSize: 12, color: '#6B7280', fontWeight: '800', marginBottom: 4 },
  successAmountValue: { fontSize: 22, color: '#111', fontWeight: '900' },
  successBtn: { width: '100%', height: 50, borderRadius: 16, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  successBtnText: { color: '#FFF', fontSize: 15, fontWeight: '900' },
  infoModalCard: { width: '100%', maxWidth: 360, backgroundColor: '#FFF', borderRadius: 22, padding: 20 },
  infoModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  infoModalTitle: { fontSize: 18, color: '#111', fontWeight: '900' },
  infoModalBody: { fontSize: 14, color: '#4B5563', lineHeight: 22, fontWeight: '700', marginBottom: 18 },
  infoModalBtn: { height: 48, borderRadius: 14, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  infoModalBtnText: { color: '#FFF', fontSize: 15, fontWeight: '900' },
});
