주담(酒談) 프로젝트 AI 메모리 파일 (Frontend Focus)
# npx expo start 입력하고 a 입력하면 실행 됨
[CRITICAL RULE]

이 파일은 프로젝트의 모든 화면별 상세 기능과 기획 맥락을 기록한다.

이 내용을 통해 과거에 진행한 내용과 앞으로의 진행상황에 대해 바로 파악할 수 있도록 한다.

Gemini CLI는 오직 프론트엔드(React Native/Expo) 영역만 개발한다. (Back-end 및 AI 서버 로직 수정 금지)

모든 생성 코드에 주석을 절대 달지 않는다.

개발 단계가 완료될 때마다 한 단계별로 꼭 매번 이 파일의 [3. 개발 진행 로그]와 [4. 향후 개발 로드맵]과 수정사항이 있다면 수정사항 또한 업데이트 한다.

[AI 작업 운영 규칙]
- 어떤 프론트엔드 작업이든 시작 전에 반드시 이 `judam.md`를 먼저 읽고 프로젝트 목적, 현재 구조, 진행 로그, 로드맵을 리마인드한다.
- 작업 범위는 React Native/Expo 프론트엔드로 제한한다. 백엔드, AI 서버, 서버 API 내부 로직은 수정하지 않는다.
- `finish/` 폴더는 Figma Make에서 가져온 참고용 산출물이다. 앱 코드에서 직접 import하지 않고, UI/UX 이식 기준 자료로만 사용한다.
- `app/`은 Expo Router의 파일 기반 라우트 영역이므로 라우팅 규칙을 깨는 구조 변경은 먼저 검토하고, 불확실하면 사용자에게 물어본 뒤 수정한다.
- 사소한 수정이라도 작업 완료 후 이 파일의 [3. 개발 진행 로그]와 필요 시 [4. 향후 개발 로드맵]을 업데이트한다.
- 나중에 이 파일만 읽어도 어떤 작업을 왜 했고, 현재 프로젝트가 어느 단계인지 파악할 수 있을 만큼 구체적으로 기록한다.
- 사용자가 “수정하기 전에 물어봐줘”라고 한 구조 변경, 라우팅 변경, 큰 파일 이동은 임의로 진행하지 않고 먼저 판단과 대안을 설명한다.

1. 프로젝트 개요
서비스명: 주담(酒談) - 소비자 맞춤형 전통주 공동 기획 펀딩 플랫폼

핵심 가치: 5차원 맛 지표와 5가지 영어글자의 (술BTI) 기반 큐레이션 및 유저 참여형 레시피 상용화

지표: 1. Sweet/Dry 2. Light/Heavy 3. Fizzy/Mellow 4. Classic/Unique 5. Mild/Bold

디자인 컨셉: 모던 블랙/그레이/화이트 테마, 점토(Clay) 스타일의 UI 에셋 포인트

기술 스택 현재 상태: React Native 0.81.5, Expo SDK 54, Expo Router 6, TypeScript strict mode, React 19, React Native Reanimated, Gesture Handler, Safe Area Context, React Native SVG, Lucide React Native, AsyncStorage.

API 통신 현재 상태: 아직 백엔드/API/AI 서버 연동 코드는 넣지 않는다. `axios`, `fetch`, OpenAI/Gemini/Anthropic SDK, Firebase/Supabase/Prisma/Express 등 백엔드 또는 AI 연동 패키지/코드는 현재 앱 코드에 없다. 향후 백엔드가 준비되기 전까지는 화면 흐름, mock/seed 데이터, 로컬 상태 중심으로만 프론트엔드를 개발한다.

실행 명령: `npx expo start` 후 Android 실행은 `a`. 구조 변경이나 Metro 오류 후에는 `npx expo start -c`로 캐시를 비우고 재시작한다.

검증 명령: 주요 수정 후 `npx tsc --noEmit`, `npm run lint`, 필요 시 `npx expo-doctor`, 라우트/alias/번들 확인은 `npx expo export --platform web --output-dir /tmp/judam-export-check-after`.

현재 검증 상태: `npx tsc --noEmit` 통과, `npm run lint` 통과, `npx expo-doctor` 17/17 통과, `npx expo export --platform web --output-dir /tmp/judam-export-check-after` 통과.

보안/의존성 메모: `npm audit fix`로 high 취약점은 제거했다. 남은 `npm audit` moderate 항목은 Expo 내부 툴체인 의존성에서 오며, `npm audit fix --force`는 Expo SDK를 49로 낮추는 breaking change를 제안하므로 적용하지 않는다.

패키지 버전 메모: Expo SDK 54 권장 패치에 맞춰 `expo ~54.0.34`, `expo-linking ~8.0.12`, `expo-web-browser ~15.0.11` 사용 중. `app.json` plugins에는 `expo-router`, `expo-splash-screen`, `expo-web-browser`가 들어 있다.

