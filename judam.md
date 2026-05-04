주담(酒談) 프로젝트 AI 메모리 파일 (Frontend Focus)
[CRITICAL RULE]

이 파일은 프로젝트의 모든 화면별 상세 기능과 기획 맥락을 기록한다.

이 내용을 통해 과거에 진행한 내용과 앞으로의 진행상황에 대해 바로 파악할 수 있도록 한다.

Gemini CLI는 오직 프론트엔드(React Native/Expo) 영역만 개발한다. (Back-end 및 AI 서버 로직 수정 금지)

모든 생성 코드에 주석을 절대 달지 않는다.

개발 단계가 완료될 때마다 한 단계별로 꼭 매번 이 파일의 [3. 개발 진행 로그]와 [4. 향후 개발 로드맵]과 수정사항이 있다면 수정사항 또한 업데이트 한다.

[AI 작업 운영 규칙]
- 어떤 프론트엔드 작업이든 시작 전에 반드시 이 `judam.md`를 먼저 읽고 프로젝트 목적, 현재 구조, 진행 로그, 로드맵을 리마인드한다.
- 작업 범위는 React Native/Expo 프론트엔드로 제한한다. 백엔드, AI 서버, 서버 API 내부 로직은 수정하지 않는다.
- `second/` 폴더는 최신 Figma Make 참고용 산출물이다. 이후 새 UI를 만들거나 기존 Figma Make 기준을 재대조할 때는 `second/`를 우선 확인하되, 앱 코드에서 직접 import하지 않는다.
- 기존 `finish/` 폴더는 2026-05-01에 제거했다. 현재 앱 기준 참고 폴더는 `second/` 하나이며, 앱은 `finish/`가 없어도 깨지지 않아야 한다.
- `second/`는 웹 Figma Make 코드이므로 React Native/Expo 앱에 그대로 복사하지 않는다. 일부 웹 코드 상태값 불일치와 런타임 참조 오류 가능성이 있으므로 이식할 때 현재 앱 구조와 타입에 맞게 검증한다.
- `app/`은 Expo Router의 파일 기반 라우트 영역이므로 라우팅 규칙을 깨는 구조 변경은 먼저 검토하고, 불확실하면 사용자에게 물어본 뒤 수정한다.
- 사소한 수정이라도 작업 완료 후 이 파일의 [3. 개발 진행 로그]와 필요 시 [4. 향후 개발 로드맵]을 업데이트한다.
- 나중에 이 파일만 읽어도 어떤 작업을 왜 했고, 현재 프로젝트가 어느 단계인지 파악할 수 있을 만큼 구체적으로 기록한다.
- 사용자가 “수정하기 전에 물어봐줘”라고 한 구조 변경, 라우팅 변경, 큰 파일 이동은 임의로 진행하지 않고 먼저 판단과 대안을 설명한다.
- `judam.md`는 AI 기억 복구용 문서이고, 실제 최신 기준은 항상 현재 코드 파일이다. 문서와 코드가 다르면 코드를 기준으로 문서를 갱신한다.
- 사용자가 “모든 코드 훑어봐”, “전체 파일 확인해줘”, “현재 구조 확인해줘”라고 요청하면 `app/`, `src/`, `package.json`, `app.json`, `tsconfig.json`, `metro.config.js`, asset 참조, route re-export를 다시 확인하고, 다른 개발자가 바꿨지만 `judam.md`에 반영되지 않은 내용을 찾아 문서에 업데이트한다.
- 다른 사람이 수정한 코드가 있어도 임의로 되돌리지 않는다. 필요한 경우 현재 코드 흐름을 기준으로 이해하고 `judam.md`에 실제 상태를 맞춘다.
- 코드 변경, 파일 이동, 이미지/asset 교체, 의존성 변경, 라우트 변경, alias 변경, mock 데이터 기준 변경이 생기면 작업 종료 전에 반드시 이 문서에 반영한다.
- 사용자가 추가 요청한 이미지, 로컬 asset, 표시 방식(`contain`, 프레임 표시, 배경 처리, 카드 썸네일 표시 등)은 `second/`와 다르더라도 사용자 요청이 최우선 기준이다.
- `second/`와 100% 비교/복원 작업을 하더라도 사용자가 별도로 요청한 이미지와 표시 방식은 임의로 되돌리지 않는다. 변경이 필요해 보이면 먼저 사용자에게 확인한다.
- 온보딩, 로그인, 회원가입 화면은 2026-05-02 기준 사용자가 “완벽히 완성된 상태”로 확정한 잠금 영역이다. 사용자가 해당 화면을 명확하게 직접 수정해달라고 요청하지 않는 한, 다른 기능을 개발하거나 `second/`와 비교하더라도 `src/features/onboarding/screens/OnboardingScreen.tsx`, `src/features/auth/screens/LoginScreen.tsx`, `src/features/auth/screens/SignupScreen.tsx`의 UI/플로우/문구/이미지/권한 분기를 임의로 수정하지 않는다.
- 온보딩, 로그인, 회원가입과 연결된 공용 유틸이나 AuthContext를 수정해야 하는 경우에도 이 세 화면의 기존 동작이 바뀔 가능성이 있으면 먼저 사용자에게 확인한다. 단순 전체 점검 요청은 이 세 화면을 바꾸라는 뜻이 아니라 현재 상태가 유지되는지 확인하라는 뜻으로 해석한다.

1. 프로젝트 개요
서비스명: 주담(酒談) - 소비자 맞춤형 전통주 공동 기획 펀딩 플랫폼

핵심 가치: 5차원 맛 지표와 5가지 영어글자의 (술BTI) 기반 큐레이션 및 유저 참여형 레시피 상용화

지표: 1. Sweet/Dry 2. Light/Heavy 3. Fizzy/Mellow 4. Classic/Unique 5. Mild/Bold

디자인 컨셉: 모던 블랙/그레이/화이트 테마, 점토(Clay) 스타일의 UI 에셋 포인트

기술 스택 현재 상태: React Native 0.81.5, Expo SDK 54, Expo Router 6, TypeScript strict mode, React 19, React Native Reanimated, Gesture Handler, Safe Area Context, React Native SVG, Lucide React Native, AsyncStorage, Expo Image Picker, Expo Document Picker, React Native Community DateTimePicker.

API 통신 현재 상태: 아직 백엔드/API/AI 서버 연동 코드는 넣지 않는다. `axios`, `fetch`, OpenAI/Gemini/Anthropic SDK, Firebase/Supabase/Prisma/Express 등 백엔드 또는 AI 연동 패키지/코드는 현재 앱 코드에 없다. 향후 백엔드가 준비되기 전까지는 화면 흐름, mock/seed 데이터, 로컬 상태 중심으로만 프론트엔드를 개발한다.

실행 명령: `npx expo start` 후 Android 실행은 `a`. 구조 변경이나 Metro 오류 후에는 `npx expo start -c`로 캐시를 비우고 재시작한다.

검증 명령: 주요 수정 후 `npx tsc --noEmit`, `npm run lint`, 필요 시 `npx expo-doctor`, 라우트/alias/번들 확인은 `npx expo export --platform web --output-dir /tmp/judam-export-check-after`.

