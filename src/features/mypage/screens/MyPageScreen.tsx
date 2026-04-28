import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import {
  Settings,
  Wine,
  ArrowRight,
  TrendingUp,
  BookOpen,
  PenSquare,
  Hash,
  Mail,
  Phone,
  MessageCircle,
  ThumbsUp,
  ChevronRight,
  ShieldCheck,
  Megaphone,
  HelpCircle,
  LogOut,
  X,
  ChevronDown,
  ChevronUp,
  Factory,
  LayoutDashboard,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const MY_ACTIVITIES = [
  { id: 1, type: "post", label: "게시글 작성", content: "오늘 드디어 벚꽃 막걸리 도착했어요! 첫 모금부터 꽃향기가 확 퍼지는 게 정말 감동이에요. 🌸", category: "자유게시판", likes: 42, comments: 8, time: "2시간 전" },
  { id: 2, type: "recipe", label: "레시피 작성", content: "국내산 쌀 2kg에 장미꽃잎 50g을 넣고 3일 발효하면 은은한 꽃향기가 정말 예쁘게 나와요 🌹", category: "레시피", likes: 28, comments: 6, time: "어제" },
];

const FAQ_ITEMS = [
  { id: 1, q: "펀딩 취소·환불은 어떻게 하나요?", a: "펀딩 취소는 마감일 전까지 마이페이지에서 직접 취소하실 수 있습니다. 단, 제조가 시작된 경우 취소가 불가할 수 있습니다." },
  { id: 2, q: "배송 조회는 어디서 하나요?", a: "마이페이지 > 참여 펀딩에서 배송 상태를 확인할 수 있으며, 배송 시작 시 알림을 보내드립니다." },
];

export default function MyPageScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [supportVisible, setSupportVisible] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  if (!user) {
    return (
      <View style={styles.loginReqContainer}>
        <View style={styles.loginReqCard}>
           <Wine size={60} color="#9CA3AF" />
           <Text style={styles.loginReqTitle}>로그인이 필요합니다</Text>
           <Text style={styles.loginReqDesc}>마이페이지를 이용하시려면{'\n'}로그인을 해주세요</Text>
           <Button label="로그인하러 가기" onPress={() => router.push('/login')} style={styles.loginReqBtn} />
        </View>
      </View>
    );
  }

  const initial = user.name?.[0] || 'U';
  const isBrewery = user.type === 'brewery';

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* 1. Header & Profile */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
           <View style={styles.profileRow}>
              <View style={styles.avatar}>
                 <Text style={styles.avatarTxt}>{initial}</Text>
              </View>
              <View style={styles.profileInfo}>
                 <Text style={styles.profileName}>{user.name} 님</Text>
                 <View style={styles.typeBadge}>
                    {isBrewery ? <Factory size={10} color="#6B7280" /> : <Wine size={10} color="#6B7280" />}
                    <Text style={styles.typeBadgeTxt}>{isBrewery ? "양조장 계정" : "일반 유저"}</Text>
                 </View>
              </View>
              <TouchableOpacity style={styles.settingsBtn}>
                 <Settings size={20} color="#6B7280" />
              </TouchableOpacity>
           </View>

           {isBrewery && (
             <TouchableOpacity style={styles.dashboardLink} activeOpacity={0.8}>
                <LinearGradient colors={['#111', '#333']} style={styles.dashboardInner}>
                   <View style={styles.dashboardTxtBox}>
                      <LayoutDashboard size={16} color="rgba(255,255,255,0.7)" />
                      <Text style={styles.dashboardTitle}>양조장 대시보드</Text>
                   </View>
                   <ArrowRight size={20} color="#FFF" />
                </LinearGradient>
             </TouchableOpacity>
           )}
        </View>

        {/* 2. BTI Card */}
        <View style={styles.btiContainer}>
           <TouchableOpacity style={styles.btiCard} activeOpacity={0.9}>
              <View style={styles.btiIconBox}><Text style={{fontSize: 24}}>🍶</Text></View>
              <View style={styles.btiTxtBox}>
                 <Text style={styles.btiTitle}>나의 술BTI 확인하기</Text>
                 <Text style={styles.btiDesc}>아직 테스트를 진행하지 않으셨어요</Text>
              </View>
              <ArrowRight size={20} color="#9CA3AF" />
           </TouchableOpacity>
           <TouchableOpacity style={styles.btiLinkBtn}>
              <Text style={styles.btiLinkTxt}>🍶 술BTI 검사하러 가기</Text>
           </TouchableOpacity>
        </View>

        {/* 3. Stats Grid */}
        <View style={styles.statsGrid}>
           <StatItem icon={<TrendingUp size={18} color="#4B5563" />} label="참여 펀딩" val="6" />
           <StatItem icon={<BookOpen size={18} color="#4B5563" />} label="내 아카이브" val="12" />
           <StatItem icon={<PenSquare size={18} color="#4B5563" />} label="작성 게시글" val="5" />
        </View>

        {/* 4. Sections */}
        <View style={styles.sectionArea}>
           <Text style={styles.sectionLabel}>계정 정보</Text>
           <View style={styles.infoCard}>
              <InfoRow icon={<Hash size={14} color="#9CA3AF" />} label="고유 ID" val={user.uid || "JD-UNKNOWN"} />
              <InfoRow icon={<Mail size={14} color="#9CA3AF" />} label="이메일" val={user.email} />
              <InfoRow icon={<Phone size={14} color="#9CA3AF" />} label="전화번호" val={user.phone || "미등록"} last />
           </View>

           <Text style={[styles.sectionLabel, { marginTop: 24 }]}>나의 활동</Text>
           {MY_ACTIVITIES.map(act => (
             <TouchableOpacity key={act.id} style={styles.activityCard} activeOpacity={0.8}>
                <View style={styles.actHeader}>
                   <View style={[styles.actBadge, act.type === 'post' ? styles.actBadgeDark : styles.actBadgeGray]}>
                      <Text style={[styles.actBadgeTxt, act.type === 'post' && { color: '#FFF' }]}>{act.label}</Text>
                   </View>
                   <Text style={styles.actTime}>{act.time}</Text>
                </View>
                <Text style={styles.actContent} numberOfLines={2}>{act.content}</Text>
                <View style={styles.actFooter}>
                   <View style={styles.actStat}><ThumbsUp size={12} color="#9CA3AF" /><Text style={styles.actStatTxt}>{act.likes}</Text></View>
                   <View style={styles.actStat}><MessageCircle size={12} color="#9CA3AF" /><Text style={styles.actStatTxt}>{act.comments}</Text></View>
                   <Text style={styles.viewMore}>자세히 보기</Text>
                </View>
             </TouchableOpacity>
           ))}

           <Text style={[styles.sectionLabel, { marginTop: 24 }]}>기타</Text>
           <View style={styles.menuCard}>
              {!isBrewery && <MenuItem icon={<ShieldCheck size={18} color="#6B7280" />} title="양조장 인증 신청" />}
              <MenuItem icon={<Megaphone size={18} color="#6B7280" />} title="공지사항" />
              <MenuItem icon={<HelpCircle size={18} color="#6B7280" />} title="고객센터" onPress={() => setSupportVisible(true)} />
              <MenuItem icon={<LogOut size={18} color="#EF4444" />} title="로그아웃" danger last onPress={logout} />
           </View>
        </View>
      </ScrollView>

      {/* Support Modal */}
      <Modal visible={supportVisible} animationType="slide" transparent>
         <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
               <View style={styles.modalHeader}>
                  <View style={styles.dragHandle} />
                  <TouchableOpacity style={styles.closeBtn} onPress={() => setSupportVisible(false)}>
                     <X size={24} color="#111" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>고객센터</Text>
               </View>

               <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
                  <View style={styles.emailCard}>
                     <View style={styles.emailIcon}><Mail size={20} color="#FFF" /></View>
                     <View>
                        <Text style={styles.emailLabel}>이메일 문의 (권장)</Text>
                        <Text style={styles.emailVal}>support@judam.com</Text>
                        <Text style={styles.emailTime}>평일 10:00 - 18:00 응답</Text>
                     </View>
                  </View>

                  <Text style={styles.subLabel}>자주 묻는 질문</Text>
                  {FAQ_ITEMS.map(faq => (
                    <TouchableOpacity key={faq.id} style={styles.faqItem} onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}>
                       <View style={styles.faqQ}>
                          <Text style={styles.faqQTxt}>Q. {faq.q}</Text>
                          {expandedFaq === faq.id ? <ChevronUp size={16} color="#9CA3AF" /> : <ChevronDown size={16} color="#9CA3AF" />}
                       </View>
                       {expandedFaq === faq.id && (
                         <View style={styles.faqA}>
                            <Text style={styles.faqATxt}>A. {faq.a}</Text>
                         </View>
                       )}
                    </TouchableOpacity>
                  ))}

                  <Text style={styles.subLabel}>간편 문의하기</Text>
                  <TextInput 
                    style={styles.supportInput} 
                    placeholder="문의 내용을 입력해주세요..." 
                    multiline 
                    placeholderTextColor="#9CA3AF"
                  />
                  <Button label="문의 보내기" style={styles.sendBtn} />
                  <View style={{ height: 40 }} />
               </ScrollView>
            </View>
         </View>
      </Modal>
    </View>
  );
}