[백엔드/AI 금지선]
- 프론트엔드 작업 중 임의로 서버 API, DB, 인증 서버, 결제 서버, AI 서버, OpenAI/Gemini 호출, API key, `.env` 기반 서버 설정을 만들지 않는다.
- `AIChatScreen`, `AIChatRoomScreen`은 현재 AI 서버 기능이 아니라 프론트 화면/라우트 UI다. 실제 AI 응답 생성 로직을 넣으면 안 된다.
- 로그인/회원가입/Auth는 현재 프론트 mock/로컬 저장 흐름이다. 실제 JWT 발급/검증 서버 로직은 만들지 않는다.
- 펀딩/레시피/커뮤니티 데이터는 현재 `src/constants/data.ts`와 각 Context/화면 내부 mock 데이터 기준이다. 서버 스키마나 API client를 임의로 만들지 않는다.
- 이미지 URL은 UI 시안용 원격 이미지다. 이것은 백엔드 연동이 아니며, 추후 에셋 정책이 정해지면 교체 가능하다.
- 백엔드나 AI 연동이 필요해 보이는 화면도 우선 버튼, 입력, 로딩/빈 상태, mock 결과 등 프론트 UI까지만 구현한다.

2. 화면별 상세 기능 명세 (UI/UX)
[A. 공통 가이드 (Global)]
Design System: 5차원 레이더 차트(단맛, 잔향, 산미, 바디감, 탄산감) 컴포넌트 공용화.

Navigation: 홈, 주담(레시피), 펀딩, 커뮤니티, 마이(마이페이지) 하단의 5탭 구조.

Auth: JWT 기반 로그인/회원가입, 일반 유저/양조장 권한별 조건부 렌더링 적용.

[B. 홈 (Home)]
상단 헤더: 설정/알림 제거(사용자), 양조장은 알림(Q&A, 목표달성) 유지.

AI 챗봇: 우측 하단 '+' 버튼 토글형 카톡 스타일 UI. 첫 질문 기반 세션 제목 자동화.

양조장 대시보드 (권한별 분기):

'양조장 정보 수정' 버튼: 기존 입력 폼 데이터 바인딩.

제조 현황 카드: 가로 스크롤(2개 노출), '단계 상승' 모달 트리거.

메인 섹션: 배너 -> 서비스 가이드 그리드 -> 인기 펀딩(TOP 3 카드) -> 인기 레시피(리스트형) -> 주담 성장 통계 섹션.

