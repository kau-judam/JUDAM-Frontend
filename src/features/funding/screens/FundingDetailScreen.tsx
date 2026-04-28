import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  Heart,
  ChevronLeft,
  Calendar,
  Target,
  MessageCircle,
  Star,
  ThumbsUp,
  Send,
  ChevronDown,
  ChevronUp,
  Bell,
  LayoutDashboard,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp, SlideInDown } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { fundingProjects, FundingProject } from '@/constants/data';

const reviewsData = [
  { id: 1, projectId: 5, userName: "전통주러버", rating: 5, date: "2026. 03. 25", comment: "정말 기대 이상이었어요! 벚꽃의 은은한 향이 정말 좋았습니다." },
  { id: 2, projectId: 5, userName: "막걸리매니아", rating: 5, date: "2026. 03. 23", comment: "펀딩에 참여해서 받아본 첫 전통주인데 너무 만족스럽습니다. 다음 프로젝트도 기대할게요!" },
  { id: 3, projectId: 6, userName: "술BTI_약주", rating: 4, date: "2026. 03. 22", comment: "향은 좋은데 조금 더 달았으면 좋겠어요. 그래도 전반적으로 만족합니다." },
];

const initialComments = [
  {
    id: 1,
    userName: "김주담",
    content: "정말 기대되는 프로젝트예요! 언제쯤 배송이 가능할까요?",
    date: "2026. 03. 25",
    likes: 12,
    isBrewery: false,
    replies: [
      { id: 101, userName: "꽃샘양조장", content: "안녕하세요! 펀딩 마감 후 약 45일 이내에 배송 예정입니다. 감사합니다!", date: "2026. 03. 25", likes: 8, isBrewery: true },
    ],
  },
  { id: 2, userName: "이술사", content: "알코올 도수가 궁금합니다. 혹시 알려주실 수 있나요?", date: "2026. 03. 24", likes: 5, isBrewery: false, replies: [] },
];