function StatItem({ icon, label, val }: any) {
  return (
    <View style={styles.statItem}>
       <View style={styles.statIconBox}>{icon}</View>
       <Text style={styles.statVal}>{val}</Text>
       <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({ icon, label, val, last }: any) {
  return (
    <View style={[styles.infoRow, !last && styles.borderB]}>
       <View style={styles.infoIconBox}>{icon}</View>
       <View style={{ flex: 1 }}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoVal}>{val}</Text>
       </View>
    </View>
  );
}

function MenuItem({ icon, title, danger, last, onPress }: any) {
  return (
    <TouchableOpacity style={[styles.menuItem, !last && styles.borderB]} onPress={onPress}>
       <View style={styles.menuIconBox}>{icon}</View>
       <Text style={[styles.menuTitle, danger && { color: '#EF4444' }]}>{title}</Text>
       <ChevronRight size={16} color="#D1D5DB" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#FFF', paddingHorizontal: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: '800', color: '#111' },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F3F4F6', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginTop: 4 },
  typeBadgeTxt: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  settingsBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' },
  dashboardLink: { marginTop: 20 },
  dashboardInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 20 },
  dashboardTxtBox: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dashboardTitle: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  btiContainer: { padding: 20 },
  btiCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  btiIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' },
  btiTxtBox: { flex: 1 },
  btiTitle: { fontSize: 15, fontWeight: '800', color: '#111' },
  btiDesc: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  btiLinkBtn: { marginTop: 10, alignItems: 'center', padding: 12 },
  btiLinkTxt: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  statsGrid: { flexDirection: 'row', backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 24, padding: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  statItem: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 10 },
  statIconBox: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '900', color: '#111' },
  statLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '700' },
  sectionArea: { padding: 24 },
  sectionLabel: { fontSize: 12, fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 12, marginLeft: 4 },
  infoCard: { backgroundColor: '#FFF', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#F3F4F6' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  infoIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: '700', marginBottom: 2 },
  infoVal: { fontSize: 14, fontWeight: '700', color: '#111' },
  borderB: { borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  activityCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  actHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  actBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  actBadgeDark: { backgroundColor: '#111' },
  actBadgeGray: { backgroundColor: '#F3F4F6' },
  actBadgeTxt: { fontSize: 10, fontWeight: '800', color: '#6B7280' },
  actTime: { fontSize: 11, color: '#9CA3AF' },
  actContent: { fontSize: 14, color: '#4B5563', lineHeight: 20, fontWeight: '500' },
  actFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F9FAFB', gap: 16 },
  actStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actStatTxt: { fontSize: 12, color: '#9CA3AF', fontWeight: '700' },
  viewMore: { marginLeft: 'auto', fontSize: 11, color: '#9CA3AF', fontWeight: '700' },
  menuCard: { backgroundColor: '#FFF', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#F3F4F6' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 12 },
  menuIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' },
  menuTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: '#111' },
  loginReqContainer: { flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', padding: 30 },
  loginReqCard: { width: '100%', backgroundColor: '#FFF', borderRadius: 32, padding: 40, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 5 },
  loginReqTitle: { fontSize: 22, fontWeight: '800', marginTop: 24, marginBottom: 12 },
  loginReqDesc: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  loginReqBtn: { width: '100%' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, height: '85%' },
  modalHeader: { padding: 20, alignItems: 'center' },
  dragHandle: { width: 40, height: 5, backgroundColor: '#E5E7EB', borderRadius: 3, marginBottom: 20 },
  closeBtn: { position: 'absolute', right: 20, top: 40 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  modalScroll: { flex: 1, paddingHorizontal: 24 },
  emailCard: { backgroundColor: '#F9FAFB', borderRadius: 24, padding: 20, flexDirection: 'row', gap: 16, alignItems: 'center', marginBottom: 24 },
  emailIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  emailLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '700' },
  emailVal: { fontSize: 15, fontWeight: '900', color: '#111', marginVertical: 2 },
  emailTime: { fontSize: 10, color: '#9CA3AF', fontWeight: '600' },
  subLabel: { fontSize: 14, fontWeight: '900', color: '#111', marginBottom: 16 },
  faqItem: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16, marginBottom: 12 },
  faqQ: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQTxt: { fontSize: 14, fontWeight: '700', color: '#374151', flex: 1 },
  faqA: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  faqATxt: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
  supportInput: { height: 120, backgroundColor: '#F9FAFB', borderRadius: 20, padding: 16, textAlignVertical: 'top', fontSize: 14, color: '#111', borderWidth: 1, borderColor: '#F3F4F6', marginBottom: 16 },
  sendBtn: { height: 56, borderRadius: 16 },
});