[C. 주담 (레시피 제안)]
리스트: 펀딩 리스트 스타일 카드 UI. 해시태그 기반 맛 표현(#달콤함 #산미 등).

작성 폼:

재료 입력 후 '생성' 클릭 시 AI 가이드(해시태그/요약) 자동 생성 및 수정 가능.

이미지: 사용자 업로드 + AI 컨셉 이미지 생성 버튼 연동.

연동: 양조장이 '펀딩 제안하기' 클릭 시, 해당 레시피 데이터가 채워진 '펀딩 프로젝트 등록' 페이지로 이동.

[D. 펀딩 (Funding)]
등록 프로세스:

실시간 진행률 트래커(Progress Bar) 상단 배치로 이탈 방지.

(병당 단가 * 수량) 자동 계산 로직 및 플랫폼 수수료 7% 명시.

양조장 정보 '불러오기' 버튼으로 기존 가입 정보 자동 연동.

상세 페이지:

점토 스타일 오각형 레이더 차트 시각화.

실시간 양조 타임라인(발효, 숙성, 병입 등 단계별 시각화).

하단 고정 하트/후원하기 버튼.

[E. 커뮤니티 & 마이페이지]
커뮤니티: 자유/정보 게시판 2종 단순화. 페이지네이션(1 2 3 4) UI 적용.

마이페이지:

술BTI 히스토리 및 아카이브 카드 UI 통일.

'경험한 술': 화이트 배경/블랙 텍스트 반전 테마로 별점 및 기록 관리.

2-1. 현재 코드베이스 구조 스냅샷
[핵심 원칙]
- `app/`은 Expo Router 파일 기반 라우트 엔트리만 담당한다.
- 실제 화면 구현은 `src/features/*/screens`에 둔다.
- 공용 UI는 `src/components`, 기본 UI primitive는 `src/components/ui`, 공용 데이터는 `src/constants/data.ts`, 공용 테마는 `src/constants/theme.ts`, 전역 상태는 `src/contexts`, 레이아웃은 `src/layouts`, 유틸은 `src/utils`에 둔다.
- `finish/`는 Figma Make 참고 자료일 뿐이며, 앱 코드에서 직접 import하지 않는다. 나중에 삭제해도 앱이 깨지지 않아야 한다.
- 루트에 남아 있던 `components`, `constants`, `contexts`, `hooks`, `utils` 폴더는 `src/`로 이동했다. Git 상태상 삭제/추가로 보일 수 있으나 의도된 구조 변경이다.

[라우트 엔트리와 실제 구현 매핑]
- `app/index.tsx`: 온보딩 또는 탭 진입을 결정하는 루트 진입 화면.
- `app/_layout.tsx`: RootLayout. Auth, Community, Favorites, Funding Provider를 감싸고 Stack 라우트를 정의한다.
- `app/(tabs)/_layout.tsx`: `src/layouts/MainTabsLayout.tsx` re-export.
- `app/(tabs)/index.tsx`: `src/features/home/screens/HomeScreen.tsx`.
- `app/(tabs)/recipe.tsx`: `src/features/recipe/screens/RecipeListScreen.tsx`.
- `app/(tabs)/funding.tsx`: `src/features/funding/screens/FundingListScreen.tsx`.
- `app/(tabs)/community.tsx`: `src/features/community/screens/CommunityScreen.tsx`.
- `app/(tabs)/mypage.tsx`: `src/features/mypage/screens/MyPageScreen.tsx`.
- `app/(auth)/login.tsx`: `src/features/auth/screens/LoginScreen.tsx`.
- `app/(auth)/signup.tsx`: `src/features/auth/screens/SignupScreen.tsx`.
- `app/(auth)/user-type.tsx`: `src/features/auth/screens/UserTypeSelectionScreen.tsx`.
- `app/recipe/[id].tsx`: `src/features/recipe/screens/RecipeDetailScreen.tsx`.
- `app/recipe/create.tsx`: `src/features/recipe/screens/RecipeCreateScreen.tsx`.
- `app/funding/[id].tsx`: `src/features/funding/screens/FundingDetailScreen.tsx`.
- `app/funding/support.tsx`: `src/features/funding/screens/FundingSupportScreen.tsx`.
- `app/community/create.tsx`: `src/features/community/screens/CommunityCreateScreen.tsx`.
- `app/brewery/[id].tsx`: `src/features/brewery/screens/BreweryProfileScreen.tsx`.
- `app/brewery/dashboard.tsx`: `src/features/brewery/screens/BreweryDashboardScreen.tsx`.
- `app/brewery/verification.tsx`: `src/features/brewery/screens/BreweryVerificationScreen.tsx`.
- `app/brewery/project/terms.tsx`: `src/features/brewery/project/screens/BreweryProjectTermsScreen.tsx`.
- `app/brewery/project/create.tsx`: `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`.
- `app/ai-chat.tsx`: `src/features/ai-chat/screens/AIChatScreen.tsx`.
- `app/ai-chat/[category]/[roomId].tsx`: `src/features/ai-chat/screens/AIChatRoomScreen.tsx`.
- `app/onboarding.tsx`: `src/features/onboarding/screens/OnboardingScreen.tsx`.
- `app/notifications.tsx`: `src/features/notifications/screens/NotificationsScreen.tsx`.
- `app/terms.tsx`: `src/features/terms/screens/TermsScreen.tsx`.
- `app/modal.tsx`: `src/features/misc/screens/ModalScreen.tsx`.

[탭 구조]
- 현재 탭은 홈, 주담, 펀딩, 커뮤니티, 마이 5개다.
- `app/(tabs)/explore.tsx`는 Expo 템플릿 잔재라 삭제했다. IDE에 열려 있어도 현재 실제 파일/라우트가 아니다.
- 하단 탭 구현은 `src/layouts/MainTabsLayout.tsx`에 있다. 탭 버튼 햅틱은 `src/components/haptic-tab.tsx`를 사용한다.

[alias 및 설정]
- `tsconfig.json`은 strict mode이며 `finish`, `node_modules`를 제외한다.
- TypeScript alias: `@/components/*`, `@/constants/*`, `@/contexts/*`, `@/features/*`, `@/hooks/*`, `@/layouts/*`, `@/utils/*`, `@/assets/*`.
- Metro 런타임 alias는 `metro.config.js`에서 같은 경로를 해석한다. alias 오류가 나면 Metro 캐시 재시작이 우선이다.
- `@/assets/*`는 루트 `assets/`를 바라본다. 나머지 앱 코드는 대부분 `src/`를 바라본다.

[현재 공용 파일 책임]
- `src/constants/data.ts`: 펀딩/레시피 mock 및 seed 데이터의 단일 기준. `FundingProject`, `Recipe` 타입 포함.
- `src/constants/theme.ts`: Colors, Spacing, BorderRadius, Typography.
- `src/contexts/AuthContext.tsx`: 프론트 mock Auth, 사용자 타입, 로컬 저장 기반 상태.
- `src/contexts/FundingContext.tsx`: 펀딩 프로젝트 선택/상태. `finish/` import 제거 완료.
- `src/contexts/FavoritesContext.tsx`: 찜한 펀딩 로컬 저장 상태.
- `src/contexts/CommunityContext.tsx`: 커뮤니티 글 mock 상태.
- `src/utils/storage.ts`: AsyncStorage가 있으면 사용하고, 웹/비지원 환경에서는 fallback memory storage를 제공하는 SafeStorage.
- `src/components/PageHeader.tsx`: 주요 탭 화면 상단 헤더.
- `src/components/recipe-card.tsx`: 레시피 리스트/홈에서 재사용하는 카드.
- `src/components/ui/button.tsx`, `input.tsx`, `progress.tsx`: 현재 실제로 쓰는 기본 UI.

[삭제/정리된 항목]
- `app/(tabs)/explore.tsx` 삭제.
- Expo 템플릿 컴포넌트 `external-link`, `hello-wave`, `parallax-scroll-view`, `themed-text`, `themed-view`, `collapsible`, `icon-symbol` 삭제.
- 임시 스크립트 `fix_styles.js`, `fix_styles2.js`, 오래된 `tsc.log` 삭제.
- `finish/src` 직접 import, Figma Make 웹 전용 패키지 참조, 중복 펀딩/레시피 mock 일부 제거.

3. 개발 진행 로그
[2026-04-25]: 7주차 기획/설계 및 환경 세팅 데이터 학습 완료.

[2026-04-27] (Current): Phase 1 및 Phase 2 인증 UI 피그마 완벽 매칭 완료.

[진행 내용]:
- 온보딩, 로그인, 회원가입 UI/UX 피그마 디자인(`finish/`) 100% 매칭 완료.
- 사용자 유형 선택 및 약관 상세 페이지 구현 완료.
- 로고 에셋 통합 및 프로젝트 전체 적용.
- 스타일 오류 전수 조사 및 수정 (borderWidth, padding 등 표준 속성 정규화).
- 홈, 펀딩, 레시피 리스트 및 상세 페이지 구조 안정화.

[2026-04-28]: Expo 앱 1차 안정화 및 라우트 연결 오류 수정 완료.

[진행 내용]:
- `finish/`는 피그마메이크 기준 자료로 유지하고, 루트 Expo 타입 체크 대상에서 제외.
- `npx tsc --noEmit` 통과 상태 확보.
- `npm run lint` 에러 0개 상태 확보. 단, 기존 unused/import 경고는 잔존.
- Expo 앱 타입 오류 수정: `explore`, `collapsible`, `input`, `notifications`, `funding/[id]`.
- 누락 라우트 1차 연결: 레시피 작성, 커뮤니티 작성, 후원하기, 양조장 프로젝트 약관/등록, 양조장 프로필, AI 채팅방.
- 신규 라우트는 `finish/` 기반 정식 이식 전까지 앱 흐름이 끊기지 않도록 최소 기능 화면으로 구현.

[2026-04-28]: Expo 앱 2차 정리 완료.

[진행 내용]:
- `npm run lint` 경고 0개, 에러 0개 상태 확보.
- 불필요한 import, 미사용 상수, 미사용 함수, 템플릿 잔재 제거.
- 로그인/회원가입 bottom sheet 애니메이션 훅 의존성 경고 수정.
- `npx tsc --noEmit` 통과 상태 유지.

[2026-04-28]: `finish/` 의존 제거 및 런타임 위험 구간 추가 정리 완료.

[진행 내용]:
- 모든 작업 전 `judam.md`를 리마인드해야 하며, 개발 완료 후 진행 로그와 로드맵을 갱신해야 함을 작업 규칙으로 재확인.
- `contexts/FundingContext.tsx`가 `finish/src/app/data/fundingData`를 직접 import하던 구조 제거.
- 펀딩 기준 데이터를 `constants/data.ts`로 통합하고 기존 1~6번 프로젝트 데이터를 루트 Expo 앱 데이터로 확장.
- 펀딩 리스트 화면이 화면 내부 중복 mock 데이터 대신 `constants/data.ts`를 사용하도록 변경.
- `finish/`, `figma:`, `react-router`, `motion/react`, `sonner`, `recharts`, `@radix-ui` 등 웹/피그마메이크 전용 참조가 Expo 앱 코드에 남아 있지 않음을 확인.
- URL 파라미터 배열/undefined 가능성 방어 처리: 펀딩 상세, 후원하기, 레시피 상세, 양조장 프로필, AI 채팅방.
- 잘못된 펀딩 ID로 상세 진입 시 이전 프로젝트 상태가 남지 않도록 프로젝트 상태 초기화 처리.
- `npx tsc --noEmit` 통과, `npm run lint` 경고 0개/에러 0개 통과 상태 유지.

[2026-04-28]: 프론트엔드 폴더 구조 1차 정리 완료.

[진행 내용]:
- 프론트엔드 개발 시작 전 `judam.md`를 반드시 읽고, 작업 완료 후 변경 내역을 다시 기록해야 함을 재확인.
- Expo Router 라우팅 규칙 때문에 `app/`은 화면 라우트 전용 폴더로 유지.
- 라우트가 아닌 공용 프론트엔드 코드를 `src/` 아래로 이동.
- 이동된 구조: `src/components`, `src/components/ui`, `src/constants`, `src/contexts`, `src/hooks`, `src/utils`.
- `tsconfig.json` 경로 alias를 `src/` 중심으로 재설정하고, `@/assets/*`는 루트 `assets/`를 바라보도록 분리.
- 실제 서비스에 쓰지 않는 Expo 템플릿 `app/(tabs)/explore.tsx`와 숨김 탭 설정 제거.
- 루트에 남아 있던 임시 스타일 수정 스크립트 `fix_styles.js`, `fix_styles2.js`와 오래된 `tsc.log` 제거.
- `finish/`는 피그마메이크 기준 자료로만 유지하며, Expo 앱 코드와 직접 연결하지 않는 상태 유지.
- `npx tsc --noEmit` 통과, `npm run lint` 경고 0개/에러 0개 통과 상태 유지.

[현재 폴더 구조 기준]:
- `app/`: Expo Router 파일 기반 라우트와 화면 엔트리만 배치.
- `src/components/`: 공용 UI 및 화면 보조 컴포넌트.
- `src/components/ui/`: Button, Input, Progress 등 기본 UI 컴포넌트.
- `src/constants/`: 테마와 mock/seed 데이터.
- `src/contexts/`: Auth, Funding, Favorites, Community 상태 컨텍스트.
- `src/hooks/`: 테마/컬러 스킴 관련 공용 훅.
- `src/utils/`: SafeStorage 등 유틸리티.
- `assets/`: Expo 정적 이미지 및 앱 아이콘.
- `finish/`: 피그마메이크 참고용 웹 산출물. 앱 코드에서 직접 import 금지.

[2026-04-28]: feature 중심 폴더 구조 2차 정리 완료.

[진행 내용]:
- `app/`은 Expo Router 라우트 파일만 남기는 얇은 구조로 정리.
- 탭 화면, 인증 화면, 펀딩/레시피 상세, 생성 화면, 양조장 화면, AI 채팅 화면의 실제 구현을 `src/features/*/screens`로 이동.
- 하단 탭 레이아웃 구현을 `src/layouts/MainTabsLayout.tsx`로 이동하고 `app/(tabs)/_layout.tsx`는 해당 레이아웃을 re-export하도록 변경.
- `app/(tabs)/index.tsx`, `funding.tsx`, `recipe.tsx`, `community.tsx`, `mypage.tsx`는 각각 feature screen을 re-export하는 라우트 엔트리로 변경.
- 인증 라우트와 상세 라우트도 동일하게 얇은 re-export 파일로 정리.
- `tsconfig.json`에 `@/features/*`, `@/layouts/*` alias 추가.
- 다른 페이지에서 펀딩 목록/타입을 재사용할 수 있도록 `src/features/funding/index.ts`에서 `FundingListScreen`, `FundingDetailScreen`, `FundingSupportScreen`, `fundingProjects`, `FundingProject`를 export.
- 펀딩 데이터는 현재 `src/constants/data.ts`에 유지하고, feature entry에서 재export하여 홈/마이페이지/추천 영역 등 다른 화면에서도 안정적으로 가져다 쓸 수 있게 함.
- `npx tsc --noEmit` 통과, `npm run lint` 경고 0개/에러 0개 통과 상태 유지.

[2026-04-28]: Metro 런타임 alias 및 캐시 문제 대응 완료.

[진행 내용]:
- 구조 변경 후 Metro가 삭제된 `app/(tabs)/explore.tsx`와 이전 import 경로를 캐시에서 참조하며 발생한 resolve 오류를 확인.
- `metro.config.js`를 추가하여 런타임에서도 `@/components`, `@/constants`, `@/contexts`, `@/features`, `@/hooks`, `@/layouts`, `@/utils`, `@/assets` alias가 정확한 실제 경로로 해석되도록 설정.
- `app/(tabs)/explore.tsx`는 실제 파일 시스템에 존재하지 않으며, 현재 탭 라우트는 홈/주담/펀딩/커뮤니티/마이 5개만 유지됨을 확인.
- Expo 로컬 캐시 `.expo/cache`, `.expo/web/cache` 제거.
- `npx tsc --noEmit` 통과, `npm run lint` 경고 0개/에러 0개 통과 상태 유지.
- 구조 변경 후 Metro 오류가 남으면 실행 중인 Expo 서버를 종료하고 `npx expo start -c`로 재시작해야 함.

[2026-04-28]: 프론트엔드 폴더 구조 3차 최적화 완료.

[진행 내용]:
- 현재 `app/`과 `src/` 파일 구성을 다시 훑고, `finish/`는 참고용으로만 유지하며 앱 코드에서 직접 연결하지 않는 상태를 재확인.
- `app/modal.tsx`에 남아 있던 실제 화면 구현을 `src/features/misc/screens/ModalScreen.tsx`로 이동하고, 라우트 파일은 re-export만 담당하도록 정리.
- 더 이상 참조되지 않는 Expo 템플릿 컴포넌트 제거: `external-link`, `hello-wave`, `parallax-scroll-view`, `themed-text`, `themed-view`, `collapsible`, `icon-symbol`.
- 펀딩 상세 화면 내부에 중복으로 남아 있던 펀딩 mock 데이터를 제거하고 `src/constants/data.ts`의 `fundingProjects`를 단일 기준 데이터로 사용하도록 변경.
- 펀딩 상세에서 필요한 `breweryLogo`, `shortDescription`, `startDate`, `endDate` 필드를 `FundingProject` 타입과 공용 데이터에 확장.
- 레시피 리스트 화면 내부의 중복 mock 데이터를 제거하고 `src/constants/data.ts`의 `recipesData`를 사용하도록 변경.
- 하단 탭 햅틱 컴포넌트에 남아 있던 불필요한 템플릿 주석 제거.
- `npx tsc --noEmit` 통과, `npm run lint` 경고 0개/에러 0개 통과 상태 유지.

[2026-04-28]: 전체 구조 및 런타임 번들 검증 완료.

[진행 내용]:
- `judam.md`를 다시 리마인드한 뒤 현재 `app/`, `src/`, `package.json`, 라우트 엔트리, alias, `finish/` 의존 여부를 재점검.
- `npx tsc --noEmit` 통과로 TypeScript 타입 오류가 없는 상태 확인.
- `npm run lint` 통과로 ESLint 오류/경고가 없는 상태 확인.
- `npx expo-doctor` 17개 검사 전체 통과 상태 확보.
- `npx expo export --platform web --output-dir /tmp/judam-export-check-after` 통과로 Metro alias, Expo Router 정적 라우트, 웹 번들 생성이 정상 동작함을 확인.
- Expo SDK 54 기준 권장 패치 버전과 맞지 않던 `expo`, `expo-linking`, `expo-web-browser`를 권장 버전으로 업데이트.
- `expo-web-browser` 설치 과정에서 `app.json` plugins에 `expo-web-browser`가 추가됨.
- `npm audit fix`로 처리 가능한 high 취약점은 제거.
- `npm audit --omit=dev --audit-level=high`는 통과하지만, Expo 내부 툴체인에서 오는 moderate audit 항목은 남아 있음. `npm audit fix --force`는 Expo SDK를 49로 낮추는 breaking change를 제안하므로 적용하지 않음.
- `finish/src`, Figma Make 전용 패키지, 삭제된 템플릿 컴포넌트, 중복 mock 데이터 식별자 참조가 앱 코드에 남아 있지 않음을 확인.
- IDE에 `app/(tabs)/explore.tsx`가 열려 있어도 해당 파일은 현재 삭제된 탭 템플릿 파일이며, 실제 앱 라우트에는 존재하지 않음.

[현재 feature 구조 기준]:
- `app/`: Expo Router 라우트 엔트리. 대부분 `src/features/*/screens` 또는 `src/layouts/*`를 re-export.
- `src/layouts/`: 하단 탭 등 앱 레이아웃 구현.
- `src/features/home/screens`: 홈 화면 구현.
- `src/features/funding/screens`: 펀딩 리스트, 펀딩 상세, 후원하기 화면 구현.
- `src/features/funding/index.ts`: 펀딩 화면/데이터 재사용 export 지점.
- `src/features/recipe/screens`: 레시피 리스트, 상세, 작성 화면 구현.
- `src/features/community/screens`: 커뮤니티 리스트, 작성 화면 구현.
- `src/features/mypage/screens`: 마이페이지 화면 구현.
- `src/features/auth/screens`: 로그인, 회원가입, 유저 타입 선택 화면 구현.
- `src/features/brewery/screens`: 양조장 대시보드, 인증, 프로필 화면 구현.
- `src/features/brewery/project/screens`: 양조장 펀딩 프로젝트 약관/등록 화면 구현.
- `src/features/ai-chat/screens`: AI 채팅 목록/채팅방 화면 구현.
- `src/features/onboarding/screens`, `src/features/notifications/screens`, `src/features/terms/screens`: 독립 화면 구현.
- `src/features/misc/screens`: 모달 등 라우트는 있지만 특정 도메인에 묶기 어려운 보조 화면 구현.
- `src/constants/data.ts`: 홈, 펀딩, 레시피 등 여러 화면이 공유하는 mock/seed 데이터의 단일 기준.
- `src/components/`: 현재 실제로 쓰는 공용 컴포넌트만 유지. 템플릿 전용 컴포넌트는 삭제됨.

[2026-04-28]: 온보딩 슬라이드 로컬 이미지 교체 완료.

[진행 내용]:
- `judam.md`를 리마인드한 뒤 사용자가 요청한 범위대로 온보딩 화면의 배경 이미지만 교체.
- `src/features/onboarding/screens/OnboardingScreen.tsx`의 4개 feature slide 이미지를 원격 Unsplash URL에서 `newpicutre` 폴더의 로컬 이미지로 변경.
- 적용 순서: `picure3.jpg`, `desk.jpg`, `picture2.jpg`, `picture1.jpg`.
- 온보딩 문구, CTA 화면, 페이지 수, 라우팅, 레이아웃 로직은 변경하지 않음.
- 로컬 정적 이미지를 사용하기 위해 `Image` source 처리만 정적 asset 방식에 맞춰 조정.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-04-28]: 온보딩 로컬 이미지 표시 비율 조정 완료.