현재 검증 상태: 2026-05-05 `npx tsc --noEmit` 통과, 2026-05-05 `npm run lint` 통과, 2026-05-04 `npx expo export --platform web --output-dir /tmp/judam-funding-review-routes-check` 통과, 2026-05-04 `npx expo export --platform web --output-dir /tmp/judam-funding-review-create-flow-check` 통과. 2026-05-02 `npx expo export --platform web --output-dir /tmp/judam-onboarding-root-check` 통과, 2026-05-02 `npx expo export --platform web --output-dir /tmp/judam-auth-flow-final-check` 통과, 2026-05-02 `npx expo export --platform web --output-dir /tmp/judam-auth-six-flow-final-check` 통과, 2026-05-02 `npx expo export --platform web --output-dir /tmp/judam-brewery-license-upload-check` 통과, 2026-05-02 `npx expo export --platform web --output-dir /tmp/judam-auth-six-flow-recheck` 통과, 2026-05-02 `npx expo export --platform web --output-dir /tmp/judam-brewery-project-create-funding-polish-check` 통과, 2026-05-02 `npx expo export --platform web --output-dir /tmp/judam-funding-detail-second-align-check` 통과, 2026-05-02 `npx expo export --platform web --output-dir /tmp/judam-funding-journal-interaction-check` 통과. 이전 검증으로 `npx expo-doctor` 17/17 통과, `npx expo export --platform web --output-dir /tmp/judam-export-check-after` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-finish-check` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-terms-finish-check` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-finish-align-check` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-terms-bottom-check` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-image-picker-check` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-funding-grid-check` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-image-reorder-check` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-taste-slider-check` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-taste-slider-drag-fix-check` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-date-calendar-check` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-native-date-picker-check` 통과.

보안/의존성 메모: `npm audit fix`로 high 취약점은 제거했다. 남은 `npm audit` moderate 항목은 Expo 내부 툴체인 의존성에서 오며, `npm audit fix --force`는 Expo SDK를 49로 낮추는 breaking change를 제안하므로 적용하지 않는다.

패키지 버전 메모: Expo SDK 54 권장 패치에 맞춰 `expo ~54.0.34`, `expo-linking ~8.0.12`, `expo-web-browser ~15.0.11`, `expo-image-picker ~17.0.11`, `expo-document-picker ~14.0.8`, `@react-native-community/datetimepicker 8.4.4` 사용 중. `app.json` plugins에는 `expo-router`, `expo-splash-screen`, `expo-web-browser`, `expo-image-picker`, `expo-document-picker`, `@react-native-community/datetimepicker`가 들어 있다.

[백엔드/AI 금지선]
- 프론트엔드 작업 중 임의로 서버 API, DB, 인증 서버, 결제 서버, AI 서버, OpenAI/Gemini 호출, API key, `.env` 기반 서버 설정을 만들지 않는다.
- `AIChatScreen`, `AIChatRoomScreen`은 현재 AI 서버 기능이 아니라 프론트 화면/라우트 UI다. 실제 AI 응답 생성 로직을 넣으면 안 된다.
- 로그인/회원가입/Auth는 현재 프론트 mock/로컬 저장 흐름이다. 실제 JWT 발급/검증 서버 로직은 만들지 않는다.
- 펀딩/레시피/커뮤니티 데이터는 현재 `src/constants/data.ts`와 각 Context/화면 내부 mock 데이터 기준이다. 서버 스키마나 API client를 임의로 만들지 않는다.
- 이미지 URL은 UI 시안용 원격 이미지다. 이것은 백엔드 연동이 아니며, 추후 에셋 정책이 정해지면 교체 가능하다.
- 백엔드나 AI 연동이 필요해 보이는 화면도 우선 버튼, 입력, 로딩/빈 상태, mock 결과 등 프론트 UI까지만 구현한다.

[협업 동기화 규칙]
- 이 프로젝트는 여러 명이 함께 수정할 수 있으므로, `judam.md`가 항상 최신이라고 가정하지 않는다.
- 새 작업을 시작할 때는 `judam.md`를 먼저 읽되, 구조 판단이 필요한 작업에서는 실제 파일 트리와 import/route를 함께 확인한다.
- 사용자가 전체 코드 확인을 요청하면 다음을 우선 확인한다: `find app src -type f`, `rg "@/|require\\(|newpicutre|finish|fetch\\(|axios|openai|gemini" app src`, `package.json`, `app.json`, `tsconfig.json`, `metro.config.js`.
- 확인 결과 `judam.md`와 실제 코드가 어긋나면, 변경한 사람이 누구인지와 무관하게 실제 코드 기준으로 `judam.md`를 갱신한다.
- 업데이트할 때는 단순히 “수정함”이라고 쓰지 말고 어떤 파일/화면/데이터/asset/설정이 어떻게 바뀌었는지 나중에 바로 이어받을 수 있게 적는다.

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
- `second/`는 Figma Make 최신 참고 자료일 뿐이며, 앱 코드에서 직접 import하지 않는다. 기존 `finish/`는 삭제된 상태다.
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
- `app/(auth)/password-reset.tsx`: `src/features/auth/screens/PasswordResetScreen.tsx`.
- `app/(auth)/signup.tsx`: `src/features/auth/screens/SignupScreen.tsx`.
- `app/(auth)/user-type.tsx`: `src/features/auth/screens/UserTypeSelectionScreen.tsx`.
- `app/recipe/[id].tsx`: `src/features/recipe/screens/RecipeDetailScreen.tsx`.
- `app/recipe/create.tsx`: `src/features/recipe/screens/RecipeCreateScreen.tsx`.
- `app/funding/[id].tsx`: `src/features/funding/screens/FundingDetailScreen.tsx`.
- `app/funding/support.tsx`: `src/features/funding/screens/FundingSupportScreen.tsx`.
- `app/funding/[id]/review/[reviewId].tsx`: `src/features/funding/screens/FundingReviewDetailScreen.tsx`.
- `app/archive/review/[fundingId].tsx`: `src/features/funding/screens/FundingReviewWriteScreen.tsx`.
- `app/community/create.tsx`: `src/features/community/screens/CommunityCreateScreen.tsx`.
- `app/brewery/[id].tsx`: `src/features/brewery/screens/BreweryProfileScreen.tsx`.
- `app/brewery/dashboard.tsx`: `src/features/brewery/screens/BreweryDashboardScreen.tsx`.
- `app/brewery/verification.tsx`: `src/features/brewery/screens/BreweryVerificationScreen.tsx`.
- `app/brewery/project/terms.tsx`: `src/features/brewery/project/screens/BreweryProjectTermsScreen.tsx`.
- `app/brewery/project/create.tsx`: `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`.
- `app/brewery/project/[id]/journal.tsx`: `src/features/brewery/project/screens/BreweryJournalManageScreen.tsx`.
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
- `tsconfig.json`은 strict mode이며 `second`, `node_modules`를 제외한다.
- TypeScript alias: `@/components/*`, `@/constants/*`, `@/contexts/*`, `@/features/*`, `@/hooks/*`, `@/layouts/*`, `@/utils/*`, `@/assets/*`.
- Metro 런타임 alias는 `metro.config.js`에서 같은 경로를 해석한다. alias 오류가 나면 Metro 캐시 재시작이 우선이다.
- `@/assets/*`는 루트 `assets/`를 바라본다. 나머지 앱 코드는 대부분 `src/`를 바라본다.

[현재 공용 파일 책임]
- `src/constants/data.ts`: 펀딩/레시피 mock 및 seed 데이터의 단일 기준. `FundingProject`, `ProjectStatus`, `JournalEntry`, `BREWING_STAGES`, `Recipe` 타입 포함.
- `src/constants/theme.ts`: Colors, Spacing, BorderRadius, Typography.
- `src/contexts/AuthContext.tsx`: 프론트 mock Auth, 사용자 타입, 로컬 저장 기반 상태.
- `src/contexts/FundingContext.tsx`: 펀딩 프로젝트 state, 후원 참여 state, 프로젝트 추가, 양조일지 갱신, 상태 변경, 후원 금액 반영을 담당한다.
- `src/contexts/FavoritesContext.tsx`: 찜한 펀딩 로컬 저장 상태.
- `src/contexts/CommunityContext.tsx`: 커뮤니티 글 mock 상태.
- `src/utils/storage.ts`: AsyncStorage가 있으면 사용하고, 웹/비지원 환경에서는 fallback memory storage를 제공하는 SafeStorage.
- `src/utils/validation.ts`: 이메일, 휴대폰, 사업자등록번호, 비밀번호 검증과 전화번호/사업자번호 포맷 유틸. 비밀번호 조건은 8자 이상, 영문 대소문자와 숫자 포함이며 `getPasswordStrength`, `isPasswordReady`를 회원가입과 비밀번호 재설정에서 함께 사용한다.
- `src/components/PageHeader.tsx`: 주요 탭 화면 상단 헤더.
- `src/components/recipe-card.tsx`: 레시피 리스트/홈에서 재사용하는 카드.
- `src/components/ui/button.tsx`, `input.tsx`, `progress.tsx`: 현재 실제로 쓰는 기본 UI.

[삭제/정리된 항목]
- `app/(tabs)/explore.tsx` 삭제.
- Expo 템플릿 컴포넌트 `external-link`, `hello-wave`, `parallax-scroll-view`, `themed-text`, `themed-view`, `collapsible`, `icon-symbol` 삭제.
- 임시 스크립트 `fix_styles.js`, `fix_styles2.js`, 오래된 `tsc.log` 삭제.
- `finish/` 폴더 삭제. `second/`는 참고용으로만 유지하고 앱 코드에서 직접 import하지 않는다.
- Figma Make 웹 전용 패키지 참조, 중복 펀딩/레시피 mock 일부 제거.

2-2. 현재 구조 및 기술 스택 빠른 설명
[현재 구조 한눈에 보기]
- `app/`: Expo Router 라우트 엔트리. 실제 화면 로직을 길게 넣지 않고 대부분 `src/features` 화면을 re-export한다.
- `src/features/`: 실제 화면 구현의 중심. home, recipe, funding, community, mypage, auth, brewery, ai-chat, onboarding, notifications, terms, misc로 나뉜다.
- `src/components/`: 여러 화면에서 재사용하는 공용 컴포넌트. `PageHeader`, `recipe-card`, `haptic-tab`이 있다.
- `src/components/ui/`: 기본 UI primitive. 현재 `button`, `input`, `progress`를 사용한다.
- `src/constants/`: `theme.ts`와 `data.ts`. 공용 테마와 mock/seed 데이터의 기준이다.
- `src/contexts/`: 프론트 상태 관리. Auth, Funding, Favorites, Community Context가 있다.
- `src/hooks/`: 컬러 스킴과 테마 컬러 훅.
- `src/layouts/`: 앱 공통 레이아웃. 현재 하단 탭 레이아웃은 `MainTabsLayout.tsx`.
- `src/utils/`: SafeStorage 등 유틸리티.
- `assets/`: 앱 아이콘, 로고 등 Expo 정적 리소스.
- `newpicutre/`: 현재 일부 화면에서 직접 `require`하는 로컬 이미지 폴더. 폴더명은 `newpicutre`로 되어 있으며 오타처럼 보여도 현재 코드가 이 이름을 참조하므로 임의 변경 금지.
- `second/`: 최신 Figma Make 참고용 산출물. 앱 코드에서 직접 import 금지.
- `finish/`: 기존 Figma Make 참고 폴더였으나 2026-05-01에 삭제됨.

[현재 탭/화면 구성]
- 하단 탭은 홈, 주담, 펀딩, 커뮤니티, 마이 5개다.
- 홈: `src/features/home/screens/HomeScreen.tsx`.
- 주담/레시피 리스트: `src/features/recipe/screens/RecipeListScreen.tsx`.
- 펀딩 리스트: `src/features/funding/screens/FundingListScreen.tsx`.
- 커뮤니티: `src/features/community/screens/CommunityScreen.tsx`.
- 마이페이지: `src/features/mypage/screens/MyPageScreen.tsx`.
- 인증 화면: `src/features/auth/screens`.
- 펀딩 상세/후원: `src/features/funding/screens`.
- 레시피 상세/작성: `src/features/recipe/screens`.
- 양조장 화면: `src/features/brewery/screens`, `src/features/brewery/project/screens`.
- AI 채팅 화면: `src/features/ai-chat/screens`. 현재 AI 서버 기능이 아니라 프론트 UI다.

[현재 기술 스택]
- React 19, React Native 0.81.5, Expo SDK 54.
- Expo Router 6 기반 파일 라우팅.
- TypeScript strict mode.
- React Navigation bottom tabs/elements/native.
- React Native Reanimated, Gesture Handler, Safe Area Context, Screens.
- React Native SVG.
- Lucide React Native 아이콘.
- React Native Community DateTimePicker.
- AsyncStorage 기반 로컬 저장.
- Expo Linear Gradient, Haptics, Image Picker, Web Browser, Status Bar, Splash Screen, System UI.
- `eslint-config-expo` 기반 lint, `expo/tsconfig.base` 기반 TypeScript 설정.

[현재 asset 사용]
- `assets/images/logo.png`는 로그인/회원가입/유저 타입/양조장 인증/온보딩 브랜드 영역에서 사용한다.
- `newpicutre/picure3.jpg`는 온보딩 첫 슬라이드와 로그인/회원가입 배경에 사용한다.
- `newpicutre/desk.jpg`, `picture2.jpg`, `picture1.jpg`는 온보딩 feature slide에 사용한다.
- `newpicutre/home1.png`, `home2.jpg`, `home3.jpg`는 홈 배너에 사용한다.
- `newpicutre/funding1.jpg`, `funding2.jpg`, `funding3.jpg`는 홈 인기 펀딩 이미지 override에 사용한다.
- `newpicutre/recipe1.jpg`, `recipe2.jpg`, `recipe3.png`는 홈 인기 레시피 이미지 override에 사용한다.
- `newpicutre/ok.jpg`는 양조장 인증 화면 배경에 사용한다.
- 일부 펀딩/레시피/커뮤니티/알림 mock 데이터에는 아직 원격 Unsplash URL이 남아 있다. 이것은 UI 시안용 이미지 참조이며 백엔드/API 연동이 아니다.
- 사용자가 요청해 추가된 `newpicutre` 이미지들과 `contain` 기반 전체 표시, 전용 이미지 프레임, 배경/썸네일 표시 방식은 의도된 현재 기준이다. `second/` 원본과 비교하더라도 이 표시 방식은 사용자 확인 없이 되돌리지 않는다.

[현재 온보딩/인증 화면 second 기준]
- 중요: 온보딩, 로그인, 회원가입은 2026-05-02 기준 완성/확정 상태다. 사용자가 온보딩/로그인/회원가입 중 특정 화면과 수정 내용을 직접 언급해 부탁하지 않는 이상 마음대로 고치지 않는다. 다른 화면 개발 중 연쇄 수정, 리팩토링, 스타일 통일, `second` 재대조를 이유로 이 세 화면을 건드리면 안 된다.
- 2026-05-02 기준 온보딩, 로그인, 회원가입, 이용약관 동의, 사용자 유형 선택, 양조장 인증은 `second/`의 최신 Figma Make 흐름을 React Native/Expo 방식으로 1차 재정렬했다.
- 루트 진입 화면 `app/index.tsx`는 앱을 처음 열었을 때 저장값과 관계없이 항상 `/onboarding`으로 보낸다. 이 기준은 사용자 요청상 중요 규칙이며, `judam_onboarded` 값으로 루트 온보딩을 자동 스킵하지 않는다.
- 온보딩은 `second`처럼 스와이프로 슬라이드 이동이 가능하고, 하단 점도 눌러 이동할 수 있다. 두 번째 설명 화면부터 로그인/회원가입 CTA 화면이 나오기 전까지는 왼쪽 위 흰색 뒤로가기 화살표로 이전 온보딩 화면을 다시 볼 수 있다. 단, 사용자가 요청한 `newpicutre/picure3.jpg`, `desk.jpg`, `picture2.jpg`, `picture1.jpg` 로컬 이미지와 `contain` 표시 프레임은 유지한다.
- 로그인은 로컬 배경 이미지와 draggable bottom sheet를 유지한다. 이메일/비밀번호 inline 검증, `로그인 유지` 체크, 이메일 저장, 커스텀 알림 모달, 양조장 계정 감지 후 인증 여부에 따른 `/brewery/verification` 또는 `/brewery/dashboard` 이동 흐름을 갖는다.
- 로그인 화면의 `비밀번호를 잊으셨나요?`는 `/password-reset`으로 이동한다. 비밀번호 재설정 화면은 `second/src/app/pages/PasswordResetPage.tsx`를 React Native 방식으로 이식한 3단계 mock UI이며, 이메일 입력, 테스트 인증번호 `1234`, 새 비밀번호/확인 입력, 회원가입과 동일한 비밀번호 조건/강도 표시, 새 비밀번호/비밀번호 확인 입력칸의 눈 아이콘 표시 토글, 단계 dots, 완료 후 `/login` 복귀 흐름을 갖는다. 실제 이메일 발송/인증 서버/비밀번호 변경 API는 연결하지 않는다.
- 회원가입은 `second` 기준으로 닉네임 2~12자/특수문자 금지/중복확인, 이메일 형식/중복확인, 비밀번호 강도 3단계, 비밀번호 실시간 일치 표시, 연락처 자동 하이픈, PASS 본인인증 mock, 전체/필수/선택 약관, 서비스/개인정보 약관 bottom sheet 모달을 갖는다.
- 회원가입 PASS 본인인증은 실제 통신사/PASS SDK 연동이 아니라 프론트 mock이다. 전화번호 형식을 확인한 뒤 0.9초 후 인증 완료 상태로 바뀐다.
- 사용자 유형 선택은 일반 사용자/양조장 카드 선택 구조와 사용자가 추가 요청한 일반 사용자 안내 문구를 유지하고, `second`처럼 뒤로가기 버튼을 포함한다. 현재 기준은 양조장 선택 후 홈 탭으로 먼저 보내지 않고 즉시 `/brewery/verification`으로 이동시키는 흐름이다. 양조장 선택 단계에서는 아직 `type: 'brewery'`로 바꾸지 않으며, 양조장 인증을 완료한 뒤 `verifyBrewery`를 통해서만 `type: 'brewery'`, `isBreweryVerified: true`가 저장된다. 따라서 인증을 마치기 전에는 양조장 유저로 이용할 수 없다.
- 사용자 유형 선택 화면에 직접 진입했는데 `AuthContext.user`가 없으면 유형 선택 UI를 보여주지 않고, 로고와 `회원가입 후 선택할 수 있어요` 안내, 회원가입/로그인 버튼만 보여준다.
- 양조장 인증은 `newpicutre/ok.jpg` 배경을 유지한다. 사업자등록번호/휴대폰 자동 포맷과 검증, 상세 주소, 사업자등록증 업로드, SMS 테스트 코드 `1234`, mock 주소 검색 모달을 포함한다. 사업자등록증 업로드 박스를 누르면 `사진에서 업로드` 또는 `파일로 업로드`를 선택할 수 있고, 사진은 `expo-image-picker` 갤러리 권한 요청 후 선택하며 파일은 `expo-document-picker` 시스템 문서 선택기로 PDF/JPG/PNG 파일을 선택한다. 파일명/uri/mime/크기를 프론트 상태에 저장하고 10MB 초과 또는 허용 확장자가 아닌 경우 안내한다. 연락처 인증은 최초 `인증` 버튼을 누르면 인증번호 입력/확인 영역이 뜨고, 이후 같은 버튼이 `인증번호 재전송`으로 바뀌어 입력값을 비운 뒤 mock 인증번호를 다시 전송한다. 인증 안내 문구는 `인증은 영업일 기준 1~2일 내에 완료됩니다.` 기준이다.
- 양조장 인증 완료 후에는 양조장 권한을 저장한 뒤 `/brewery/dashboard`가 아니라 `/(tabs)` 홈 화면으로 이동한다. 양조장 대시보드는 이후 홈/헤더/마이페이지 등에서 양조장 계정으로 접근하는 흐름으로 본다.
- 양조장 인증 화면에 직접 진입했는데 `AuthContext.user`가 없으면 인증 폼을 보여주지 않고 로그인/회원가입 가드 UI를 보여준다. `AuthContext.verifyBrewery`도 user가 없으면 error를 throw해 직접 호출 시 silent no-op으로 성공처럼 보이지 않게 막는다.
- 인증/회원가입/양조장 인증에서 외부 본인인증, 주소 API, 문서 업로드 서버, 백엔드 인증 서버는 아직 연결하지 않았다.

[현재 비회원 모드 기준]
- 비회원은 `AuthContext.user === null` 상태로 본다. 온보딩 CTA와 로그인 화면 하단의 `비회원으로 둘러보기`는 실제 계정을 만들지 않고 탭 화면으로 진입한다. 이때 반드시 `AuthContext.logout()`을 먼저 호출해 기존 `judam_user` 로컬 저장값과 메모리 상태를 비운다. 이 처리를 빼면 직전 양조장 계정이 남아 비회원 진입 후에도 양조장으로 보일 수 있다.
- 비회원은 홈, 주담 레시피 목록/상세, 펀딩 목록/상세, 커뮤니티 목록/상세 게시글을 읽기 전용으로 둘러볼 수 있다.
- 비회원 마이페이지는 로그인 요구 카드가 아니라 `비회원 님`, `둘러보기 모드` 컨셉의 전용 화면으로 표시한다. 참여 펀딩, 아카이브, 작성 게시글은 `-`로 표시하고, 로그인/회원가입 CTA와 비회원 이용 안내를 보여준다. 비회원 상태에서 설정 아이콘을 누르면 로그인 화면으로 바로 이동하지 않고 `showLoginRequired` 공용 안내가 먼저 떠야 한다.
- 비회원은 레시피 제안하기, 레시피 좋아요, 레시피 댓글/답글/댓글 좋아요를 사용할 수 없다. 누르면 `showLoginRequired` 공용 안내가 뜬다.
- 비회원은 펀딩 프로젝트 등록, 펀딩 좋아요, 후원하기, 펀딩 Q&A 댓글/답글/좋아요, 후기 작성 액션을 사용할 수 없다. 목록/상세 구경은 가능하다.
- 비회원은 커뮤니티 글 작성, 게시글 좋아요, 댓글 작성, 댓글 좋아요, 답글 액션을 사용할 수 없다. 목록 카드와 상세 게시글 읽기는 가능하다.
- 비회원은 AI 챗봇 목록/채팅방을 사용할 수 없다. `PageHeader`의 AI 아이콘, 펀딩 상세 헤더의 AI 아이콘, `/ai-chat`, `/ai-chat/[category]/[roomId]` 직접 진입 모두 로그인 안내 또는 잠금 화면으로 막는다.
- 공용 로그인 필요 안내는 `src/utils/authPrompt.ts`의 `showLoginRequired`를 사용한다. 새 화면에서 비회원 액션을 막을 때 이 유틸을 우선 사용한다.

[현재 상태 판단]
- 프론트엔드 구조는 `app` 라우트와 `src/features` 실제 구현으로 분리되어 있다.
- 백엔드/API/AI 호출 코드는 현재 없다.
- `finish/`는 삭제됐고, `second/` 직접 의존도 없는 상태다.
- 실제 코드와 `judam.md`가 어긋나는지 의심되면 실제 코드가 우선이고, 이 문서를 갱신한다.

[현재 펀딩 후원 흐름]
- 펀딩 상세 화면은 `src/features/funding/screens/FundingDetailScreen.tsx`에서 구현한다.
- 하단 CTA는 권한별과 프로젝트 소유 여부로 분기한다. 비로그인 사용자는 로그인 안내, 로그인한 사용자는 후원 옵션 모달로 이어진다.
- 양조장 계정도 다른 양조장이 만든 프로젝트에서는 일반 사용자와 동일하게 후원할 수 있다.
- 로그인한 양조장의 `breweryName` 또는 `name`이 펀딩 프로젝트의 `brewery`와 같으면 자기 프로젝트로 판단하고, 하단 CTA는 `프로젝트 관리하기`로 표시해 양조장 대시보드 또는 인증 화면으로 이어진다.
- 후원 CTA를 누르면 상세 화면 안에서 수량 선택, 상품 금액, 배송비, 예상 배송일을 확인하는 후원 옵션 모달을 본 뒤 `/funding/support?id={project.id}&quantity={수량}`로 이동한다.
- 후원하기 화면은 `src/features/funding/screens/FundingSupportScreen.tsx`에서 구현한다.
- 후원하기 화면은 직접 진입도 방어한다. 프로젝트 없음, 비로그인, 자기 프로젝트인 양조장 계정, 종료된 펀딩이면 각각 안내 화면으로 분기한다. 양조장 계정이라도 자기 프로젝트가 아니면 후원 UI를 보여준다.
- 후원 UI는 프로젝트 요약, 달성률, 리워드/가격 안내, 수량 선택, 추가 후원금, 후원자 정보, 배송지, mock 주소 검색 모달, 양조장 응원 메시지, 결제수단, 개인정보/후원 유의사항 동의, 환불 정책 펼침, 성공 모달로 구성된다.
- 결제는 백엔드/PG 연동이 아니라 프론트 mock 처리다. 필수 정보와 약관 동의를 확인한 뒤 `FundingContext.addParticipation`으로 로컬 참여 목록에 추가한다.
- `src/constants/data.ts`의 `FundingProject`에는 후원 화면 재사용을 위해 `pricePerBottle`, `bottleSize`, `alcoholContent`, `totalQuantity`, `estimatedDelivery`, `rewardItems`, `shippingFee`가 추가되어 있다.

[현재 펀딩 메인/상세 UI 기준]
- 펀딩 메인 화면은 `second/src/app/pages/FundingListPage.tsx`의 구조와 상태 흐름을 Expo/React Native 방식으로 이식한 `src/features/funding/screens/FundingListScreen.tsx`가 담당한다.
- 메인 화면 구성은 상단 `PageHeader`, 이미지 hero, 검색/상태 필터 floating card, 펀딩 카드 리스트, 페이지네이션, 통계 섹션이다.
- 검색/상태 필터 floating card 아래에는 `전체 n개 · 누적 후원 n만원` 같은 결과 요약 문구를 표시하지 않는다. 사용자가 요청해 해당 한 줄은 제거한 상태다.
- 양조장 계정이면 hero 영역에 양조장 파트너 pill과 등록 CTA를 표시한다. 인증 양조장은 `/brewery/project/terms`, 미인증 양조장은 `/brewery/verification`으로 이동한다.
- 펀딩 메인 hero의 양조장 등록 CTA는 너무 길어 보이지 않도록 인증 양조장용 `+ 프로젝트 등록` 버튼을 컴팩트 폭으로 유지하고, 아이콘과 텍스트는 버튼 중앙에 정렬한다. 미인증 양조장의 `양조장 인증 후 등록`은 문구가 길어 별도 폭을 사용한다.
- 펀딩 카드에서 로그인한 양조장의 `breweryName` 또는 `name`이 프로젝트 `brewery`와 같으면 `내 프로젝트` 배지를 표시한다. 추가로 2026-05-02 사용자 요청에 따라 mock/demo 기준에서는 `봄을 담은 벚꽃 막걸리 프로젝트`(project id 1)를 양조장 로그인 시 본인 프로젝트로 취급한다.
- 검색어나 상태 필터가 바뀌면 페이지네이션은 1페이지로 리셋된다.
- 펀딩 상세 화면은 `second/src/app/pages/FundingDetailPage.tsx`의 구조를 기반으로 하며, 현재 `FundingContext.projects`의 프로젝트별 상세 데이터를 읽어 화면별 내용을 다르게 렌더링한다.
- 프로젝트별 상세 데이터에는 후원용 메타 외에도 `mainIngredients`, `subIngredients`, `projectSummary`, `story`, `budget`, `schedule`, `tasteProfile`이 들어 있다.
- 상세 화면의 소개 탭은 프로젝트별 재료, 도수, 예상 배송일, 요약, 스토리, 가격, 예산, 일정, 맛 지표를 데이터 기반으로 보여준다.
- 상세 화면의 양조일지 탭은 `BREWING_STAGES`와 프로젝트별 `journals`를 기반으로 단계 카드들을 구성한다. 각 단계는 작성된 일지를 최신 id순으로 보여주며, 단계별 3개까지만 먼저 표시하고 4개 이상이면 `더보기`/`접기`로 나머지를 펼친다. 일지별 좋아요, 댓글 열기, 댓글 작성, 댓글 좋아요는 `FundingContext.updateProjectJournals`로 프론트 로컬 상태에 반영한다. 비회원은 좋아요/댓글 액션에서 로그인 필요 안내를 본다. 프로젝트 소유 양조장에게는 양조장 프로필 카드 아래, 탭 위쪽에 `/brewery/project/[id]/journal` 양조일지 관리 화면으로 이동하는 검은색 버튼이 표시된다.
- 상세 화면의 Q&A는 댓글 작성, 댓글 좋아요, 댓글 답글 작성, 답글 좋아요를 지원한다. 비회원은 댓글/좋아요/답글 액션에서 로그인 필요 안내를 본다.
- 상세 화면의 후기 탭은 진행 중 펀딩에서는 진행 중 안내, 성사/종료된 펀딩에서는 `FundingContext.fundingReviews` 기반 후원자 후기 카드 또는 첫 후기 작성 유도 UI를 보여준다. 후기 카드는 `/funding/[id]/review/[reviewId]` 상세 화면으로 이동하고, 후기 작성 버튼은 `/archive/review/[fundingId]` 작성 화면으로 이동한다. 비회원이 후기 작성 버튼을 누르면 기존처럼 로그인 필요 안내를 본다.
- 후기 작성 화면은 사용자가 요청한 최신 기준에 맞춰 투표/맛 일치도 UI를 제거했다. 현재 구성은 해당 상품/리워드, 사진 첨부, 별점, 상세 후기, 그날의 기록, 후기 표시 여부 체크박스, 태그다. `그날의 기록`은 아카이브에는 자동 기록되는 컨셉이고, `후기에도 표시하도록 할까요?`를 체크한 경우에만 후기 상세 게시글에 노출한다.
- 후기 작성 화면의 바깥 배경은 노란/크림 기운이 도는 색을 피하고, 주담의 블랙/화이트/그레이 톤에 맞춘 중립 그레이 `#F4F5F7`을 사용한다. 카드, 입력창, 버튼 등 내부 UI는 기존 형태를 유지한다.
- 후기 등록은 백엔드 없이 `FundingContext.addFundingReview`로 프론트 로컬 상태에 새 후기를 추가하고, 등록 성공 Alert 확인 후 방금 생성한 `/funding/[id]/review/[reviewId]` 상세 화면으로 이동한다. 후기 목록/상세는 같은 `FundingReview` 구조의 `rewardName`, `rating`, `comment`, `images`, `tags`, 선택 노출된 `mood/pairing`을 기준으로 렌더링한다.
- 후기 태그 pill은 게시글에서 세로로 길어 보이지 않도록 `Text` 자체에 배경을 주지 않고, `한라봉 소주` 리워드 배지처럼 `View` pill 안에 `Text`를 넣는 구조를 사용한다. `FundingReviewDetailScreen`의 상세 태그와 `FundingDetailScreen` 후기 카드 태그는 `lineHeight`, 적은 padding, `includeFontPadding: false`로 한글 태그 높이를 안정화한다.
- 후기 상세 화면 왼쪽 위 뒤로가기는 `router.back()`으로 히스토리를 되감지 않고 `/funding/[id]?tab=review&fromReview=1`로 `replace`한다. 이렇게 돌아온 펀딩 상세 화면에서 다시 왼쪽 위 뒤로가기를 누르면 `fromReview=1`을 기준으로 펀딩 메인 `/funding`으로 `replace`한다. 즉 후기 상세 -> 해당 펀딩 게시글 후기 탭 -> 펀딩 메인 순서가 깨지지 않아야 한다.
- 상세 화면의 추천 프로젝트 위에는 `second` 기준처럼 공유하기/신고하기 버튼이 있다. 공유하기는 React Native `Share`를 사용하고, 신고하기는 사유/상세 입력 모달을 띄운 뒤 프론트 mock 접수 안내를 보여준다. 실제 공유 링크 복사 API나 신고 서버 연동은 없다.
- 상세 화면의 추천 프로젝트, 후원 옵션 모달, 하단 CTA 권한 분기는 기존 프론트 mock 흐름을 유지한다.
- 펀딩 프로젝트 소유권 판단은 `src/features/funding/ownership.ts`의 `isFundingProjectOwnedByBrewery`를 기준으로 한다. 이 유틸은 실제 양조장 이름 매칭과 demo project id 1 예외를 함께 처리하며, 펀딩 리스트, 펀딩 상세, 후원하기 직접 진입 방어, 양조장 대시보드, 양조일지 관리 화면에서 같은 기준을 사용한다.

[현재 second 대비 펀딩 상세 잔여 차이]
- `second`는 탭 변경 시 URL query를 `intro`, `journal`, `qna`, `review`로 동기화한다. 현재 Expo 앱은 직접 진입 query 중 `journal`, `qna`, `review`를 초기 탭으로 반영하지만, 탭 버튼을 누를 때마다 URL query를 다시 쓰는 양방향 동기화는 아직 하지 않았다.
- `second`의 양조일지 탭 중 단계별 더보기/접기, 일지 좋아요, 일지 댓글, 일지 댓글 좋아요는 Expo 앱에 이식했다. 다만 `second`에 있는 양조일지 댓글의 대댓글 입력/표시와 동영상 iframe 표시는 아직 Expo 앱에 없다.
- `second`는 공유 모달에서 웹 URL 복사 흐름을 사용한다. 현재 Expo 앱은 모바일 앱 기준으로 React Native 공유 시트를 연다.
- `second`의 `/archive/review/:id`, `/funding/:id/review/:reviewId` 후기 작성/상세 라우트는 Expo 앱에 `/archive/review/[fundingId]`, `/funding/[id]/review/[reviewId]`로 이식했다. 다만 후기 작성 페이지의 기존 투표/맛 일치도 UI는 사용자의 최신 요청에 따라 제거했다. 실제 후기 서버 저장은 없고, `FundingContext` 프론트 로컬 상태에 새 후기를 추가한 뒤 방금 생성한 후기 상세 화면으로 이동한다.
- `second`의 추천 프로젝트 수는 3개이고, 현재 Expo 앱은 모바일 리스트 밀도에 맞춰 4개를 보여준다.

[현재 양조장 펀딩 프로젝트 약관/생성 UI 기준]
- 양조장 프로젝트 등록 버튼을 누르면 먼저 `app/brewery/project/terms.tsx`로 진입하고, 실제 구현은 `src/features/brewery/project/screens/BreweryProjectTermsScreen.tsx`다.
- 약관 화면은 기존 Figma Make 기준을 Expo/React Native 방식으로 이식한 상태이며, 현재 새 기준은 `second/src/app/pages/BreweryProjectTermsPage.tsx`다. 참고 폴더를 직접 import하지 않는다.
- 약관 화면 구조는 흰 배경, 최대 430px 화면 폭, X 닫기 버튼, 가운데 `펀딩 프로젝트 약관` 헤더, `펀딩 프로젝트 등록을 위한 / 약관에 동의해주세요` 안내 문구, 전체 동의 카드, 7개 필수 약관 카드, 각 약관의 `필수` 표시와 `자세히 보기` 모달, 파란 안내 박스, 하단 고정 `다음` 버튼이다.
- 7개 필수 약관 문구와 상세 내용은 Figma Make 원본 기준을 유지한다. 대표 제조자 만 19세 이상, 연락처, 정산 서류/계좌, 수수료 7%, 리워드 책임, 전통주 제조 면허/통신판매 승인, 커스텀 레시피 비독점 사용 라이선스 약관이 포함된다.
- `다음` 버튼은 모든 약관에 동의해야 활성화된다. 활성화 후에는 현재 Expo 앱의 실제 생성 화면 경로인 `/brewery/project/create`로 이동한다. Figma Make의 `/brewery/project/details`는 앱 라우트 구조상 `/brewery/project/create`에 해당하는 흐름으로 본다.
- 약관 화면의 하단 `다음` 버튼은 화면 중간에 떠 보이면 안 된다. 하단 바는 `bottom: 0`에 붙이고, safe area 아래쪽까지 흰색 배경으로 덮어 스크롤 중인 약관 내용이 버튼 아래로 비쳐 보이지 않게 유지한다.
- 약관 상세 모달은 원본처럼 제목, 상세 본문, X 닫기, 하단 `확인` 버튼으로 구성한다.
- 양조장 프로젝트 생성 라우트는 `app/brewery/project/create.tsx`이고, 실제 구현은 `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`다.
- 이 화면은 `second/src/app/pages/CreateProjectDetailPage.tsx`에서 펀딩 프로젝트 등록 버튼을 눌렀을 때 열리는 생성 화면의 구조/내용/문구를 Expo/React Native 방식으로 최대한 그대로 이식한 상태다. `second/`를 직접 import하지 않는다.
- 생성 화면 접근은 권한별로 분기한다. 비로그인/일반 유저는 로그인 안내, 미인증 양조장은 `/brewery/verification` 안내, 인증 양조장만 작성 UI를 볼 수 있다.
- 작성 탭은 `기본정보`, `목표 금액 및 일정`, `법적 고시 정보`, `맛 지표`, `프로젝트 계획`, `양조장 정보`, `안내 사항`, `인증 서류` 8개다.
- 상단 구조는 Figma Make 기준처럼 흰 배경, X 닫기 버튼, 가운데 `펀딩 프로젝트 만들기`, 오른쪽 미리보기 Eye 버튼, `기획중 / n% 완료` 진행률 줄, 프로젝트 썸네일 미리보기, 밑줄형 가로 스크롤 탭으로 구성한다.
- 큰 hero 카드, pill형 탭, 재해석된 카드형 생성 UI는 현재 기준이 아니다. 사용자가 명시적으로 요청하지 않는 한 생성 화면은 Figma Make 등록 화면 형태를 유지한다.
- 하단 제출 바는 Figma Make 기준처럼 `임시저장`/`제출` 2버튼 구성이고, 제출 버튼은 필수 항목 완료율이 100%가 되기 전까지 비활성화된다.
- 사용자가 불필요하다고 한 필수 항목 빨간 테두리, 각 필드 아래 에러 메시지, 제출 실패 시 해당 탭 자동 이동은 구현하지 않는다. 현재 기준은 “필수 항목이 모두 채워져야 버튼 활성화”다.
- `목표 금액 및 일정` 탭의 `각 병당 얼마 (원)`와 `몇 병` 입력은 Figma Make 기준의 `grid-cols-2 gap-2`처럼 한 줄에서 화면 가로폭을 같은 비율로 반반 채운다. React Native에서는 각 `Field`를 `twoColItem` flex 컨테이너로 감싸 동일 폭을 보장한다.
- 대표 이미지 영역은 Figma Make 기준의 128px 정사각 이미지 추가 카드와 이미지 썸네일 레일을 따른다. `이미지 추가`를 누르면 `expo-image-picker`로 갤러리 접근 권한을 요청한 뒤 사용자가 휴대폰 갤러리에서 이미지를 선택할 수 있다. 최대 5장까지 선택 이미지 URI를 화면 상태에 추가한다. 실제 서버 업로드는 없다.
- 대표 이미지 썸네일의 1, 2, 3, 4, 5 번호 뱃지는 순서 변경 드래그 핸들이다. 번호 뱃지를 누른 채 좌우로 움직였다가 놓으면 해당 이미지가 목표 위치로 이동하며, 드래그 중에는 이미지 레일의 가로 스크롤을 잠깐 비활성화한다. 첫 번째 이미지가 대표 이미지로 미니 프리뷰와 미리보기 화면에 표시된다.
- 사용자가 별도로 요청한 `AI 생성`은 이미지 추가 카드와 같은 정사각 업로드 카드로 만들지 않고, 양조장 정보의 `불러오기` 버튼처럼 검은색 소형 텍스트 버튼으로 대표 이미지 라벨 오른쪽에 배치한다. `AI 생성`은 실제 AI 서버 호출 없이 mock 이미지 URI만 추가한다.
- 기본정보의 검색 태그 입력은 controlled input이다. Enter/Done으로 태그를 추가하면 입력값이 즉시 초기화되어 바로 다음 태그를 입력할 수 있다.
- 기본정보의 `도수`는 숫자와 소수점만 입력되도록 제한한다. 사용자가 `%`를 직접 입력하지 않아도 입력칸 오른쪽 suffix로 `%`를 보여주고, 제출 데이터와 미리보기에는 `%` 단위가 붙은 값으로 매핑한다.
- 법적 고시 정보 탭의 `상품 분류`, `용량`, `도수`, `구성요소 (원재료)`, `주 소재`, `원산지` 입력은 Figma Make 기준처럼 작은 12px 라벨, 42px 안팎의 compact 입력칸, 8px radius, `grid-cols-2`에 해당하는 2열 구성을 기준으로 한다. 공용 큰 `Field` 스타일을 그대로 쓰면 기준과 달라 보이므로 이 탭은 compact legal field 스타일을 별도로 유지한다.
- 법적 고시 정보의 `용량`은 숫자만 입력하고 `ml` suffix를 보여준다. 법적 고시 정보의 `도수`는 숫자와 소수점만 입력하고 `%` suffix를 보여준다. 제출 데이터와 미리보기에는 각각 `ml`, `%` 단위가 붙은 값으로 매핑한다.
- 날짜 검증은 모달이 아니라 화면 안내 문구로만 처리한다. 펀딩 시작일이 과거면 “펀딩 시작일은 오늘 이후 날짜” 안내를 보여주고 완료율에 반영하지 않는다. 예상 발송 시작일이 펀딩 종료일 이후가 아니면 예상 발송 시작일 입력칸 위에 “펀딩 종료일 이후 날짜” 안내 박스를 보여준다. 기존 “종료 후 최소 30일” 모달 검증은 사용자 요청에 따라 제거했다.
- `목표 금액 및 일정` 탭의 `펀딩 시작일`과 `예상 발송 시작일`은 Figma Make date input 흐름을 React Native 방식으로 구현한다. 날짜 입력칸 오른쪽에 캘린더 아이콘을 표시하고, 아이콘을 누르면 `@react-native-community/datetimepicker` 기반 OS 네이티브 날짜 선택기가 열린다. Android는 시스템 calendar dialog, iOS는 inline UIDatePicker를 모달 안에 표시한다. 날짜 선택 시 `YYYY-MM-DD` 형식으로 해당 필드에 반영한다. 직접 입력도 유지한다. 이전에 만든 커스텀 `CalendarDateModal`은 실제 OS 캘린더 느낌이 부족해 제거했다.
- 양조장 정보 탭의 프로필 이미지는 `프로필 이미지 업로드`를 누르면 `갤러리에서 선택`, `카메라로 촬영`, `취소`를 고르는 Alert가 뜬다. 갤러리는 `ImagePicker.requestMediaLibraryPermissionsAsync()`, 카메라는 `ImagePicker.requestCameraPermissionsAsync()`로 실제 기기 권한을 요청한 뒤 선택/촬영한 이미지 URI와 파일명을 프론트 상태에 저장한다. 실제 서버 업로드는 없다.
- 양조장 정보 탭의 본인 인증은 회원가입/양조장 인증 화면과 같은 프론트 mock 방식이다. 휴대폰 번호가 `010-0000-0000` 형식으로 유효해지면 `인증하기`가 활성화되고, 인증번호 발송 Alert 후 테스트 코드 `1234`를 입력하면 인증 완료된다. 인증번호 발송 후 같은 버튼은 `인증번호 재전송`으로 바뀌며 재전송 시 입력 코드를 초기화하고 타이머를 다시 시작한다.
- 양조장 정보 탭의 입금 계좌는 `second` 기준처럼 은행 선택 모달을 사용한다. 은행 목록은 KB국민, 신한, 우리, 하나, 농협은행, IBK기업, 카카오뱅크, 토스뱅크, 케이뱅크, SC제일, 부산, 대구, 광주, 전북, 경남, 수협, 새마을금고, 신협이다. 계좌번호는 숫자만 입력되고 20자리까지 제한하며, 화면 폭 안에서 고정된 입력 박스가 줄어들거나 넘치지 않도록 full-width 입력으로 유지한다.
- 양조장 정보 탭의 업태/종목은 `목표 금액 및 일정` 탭에서 보정한 2열 입력과 같은 방식으로 각 `Field`를 `twoColItem`에 넣어 붙어 보이지 않게 동일 폭을 보장한다.
- 양조장 정보 탭의 주소검색은 후원하기 화면의 주소 검색 mock 모달과 같은 UX를 가져왔다. 도로명/지역명/우편번호 검색 후 mock 결과를 선택할 수 있고, 검색어를 직접 입력한 경우 `입력한 주소 사용` 카드로 실제 주소 입력처럼 해당 텍스트를 사업장 소재지에 반영할 수 있다.
- 계좌 인증, 사업자 등록증, 통신판매신고증, 주류통신판매 승인서, 전통주 제조 면허증은 모두 프론트 mock 상태다. 실제 금융 인증, 문서 업로드, 심사 API는 만들지 않았다.
- 맛 지표 탭은 Figma Make 기준처럼 단맛, 잔향, 산미, 바디감, 탄산감 조절과 레이더 차트 미리보기로 구성한다. `+/-` stepper는 사용하지 않고, 각 지표는 라벨/설명, 오른쪽 퍼센트, 얇은 회색 트랙, 검은 fill, 검은 thumb, 하단 `약함`/`강함` 텍스트가 있는 커스텀 range slider 형태다. 사용자가 트랙을 누르거나 좌우로 문지르면 값이 바뀌고 레이더 차트가 즉시 갱신된다. 드래그 값 계산은 내부 요소 기준 `locationX`가 아니라 슬라이더 전체의 화면 위치를 `measureInWindow`로 측정한 뒤 `pageX - sliderLeft`로 계산한다. 이 기준을 바꾸면 thumb/fill 위에서 좌표 기준이 흔들려 값이 0으로 튀고 깜빡일 수 있다.
- 작성 진행률은 `기획중 · 필수 항목 기준 / n% 완료`로 표시한다. `*` 필수 항목만 완료율에 반영하고, 선택 입력인 짧은 제목, 서브 재료, 검색 태그, 프로젝트 예산, 프로젝트 일정, 프로필 이미지, 창작자 소개, 신분증/사업자등록증은 라벨에 `(선택)`을 표시한다. 안내사항의 프로젝트 정책과 예상 어려움도 필수 완료율에 포함한다.
- 미리보기 Eye 버튼은 Figma Make 기준의 전체 화면 미리보기 흐름을 따르되, 현재 앱의 실제 펀딩 상세 게시글 형식과 맞게 메인 이미지, 제목/요약, 펀딩 현황, 양조장 프로필/지역/카테고리, 프로젝트 소개, 가격 안내, 예산, 일정, 맛 지표, 안내사항을 표시한다. 입력한 대표 이미지, 도수/용량 단위, 병당 가격, 총 수량, 예상 배송일, 양조장 정보가 미리보기 데이터에 반영된다.
- 임시저장은 `SafeStorage`의 `judam_project_temp_save` 키에 현재 작성 상태를 저장하는 프론트 로컬 mock 흐름이다. 저장된 초안이 없을 때 `임시저장`을 누르면 저장 후 `임시저장 되었습니다.` 모달만 보여준다. 저장된 초안이 있을 때 다시 `임시저장`을 누르면 기존 초안을 불러오거나 현재 내용으로 새로 저장하거나 삭제할 수 있다. 저장된 초안이 있는 상태에서 X를 누르면 초안을 불러오거나 불러오지 않고 나가거나 계속 작성할 수 있다. 저장된 초안이 없고 작성 내용만 있는 상태에서 X를 누르면 임시저장하지 않고 나갈지 확인하는 모달을 보여준다.
- 프로젝트 생성 완료 시 제출 확인 모달, 성공 모달 후 `/brewery/dashboard`로 이동하는 프론트 mock 흐름이다. 제출 시 `FundingContext.addProject`로 `심사 중` 상태의 새 프로젝트를 로컬 프로젝트 목록에 추가한다.

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

[2026-04-29]: `judam.md` 기억 복구 및 협업 동기화 규칙 보강 완료.

[진행 내용]:
- 사용자가 요청한 “현재 파일 구조 설명과 기술 스택 설명”을 `judam.md`에 빠른 참조 섹션으로 추가.
- `judam.md`는 AI 기억 복구용 문서이고, 실제 최신 기준은 현재 코드 파일이라는 원칙을 명시.
- 다른 개발자가 변경했지만 `judam.md`에 반영하지 않은 내용이 있을 수 있으므로, 전체 코드 확인 요청 시 실제 파일 트리/import/route/package/config/asset 참조를 다시 훑고 문서와 다른 내용을 갱신해야 한다는 협업 동기화 규칙을 추가.
- 실제 코드 확인 중 `newpicutre` 폴더가 단순 자료 폴더가 아니라 온보딩, 로그인, 회원가입, 홈, 양조장 인증 화면에서 로컬 asset으로 사용 중임을 재확인하고 문서에 반영.
- 현재 구조 요약, route와 screen 매핑, 공용 폴더 책임, 기술 스택, asset 사용 현황, 백엔드/API/AI 금지선을 더 명확히 정리.
- 앱 코드 변경 없이 문서만 업데이트.
- `npx tsc --noEmit` 통과, `npm run lint` 통과 상태 확인.

[2026-04-29]: `finish/` 기준 주요 공통/인증 UI 비교 점검 완료.

[진행 내용]:
- 사용자가 요청한 하단바, 상단바, 스플래시/온보딩, 로그인, 회원가입, 이용약관 동의, 사용자 유형 선택, 양조장 인증 UI를 `finish/src/app` 기준 파일과 현재 Expo/React Native 구현 파일로 비교.
- 비교 기준 파일: `finish/src/app/components/RootLayout.tsx`, `PageHeader.tsx`, `finish/src/app/pages/OnboardingPage.tsx`, `LoginPage.tsx`, `SignupPage.tsx`, `UserTypeSelectionPage.tsx`, `BreweryVerificationPage.tsx`, `TermsPage.tsx`.
- 현재 구현 기준 파일: `src/layouts/MainTabsLayout.tsx`, `src/components/PageHeader.tsx`, `src/features/onboarding/screens/OnboardingScreen.tsx`, `src/features/auth/screens/LoginScreen.tsx`, `SignupScreen.tsx`, `UserTypeSelectionScreen.tsx`, `src/features/brewery/screens/BreweryVerificationScreen.tsx`, `src/features/terms/screens/TermsScreen.tsx`.
- 결론: 핵심 구성, 화면 흐름, 텍스트, 주요 버튼/입력 요소는 대부분 `finish`를 기반으로 이식되어 있으나, 100% 픽셀 동일 상태는 아니다.
- 차이가 나는 주요 이유는 웹/Figma Make React 구현을 Expo/React Native 네이티브 구조로 옮겼기 때문이며, 사용자가 추가로 요청한 `newpicutre` 로컬 이미지 교체도 `finish`와 다른 의도된 변경이다.
- 하단바는 5탭 구성과 아이콘/라벨은 `finish`와 일치하지만, 현재는 Expo Router Tabs, safe area, native tab height, haptic button을 사용하므로 CSS 픽셀 구조는 다르다.
- 상단바는 제목, 양조장 대시보드/알림/AI 채팅 아이콘 흐름은 유사하지만, 현재는 React Native safe area, back mode, 원형 배경 아이콘 스타일이 추가되어 `finish`와 완전히 같지는 않다.
- 스플래시 별도 화면은 현재 `app/index.tsx`에서 즉시 `/onboarding`으로 Redirect하는 구조다. `finish`도 별도 SplashPage보다는 onboarding/home 분기 구조지만, 현재 Expo native splash와 온보딩 진입 방식은 `finish`와 완전 동일하다고 볼 수 없다.
- 온보딩 UI는 슬라이드 문구/CTA/흐름은 `finish`와 매우 유사하지만, 현재는 `newpicutre/picure3.jpg`, `desk.jpg`, `picture2.jpg`, `picture1.jpg` 로컬 이미지를 사용하고 모든 슬라이드 이미지를 `contain` 프레임 방식으로 표시하도록 조정되어 `finish` 원본 이미지/cover 표시와 다르다.
- 로그인 UI는 배경+그라디언트+상단 로고/문구+하단 시트+이메일/비밀번호+카카오+회원가입/비회원 링크 구성은 `finish`와 거의 같은 방향이나, 현재는 로컬 이미지 `newpicutre/picure3.jpg`, Gesture 기반 draggable bottom sheet, Alert, Expo Router 흐름을 사용한다.
- 회원가입 UI와 이용약관 동의 UI는 입력 항목, 이메일 중복확인, 연락처 인증, 전체 동의/필수 약관/마케팅 선택 동의 구조가 `finish`와 유사하지만, 현재는 React Native 컴포넌트와 Alert, 로컬 배경 이미지, draggable bottom sheet로 구현되어 픽셀 동일은 아니다.
- 사용자 유형 선택 UI는 일반 사용자/양조장 카드, 주요 혜택, 인증 필요 배지, 선택 후 CTA가 `finish`와 유사하지만, 현재는 native ScrollView/safe area와 “마이페이지에서 양조장 인증 시 전환 가능” 안내 문구가 추가되어 있다.
- 양조장 인증 UI는 사업자번호, 양조장 이름, 위치, 연락처 인증, 사업자등록증 업로드, 인증 안내, 취소/인증 신청 구조가 `finish`와 유사하지만, 현재는 `newpicutre/ok.jpg` 배경, 흰색 오버레이, mock 파일 선택 문자열, native Alert/ScrollView 구조라 완전 동일은 아니다.
- 따라서 이후 “finish와 100% 동일”을 목표로 한다면, 추가 요청으로 바뀐 로컬 이미지/표시 방식/네이티브 제스처/라우팅 차이를 어느 쪽 기준으로 맞출지 먼저 정해야 한다.

[2026-04-29]: 사용자 요청 이미지 및 표시 방식 우선 규칙 고정 완료.

[진행 내용]:
- 사용자가 앞으로 추가 요청한 이미지와 표시 방식은 무조건 유지해야 한다고 명확히 요청.
- `finish/`는 계속 참고 기준으로 사용하되, 사용자가 별도로 요청한 로컬 이미지, asset 교체, `contain` 표시, 이미지 프레임, 배경/썸네일 표시 방식은 `finish/`보다 우선하는 기준으로 문서화.
- 이후 `finish/`와 비교하거나 100% 유사도 작업을 진행하더라도 사용자 요청 이미지/표시 방식을 임의로 원복하지 않고, 변경 필요 시 먼저 확인해야 함을 `judam.md`에 기록.
- 앱 코드 변경 없이 문서만 업데이트.

[2026-04-29]: 펀딩 상세 권한 분기 및 후원하기 UI 구체화 완료.

[진행 내용]:
- `judam.md`를 리마인드하고 `finish/src/app/pages/FundingDetailPage.tsx`, `FundingSupportPage.tsx`, `ProtectedRoute.tsx`, 현재 `AuthContext`, `FundingContext`, 펀딩 상세/후원 화면을 비교했다.
- `src/constants/data.ts`의 `FundingProject` 타입과 mock 데이터에 후원 화면용 리워드 메타를 추가했다. 추가 필드: 병당 단가, 병 용량, 도수, 총 판매 수량, 예상 배송일, 리워드 구성, 배송비.
- `src/features/funding/screens/FundingDetailScreen.tsx`의 하단 CTA를 권한별로 분기했다. 비로그인은 로그인 안내, 일반 사용자는 후원 옵션 모달, 인증 양조장은 대시보드 안내, 미인증 양조장은 인증 안내, 종료된 펀딩은 비활성 상태로 처리한다.
- 펀딩 상세 화면에 `finish`의 후원 옵션 모달 흐름을 Expo/React Native 방식으로 반영했다. 프로젝트 요약, 용량/도수, 수량 선택, 상품 금액, 배송비, 총 결제 금액, 예상 배송일을 확인한 뒤 후원 화면으로 이동한다.
- 펀딩 상세의 가격 안내도 공용 펀딩 데이터의 병당 단가, 용량, 목표 수량, 목표 금액을 사용하도록 조정했다.
- Q&A 댓글/답글 작성 시 현재 사용자가 양조장 계정이면 양조장 배지가 붙도록 작성자 타입 값을 반영했다.
- `src/features/funding/screens/FundingSupportScreen.tsx`를 `finish`의 후원하기 UI 흐름에 맞춰 확장했다. 프로젝트 요약, 달성률, 리워드/가격, 수량, 추가 후원금, 후원자 정보, 배송지, mock 주소 검색, 응원 메시지, 결제수단, 약관 동의, 환불 유의사항, 성공 모달을 구현했다.
- 후원하기 화면 직접 진입 방어를 추가했다. 프로젝트 없음, 비로그인, 양조장 계정, 종료된 펀딩은 안내 화면으로 분기한다.
- 결제/주소 검색은 백엔드나 외부 API 없이 프론트 mock 상태로만 구현했다. 후원 확정 시 `FundingContext.addParticipation`으로 로컬 참여 목록만 갱신한다.
- `finish/` 직접 import는 추가하지 않았고, 사용자가 요청한 기존 이미지/표시 방식은 변경하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과 상태 확인.

[2026-04-29]: 양조장 계정 후원 권한 분기 세분화 완료.

[진행 내용]:
- 사용자가 양조장 계정도 자신이 만든 펀딩 프로젝트가 아니라면 동일하게 후원할 수 있어야 하고, 자신이 만든 프로젝트에서만 관리하기가 떠야 한다고 요청.
- `src/features/funding/screens/FundingDetailScreen.tsx`에서 로그인한 양조장의 `breweryName` 또는 `name`과 프로젝트의 `brewery` 값을 비교해 자기 프로젝트 여부를 판단하도록 변경.
- 펀딩 상세 하단 CTA는 자기 프로젝트인 경우에만 `프로젝트 관리하기`로 표시하고, 자기 프로젝트가 아닌 진행 중 프로젝트는 양조장 계정도 일반 사용자처럼 `프로젝트 후원하기`를 활성화한다.
- `src/features/funding/screens/FundingSupportScreen.tsx`의 직접 진입 방어도 수정했다. 양조장 계정 전체를 막지 않고, 자기 프로젝트인 경우에만 관리/인증 안내 화면으로 분기한다.
- 백엔드/API/결제 연동은 추가하지 않았고 기존 프론트 mock 후원 흐름만 유지했다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과 상태 확인.

[2026-04-29]: 펀딩 메인 및 프로젝트별 상세 UI Figma Make 기반 보강 완료.

[진행 내용]:
- 사용자가 펀딩 메인 화면 UI와 펀딩 프로젝트별 게시글 상세 UI를 `finish` 파일 기반으로 정리해달라고 요청.
- 작업 전 `judam.md`, 현재 `FundingListScreen.tsx`, `FundingDetailScreen.tsx`, `finish/src/app/pages/FundingListPage.tsx`, `FundingDetailPage.tsx`를 비교했다.
- `src/constants/data.ts`의 `FundingProject` 타입과 6개 mock 프로젝트에 프로젝트별 상세 데이터를 확장했다. 추가 필드: `mainIngredients`, `subIngredients`, `projectSummary`, `story`, `budget`, `schedule`, `tasteProfile`.
- 펀딩 메인 화면의 hero 영역에 양조장 계정용 표시를 보강했다. 인증 양조장은 프로젝트 등록으로, 미인증 양조장은 양조장 인증으로 이어진다.
- 펀딩 메인 리스트 카드에서 로그인한 양조장의 프로젝트에는 `내 프로젝트` 배지를 표시하도록 했다.
- 검색어 또는 상태 필터가 변경되면 페이지네이션을 1페이지로 되돌리도록 했다.
- 펀딩 메인 검색/필터 영역 아래에 현재 필터 결과 수와 누적 후원 금액 요약을 표시했다.
- 펀딩 상세 소개 탭의 재료, 도수, 요약, 본문 스토리, 예산, 일정, 맛 지표를 더 이상 하드코딩하지 않고 프로젝트별 데이터 기반으로 렌더링하도록 변경했다.
- 펀딩 상세 양조일지 탭도 프로젝트별 `schedule` 데이터를 기반으로 단계 카드가 구성되도록 변경했다.
- 기존 후원하기 CTA 권한 분기, 양조장 자기 프로젝트 관리 분기, 후원 옵션 모달, 후원하기 화면 mock 결제 흐름은 유지했다.
- `finish/` 직접 import는 추가하지 않았고, 기존 사용자 요청 이미지/표시 방식은 변경하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과, `npx expo export --platform web --output-dir /tmp/judam-funding-ui-check` 통과 상태 확인.

[2026-04-29]: 양조장 펀딩 프로젝트 생성 UI Figma Make 기반 확장 완료.

[진행 내용]:
- 작업 전 `judam.md`를 리마인드하고, 현재 `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`, `finish/src/app/pages/CreateProjectDetailPage.tsx`, 후원하기 주소 검색 모달, 회원가입/양조장 인증의 본인 인증 mock 흐름을 비교했다.
- 기존 최소 입력형 프로젝트 생성 화면을 `finish`의 생성 화면 구조에 맞춰 탭 기반 작성 UI로 전면 확장했다.
- 작성 탭은 기본정보, 목표 금액 및 일정, 법적 고시 정보, 맛 지표, 프로젝트 계획, 양조장 정보, 안내 사항, 인증 서류로 구성했다.
- 상단 hero 카드, 탭 진행 상태, 완료율 progress, 프로젝트 미리보기, 하단 고정 제출 바를 추가했다.
- 필수 항목이 100% 완료되기 전까지 제출 버튼을 비활성화하도록 했다. 사용자가 불필요하다고 한 빨간 테두리, 필드별 에러 메시지, 제출 실패 시 탭 자동 이동은 넣지 않았다.
- 대표 이미지 영역에 파일 업로드 mock 버튼과 AI 생성 mock 버튼을 함께 배치했다. 실제 로컬 파일 업로드/AI 서버 호출 없이 화면 상태와 원격 시안 이미지로만 동작한다.
- 날짜 안내는 모달이 아니라 화면 안내 문구로 구현했다. 펀딩 시작일 과거 입력은 필드 안내로, 예상 발송 시작일이 펀딩 종료일 이후가 아닌 경우는 입력칸 위 안내 박스로 표시하고 완료율에서 제외한다. “종료 후 최소 30일” 검증은 제거했다.
- 양조장 정보 탭에 본인 인증 UI를 추가했다. 다른 인증 화면과 동일하게 Alert로 인증번호 발송을 안내하고 테스트 코드 `1234` 입력 시 인증 완료된다.
- 후원하기 화면의 mock 주소 검색 모달 UX를 프로젝트 생성 화면 사업장 소재지 검색에도 반영했다.
- 계좌 인증, 사업자 등록증, 통신판매신고증, 주류통신판매 승인서, 전통주 제조 면허증은 모두 프론트 mock 상태로만 처리한다.
- 비로그인/일반 유저, 미인증 양조장, 인증 양조장 접근 분기를 생성 화면에 추가했다.
- `finish/` 직접 import, 백엔드/API/AI 호출, 실제 파일 업로드 로직은 추가하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-check` 통과 상태 확인.

[2026-04-29]: 양조장 펀딩 프로젝트 생성 UI를 finish 등록 화면 기준으로 재정렬 완료.

[진행 내용]:
- 사용자가 “디자인이 아예 바뀌었다. finish 파일에서 펀딩 프로젝트 등록 버튼을 눌렀을 때와 똑같아야 한다”고 피드백했다.
- 이전 구현처럼 큰 hero 카드, pill형 탭, 재해석된 섹션 카드를 쓰는 방식은 제거했다.
- `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`를 다시 수정해 `finish/src/app/pages/CreateProjectDetailPage.tsx`의 실제 등록 화면 구조를 기준으로 맞췄다.
- 상단은 X 닫기 버튼, 가운데 `펀딩 프로젝트 만들기`, Eye 미리보기 버튼, `기획중 / n% 완료` 진행률 줄, 프로젝트 썸네일 미리보기, 밑줄형 가로 스크롤 탭으로 재구성했다.
- 각 탭의 입력 순서와 문구를 `finish` 기준으로 정렬했다. 기본정보, 목표 금액 및 일정, 법적 고시 정보, 맛 지표, 프로젝트 계획, 양조장 정보, 안내 사항, 인증 서류 탭 모두 `finish`의 항목과 안내문을 따라간다.
- 하단 버튼은 `finish`와 같이 `임시저장`/`제출` 2버튼 고정 바를 사용한다.
- Eye 미리보기는 `finish`의 전체 화면 미리보기 흐름에 맞춰 메인 이미지, 제목/요약, 펀딩 현황, 양조장 프로필, 프로젝트 소개, 가격 안내, 예산, 일정, 맛 지표, 안내사항을 보여준다.
- 사용자가 이전에 별도로 요청한 변경점은 유지했다. 대표 이미지 영역에 AI 생성 버튼을 복원했고, 날짜 검증은 모달이 아니라 안내문 방식으로 유지했으며, 본인 인증과 주소검색은 기존 mock 흐름으로 연결했다.
- `finish/` 직접 import, 백엔드/API/AI 호출, 실제 파일 업로드 로직은 추가하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-finish-check` 통과 상태 확인.

[2026-04-29]: 양조장 펀딩 프로젝트 약관 화면을 finish 등록 첫 화면 기준으로 재구현 완료.

[진행 내용]:
- 사용자가 “펀딩 프로젝트 등록을 누르면 처음 뜨는 약관부터 finish 파일과 100% 같아야 한다”고 피드백했다.
- 작업 전 `judam.md`, 현재 `src/features/brewery/project/screens/BreweryProjectTermsScreen.tsx`, `finish/src/app/pages/BreweryProjectTermsPage.tsx`, 등록 진입 경로를 다시 확인했다.
- 기존 임시 약관 화면을 제거하고 `finish/src/app/pages/BreweryProjectTermsPage.tsx`의 구조와 문구를 기준으로 약관 화면을 다시 구현했다.
- 헤더는 X 닫기 버튼, 가운데 `펀딩 프로젝트 약관`, 오른쪽 빈 영역으로 구성하고, X 버튼은 펀딩 목록으로 돌아가도록 했다.
- 본문은 `펀딩 프로젝트 등록을 위한 / 약관에 동의해주세요` 제목, 설명 문구, 전체 동의, 7개 필수 약관 카드, 파란 승인 소요 안내 박스 순서로 맞췄다.
- 7개 필수 약관의 제목과 상세 내용은 `finish` 원본의 age, contact, settlement, fee, responsibility, license, ip 항목을 그대로 반영했다.
- 각 약관의 `자세히 보기`는 원본처럼 모달로 열리고, 모달은 제목, 상세 본문, X 닫기, 하단 `확인` 버튼으로 닫히도록 구현했다.
- 하단 고정 버튼은 `finish`와 같이 `다음` 단일 버튼이며, 모든 필수 약관에 동의하기 전에는 비활성화된다.
- `다음` 클릭 후 이동 경로는 Expo 앱의 실제 생성 화면인 `/brewery/project/create`로 연결했다. 이는 `finish`의 `/brewery/project/details`에 해당하는 현재 앱 라우트다.
- `finish/` 직접 import, 백엔드/API/AI 호출, 실제 인증/심사 로직은 추가하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-terms-finish-check` 통과 상태 확인.

[2026-04-29]: 양조장 펀딩 프로젝트 생성 화면 세부 UI finish 재대조 및 보정 완료.

[진행 내용]:
- 사용자가 기본정보의 프로젝트 대표 이미지 영역에서 `AI 생성` 버튼이 이미지 추가와 같은 카드 디자인으로 들어간 점, 법적 고시 정보의 `용량`/`도수` 입력 UI가 `finish`와 다른 점을 지적했다.
- 작업 전 `judam.md`, 현재 `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`, `finish/src/app/pages/CreateProjectDetailPage.tsx`의 대표 이미지 업로드 구간, 법적 고시 정보 구간, 양조장 정보의 `불러오기` 버튼 구간을 다시 대조했다.
- 기본정보의 대표 이미지 영역에서 `AI 생성` 정사각 점선 카드를 제거했다.
- `AI 생성`은 사용자가 요청한 대로 양조장 정보의 `불러오기`와 같은 검은색 소형 텍스트 버튼 형태로 대표 이미지 라벨 오른쪽에 배치했다.
- 대표 이미지의 `이미지 추가`는 `finish` 원본처럼 128px 정사각 점선 업로드 카드로 유지하고, 등록된 이미지는 기존 썸네일 레일과 순번/삭제 버튼 흐름을 유지했다.
- 법적 고시 정보 탭의 `상품 분류`, `용량`, `도수`, `구성요소 (원재료)`, `주 소재`, `원산지`를 `finish` 원본의 compact 구조에 맞춰 별도 `LegalField` 스타일로 조정했다.
- 법적 고시 입력은 작은 12px 라벨, 42px 안팎의 입력 높이, 8px radius, 2열 용량/도수 배치, 상단 border가 있는 구성요소 섹션, compact ingredient card 흐름을 따른다.
- 사용자 요청으로 유지해야 하는 기존 차이점은 그대로 두었다. 대표 이미지의 `AI 생성` 자체는 `finish` 원본에는 없지만 사용자 요청 기준으로 유지하며, 백엔드/API/AI 호출 없이 mock 이미지 추가만 수행한다.
- 기존 날짜 안내 방식, 필수 항목 100% 완료 전 제출 비활성화 방식, 본인 인증/주소검색 mock 흐름은 변경하지 않았다.
- `finish/` 직접 import, 실제 파일 업로드, 실제 AI 생성, 서버 심사/API 로직은 추가하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-finish-align-check` 통과 상태 확인.

[2026-04-29]: 양조장 펀딩 프로젝트 약관 하단 버튼 영역 보정 완료.

[진행 내용]:
- 사용자가 약관 화면의 `다음` 버튼이 화면 중앙 쪽에 떠 있고, 스크롤 시 버튼 아래로 약관 내용이 비쳐 보여 디자인이 어색하다고 피드백했다.
- `src/features/brewery/project/screens/BreweryProjectTermsScreen.tsx`의 하단 고정 바를 `bottom: 0`으로 내려 화면 바닥에 붙였다.
- 하단 바의 배경을 흰색으로 유지하고 safe area 아래쪽까지 `paddingBottom`으로 덮어 버튼 아래 영역에 스크롤 내용이 보이지 않도록 했다.
- ScrollView의 하단 여백은 버튼 영역에 가려지지 않을 정도로 조정했다.
- 약관 문구, 동의 상태, 자세히 보기 모달, 다음 버튼 활성화 조건, `/brewery/project/create` 이동 흐름은 변경하지 않았다.
- `finish/` 직접 import, 백엔드/API/AI 호출은 추가하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-terms-bottom-check` 통과 상태 확인.

[2026-04-29]: 양조장 펀딩 프로젝트 생성 대표 이미지 갤러리 선택 및 태그 입력 초기화 완료.

[진행 내용]:
- 사용자가 펀딩 프로젝트 만들기 기본정보의 `프로젝트 대표 이미지 > 이미지 추가`를 누르면 휴대폰 갤러리 권한을 받고 이미지를 선택해 넣을 수 있어야 한다고 요청했다.
- `expo-image-picker ~17.0.11`을 Expo SDK 54 호환 버전으로 설치했다. `package.json`과 `package-lock.json`이 갱신되었다.
- `app.json` plugins에 `expo-image-picker`를 추가하고 iOS 사진 접근 권한 문구를 `프로젝트 대표 이미지를 등록하기 위해 갤러리 접근 권한이 필요합니다.`로 설정했다.
- `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`에서 `ImagePicker.requestMediaLibraryPermissionsAsync()`로 갤러리 접근 권한을 요청한 뒤, `ImagePicker.launchImageLibraryAsync()`로 이미지 선택 화면을 연다.
- 대표 이미지는 최대 5장까지 유지하며, 이미 등록된 수량을 기준으로 남은 개수만큼 선택할 수 있도록 `selectionLimit`을 적용했다.
- 선택된 이미지는 로컬 URI를 `basicInfo.images`에 추가해 기존 썸네일 레일, 미니 프리뷰, 미리보기 화면에서 바로 보이게 했다.
- 권한 거부 시 `대표 이미지를 등록하려면 갤러리 접근 권한이 필요합니다.` 안내 모달을 표시한다.
- 검색 태그 입력창을 `tagDraft` 상태 기반 controlled input으로 바꿨다. Enter/Done으로 태그를 추가하면 `tagDraft`를 빈 문자열로 초기화해 바로 다음 태그를 입력할 수 있다.
- 기존 `AI 생성` 버튼은 사용자가 요청한 위치와 디자인 그대로 유지했고, 실제 AI 서버 호출 없이 mock 이미지 URI만 추가한다.
- 백엔드/API/서버 업로드/실제 AI 호출은 추가하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-image-picker-check` 통과 상태 확인.

[2026-04-30]: 양조장 펀딩 프로젝트 생성 목표 금액 입력 2열 폭 보정 완료.

[진행 내용]:
- 사용자가 펀딩 프로젝트 만들기의 `목표 금액 및 일정` 탭에서 `각 병당 얼마 (원)`와 `몇 병` 입력창이 너무 작고, `finish`처럼 화면 가로폭을 같은 크기로 채워야 한다고 요청했다.
- 작업 전 `judam.md`, 현재 `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`, `finish/src/app/pages/CreateProjectDetailPage.tsx`의 목표 금액 및 일정 구간을 비교했다.
- `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`에서 두 `Field`를 각각 `twoColItem`으로 감싸고 `flex: 1, minWidth: 0`을 적용했다.
- `twoCol`은 `finish`의 `grid grid-cols-2 gap-2`에 해당하도록 `flexDirection: row`, `gap: 8`, `alignItems: flex-start`를 유지한다.
- 병당 가격/판매 수량 입력 로직, 목표 금액 자동 계산, 수수료 안내, 날짜 안내, 제출 활성화 조건은 변경하지 않았다.
- `finish/` 직접 import, 백엔드/API/AI 호출은 추가하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-funding-grid-check` 통과 상태 확인.

[2026-04-30]: 양조장 펀딩 프로젝트 생성 대표 이미지 번호 드래그 순서 변경 완료.

[진행 내용]:
- 사용자가 펀딩 프로젝트 만들기 기본정보의 프로젝트 대표 이미지에서 1~5 번호 부분을 누르며 이동해 사진별 순서를 바꿀 수 있게 해달라고 요청했다.
- 작업 전 `judam.md`와 `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`의 대표 이미지 썸네일/번호 뱃지 구조를 확인했다.
- 대표 이미지 번호 뱃지를 `PanResponder` 기반 드래그 핸들로 바꿨다. 번호를 누른 채 좌우로 이동한 뒤 놓으면 이동 거리를 기준으로 목표 index를 계산해 이미지 배열 순서를 재배치한다.
- 이미지 순서 변경은 `basicInfo.images` 배열의 순서를 직접 바꾸는 프론트 상태 변경이며, 첫 번째 이미지가 기존처럼 대표 이미지, 미니 프리뷰, 미리보기 hero 이미지로 사용된다.
- 드래그 중에는 `ScrollView`의 가로 스크롤을 잠시 비활성화해 번호 드래그와 레일 스크롤 제스처가 충돌하지 않게 했다.
- 번호 뱃지는 최소 40px 터치 영역을 가지며, 드래그 중에는 검은 테두리와 활성 상태를 보여준다.
- 기존 이미지 추가, 갤러리 권한 요청, AI 생성 mock, 이미지 삭제, 최대 5장 제한, 검색 태그 입력 초기화 로직은 변경하지 않았다.
- `finish/` 직접 import, 백엔드/API/AI 호출, 서버 업로드는 추가하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-image-reorder-check` 통과 상태 확인.

[2026-04-30]: 양조장 펀딩 프로젝트 생성 맛 지표 UI finish range 스타일 보정 완료.

[진행 내용]:
- 사용자가 펀딩 프로젝트 만들기의 `맛 지표` 부분 디자인이 `finish`와 완전히 같았으면 좋겠고, `+`/`-` 버튼 디자인이 어색하다고 피드백했다.
- 작업 전 `judam.md`, 현재 `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`, `finish/src/app/pages/CreateProjectDetailPage.tsx`의 맛 지표 구간을 비교했다.
- 기존 `+`/`-` stepper 버튼을 제거하고, `finish`의 `input type="range"`에 가까운 커스텀 터치 슬라이더로 변경했다.
- 각 맛 지표는 라벨/설명 왼쪽, 퍼센트 오른쪽, 8px 회색 트랙, 검은 fill, 검은 thumb, 하단 `약함`/`강함` 텍스트 구조로 정리했다.
- 슬라이더 트랙은 터치 시작과 이동 이벤트를 받아 0~100 값을 계산한다. 사용자가 트랙을 누르거나 좌우로 문지르면 값이 바뀌고 기존 레이더 차트도 즉시 반영된다.
- 맛 지표 리스트 간격은 `finish`의 `space-y-5`에 맞춰 별도 `tasteControlList` 간격으로 정리했다.
- 기존 맛 지표 상태값, 레이더 차트 미리보기, 미리보기 화면의 맛 지표 표시, 제출 완료율 로직은 변경하지 않았다.
- `finish/` 직접 import, 백엔드/API/AI 호출은 추가하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-taste-slider-check` 통과 상태 확인.

[2026-04-30]: 양조장 펀딩 프로젝트 생성 맛 지표 슬라이더 드래그 깜빡임 수정 완료.

[진행 내용]:
- 사용자가 맛 지표 슬라이더를 클릭으로 바꾸는 것은 문제없지만, 드래그할 때 계속 깜빡거리며 0으로 돌아가는 현상이 반복된다고 피드백했다.
- 원인은 드래그 중 `locationX`가 슬라이더 전체가 아니라 thumb/fill 같은 내부 요소 기준으로 흔들릴 수 있는 구조로 판단했다.
- `TasteControl`의 값 계산을 절대 좌표 기반으로 변경했다. 슬라이더 터치 영역을 `measureInWindow`로 측정해 `trackLeft`와 `trackWidth`를 ref에 저장하고, 드래그 중에는 `event.nativeEvent.pageX - trackLeft`로 local X를 계산한다.
- `onResponderGrant` 시 최신 슬라이더 위치를 다시 측정한 뒤 값을 반영하고, `onResponderMove`는 같은 절대 좌표 기준을 계속 사용한다.
- `onResponderTerminationRequest={() => false}`를 추가해 드래그 도중 부모 스크롤/다른 responder로 터치가 쉽게 끊기지 않도록 했다.
- 기존 `finish` 기반 슬라이더 디자인, 라벨/퍼센트/약함/강함 표시, 레이더 차트 실시간 반영, 상태값 구조는 유지했다.
- `finish/` 직접 import, 백엔드/API/AI 호출은 추가하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-taste-slider-drag-fix-check` 통과 상태 확인.

[2026-04-30]: 양조장 펀딩 프로젝트 생성 날짜 입력 캘린더 선택 UI 추가 완료.

[진행 내용]:
- 사용자가 펀딩 프로젝트 만들기의 `펀딩 시작일`과 `예상 발송 시작일`에서 `finish`처럼 오른쪽 캘린더 아이콘을 누르면 캘린더로 날짜를 쉽게 선택할 수 있게 해달라고 요청했다.
- 작업 전 `judam.md`, 현재 `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`, `finish/src/app/pages/CreateProjectDetailPage.tsx`의 날짜 입력 구간을 비교했다.
- `DateField` 컴포넌트를 추가해 기존 날짜 TextInput 오른쪽에 `Calendar` 아이콘 버튼을 표시했다.
- `펀딩 시작일`과 `예상 발송 시작일`을 기존 `Field`에서 `DateField`로 교체했다. 직접 `YYYY-MM-DD` 입력은 유지하고, 캘린더 아이콘 클릭 시 날짜 선택 모달을 연다.
- `CalendarDateModal`을 추가했다. 모달은 제목, 월 이동 버튼, 요일 헤더, 날짜 grid, 선택 날짜 활성 표시, 취소 버튼으로 구성된다.
- 날짜를 누르면 해당 필드에 `YYYY-MM-DD` 형식으로 반영하고 모달을 닫는다.
- 기존 펀딩 종료일 자동 계산, 펀딩 시작일 과거 안내, 예상 발송 시작일 종료일 이후 안내, 완료율 계산, 제출 활성화 조건은 그대로 유지했다.
- `finish/` 직접 import, 백엔드/API/AI 호출, 추가 외부 date picker 패키지는 사용하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-date-calendar-check` 통과 상태 확인.

[2026-04-30]: 양조장 펀딩 프로젝트 생성 날짜 선택을 OS 네이티브 DateTimePicker로 교체 완료.

[진행 내용]:
- 사용자가 이전 커스텀 캘린더가 잘못된 캘린더처럼 보이며 실제 날짜가 반영된 캘린더를 가져올 수 있는지 피드백했다.
- `npx expo install @react-native-community/datetimepicker`로 Expo SDK 54 호환 버전인 `@react-native-community/datetimepicker 8.4.4`를 추가했다.
- `app.json` plugins에 `@react-native-community/datetimepicker`가 추가되었다.
- 직접 만든 `CalendarDateModal`과 수동 월/날짜 grid 계산 로직을 제거했다.
- `DateField`의 캘린더 아이콘 클릭은 `NativeDatePicker`를 열도록 변경했다.
- Android에서는 `DateTimePicker`의 `display="calendar"`를 사용해 OS 시스템 calendar dialog를 띄운다.
- iOS에서는 `display="inline"`과 `locale="ko-KR"`을 사용해 시스템 UIDatePicker 기반 inline 캘린더를 모달 안에 표시하고, `완료` 버튼으로 닫는다.
- 날짜 선택 시 기존과 동일하게 `YYYY-MM-DD` 형식으로 `fundingInfo.startDate` 또는 `fundingInfo.expectedDeliveryDate`에 반영한다.
- 기존 직접 입력, 펀딩 종료일 자동 계산, 시작일 과거 안내, 예상 발송 시작일 종료일 이후 안내, 제출 활성화 조건은 유지했다.
- `finish/` 직접 import, 백엔드/API/AI 호출은 추가하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-native-date-picker-check` 통과 상태 확인.

[2026-05-01]: 홈 인기 펀딩/인기 레시피를 기준 목록 인기순 데이터와 연결 완료.

[진행 내용]:
- 사용자가 홈에 임시로 적용한 인기 펀딩 3개와 인기 레시피 3개를 홈 전용 목록으로 두지 않고, 원래 기준 페이지인 `[펀딩]`과 `[주담]` 목록에 들어간 데이터로 통일해달라고 요청했다.
- 작업 전 `judam.md`, `src/features/home/screens/HomeScreen.tsx`, `src/features/recipe/screens/RecipeListScreen.tsx`, `src/features/funding/screens/FundingListScreen.tsx`, `src/constants/data.ts`를 확인했다.
- `src/constants/data.ts`의 `FundingProject`와 `Recipe`에 `popularRank`를 추가해 홈/주담/펀딩이 공유하는 인기순 기준을 명시했다.
- 홈에서만 덮어씌우던 `newpicutre/funding1.jpg`, `funding2.jpg`, `funding3.jpg`를 펀딩 mock 데이터의 `localImage`로 올렸다. `[펀딩]` 목록, 펀딩 상세, 후원하기 화면도 이 로컬 이미지를 우선 사용한다.
- 홈에서만 덮어씌우던 `newpicutre/recipe1.jpg`, `recipe2.jpg`, `recipe3.png`를 레시피 mock 데이터의 `image`로 올렸다. `[주담]` 목록과 레시피 상세도 같은 이미지를 사용한다.
- `getPopularFundingProjects`, `getPopularRecipes`, `sortFundingProjectsByPopularity`, `sortRecipesByPopularity`, `getImageSource`, `getFundingProjectImageSource` helper를 `src/constants/data.ts`에 추가해 인기순 정렬과 문자열 URL/로컬 asset 이미지 처리를 공용화했다.
- `src/features/home/screens/HomeScreen.tsx`는 더 이상 `fundingProjects.slice(0, 3)`와 `recipesData.slice(0, 3)` 및 홈 전용 이미지 배열을 쓰지 않고, 공용 인기순 helper에서 상위 3개를 가져온다.
- `src/features/recipe/screens/RecipeListScreen.tsx`의 `인기순`과 `내 추천순`은 `popularRank` 우선, 같은 기준이 없으면 좋아요 수 기준으로 정렬한다.
- `src/features/funding/screens/FundingListScreen.tsx`는 필터링 후 `popularRank` 우선, 같은 기준이 없으면 후원자 수 기준으로 정렬해 현재 홈 인기 펀딩 3개가 펀딩 목록 상단에도 나오게 했다.
- `src/features/recipe/screens/RecipeDetailScreen.tsx`는 클릭한 레시피 id에 맞춰 `recipesData`에서 제목, 작성자, 설명, 재료, 좋아요 수, 댓글 수, 이미지, 시간을 가져오도록 연결했다.
- `finish/` 직접 import, 백엔드/API/AI 호출, 의존성 변경은 추가하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 홈 성장 통계 카드 아이콘 원형 배경색 통일 완료.

[진행 내용]:
- 사용자가 홈 화면 `주담과 함께한 순간들` 영역에서 `진행중인 펀딩`과 `성공한 펀딩` 카드의 원형 아이콘 배경색을 위쪽 카드들과 같이 검정색으로 맞추고 싶다고 요청했다.
- 작업 전 `judam.md`를 리마인드하고 `src/features/home/screens/HomeScreen.tsx`의 통계 카드 색상 정의를 확인했다.
- `진행중인 펀딩` 카드의 아이콘 원형 배경색을 `#444`에서 `#111`로 변경했다.
- `성공한 펀딩` 카드의 아이콘 원형 배경색을 `#059669`에서 `#111`로 변경했다.
- 홈 화면 통계 숫자, 라벨, 아이콘, 카드 레이아웃, 다른 섹션 구조는 변경하지 않았다.
- `finish/` 직접 import, 백엔드/API/AI 호출, 의존성 변경은 추가하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 홈에서 주담/펀딩 탭 이동 시 목록 상단으로 스크롤되도록 수정 완료.

[진행 내용]:
- 사용자가 홈 화면의 `레시피 제안하러 가기`, 펀딩 `전체보기`, 레시피 `더보기` 버튼을 눌렀을 때 이전에 방문했던 주담/펀딩 페이지의 하단 스크롤 위치가 유지되는 문제를 제보했다.
- 작업 전 `judam.md`, `src/features/home/screens/HomeScreen.tsx`, `src/features/recipe/screens/RecipeListScreen.tsx`, `src/features/funding/screens/FundingListScreen.tsx`, `src/layouts/MainTabsLayout.tsx`를 확인했다.
- 이 문제는 백엔드 연결 없이 프론트 탭 화면의 스크롤 위치 보존 때문에 생기는 UI 상태 문제로 판단했다.
- `src/features/home/screens/HomeScreen.tsx`에 `pushTabToTop` 이동 함수를 추가해 홈의 세 버튼이 `/recipe` 또는 `/funding`으로 이동할 때 매번 새로운 `scrollToTop` route param을 함께 넘기도록 했다.
- `src/features/recipe/screens/RecipeListScreen.tsx`에 `ScrollView` ref, `useLocalSearchParams`, `useFocusEffect`를 추가해 홈에서 전달된 `scrollToTop` 값이 있을 때 화면 포커스 시 주담 목록을 y=0으로 이동하게 했다.
- `src/features/funding/screens/FundingListScreen.tsx`에도 같은 방식으로 `ScrollView` ref, `useLocalSearchParams`, `useFocusEffect`를 추가해 홈에서 펀딩 `전체보기`로 들어오면 펀딩 목록이 항상 상단에서 보이게 했다.
- 탭바 자체를 누르는 동작, 각 목록의 검색/필터/정렬/페이지 상태, 상세 이동, 데이터 구조, 백엔드/API/AI 연동은 변경하지 않았다.
- `finish/` 직접 import, 백엔드/API/AI 호출, 의존성 변경은 추가하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 홈 화면 최하단 통계 섹션 아래 여백 축소 완료.

[진행 내용]:
- 사용자가 홈 화면 맨 아래 `주담과 함께한 순간들` 통계 카드 하단과 하단 탭바 사이의 빈 여백이 너무 커서 현재의 절반 정도로 줄이고 싶다고 요청했다.
- 작업 전 `judam.md`를 리마인드하고 `src/features/home/screens/HomeScreen.tsx`의 `scrollContent`와 `statsSection` 스타일을 확인했다.
- 기존에는 `ScrollView`의 `contentContainerStyle`인 `scrollContent.paddingBottom: 40`과 `statsSection.paddingVertical: 60`의 하단 패딩이 함께 적용되어 마지막 통계 카드 아래 여백이 크게 보였다.
- 홈 화면 상단/중간 섹션 간격과 통계 섹션 위쪽 간격은 유지하면서 최하단 여백만 줄이기 위해 `scrollContent.paddingBottom`을 `40`에서 `20`으로 줄였다.
- `statsSection`은 `paddingVertical: 60` 대신 `paddingTop: 60`, `paddingBottom: 30`, `paddingHorizontal: 20`으로 분리해 통계 섹션 아래쪽 여백을 절반 수준으로 줄였다.
- 홈 화면 통계 카드 내용, 아이콘, 색상, 레이아웃, 데이터, 라우팅, 탭바 구조는 변경하지 않았다.
- `finish/` 직접 import, 백엔드/API/AI 호출, 의존성 변경은 추가하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 주담 레시피 목록 상단 버튼 높이 및 카드 목록 간격 정리 완료.

[진행 내용]:
- 사용자가 `[주담]` 페이지에서 `레시피 제안하기` 버튼의 세로 길이를 오른쪽 `인기순` 정렬 버튼과 동일하게 맞추고, 레시피 카드 제목을 한 줄 말줄임으로 표시하며, 카드 사이 간격을 조금 줄이고 싶다고 요청했다.
- 작업 전 `judam.md`, `src/features/recipe/screens/RecipeListScreen.tsx`, `src/components/recipe-card.tsx`를 확인했다.
- `src/features/recipe/screens/RecipeListScreen.tsx`에 `ACTION_CONTROL_HEIGHT = 40`을 추가해 `레시피 제안하기`, `로그인하고 제안하기`, 정렬 버튼이 같은 높이와 같은 원형 radius 기준을 쓰도록 정리했다.
- 주담 목록 상단 버튼 줄의 아래 간격을 `marginBottom: 24`에서 `18`로 줄여 검색/액션/목록 사이 흐름을 더 촘촘하게 조정했다.
- `src/components/recipe-card.tsx`의 레시피 제목을 `numberOfLines={1}`과 `ellipsizeMode="tail"`로 변경해 긴 제목이 2줄로 늘어나지 않고 한 줄 말줄임으로 보이게 했다.
- `RecipeCard` 자체의 `marginBottom: 12`를 제거하고, 부모 목록의 `gap`만으로 카드 사이 간격을 관리하도록 했다. 주담 목록의 `recipeList.gap`은 `16`에서 `12`로 줄였다.
- 레시피 카드의 이미지, 좋아요/댓글 동작, 상세 이동, 정렬/검색 로직, 데이터 구조는 변경하지 않았다.
- `finish/` 직접 import, 백엔드/API/AI 호출, 의존성 변경은 추가하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 주담 레시피 제안 작성 화면 신규 구조 반영 완료.

[진행 내용]:
- 사용자가 `[주담]` 페이지의 `레시피 제안하기` 버튼으로 진입하는 레시피 제안 작성 화면을 제시한 React 웹 코드와 같은 흐름으로 바꾸고 싶다고 요청했다.
- 작업 전 `judam.md`, `src/features/recipe/screens/RecipeCreateScreen.tsx`, 공용 `Button`, `Input` 컴포넌트, 현재 라우트 구조를 확인했다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`를 React Native/Expo 화면으로 전면 재구성했다.
- 상단은 뒤로가기 버튼, 가운데 `레시피 제안하기` 제목, 흰 배경/하단 border 헤더로 정리했다.
- 본문은 회색 배경 위에 흰 카드형 섹션들이 세로로 이어지는 구조로 변경했다.
- 입력 섹션은 레시피 제목, 메인 재료, 서브 재료 AI mock 생성, 도수 범위 선택, 지향하는 맛 AI mock 생성, 직접 맛 태그 입력/삭제, 프로젝트 컨셉, 프로젝트 요약 AI mock 생성, 이미지 업로드/AI mock 생성, 제출 버튼, 커뮤니티 가이드라인으로 구성했다.
- 서브 재료 AI 생성은 메인 재료가 비어 있으면 Alert로 안내하고, 입력되어 있으면 `딸기`, `바나나`, `복숭아`, `사과` 선택지를 보여주는 프론트 mock 흐름으로 구현했다.
- 지향하는 맛 AI 생성은 기존 웹 코드와 같이 태그 pool에서 4개를 무작위로 뽑아 선택할 수 있게 했다.
- 이미지 업로드는 기존 프로젝트에 설치된 `expo-image-picker`를 사용해 갤러리에서 이미지를 고를 수 있게 했고, AI 생성 버튼은 원격 시안 이미지 URL을 preview로 넣는 mock 동작으로 구현했다.
- 제출 시 제목이 비어 있으면 Alert로 안내하고, 제목이 있으면 완료 Alert 후 `/recipe` 목록으로 돌아가게 했다.
- 실제 AI 호출, 서버 API, DB 저장, 백엔드 연동, OpenAI/Gemini 호출은 추가하지 않았다. 모든 생성/업로드/제출 흐름은 프론트 mock/로컬 상태 중심이다.
- `finish/` 직접 import, 의존성 변경은 추가하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 주담 레시피 제안 화면 AI 생성 조건 및 선택 UI 보정 완료.

[진행 내용]:
- 사용자가 레시피 제안 화면의 서브 재료 추천 결과를 세로 리스트가 아니라 `도수 범위`와 같은 둥근 칩 선택 UI로 보여주고 싶다고 요청했다.
- 사용자가 도수 범위에 `1도 미만`, `1%~2%` 옵션을 추가하고 싶다고 요청했다.
- 사용자가 화면 동작 흐름을 설명했다. 메인 재료 입력 후 서브 재료의 `AI 생성`을 누르면 백엔드 추천 알고리즘 결과가 서브 재료 추천 리스트로 뜨고, `지향하는 맛`, `프로젝트 요약`, `이미지 업로드`의 AI 생성 버튼은 메인 재료와 서브 재료가 모두 입력/선택된 경우에만 작동해야 한다.
- 이 조건 제한은 현재 백엔드 없이도 프론트 상태 검증으로 구현할 수 있는 영역으로 판단했다. 다만 실제 백엔드 추천/AI 연동이 붙으면 백엔드에서도 같은 조건을 검증하는 것이 안전하다고 전제했다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`에서 서브 재료 AI mock 결과를 기존 세로 row 리스트 대신 `Chip` 컴포넌트를 재사용한 다중 선택 칩 UI로 변경했다.
- `ALCOHOL_RANGES` 앞쪽에 `1도 미만`, `1%~2%`를 추가했다.
- `hasMainIngredient`, `hasSubIngredient` 상태 파생값을 추가해 메인 재료 입력 여부와 서브 재료 선택 여부를 판단하게 했다.
- 서브 재료 `AI 생성`은 기존처럼 메인 재료가 있을 때만 mock 추천 결과를 표시한다.
- `지향하는 맛`, `프로젝트 요약`, `이미지 업로드`의 AI 생성 버튼은 메인 재료와 선택된 서브 재료가 모두 있을 때만 작동하고, 조건이 부족하면 Alert로 `메인 재료와 서브 재료를 먼저 입력해주세요.`라고 안내한다.
- 현재 추천 결과와 AI 생성 결과는 여전히 프론트 mock이며, 실제 AI 호출, 서버 API, DB 저장, 백엔드 연동, OpenAI/Gemini 호출은 추가하지 않았다.
- `finish/` 직접 import, 의존성 변경은 추가하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 주담 레시피 제안 화면 기본 Alert를 커스텀 모달 UI로 교체 완료.

[진행 내용]:
- 사용자가 레시피 제안 화면의 `메인 재료와 서브 재료를 먼저 입력해주세요.`, `메인 재료를 입력해야합니다.` 기본 Alert가 OS 기본 알림처럼 떠서, 기존 양조장 약관/안내 화면에서 쓰던 둥근 박스형 모달과 검정 확인 버튼 느낌으로 바꾸고 싶다고 요청했다.
- 작업 전 `judam.md`와 `src/features/recipe/screens/RecipeCreateScreen.tsx`를 확인했다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`에서 React Native 기본 `Alert.alert` 기반 안내를 화면 내부 `Modal` 기반 커스텀 `NoticeModal`로 교체했다.
- 커스텀 모달은 어두운 오버레이, 흰색 둥근 카드, 상단 제목/닫기 X, 선택 본문 영역, 하단 검정 `확인` 버튼 구조로 구현했다.
- `메인 재료를 입력해야합니다.` 문구는 사용자의 요청대로 `메인 재료를 입력해주세요.`로 수정했다.
- 메인/서브 재료 조건 부족, 레시피 제목 누락, 갤러리 권한 안내, 제출 완료 안내 모두 같은 커스텀 모달 스타일을 사용하도록 통일했다.
- 제출 완료 모달은 `확인`을 누르면 기존처럼 `/recipe` 목록으로 돌아가도록 유지했다.
- 실제 AI 호출, 서버 API, DB 저장, 백엔드 연동, OpenAI/Gemini 호출은 추가하지 않았다.
- `finish/` 직접 import, 의존성 변경은 추가하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 주담 레시피 제안 커스텀 알림 모달 세부 스타일 보정 완료.

[진행 내용]:
- 사용자가 `메인 재료를 입력해주세요.` 알림 모달에서 X 닫기 버튼을 없애고, 중간 검정색/구분선처럼 보이는 영역을 제거하며, `확인` 버튼의 세로 길이를 조금 줄이고 싶다고 요청했다.
- 작업 전 `judam.md`와 `src/features/recipe/screens/RecipeCreateScreen.tsx`의 `NoticeModal` 구현과 스타일을 확인했다.
- `NoticeModal`의 상단 X 닫기 버튼 렌더링을 제거했다.
- 알림 본문과 하단 버튼 영역 위에 있던 border 구분선을 제거해 박스 안이 더 단순하게 보이도록 했다.
- 본문이 없는 짧은 안내 문구에서도 박스 높이와 제목 위치가 어색하지 않도록 `noticeHeaderCompact` 스타일을 추가했다.
- `확인` 버튼 높이를 `56`에서 `48`로 줄였다.
- 알림 문구, 조건 검증 로직, 제출 완료 후 `/recipe` 이동 흐름, 실제 AI/백엔드 미연동 원칙은 변경하지 않았다.
- `finish/` 직접 import, 백엔드/API/AI 호출, 의존성 변경은 추가하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 주담 목록 정렬 버튼 폭 고정 완료.

[진행 내용]:
- 사용자가 `[주담]` 목록에서 `인기순`, `최신순`, `내 추천순` 선택값에 따라 정렬 버튼 UI의 가로 크기가 달라지는 문제를 제보했다.
- 작업 전 `judam.md`와 `src/features/recipe/screens/RecipeListScreen.tsx`의 정렬 버튼 스타일을 확인했다.
- 가장 긴 텍스트인 `내 추천순` 기준으로 정렬 버튼 폭을 고정하기 위해 `SORT_BUTTON_WIDTH = 104` 상수를 추가했다.
- `sortContainer`와 `sortBtn`에 같은 고정 폭을 적용하고, 버튼 내부 텍스트와 Chevron 아이콘을 가운데 정렬했다.
- 정렬 옵션 목록, 정렬 로직, 레시피 카드 UI, 검색/제안 버튼 동작은 변경하지 않았다.
- `finish/` 직접 import, 백엔드/API/AI 호출, 의존성 변경은 추가하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 주담 레시피 제안 작성 화면 상단바 높이 보정 완료.

[진행 내용]:
- 사용자가 레시피 제안 작성 화면의 상단바가 기존 화면들보다 너무 짧아 보인다고 피드백했다.
- 작업 전 `judam.md`, 공용 `src/components/PageHeader.tsx`, `src/features/recipe/screens/RecipeCreateScreen.tsx`의 헤더 구조를 확인했다.
- 원인은 `RecipeCreateScreen` 헤더가 `height: 56`으로 고정된 상태에서 `paddingTop: insets.top`을 함께 적용해 상태바 영역 때문에 실제 제목/뒤로가기 영역이 눌려 보이는 구조였다.
- `RecipeCreateScreen` 헤더 inline style에 `height: insets.top + 56`을 적용하고, 정적 `height: 56`은 제거했다.
- 뒤로가기 버튼, 제목, 본문 카드 구조, 레시피 작성 로직, AI mock 조건, 알림 모달 스타일은 변경하지 않았다.
- `finish/` 직접 import, 백엔드/API/AI 호출, 의존성 변경은 추가하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 커뮤니티 게시글 카드 높이 균일화 완료.

[진행 내용]:
- 사용자가 `[커뮤니티]` 목록도 주담 목록처럼 모든 목록 크기가 동일하고, 게시글 본문은 2줄 정도만 보인 뒤 나머지는 말줄임 처리되길 요청했다.
- 작업 전 `judam.md`와 `src/features/community/screens/CommunityScreen.tsx`를 확인했다.
- `src/features/community/screens/CommunityScreen.tsx`에서 게시글 본문 `Text`의 `numberOfLines`를 3에서 2로 줄이고 `ellipsizeMode="tail"`을 명시해 긴 글이 `...`으로 생략되도록 했다.
- `postContent` 스타일에 `height: 44`를 적용해 `lineHeight: 22` 기준 2줄 높이를 항상 확보하도록 했고, 짧은 게시글과 긴 게시글의 카드 높이가 동일하게 유지되도록 했다.
- 커뮤니티 검색, 카테고리 필터, 정렬, 좋아요, 댓글 수 표시, 페이지네이션, 작성 FAB, mock 데이터 구조는 변경하지 않았다.
- 백엔드/API/AI 연동, `finish/` 직접 import, 의존성 변경은 추가하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 커뮤니티 새 게시글 작성 화면 구조 개편 완료.

[진행 내용]:
- 사용자가 하단바 `[커뮤니티]` 페이지의 오른쪽 하단 검정 원형 작성 버튼으로 진입하는 게시글 작성 화면을 제시한 React 웹 코드와 같은 흐름으로 바꾸고 싶다고 요청했다.
- 작업 전 `judam.md`, `src/features/community/screens/CommunityCreateScreen.tsx`, `src/contexts/CommunityContext.tsx`, 공용 `Button` 컴포넌트를 확인했다.
- `src/features/community/screens/CommunityCreateScreen.tsx`를 React Native/Expo 화면에 맞게 재구성했다.
- 상단바 제목을 `새 게시글 작성`으로 변경하고, 상태바 높이를 포함한 `insets.top + 56` 구조로 맞췄다.
- 게시판 카테고리는 `자유`, `정보` 둥근 칩 선택 UI로 구성했다.
- 제목 입력 필드, 300px 이상 높이의 본문 입력 필드, 점선 테두리의 `사진 추가 (n/5)` 버튼, 검정색 `게시글 등록하기` 버튼, 커뮤니티 가이드라인 박스를 추가했다.
- 사진 추가는 이후 작업에서 `expo-image-picker` 기반 실제 갤러리 선택 흐름과 썸네일 미리보기로 교체되었다.
- 등록 시 본문이 비어 있으면 `게시글 내용을 입력해주세요.` Alert를 띄우고, 본문이 있으면 기존 `CommunityContext.addPost` 흐름으로 mock 게시글을 추가한 뒤 `/community`로 돌아가게 했다.
- 현재 `Post` 데이터 구조가 본문 중심이므로 제목 입력값은 화면 입력 상태로만 유지하고, 등록 데이터는 기존 구조와 호환되도록 `content`, `tags` 중심으로 보낸다.
- 커뮤니티 목록 화면, 하단 탭 레이아웃, 백엔드/API/AI 연동, `finish/` 직접 import, 의존성 변경은 추가하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 커뮤니티 게시글 작성 화면 알림 UI 커스텀 모달로 교체 완료.

[진행 내용]:
- 사용자가 커뮤니티 게시글 작성 화면에서 본문이 비어 있을 때 뜨는 기본 OS Alert를 앞서 주담 레시피 제안 화면에서 사용한 알림 박스 UI처럼 바꾸고 싶다고 요청했다.
- 작업 전 `judam.md`, `src/features/community/screens/CommunityCreateScreen.tsx`, `src/features/recipe/screens/RecipeCreateScreen.tsx`의 `NoticeModal` 구현을 확인했다.
- `src/features/community/screens/CommunityCreateScreen.tsx`에서 React Native 기본 `Alert.alert` 사용을 제거하고, 화면 내부 `Modal` 기반 `NoticeModal`을 추가했다.
- 알림 모달은 주담 화면과 같은 방향으로 어두운 오버레이, 둥근 흰 카드, 굵은 안내 문구, 검정색 `확인` 버튼, X 버튼과 구분선이 없는 구조로 구성했다.
- `게시글 내용을 입력해주세요.`, `최대 5개까지 업로드 가능합니다.`, `게시글이 등록되었습니다!` 안내가 모두 같은 커스텀 모달을 사용하도록 통일했다.
- 등록 완료 모달에서 `확인`을 누르면 기존처럼 `/community`로 돌아가도록 유지했다.
- 커뮤니티 작성 화면의 입력 구조, mock 게시글 등록 흐름, 사진 카운터, 커뮤니티 목록 화면, 하단 탭 레이아웃, 백엔드/API/AI 연동, `finish/` 직접 import, 의존성 변경은 추가하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 커뮤니티 게시글 작성 사진 추가 버튼을 실제 이미지 선택 흐름으로 교체 완료.

[진행 내용]:
- 사용자가 커뮤니티 게시글 작성 화면의 `사진 추가` 버튼이 카운트만 올라가는 것이 아니라 주담 레시피 제안 화면의 이미지 업로드처럼 실제 이미지 추가 기능을 실행해야 한다고 피드백했다.
- 작업 전 `judam.md`, `src/features/community/screens/CommunityCreateScreen.tsx`, `src/features/recipe/screens/RecipeCreateScreen.tsx`의 `expo-image-picker` 사용 흐름을 확인했다.
- `src/features/community/screens/CommunityCreateScreen.tsx`에서 기존 `imageCount` 숫자 상태를 `imageUris: string[]` 상태로 교체했다.
- `사진 추가` 버튼을 누르면 `expo-image-picker`의 갤러리 권한 요청 후 `launchImageLibraryAsync`를 실행하도록 변경했다.
- 이미지는 최대 5장까지 추가할 수 있고, 5장을 초과하면 기존 커스텀 알림 모달로 안내한다.
- 갤러리 권한이 없으면 `갤러리 접근 권한이 필요합니다.` 커스텀 알림 모달을 보여준다.
- 선택된 이미지는 버튼 아래에 88x88 썸네일 grid로 표시하고, 각 썸네일 우측 상단 X 버튼으로 개별 삭제할 수 있게 했다.
- 게시글 mock 등록 시 현재 `Post` 구조와 호환되도록 첫 번째 선택 이미지 URI를 `image` 필드에 담는다. 다중 이미지 전체 저장/업로드는 백엔드 연동 전까지 프론트 화면 상태로만 유지한다.
- 커뮤니티 목록 화면, 하단 탭 레이아웃, 백엔드/API/AI 연동, `finish/` 직접 import, 의존성 변경은 추가하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 커뮤니티 게시글 작성 사진 추가 카운트 표시 보정 완료.

[진행 내용]:
- 사용자가 `사진 추가` 버튼에서 처음에는 `0`이 보여야 하고, 사진이 추가될 때마다 카운트가 변해야 한다고 요청했다.
- 작업 전 `judam.md`와 `src/features/community/screens/CommunityCreateScreen.tsx`의 이미지 카운트 렌더링을 확인했다.
- `src/features/community/screens/CommunityCreateScreen.tsx`에서 버튼 내부에 직접 `{imageUris.length}`를 렌더링하던 구조를 `imageCountLabel = \`사진 추가 (${imageUris.length}/5)\`` 파생 문자열로 분리했다.
- 초기 상태에서는 `사진 추가 (0/5)`가 표시되고, 이미지 선택 후에는 `사진 추가 (1/5)`, `사진 추가 (2/5)`처럼 선택된 이미지 수가 명확히 표시된다.
- 이미지 선택, 썸네일 미리보기, 삭제, 최대 5장 제한, 등록 mock 흐름, 커스텀 알림 모달, 백엔드/API/AI 미연동 원칙은 변경하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 주담 레시피 제안 이미지 선택 시 크롭 단계 생략 완료.

[진행 내용]:
- 사용자가 이미지 선택 후 별도의 크롭/줄이기 화면이 뜨지 않고, 이미지를 선택하면 바로 등록되게 하고 싶다고 요청했다.
- 사용자는 이 변경을 `[주담]`의 레시피 제안 화면 이미지 등록에 적용해 달라고 명확히 요청했다.
- 작업 전 `judam.md`, `src/features/recipe/screens/RecipeCreateScreen.tsx`, `src/features/community/screens/CommunityCreateScreen.tsx`의 `expo-image-picker` 사용 부분을 확인했다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`의 `ImagePicker.launchImageLibraryAsync` 옵션에서 `allowsEditing: true`를 `allowsEditing: false`로 변경했다.
- 이제 주담 레시피 제안 화면에서 이미지를 선택하면 OS 크롭/편집 화면을 거치지 않고 바로 `imagePreview`에 선택 이미지 URI가 들어가 미리보기로 표시된다.
- 이후 작업에서 커뮤니티 게시글 작성 화면도 같은 방식으로 `allowsEditing: false`를 적용해 크롭 단계를 생략하도록 맞췄다.
- 이미지 업로드 UI, AI mock 이미지 생성, 이미지 삭제, 레시피 제출 흐름, 백엔드/API/AI 미연동 원칙은 변경하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 주담 레시피 제안 제출 필수항목 검증 문구 및 조건 보정 완료.

[진행 내용]:
- 사용자가 `[주담]` 레시피 제안하기 페이지에서 항목을 다 입력하지 않고 `레시피 제안하기` 버튼을 누르면 뜨는 문구를 `필수항목을 모두 입력해 주세요.`로 바꾸고 싶다고 요청했다.
- 사용자는 필수항목이 `*` 표시가 붙어 있는 `레시피 제목`과 `메인 재료`라고 명확히 설명했다.
- 작업 전 `judam.md`와 `src/features/recipe/screens/RecipeCreateScreen.tsx`의 제출 검증 로직, `hasMainIngredient`, 필수 라벨을 확인했다.
- 기존 제출 검증은 `title`만 확인해 `레시피 제목을 입력해주세요.`를 띄우고 있었다.
- `handleSubmit`에서 `!title.trim() || !hasMainIngredient` 조건으로 필수항목을 검사하도록 변경했다.
- 제목 또는 메인 재료 중 하나라도 비어 있으면 커스텀 알림 모달에 `필수항목을 모두 입력해 주세요.`가 표시된다.
- 서브 재료 AI 생성 시 메인 재료가 없을 때의 별도 안내, AI mock 조건, 이미지 업로드, 제출 성공 후 `/recipe` 이동 흐름, 백엔드/API/AI 미연동 원칙은 변경하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 커뮤니티 게시글 작성 이미지 선택 시 크롭 단계 생략 완료.

[진행 내용]:
- 사용자가 커뮤니티의 `사진 추가` 기능은 아직 이미지를 고른 뒤 크롭 화면이 뜬다고 제보했다.
- 작업 전 `judam.md`, `src/features/community/screens/CommunityCreateScreen.tsx`, `src/features/recipe/screens/RecipeCreateScreen.tsx`의 `ImagePicker.launchImageLibraryAsync` 옵션을 확인했다.
- `src/features/community/screens/CommunityCreateScreen.tsx`에는 아직 `allowsEditing: true`가 남아 있어 OS 이미지 편집/크롭 화면이 뜨고 있었다.
- 커뮤니티 게시글 작성 화면의 이미지 선택 옵션을 `allowsEditing: false`로 변경했다.
- 이제 커뮤니티 `사진 추가`에서 이미지를 선택하면 크롭/편집 화면 없이 바로 작성 화면으로 돌아와 썸네일에 추가된다.
- 이미지 선택, 썸네일 미리보기, 개별 삭제, 최대 5장 제한, mock 등록 시 첫 번째 이미지 URI를 `image` 필드에 담는 흐름, 백엔드/API/AI 미연동 원칙은 유지했다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 커뮤니티 게시글 작성 제목/내용 필수 입력 검증 완료.

[진행 내용]:
- 사용자가 커뮤니티 게시글 작성 화면도 제목과 내용이 모두 작성되어야 등록할 수 있게 해 달라고 요청했다.
- 작업 전 `judam.md`와 `src/features/community/screens/CommunityCreateScreen.tsx`의 `handleSubmit` 검증 로직을 확인했다.
- 기존에는 `content`만 비어 있는지 검사해 본문만 입력하면 게시글이 등록될 수 있었다.
- `handleSubmit` 검증 조건을 `!title.trim() || !content.trim()`으로 변경해 제목과 내용 중 하나라도 비어 있으면 등록을 막도록 했다.
- 필수 입력이 부족할 때는 기존 커스텀 알림 모달로 `제목과 내용을 모두 입력해주세요.`를 표시한다.
- 게시글 mock 등록 데이터 구조, 이미지 선택/미리보기/삭제, 최대 5장 제한, 등록 완료 후 `/community` 이동, 백엔드/API/AI 미연동 원칙은 변경하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 주담 레시피 상세 화면 상단바 높이 및 제목 표시 보정 완료.

[진행 내용]:
- 사용자가 각각의 레시피 상세 페이지에 들어갔을 때 상단바 크기를 기존 다른 화면의 상단바 크기에 맞추고, `레시피 상세` 문구를 지우고 싶다고 요청했다.
- 작업 전 `judam.md`, `src/features/recipe/screens/RecipeDetailScreen.tsx`, 공용 `src/components/PageHeader.tsx`의 헤더 높이 패턴을 확인했다.
- 기존 `RecipeDetailScreen` 헤더는 정적 `height: 60`에 `paddingTop: insets.top + 10`을 더하는 구조라 상태바 영역과 본문 헤더 영역이 기존 화면과 다르게 보일 수 있었다.
- `RecipeDetailScreen` 헤더 inline style을 `height: insets.top + 56`, `paddingTop: insets.top` 구조로 바꿔 기존 화면들과 같은 상단바 높이 기준에 맞췄다.
- 가운데 `레시피 상세` 텍스트 렌더링을 제거하고, 뒤로가기 버튼과 우측 균형용 빈 영역만 남겼다.
- 레시피 이미지, 상세 내용, 좋아요, 댓글, 양조장 프로젝트 제안 이동, 데이터 연결, 백엔드/API/AI 미연동 원칙은 변경하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태 확인.

[2026-05-01]: 커뮤니티 게시글 상세 화면 및 목록 클릭 이동 연결 완료.

[진행 내용]:
- 사용자가 커뮤니티의 각 게시글을 눌렀을 때 상세페이지로 이동하는 구조를 요청했다.
- 작업 전 `judam.md`, `src/features/community/screens/CommunityScreen.tsx`, `app/community` 라우트 구조를 확인했다.
- `src/features/community/screens/CommunityScreen.tsx`의 게시글 카드 래퍼를 터치 가능한 `AnimatedTouchable` 구조로 변경해 목록 카드 클릭 시 `/community/{id}`로 이동하도록 연결했다.
- `src/features/community/screens/CommunityDetailScreen.tsx`를 추가해 게시글 상세 화면을 구현했다.
- 상세 화면에는 기존 화면들과 맞춘 상단바, 뒤로가기, 더보기 메뉴, 작성자/양조장 배지, 시간/카테고리, 좋아요 버튼, 본문, 이미지, 댓글 목록, 댓글 더보기, 하단 댓글 입력 영역을 포함했다.
- 현재는 백엔드/API 없이 mock 게시글과 mock 댓글 데이터로만 동작하며, 로그인하지 않은 사용자는 댓글 입력 영역에서 로그인 화면으로 이동하도록 처리했다.
- `app/community/[id].tsx` 라우트를 추가해 Expo Router에서 상세 화면을 직접 열 수 있게 했다.
- `finish/` 직접 import, 백엔드 API, AI 서버 로직, 신규 외부 의존성은 추가하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태를 확인했다.

[2026-05-01]: `finish/`와 `second/` Figma Make 참고 폴더 차이 숙지 완료.

[진행 내용]:
- 사용자가 기존 Figma Make 참고 폴더인 `finish/`를 기반으로 추가 보완한 파일이 `second/`라고 설명했고, 두 참고 폴더의 모든 차이를 찾아 숙지해달라고 요청했다.
- 작업 전 `judam.md`를 다시 리마인드하고, 실제 파일 기준으로 `finish/`와 `second/`를 비교했다.
- `second/`는 현재 git 기준 untracked 참고 폴더이며 앱 코드와 직접 연결되어 있지 않다.
- `finish/`와 `second/`의 `package.json`, 주요 CSS/theme 파일, public 이미지, assets는 동일하다. `second/src/styles/globals.css`는 새로 추가됐지만 빈 파일이다.
- 파일 단위 차이는 총 28개이며, `second` 기준 3749 insertions, 1276 deletions 정도의 Figma Make 보강이 있다.
- `second`에서 새로 추가된 파일은 `src/app/components/ErrorBoundary.tsx`, `src/app/components/JournalStageSection.tsx`, `src/app/data/terms.ts`, `src/app/pages/BreweryJournalManagePage.tsx`, `src/app/utils/validation.ts`, `src/styles/globals.css`다.
- `second`에서 삭제된 페이지/컴포넌트는 없고, 기존 페이지 중 `App.tsx`, `routes.tsx`, `AuthContext.tsx`, `FundingContext.tsx`, `fundingData.ts`, `BreweryDashboardPage.tsx`, `BreweryVerificationPage.tsx`, `CommunityPage.tsx`, `CreatePostPage.tsx`, `CreateProjectDetailPage.tsx`, `FundingDetailPage.tsx`, `FundingListPage.tsx`, `FundingReviewWritePage.tsx`, `FundingSupportPage.tsx`, `HomePage.tsx`, `LoginPage.tsx`, `OnboardingPage.tsx`, `RecipeCreationPage.tsx`, `RecipePage.tsx`, `SettingsPage.tsx`, `SignupPage.tsx`, `UserTypeSelectionPage.tsx`가 변경됐다.
- `second/src/app/App.tsx`는 전체 Provider 트리를 `ErrorBoundary`로 감싸는 구조가 추가됐다.
- `second/src/app/routes.tsx`는 로그인 보호가 강화됐다. `recipe/create`, `community/post/create`, `funding/:id/support`, `archive/add`, `archive/review/:fundingId`, `archive/:id/edit`에 `ProtectedRoute`가 적용됐고, 인증 양조장 전용 `brewery/project/:id/journal` 라우트가 추가됐다.
- `second/src/app/contexts/AuthContext.tsx`는 `breweryLocationDetail` 필드를 사용자/양조장 인증 데이터에 추가했다.
- `second/src/app/contexts/FundingContext.tsx`는 펀딩 프로젝트를 정적 배열로만 보지 않고 `projects` state로 관리한다. 추가된 기능은 `addProject`, `updateProjectJournals`, `updateProjectStatus`, `updateProjectFunding`이며, 후원 금액 반영과 목표 달성 시 상태 자동 변경 흐름이 들어갔다.
- `second/src/app/data/fundingData.ts`는 프로젝트 타입이 크게 확장됐다. 추가된 기준은 `ProjectStatus`, `TasteProfile`, `BudgetItem`, `ScheduleItem`, `BrewingStage`, `JournalEntry`, `JournalComment`, `JournalReply`, `BREWING_STAGES`, `journals`, 예산/일정/맛지표/법적 고시/양조장 프로필/펀딩 날짜/제품 상세 필드다.
- `second/src/app/components/JournalStageSection.tsx`는 펀딩 상세의 양조일지 탭에서 단계별 일지를 보여주는 공용 웹 컴포넌트다. 단계별 일지 목록, 더보기, 이미지/영상 표시, 일지 좋아요, 댓글, 대댓글 입력/좋아요를 포함한다.
- `second/src/app/pages/BreweryJournalManagePage.tsx`는 양조장이 자신의 프로젝트 양조일지를 단계별로 작성/수정/삭제하는 신규 화면이다. 5단계 선택, 일지 작성 모달, 이미지 파일 DataURL 추가, 동영상 URL 입력, `FundingContext.updateProjectJournals` 저장 흐름이 있다.
- `second/src/app/pages/BreweryDashboardPage.tsx`는 기존 mock 펀딩 목록 대신 `FundingContext.projects`에서 현재 양조장 프로젝트를 가져와 통계/목록을 만든다. 프로젝트 상태 변경 bottom sheet가 추가됐고, 상태는 `작성 중`, `심사 중`, `심사 반려`, `펀딩 예정`, `진행 중`, `목표 달성`, `펀딩 성공`, `펀딩 실패`, `제작 중`, `배송 중`, `완료`를 사용한다.
- `second/src/app/pages/BreweryVerificationPage.tsx`는 사업자번호 자동 포맷, 사업자등록번호 형식 검증, 파일 크기/형식 검증, 상세 주소 필드, mock 주소 검색 전체화면 모달, 이미 인증된 양조장의 edit 모드 분기를 추가했다. 인증 성공 후 신규 인증은 양조장 대시보드로 이동하고, 수정 모드는 이전 화면으로 돌아간다.
- `second/src/app/pages/CreateProjectDetailPage.tsx`는 제출 시 `FundingContext.addProject`로 실제 mock 프로젝트 목록에 새 프로젝트를 추가한다. 입력값을 `FundingProject` 구조로 매핑하고, 제출 후 임시저장을 삭제한다. 날짜 검증은 모달 강제 차단이 아니라 펀딩 시작일 과거 안내와 예상 발송 시작일 안내 문구 방식이다. 주소 검색 모달, AI 사진 생성 버튼, 이미지 drag reorder, 임시저장 localStorage 흐름이 있다.
- `second/src/app/pages/FundingListPage.tsx`와 `HomePage.tsx`는 하드코딩 펀딩 배열 대신 `FundingContext.projects`를 기준으로 표시한다. 하트 클릭은 비로그인 시 로그인으로 보내도록 강화됐다.
- `second/src/app/pages/FundingDetailPage.tsx`는 상세 mock 데이터를 파일 내부에서 제거하고 `FundingContext.projects`를 사용한다. `tab` URL query로 소개/양조일지/Q&A/후기 탭을 동기화하고, 프로젝트 소유 양조장에게 `양조일지 관리` 버튼을 표시한다. 양조일지 탭은 `BREWING_STAGES`와 `JournalStageSection` 기반으로 바뀌었고, 일지 좋아요/댓글/대댓글은 `updateProjectJournals`로 반영한다. 공유/신고 모달과 로그인 필요 모달이 추가됐다.
- `second/src/app/pages/FundingSupportPage.tsx`는 기존 `rewardData` 하드코딩 대신 `FundingContext.projects`를 사용한다. 로그인 사용자 정보 자동 입력, 본인 프로젝트 후원 차단, 종료 프로젝트 후원 차단, 수량 선택, 추가 후원금 quick 버튼, 최근 배송지 localStorage, 전화/이메일 검증, 카드 할부, 계좌이체 입금자명, 주문 localStorage 저장, `addParticipation`, `updateProjectFunding` 흐름이 들어갔다.
- `second/src/app/pages/FundingReviewWritePage.tsx`는 후원 참여자만 후기 작성 가능하도록 `FundingContext.participatedFundings` 확인 게이트를 추가했다.
- `second/src/app/pages/LoginPage.tsx`는 이메일/비밀번호 inline 검증, 로그인 유지 이메일 저장, toast 안내, 중복 제출 방지, 양조장 인증 여부에 따른 인증/대시보드 이동 의도를 추가했다.
- `second/src/app/pages/SignupPage.tsx`는 이메일/닉네임 중복확인, 비밀번호 강도 표시, 비밀번호 실시간 일치 표시, 연락처 자동 하이픈, PASS 본인인증 mock, 약관 상세 bottom sheet, `terms.ts` 약관 데이터 사용으로 크게 보강됐다.
- `second/src/app/pages/UserTypeSelectionPage.tsx`는 사용자 유형 선택 시 `AuthContext.updateUser`로 `type`을 갱신하고, 일반 사용자는 `/home`, 양조장은 `/brewery/verify`로 이동한다. 뒤로가기 버튼도 추가됐다.
- `second/src/app/pages/CommunityPage.tsx`, `RecipePage.tsx`는 좋아요 클릭 시 비로그인이면 로그인으로 보내는 방어가 추가됐다.
- `second/src/app/pages/CreatePostPage.tsx`는 `CommunityContext.addPost`로 새 mock 게시글을 실제 목록 상태에 추가하고 Alert 대신 toast를 쓴다.
- `second/src/app/pages/RecipeCreationPage.tsx`는 제출 Alert를 toast로 교체했다.
- `second/src/app/pages/OnboardingPage.tsx`는 `ImageWithFallback`, 접근성 role/aria, 로고 alt 개선 등 접근성 보강이 있다.
- `second/src/app/pages/SettingsPage.tsx`는 `온보딩 다시 보기` 앱 설정 항목을 추가해 `judam_onboarded` localStorage를 제거하고 `/onboarding`으로 이동할 수 있게 했다.
- `second/src/app/utils/validation.ts`는 이메일, 휴대폰, 사업자등록번호 검증과 연락처 자동 하이픈 포맷 유틸을 제공한다.
- `second`는 기능 기준으로 `finish`보다 최신 참고 파일이다. 앞으로 Figma Make 기반 UI를 맞출 때는 `finish`만 보지 말고 `second`를 함께 보고, 기능/상태/문구 기준은 `second`를 우선 검토한다.
- 단, `second`는 웹 Figma Make 코드라 React Native 앱에 그대로 복사하면 안 된다. 특히 현재 앱 규칙상 생성 코드에는 주석을 넣지 않고, `finish/second`를 직접 import하지 않는다.
- `second`에서 이식 전 주의할 부분도 확인했다. `FundingSupportPage.tsx`는 `project.deliveryDate`를 참조하지만 `FundingProject`에는 `estimatedDelivery`가 있으므로 이식 시 수정이 필요하다.
- `second`의 일부 목록/카드/통계는 새 상태값 `펀딩 성공`, `펀딩 실패`를 도입했지만 아직 예전 `"성공"`, `"실패"` 비교가 `HomePage`, `FundedProjectsPage`, `FundingDetailPage`, `FundingListPage`에 남아 있다. 이식 시 상태값을 통일해야 한다.
- `second/src/app/pages/FundingReviewWritePage.tsx`는 `participatedFundings.some((f) => f.id === projectId)`를 사용하지만 context 타입은 `fundingId`이므로 이식 시 `f.fundingId` 기준으로 수정해야 한다.
- `second` 일부 파일에는 `alert`, `window.confirm`, `console.log`가 남아 있다. 앱으로 옮길 때는 현재 React Native 커스텀 모달/toast 흐름과 프로젝트 규칙에 맞춰 정리한다.
- `finish/`와 `second/`의 자체 `npm run build`는 두 폴더에 `node_modules`/Vite 실행 파일이 없어 `sh: vite: command not found`로 실행되지 않았다. 참고 폴더의 의존성을 설치하지 않았기 때문이며, 앱 코드 검증 결과가 아니다.
- 이번 작업은 참고 폴더 비교와 `judam.md` 업데이트만 진행했다. 앱 코드, package, 라우트, asset 연결은 변경하지 않았다.

[2026-05-01]: `second` 기준 전환, `finish` 제거, 펀딩/양조장 상태 흐름 1차 이식 완료.

[진행 내용]:
- 사용자가 기존 `finish` 기준을 없애고 보강된 `second` Figma Make 산출물 기반으로 앱을 더 구체화하겠다고 했고, 이전에 제안한 순차 작업을 정확히 진행해달라고 요청했다.
- 작업 전 `judam.md`, 현재 `app/`, `src/`, `package.json`, `tsconfig.json`, `metro.config.js`, `second/src/app/contexts/FundingContext.tsx`, `second/src/app/data/fundingData.ts`, `second/src/app/pages/BreweryJournalManagePage.tsx`를 확인했다.
- 앱 코드에서 `finish/` 또는 `second/`를 직접 import하는 부분은 없음을 확인했다. 참고 폴더는 직접 의존하지 않고 React Native 앱 구조에 맞게 이식하는 기준으로만 사용한다.
- 기존 `finish/` 폴더를 삭제했다. 현재 최신 Figma Make 참고 폴더는 `second/`이며, `tsconfig.json` exclude도 `finish`에서 `second`로 변경했다.
- `src/constants/data.ts`를 `second` 기준으로 확장했다. `ProjectStatus`, `TasteProfile`, `BudgetItem`, `ScheduleItem`, `BrewingStage`, `BREWING_STAGES`, `JournalEntry`, `JournalComment`, `JournalReply` 타입과 상태 helper를 추가했다.
- 기존 완료 프로젝트 상태 `"성공"`을 `"펀딩 성공"`으로 통일했고, `targetQuantity`, `journals` 등 `second` 기반 필드를 추가했다.
- `src/contexts/FundingContext.tsx`를 정적 read-only 목록이 아니라 `projects` state 기반으로 바꿨다. `addProject`, `updateProjectJournals`, `updateProjectStatus`, `updateProjectFunding`을 추가했다.
- `src/features/funding/screens/FundingListScreen.tsx`는 `FundingContext.projects`를 기준으로 목록/검색/필터/통계를 표시한다. 상태 비교는 `"성공"` 문자열이 아니라 `isSupportableFundingStatus`, `isCompletedFundingStatus` helper를 사용한다.
- `src/features/funding/screens/FundingDetailScreen.tsx`는 `FundingContext.projects`를 기준으로 상세 데이터를 읽는다. 양조일지 탭은 `BREWING_STAGES`와 프로젝트별 `journals`를 사용하고, 본인 양조장 프로젝트에는 `양조일지 관리하기` 버튼을 표시한다.
- `src/features/funding/screens/FundingSupportScreen.tsx`는 정적 배열 대신 `FundingContext.projects`를 사용하고, mock 결제 완료 시 `addParticipation`과 `updateProjectFunding`을 함께 호출해 후원 금액과 후원자 수가 로컬 상태에 반영되게 했다.
- `src/features/home/screens/HomeScreen.tsx`는 홈 인기 펀딩과 펀딩 통계를 `FundingContext.projects` 기준으로 표시한다.
- `src/features/brewery/screens/BreweryDashboardScreen.tsx`는 현재 양조장 이름과 일치하는 프로젝트를 `FundingContext.projects`에서 가져와 내 펀딩 현황, 통계, 양조일지 관리 이동을 표시한다.
- `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`는 제출 성공 시 `FundingContext.addProject`로 `심사 중` 상태의 새 mock 프로젝트를 추가한다. 백엔드/API/AI 호출 없이 프론트 로컬 상태만 갱신한다.
- `app/brewery/project/[id]/journal.tsx`와 `src/features/brewery/project/screens/BreweryJournalManageScreen.tsx`를 추가했다. 양조장 본인 프로젝트의 5단계 양조일지를 작성/수정/삭제하고, 갤러리 이미지 선택을 통해 최대 5장까지 첨부할 수 있다.
- `src/contexts/AuthContext.tsx`에 `breweryLocationDetail`을 추가했고, mock 양조장 로그인에는 `businessNumber`, `breweryLocationDetail`도 채운다.
- `src/utils/validation.ts`를 추가해 이메일, 휴대폰, 사업자등록번호 검증 및 전화번호/사업자번호 포맷을 공용화했다.
- `src/features/auth/screens/LoginScreen.tsx`는 이메일 형식 검증, 이메일 기억하기, 양조장 mock 계정 감지 후 `/brewery/dashboard` 이동, 커스텀 알림 모달을 추가했다.
- `src/features/auth/screens/SignupScreen.tsx`는 닉네임 중복 확인, 이메일 검증 유틸, 전화번호 자동 하이픈, 휴대폰 형식 검증, 비밀번호 8자 이상 검증을 추가했다.
- `src/features/auth/screens/UserTypeSelectionScreen.tsx`는 2026-05-02 후속 사용자 요청 기준으로 양조장 선택 시 계정 타입을 먼저 바꾸지 않고 `/brewery/verification`으로 이동한다. 양조장 권한은 인증 완료 후 `verifyBrewery`에서만 부여된다.
- `src/features/brewery/screens/BreweryVerificationScreen.tsx`는 사업자번호/전화번호 자동 포맷, 형식 검증, 상세 주소 필드를 추가했고 `verifyBrewery`에 상세 주소를 저장한다.
- 백엔드/API/AI 서버 연동, 결제 서버, 실제 파일 업로드 서버, 실제 AI 이미지 생성은 추가하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과 상태를 확인했다.

[2026-05-02]: 온보딩/로그인/회원가입/유저선택/양조장 인증 `second` 기준 재정렬 완료.

[진행 내용]:
- 사용자가 `second/`가 많이 리뉴얼되었으니 온보딩, 로그인, 회원가입, 유저선택, 양조장 인증을 현재까지 요청/추가된 구현은 유지한 채 `second` 기반으로 다시 맞춰달라고 요청했다.
- 작업 전 `judam.md`를 리마인드하고, 현재 `src/features/onboarding/screens/OnboardingScreen.tsx`, `src/features/auth/screens/LoginScreen.tsx`, `SignupScreen.tsx`, `UserTypeSelectionScreen.tsx`, `src/features/brewery/screens/BreweryVerificationScreen.tsx`와 `second/src/app/pages/OnboardingPage.tsx`, `LoginPage.tsx`, `SignupPage.tsx`, `UserTypeSelectionPage.tsx`, `BreweryVerificationPage.tsx`, `second/src/app/data/terms.ts`를 비교했다.
- `src/features/onboarding/screens/OnboardingScreen.tsx`에 React Native `PanResponder` 기반 좌우 스와이프를 추가하고, 하단 페이지 dot을 누르면 해당 슬라이드로 이동하도록 보강했다.
- 온보딩의 기존 로컬 이미지 `newpicutre/picure3.jpg`, `desk.jpg`, `picture2.jpg`, `picture1.jpg`, `contain` 표시 프레임, CTA 문구와 로그인/회원가입/비회원 라우팅은 유지했다.
- `src/features/auth/screens/LoginScreen.tsx`에 이메일/비밀번호 inline 오류 표시를 추가했다. 이메일 형식 오류와 비밀번호 6자 미만 오류는 입력칸 아래 빨간 문구로 안내한다.
- 로그인 옵션 문구를 `second` 기준에 맞춰 `이메일 기억하기`에서 `로그인 유지`로 바꾸고, 기존 `judam_remember_email` 로컬 저장 흐름은 유지했다.
- 로그인 후 양조장 계정은 저장된 사용자 정보의 `isBreweryVerified`가 false면 `/brewery/verification`, 그 외에는 `/brewery/dashboard`로 이동하도록 분기했다. 일반 사용자는 기존처럼 `/(tabs)`로 이동한다.
- `src/features/auth/screens/SignupScreen.tsx`를 `second` 기준으로 크게 재정렬했다. 로컬 배경 이미지와 draggable bottom sheet는 유지하되, 닉네임 2~12자/특수문자 금지/`admin` 중복 mock, 이메일 형식/`test@test.com` 중복 mock, 비밀번호 강도 3단계, 비밀번호 일치/불일치 문구를 추가했다.
- 회원가입 연락처 인증은 기존 SMS 코드 입력 UI에서 `second`의 PASS 본인인증 mock 흐름으로 변경했다. 실제 PASS SDK나 서버 연동은 없고, 전화번호 형식 검증 후 짧은 대기 뒤 인증 완료된다.
- 회원가입 약관은 `second/src/app/data/terms.ts`의 주요 내용을 React Native 파일 내부 상수로 옮겨 서비스 이용약관/개인정보 처리방침 bottom sheet 모달에서 볼 수 있게 했다. `second/`를 직접 import하지 않는다.
- 회원가입의 기본 Alert는 커스텀 알림 모달로 교체했다. 카카오 회원가입, 중복확인 결과, PASS 인증 안내, 제출 검증 실패가 같은 알림 UI를 사용한다.
- `src/features/auth/screens/UserTypeSelectionScreen.tsx`에 `second` 기준 뒤로가기 버튼을 추가했다. 일반 사용자 선택 시 사용자가 이전에 요청한 “마이페이지에서 양조장 인증 시 전환 가능” 안내 문구는 유지했다.
- `src/features/brewery/screens/BreweryVerificationScreen.tsx`에 `second` 기준 mock 주소 검색 모달을 추가했다. 우편번호, 도로명, 지번 주소를 검색하고 선택하면 양조장 위치에 `[우편번호] 도로명주소` 형식으로 반영된다.
- 양조장 인증 신규 완료 후 이동 경로를 당시에는 `/(tabs)`에서 `/brewery/dashboard`로 바꿨으나, 2026-05-02 후속 사용자 요청으로 현재는 다시 `/(tabs)` 홈 화면으로 이동한다. 사업자등록증 업로드, 사업자번호/전화번호 포맷, SMS 테스트 코드 `1234`, 상세 주소 필드는 유지한다.
- 백엔드/API/AI 서버, 실제 PASS 본인인증, 실제 주소 API, 실제 문서 업로드 서버, 신규 외부 의존성은 추가하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과 상태를 확인했다.

[2026-05-02]: 양조장 회원가입 후 첫 화면 홈 진입으로 변경 완료.

[진행 내용]:
- 이 항목은 당시 사용자 요청을 반영한 이전 기준이며, 2026-05-02 후속 요청으로 현재는 “양조장 선택 즉시 인증 화면 진입, 인증 완료 후 양조장 권한 부여” 흐름으로 다시 변경됐다.
- 사용자가 양조장으로 회원가입해도 첫 화면은 홈이 뜨게 해달라고 요청했다.
- 작업 전 `judam.md`와 `src/features/auth/screens/UserTypeSelectionScreen.tsx`, 인증 관련 라우팅 참조를 확인했다.
- `src/features/auth/screens/UserTypeSelectionScreen.tsx`의 양조장 선택 완료 흐름을 `/brewery/verification` 직접 이동에서 `/(tabs)` 홈 이동으로 변경했다.
- 양조장 선택 시 계정 상태는 기존처럼 `type: 'brewery'`, `isBreweryVerified: false`로 저장한다. 따라서 사용자는 홈을 먼저 볼 수 있고, 프로젝트 등록/양조장 대시보드 등 인증이 필요한 기능을 누르면 기존 인증 안내 흐름으로 이어진다.
- CTA 문구를 `양조장 인증하러 가기`에서 `양조장으로 시작`으로 바꾸고, 홈을 먼저 둘러본 뒤 프로젝트 등록 전 인증할 수 있다는 안내 문구를 추가했다.
- 로그인 화면의 양조장 계정 로그인 분기, 양조장 인증 화면, 백엔드/API/AI 미연동 원칙은 변경하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과 상태를 확인했다.

[2026-05-02]: 비회원 읽기 전용 모드 전역 적용 완료.

[진행 내용]:
- 사용자가 비회원으로 둘러볼 때 마이페이지는 비회원 컨셉으로 표시하고, 주담/펀딩/커뮤니티/AI의 모든 참여형 액션을 막아달라고 요청했다.
- 작업 전 `judam.md`, `src/features/mypage/screens/MyPageScreen.tsx`, `RecipeListScreen.tsx`, `RecipeDetailScreen.tsx`, `RecipeCreateScreen.tsx`, `FundingListScreen.tsx`, `FundingDetailScreen.tsx`, `FundingSupportScreen.tsx`, `CommunityScreen.tsx`, `CommunityDetailScreen.tsx`, `CommunityCreateScreen.tsx`, `AIChatScreen.tsx`, `AIChatRoomScreen.tsx`, `src/components/PageHeader.tsx`, `src/components/recipe-card.tsx`, `BreweryProjectTermsScreen.tsx`를 확인했다.
- `src/utils/authPrompt.ts`를 추가해 `showLoginRequired` 공용 안내를 만들었다. 비회원이 참여형 액션을 누르면 `로그인이 필요합니다` Alert와 `로그인하기` 이동 버튼을 보여준다.
- `src/features/mypage/screens/MyPageScreen.tsx`의 비회원 화면을 전용 UI로 교체했다. `비회원 님`, `둘러보기 모드`, 로그인/회원가입 CTA, 비회원 이용 안내, 로그인 후 가능한 기능 목록을 표시한다.
- `src/components/PageHeader.tsx`에서 비회원이 AI 챗봇 아이콘을 누르면 로그인 필요 안내가 뜨도록 막았다.
- `src/features/ai-chat/screens/AIChatScreen.tsx`, `AIChatRoomScreen.tsx`는 비회원 직접 진입 시 잠금 화면을 보여주고 채팅 목록/대화 입력을 사용할 수 없게 했다.
- `src/features/recipe/screens/RecipeListScreen.tsx`는 비회원 레시피 제안, 레시피 좋아요, 댓글 아이콘 액션을 로그인 안내로 막았다.
- `src/components/recipe-card.tsx`에 댓글 아이콘 press 핸들러를 받을 수 있게 추가해, 주담 목록에서 댓글 아이콘을 눌러도 비회원은 로그인 안내가 뜨도록 했다.
- `src/features/recipe/screens/RecipeDetailScreen.tsx`는 비회원 레시피 좋아요, 댓글 작성, 댓글 좋아요, 답글, 이 레시피로 펀딩 제안하기를 로그인 안내로 막았다. 상세 내용 읽기는 유지한다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`는 비회원 직접 진입 시 레시피 작성 폼 대신 로그인 필요 잠금 화면을 보여준다.
- `src/features/funding/screens/FundingListScreen.tsx`는 비회원 펀딩 좋아요를 로그인 안내로 막았다. 프로젝트 등록 액션 핸들러도 비회원이면 로그인 안내가 먼저 뜨도록 방어했다.
- `src/features/funding/screens/FundingDetailScreen.tsx`는 비회원 후원하기, 하단/추천 프로젝트 좋아요, Q&A 댓글 작성, Q&A 댓글/답글 좋아요, 답글 열기, 후기 작성, AI 아이콘을 로그인 안내로 막았다. 펀딩 상세 게시글 자체는 계속 읽을 수 있다.
- `src/features/funding/screens/FundingSupportScreen.tsx`는 기존 직접 진입 방어를 유지해 비회원은 후원 화면을 진행할 수 없다.
- `src/features/community/screens/CommunityScreen.tsx`는 비회원 게시글 좋아요와 새 글 작성 FAB를 로그인 안내로 막았다. 게시글 목록/상세 진입은 허용한다.
- `src/features/community/screens/CommunityDetailScreen.tsx`는 비회원 게시글 좋아요, 댓글 작성, 댓글 좋아요, 답글 액션을 로그인 안내로 막았다. 게시글 본문과 기존 댓글 읽기는 유지한다.
- `src/features/community/screens/CommunityCreateScreen.tsx`는 비회원 직접 진입 시 작성 폼 대신 로그인 필요 잠금 화면을 보여준다.
- `src/features/brewery/project/screens/BreweryProjectTermsScreen.tsx`는 비회원 직접 진입 시 펀딩 프로젝트 등록 약관 대신 로그인 필요 잠금 화면을 보여준다.
- 백엔드/API/AI 서버, 실제 인증 서버, 결제 서버 연동은 추가하지 않았다. 모두 프론트 라우팅/상태/Alert 기반 방어다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과 상태를 확인했다.

[2026-05-02]: 비회원 둘러보기 진입 시 기존 로그인 계정 초기화 버그 수정 완료.

[진행 내용]:
- 사용자가 앱 첫 진입/로그인 화면에서 `비회원으로 둘러보기`를 누르면 이전 양조장 계정으로 로그인된 상태가 남는 문제를 제보했다.
- 원인은 온보딩 CTA와 로그인 화면 하단의 비회원 진입 버튼이 `/(tabs)`로 이동만 하고, 기존 `judam_user` 저장값과 `AuthContext.user` 메모리 상태를 비우지 않았기 때문이다.
- `src/features/onboarding/screens/OnboardingScreen.tsx`에서 `useAuth().logout()`을 사용하도록 변경하고, 비회원 시작 핸들러가 상태바 복구 후 `logout()`을 먼저 실행한 뒤 `judam_onboarded`를 저장하고 `/(tabs)`로 이동하게 했다.
- `src/features/auth/screens/LoginScreen.tsx`에서도 비회원 시작 핸들러를 추가했다. 로그인 화면의 `비회원으로 둘러보기`는 `logout()`으로 기존 계정을 지운 뒤 `/(tabs)`로 이동한다.
- 이제 이전에 양조장 계정으로 로그인했던 기기에서도 비회원으로 둘러보기를 누르면 `AuthContext.user === null` 상태가 되어 마이페이지와 모든 권한 분기가 비회원 기준으로 동작한다.
- 백엔드/API/AI 서버 연동이나 인증 로직은 추가하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과 상태를 확인했다.

[2026-05-02]: 비회원 마이페이지 설정 버튼 로그인 안내 처리 완료.

[진행 내용]:
- 사용자가 비회원 상태에서 마이페이지 설정 버튼을 누르면 로그인 화면으로 바로 이동하지 말고 로그인해야 이용할 수 있다는 안내가 뜨게 해달라고 요청했다.
- 작업 전 `judam.md`와 `src/features/mypage/screens/MyPageScreen.tsx`를 확인했다.
- 원인은 비회원 마이페이지 헤더의 설정 아이콘이 `router.push('/login')`을 직접 실행하고 있었기 때문이다.
- `src/features/mypage/screens/MyPageScreen.tsx`에서 `showLoginRequired`를 import하고, 비회원 설정 버튼을 `showLoginRequired('설정은 로그인 후 이용할 수 있어요.')` 호출로 변경했다.
- 이제 비회원이 설정 아이콘을 누르면 공통 로그인 필요 Alert가 먼저 뜨고, 사용자가 원할 때 Alert의 로그인 버튼으로 이동할 수 있다.
- 백엔드/API/AI 서버 연동이나 인증 로직은 추가하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과 상태를 확인했다.

[2026-05-02]: 로그인 비밀번호 재설정 화면 `second` 기준 구현 완료.

[진행 내용]:
- 사용자가 로그인 화면의 `비밀번호를 잊으셨나요?`를 누르면 `second` 화면을 참고해 거의 똑같은 비밀번호 재설정 UI가 뜨게 해달라고 요청했다.
- 작업 전 `judam.md`, `src/features/auth/screens/LoginScreen.tsx`, `app/(auth)/_layout.tsx`, `second/src/app/pages/PasswordResetPage.tsx`를 확인했다.
- `src/features/auth/screens/PasswordResetScreen.tsx`를 새로 추가했다. `second` 기준처럼 전체 배경 이미지, 상단 뒤로가기, 중앙 로고/타이틀, 하단 폼 영역, 단계별 문구, 3개 step dot을 구성했다.
- 비밀번호 재설정 흐름은 `email`, `verify`, `newPassword` 3단계다. 이메일 입력 후 mock 발송 안내, 인증번호 입력 후 테스트 코드 `1234` 확인, 새 비밀번호/비밀번호 확인 및 요구사항 안내를 제공한다.
- 완료 시 `비밀번호가 재설정되었습니다.` 알림을 띄운 뒤 확인을 누르면 `/login`으로 돌아간다.
- `app/(auth)/password-reset.tsx` 라우트 엔트리를 추가하고, `app/(auth)/_layout.tsx` Stack에도 `password-reset`을 등록했다.
- `src/features/auth/screens/LoginScreen.tsx`의 `비밀번호를 잊으셨나요?` 버튼은 준비 중 알림 대신 `/password-reset`으로 이동한다.
- 실제 이메일 발송, 인증 서버, 비밀번호 변경 API는 추가하지 않았다. 현재는 프론트 mock UI/상태 흐름만 구현했다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과 상태를 확인했다.

[2026-05-02]: 비밀번호 재설정 새 비밀번호 조건/강도 UI 회원가입 기준과 통일 완료.

[진행 내용]:
- 사용자가 비밀번호 재설정에서 새 비밀번호를 입력할 때 회원가입처럼 `8자 이상, 영문 대소문자와 숫자 포함` 조건과 비밀번호 강도 표시가 똑같이 나오게 해달라고 요청했다.
- 작업 전 `judam.md`, `src/features/auth/screens/SignupScreen.tsx`, `src/features/auth/screens/PasswordResetScreen.tsx`, `src/utils/validation.ts`를 확인했다.
- 기존 비밀번호 재설정 화면은 최소 8자만 검사하고, `영문 대소문자와 숫자 포함` 조건과 회원가입 스타일의 강도 바가 없었다.
- `src/utils/validation.ts`에 `getPasswordStrength`, `isPasswordReady`를 공용 유틸로 추가했다. 기준은 회원가입과 동일하게 8자 이상, 영문 소문자/대문자 포함, 숫자 포함이다.
- `src/features/auth/screens/SignupScreen.tsx`는 기존 파일 내부 비밀번호 강도/조건 함수를 제거하고 공용 유틸을 import하도록 변경해 회원가입과 재설정이 같은 기준을 공유하게 했다.
- `src/features/auth/screens/PasswordResetScreen.tsx`의 새 비밀번호 입력 아래에 회원가입과 같은 3단계 강도 바, `비밀번호 강도: 약함/보통/안전`, `8자 이상, 영문 대소문자와 숫자 포함` 문구를 추가했다.
- 비밀번호 확인 입력 아래에는 회원가입처럼 일치/불일치 문구를 표시한다.
- 비밀번호 재설정 제출 검증도 최소 8자만 보던 방식에서 `isPasswordReady` 기준으로 강화했다.
- 실제 이메일 발송, 인증 서버, 비밀번호 변경 API는 추가하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과 상태를 확인했다.

[2026-05-02]: 사용자 유형 선택 양조장 인증 필수 흐름으로 재변경 완료.

[진행 내용]:
- 사용자가 사용자 유형 선택에서 양조장을 클릭했을 때 안내 문구를 `양조장 인증을 완료해야 펀딩 프로젝트 등록이 가능합니다.`로 바꾸고, `양조장으로 시작` 버튼을 누르는 즉시 양조장 인증 화면이 뜨게 해달라고 요청했다.
- 작업 전 `judam.md`, `src/features/auth/screens/UserTypeSelectionScreen.tsx`, `src/contexts/AuthContext.tsx`, `src/features/brewery/screens/BreweryVerificationScreen.tsx`를 확인했다.
- 기존 흐름은 양조장 선택 시 `updateUser({ type: 'brewery', isBreweryVerified: false })`를 먼저 실행한 뒤 홈 탭으로 이동했다. 이 방식은 인증 전에도 앱 상태상 양조장 계정으로 보일 수 있어 현재 요청과 맞지 않았다.
- `src/features/auth/screens/UserTypeSelectionScreen.tsx`의 양조장 선택 핸들러에서 `updateUser` 호출을 제거하고, `router.push('/brewery/verification')`만 실행하도록 변경했다.
- 이제 양조장 선택 단계에서는 사용자가 기존 일반 사용자 상태로 남아 있고, 양조장 인증 완료 시 `AuthContext.verifyBrewery`가 `type: 'brewery'`, `isBreweryVerified: true`, 양조장명, 위치, 사업자등록번호, 연락처를 저장한다.
- 양조장 카드 선택 후 하단 안내 문구는 `양조장 인증을 완료해야 펀딩 프로젝트 등록이 가능합니다.`로 변경했다.
- 사용자가 인증 화면에서 뒤로가거나 나중에 하기를 누르면 양조장 권한이 부여되지 않는다. 인증을 완료해야만 양조장 대시보드와 펀딩 프로젝트 등록 권한을 얻는다.
- 백엔드/API/실제 사업자 인증 서버는 추가하지 않았다. 기존 프론트 mock 인증 흐름을 유지한다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과 상태를 확인했다.

[2026-05-02]: 양조장 인증 완료 후 홈 화면 이동으로 변경 완료.

[진행 내용]:
- 사용자가 양조장 인증을 완료하면 양조장 대시보드가 아니라 홈 화면으로 가게 해달라고 요청했다.
- 작업 전 `judam.md`, `src/features/brewery/screens/BreweryVerificationScreen.tsx`의 인증 제출 후 Alert 라우팅을 확인했다.
- 기존 `handleSubmit`은 `verifyBrewery` 완료 후 Alert의 확인 버튼에서 항상 `/brewery/dashboard`로 이동했다.
- `src/features/brewery/screens/BreweryVerificationScreen.tsx`의 완료 Alert 확인 버튼 라우트를 `/(tabs)`로 변경했다.
- 인증 완료 시 권한 저장 흐름은 그대로 유지한다. `AuthContext.verifyBrewery`가 `type: 'brewery'`, `isBreweryVerified: true`, 양조장명, 위치, 사업자등록번호, 연락처를 저장한 뒤 홈으로 이동한다.
- 백엔드/API/실제 사업자 인증 서버는 추가하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과 상태를 확인했다.

[2026-05-02]: 온보딩/인증 6개 흐름 최종 점검 및 직접 진입 가드 보강 완료.

[진행 내용]:
- 사용자가 온보딩, 로그인, 회원가입, 이용약관 동의, 사용자 유형 선택, 양조장 인증 6개 화면만 대상으로 권한별 화면 분기, 에러 핸들링, 시각 효과 보완, 리팩토링 및 최적화가 완벽한지 최종 점검해달라고 요청했다.
- 작업 전 `judam.md`를 다시 읽고, `app/index.tsx`, `app/(auth)/*`, `app/onboarding.tsx`, `app/terms.tsx`, `src/features/onboarding/screens/OnboardingScreen.tsx`, `src/features/auth/screens/LoginScreen.tsx`, `SignupScreen.tsx`, `PasswordResetScreen.tsx`, `UserTypeSelectionScreen.tsx`, `src/features/terms/screens/TermsScreen.tsx`, `src/features/brewery/screens/BreweryVerificationScreen.tsx`, `src/contexts/AuthContext.tsx`, `src/utils/storage.ts`, `src/utils/validation.ts`를 기준으로 점검했다.
- 일반 버튼 플로우 기준으로는 온보딩, 로그인, 회원가입, 이용약관 동의, 사용자 유형 선택, 양조장 인증이 모두 프론트 mock 상태에서 자연스럽게 이어지는 것을 확인했다.
- 정정: `app/index.tsx`는 앱을 처음 열 때 반드시 온보딩이 먼저 보여야 한다는 사용자 기준이 최우선이다. 따라서 루트 진입은 `judam_onboarded` 저장값으로 탭을 자동 진입시키지 않고 항상 `/onboarding`으로 보낸다.
- 발견/수정 2: `src/features/auth/screens/UserTypeSelectionScreen.tsx`를 직접 열었을 때 로그인/회원가입 사용자 정보가 없어도 유형 선택 UI가 보일 수 있던 문제를 막았다. user가 없으면 회원가입/로그인 안내 가드 UI만 보여준다.
- 발견/수정 3: `src/features/brewery/screens/BreweryVerificationScreen.tsx`를 직접 열었을 때 user가 없어도 인증 폼이 보일 수 있던 문제를 막았다. user가 없으면 로그인/회원가입 안내 가드 UI를 보여준다.
- 발견/수정 4: `src/contexts/AuthContext.tsx`의 `verifyBrewery`가 user null 상태에서 silent no-op이 될 수 있던 부분을 error throw로 바꿔 인증 성공처럼 보일 가능성을 차단했다.
- 이 작업은 프론트엔드 mock 권한/화면 분기 보강이며, 백엔드/API/AI 서버 연동은 추가하지 않았다.
- 검증 결과 `npx tsc --noEmit`, `npm run lint`, `npx expo export --platform web --output-dir /tmp/judam-auth-flow-final-check` 모두 통과했다.

[2026-05-02]: 앱 첫 진입 온보딩 고정 규칙 재확인 및 루트 라우트 복구.

[진행 내용]:
- 사용자가 앱을 처음 들어갈 때는 반드시 온보딩이 나와야 한다고 강하게 정정했다.
- 직전 점검 중 `app/index.tsx`를 `judam_onboarded` 저장값에 따라 `/onboarding` 또는 `/(tabs)`로 보내는 방식으로 바꿨던 것은 현재 사용자 기준과 맞지 않았다.
- `app/index.tsx`를 다시 단순화해 루트(`/`) 진입 시 항상 `/onboarding`으로 Redirect하도록 복구했다.
- `judam_onboarded` 저장값은 온보딩 이후 로그인/회원가입/비회원 진입 흐름의 기록으로 남을 수 있으나, 루트 화면 자동 스킵 기준으로 사용하지 않는다.
- 온보딩, 로그인, 회원가입, 이용약관 동의, 사용자 유형 선택, 양조장 인증의 직접 진입 가드 보강은 유지한다.
- 검증 결과 `npx tsc --noEmit`, `npm run lint`, `npx expo export --platform web --output-dir /tmp/judam-onboarding-root-check` 모두 통과했다.

[2026-05-02]: 온보딩/인증 6개 흐름 변경분 재점검.

[진행 내용]:
- 사용자가 “온보딩, 로그인, 회원가입, 이용약관 동의, 사용자 유형 선택, 양조장 인증 6개 흐름 최종 점검” 요청은 이미 구현된 기본 동작을 바꾸라는 뜻이 아니라 내부적으로 권한 분기/에러 핸들링/시각 효과/리팩토링 상태를 확인하라는 뜻이라고 명확히 했다.
- 앞으로 유사한 “최종 점검” 요청에서는 명확한 오류나 런타임 위험이 확인된 경우에만 최소 수정하고, 정상 사용자 플로우와 화면 기획은 임의로 바꾸지 않는다.
- 재확인 결과 `src/features/onboarding/screens/OnboardingScreen.tsx`, `src/features/auth/screens/LoginScreen.tsx`, `src/features/auth/screens/SignupScreen.tsx`, `src/features/terms/screens/TermsScreen.tsx`는 이번 점검 과정에서 수정되지 않았다.
- `app/index.tsx`는 원래처럼 루트 진입 시 온보딩으로 이동하는 상태로 되돌렸고, 현재 앱 코드 변경분은 `UserTypeSelectionScreen`과 `BreweryVerificationScreen`의 비로그인 직접 진입 가드, `AuthContext.verifyBrewery`의 user null 방어 에러뿐이다.
- 정상 플로우인 앱 첫 진입 온보딩, 로그인, 회원가입 후 사용자 유형 선택, 일반 사용자 홈 진입, 양조장 선택 후 인증, 인증 완료 후 홈 진입은 유지된다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-02]: 비밀번호 재설정 새 비밀번호 표시 토글 추가.

[진행 내용]:
- 사용자가 비밀번호 재설정 화면에서 새 비밀번호와 비밀번호 확인 입력칸 오른쪽에 눈 아이콘을 두고 입력값을 확인할 수 있게 해달라고 요청했다.
- 작업 전 `judam.md`와 `src/features/auth/screens/PasswordResetScreen.tsx`를 확인했다.
- `src/features/auth/screens/PasswordResetScreen.tsx`에 `Eye`, `EyeOff` 아이콘과 `showNewPassword`, `showConfirmPassword` 상태를 추가했다.
- 공용 `Field` 컴포넌트에 `rightAccessory` prop을 추가해 기존 이메일/인증번호 입력 구조는 유지하면서, 새 비밀번호/비밀번호 확인 입력칸에만 오른쪽 눈 아이콘 버튼을 표시한다.
- 눈 아이콘을 누르면 각 입력칸의 `secureTextEntry`가 개별적으로 토글되어 입력한 비밀번호를 확인하거나 다시 숨길 수 있다.
- 비밀번호 조건, 강도 표시, 일치/불일치 문구, 완료 후 `/login` 복귀 흐름은 변경하지 않았다.
- 백엔드/API/실제 비밀번호 변경 서버 로직은 추가하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과 상태를 확인했다.

[2026-05-02]: 온보딩 설명 슬라이드 이전 화면 화살표 추가.

[진행 내용]:
- 사용자가 온보딩 첫 화면에서 다음을 눌러 두 번째 화면으로 넘어간 뒤 로그인/회원가입 CTA가 뜨기 전까지 왼쪽 위에 흰색 되돌아가기 화살표를 추가해 이전 온보딩 화면도 볼 수 있게 해달라고 요청했다.
- 작업 전 `judam.md`와 `src/features/onboarding/screens/OnboardingScreen.tsx`를 확인했다.
- `src/features/onboarding/screens/OnboardingScreen.tsx`에 `ArrowLeft` 아이콘을 추가하고, `!isCTA && current > 0` 조건에서만 왼쪽 상단 뒤로가기 버튼을 표시하도록 했다.
- 버튼을 누르면 기존 슬라이드 이동 함수 `go(current - 1)`를 사용해 바로 이전 온보딩 슬라이드로 돌아간다.
- 첫 번째 온보딩 화면과 로그인/회원가입/비회원 CTA 화면에는 해당 화살표를 표시하지 않는다.
- 기존 다음/건너뛰기/하단 점/스와이프/로그인/회원가입/비회원 진입 흐름은 변경하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과 상태를 확인했다.

[2026-05-02]: 온보딩 4번째 슬라이드 배지 문구 변경.

[진행 내용]:
- 사용자가 온보딩 4번째 부분의 `오픈 키친` 문구를 `양조 일지`로 바꿔달라고 요청했다.
- 작업 전 `judam.md`와 `src/features/onboarding/screens/OnboardingScreen.tsx`를 확인했다.
- `src/features/onboarding/screens/OnboardingScreen.tsx`의 4번째 슬라이드 badge 값을 `오픈 키친`에서 `양조 일지`로 변경했다.
- 온보딩 이미지, 제목, 설명, 뒤로가기 화살표, 다음/건너뛰기/스와이프/CTA 흐름은 변경하지 않았다.
- `npx tsc --noEmit` 통과, `npm run lint` 통과 상태를 확인했다.

[2026-05-02]: 온보딩/인증 6개 흐름 최종 재점검 완료.

[진행 내용]:
- 사용자가 온보딩, 로그인, 회원가입, 이용약관 동의, 사용자 유형 선택, 양조장 인증 6개만 대상으로 권한별 화면 분기, 에러 핸들링, 시각 효과, 리팩토링/최적화 최종 점검을 요청했다.
- 이번 요청은 기본 구현 변경이 아니라 내부 점검이라는 기존 사용자 의도를 유지해, 명확한 오류가 없으면 정상 화면/기획을 바꾸지 않는 기준으로 확인했다.
- 점검 파일: `app/index.tsx`, `app/(auth)/*`, `app/onboarding.tsx`, `app/terms.tsx`, `app/brewery/verification.tsx`, `src/features/onboarding/screens/OnboardingScreen.tsx`, `LoginScreen`, `SignupScreen`, `PasswordResetScreen`, `UserTypeSelectionScreen`, `TermsScreen`, `BreweryVerificationScreen`, `AuthContext`, `validation`, `storage`.
- 루트 진입은 항상 `/onboarding`이며, 저장값으로 자동 탭 진입하지 않는 상태를 재확인했다.
- 정상 흐름 확인: 온보딩 -> 로그인/회원가입/비회원 CTA, 로그인 입력 검증/비회원 logout, 회원가입 검증/PASS mock/필수 약관, 회원가입 후 사용자 유형 선택, 일반 사용자 홈, 양조장 선택 -> 인증, 인증 완료 -> 홈.
- 직접 진입 방어 확인: user 없는 user-type은 회원가입/로그인 안내, user 없는 brewery/verification은 로그인/회원가입 안내, `verifyBrewery`는 user null 시 throw.
- 에러 핸들링 확인: 이메일/비밀번호/닉네임/휴대폰/사업자번호/SMS 테스트 코드/약관/PASS mock/비밀번호 재설정 단계 안내가 있다.
- 시각 효과 확인: 온보딩 슬라이드/뒤로가기/점/CTA, 로그인/회원가입 bottom sheet, signup terms modal, password-reset dots/modal, user-type selection animation, brewery verification address modal/background 유지.
- 6개 흐름 범위에는 `fetch`, `axios`, OpenAI/Gemini/Anthropic, Supabase/Firebase, API key 등 백엔드/AI/API 호출 패턴이 없음을 확인했다.
- 이번 점검 중 추가 앱 코드 수정은 하지 않았다.
- `git diff --check`, `npx tsc --noEmit`, `npm run lint`, `npx expo export --platform web --output-dir /tmp/judam-auth-six-flow-final-check` 통과.

[2026-05-02]: 양조장 인증 완료 예정 안내 문구 수정.

[진행 내용]:
- 사용자가 양조장 인증 화면의 `인증은 영업일 기준 2~3일 내에 완료됩니다.` 문구를 `인증은 영업일 기준 1~2일 내에 완료됩니다.`로 바꿔달라고 요청했다.
- 작업 전 `judam.md`를 읽고, `src/features/brewery/screens/BreweryVerificationScreen.tsx`의 안내 문구 위치를 확인했다.
- `src/features/brewery/screens/BreweryVerificationScreen.tsx`의 양조장 인증 안내 박스 문구를 영업일 기준 `1~2일`로 변경했다.
- 권한 분기, 인증 mock 로직, 입력 검증, 화면 이동, 백엔드/API/AI 서버 연동 상태는 변경하지 않았다.

[2026-05-02]: 양조장 인증 연락처 인증번호 재전송 버튼 처리.

[진행 내용]:
- 사용자가 양조장 인증 화면에서 연락처 입력 후 `인증`을 누르고 인증번호 입력/확인 영역이 뜬 뒤에는 기존 `인증` 버튼 문구를 `인증번호 재전송`으로 바꿔달라고 요청했다.
- 작업 전 `judam.md`를 읽고, `src/features/brewery/screens/BreweryVerificationScreen.tsx`의 연락처 인증 상태와 버튼 렌더링을 확인했다.
- `handleSendVerification`이 최초 전송인지 재전송인지 구분해 Alert 문구를 `인증번호가 전송되었습니다.` 또는 `인증번호가 재전송되었습니다.`로 보여주게 했다.
- 재전송 시 기존 인증번호 입력값을 비워 사용자가 새로 입력하도록 했다. mock 인증번호 기준은 기존처럼 `1234`를 유지한다.
- 연락처가 인증 완료되기 전이고 인증번호가 이미 전송된 상태에서는 연락처 우측 버튼 문구가 `인증번호 재전송`으로 표시된다. 인증 완료 후에는 기존처럼 `완료`로 표시되고 버튼은 비활성화된다.
- 백엔드/API/SMS 서버 연동은 추가하지 않았고, 프론트 mock 상태 흐름만 보강했다.

[2026-05-02]: 양조장 인증 사업자등록증 실제 사진/파일 선택 업로드 흐름 추가.

[진행 내용]:
- 사용자가 회원가입 이후 양조장 인증 화면의 사업자등록증 `클릭하여 파일 업로드` 영역을 누르면 실제 사용자 사진 또는 파일 중 업로드 방식을 선택하고, 권한/선택기를 거쳐 파일을 업로드 상태로 반영해달라고 요청했다.
- 작업 전 `judam.md`, `package.json`, `app.json`, `src/features/brewery/screens/BreweryVerificationScreen.tsx`, 기존 `expo-image-picker` 사용 화면들을 확인했다.
- `npx expo install expo-document-picker`로 Expo SDK 54 호환 `expo-document-picker ~14.0.8`을 추가하고, `app.json` plugins에 `expo-document-picker`를 등록했다.
- `app.json`의 `expo-image-picker` 사진 권한 문구를 프로젝트 대표 이미지뿐 아니라 사업자등록증 사진 업로드도 포괄하도록 변경했다.
- `src/features/brewery/screens/BreweryVerificationScreen.tsx`에서 사업자등록증 상태를 단순 mock 문자열에서 `{ name, uri, mimeType, size, source }` 객체로 바꿨다.
- 업로드 박스를 누르면 `사업자등록증 업로드` Alert가 뜨고 `사진에서 업로드`, `파일로 업로드`, `취소`를 선택할 수 있다.
- `사진에서 업로드`는 `ImagePicker.requestMediaLibraryPermissionsAsync()`로 갤러리 권한을 요청한 뒤 이미지 선택기를 열고, 선택된 이미지의 파일명/uri/mime/크기를 저장한다.
- `파일로 업로드`는 `DocumentPicker.getDocumentAsync()` 시스템 문서 선택기를 열어 PDF/JPG/PNG 파일을 선택하고, 선택 파일의 파일명/uri/mime/크기를 저장한다.
- 업로드 가능 형식은 PDF, JPG, PNG이며, 10MB를 초과하면 안내 Alert를 띄우고 저장하지 않는다.
- 화면에는 선택한 사업자등록증 이름과 `사진에서 업로드됨` 또는 `파일에서 업로드됨` 출처를 표시한다.
- 실제 서버 업로드/API 저장은 추가하지 않았다. 현재는 프론트 상태에 선택 파일 정보를 보관해 제출 가능 조건을 충족하는 단계다.
- `git diff --check`, `npx tsc --noEmit`, `npm run lint`, `npx expo export --platform web --output-dir /tmp/judam-brewery-license-upload-check` 통과.

[2026-05-02]: 온보딩/인증 6개 흐름 최종 재점검 완료.

[진행 내용]:
- 사용자가 온보딩, 로그인, 회원가입, 이용약관 동의, 사용자 유형 선택, 양조장 인증 6개만 대상으로 권한별 화면 분기, 에러 핸들링, 시각 효과, 리팩토링/최적화 상태를 다시 최종 점검해달라고 요청했다.
- 이번 요청은 기존 구현을 바꾸는 작업이 아니라 내부 검수라는 기준으로, 명확한 오류가 없으면 기본 화면/동작을 임의 수정하지 않는 원칙을 유지했다.
- 점검 파일: `app/index.tsx`, `app/_layout.tsx`, `app/(auth)/*`, `app/onboarding.tsx`, `app/terms.tsx`, `app/brewery/verification.tsx`, `src/contexts/AuthContext.tsx`, `src/utils/validation.ts`, `src/utils/storage.ts`, `src/features/onboarding/screens/OnboardingScreen.tsx`, `src/features/auth/screens/LoginScreen.tsx`, `SignupScreen.tsx`, `PasswordResetScreen.tsx`, `UserTypeSelectionScreen.tsx`, `src/features/terms/screens/TermsScreen.tsx`, `src/features/brewery/screens/BreweryVerificationScreen.tsx`.
- 루트 진입은 저장값과 관계없이 항상 `/onboarding`으로 이동하는 상태를 재확인했다.
- 온보딩은 로컬 이미지/contain 표시, 스와이프/하단 dot/다음/건너뛰기/CTA, 설명 슬라이드 뒤로가기, 비회원 진입 시 `logout()` 처리 흐름이 유지된다.
- 로그인은 이메일/비밀번호 inline 검증, 비밀번호 표시 토글, 로그인 유지 이메일 저장/삭제, 비밀번호 재설정 이동, 비회원 진입 시 `logout()`, mock 계정 타입별 이동이 유지된다.
- 회원가입은 닉네임/이메일 중복 확인 mock, 비밀번호 조건/강도/일치 확인, PASS mock 본인인증, 필수 약관 검증, 가입 후 사용자 유형 선택 이동이 유지된다.
- 이용약관 동의는 회원가입 내 필수/선택 체크와 서비스/개인정보 modal 보기, 별도 `app/terms` 정책 열람 화면의 accordion UI가 정상이다.
- 사용자 유형 선택은 user가 없을 때 회원가입/로그인 가드 UI를 보여주고, 일반 사용자는 홈으로 이동하며, 양조장은 권한을 바로 부여하지 않고 `/brewery/verification`으로 이동한다.
- 양조장 인증은 user가 없을 때 로그인/회원가입 가드 UI를 보여주고, 사업자번호/양조장명/주소/연락처 인증/사업자등록증 업로드 검증 후 `verifyBrewery`로 양조장 권한을 저장하고 홈으로 이동한다.
- 양조장 인증의 연락처 인증번호 재전송, 사업자등록증 사진/파일 선택 업로드, 주소 검색 mock, `1~2일` 인증 안내 문구도 유지됨을 확인했다.
- 6개 흐름 범위에는 `fetch`, `axios`, OpenAI/Gemini/Anthropic, Supabase/Firebase, API key, `.env` 등 백엔드/AI/API 호출 패턴이 없고, `finish`/`second` 직접 import도 없다.
- 이번 점검 중 앱 코드 추가 수정은 하지 않았고, `judam.md`에 점검 결과만 기록했다.
- `git diff --check`, `npx tsc --noEmit`, `npm run lint`, `npx expo export --platform web --output-dir /tmp/judam-auth-six-flow-recheck` 통과.

[2026-05-02]: 펀딩 프로젝트 생성 양조장 정보/입력/미리보기/임시저장 플로우 보강 완료.

[진행 내용]:
- 사용자가 펀딩 페이지 범위만 대상으로, 양조장 권한에서 보이는 `펀딩 프로젝트 등록하기`의 생성 화면을 `second` 기준으로 세부 보강해달라고 요청했다.
- 작업 전 `judam.md`, `second/src/app/pages/CreateProjectDetailPage.tsx`, 현재 `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`, `src/features/funding/screens/FundingDetailScreen.tsx`를 확인했다. `second/`는 참고만 하고 앱 코드에서 직접 import하지 않았다.
- `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`에서 양조장 정보 탭의 `프로필 이미지 업로드`를 실제 갤러리/카메라 선택 Alert 흐름으로 바꿨다. 갤러리는 `expo-image-picker` 미디어 권한, 카메라는 카메라 권한을 요청하고 선택/촬영한 local URI와 파일명을 프론트 상태에 저장한다.
- 같은 화면에서 연락처 본인 인증 버튼 활성화 조건을 휴대폰 번호 형식 검증 기준으로 정리했다. 유효한 번호가 되면 `인증하기`가 활성화되고, 발송 후에는 `인증번호 재전송`으로 바뀌며 테스트 코드 `1234` mock 인증을 유지한다.
- 입금 계좌는 은행 선택 모달을 추가해 여러 은행 중 하나를 고르게 했다. 계좌번호는 숫자만 20자리까지 입력되며, 긴 번호를 입력해도 화면 밖으로 밀리지 않도록 full-width 고정 입력 박스로 정리했다.
- 양조장 정보 탭의 업태/종목 입력을 `twoColItem` 2열 폭 기준으로 감싸 붙어 보이지 않게 수정했다.
- 양조장 정보 탭 주소 검색은 기존 mock 결과 선택뿐 아니라 검색어를 직접 `입력한 주소 사용`으로 반영할 수 있게 해 실제 주소 입력 화면처럼 보이도록 보강했다.
- 기본정보의 도수, 법적 고시 정보의 용량/도수는 숫자 입력만 허용하도록 제한했다. 도수는 `%`, 용량은 `ml` suffix를 UI와 미리보기/제출 데이터에 반영한다.
- 작성 진행률은 `기획중 · 필수 항목 기준`으로 표시하고, `*` 필수 항목만 계산한다. 선택 항목에는 `(선택)` 라벨을 명시했다.
- Eye 미리보기는 현재 앱의 펀딩 상세 게시글 구조와 맞춰 메인 이미지, 제목/요약, 펀딩 현황, 양조장 프로필/지역/카테고리, 소개, 가격, 예산, 일정, 맛 지표, 안내사항을 입력값 기반으로 보여주게 보강했다.
- 임시저장은 `SafeStorage`의 `judam_project_temp_save` 키를 사용하는 프론트 로컬 mock 흐름으로 구현했다. 첫 저장은 `임시저장 되었습니다.` 모달만 보여주고, 기존 초안이 있으면 불러오기/현재 내용으로 새로 저장/삭제를 선택할 수 있다. 저장된 초안이 있는 상태에서 X를 누르면 불러오기/불러오지 않고 나가기/계속 작성하기를 선택할 수 있고, 저장 초안 없이 작성 중 X를 누르면 임시저장 없이 나갈지 확인한다.
- `app.json`의 `expo-image-picker` plugin 권한 문구에 갤러리와 카메라 사용 목적을 반영했다.
- 실제 서버 업로드, SMS 발송, 금융 계좌 검증, 주소 API, AI 이미지 생성 서버, 백엔드/API/AI 로직은 추가하지 않았다. 모든 신규 흐름은 기기 권한을 쓰는 이미지 선택/촬영을 제외하면 프론트 mock/local state 기준이다.
- `git diff --check`, `npx tsc --noEmit`, `npm run lint`, `npx expo export --platform web --output-dir /tmp/judam-brewery-project-create-funding-polish-check` 통과.

[2026-05-02]: 온보딩/로그인/회원가입 잠금 규칙 문서화 완료.

[진행 내용]:
- 사용자가 현재 온보딩, 로그인, 회원가입은 완벽히 완성된 상태이므로 명확하게 부탁하지 않는 이상 마음대로 수정하지 말라고 요청했다.
- `judam.md`의 [AI 작업 운영 규칙]에 온보딩, 로그인, 회원가입을 잠금 영역으로 명시했다.
- 잠금 대상 파일은 `src/features/onboarding/screens/OnboardingScreen.tsx`, `src/features/auth/screens/LoginScreen.tsx`, `src/features/auth/screens/SignupScreen.tsx`다.
- 단순 전체 점검, `second` 비교, 다른 화면 개발, 스타일 통일, 리팩토링을 이유로 위 세 화면의 UI/플로우/문구/이미지/권한 분기를 임의 수정하지 않는다.
- AuthContext나 공용 유틸 수정이 위 세 화면의 기존 동작에 영향을 줄 수 있으면 먼저 사용자에게 확인해야 한다.
- 이번 작업은 문서 업데이트만 진행했고 앱 코드는 수정하지 않았다.

[2026-05-02]: 펀딩 리스트 결과 요약 문구 제거 완료.

[진행 내용]:
- 사용자가 펀딩 페이지에서 검색/필터 영역 아래의 `전체 n개 · 누적 후원 n만원` 문구를 제거해달라고 요청했다.
- `src/features/funding/screens/FundingListScreen.tsx`에서 `resultSummary` Text 렌더링을 제거했다.
- 해당 문구에만 쓰이던 `totalRaised` 계산과 `resultSummary` 스타일도 함께 제거했다.
- 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.

[2026-05-02]: 펀딩 상세 화면 second 기준 누락 기능 보강 완료.

[진행 내용]:
- 사용자가 펀딩 페이지 범위만 대상으로 `second`와 다른 상세 화면 누락 기능을 알려주며, 직접 언급한 부분은 구현하고 그 외 차이는 말로 정리해달라고 요청했다.
- 작업 전 `judam.md`, `second/src/app/pages/FundingDetailPage.tsx`, `second/src/app/components/JournalStageSection.tsx`, 현재 `src/features/funding/screens/FundingDetailScreen.tsx`, `src/constants/data.ts`, `src/contexts/FundingContext.tsx`, `src/features/brewery/project/screens/BreweryJournalManageScreen.tsx`를 확인했다.
- `src/features/funding/screens/FundingDetailScreen.tsx` 소개 탭의 프로젝트 소개 정보 카드에서 도수 오른쪽에 `예상 배송일`을 추가했다.
- 프로젝트 소유 양조장으로 로그인했을 때 양조장 프로필 카드 아래, 탭 위쪽에 `양조일지 관리` 버튼을 표시하도록 옮겼다. 기존처럼 `/brewery/project/[id]/journal`로 이동한다.
- 추천 프로젝트 섹션 위에 `공유하기`/`신고하기` 버튼을 추가했다. 공유하기는 React Native `Share` 시트를 열고, 신고하기는 사유/상세 입력 모달과 프론트 mock 접수 안내를 보여준다.
- Q&A 댓글 답글 흐름을 보강했다. 댓글의 `답글` 버튼을 누르면 답글 입력창이 확실히 열리고, 해당 댓글의 답글 영역도 함께 펼쳐진다.
- 성사/종료된 펀딩의 후기 탭은 후원자 후기 카드를 `second` 카드형 UI에 가깝게 보정했다. 당시에는 후기 카드/후기 작성 버튼이 프론트 mock 안내 모달까지만 연결됐지만, 2026-05-04 작업으로 실제 Expo 라우트와 프론트 로컬 후기 생성 흐름까지 연결됐다.
- 이번 요청에서 사용자가 “막 바꾸지는 말고 말로 정리”하라고 한 나머지 `second` 대비 차이는 [현재 second 대비 펀딩 상세 잔여 차이]에 기록했다.
- 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.
- `npx tsc --noEmit`, `npm run lint`, `npx expo export --platform web --output-dir /tmp/judam-funding-detail-second-align-check` 통과.

[2026-05-02]: 벚꽃 막걸리 프로젝트 양조장 mock 소유권 부여 완료.

[진행 내용]:
- 사용자가 펀딩 페이지 맨 위의 `봄을 담은 벚꽃 막걸리 프로젝트`를 양조장 로그인 시 본인 프로젝트로 보고 양조일지를 관리할 수 있게 해달라고 요청했다.
- `src/features/funding/ownership.ts`를 추가해 펀딩 프로젝트 소유권 판단을 공용 함수 `isFundingProjectOwnedByBrewery`로 정리했다.
- 기존 양조장 이름 매칭 기준은 유지하면서, demo project id 1을 모든 양조장 계정의 본인 프로젝트로 취급하도록 했다.
- `FundingListScreen`은 1번 프로젝트에 `내 프로젝트` 배지를 표시한다.
- `FundingDetailScreen`은 1번 프로젝트에서 양조장 계정에게 `양조일지 관리` 버튼과 `프로젝트 관리하기` CTA를 보여준다.
- `BreweryJournalManageScreen`은 1번 프로젝트의 양조일지 관리 권한을 통과시킨다.
- `FundingSupportScreen`은 1번 프로젝트를 본인 프로젝트로 보고 후원을 막고 관리 안내 화면으로 보낸다.
- `BreweryDashboardScreen`은 1번 프로젝트를 양조장 내 프로젝트 목록에 포함한다.
- 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.
- `git diff --check`, `npx tsc --noEmit`, `npm run lint` 통과.

[2026-05-02]: 펀딩 상세 양조일지 등록 후 이동 및 단계별 상호작용 보강 완료.

[진행 내용]:
- 사용자가 양조일지를 등록하면 빈 상태처럼 보이지 않고 방금 등록한 양조일지로 이동해 바로 확인할 수 있게 하고, 단계별로 여러 일지를 올릴 수 있으므로 3개 초과 시 더보기가 뜨며, 유저가 단계별 일지에 좋아요와 댓글을 남길 수 있게 해달라고 요청했다.
- 작업 전 `judam.md`, `second/src/app/components/JournalStageSection.tsx`, `second/src/app/pages/FundingDetailPage.tsx`, 현재 `src/features/brewery/project/screens/BreweryJournalManageScreen.tsx`, `src/features/funding/screens/FundingDetailScreen.tsx`, `src/contexts/FundingContext.tsx`, `src/constants/data.ts`를 확인했다.
- `BreweryJournalManageScreen`의 저장 흐름을 변경해 새 일지 작성 또는 기존 일지 수정 후 `/funding/{project.id}?tab=journal`로 `router.replace` 이동한다. 이로써 관리 화면에 머무르지 않고 펀딩 상세의 양조일지 탭에서 저장 결과를 바로 확인한다.
- `FundingDetailScreen`은 `tab=journal` query가 들어오면 양조일지 탭을 활성화하도록 `useEffect`로 동기화한다.
- 펀딩 상세 양조일지 탭은 단계별 일지를 최신 id순으로 렌더링하고, 단계별 3개까지만 먼저 표시하며 4개 이상이면 `더보기 (n개 더)`와 `접기` 버튼을 보여준다.
- 각 양조일지 카드에 좋아요 버튼과 댓글 버튼을 추가했다. 좋아요 수와 댓글 수는 `FundingContext.updateProjectJournals`로 현재 프론트 로컬 프로젝트 상태에 반영한다.
- 댓글 패널은 로그인 사용자에게 댓글 입력창과 전송 버튼을 보여주고, 비회원에게는 로그인 필요 안내 버튼을 보여준다. 댓글 작성 후 입력값은 초기화되고 해당 일지 댓글 패널은 열린 상태로 유지된다.
- 양조일지 댓글에는 작성자, 양조장 배지, 날짜, 내용, 댓글 좋아요 버튼을 표시한다. 댓글 좋아요도 `updateProjectJournals`로 반영한다.
- 실제 백엔드 저장, 댓글 API, 푸시 알림, AI/서버 로직은 추가하지 않았다. 모든 신규 상호작용은 기존 `FundingContext` 기반 프론트 mock/local state다.
- 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.
- `git diff --check`, `npx tsc --noEmit`, `npm run lint`, `npx expo export --platform web --output-dir /tmp/judam-funding-journal-interaction-check` 통과.

[2026-05-04]: 펀딩 후기 작성/상세 라우트 및 후기 생성 흐름 보강 완료.

[진행 내용]:
- 사용자가 펀딩 게시글의 후기 영역에서 `second`에는 후기 작성/후기 상세 라우트가 있지만 현재 Expo 앱에는 mock 안내 모달까지만 연결되어 있으니, `second`와 똑같이 해당 부분을 만들어달라고 요청했다. 이후 `나도 후기 작성하기` 작성 페이지에서 현재 없는 투표 관련 기능을 제거하고, 실제 후기 목록/상세에 등록 내용이 반영되도록 재구성해달라고 추가 요청했다.
- 작업 전 `judam.md`, `second/src/app/pages/FundingDetailPage.tsx`, `second/src/app/pages/ReviewDetailPage.tsx`, `second/src/app/pages/FundingReviewWritePage.tsx`, 현재 `src/features/funding/screens/FundingDetailScreen.tsx`, `app/` 라우트 구조를 확인했다.
- `src/features/funding/reviews.ts`를 추가하고 `FundingReview` 타입을 확장해 후기 목록, 후기 상세 댓글 mock, 후기 작성 태그 preset, 리워드명, 이미지, 태그, 그날의 기록 표시 여부를 펀딩 feature 내부 공유 데이터로 분리했다. 앱 코드에서 `second/`를 직접 import하지 않는다.
- `src/contexts/FundingContext.tsx`에 `fundingReviews` state와 `addFundingReview`를 추가했다. 후기 작성 시 서버/API 없이 프론트 로컬 상태에 새 후기를 prepend하고 id, 오늘 날짜, `방금 전`, 좋아요 0개를 부여한다.
- `app/funding/[id]/review/[reviewId].tsx`와 `src/features/funding/screens/FundingReviewDetailScreen.tsx`를 추가했다. 후기 상세 화면은 프로젝트 배너, 작성자/별점/리워드, 후기 본문, 이미지 그리드, 좋아요, 댓글 목록, 하단 댓글 입력을 React Native 방식으로 구현한다. 비회원은 후기 좋아요/댓글/댓글 좋아요에서 로그인 필요 안내를 본다.
- `app/archive/review/[fundingId].tsx`와 `src/features/funding/screens/FundingReviewWriteScreen.tsx`를 추가했다. 최신 사용자 요청에 맞춰 후기 작성 화면의 투표 옵션/투표 맛 일치도 기능은 제거했다.
- 현재 후기 작성 화면 구성은 해당 상품/리워드, 사진 첨부 최대 3장, 반 별점 선택, 상세 후기, 그날의 기록, `후기에도 표시하도록 할까요?` 체크박스, preset/직접 태그, 제출 버튼이다.
- `그날의 기록`은 아카이브에는 자동 기록되는 컨셉을 유지하고, 체크박스를 켠 경우에만 후기 상세 게시글에 기분/함께한 안주를 보여준다. 체크하지 않으면 후기 상세에는 노출하지 않는다.
- 후기 작성 화면의 사진 첨부는 `expo-image-picker` 갤러리 권한 요청 후 이미지를 선택해 프론트 상태에 보관한다. 실제 서버 업로드는 없다.
- 후기 작성 권한은 로그인 및 `FundingContext.participatedFundings`에 해당 펀딩 id가 있는지 기준으로 프론트 mock 검증한다. 권한이 없으면 작성 폼 대신 안내 화면을 보여준다.
- `FundingDetailScreen`의 후기 탭은 더 이상 mock 안내 모달을 띄우지 않고, 후기 카드 클릭 시 `/funding/{project.id}/review/{review.id}`, 후기 작성 버튼 클릭 시 `/archive/review/{project.id}`로 이동한다.
- `FundingDetailScreen`의 후기 탭은 `FundingContext.fundingReviews`를 프로젝트 id별로 필터링해 렌더링한다. 후기 카드에는 작성자, 별점, 리워드명, 날짜, 본문, 태그 일부가 표시된다.
- `FundingReviewDetailScreen`은 같은 `fundingReviews` state를 읽어 방금 등록한 후기 상세도 바로 표시한다. 상세에는 리워드, 별점, 본문, 태그, 이미지, 선택 노출된 그날의 기록, 좋아요/댓글 mock 상호작용이 들어간다.
- `FundingDetailScreen`은 `tab=journal`, `tab=qna`, `tab=review` query 직접 진입 시 해당 탭을 초기 활성화한다.
- 실제 후기 저장 API, 후기 서버 DB, 이미지 업로드 서버, 알림/AI 로직은 추가하지 않았다. 제출 완료는 프론트 mock Alert 후 방금 생성된 후기 상세 화면으로 이동한다.
- 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.
- `git diff --check`, `npx tsc --noEmit`, `npm run lint`, `npx expo export --platform web --output-dir /tmp/judam-funding-review-routes-check`, `npx expo export --platform web --output-dir /tmp/judam-funding-review-create-flow-check` 통과.

[2026-05-05]: 펀딩 후기 게시글 태그 pill 높이 보정 완료.

[진행 내용]:
- 사용자가 후기 작성 후 게시글에 표시되는 태그가 세로로 너무 길어 보이고, 글씨에 맞는 높이였으면 좋겠다고 요청했다.
- 첫 보정에서 `Text` 자체에 배경/패딩을 둔 채로 줄여 한글 태그의 세로 균형이 더 어색해지고, `그날의 기록` 영역과 태그 간격이 붙어 보이는 문제가 생겼다.
- `src/features/funding/screens/FundingReviewDetailScreen.tsx`의 후기 상세 태그를 `View` pill + 내부 `Text` 구조로 바꿔 `한라봉 소주` 리워드 배지와 같은 방식으로 렌더링되게 했다. 태그 묶음의 아래 여백도 늘려 `그날의 기록`과 붙지 않게 했다.
- `src/features/funding/screens/FundingDetailScreen.tsx`의 후기 탭 카드 태그도 `View` pill + 내부 `Text` 구조로 바꿔 목록 카드와 상세 게시글의 태그 높이 기준을 맞췄다.
- 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.

[2026-05-05]: 펀딩 후기 상세 뒤로가기 플로우 정리 완료.

[진행 내용]:
- 사용자가 후기 페이지에서 왼쪽 위 뒤로가기 버튼을 누르면 해당 펀딩 게시글의 후기 탭으로 돌아가고, 거기서 다시 뒤로가기 버튼을 누르면 펀딩 메인페이지로 가야 한다고 요청했다.
- `src/features/funding/screens/FundingReviewDetailScreen.tsx`의 헤더 뒤로가기를 `router.push`나 `router.back`이 아니라 `/funding/{project.id}?tab=review&fromReview=1`로 `router.replace`하도록 변경했다. 후기 상세에서 돌아갈 때 항상 해당 펀딩 상세의 후기 탭이 열린 상태가 된다.
- `src/features/funding/screens/FundingDetailScreen.tsx`는 `fromReview=1` query를 읽고, 이 상태에서 헤더 뒤로가기를 누르면 히스토리를 되감지 않고 `/funding`으로 `router.replace`한다. 일반 펀딩 상세 진입에서는 기존처럼 back이 가능하면 `router.back()`을 사용하고, 직접 진입 등 back 스택이 없으면 `/funding`으로 보낸다.
- 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.

[2026-05-05]: 펀딩 후기 작성 화면 바깥 배경색 보정 완료.

[진행 내용]:
- 사용자가 `나도 후기 작성하기` 화면에 들어갔을 때 겉 배경이 노란 느낌이라 주담 디자인과 어울리지 않는다고 피드백했다.
- `src/features/funding/screens/FundingReviewWriteScreen.tsx`의 `screen` 배경색을 크림 기운이 있던 `#F7F7F5`에서 중립 그레이 `#F4F5F7`로 변경했다.
- 카드, 입력창, 태그, 버튼, 후기 작성 플로우, 권한 분기, 온보딩/로그인/회원가입 잠금 영역은 수정하지 않았다.

[2026-05-05]: 펀딩 메인 양조장 프로젝트 등록 버튼 폭/정렬 보정 완료.

[진행 내용]:
- 사용자가 펀딩 페이지에서 양조장이 프로젝트 등록하는 버튼이 너무 길고 `+ 프로젝트 등록` 글도 가운데 정렬되어야 한다고 요청했다.
- `src/features/funding/screens/FundingListScreen.tsx`의 hero CTA 스타일을 조정했다. 공통 `createBtn`은 높이, 중앙 정렬, 그림자, 기본 padding만 담당하고, 인증 양조장용 `createBtnCompact`와 미인증 양조장용 `createBtnWide` 폭을 분리했다.
- 인증 양조장의 `+ 프로젝트 등록` 버튼은 170px 컴팩트 폭으로 줄이고, 아이콘과 텍스트가 `justifyContent: center`, `textAlign: center` 기준으로 가운데 놓이게 했다.
- 버튼 클릭 플로우, 양조장 인증 분기, 펀딩 목록/상세/후기, 온보딩/로그인/회원가입 잠금 영역은 수정하지 않았다.

4. 향후 개발 로드맵 (FE Milestones)
[Phase 1: 기초 및 인증 (8주차 ~ 4/29)]
[x] 글로벌 테마(theme.ts) 및 공통 컴포넌트(Button, Input, Card) 기본 구현
[x] 스플래시 UI 구현 (Onboarding 연동 완료)
[x] 로그인 UI 및 회원가입 UI 구축 (`second` 기준 1차 재정렬 완료, 사용자 요청 로컬 이미지/표시 방식 유지)

[Phase 2: 메인 구조 및 분기 (9주차 ~ 5/06)]
[x] 펀딩 메인 UI (5탭 네비게이션 포함) - 완료
[x] 유저/양조장 권한별 화면 분기 처리 로직 구현 - 완료
[x] 레시피 리스트 및 상세 UI 구현 - 리스트 완료
[x] 펀딩 리스트 및 상세 UI 구현 - 완료

[Phase 3: 술BTI 엔진 (10주차 ~ 5/13)]
[ ] 술BTI 테스트 질문 폼 UI 구현
[ ] 술BTI 결과 분석 화면 (오각형 레이더 차트) 시각화

[Phase 4: 코어 펀딩 시스템 (11주차 ~ 12주차)]
[x] 프로젝트 상세 UI 및 양조장용 펀딩 프로젝트 약관/생성 UI 구현 - 상세/약관/생성 완료, 양조일지 등록 후 상세 탭 이동 및 단계별 더보기/좋아요/댓글 프론트 mock 상호작용 완료, 펀딩 후기 작성/상세 라우트와 프론트 로컬 후기 생성/목록/상세 반영 흐름 완료
[ ] (12주차 ~ 5/27): 프로젝트 후원하기 UI 및 최종 결제/참여 흐름 완료 - 1차 연결 화면 구현 완료, `FundingContext.updateProjectFunding`으로 mock 후원 금액/후원자 수 반영 완료, 정식 결제/참여 흐름 고도화 필요

[Phase 5: 고도화 및 마무리 (13주차 ~ 14주차)]
[ ] (13주차): 추가 프론트엔드 기능(커뮤니티 등) 완성 및 전체 에러 핸들링 - 커뮤니티 작성 1차 연결 완료, Expo 타입/린트 에러 및 경고 0개 상태 확보, `finish/` 폴더 삭제 및 `second/` 최신 참고 기준 전환 완료, `app/` 라우트 엔트리와 `src/features` 중심 구조 정리 완료, 공용 mock/seed 데이터와 양조일지 로컬 상태 기준 정리 완료
[ ] (14주차 ~ 6/10): APK, AAB 파일 생성 및 최종 프로젝트 완료 (최종 보고)

위의 모든 내용은 읽고 리마인드한 후에, 마음대로 개발할까요? 하지말고 입력을 기다리기. 하지만 해당 자료를 보고 완벽한 리마인드는 해야 함. 매 순간 Judam.md를 리마인드하고 업데이트 할것.