export default function FundingDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { isFavoriteFunding, toggleFavoriteFunding } = useFavorites();
  const rawProjectId = Array.isArray(id) ? id[0] : id;
  const projectId = Number(rawProjectId);
  
  const [project, setProject] = useState<FundingProject | null>(null);
  const [activeTab, setActiveTab] = useState<"소개" | "양조일지" | "Q&A" | "후기">("소개");
  const [showFundingGuideModal, setShowFundingGuideModal] = useState(false);

  // Q&A State
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const [likedReplies, setLikedReplies] = useState<Set<number>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set([1]));

  useEffect(() => {
    const found = fundingProjects.find(p => p.id === projectId);
    setProject(found || null);
  }, [projectId]);

  if (!project) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: '#6B7280', marginBottom: 16 }}>프로젝트를 찾을 수 없습니다.</Text>
        <Button label="목록으로 돌아가기" onPress={() => router.back()} />
      </View>
    );
  }

  const progressPercentage = Math.min((project.currentAmount / project.goalAmount) * 100, 100);
  const isBrewery = user?.type === "brewery" && user?.isBreweryVerified;

  const recommendedProjects = fundingProjects.filter(p => p.id !== project.id).slice(0, 4);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      userName: user?.name || "나",
      content: newComment.trim(),
      date: new Date().toLocaleDateString("ko-KR"),
      likes: 0,
      isBrewery: false,
      replies: [],
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  const handleAddReply = (commentId: number) => {
    if (!replyContent.trim()) return;
    const newReply = {
      id: Date.now(),
      userName: user?.name || "나",
      content: replyContent.trim(),
      date: new Date().toLocaleDateString("ko-KR"),
      likes: 0,
      isBrewery: false,
    };
    setComments(comments.map(c => c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c));
    setReplyContent("");
    setReplyingTo(null);
    setExpandedComments(new Set([...expandedComments, commentId]));
  };

  const toggleCommentLike = (commentId: number) => {
    const newLiked = new Set(likedComments);
    let diff = 0;
    if (newLiked.has(commentId)) {
      newLiked.delete(commentId);
      diff = -1;
    } else {
      newLiked.add(commentId);
      diff = 1;
    }
    setComments(comments.map(c => c.id === commentId ? { ...c, likes: c.likes + diff } : c));
    setLikedComments(newLiked);
  };

  const toggleReplyLike = (commentId: number, replyId: number) => {
    const uniqueId = commentId * 10000 + replyId;
    const newLiked = new Set(likedReplies);
    let diff = 0;
    if (newLiked.has(uniqueId)) {
      newLiked.delete(uniqueId);
      diff = -1;
    } else {
      newLiked.add(uniqueId);
      diff = 1;
    }
    setComments(comments.map(c => c.id === commentId ? {
      ...c,
      replies: c.replies.map(r => r.id === replyId ? { ...r, likes: r.likes + diff } : r)
    } : c));
    setLikedReplies(newLiked);
  };

  const toggleExpandComment = (commentId: number) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) newExpanded.delete(commentId);
    else newExpanded.add(commentId);
    setExpandedComments(newExpanded);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* ── Fixed White Header ── */}
      <View style={[styles.header, { paddingTop: insets.top, height: insets.top + 52 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerIconBtn}>
            <ChevronLeft size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>펀딩</Text>
        </View>
        <View style={styles.headerRight}>
           {isBrewery && (
             <TouchableOpacity onPress={() => router.push('/brewery/dashboard' as any)} style={styles.headerIconBtn}>
               <LayoutDashboard size={20} color="#111" />
             </TouchableOpacity>
           )}
           {isBrewery && (
             <TouchableOpacity onPress={() => router.push('/notifications' as any)} style={styles.headerIconBtn}>
               <Bell size={20} color="#111" />
             </TouchableOpacity>
           )}
           <TouchableOpacity onPress={() => router.push('/ai-chat' as any)} style={styles.headerIconBtn}>
             <MessageCircle size={20} color="#111" />
           </TouchableOpacity>
        </View>
      </View>

      {/* ── Main Scroll ── */}
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false} 
        stickyHeaderIndices={[4]} 
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* 1. Hero Visual */}
        <View style={styles.visualContainer}>
           <Image source={{ uri: project.image }} style={styles.mainImg} />
        </View>

        {/* 2. Title & Desc */}
        <Animated.View entering={FadeInUp} style={styles.titleSection}>
          <Text style={styles.projectTitle}>{project.title}</Text>
          <Text style={styles.shortDesc}>{project.shortDescription}</Text>
        </Animated.View>

        {/* 3. Funding Status */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.statusCard}>
          <View style={styles.statusGrid}>
             <View style={styles.statusItem}>
                <Text style={styles.statusVal}>{progressPercentage.toFixed(0)}%</Text>
                <Text style={styles.statusLab}>달성률</Text>
             </View>
             <View style={[styles.statusItem, styles.statusBorder]}>
                <Text style={styles.statusVal}>{(project.currentAmount / 10000).toLocaleString()}<Text style={{fontSize: 16, fontWeight: 'normal'}}>만원</Text></Text>
                <Text style={styles.statusLab}>모인금액</Text>
             </View>
             <View style={styles.statusItem}>
                <Text style={styles.statusVal}>{project.backers}</Text>
                <Text style={styles.statusLab}>후원자</Text>
             </View>
          </View>
          <Progress value={progressPercentage} style={styles.progressBar} indicatorStyle={{ backgroundColor: '#111' }} />
          <View style={styles.dateInfo}>
             <View style={styles.dateRow}>
                <Calendar size={16} color="#4B5563" />
                <Text style={styles.dateTxt}>{project.status === "진행 중" ? `${project.daysLeft}일 남음` : "펀딩 종료"}</Text>
             </View>
             <Text style={styles.periodTxt}>{project.startDate} ~ {project.endDate}</Text>
          </View>
        </Animated.View>

        {/* 4. Brewery Info */}
        <Animated.View entering={FadeInUp.delay(200)} style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <TouchableOpacity style={styles.breweryCard} activeOpacity={0.8} onPress={() => router.push(`/brewery/${project.id}` as any)}>
             <View style={styles.breweryLogo}><Text style={{ fontSize: 24 }}>{project.breweryLogo}</Text></View>
             <View style={{ flex: 1 }}>
                <Text style={styles.breweryName}>{project.brewery}</Text>
                <Text style={styles.breweryLoc}>{project.location}</Text>
             </View>
             <View style={styles.catBadge}><Text style={styles.catTxt}>{project.category}</Text></View>
          </TouchableOpacity>
        </Animated.View>

        {/* 5. Sticky Tabs */}
        <View style={styles.stickyTabWrapper}>
          <View style={styles.tabContainer}>
             {(["소개", "양조일지", "Q&A", "후기"] as const).map(tab => (
               <TouchableOpacity 
                 key={tab} 
                 style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]} 
                 onPress={() => setActiveTab(tab)}
               >
                  <Text style={[styles.tabBtnTxt, activeTab === tab && styles.tabBtnTxtActive]}>{tab}</Text>
               </TouchableOpacity>
             ))}
          </View>
        </View>

        {/* 6. Tab Content */}
        <View style={styles.contentArea}>
           {activeTab === "소개" && (
             <Animated.View entering={FadeIn.duration(300)}>
                {/* Introduction Section */}
                <View style={styles.sectionCard}>
                   <Text style={styles.sectionHeaderTitle}>프로젝트 소개</Text>
                   
                   <View style={styles.recipeSummaryGrid}>
                      <View style={styles.ingCard}>
                         <View style={styles.ingRow}>
                            <View style={{ flex: 1 }}>
                               <Text style={styles.ingLab}>메인재료</Text>
                               <Text style={styles.ingVal}>국내산 쌀, 전통 누룩</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                               <Text style={styles.ingLab}>서브재료</Text>
                               <Text style={styles.ingVal}>식용 벚꽃잎</Text>
                            </View>
                         </View>
                      </View>
                      <View style={styles.ingCardMini}>
                         <Text style={styles.ingLab}>도수</Text>
                         <Text style={styles.ingVal}>6%</Text>
                      </View>
                   </View>

                   <View style={styles.summaryBox}>
                      <Text style={styles.summaryTitle}>📝 프로젝트 요약</Text>
                      <Text style={styles.summaryTxt}>봄철 벚꽃이 만개할 때 수확한 식용 벚꽃잎을 활용하여, 전통 누룩 발효 방식으로 빚어내는 계절 한정 막걸리입니다. 벚꽃의 은은한 향과 자연스러운 색감이 더해져 봄의 낭만을 한 병에 담았습니다.</Text>
                   </View>

                   <Text style={styles.bodyTxt}>
                     {project.title}는 전통 방식을 고수하면서도 현대적인 감각을 더한 특별한 프로젝트입니다. {'\n\n'}
                     우리 양조장은 3대째 이어온 전통 누룩 제조 기술을 바탕으로, 여러분과 함께 새로운 맛을 창조하고자 합니다. 봄의 청량한 기운과 벚꽃의 은은한 향을 담아, 전통주의 새로운 매력을 선사합니다.
                   </Text>
                </View>

                {/* Price Info Section */}
                <View style={styles.sectionCard}>
                   <Text style={styles.sectionHeaderTitle}>가격 안내</Text>
                   
                   <View style={styles.priceCard}>
                      <View style={[styles.priceStrip, { backgroundColor: '#111' }]} />
                      <View style={styles.priceContent}>
                         <View>
                            <Text style={styles.priceLab}>병당 단가</Text>
                            <Text style={styles.priceVal}>20,000<Text style={{ fontSize: 20, fontWeight: 'normal' }}>원</Text></Text>
                         </View>
                         <Text style={styles.priceSub}>375ml</Text>
                      </View>
                   </View>

                   <View style={[styles.priceCard, { marginTop: 12 }]}>
                      <View style={[styles.priceStrip, { backgroundColor: '#D1D5DB' }]} />
                      <View style={styles.priceContent}>
                         <View>
                            <Text style={styles.priceLab}>총 판매 수량</Text>
                            <Text style={styles.priceVal}>500<Text style={{ fontSize: 20, fontWeight: 'normal' }}>병</Text></Text>
                         </View>
                         <Text style={styles.priceSub}>목표 수량</Text>
                      </View>
                   </View>

                   <View style={styles.totalGoalBox}>
                      <Text style={styles.totalGoalLab}>펀딩 목표 금액</Text>
                      <Text style={styles.totalGoalVal}>{(500 * 20000).toLocaleString()}원</Text>
                   </View>
                </View>

                {/* Budget Section */}
                <View style={styles.sectionCard}>
                   <Text style={styles.sectionHeaderTitle}>프로젝트 예산</Text>
                   <View style={styles.budgetRow}><Text style={styles.budgetLab}>원료비 (쌀, 누룩, 벚꽃)</Text><Text style={styles.budgetVal}>180만원</Text></View>
                   <View style={styles.budgetRow}><Text style={styles.budgetLab}>양조 인건비</Text><Text style={styles.budgetVal}>150만원</Text></View>
                   <View style={styles.budgetRow}><Text style={styles.budgetLab}>병입 및 포장 비용</Text><Text style={styles.budgetVal}>100만원</Text></View>
                   <View style={styles.budgetRow}><Text style={styles.budgetLab}>배송비</Text><Text style={styles.budgetVal}>80만원</Text></View>
                   <View style={styles.budgetRow}><Text style={styles.budgetLab}>디자인 및 마케팅</Text><Text style={styles.budgetVal}>60만원</Text></View>
                   <View style={styles.budgetRow}><Text style={styles.budgetLab}>플랫폼 수수료 (7%)</Text><Text style={styles.budgetVal}>40만원</Text></View>
                   <View style={[styles.budgetRow, styles.budgetTotal]}>
                     <Text style={styles.budgetTotalLab}>총 목표 금액</Text>
                     <Text style={styles.budgetTotalVal}>610만원</Text>
                   </View>
                   <Text style={styles.budgetGuide}>목표 금액을 초과 달성하는 경우, 추가 금액은 리워드 품질 향상과 더 많은 후원자 분들께 제품을 전달하는 데 사용됩니다.</Text>
                </View>

                {/* Schedule Section */}
                <View style={styles.sectionCard}>
                   <Text style={styles.sectionHeaderTitle}>프로젝트 일정</Text>
                   <View style={{ gap: 16 }}>
                     <View style={styles.schRow}><Text style={styles.schDate}>3월 20일</Text><Text style={styles.schDesc}>펀딩 시작 및 원료 준비 완료</Text></View>
                     <View style={styles.schRow}><Text style={styles.schDate}>4월 18일</Text><Text style={styles.schDesc}>펀딩 종료 및 최종 레시피 확정</Text></View>
                     <View style={styles.schRow}><Text style={styles.schDate}>4월 25일</Text><Text style={styles.schDesc}>벚꽃 수확 및 양조 시작 (발효 30일)</Text></View>
                     <View style={styles.schRow}><Text style={styles.schDate}>5월 25일</Text><Text style={styles.schDesc}>발효 완료 및 숙성</Text></View>
                     <View style={styles.schRow}><Text style={styles.schDate}>6월 1일</Text><Text style={styles.schDesc}>병입 및 라벨링 작업</Text></View>
                     <View style={styles.schRow}><Text style={styles.schDate}>6월 15일</Text><Text style={[styles.schDesc, { fontWeight: '700', color: '#111' }]}>배송 시작 (순차 발송)</Text></View>
                   </View>
                   <View style={styles.schAlert}>
                      <Text style={styles.schAlertTxt}>💡 발효는 자연 과정이므로 기후 조건에 따라 일정이 1-2주 지연될 수 있습니다. 지연 시 양조 일지와 커뮤니티를 통해 실시간으로 소통하겠습니다.</Text>
                   </View>
                </View>

                {/* Taste Profile (SVG Radar Chart) */}
                <View style={styles.sectionCard}>
                   <Text style={styles.sectionHeaderTitle}>맛 지표</Text>
                   <Text style={styles.sectionSub}>양조장이 예상하는 이 전통주의 맛 프로필입니다.</Text>
                   
                   <View style={styles.radarContainer}>
                      <Svg viewBox="0 0 400 400" width="100%" height="250">
                        {[1, 0.75, 0.5, 0.25].map((scale) => (
                          <Polygon
                            key={scale}
                            points={[
                              [200, 200 - 150 * scale],
                              [200 + 142.5 * scale, 200 - 46.35 * scale],
                              [200 + 88.1 * scale, 200 + 121.35 * scale],
                              [200 - 88.1 * scale, 200 + 121.35 * scale],
                              [200 - 142.5 * scale, 200 - 46.35 * scale],
                            ].map(p => p.join(',')).join(' ')}
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="1"
                          />
                        ))}
                        {[
                          [200, 50],
                          [342.5, 153.65],
                          [288.1, 321.35],
                          [111.9, 321.35],
                          [57.5, 153.65],
                        ].map((point, i) => (
                          <Line
                            key={`line-${i}`}
                            x1="200" y1="200" x2={point[0]} y2={point[1]}
                            stroke="#E5E7EB" strokeWidth="1"
                          />
                        ))}
                        <Polygon
                          points={[
                            [200, 200 - (70 / 100) * 150],
                            [200 + (55 / 100) * 142.5, 200 - (55 / 100) * 46.35],
                            [200 + (80 / 100) * 88.1, 200 + (80 / 100) * 121.35],
                            [200 - (65 / 100) * 88.1, 200 + (65 / 100) * 121.35],
                            [200 - (75 / 100) * 142.5, 200 - (75 / 100) * 46.35],
                          ].map(p => p.join(',')).join(' ')}
                          fill="rgba(0, 0, 0, 0.2)"
                          stroke="rgba(0, 0, 0, 0.8)"
                          strokeWidth="2"
                        />
                        {[
                          { x: 200, y: 200 - (70 / 100) * 150 },
                          { x: 200 + (55 / 100) * 142.5, y: 200 - (55 / 100) * 46.35 },
                          { x: 200 + (80 / 100) * 88.1, y: 200 + (80 / 100) * 121.35 },
                          { x: 200 - (65 / 100) * 88.1, y: 200 + (65 / 100) * 121.35 },
                          { x: 200 - (75 / 100) * 142.5, y: 200 - (75 / 100) * 46.35 },
                        ].map((point, i) => (
                          <Circle key={`circle-${i}`} cx={point.x} cy={point.y} r="4" fill="black" />
                        ))}
                        <SvgText x="200" y="35" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#374151">단맛</SvgText>
                        <SvgText x="360" y="158" textAnchor="start" fontSize="14" fontWeight="bold" fill="#374151">잔향</SvgText>
                        <SvgText x="295" y="345" textAnchor="start" fontSize="14" fontWeight="bold" fill="#374151">산미</SvgText>
                        <SvgText x="105" y="345" textAnchor="end" fontSize="14" fontWeight="bold" fill="#374151">바디감</SvgText>
                        <SvgText x="40" y="158" textAnchor="end" fontSize="14" fontWeight="bold" fill="#374151">탄산감</SvgText>
                      </Svg>
                   </View>
                   <View style={styles.tasteGrid}>
                      {[
                        { label: "단맛", value: 70 },
                        { label: "잔향", value: 55 },
                        { label: "산미", value: 80 },
                        { label: "바디감", value: 65 },
                        { label: "탄산감", value: 75 },
                      ].map(t => (
                        <View key={t.label} style={styles.tasteItemBox}>
                           <Text style={styles.tasteLab}>{t.label}</Text>
                           <View style={styles.tasteRowWrap}>
                              <View style={styles.tasteBarBg}>
                                 <View style={[styles.tasteBarFill, { width: `${t.value}%` }]} />
                              </View>
                              <Text style={styles.tasteVal}>{t.value}%</Text>
                           </View>
                        </View>
                      ))}
                   </View>
                </View>

                {/* Guide Section */}
                <View style={styles.sectionCard}>
                   <Text style={styles.sectionHeaderTitle}>안내사항</Text>
                   
                   <View style={{ marginBottom: 32 }}>
                     <Text style={styles.guideHeading}>📌 주담 크라우드 펀딩 안내</Text>
                     <View style={styles.guideBox}>
                        <Text style={styles.guideBoxTitle}>후원은 공동 기획의 시작입니다</Text>
                        <Text style={styles.guideBoxTxt}>주담의 후원은 이미 완성된 술을 사는 쇼핑이 아니라, 여러분의 레시피 제안이 실제 제품으로 탄생하도록 양조장을 지원하는 협업입니다. 따라서 전자상거래법상 단순 변심에 의한 청약철회(7일 내 환불)가 적용되지 않습니다.</Text>
                     </View>
                     <View style={[styles.guideBox, { marginTop: 12 }]}>
                        <Text style={styles.guideBoxTitle}>술은 살아있는 생물입니다</Text>
                        <Text style={styles.guideBoxTxt}>전통주는 발효 과정에서 자연적인 변수가 발생할 수 있습니다. 기획 의도를 최우선으로 하되, 발효가 주는 미세한 맛의 차이는 전통주 펀딩만의 독특한 매력으로 이해해 주시길 부탁드립니다.</Text>
                     </View>
                     <TouchableOpacity style={{ marginTop: 12 }} onPress={() => setShowFundingGuideModal(true)}>
                        <Text style={styles.guideLink}>🍶 주담의 펀딩 알아보기 (안내) →</Text>
                     </TouchableOpacity>
                   </View>

                   <View style={{ marginBottom: 32, paddingTop: 24, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
                     <Text style={styles.guideHeading}>📄 프로젝트 정책</Text>
                     <View style={styles.guideBoxPlain}>
                        <Text style={styles.guideBoxTxt}><Text style={{fontWeight: '700', color: '#111'}}>환불:</Text> 프로젝트 마감 후 즉시 양조 공정이 시작되므로 단순 변심 환불은 불가합니다. 단, 양조장의 사정으로 생산이 불가능해질 경우 100% 환불을 보장합니다.</Text>
                        <Text style={[styles.guideBoxTxt, { marginTop: 12 }]}><Text style={{fontWeight: '700', color: '#111'}}>교환/AS:</Text> 주류 배송 특성상 파손된 상태로 수령 시, 사진과 함께 접수해주시면 즉시 새 제품으로 교환해 드립니다.</Text>
                        <Text style={[styles.guideBoxTxt, { marginTop: 12 }]}><Text style={{fontWeight: '700', color: '#111'}}>성인인증:</Text> 본 프로젝트는 성인인증을 완료한 후원자만 참여 가능하며, 배송 시 대리 수령이 제한될 수 있습니다.</Text>
                     </View>
                   </View>

                   <View style={{ paddingTop: 24, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
                     <Text style={styles.guideHeading}>⚠️ 예상되는 어려움</Text>
                     <View style={styles.guideBoxPlain}>
                        <Text style={styles.guideBoxTxt}><Text style={{fontWeight: '700', color: '#111'}}>품질 변동:</Text> AI 검토와 전문가의 관리를 거치나, 기온 변화에 따라 도수나 당도가 기획안과 ±1~2% 정도 차이가 날 수 있습니다.</Text>
                        <Text style={[styles.guideBoxTxt, { marginTop: 12 }]}><Text style={{fontWeight: '700', color: '#111'}}>일정 지연:</Text> 술이 충분히 익지 않았을 경우, 최상의 맛을 위해 출고가 최대 10일 정도 지연될 수 있으며 이 경우 커뮤니티를 통해 즉시 공지하겠습니다.</Text>
                     </View>
                   </View>
                </View>
             </Animated.View>
           )}

           {activeTab === "양조일지" && (
             <Animated.View entering={FadeIn}>
                <View style={styles.journalList}>
                   <View style={styles.sectionCard}>
                      <View style={styles.journalItem}>
                         <View style={styles.journalStep}><Text style={styles.journalStepTxt}>1</Text></View>
                         <View style={{ flex: 1 }}>
                            <View style={styles.journalHeader}>
                               <Text style={styles.journalTitle}>엄선된 원료 준비 및 검수</Text>
                               <Text style={styles.journalDate}>2026. 03. 22</Text>
                            </View>
                            <Text style={styles.journalBody}>프로젝트에 사용될 국산 쌀과 누룩을 모두 준비했습니다. 여러분의 의견을 반영하여 최고급 쌀을 선정했어요!</Text>
                         </View>
                      </View>
                      <View style={styles.journalImgBox}>
                         <Image source={{ uri: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600" }} style={styles.journalImg} />
                      </View>
                   </View>
                   <View style={styles.sectionCard}>
                      <View style={styles.journalItem}>
                         <View style={styles.journalStepUpcoming}><Text style={styles.journalStepTxtUpcoming}>2</Text></View>
                         <View style={{ flex: 1 }}>
                            <View style={styles.journalHeader}>
                               <Text style={styles.journalTitleUpcoming}>원료 가공 및 혼합</Text>
                               <Text style={styles.journalDate}>예정</Text>
                            </View>
                            <Text style={styles.journalBodyUpcoming}>펀딩 마감 후 원료 가공 및 혼합 과정을 시작할 예정입니다.</Text>
                         </View>
                      </View>
                   </View>
                   <View style={styles.sectionCard}>
                      <View style={styles.journalItem}>
                         <View style={styles.journalStepUpcoming}><Text style={styles.journalStepTxtUpcoming}>3</Text></View>
                         <View style={{ flex: 1 }}>
                            <View style={styles.journalHeader}>
                               <Text style={styles.journalTitleUpcoming}>자연의 기다림, 발효</Text>
                               <Text style={styles.journalDate}>예정</Text>
                            </View>
                            <Text style={styles.journalBodyUpcoming}>전통 방식으로 자연 발효를 진행할 예정입니다.</Text>
                         </View>
                      </View>
                   </View>
                   <View style={styles.sectionCard}>
                      <View style={styles.journalItem}>
                         <View style={styles.journalStepUpcoming}><Text style={styles.journalStepTxtUpcoming}>4</Text></View>
                         <View style={{ flex: 1 }}>
                            <View style={styles.journalHeader}>
                               <Text style={styles.journalTitleUpcoming}>제술 및 정제</Text>
                               <Text style={styles.journalDate}>예정</Text>
                            </View>
                            <Text style={styles.journalBodyUpcoming}>정성스럽게 제술하고 정제하는 과정을 거칠 예정입니다.</Text>
                         </View>
                      </View>
                   </View>
                   <View style={styles.sectionCard}>
                      <View style={styles.journalItem}>
                         <View style={styles.journalStepUpcoming}><Text style={styles.journalStepTxtUpcoming}>5</Text></View>
                         <View style={{ flex: 1 }}>
                            <View style={styles.journalHeader}>
                               <Text style={styles.journalTitleUpcoming}>병입</Text>
                               <Text style={styles.journalDate}>예정</Text>
                            </View>
                            <Text style={styles.journalBodyUpcoming}>완성된 전통주를 병에 담아 마무리할 예정입니다.</Text>
                         </View>
                      </View>
                   </View>
                </View>
             </Animated.View>
           )}

           {activeTab === "Q&A" && (
             <Animated.View entering={FadeIn}>
                <View style={styles.sectionCard}>
                   <Text style={styles.sectionHeaderTitle}>Q&A</Text>
                   <View style={styles.qaInputRow}>
                      <TextInput 
                        style={styles.qaInput} 
                        placeholder="댓글을 입력하세요..." 
                        placeholderTextColor="#9CA3AF"
                        value={newComment} 
                        onChangeText={setNewComment} 
                      />
                      <TouchableOpacity style={styles.qaSend} onPress={handleAddComment}>
                         <Send size={20} color="#FFF" />
                      </TouchableOpacity>
                   </View>

                   <View style={styles.commentList}>
                      {comments.map((c, index) => (
                        <View key={c.id} style={[styles.commentCard, index === comments.length - 1 && { borderBottomWidth: 0 }]}>
                           <View style={styles.commentTop}>
                              <LinearGradient colors={['#E5E7EB', '#D1D5DB']} style={styles.commentAvatar}>
                                 <Text style={styles.avatarTxt}>{c.userName[0]}</Text>
                              </LinearGradient>
                              <View style={{ flex: 1 }}>
                                 <View style={styles.commentMeta}>
                                    <Text style={styles.commentUser}>{c.userName}</Text>
                                    {c.isBrewery && <View style={styles.brewBadge}><Text style={styles.brewBadgeTxt}>양조장</Text></View>}
                                    <Text style={styles.commentDate}>{c.date}</Text>
                                 </View>
                                 <Text style={styles.commentTxt}>{c.content}</Text>
                              </View>
                           </View>

                           <View style={styles.commentActions}>
                              <TouchableOpacity style={styles.commentAction} onPress={() => toggleCommentLike(c.id)}>
                                 <ThumbsUp size={16} color={likedComments.has(c.id) ? "#111" : "#9CA3AF"} fill={likedComments.has(c.id) ? "#111" : "transparent"} />
                                 <Text style={[styles.actionTxt, likedComments.has(c.id) && { color: "#111" }]}>{c.likes}</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.commentAction} onPress={() => setReplyingTo(replyingTo === c.id ? null : c.id)}>
                                 <MessageCircle size={16} color="#9CA3AF" />
                                 <Text style={styles.actionTxt}>답글</Text>
                              </TouchableOpacity>
                              {c.replies.length > 0 && (
                                <TouchableOpacity style={styles.commentAction} onPress={() => toggleExpandComment(c.id)}>
                                   {expandedComments.has(c.id) ? <ChevronUp size={16} color="#9CA3AF" /> : <ChevronDown size={16} color="#9CA3AF" />}
                                   <Text style={styles.actionTxt}>{c.replies.length}개 답글</Text>
                                </TouchableOpacity>
                              )}
                           </View>

                           {expandedComments.has(c.id) && c.replies.length > 0 && (
                             <View style={styles.repliesWrapper}>
                               {c.replies.map(r => (
                                 <View key={r.id} style={styles.replyCard}>
                                    <LinearGradient colors={['#F3F4F6', '#E5E7EB']} style={styles.replyAvatar}>
                                       <Text style={styles.replyAvatarTxt}>{r.userName[0]}</Text>
                                    </LinearGradient>
                                    <View style={{ flex: 1 }}>
                                       <View style={styles.commentMeta}>
                                          <Text style={styles.commentUser}>{r.userName}</Text>
                                          {r.isBrewery && <View style={styles.brewBadge}><Text style={styles.brewBadgeTxt}>양조장</Text></View>}
                                          <Text style={styles.commentDate}>{r.date}</Text>
                                       </View>
                                       <Text style={styles.commentTxt}>{r.content}</Text>
                                       <TouchableOpacity style={styles.replyLikeBtn} onPress={() => toggleReplyLike(c.id, r.id)}>
                                          <ThumbsUp size={12} color={likedReplies.has(c.id * 10000 + r.id) ? "#111" : "#9CA3AF"} fill={likedReplies.has(c.id * 10000 + r.id) ? "#111" : "transparent"} />
                                          <Text style={[styles.replyLikeTxt, likedReplies.has(c.id * 10000 + r.id) && { color: "#111" }]}>{r.likes}</Text>
                                       </TouchableOpacity>
                                    </View>
                                 </View>
                               ))}
                             </View>
                           )}

                           {replyingTo === c.id && (
                             <View style={styles.replyInputRow}>
                                <TextInput 
                                  style={styles.replyInput} 
                                  placeholder="답글을 입력하세요..." 
                                  placeholderTextColor="#9CA3AF"
                                  value={replyContent} 
                                  onChangeText={setReplyContent} 
                                  autoFocus
                                />
                                <TouchableOpacity style={styles.replySend} onPress={() => handleAddReply(c.id)}>
                                   <Send size={16} color="#FFF" />
                                </TouchableOpacity>
                             </View>
                           )}
                        </View>
                      ))}

                      {comments.length === 0 && (
                        <View style={styles.emptyComments}>
                           <MessageCircle size={48} color="#D1D5DB" />
                           <Text style={styles.emptyCommentsTxt}>첫 번째 댓글을 남겨보세요!</Text>
                        </View>
                      )}
                   </View>
                </View>
             </Animated.View>
           )}

           {activeTab === "후기" && (
             <Animated.View entering={FadeIn}>
                <View style={styles.sectionCard}>
                   <View style={styles.rowBetweenHeader}>
                      <Text style={styles.sectionHeaderTitle}>후원자 후기</Text>
                      {project.status !== "진행 중" && <Text style={styles.countTxt}>{reviewsData.filter(r => r.projectId === project.id).length}개</Text>}
                   </View>
                   
                   {project.status === "진행 중" ? (
                     <View style={styles.emptyReviews}>
                        <View style={styles.emptyIconCircle}>
                           <Target size={32} color="#9CA3AF" />
                        </View>
                        <Text style={styles.emptyTitle}>펀딩이 진행중입니다!</Text>
                        <Text style={styles.emptySub}>펀딩이 완료되면 후기를 확인할 수 있어요</Text>
                     </View>
                   ) : reviewsData.filter(r => r.projectId === project.id).length === 0 ? (
                     <View style={styles.emptyReviews}>
                        <View style={styles.emptyIconCircleDashed}>
                           <Star size={36} color="#D1D5DB" />
                        </View>
                        <Text style={styles.emptyTitle}>아직 후기가 없어요</Text>
                        <Text style={styles.emptySubMulti}>이 술을 마셔본 첫 번째 후기를{'\n'}남겨주세요! 다른 분들에게 큰 도움이 돼요 🍶</Text>
                        <TouchableOpacity style={styles.writeReviewBtn}>
                           <Star size={16} color="#FFF" />
                           <Text style={styles.writeReviewTxt}>첫 번째 후기 작성하기</Text>
                        </TouchableOpacity>
                     </View>
                   ) : (
                     <View style={styles.reviewList}>
                        {reviewsData.filter(r => r.projectId === project.id).map((r, i, arr) => (
                          <View key={r.id} style={[styles.reviewCard, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
                             <View style={styles.rowBetween}>
                                <View>
                                   <Text style={styles.reviewUser}>{r.userName}</Text>
                                   <View style={styles.starRow}>
                                      {[1,2,3,4,5].map(s => <Star key={s} size={14} color={s <= r.rating ? "#F59E0B" : "#E5E7EB"} fill={s <= r.rating ? "#F59E0B" : "transparent"} />)}
                                   </View>
                                </View>
                                <Text style={styles.reviewDate}>{r.date}</Text>
                             </View>
                             <Text style={styles.reviewTxt} numberOfLines={3}>{r.comment}</Text>
                          </View>
                        ))}
                        <TouchableOpacity style={styles.writeReviewOutline}>
                           <Text style={styles.writeReviewOutlineTxt}>✏️ 나도 후기 작성하기</Text>
                        </TouchableOpacity>
                     </View>
                   )}
                </View>
             </Animated.View>
           )}
        </View>

        {/* 7. Recommendations */}
        <View style={styles.recommendArea}>
           <View style={styles.rowBetweenHeader}>
              <Text style={styles.sectionHeaderTitle}>다른 프로젝트 둘러보기</Text>
              <TouchableOpacity onPress={() => router.push('/funding')}>
                 <Text style={styles.guideLink}>더보기</Text>
              </TouchableOpacity>
           </View>
           <View style={styles.recGrid}>
             {recommendedProjects.map(p => (
               <TouchableOpacity key={p.id} style={styles.recCard} onPress={() => router.push(`/funding/${p.id}`)}>
                  <View style={styles.recThumbBox}>
                     <Image source={{ uri: p.image }} style={styles.recImg} />
                     <TouchableOpacity style={styles.recHeart} onPress={() => toggleFavoriteFunding(p.id)}>
                        <Heart size={16} color={isFavoriteFunding(p.id) ? "#EF4444" : "#FFF"} fill={isFavoriteFunding(p.id) ? "#EF4444" : "transparent"} />
                     </TouchableOpacity>
                  </View>
                  <View style={styles.recContent}>
                     <View style={styles.recTopRow}>
                        <Text style={styles.recBrewery}>{p.brewery}</Text>
                        <View style={styles.catBadge}><Text style={styles.catTxt}>{p.category}</Text></View>
                        {p.status === '성공' && (
                          <View style={styles.recSuccessBadge}><Text style={styles.recSuccessTxt}>성사됨</Text></View>
                        )}
                     </View>
                     <Text style={styles.recTitle} numberOfLines={2}>{p.title}</Text>
                     <View style={styles.recFooter}>
                        <View style={styles.recFooterLeft}>
                           <Text style={styles.recPct}>{Math.min((p.currentAmount/p.goalAmount)*100, 100).toFixed(0)}%</Text>
                           <Text style={styles.recAmt}>{(p.currentAmount / 10000).toLocaleString()}만원</Text>
                        </View>
                        <Text style={styles.recDays}>{p.status === "성공" ? "종료" : `${p.daysLeft}일 남음`}</Text>
                     </View>
                  </View>
               </TouchableOpacity>
             ))}
           </View>
        </View>
      </ScrollView>

      {/* ── Fixed Bottom Actions ── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
         <TouchableOpacity style={styles.heartBtn} onPress={() => toggleFavoriteFunding(project.id)}>
            <Heart size={24} color={isFavoriteFunding(project.id) ? "#EF4444" : "#111"} fill={isFavoriteFunding(project.id) ? "#EF4444" : "transparent"} />
         </TouchableOpacity>
         <TouchableOpacity 
           style={[styles.mainSupportBtn, project.status !== "진행 중" && { backgroundColor: '#374151' }]} 
           disabled={project.status !== "진행 중"}
           onPress={() => router.push(`/funding/support?id=${project.id}` as any)}
         >
            <Text style={styles.mainSupportTxt}>{project.status === "진행 중" ? "프로젝트 후원하기" : "펀딩 종료"}</Text>
         </TouchableOpacity>
      </View>

      {/* ── Funding Guide Modal ── */}
      <Modal visible={showFundingGuideModal} animationType="fade" transparent>
         <View style={styles.modalOverlay}>
            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowFundingGuideModal(false)} />
            <Animated.View entering={SlideInDown} style={styles.modalContent}>
               <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>🍶 주담 펀딩 안내</Text>
                  <TouchableOpacity onPress={() => setShowFundingGuideModal(false)} style={styles.modalCloseIcon}>
                     <Text style={{ fontSize: 24, color: '#6B7280' }}>×</Text>
                  </TouchableOpacity>
               </View>
               <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <View style={{ marginBottom: 24 }}>
                     <Text style={styles.modalSecTitle}>주담 펀딩이란 무엇이죠?</Text>
                     <Text style={styles.modalTxt}>주담 펀딩은 혁신적인 전통주 레시피 아이디어를 가진 <Text style={{fontWeight: '700', color: '#111'}}>개인(기획자)</Text>과 이를 실제 술로 빚어낼 수 있는 전문 양조장이 만나, 다수의 후원자와 함께 새로운 우리 술을 탄생시키는 과정입니다.</Text>
                  </View>
                  
                  <View style={styles.modalDivider} />
                  
                  <View style={{ marginBottom: 24 }}>
                     <Text style={styles.modalSecTitle}>주담 펀딩은 어떤 방식으로 진행되나요?</Text>
                     <Text style={[styles.modalTxt, { marginBottom: 16 }]}>주담 펀딩은 기획자와 양조장, 그리고 후원자가 함께 <Text style={{fontWeight: '700', color: '#111'}}>세상에 없던 나만의 술</Text>을 완성해 나가는 협업 프로젝트입니다.</Text>
                     
                     <View style={{ gap: 16 }}>
                        <View style={styles.modalStepBox}>
                           <Text style={styles.stepLab}>기획자 및 양조장:</Text>
                           <Text style={styles.stepBody}>AI 검토를 거친 레시피를 바탕으로 프로젝트 개설하여 제조에 필요한 예산을 모금합니다. 펀딩에 성공하면 약속한 전통주를 정성껏 빚어 후원자에게 전달합니다.</Text>
                        </View>
                        <View style={styles.modalStepBox}>
                           <Text style={styles.stepLab}>후원자:</Text>
                           <Text style={styles.stepBody}>자신의 취향에 맞는 레시피 프로젝트에 후원하며 공동 기획자로 참여합니다. 펀딩 성공 시, 숙성 기간을 거쳐 완성된 나만의 전통주를 리워드로 받아보실 수 있습니다.</Text>
                        </View>
                        <View style={styles.modalStepBox}>
                           <Text style={styles.stepLab}>소통의 의무:</Text>
                           <Text style={styles.stepBody}>전통주는 발효 식품 특성상 기상 조건이나 효모의 활동에 따라 일정이 지연되거나 풍미가 미세하게 변할 수 있습니다. 양조장은 이러한 변동 사항을 후원자에게 즉시 알리고 성실히 설명할 의무가 있습니다.</Text>
                        </View>
                        <View style={styles.modalStepBlueBox}>
                           <Text style={styles.stepBlueLab}>결제 안내:</Text>
                           <Text style={styles.stepBlueBody}>펀딩은 목표 금액에 도달했을 때만 성사되며, 목표 미달 시 프로젝트는 무산되고 결제는 진행되지 않습니다.</Text>
                        </View>
                     </View>
                  </View>

                  <View style={styles.modalDivider} />
                  
                  <View style={{ marginBottom: 24 }}>
                     <Text style={styles.modalSecTitle}>후원이란 무엇인가요?</Text>
                     <Text style={[styles.modalTxt, { marginBottom: 16 }]}>주담에서의 후원은 단순히 만들어진 술을 구매하는 전자상거래가 아닙니다.</Text>
                     
                     <View style={{ gap: 16 }}>
                        <View style={styles.modalStepBox}>
                           <Text style={styles.stepLab}>가치의 지지:</Text>
                           <Text style={styles.stepBody}>아직 세상에 나오지 않은 전통주 레시피가 실현될 수 있도록 자금을 지원하고 응원하는 일입니다. 그 보답으로 양조 전문가가 완성한 고품질의 전통주를 리워드로 제공받습니다.</Text>
                        </View>
                        <View style={styles.modalStepBox}>
                           <Text style={styles.stepLab}>변수의 수용:</Text>
                           <Text style={styles.stepBody}>발효와 숙성이라는 자연의 공정을 거치므로, 안내된 일정보다 조금 늦어지거나 맛의 밸런스가 전문가의 보정 과정에서 일부 조정될 수 있음을 이해해 주셔야 합니다.</Text>
                        </View>
                     </View>
                  </View>

                  <View style={styles.modalDivider} />
                  
                  <View style={{ marginBottom: 24 }}>
                     <Text style={styles.modalSecTitle}>주담은 이 과정에서 무엇을 하나요?</Text>
                     <Text style={[styles.modalTxt, { marginBottom: 16 }]}>주담은 사용자의 아이디어가 안전하게 제품화될 수 있도록 신뢰의 연결고리 역할을 합니다.</Text>
                     
                     <View style={{ gap: 16 }}>
                        <View style={styles.modalStepBox}>
                           <Text style={styles.stepLab}>AI 레시피 검토:</Text>
                           <Text style={styles.stepBody}>실현 불가능하거나 주세법에 어긋나는 레시피를 AI가 1차적으로 필터링하여 안전한 프로젝트만 소개합니다.</Text>
                        </View>
                        <View style={styles.modalStepBox}>
                           <Text style={styles.stepLab}>투명한 공정 공유:</Text>
                           <Text style={styles.stepBody}>양조 일지를 통해 원료 입고부터 포장까지의 전 과정을 시각화하여 정보의 격차를 해소합니다.</Text>
                        </View>
                        <View style={styles.modalStepRedBox}>
                           <Text style={styles.stepRedLab}>커뮤니티 관리:</Text>
                           <Text style={styles.stepRedBody}>이용약관과 전통주 판매 규정을 준수하지 않거나, 후원자와 소통을 소홀히 하여 피해를 주는 이용자 및 양조장에게는 주의·경고 및 서비스 이용 제한 등의 엄격한 조치를 취하고 있습니다.</Text>
                        </View>
                     </View>
                  </View>
               </ScrollView>
               <View style={styles.modalFooter}>
                  <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowFundingGuideModal(false)}>
                     <Text style={styles.modalCloseTxt}>확인</Text>
                  </TouchableOpacity>
               </View>
            </Animated.View>
         </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, zIndex: 100 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  headerIconBtn: { padding: 6, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerRight: { flexDirection: 'row', gap: 8 },
  visualContainer: { width: '100%', height: 256, backgroundColor: '#E5E7EB', zIndex: 1 },
  mainImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  contentWrapper: { paddingHorizontal: 16 },
  titleSection: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 24 },
  projectTitle: { fontSize: 26, fontWeight: '800', color: '#111', lineHeight: 34, marginBottom: 12 },
  shortDesc: { fontSize: 16, color: '#4B5563', lineHeight: 24 },
  statusCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 24, marginHorizontal: 16 },
  statusGrid: { flexDirection: 'row', marginBottom: 16 },
  statusItem: { flex: 1, alignItems: 'center' },
  statusBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#E5E7EB' },
  statusVal: { fontSize: 24, fontWeight: '800', color: '#111', marginBottom: 4 },
  statusLab: { fontSize: 12, color: '#6B7280' },
  progressBar: { height: 8, borderRadius: 4, marginBottom: 16 },
  dateInfo: { flexDirection: 'column', gap: 4 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateTxt: { fontSize: 14, fontWeight: '600', color: '#111' },
  periodTxt: { fontSize: 12, color: '#9CA3AF', marginLeft: 22 },
  breweryCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  breweryLogo: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  breweryName: { fontSize: 16, fontWeight: '700', color: '#111' },
  breweryLoc: { fontSize: 12, color: '#6B7280' },
  catBadge: { paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#F3F4F6', borderRadius: 16, marginLeft: 'auto' },
  catTxt: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  stickyTabWrapper: { backgroundColor: '#F9FAFB', zIndex: 40, paddingBottom: 24, paddingHorizontal: 16 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20, padding: 6, borderWidth: 1, borderColor: '#E5E7EB' },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 14 },
  tabBtnActive: { backgroundColor: '#111', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  tabBtnTxt: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
  tabBtnTxtActive: { color: '#FFF' },
  contentArea: { paddingHorizontal: 16 },
  sectionCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: '#E5E7EB' },
  sectionHeaderTitle: { fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 16 },
  sectionSub: { fontSize: 14, color: '#4B5563', marginBottom: 24 },
  recipeSummaryGrid: { marginBottom: 24, gap: 12 },
  ingCard: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  ingRow: { flexDirection: 'row' },
  ingCardMini: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  ingLab: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  ingVal: { fontSize: 14, fontWeight: '700', color: '#111' },
  summaryBox: { backgroundColor: '#EFF6FF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#DBEAFE', marginBottom: 24 },
  summaryTitle: { fontSize: 14, fontWeight: '800', color: '#1E3A8A', marginBottom: 8 },
  summaryTxt: { fontSize: 14, color: '#1E3A8A', lineHeight: 22 },
  bodyTxt: { fontSize: 15, color: '#4B5563', lineHeight: 26 },
  priceCard: { backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  priceStrip: { position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, backgroundColor: '#111' },
  priceContent: { padding: 20, paddingLeft: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  priceLab: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 6 },
  priceVal: { fontSize: 30, fontWeight: '800', color: '#111', letterSpacing: -0.5 },
  priceSub: { fontSize: 14, color: '#4B5563' },
  totalGoalBox: { marginTop: 16, padding: 16, backgroundColor: '#111', borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalGoalLab: { color: '#D1D5DB', fontSize: 14, fontWeight: '600' },
  totalGoalVal: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  budgetLab: { fontSize: 14, color: '#374151' },
  budgetVal: { fontSize: 14, fontWeight: '600', color: '#111' },
  budgetTotal: { borderTopWidth: 2, borderTopColor: '#111', paddingTop: 16, marginTop: 8 },
  budgetTotalLab: { fontSize: 16, fontWeight: '800', color: '#111' },
  budgetTotalVal: { fontSize: 18, fontWeight: '800', color: '#111' },
  budgetGuide: { fontSize: 12, color: '#6B7280', marginTop: 16, lineHeight: 20 },
  schRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  schDate: { width: 70, fontSize: 14, fontWeight: '600', color: '#111' },
  schDesc: { flex: 1, fontSize: 14, color: '#4B5563', lineHeight: 22 },
  schAlert: { marginTop: 8, padding: 16, backgroundColor: '#EFF6FF', borderRadius: 16 },
  schAlertTxt: { fontSize: 12, color: '#1E3A8A', lineHeight: 20 },
  radarContainer: { alignItems: 'center', marginBottom: 24 },
  tasteGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  tasteItemBox: { width: '48%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FAFB', padding: 12, borderRadius: 12 },
  tasteLab: { fontSize: 13, fontWeight: '600', color: '#374151' },
  tasteRowWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tasteBarBg: { width: 60, height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  tasteBarFill: { height: '100%', backgroundColor: '#111', borderRadius: 3 },
  tasteVal: { fontSize: 13, fontWeight: '800', color: '#111', width: 32, textAlign: 'right' },
  guideHeading: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 16 },
  guideBox: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16 },
  guideBoxPlain: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16 },
  guideBoxTitle: { fontSize: 14, fontWeight: '700', color: '#111', marginBottom: 4 },
  guideBoxTxt: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
  guideLink: { fontSize: 14, color: '#111', fontWeight: '600', textDecorationLine: 'underline' },
  journalList: { gap: 16 },
  journalItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  journalStep: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  journalStepTxt: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  journalStepUpcoming: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  journalStepTxtUpcoming: { color: '#6B7280', fontSize: 16, fontWeight: '800' },
  journalHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  journalTitle: { fontSize: 16, fontWeight: '800', color: '#111' },
  journalTitleUpcoming: { fontSize: 16, fontWeight: '800', color: '#111' },
  journalDate: { fontSize: 12, color: '#6B7280' },
  journalBody: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  journalBodyUpcoming: { fontSize: 14, color: '#6B7280' },
  journalImgBox: { width: '100%', borderRadius: 16, marginTop: 16, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  journalImg: { width: '100%', height: 200, resizeMode: 'cover' },
  qaInputRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  qaInput: { flex: 1, height: 52, backgroundColor: '#F9FAFB', borderRadius: 16, paddingHorizontal: 16, fontSize: 14, color: '#111', borderWidth: 1, borderColor: '#E5E7EB' },
  qaSend: { width: 52, height: 52, backgroundColor: '#111', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  commentList: { gap: 24 },
  commentCard: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 24 },
  commentTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  commentAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { fontSize: 14, fontWeight: '800', color: '#111' },
  commentMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  commentUser: { fontSize: 14, fontWeight: '800', color: '#111' },
  commentDate: { fontSize: 12, color: '#9CA3AF' },
  commentTxt: { fontSize: 14, color: '#374151', lineHeight: 22 },
  commentActions: { flexDirection: 'row', alignItems: 'center', gap: 16, marginLeft: 52 },
  commentAction: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionTxt: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  repliesWrapper: { marginTop: 16, marginLeft: 52 },
  replyCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  replyAvatar: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  replyAvatarTxt: { fontSize: 12, fontWeight: '800', color: '#111' },
  replyLikeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  replyLikeTxt: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  replyInputRow: { flexDirection: 'row', gap: 8, marginTop: 16, marginLeft: 52 },
  replyInput: { flex: 1, height: 40, backgroundColor: '#F9FAFB', borderRadius: 12, paddingHorizontal: 16, fontSize: 13, color: '#111', borderWidth: 1, borderColor: '#E5E7EB' },
  replySend: { width: 40, height: 40, backgroundColor: '#111', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  emptyComments: { paddingVertical: 48, alignItems: 'center' },
  emptyCommentsTxt: { fontSize: 14, color: '#9CA3AF', marginTop: 12 },
  brewBadge: { backgroundColor: '#111', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 9999 },
  brewBadgeTxt: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  rowBetweenHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  countTxt: { fontSize: 14, color: '#6B7280' },
  emptyReviews: { paddingVertical: 48, alignItems: 'center' },
  emptyIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyIconCircleDashed: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 2, borderStyle: 'dashed', borderColor: '#E5E7EB' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151' },
  emptySub: { fontSize: 14, color: '#9CA3AF', marginTop: 8 },
  emptySubMulti: { fontSize: 14, color: '#9CA3AF', marginTop: 8, textAlign: 'center', lineHeight: 22 },
  writeReviewBtn: { marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#111', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16 },
  writeReviewTxt: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  reviewList: { gap: 16 },
  reviewCard: { width: '100%', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  reviewUser: { fontSize: 14, fontWeight: '800', color: '#111' },
  reviewDate: { fontSize: 12, color: '#6B7280' },
  starRow: { flexDirection: 'row', gap: 2, marginTop: 4, marginBottom: 8 },
  reviewTxt: { fontSize: 14, color: '#374151', lineHeight: 22 },
  writeReviewOutline: { width: '100%', padding: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: '#E5E7EB', borderRadius: 16, alignItems: 'center' },
  writeReviewOutlineTxt: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  recommendArea: { paddingHorizontal: 16, marginBottom: 40 },
  recList: { gap: 16 },
  recCard: { flexDirection: 'row', gap: 16, backgroundColor: '#FFF', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: '#E5E7EB' },
  recGrid: { gap: 12 },
  recThumbBox: { width: 96, height: 96, borderRadius: 16, overflow: 'hidden' },
  recImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  recHeart: { position: 'absolute', bottom: 8, left: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  recContent: { flex: 1, paddingVertical: 4 },
  recTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  recBrewery: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  recSuccessBadge: { marginLeft: 'auto', paddingHorizontal: 8, paddingVertical: 2, backgroundColor: '#EFF6FF', borderRadius: 9999 },
  recSuccessTxt: { fontSize: 10, fontWeight: '700', color: '#2563EB' },
  recTitle: { fontSize: 14, fontWeight: '700', color: '#111', marginBottom: 8, lineHeight: 20 },
  recFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' },
  recFooterLeft: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  recPct: { fontSize: 18, fontWeight: '700', color: '#111' },
  recAmt: { fontSize: 12, color: '#6B7280' },
  recDays: { fontSize: 12, fontWeight: '600', color: '#111' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, gap: 12, zIndex: 40 },
  heartBtn: { width: 56, height: 56, borderRadius: 16, borderWidth: 2, borderColor: '#E5E7EB', backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  mainSupportBtn: { flex: 1, height: 56, backgroundColor: '#111', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  mainSupportTxt: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 16 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 24, maxHeight: '85%', overflow: 'hidden' },
  modalHeader: { paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  modalCloseIcon: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  modalBody: { padding: 24 },
  modalSecTitle: { fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 12 },
  modalTxt: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  modalDivider: { height: 1, backgroundColor: '#E5E7EB', marginBottom: 24 },
  modalStepBox: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16 },
  stepLab: { fontSize: 14, fontWeight: '800', color: '#111', marginBottom: 8 },
  stepBody: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  modalStepBlueBox: { backgroundColor: '#EFF6FF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#DBEAFE' },
  stepBlueLab: { fontSize: 14, fontWeight: '800', color: '#1E3A8A', marginBottom: 8 },
  stepBlueBody: { fontSize: 14, color: '#1E40AF', lineHeight: 22 },
  modalStepRedBox: { backgroundColor: '#FEF2F2', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#FECACA' },
  stepRedLab: { fontSize: 14, fontWeight: '800', color: '#7F1D1D', marginBottom: 8 },
  stepRedBody: { fontSize: 14, color: '#991B1B', lineHeight: 22 },
  modalFooter: { borderTopWidth: 1, borderTopColor: '#E5E7EB', padding: 24 },
  modalCloseBtn: { width: '100%', height: 48, backgroundColor: '#111', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  modalCloseTxt: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