[진행 내용]:
- 로컬 온보딩 이미지 4장이 화면에서 확대되어 잘려 보이는 문제를 확인.
- `src/features/onboarding/screens/OnboardingScreen.tsx`의 배경 이미지 표시 방식을 `cover`에서 `contain`으로 변경해 원본 비율을 유지하며 이미지 전체가 화면 안에 들어오도록 조정.
- 온보딩 이미지 파일, 문구, CTA 화면, 라우팅, 슬라이드 개수는 변경하지 않음.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-04-28]: 온보딩 첫 번째 이미지 9:16 교체 대응 완료.

[진행 내용]:
- 사용자가 `newpicutre/picure3.jpg`를 1080x1920으로 교체한 뒤 실제 파일 크기를 확인.
- 첫 번째 온보딩 슬라이드만 `cover`로 다시 표시해 9:16 이미지가 배경 영역을 자연스럽게 채우도록 조정.
- 아직 9:16으로 교체하지 않은 `desk.jpg`, `picture2.jpg`, `picture1.jpg`는 기존처럼 `contain` 표시를 유지해 과도한 확대/잘림을 방지.
- 온보딩 이미지 순서, 문구, CTA 화면, 라우팅, 슬라이드 개수는 변경하지 않음.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-04-28]: 온보딩 이미지 전체 표시 기준으로 재조정 완료.

[진행 내용]:
- 사용자가 모든 핸드폰 크기에서 이미지가 잘리지 않고 전체가 들어가야 한다고 요청.
- `src/features/onboarding/screens/OnboardingScreen.tsx`의 4개 온보딩 슬라이드 이미지를 모두 `contain` 표시로 통일.
- 기기 비율과 이미지 비율이 다를 경우 여백은 생길 수 있지만, 이미지 일부분만 확대되어 잘리는 동작은 방지하도록 변경.
- 온보딩 이미지 파일, 순서, 문구, CTA 화면, 라우팅, 슬라이드 개수는 변경하지 않음.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-04-28]: 온보딩 이미지 반응형 프레임 표시 보강 완료.

[진행 내용]:
- `resizeMode: contain` 적용 후에도 사용자의 실행 화면에서 특정 부분만 확대되어 보이는 문제를 확인.
- `Image`를 화면 전체 absolute 요소로 직접 배치하던 구조를 이미지 전용 프레임 안에 넣는 방식으로 보강.
- `src/features/onboarding/screens/OnboardingScreen.tsx`의 온보딩 배경 이미지에 `width: 100%`, `height: 100%`, `objectFit: contain`, `resizeMode: contain` 조합을 적용해 모든 기기 크기에서 이미지 전체 표시 의도를 더 명확히 함.
- 온보딩 이미지 파일, 순서, 문구, CTA 화면, 라우팅, 슬라이드 개수는 변경하지 않음.
- 그래도 이전 이미지처럼 보이면 Expo/Metro asset 캐시 가능성이 높으므로 `npx expo start -c` 재시작이 필요함.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-04-28]: 온보딩 이미지 4장 1080x1920 교체 확인 및 캐시 정리 완료.

[진행 내용]:
- 사용자가 `desk.jpg`, `picture1.jpg`, `picture2.jpg`를 새 이미지로 다시 교체했다고 알려준 뒤 로컬 파일 상태를 확인.
- `newpicutre/picure3.jpg`, `desk.jpg`, `picture2.jpg`, `picture1.jpg` 네 장 모두 1080x1920 비율로 교체된 상태를 확인.
- 온보딩 코드는 이미 동일 파일명을 참조하고 있으므로 이미지 경로와 슬라이드 순서는 변경하지 않음.
- 새 이미지 asset 반영을 위해 `.expo/cache`, `.expo/web/cache` 로컬 캐시를 정리.
- 온보딩 표시 방식은 모든 슬라이드에서 `contain` 기반 반응형 프레임을 유지.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-04-28]: 회원가입 및 양조장 인증 배경 이미지 교체 완료.

[진행 내용]:
- 첫 번째 첨부 화면은 `src/features/auth/screens/SignupScreen.tsx`의 회원가입 화면 배경 이미지임을 확인.
- 회원가입 화면의 원격 Unsplash 배경 이미지를 `newpicutre/picure3.jpg` 로컬 asset으로 교체.
- 두 번째 첨부 화면은 `src/features/brewery/screens/BreweryVerificationScreen.tsx`의 양조장 인증 화면 배경 이미지임을 확인.
- 양조장 인증 화면의 원격 Unsplash 배경 이미지를 `newpicutre/ok.jpg` 로컬 asset으로 교체.
- 회원가입/양조장 인증 폼 로직, 문구, 라우팅, 인증 흐름은 변경하지 않음.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-04-29]: 홈 메인 배너 이미지 3장 교체 완료.

[진행 내용]:
- `judam.md`를 리마인드한 뒤 홈 화면 메인 배너 구현 위치가 `src/features/home/screens/HomeScreen.tsx`임을 확인.
- 홈 메인 배너 3장의 원격 Unsplash 이미지를 `newpicutre/home1.png`, `newpicutre/home2.jpg`, `newpicutre/home3.jpg` 로컬 asset으로 교체.
- 배너 문구, 슬라이드 개수, 페이지네이션, 하단 섹션, 라우팅은 변경하지 않음.
- 로컬 정적 이미지를 사용하기 위해 홈 배너 `Image` source 처리만 정적 asset 방식에 맞춰 조정.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-04-29]: 홈 배너 전체 이미지 표시 및 로그인 배경 교체 완료.

[진행 내용]:
- 홈 메인 배너 이미지가 확대되어 일부만 보이는 문제를 확인.
- `src/features/home/screens/HomeScreen.tsx`의 홈 배너 이미지를 전용 프레임 안에서 `contain` 방식으로 표시하도록 변경해 이미지 전체가 보이도록 조정.
- 홈 배너 문구, 슬라이드 개수, 페이지네이션, 하단 섹션, 라우팅은 변경하지 않음.
- 사용자 로그인 화면 구현 위치가 `src/features/auth/screens/LoginScreen.tsx`임을 확인.
- 사용자 로그인 화면의 원격 Unsplash 배경 이미지를 `newpicutre/picure3.jpg` 로컬 asset으로 교체.
- 로그인 폼 로직, 문구, 라우팅, 인증 흐름은 변경하지 않음.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-04-29]: 홈 인기 펀딩 및 인기 레시피 이미지 교체 완료.

[진행 내용]:
- 홈의 현재 인기 펀딩 이미지는 `src/features/home/screens/HomeScreen.tsx`에서 `fundingProjects.slice(0, 3)`를 렌더링하며 가져오는 구조임을 확인.
- 홈의 인기 레시피 제안 이미지는 `recipesData.slice(0, 3)`를 `src/components/recipe-card.tsx`의 `RecipeCard`로 렌더링하며 가져오는 구조임을 확인.
- 홈 화면 표시용으로 현재 인기 펀딩 3장 이미지를 `newpicutre/funding1.jpg`, `funding2.jpg`, `funding3.jpg`로 교체.
- 홈 화면 표시용으로 인기 레시피 제안 3장 이미지를 `newpicutre/recipe1.jpg`, `recipe2.jpg`, `recipe3.png`로 교체.
- 전역 mock 데이터 원본은 변경하지 않고 홈 화면에서 보이는 3장만 로컬 asset으로 덮어씌우는 방식으로 처리.
- 펀딩 썸네일과 레시피 썸네일 모두 이미지 전체가 잘 보이도록 `contain` 기반 표시로 조정.
- `RecipeCard`가 원격 URL 문자열과 로컬 정적 asset을 모두 받을 수 있도록 이미지 source 처리만 확장.
- 펀딩/레시피 카드 문구, 라우팅, 데이터 순서, 리스트 개수는 변경하지 않음.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

4. 향후 개발 로드맵 (FE Milestones)
[Phase 1: 기초 및 인증 (8주차 ~ 4/29)]
[x] 글로벌 테마(theme.ts) 및 공통 컴포넌트(Button, Input, Card) 기본 구현
[x] 스플래시 UI 구현 (Onboarding 연동 완료)
[x] 로그인 UI 및 회원가입 UI 구축 (피그마 100% 매칭)

[Phase 2: 메인 구조 및 분기 (9주차 ~ 5/06)]
[x] 펀딩 메인 UI (5탭 네비게이션 포함) - 완료
[x] 유저/양조장 권한별 화면 분기 처리 로직 구현 - 완료
[x] 레시피 리스트 및 상세 UI 구현 - 리스트 완료
[x] 펀딩 리스트 및 상세 UI 구현 - 완료

[Phase 3: 술BTI 엔진 (10주차 ~ 5/13)]
[ ] 술BTI 테스트 질문 폼 UI 구현
[ ] 술BTI 결과 분석 화면 (오각형 레이더 차트) 시각화

[Phase 4: 코어 펀딩 시스템 (11주차 ~ 12주차)]
[x] 프로젝트 상세 UI 및 양조장용 펀딩 프로젝트 생성 UI 구현 - 상세 완료
[ ] (12주차 ~ 5/27): 프로젝트 후원하기 UI 및 최종 결제/참여 흐름 완료 - 1차 연결 화면 구현 완료, 정식 UI/결제 흐름 고도화 필요

[Phase 5: 고도화 및 마무리 (13주차 ~ 14주차)]
[ ] (13주차): 추가 프론트엔드 기능(커뮤니티 등) 완성 및 전체 에러 핸들링 - 커뮤니티 작성 1차 연결 완료, Expo 타입/린트 에러 및 경고 0개 상태 확보, `finish/` 직접 의존 제거 완료, `app/` 라우트 엔트리와 `src/features` 중심 구조 정리 완료, 공용 mock/seed 데이터 기준 정리 완료
[ ] (14주차 ~ 6/10): APK, AAB 파일 생성 및 최종 프로젝트 완료 (최종 보고)

위의 모든 내용은 읽고 리마인드한 후에, 마음대로 개발할까요? 하지말고 입력을 기다리기. 하지만 해당 자료를 보고 완벽한 리마인드는 해야 함. 매 순간 Judam.md를 리마인드하고 업데이트 할것.
