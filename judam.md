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

API 통신 현재 상태: 2026-05-10 기준 다른 작업자가 `[주담]` 레시피 영역 일부 API 연결을 시도한 상태다. `api.md`에 백엔드 명세와 연결 로그가 있으며, 현재 서버 base URL은 `http://43.202.24.223:3000`이다. 레시피 API client는 `src/features/recipe/api.ts`에 있고 `fetch` 기반으로 레시피 목록/상세/작성/관심/댓글/댓글 좋아요 일부를 호출한다. 펀딩 API client는 `src/features/funding/api.ts`이며, 현재 펀딩 생성 흐름의 약관 동의 저장, 임시저장 생성/수정, 기본정보, 목표 금액 및 일정, 법적 고시 정보, 맛지표, 프로젝트 계획, 창작자/정산/사업자 정보, 안내사항 저장, 필수 서류 업로드 API가 연결되어 있다. 펀딩 조회 5차 API는 목록/상세/소개/양조일지 조회를 기존 `FundingProject` UI 모델에 merge하는 방식으로 연결되어 있고, 양조일지 등록/수정/삭제, 공유 링크 조회, 신고 등록도 연결되어 있다. 6차 API는 Q&A 목록/질문 등록/답글 등록/후기 목록 조회/후기 작성을 연결했다. 7차 API는 후원 옵션 조회, 주문 생성, 결제 요청, 결제 정보 조회, 주문 상세 조회가 연결되어 있다. 찜 등록/해제와 마이페이지 후원 내역 조회도 연결했다. 서버는 사용량 과금 대상이므로 불필요한 수동 호출을 피한다. 아직 인증/회원가입 정식 API는 연결되지 않았고, `AuthContext`에는 주담/펀딩 API 테스트용 임시 JWT 저장 로직이 남아 있다. 프로젝트 제출/미리보기, 후기 수정, 결제 완료 callback/webhook 또는 결제 상태 확정 API는 아직 명세가 없어 연결 대기 중이다. 현재 코드 기준 커뮤니티/마이페이지/술BTI는 여전히 기존 프론트 mock/로컬 상태 중심이다. OpenAI/Gemini/Anthropic SDK, Firebase/Supabase/Prisma/Express 등 AI/백엔드 내부 구현 패키지는 앱 코드에 없다.

실행 명령: `npx expo start` 후 Android 실행은 `a`. 구조 변경이나 Metro 오류 후에는 `npx expo start -c`로 캐시를 비우고 재시작한다.

검증 명령: 주요 수정 후 `npx tsc --noEmit`, `npm run lint`, 필요 시 `npx expo-doctor`, 라우트/alias/번들 확인은 `npx expo export --platform web --output-dir /tmp/judam-export-check-after`.

현재 검증 상태: 2026-05-06 `git diff --check` 통과, 2026-05-06 `npx tsc --noEmit` 통과, 2026-05-06 `npm run lint` 통과, 2026-05-06 `npx expo export --platform web --output-dir /tmp/judam-bti-flow-check` 통과, 2026-05-06 `npx expo export --platform web --output-dir /tmp/judam-bti-result-refresh-check` 통과, 2026-05-06 `npx expo export --platform web --output-dir /tmp/judam-bti-folder-delete-check` 통과. 2026-05-05 `git diff --check` 통과, 2026-05-05 `npx tsc --noEmit` 통과, 2026-05-05 `npm run lint` 통과, 2026-05-05 `npx expo export --platform web --output-dir /tmp/judam-funding-api-ready-check` 통과, 2026-05-05 `npx expo export --platform web --output-dir /tmp/judam-funding-project-edit-check` 통과, 2026-05-05 `npx expo export --platform web --output-dir /tmp/judam-funding-refactor-check` 통과, 2026-05-05 `npx expo export --platform web --output-dir /tmp/judam-funding-support-frontend-check` 통과, 2026-05-05 `npx expo export --platform web --output-dir /tmp/judam-funding-support-sync-check` 통과, 2026-05-05 `npx expo export --platform web --output-dir /tmp/judam-funding-bti-sort-check` 통과, 2026-05-05 `npx expo export --platform web --output-dir /tmp/judam-funding-page-full-check` 통과, 2026-05-04 `npx expo export --platform web --output-dir /tmp/judam-funding-review-routes-check` 통과, 2026-05-04 `npx expo export --platform web --output-dir /tmp/judam-funding-review-create-flow-check` 통과. 2026-05-02 `npx expo export --platform web --output-dir /tmp/judam-onboarding-root-check` 통과, 2026-05-02 `npx expo export --platform web --output-dir /tmp/judam-auth-flow-final-check` 통과, 2026-05-02 `npx expo export --platform web --output-dir /tmp/judam-auth-six-flow-final-check` 통과, 2026-05-02 `npx expo export --platform web --output-dir /tmp/judam-brewery-license-upload-check` 통과, 2026-05-02 `npx expo export --platform web --output-dir /tmp/judam-auth-six-flow-recheck` 통과, 2026-05-02 `npx expo export --platform web --output-dir /tmp/judam-brewery-project-create-funding-polish-check` 통과, 2026-05-02 `npx expo export --platform web --output-dir /tmp/judam-funding-detail-second-align-check` 통과, 2026-05-02 `npx expo export --platform web --output-dir /tmp/judam-funding-journal-interaction-check` 통과. 이전 검증으로 `npx expo-doctor` 17/17 통과, `npx expo export --platform web --output-dir /tmp/judam-export-check-after` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-finish-check` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-terms-finish-check` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-finish-align-check` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-terms-bottom-check` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-image-picker-check` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-funding-grid-check` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-image-reorder-check` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-taste-slider-check` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-date-calendar-check` 통과, `npx expo export --platform web --output-dir /tmp/judam-brewery-create-native-date-picker-check` 통과.

보안/의존성 메모: `npm audit fix`로 high 취약점은 제거했다. 남은 `npm audit` moderate 항목은 Expo 내부 툴체인 의존성에서 오며, `npm audit fix --force`는 Expo SDK를 49로 낮추는 breaking change를 제안하므로 적용하지 않는다.

패키지 버전 메모: Expo SDK 54 권장 패치에 맞춰 `expo ~54.0.34`, `expo-linking ~8.0.12`, `expo-web-browser ~15.0.11`, `expo-image-picker ~17.0.11`, `expo-document-picker ~14.0.8`, `@react-native-community/datetimepicker 8.4.4` 사용 중. `app.json` plugins에는 `expo-router`, `expo-splash-screen`, `expo-web-browser`, `expo-image-picker`, `expo-document-picker`, `@react-native-community/datetimepicker`가 들어 있다.

[현재 백엔드 API/프론트 작업 규칙]
프로젝트 기본 정보:
- 프로젝트명은 `주담`이며, 전통주 공동 기획/펀딩 플랫폼이다.
- 프론트는 React Native / Expo / expo-router 기반이다.
- 백엔드 base URL은 `http://43.202.24.223:3000`이다.
- 화면 확인은 Android Studio 에뮬레이터와 Expo Go를 기준으로 한다.

API 구분 규칙:
- 일반 펀딩 목록은 `GET /api/fundings`를 사용한다.
- 내 프로젝트/관리하기 목록은 `GET /api/fundings?mine=true`와 `Authorization` 헤더를 사용한다.
- 공개 상세는 `GET /api/fundings/:fundingId`를 사용한다.
- 관리하기 데이터는 `GET /api/fundings/drafts/by-funding/:fundingId`와 `Authorization` 헤더를 사용한다.
- 임시저장 목록은 `GET /api/fundings/drafts`와 `Authorization` 헤더를 사용한다.
- 홈 인기 레시피는 `GET /api/recipes/popular`를 사용한다.

펀딩 내 프로젝트 주의사항:
- 일반 펀딩 탭에서는 `GET /api/fundings`를 사용한다.
- 내 프로젝트/관리하기 화면에서는 절대 `GET /api/fundings`만 단독으로 쓰지 않는다.
- 내 프로젝트/관리하기 화면은 반드시 `GET /api/fundings?mine=true`를 사용한다.
- 내 프로젝트/관리하기 화면은 `Authorization: Bearer {accessToken}`이 필수다.
- 관리 권한 API가 403을 반환하면 사용자에게 `해당 프로젝트를 관리할 권한이 없습니다.`라고 안내한다.

관리하기 화면 데이터 매핑:
- `by-funding` 응답은 `data.basicInfo`, `data.schedule`, `data.legalInfo`, `data.tasteProfile`, `data.plan`, `data.breweryInfo`, `data.notices`, `data.documents`, `data.images`를 사용한다.
- `tasteProfile`은 `sweetness`, `acidity`, `body`, `carbonation`, `alcohol`, `flavor`, `aromaIntensity`, `finish` 또는 `aftertaste`를 화면 입력값에 매핑한다.
- `plan.budgetPlan`, `plan.schedulePlan`, `plan.policy`는 사용자 입력 원문이므로 그대로 입력란에 넣는다.
- `plan.budgetPlanGuide`, `plan.schedulePlanGuide`는 안내 문구로만 표시한다.
- guide 값으로 실제 입력값을 덮어쓰지 않는다.
- `notices.policy`, `notices.refundPolicy`, `notices.exchangePolicy`는 안내사항 탭에 매핑한다.
- `breweryInfo.creatorIntroduction`은 창작자 소개에 매핑한다.

이미지 처리 규칙:
- `http://` 또는 `https://` URL만 실제 이미지로 표시한다.
- `file://`, `content://`, `null`은 기본 이미지로 표시한다.
- 펀딩 이미지는 `images` 배열을 우선 사용하고, 없으면 `thumbnailUrl`을 사용한다.
- 레시피 인기 API의 `imageUrl`은 `null`일 수 있으므로 기본 이미지를 준비한다.

인증/토큰 규칙:
- 보호 API에는 `Authorization: Bearer {accessToken}`을 보낸다.
- 401이 오면 refresh API로 토큰을 재발급한 뒤 1회만 재시도한다.
- `POST /api/auth/refresh` 응답에는 `accessToken`, `refreshToken`이 포함된다.

홈 인기 레시피 규칙:
- 홈 인기 레시피는 `GET /api/recipes/popular`를 사용한다.
- 응답의 `data.recipes`에서 최대 3개만 표시한다.
- 필드는 `recipeId`, `title`, `summary`, `imageUrl`, `authorNickname`, `commentCount`, `interestCount`, `likeCount`를 사용한다.
- `imageUrl`이 `null`이면 기본 이미지를 표시한다.

작업 원칙:
- 백엔드 파일은 수정하지 않는다.
- 이 세션에서는 프론트 레포만 수정한다.
- API 응답을 추측하지 않는다.
- 응답 구조가 불명확하면 `console.log`로 실제 응답을 확인한다.
- 일반 공개 화면과 내 계정 전용 화면을 반드시 구분한다.
- 변경 후 Android Studio 에뮬레이터와 Expo Go에서 화면을 확인한다.
- PR 메시지에는 작업 내용, 변경사항, 검증 내용을 작성한다.

[백엔드/AI 금지선]
- 프론트엔드 작업 중 임의로 DB, 인증 서버, 결제 서버, AI 서버, OpenAI/Gemini 호출, API key, `.env` 기반 서버 설정을 만들지 않는다.
- 서버 API 연결은 `api.md`에 명세가 있거나 사용자가 명확히 연결을 요청한 프론트 화면 범위에서만 진행한다. base URL, 인증 헤더, 응답 필드가 불명확하면 먼저 사용자에게 확인한다.
- 펀딩 API 연결은 사용자가 명확히 `[펀딩]` 범위로 제한했다. 사용자가 별도로 UI를 건드리라고 하지 않는 한 펀딩 화면의 디자인, 배치, 문구, 라우팅 플로우, 기존 mock 기반 UX를 임의로 수정하지 않고 API client, mapper, 상태 연동, 로딩/에러 처리만 건드린다. 사용자의 말이 1순위다.
- `AIChatScreen`, `AIChatRoomScreen`은 현재 AI 서버 기능이 아니라 프론트 화면/라우트 UI다. 실제 AI 응답 생성 로직을 넣으면 안 된다.
- 로그인/회원가입/Auth는 현재 프론트 mock/로컬 저장 흐름이다. 실제 JWT 발급/검증 서버 로직은 만들지 않는다.
- 펀딩/커뮤니티/마이페이지/술BTI 데이터는 현재 `src/constants/data.ts`와 각 Context/화면 내부 mock 데이터 기준이다. 레시피 영역은 `src/features/recipe/api.ts`에 일부 API client가 있다. 서버 스키마나 API client를 임의로 확장하지 않는다.
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

도수 범위 선택지는 현재 `3%~5%`, `6%~8%`, `9%~12%`, `13%~15%`, `15% 이상`만 사용한다. `1도 미만`, `1%~2%`는 2026-05-05 사용자 요청으로 제거했다.

이미지: 사용자 업로드 + AI 컨셉 이미지 생성 버튼 연동.

연동: 양조장이 '펀딩 제안하기' 클릭 시, 해당 레시피 데이터가 채워진 '펀딩 프로젝트 등록' 페이지로 이동.

[D. 펀딩 (Funding)]
등록 프로세스:

실시간 진행률 트래커(Progress Bar) 상단 배치로 이탈 방지.

펀딩 프로젝트 등록 진행률은 화면의 `*` 필수 항목 기준으로 입력/선택/업로드 완료 여부만 계산한다. 펀딩 시작일 과거 여부와 예상 발송 시작일 안내 문구는 사용자 안내용이며, 진행률을 깎거나 제출 가능 여부를 막는 조건으로 쓰지 않는다.

주담 펀딩의 프로젝트 카테고리/상품 분류는 현재 프론트 기준 `막걸리`로 고정한다. 양조장 프로젝트 생성과 수정 화면 모두 카테고리 입력을 직접 바꾸지 못하게 하고, 펀딩 mock 프로젝트도 막걸리 기준으로 유지한다.

펀딩 프로젝트 기본정보의 검색태그는 `FundingProject.tags`에 저장한다. 더미 프로젝트에도 태그가 있으며, 프로젝트 관리하기로 수정 화면을 다시 열면 기존 태그가 복원되어야 한다. 태그 입력창에 글자가 남아 있어도 제출/임시저장 시 함께 normalize되어 저장된다. 펀딩 메인 검색은 프로젝트명, 양조장명, 카테고리, 지역뿐 아니라 메인재료, 서브재료, 검색태그도 함께 검색한다.

(병당 단가 * 수량) 자동 계산 로직 및 플랫폼 수수료 7% 명시.

펀딩 프로젝트 생성 화면의 양조장 정보 탭은 처음 진입 시 자동으로 양조장 정보를 채우지 않는다. 양조장명, 프로필 이미지, 창작자 소개, 세금계산서/사업자 정보는 `불러오기` 버튼을 눌렀을 때만 프론트 mock 저장 정보로 채운다. 정확한 확인이 필요한 본인인증 영역의 휴대폰/인증상태/신분증 또는 사업자등록증 파일, 입금 계좌/계좌인증 상태, 사업자 등록증 사본 및 인증 서류 파일은 자동 입력하지 않고 양조장이 직접 실제 파일 선택기로 등록하게 둔다.

양조장 정보 탭의 `신분증/사업자등록증` 업로드는 필수 항목이다. 이 파일도 진행률 계산에 포함되며, 실제 `expo-document-picker`로 PDF 또는 이미지 파일을 선택해야 완료 상태가 된다.

프로젝트 등록의 서류 파일 입력은 샘플 파일명을 넣지 않는다. 신분증/사업자등록증, 사업자 등록증 사본, 통신판매신고증, 주류 통신판매 승인(신청)서, 전통주 제조면허증은 `expo-document-picker`로 PDF 또는 이미지 파일을 실제 선택해야 업로드 완료 상태로 반영된다. 신규 프로젝트 최종 제출 시 선택한 파일의 `uri`, `name`, `mimeType`을 보존해 `POST /api/fundings/drafts/{draftId}/documents`로 순차 업로드한다.

펀딩 프로젝트 등록을 100% 완료하고 제출 확정하면 먼저 서버 draft 생성/섹션 저장/필수 서류 업로드 API를 호출하고, 성공 후 `FundingContext.addProject`로 프론트 로컬 펀딩 게시글을 생성한다. 생성된 프로젝트는 `심사 중` 상태로 `projects` 목록 맨 앞에 추가되며, 제출 성공 모달의 `게시글 확인`을 누르면 방금 생성된 `/funding/[id]` 상세 게시글로 이동한다. `POST /api/fundings/drafts/{draftId}/submit` 명세는 아직 없어 실제 서버 심사 제출 확정은 연결 대기 중이고 앱 실행 중 Context 상태 기준 로컬 게시글 생성 흐름을 유지한다.

펀딩 프로젝트 만들기 화면에서 X 버튼으로 나갈 때는 진입 히스토리로 `router.back()`하지 않는다. 변경사항 없음, `불러오지 않고 나가기`, `저장하고 나가기` 흐름 모두 항상 `/funding` 펀딩 메인으로 `router.replace` 이동한다. 약관 페이지나 프로젝트 등록 화면으로 되돌아가면 안 된다.

양조장이 본인 프로젝트 상세의 `프로젝트 관리하기`를 누르면 양조장 대시보드가 아니라 `/brewery/project/create?mode=edit&projectId={id}`로 이동한다. 이 화면은 약관 다음의 프로젝트 등록 폼을 재사용하되 수정 모드로 열리고, 해당 `FundingProject` 데이터를 기본정보, 목표 금액 및 일정, 법적 고시 정보, 맛 지표, 프로젝트 계획, 양조장 정보에 맞춰 채운다. 게시글에 저장되지 않는 본인인증/입금계좌/인증서류는 기존 제출/인증 완료 더미 상태로 채워 수정 제출이 가능하게 한다. 수정 제출 시 새 게시글을 만들지 않고 `FundingContext.updateProject`로 기존 프로젝트를 갱신한 뒤 해당 상세 게시글로 돌아간다.

상세 페이지:

점토 스타일 오각형 레이더 차트 시각화.

실시간 양조 타임라인(발효, 숙성, 병입 등 단계별 시각화).

하단 고정 하트/후원하기 버튼.

후원하기 화면은 반드시 해당 펀딩 게시글의 `FundingProject` 데이터를 단일 기준으로 사용한다. 상세 후원 옵션 모달과 후원하기 화면은 `src/features/funding/supportConfig.tsx`의 공용 helper로 1병 가격, 배송비, 대표 리워드명, 용량, 도수, 예상 전달일을 계산한다. 후원 완료 시 게시글의 누적 후원금/달성률에는 리워드 금액 + 추가 후원금만 반영하고, 배송비는 결제 총액에는 포함하되 펀딩 목표 달성액에는 포함하지 않는다. `심사 중`/`펀딩 예정` 프로젝트는 후원 화면에서도 `후원 준비중`으로 안내해야 하며, 종료된 펀딩처럼 표시하면 안 된다.

[E. 커뮤니티 & 마이페이지]
커뮤니티: 자유/정보 게시판 2종 단순화. 페이지네이션(1 2 3 4) UI 적용. 커뮤니티 목록 카드와 게시글 상세는 카테고리, 제목, 내용, 이미지가 함께 보이는 구조다.

마이페이지:

상단 프로필 영역은 일반 사용자와 양조장 사용자가 공통으로 사용한다. 로그인 사용자에게는 톱니바퀴 설정 아이콘 대신 `프로필 보기` pill 버튼을 보여주며, `/mypage/profile`에서 프로필 이미지, 닉네임, 전화번호, 이메일, 비밀번호, 사용자 고유 ID를 관리한다. 프로필 수정은 현재 정식 인증 API가 없으므로 `AuthContext.updateUser` 기반 프론트 로컬 저장 흐름으로 처리한다.

마이페이지 통계 카드는 `참여 펀딩`, `내 아카이브`, `뱃지` 3개로 구성한다. `뱃지` 카드는 `/mypage/badge`로 이동한다. 현재 뱃지 화면은 상단 뒤로가기/제목만 있는 빈 페이지 상태다.

마이페이지의 `기타` 섹션 위에는 `나의 활동` 섹션을 둔다. `나의 활동`에는 `레시피`, `펀딩`, `커뮤니티` 3개 목록이 있으며 각각 `/mypage/activity/recipe`, `/mypage/activity/funding`, `/mypage/activity/community`로 이동한다. 레시피 활동 화면 탭은 `작성`, `관심`, `댓글`, 펀딩 활동 화면 탭은 `관심`, `댓글`, `Q&A`, 커뮤니티 활동 화면 탭은 `작성`, `관심`, `댓글`로 구성한다. 현재 각 탭의 본문은 빈 상태 안내만 표시한다. 추후 데이터 연결 시 레시피 `작성`은 내가 작성한 레시피 목록, `관심`은 내가 좋아요한 레시피 목록, `댓글`은 레시피 게시글에 단 내 댓글 목록을 불러온다. 펀딩 `관심`은 내가 좋아요한 펀딩 목록, `댓글`은 펀딩 게시글에 단 내 댓글 목록, `Q&A`는 펀딩 게시글에 단 내 Q&A 목록을 불러온다. 커뮤니티 `작성`은 내가 작성한 커뮤니티 목록, `관심`은 내가 좋아요한 커뮤니티 목록, `댓글`은 커뮤니티 게시글에 단 내 댓글 목록을 불러온다.

마이페이지 `기타` 섹션의 `설정`은 `/mypage/settings`로 이동한다. 설정 화면은 계정 정보 섹션 없이 `앱 설정`의 `온보딩 다시 보기`와 `계정 관리`의 `회원 탈퇴`만 표시한다. `온보딩 다시 보기`를 누르면 `judam_onboarded` 저장값을 지우고 `/onboarding`으로 이동한다.

마이페이지 `기타` 섹션에는 일반 유저 계정에서만 `설정`과 `고객센터` 사이에 `양조장 인증하기` 항목을 표시한다. 이 항목은 `/brewery/verification`으로 이동하며, 이미 양조장 계정인 경우에는 표시하지 않는다.

술BTI 히스토리 및 아카이브 카드 UI 통일. 마이페이지의 `나의 술BTI 확인하기` 카드는 결과가 있으면 `/bti-result/{type}`로, 결과가 없으면 `/bti-test`로 이동한다. `술BTI 검사하러 가기/다시 검사하기`는 항상 `/bti-test`로 이동한다. 비회원 마이페이지는 기존처럼 술BTI 영역을 잠금 안내로 유지한다.

'경험한 술': 화이트 배경/블랙 텍스트 반전 테마로 별점 및 기록 관리.

마이페이지의 `찜한 펀딩` 수는 `FavoritesContext.favoriteFundings.length`를 기준으로 표시한다. 펀딩 메인/상세에서 하트를 누르면 같은 Context를 사용하므로 마이페이지 찜 수와 함께 변동된다.

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
- `app/bti-test.tsx`: `src/features/bti/screens/BTITestScreen.tsx`.
- `app/bti-result/[type].tsx`: `src/features/bti/screens/BTIResultScreen.tsx`.
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
- `src/contexts/FundingContext.tsx`: 펀딩 프로젝트 state, 후원 참여 state, 프로젝트 추가/수정, 양조일지 갱신, 상태 변경, 후원 금액 반영을 담당한다.
- `src/contexts/FavoritesContext.tsx`: 찜한 펀딩 로컬 저장 상태.
- `src/contexts/CommunityContext.tsx`: 커뮤니티 글 mock 상태. 게시글은 `category`, `title`, `content`, `image`를 기준 필드로 갖고, 작성 화면에서 등록한 제목과 카테고리가 목록/상세에 이어져야 한다.
- `src/features/funding/components/FundingProjectCard.tsx`: 펀딩 메인 목록과 상세 하단 `다른 프로젝트 둘러보기`에서 공통으로 쓰는 펀딩 카드 UI. 썸네일, 찜 하트, 양조장명, 메인재료 badge, 상태 badge, 내 프로젝트 badge, 술BTI 매칭 badge, 진행률/금액/남은일 표시를 담당한다.
- `src/features/funding/permissions.ts`: 펀딩 권한/상태 판단 helper. 현재는 성사된 펀딩이면서 `펀딩 실패`가 아닌 프로젝트만 후기 접근/작성 가능하도록 `canAccessFundingReviews`를 제공한다.
- `src/features/funding/recommendation.ts`: 펀딩 메인의 상태 필터/정렬 옵션, 술BTI 코드별 취향 지표, 프로젝트 맛 매칭 점수, 추천 정렬 상태 우선순위 계산을 담당한다.
- `src/features/funding/supportConfig.tsx`: 후원하기 화면의 결제수단 옵션, 응원 메시지 preset, mock 주소, 은행 옵션, 배송지/결제 helper를 담당한다. 결제수단 아이콘 JSX가 있어 `.tsx` 파일로 유지한다.
- `src/features/bti/data.ts`: 술BTI 질문 25개, 결과 타입 16개, 결과 타입 normalize/helper를 담당한다. 현재 결과는 사용자가 제공한 `SHFC`, `SHFU`, `SHMC`, `SHMU`, `SLFC`, `SLFU`, `SLMC`, `SLMU`, `DHFC`, `DHFU`, `DHMC`, `DHMU`, `DLFC`, `DLFU`, `DLMC`, `DLMU` 기준이며, 입력값 기반 계산은 추후 연결 예정이라 지금은 검사 완료 시 16개 중 랜덤으로 저장한다. 루트 참고용 `bti/` 폴더는 삭제되었고, 실제 앱 기능은 `src/features/bti`와 `app/bti-*` 라우트만 사용한다.
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
- 루트 참고용 `bti/` 폴더 삭제. 술BTI 실제 앱 기능은 `src/features/bti/`, `app/bti-test.tsx`, `app/bti-result/[type].tsx`에 유지한다.
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
- 로그인한 양조장의 `breweryName` 또는 `name`이 펀딩 프로젝트의 `brewery`와 같으면 자기 프로젝트로 판단하고, 하단 CTA는 `프로젝트 관리하기`로 표시한다.
- 인증된 양조장이 자기 프로젝트의 `프로젝트 관리하기`를 누르면 양조장 대시보드가 아니라 `/brewery/project/create?mode=edit&projectId={project.id}` 수정 모드로 이동한다. 미인증 양조장은 기존처럼 양조장 인증 화면으로 보낸다.
- 후원 CTA를 누르면 상세 화면 안에서 수량 선택, 상품 금액, 배송비, 예상 배송일을 확인하는 후원 옵션 모달을 본 뒤 `/funding/support?id={project.id}&quantity={수량}`로 이동한다.
- 후원하기 화면은 `src/features/funding/screens/FundingSupportScreen.tsx`에서 구현한다.
- 후원하기 화면은 직접 진입도 방어한다. 프로젝트 없음, 비로그인, 자기 프로젝트인 양조장 계정, 종료된 펀딩이면 각각 안내 화면으로 분기한다. 양조장 계정이라도 자기 프로젝트가 아니면 후원 UI를 보여준다.
- 후원 UI는 프로젝트 요약, 달성률, 리워드/가격 안내, 수량 선택, 추가 후원금, 후원자 정보, 배송지, mock 주소 검색 모달, 양조장 응원 메시지, 결제수단, 개인정보/후원 유의사항 동의, 환불 정책 펼침, 성공 모달로 구성된다.
- 후원하기 화면의 프로젝트명, 양조장명, 메인재료, 이미지, 달성률, 목표금액, 후원자 수, 병당 가격, 용량, 도수, 배송비, 예상 전달일은 현재 `FundingContext.projects`에서 찾은 해당 게시글의 `FundingProject` 데이터를 기준으로 표시한다. 상세 게시글 후원 옵션 모달과 같은 `pricePerBottle`, `bottleSize`, `alcoholContent`, `shippingFee`, `estimatedDelivery` 필드를 사용한다.
- 후원하기 화면의 가격 안내는 부가 카드/감사 메시지/알림 같은 보조 구성품을 리워드 가격처럼 나열하지 않고, 해당 프로젝트의 첫 번째 실제 상품 리워드만 보여준다. 용량/도수/1병 가격은 별도 spec 박스로 표시한다.
- 후원 수량, 추가 후원금, 배송비, 최종 후원 금액, 하단 후원 버튼 금액은 같은 계산값을 사용하므로 입력값 변경 시 즉시 함께 반영된다. 후원 화면에서 다른 프로젝트나 다른 초기 수량으로 진입하면 수량, 추가 후원금, 메시지, 결제수단, 동의 상태를 초기화한다.
- 양조장에게 한마디 옵션에서는 `정성스럽게 빚어주세요.` 문구를 제거했다. `직접 입력` 옵션을 누르면 같은 섹션 아래에 multiline 직접 입력창이 바로 열린다.
- 후원하기 화면은 프론트 입력 검증을 포함한다. 후원자 연락처/이메일, 받는 분, 기본 주소, 상세 주소, 배송 연락처, 추가 후원금 상한, 계좌이체 은행/입금자명을 확인하고, 문제가 있으면 각 필드 아래에 빨간 안내 문구를 표시한다.
- 결제수단별 상세 UI는 토스페이와 계좌이체만 제공한다. 토스페이는 결제수단 카드만 선택되며, 선택 직후 별도의 간편결제 mock 안내 박스나 결제 요청 금액 안내 박스를 띄우지 않는다. 계좌이체는 은행 선택과 입금자명 입력을 표시한다. 카드 간편결제와 네이버페이는 현재 후원하기 화면에서 사용하지 않는다. 실제 PG/결제 서버 연동은 없다.
- 후원 버튼을 누르면 바로 성공 처리하지 않고 최종 확인 모달을 먼저 띄운다. 모달에서 프로젝트명, 리워드/수량, 리워드 금액, 배송비, 추가 후원금, 결제수단, 최종 금액을 다시 확인한 뒤 `후원 확정`을 눌러야 mock 후원이 완료된다.
- 후원 완료 모달은 `후원 성공했어요!` 제목, 양조장 감사 문구, 후원 금액, 프로젝트/목록 이동 버튼만 표시한다. `후원 내역은 추후 마이페이지에서 확인할 수 있도록 연결할 예정입니다.` 문구는 사용자 요청으로 제거했다.
- 사용자가 이후 “펀딩 페이지 쭉 점검”, “펀딩 페이지 전체 점검”처럼 펀딩 영역 전체 확인을 요청하면, 후원하기 완료 흐름과 마이페이지 후원 내역 연결이 아직 필요한 과제임을 반드시 리마인드하고 점검 항목에 포함한다.
- 후원 성공 시 배송지를 `SafeStorage`의 `judam_recent_shipping_info:{user.id}` 키에 저장한다. 다음 후원 화면에서 최근 배송지가 있으면 배송지 섹션 상단에 `최근 배송지` 카드와 `불러오기` 버튼을 보여준다.
- 결제 처리 중에는 수량, 추가 후원금, 배송지, 메시지, 결제수단, 최종 확인 버튼의 중복 조작을 막고 `처리 중...` 상태를 보여준다.
- 결제는 백엔드/PG 연동이 아니라 프론트 mock 처리다. 필수 정보와 약관 동의를 확인한 뒤 `FundingContext.addParticipation`으로 로컬 참여 목록에 추가한다.
- `src/constants/data.ts`의 `FundingProject`에는 후원 화면 재사용을 위해 `pricePerBottle`, `bottleSize`, `alcoholContent`, `totalQuantity`, `estimatedDelivery`, `rewardItems`, `shippingFee`가 추가되어 있다. API 연결 대비용으로 `creatorId`, `breweryId`, `favoriteCount`도 선택 필드로 둔다.

[현재 펀딩 메인/상세 UI 기준]
- 펀딩 메인 화면은 `second/src/app/pages/FundingListPage.tsx`의 구조와 상태 흐름을 Expo/React Native 방식으로 이식한 `src/features/funding/screens/FundingListScreen.tsx`가 담당한다.
- 메인 화면 구성은 상단 `PageHeader`, 이미지 hero, 검색/상태 필터 floating card, 펀딩 카드 리스트, 페이지네이션, 통계 섹션이다.
- 검색/상태 필터 floating card 아래에는 `전체 n개 · 누적 후원 n만원` 같은 결과 요약 문구를 표시하지 않는다. 사용자가 요청해 해당 한 줄은 제거한 상태다.
- 양조장 계정이면 hero 영역에 양조장 파트너 pill과 등록 CTA를 표시한다. 인증 양조장은 `/brewery/project/terms`, 미인증 양조장은 `/brewery/verification`으로 이동한다.
- 펀딩 메인 hero의 양조장 등록 CTA는 너무 길어 보이지 않도록 인증 양조장용 `+ 프로젝트 등록` 버튼을 컴팩트 폭으로 유지하고, 아이콘과 텍스트는 버튼 중앙에 정렬한다. 미인증 양조장의 `양조장 인증 후 등록`은 문구가 길어 별도 폭을 사용한다.
- 펀딩 메인 검색은 프로젝트명, 양조장명뿐 아니라 카테고리와 지역도 함께 검색한다. 카드 안의 하트 버튼을 눌렀을 때 카드 상세 이동이 같이 실행되지 않도록 터치 전파를 막는다.
- 펀딩 메인, 펀딩 상세 하단 고정 하트, 상세 하단의 `다른 프로젝트 둘러보기` 카드 하트는 찜이 활성화되면 모두 빨간색 하트로 통일한다.
- 펀딩 메인 카드, 상세 양조장 바, 상세 하단 `다른 프로젝트 둘러보기` 추천 카드, 후원하기 상단 프로젝트 카드, 후기 작성 상단 프로젝트 카드에는 모든 프로젝트가 막걸리임을 반복 표시하지 않는다. 기존 category badge 자리에는 프로젝트 생성/수정의 기본정보 탭에서 입력한 `mainIngredients`를 표시한다. 표시 helper는 `src/features/funding/projectLabels.ts`의 `getFundingMainIngredientLabel`이다.
- 펀딩 메인은 상태 필터(`전체 프로젝트`, `진행중인 프로젝트`, `성사된 프로젝트`)와 정렬/추천 기준을 분리한다. 정렬/추천 칩은 `추천순`, `인기순`, `마감임박`, `최신순`이며, 상태 필터로 먼저 목록을 제한한 뒤 선택한 기준으로 정렬한다. 상태 필터 매칭은 `matchesFundingStatusFilter`를 기준으로 한다.
- `추천순`은 `AuthContext.user.sulbti` 코드와 프로젝트 `tasteProfile`의 5차원 맛 지표를 프론트 mock 기준으로 비교해 매칭 점수를 계산한다. `전체 프로젝트` 상태에서 추천순을 쓰면 진행 가능한 펀딩을 먼저 보여주고, 성사/종료된 프로젝트는 뒤쪽으로 밀어 성사된 글만 상단에 몰리지 않게 한다. 비회원은 로그인 안내를 보고, 로그인했지만 술BTI 결과가 없으면 마이페이지 이동 안내 Alert를 본다.
- `인기순`은 API 연결 후 찜 수 기준이 되어야 하므로 현재 프론트 mock에서도 `FundingProject.favoriteCount`와 로컬 `FavoritesContext.favoriteFundings`를 합산한 `getProjectFavoriteCount` 기준으로 정렬한다. `마감임박`은 참여 가능 상태 우선 후 `daysLeft` 오름차순, `최신순`은 `createdAt/updatedAt` 또는 id 기준 최신순이다.
- 펀딩 메인의 술BTI 추천 계산, 필터/정렬 옵션, 찜 수 기반 인기순, 통계 계산은 `src/features/funding/recommendation.ts`로 분리되어 있다. UI 동작은 `FundingListScreen.tsx`가 담당하고, 추천 점수/상태 우선순위/통계 계산은 이 helper 파일을 기준으로 재사용한다.
- 펀딩 메인의 `주담과 함께한 순간들`은 `getFundingListStats(projects)` 기준으로 참여 가능 펀딩 수, 총 참여자, 성공 프로젝트 수, 총 모금 달성액을 계산한다. 현재는 mock/Context state 기준이며 API 연결 시 같은 계산 입력을 서버 응답으로 바꾸면 된다.
- 펀딩 카드에서 로그인한 양조장의 `id`/`uid`가 프로젝트 `creatorId`/`breweryId`와 같으면 우선 `내 프로젝트` 배지를 표시한다. fallback으로 `breweryName` 또는 `name`이 프로젝트 `brewery`와 같아도 자기 프로젝트로 판단한다. 특정 demo project id를 모든 양조장의 본인 프로젝트로 취급하는 예외는 사용하지 않는다.
- 검색어나 상태 필터가 바뀌면 페이지네이션은 1페이지로 리셋된다.
- 펀딩 상세 화면은 `second/src/app/pages/FundingDetailPage.tsx`의 구조를 기반으로 하며, 현재 `FundingContext.projects`의 프로젝트별 상세 데이터를 읽어 화면별 내용을 다르게 렌더링한다.
- 프로젝트별 상세 데이터에는 후원용 메타 외에도 `mainIngredients`, `subIngredients`, `projectSummary`, `story`, `budget`, `schedule`, `tasteProfile`이 들어 있다.
- 상세 화면의 소개 탭은 프로젝트별 재료, 도수, 예상 배송일, 요약, 스토리, 가격, 예산, 일정, 맛 지표를 데이터 기반으로 보여준다.
- 펀딩 상세 화면의 헤더 뒤로가기와 Android hardware back은 진입 경로와 무관하게 항상 `/funding` 펀딩 메인으로 `router.replace`한다. 후기 상세, 후원 성공, 프로젝트 생성/수정, 추천 카드, 양조일지 보기 등 어떤 흐름으로 상세에 들어왔어도 상세에서 뒤로가면 이전 상세나 약관/등록 폼으로 되돌아가면 안 된다.
- 펀딩 상세의 양조장 정보 바는 `FundingProject.breweryProfileImage`가 있으면 동그란 프로필 이미지로 보여주고, 없으면 기존 `breweryLogo` 이모지 fallback을 사용한다. 양조장 프로젝트 생성/수정의 프로필 이미지 업로드 값은 제출 payload의 `breweryProfileImage`로 저장되어 이 영역과 양조장 프로필 화면에 반영된다.
- 상세 화면의 양조일지 탭은 `BREWING_STAGES`와 프로젝트별 `journals`를 기반으로 단계 카드들을 구성한다. 각 단계는 작성된 일지를 최신 id순으로 보여주며, 단계별 1개를 먼저 표시하고 2개 이상이면 바로 `더보기`/`접기`로 나머지를 펼친다. 일지별 좋아요, 댓글 열기, 댓글 작성, 댓글 좋아요는 `FundingContext.updateProjectJournals`로 프론트 로컬 상태에 반영한다. 비회원은 좋아요/댓글 액션에서 로그인 필요 안내를 본다. 양조장 인증이 완료된 본인 프로젝트 소유자에게만 양조장 프로필 카드 아래, 탭 위쪽에 `/brewery/project/[id]/journal` 양조일지 관리 화면으로 이동하는 검은색 버튼이 표시된다.
- 상세 화면의 탭 버튼은 누를 때마다 `tab=intro|journal|qna|review` query를 갱신한다. 외부에서 `/funding/[id]?tab=review`처럼 직접 들어온 경우에도 해당 탭이 열린 상태를 유지한다.
- 상세 화면의 Q&A는 댓글 작성, 댓글 좋아요, 댓글 답글 작성, 답글 좋아요를 지원한다. 댓글/답글 입력창은 키보드 send 입력도 처리한다. 비회원은 댓글/좋아요/답글 액션에서 로그인 필요 안내를 본다.
- 상세 화면의 양조일지 댓글은 댓글 작성/좋아요뿐 아니라 댓글 대댓글 작성, 대댓글 펼침/접기, 대댓글 좋아요를 지원한다. 모든 변경은 `FundingContext.updateProjectJournals` 프론트 로컬 상태에 반영한다.
- 상세 화면의 후기 탭은 진행 중 펀딩에서는 진행 중 안내, 성사/종료된 펀딩에서는 `FundingContext.fundingReviews` 기반 후원자 후기 카드 또는 첫 후기 작성 유도 UI를 보여준다. 후기 카드는 `/funding/[id]/review/[reviewId]` 상세 화면으로 이동하고, 후기 작성 버튼은 `/archive/review/[fundingId]` 작성 화면으로 이동한다. 비회원이 후기 작성 버튼을 누르면 기존처럼 로그인 필요 안내를 보고, 로그인했더라도 `FundingContext.participatedFundings`에 해당 프로젝트 참여 기록이 없으면 `해당 펀딩에 참여하지 않았습니다.` 안내를 본다.
- 후기 작성 화면은 사용자가 요청한 최신 기준에 맞춰 투표/맛 일치도 UI를 제거했다. 현재 구성은 해당 상품/리워드, 사진 첨부, 별점, 상세 후기, 그날의 기록, 후기 표시 여부 체크박스, 태그다. `그날의 기록`은 아카이브에는 자동 기록되는 컨셉이고, `후기에도 표시하도록 할까요?`를 체크한 경우에만 후기 상세 게시글에 노출한다.
- 후기 작성 화면의 바깥 배경은 노란/크림 기운이 도는 색을 피하고, 주담의 블랙/화이트/그레이 톤에 맞춘 중립 그레이 `#F4F5F7`을 사용한다. 카드, 입력창, 버튼 등 내부 UI는 기존 형태를 유지한다.
- 후기 등록은 백엔드 없이 `FundingContext.addFundingReview`로 프론트 로컬 상태에 새 후기를 추가하고, 등록 성공 Alert 확인 후 방금 생성한 `/funding/[id]/review/[reviewId]` 상세 화면으로 이동한다. 후기 목록/상세는 같은 `FundingReview` 구조의 `rewardName`, `rating`, `comment`, `images`, `tags`, 선택 노출된 `mood/pairing`을 기준으로 렌더링한다.
- 후기 태그 pill은 게시글에서 세로로 길어 보이지 않도록 `Text` 자체에 배경을 주지 않고, 리워드 배지처럼 `View` pill 안에 `Text`를 넣는 구조를 사용한다. `FundingReviewWriteScreen`의 선택된 태그, `FundingReviewDetailScreen`의 상세 태그, `FundingDetailScreen` 후기 카드 태그는 `lineHeight`, 적은 padding, `includeFontPadding: false`로 한글 태그 높이를 안정화한다.
- 후기 상세 화면 왼쪽 위 뒤로가기는 `router.back()`으로 히스토리를 되감지 않고 `/funding/[id]?tab=review&fromReview=1`로 `replace`한다. 이렇게 돌아온 펀딩 상세 화면에서 다시 왼쪽 위 뒤로가기를 누르면 `fromReview=1`을 기준으로 펀딩 메인 `/funding`으로 `replace`한다. 즉 후기 상세 -> 해당 펀딩 게시글 후기 탭 -> 펀딩 메인 순서가 깨지지 않아야 한다.
- 후기 상세 댓글 mock은 현재 보고 있는 `projectId`와 `reviewId`에 맞는 댓글만 보여준다. 새 댓글도 해당 후기 id 기준으로 붙는다.
- 상세 화면의 추천 프로젝트 위에는 `second` 기준처럼 공유하기/신고하기 버튼이 있다. 공유하기는 React Native `Share`를 사용하고, 신고하기는 사유/상세 입력 모달을 띄운 뒤 프론트 mock 접수 안내를 보여준다. 실제 공유 링크 복사 API나 신고 서버 연동은 없다.
- 상세 화면의 추천 프로젝트는 펀딩 메인의 `추천순`과 같은 `sortFundingProjectsForDisplay(..., "추천순")` 기준으로 최대 4개를 보여준다. `다른 프로젝트 둘러보기` 추천 카드 UI는 메인 펀딩 목록 카드와 같은 썸네일/하트/양조장명/메인재료/상태/진행률/금액/남은일/Progress 구성으로 맞춘다. `더보기`를 누르면 `/funding?sort=recommend&scrollToTop=1`로 이동해 메인 펀딩 페이지의 추천순 목록을 보게 한다. 추천 카드 이미지는 `getFundingProjectImageSource`를 사용해 로컬 이미지 override가 있으면 동일하게 반영한다. 추천 카드 하트도 상세 이동과 중복 실행되지 않게 터치 전파를 막는다.
- 상세 화면의 추천 프로젝트, 후원 옵션 모달, 하단 CTA 권한 분기는 기존 프론트 mock 흐름을 유지한다.
- 후원하기 화면 주소 검색은 mock 주소 결과 선택뿐 아니라 검색어를 그대로 `입력한 주소 사용`으로 반영할 수 있다. 후원 성공 모달은 방금 후원한 프로젝트 상세로 돌아가는 버튼과 펀딩 목록으로 가는 보조 버튼을 함께 제공한다.
- 후원하기 화면의 결제수단/은행/응원 메시지/mock 주소/배송지 helper는 `src/features/funding/supportConfig.tsx`로 분리되어 있다. 결제수단은 토스페이와 계좌이체만 사용한다. 후원 화면 UI와 상태 흐름은 `FundingSupportScreen.tsx`가 그대로 담당한다.
- 펀딩 프로젝트 소유권 판단은 `src/features/funding/ownership.ts`의 `isFundingProjectOwnedByBrewery`를 기준으로 한다. 이 유틸은 API 연결 후 사용할 `creatorId`/`breweryId`와 로그인 사용자 `id`/`uid` 매칭을 우선 보고, fallback으로 양조장 이름 매칭만 처리한다. 펀딩 리스트, 펀딩 상세, 후원하기 직접 진입 방어, 양조장 대시보드, 양조일지 관리 화면에서 같은 기준을 사용한다.

[현재 second 대비 펀딩 상세 잔여 차이]
- `second`의 양조일지 탭 중 단계별 더보기/접기, 일지 좋아요, 일지 댓글, 일지 댓글 좋아요, 댓글 대댓글 입력/표시/좋아요는 Expo 앱에 이식했다. 동영상 iframe/플레이어는 사용하지 않기로 했고, 프로젝트 소개 영상과 양조일지 영상은 선택 입력한 `videoUrl`을 URL 텍스트로만 저장/표시한다.
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
- 작성 진행률은 `기획중 · 필수 항목 기준 / n% 완료`로 표시한다. `*` 필수 항목만 완료율에 반영하고, 선택 입력인 짧은 제목, 서브 재료, 검색 태그, 프로젝트 예산, 프로젝트 일정, 프로필 이미지, 창작자 소개는 라벨에 `(선택)`을 표시한다. 신분증/사업자등록증은 필수 항목이다. 막걸리로 고정된 프로젝트 카테고리와 상품 분류는 임시저장 데이터가 비어 있어도 항상 완료로 계산한다. 원재료 구성요소는 완전히 빈 추가 행은 무시하고, 값이 들어간 행들은 주 소재와 원산지가 모두 채워졌을 때 완료로 계산한다. 안내사항의 프로젝트 정책과 예상 어려움도 필수 완료율에 포함한다.
- 미리보기 Eye 버튼은 Figma Make 기준의 전체 화면 미리보기 흐름을 따르되, 현재 앱의 실제 펀딩 상세 게시글 형식과 맞게 메인 이미지, 제목/요약, 펀딩 현황, 양조장 프로필/지역/카테고리, 프로젝트 소개, 가격 안내, 예산, 일정, 맛 지표, 안내사항을 표시한다. 입력한 대표 이미지, 도수/용량 단위, 병당 가격, 총 수량, 예상 배송일, 양조장 정보가 미리보기 데이터에 반영된다.
- 임시저장은 `SafeStorage`의 `judam_project_temp_save` 키에 현재 작성 상태를 저장하는 프론트 로컬 mock 흐름이다. 저장된 초안이 없을 때 `임시저장`을 누르면 저장 후 `임시저장 되었습니다.` 모달만 보여준다. 저장된 초안이 있을 때 다시 `임시저장`을 누르면 기존 초안을 불러오거나 현재 내용으로 새로 저장하거나 삭제할 수 있다. 저장된 초안이 있는 상태에서 X를 누르면 초안을 불러오거나 불러오지 않고 나가거나 계속 작성할 수 있다. 저장된 초안이 없고 작성 내용만 있는 상태에서 X를 누르면 임시저장하지 않고 나갈지 확인하는 모달을 보여준다.
- 프로젝트 생성 완료 시 제출 확인 모달, 성공 모달 후 `/brewery/dashboard`로 이동하는 프론트 mock 흐름이다. 제출 시 `FundingContext.addProject`로 `심사 중` 상태의 새 프로젝트를 로컬 프로젝트 목록에 추가한다.

3. 개발 진행 로그
[2026-05-18]: [마이] 일반 유저 전용 양조장 인증하기 항목 추가.

[진행 내용]:
- 작업 전 `judam.md`를 확인했고, 이번 범위는 `[마이] > 기타` 섹션의 일반 유저 전용 조건부 항목 추가로 제한했다.
- `src/features/mypage/screens/MyPageScreen.tsx`에서 로그인 사용자가 일반 유저(`user.type !== 'brewery'`)일 때만 `설정`과 `고객센터` 사이에 `양조장 인증하기` 메뉴를 표시하도록 했다.
- `양조장 인증하기`는 기존 양조장 인증 라우트 `/brewery/verification`으로 이동한다.
- 양조장 계정에서는 해당 항목이 보이지 않도록 유지했다. 다른 마이페이지 하위 화면과 하단바 페이지는 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-18]: [마이] 설정 화면 메뉴 UI 크기 축소.

[진행 내용]:
- 작업 전 `judam.md`를 확인했고, 이번 범위는 `[마이] > 기타 > 설정` 화면의 UI 스케일 조정으로 제한했다.
- `src/features/mypage/screens/MySettingsScreen.tsx`에서 설정 화면의 섹션 라벨, 카드, 행, 아이콘 박스, 제목 텍스트, Chevron 크기를 마이페이지 메인 메뉴 요소와 비슷한 크기로 축소했다.
- 설정 화면의 기능 구성(`온보딩 다시 보기`, `회원 탈퇴`)과 라우팅 동작은 변경하지 않았다.
- 다른 마이페이지 하위 화면과 하단바 페이지는 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-18]: [마이] 설정 화면 추가 및 온보딩 다시 보기 연결.

[진행 내용]:
- 작업 전 `judam.md`를 확인했고, 이번 범위는 `[마이] > 기타 > 설정` 하위 화면 구성으로 제한했다.
- `src/features/mypage/screens/MyPageScreen.tsx`의 `기타` 섹션 `설정` 항목에 `/mypage/settings` 이동을 연결했다.
- `app/mypage/settings.tsx`와 `src/features/mypage/screens/MySettingsScreen.tsx`를 추가했다.
- 설정 화면은 첨부 시안의 상단 뒤로가기/제목/카드형 목록 구조를 따르되, 사용자 요청대로 `계정 정보(사용자 고유 ID)` 섹션은 제외하고 `앱 설정`, `계정 관리` 2개 섹션만 표시한다.
- `앱 설정`에는 `온보딩 다시 보기` 항목만 두었고, 누르면 `SafeStorage`의 `judam_onboarded` 값을 제거한 뒤 `/onboarding`으로 이동한다.
- `계정 관리`에는 `회원 탈퇴` 항목만 두었고, 현재 정식 탈퇴 API가 없으므로 확인 Alert 후 기존 `AuthContext.logout` 프론트 로컬 로그아웃 흐름을 사용해 `/onboarding`으로 이동한다.
- 일반 사용자와 양조장 사용자가 공동으로 사용하는 설정 화면 기준으로 구현했으며, 다른 하단바 페이지와 양조장 전용 분기는 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-18]: [마이] 나의 활동 탭별 데이터 기준 문서화.

[진행 내용]:
- 작업 전 `judam.md`를 확인했고, 이번 요청은 코드 변경 없이 `[마이] > 나의 활동` 하위 탭이 추후 어떤 데이터를 불러와야 하는지 기준을 문서화하는 범위로 처리했다.
- 레시피 활동 기준을 정리했다: `작성`은 내가 작성한 레시피 목록, `관심`은 내가 좋아요한 레시피 목록, `댓글`은 레시피 게시글에 단 내 댓글 목록을 불러온다.
- 펀딩 활동 기준을 정리했다: `관심`은 내가 좋아요한 펀딩 목록, `댓글`은 펀딩 게시글에 단 내 댓글 목록, `Q&A`는 펀딩 게시글에 단 내 Q&A 목록을 불러온다.
- 커뮤니티 활동 기준을 정리했다: `작성`은 내가 작성한 커뮤니티 목록, `관심`은 내가 좋아요한 커뮤니티 목록, `댓글`은 커뮤니티 게시글에 단 내 댓글 목록을 불러온다.
- 실제 화면/라우트/데이터 로직은 변경하지 않았고, 기존 빈 상태 UI를 유지했다.

[2026-05-18]: [마이] 나의 활동 섹션 및 활동 카테고리 탭 화면 추가.

[진행 내용]:
- 작업 전 `judam.md`를 확인했고, 이번 범위는 하단바 기준 `[마이]` 메인 하단 섹션과 그 하위 활동 화면으로 제한했다.
- `src/features/mypage/screens/MyPageScreen.tsx`에서 `기타` 섹션 안의 `공지사항` 항목을 완전히 제거했다.
- `기타` 섹션 위에 `나의 활동` 섹션을 새로 추가하고, `레시피`, `펀딩`, `커뮤니티` 3개 목록을 카드 형태로 배치했다.
- `레시피`는 `/mypage/activity/recipe`, `펀딩`은 `/mypage/activity/funding`, `커뮤니티`는 `/mypage/activity/community`로 이동하도록 연결했다.
- `app/mypage/activity/recipe.tsx`, `app/mypage/activity/funding.tsx`, `app/mypage/activity/community.tsx` 라우트를 추가했다.
- `src/features/mypage/screens/MyActivityCategoryScreen.tsx`를 추가해 공통 상단바/segmented tab/빈 상태 레이아웃을 만들고, 이를 `RecipeActivityScreen`, `FundingActivityScreen`, `CommunityActivityScreen`에서 재사용하도록 했다.
- 레시피 활동 화면은 `작성`, `관심`, `댓글` 탭과 각 탭별 빈 상태 문구를 제공한다.
- 펀딩 활동 화면은 `관심`, `댓글`, `Q&A` 탭과 각 탭별 빈 상태 문구를 제공한다.
- 커뮤니티 활동 화면은 `작성`, `관심`, `댓글` 탭과 각 탭별 빈 상태 문구를 제공한다.
- 이번 변경은 일반 사용자와 양조장 사용자가 공동으로 쓰는 마이페이지 활동 영역 기준으로 적용했으며, 다른 하단바 페이지와 양조장 전용 분기는 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-18]: [마이] 나의 활동 제거 및 뱃지 빈 페이지 추가.

[진행 내용]:
- 작업 전 `judam.md`를 확인했고, 이번 범위는 하단바 기준 `[마이]`의 통계 카드 세 번째 슬롯과 해당 하위 라우트 정리로 제한했다.
- `src/features/mypage/screens/MyPageScreen.tsx`에서 기존 `나의 활동` 통계 카드를 제거하고 같은 위치를 `뱃지` 카드로 교체했다. 로그인 사용자 카드는 `/mypage/badge`로 이동하며, 비회원 마이페이지의 세 번째 통계 슬롯도 `작성 게시글` 대신 `뱃지`로 맞췄다.
- 기존 `app/mypage/activity.tsx`와 `src/features/mypage/screens/MyActivityScreen.tsx`를 삭제해 `나의 활동` 진입 페이지와 구현 화면을 제거했다.
- `app/mypage/badge.tsx`와 `src/features/mypage/screens/BadgeScreen.tsx`를 추가했다. 뱃지 화면은 첨부 시안처럼 상단 뒤로가기와 중앙 제목 `뱃지`만 표시하고 본문은 빈 상태로 둔다.
- 일반 사용자와 양조장 사용자가 공동으로 사용하는 마이페이지 기준을 유지했으며, 다른 하단바 페이지와 양조장 전용 분기는 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과. `rg "PenSquare|activity|MyActivity|나의 활동|/mypage/activity" app src` 결과 앱 코드에 기존 나의 활동 참조가 남아있지 않음을 확인했다.

[2026-05-18]: [마이] 프로필 비밀번호 변경 전용 화면 추가.

[진행 내용]:
- 작업 전 `judam.md`를 확인했고, 이번 범위는 `[마이] > 프로필` 안의 비밀번호 변경 흐름으로 제한했다.
- `src/features/mypage/screens/ProfileScreen.tsx`에서 비밀번호 행을 기존 하단 모달 입력이 아니라 신규 라우트 `/mypage/profile/password`로 이동하도록 변경했다. 닉네임, 전화번호, 이메일 변경 모달은 기존 흐름을 유지한다.
- `app/mypage/profile/password.tsx`와 `src/features/mypage/screens/PasswordChangeScreen.tsx`를 추가했다.
- 비밀번호 변경 화면은 첨부 시안처럼 상단 뒤로가기/제목, 흰색 카드, `현재 비밀번호`, `새 비밀번호`, `새 비밀번호 확인` 입력칸, `저장하기` 버튼 구조로 구성했다.
- 현재 비밀번호와 새 비밀번호 입력칸에는 눈 아이콘 토글을 추가했고, 새 비밀번호는 8자 이상 및 확인값 일치 여부를 프론트에서 검증한다. 정식 인증 API가 아직 없으므로 실제 서버 비밀번호 변경은 연결하지 않고 완료 알림 후 이전 화면으로 돌아간다.
- 일반 사용자와 양조장 사용자가 공동으로 사용하는 프로필 하위 화면 기준을 유지했으며, 다른 하단바 페이지나 양조장 전용 분기는 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-18]: [마이] 프로필 보기 버튼 및 프로필 화면 크기 조정.

[진행 내용]:
- 작업 전 `judam.md`를 확인했고, 이번 범위는 직전 추가한 `[마이]` 공통 프로필 진입 버튼과 `/mypage/profile` 화면의 UI 스케일 조정으로 제한했다.
- `src/features/mypage/screens/MyPageScreen.tsx`의 `프로필 보기` 버튼을 기존 큰 pill 버튼에서 왼쪽 계정 뱃지(`양조장 계정`/`일반 유저`)와 비슷한 높이와 글자 크기의 작은 pill 버튼으로 축소했다.
- `src/features/mypage/screens/ProfileScreen.tsx`에서 상단바 높이/타이틀 크기, 프로필 이미지 카드 높이, 아바타/카메라 버튼, 섹션 타이틀, 정보 카드 radius, 행 높이, 아이콘 원형 배경, 라벨/값 텍스트 크기를 전반적으로 줄여 실제 앱 화면 밀도에 맞게 조정했다.
- 일반 사용자와 양조장 사용자가 공동으로 쓰는 화면이라는 기준은 유지했고, 양조장 전용 분기나 다른 하단바 페이지는 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-18]: [마이] 공통 프로필 보기 버튼 및 프로필 화면 추가.

[진행 내용]:
- 작업 전 `judam.md`를 확인했고, 이번 범위는 하단바 기준 `[마이]`에서 일반 사용자와 양조장 사용자가 공동으로 사용하는 프로필 진입/프로필 정보 화면으로 제한했다.
- `src/features/mypage/screens/MyPageScreen.tsx`의 로그인 사용자 상단 프로필 영역에서 기존 톱니바퀴 설정 아이콘 UI를 제거하고, 같은 위치에 첨부 시안과 같은 회색 pill 형태의 `프로필 보기` 버튼을 추가했다.
- `프로필 보기` 버튼은 신규 라우트 `/mypage/profile`로 이동하며, 양조장 전용 대시보드 카드와 일반 사용자 영역은 기존 분기 흐름을 유지했다.
- `app/mypage/profile.tsx`와 `src/features/mypage/screens/ProfileScreen.tsx`를 추가했다. 프로필 화면은 상단 뒤로가기/중앙 제목, 큰 프로필 이미지 카드, 카메라 버튼, 계정 정보 카드(닉네임/전화번호/이메일), 비밀번호/사용자 고유 ID 카드로 구성했다.
- 프로필 화면은 하단 탭바 공간을 침범하지 않도록 ScrollView 하단 여백과 Safe Area를 반영했고, 마이 탭 하위 라우트로 추가해 하단바가 유지되는 구조를 사용한다.
- 닉네임, 전화번호, 이메일, 비밀번호 행을 누르면 하단 모달 입력 UI가 열리며, 닉네임/전화번호/이메일은 현재 `AuthContext.updateUser` 로컬 저장 흐름으로 반영한다. 비밀번호는 아직 실제 인증 API가 없으므로 프론트 검증/완료 알림까지만 처리한다.
- 프로필 사진 카메라 버튼은 `expo-image-picker`를 사용해 갤러리 이미지를 선택하고, 선택한 URI를 `AuthContext`의 `profileImage` 필드에 로컬 저장한다. 이를 위해 `src/contexts/AuthContext.tsx`의 `User` 타입에 선택 필드 `profileImage`를 추가했다.
- 이번 변경은 `[마이]` 메인 상단과 신규 `[마이] > 프로필` 화면, Auth 사용자 타입의 프로필 이미지 필드 추가로 제한했으며 홈/주담/펀딩/커뮤니티 화면은 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

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
- 사용자가 당시 도수 범위에 `1도 미만`, `1%~2%` 옵션을 추가하고 싶다고 요청했다. 단, 이 두 옵션은 2026-05-05 사용자 요청으로 다시 제거되어 현재 레시피 제안 화면에는 표시하지 않는다.
- 사용자가 화면 동작 흐름을 설명했다. 메인 재료 입력 후 서브 재료의 `AI 생성`을 누르면 백엔드 추천 알고리즘 결과가 서브 재료 추천 리스트로 뜨고, `지향하는 맛`, `프로젝트 요약`, `이미지 업로드`의 AI 생성 버튼은 메인 재료와 서브 재료가 모두 입력/선택된 경우에만 작동해야 한다.
- 이 조건 제한은 현재 백엔드 없이도 프론트 상태 검증으로 구현할 수 있는 영역으로 판단했다. 다만 실제 백엔드 추천/AI 연동이 붙으면 백엔드에서도 같은 조건을 검증하는 것이 안전하다고 전제했다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`에서 서브 재료 AI mock 결과를 기존 세로 row 리스트 대신 `Chip` 컴포넌트를 재사용한 다중 선택 칩 UI로 변경했다.
- 당시 `ALCOHOL_RANGES` 앞쪽에 `1도 미만`, `1%~2%`를 추가했지만, 2026-05-05 기준 현재 배열에서는 두 옵션을 제거했다.
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
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint`, `npx expo export --platform web --output-dir /tmp/judam-funding-api-ready-check` 모두 통과했다.

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
- 펀딩 상세 양조일지 탭은 단계별 일지를 최신 id순으로 렌더링하고, 단계별 1개를 먼저 표시하며 2개 이상이면 바로 `더보기 (n개 더)`와 `접기` 버튼을 보여준다.
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

[2026-05-05]: 펀딩 페이지 프로젝트 등록 제외 전체 점검 및 디벨롭 완료.

[진행 내용]:
- 사용자가 펀딩 페이지에서 `프로젝트 등록` 부분을 제외하고, 펀딩 목록/상세/소개/양조일지/Q&A/후기/후원 흐름 전체를 점검한 뒤 추가되면 좋을 부분, 누락된 부분, 최적화/정리를 진행해달라고 요청했다.
- 작업 범위에서 `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`, `BreweryProjectTermsScreen.tsx` 등 프로젝트 등록/약관/생성 화면은 제외하고 수정하지 않았다.
- `src/features/funding/screens/FundingListScreen.tsx`는 검색 대상을 프로젝트명/양조장명에서 카테고리/지역까지 확장했다. 펀딩 카드 안의 하트 버튼은 `event.stopPropagation()`을 사용해 찜과 카드 상세 이동이 동시에 실행되지 않게 했다.
- `src/features/funding/screens/FundingDetailScreen.tsx`는 상세 탭 클릭 시 `router.setParams`로 `tab=intro|journal|qna|review` query를 갱신하도록 했다. 직접 진입 query와 탭 버튼 상태가 어긋나지 않도록 정리했다.
- `FundingDetailScreen`의 추천 프로젝트는 `sortFundingProjectsByPopularity`를 사용해 인기순 기준으로 정렬하고, `getFundingProjectImageSource`를 사용해 로컬 이미지 override가 동일하게 적용되도록 했다. 추천 카드 하트도 상세 이동과 중복 실행되지 않게 터치 전파를 막았다.
- `FundingDetailScreen`의 Q&A 댓글/답글 입력창에 키보드 send 제출을 추가했다. 프로젝트 id가 바뀔 때 Q&A 댓글 상태, 좋아요 상태, 답글 입력 상태, 양조일지 펼침/좋아요/댓글 상태가 이전 프로젝트에서 새 프로젝트로 새지 않게 초기화한다.
- `FundingDetailScreen`의 양조일지 댓글에 대댓글 작성, 대댓글 펼침/접기, 대댓글 좋아요를 추가했다. 변경 사항은 `FundingContext.updateProjectJournals`로 프론트 로컬 상태에 반영한다. 비회원은 대댓글/좋아요 액션에서 로그인 필요 안내를 본다.
- `src/features/funding/reviews.ts`의 후기 댓글 mock에 `projectId`, `reviewId`를 추가하고, `src/features/funding/screens/FundingReviewDetailScreen.tsx`는 현재 후기 id에 맞는 댓글만 보여주도록 필터링했다. 새 후기 댓글도 해당 `projectId/reviewId`를 갖도록 했다.
- `src/features/funding/screens/FundingSupportScreen.tsx`의 주소 검색 모달은 검색 결과 선택뿐 아니라 사용자가 입력한 검색어를 `입력한 주소 사용`으로 배송지에 바로 반영할 수 있게 했다.
- `FundingSupportScreen`의 후원 성공 모달은 `프로젝트로 돌아가기`와 `펀딩 목록 보기`를 모두 제공한다. 방금 후원한 프로젝트 상세로 돌아가면 `FundingContext.updateProjectFunding`으로 반영된 달성률/후원자 수를 바로 확인할 수 있다.
- 실제 서버 API, 결제 PG, 주소 API, 알림, AI 로직은 추가하지 않았다. 모든 신규 동작은 기존 프론트 mock/local state 기준이다.
- 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint`, `npx expo export --platform web --output-dir /tmp/judam-funding-page-full-check` 모두 통과했다.

[2026-05-05]: 펀딩 상세 양조일지 단계별 더보기 기준 조정 완료.

[진행 내용]:
- 사용자가 양조일지에서 각 단계별로 일지를 2개 이상 올리면 바로 펼침/접기가 가능해야 한다고 요청했다.
- `src/features/funding/screens/FundingDetailScreen.tsx`의 단계별 양조일지 기본 노출 개수를 3개에서 1개로 변경했다. 이제 같은 단계에 일지가 2개 이상이면 첫 1개만 먼저 보이고 `더보기 (n개 더)`/`접기` 버튼이 바로 표시된다.
- 양조일지 댓글, 대댓글 작성, 대댓글 펼침/접기, 대댓글 좋아요 로직은 유지했다.
- 프로젝트 등록 화면, 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-05]: 펀딩 메인 술BTI 맞춤 추천 정렬 UI 구현.

[진행 내용]:
- 사용자가 펀딩 메인에 `내 술BTI 맞춤추천 펀딩순`을 추가하고 싶지만, 기존 `전체/진행중/성사된` 토글에 같이 넣으면 성사된 펀딩만 뜰 수 있어 UX 방향을 고민했다.
- 기존 상태 토글에는 넣지 않고, `src/features/funding/screens/FundingListScreen.tsx`의 검색/상태 필터 아래에 별도 `정렬/추천` 칩 그룹을 추가했다. 정렬 옵션은 `추천순`, `인기순`, `마감임박`, `최신순`이다.
- `추천순`은 `user.sulbti`가 있을 때만 활성화한다. 비회원은 로그인 안내를 보고, 로그인했지만 술BTI 결과가 없으면 마이페이지로 이동할 수 있는 Alert를 본다.
- 추천순 계산은 서버 없이 프론트 mock 기준이다. `second`의 술BTI 결과 코드 체계를 참고해 코드별 선호 맛 지표를 만들고, 프로젝트 `tasteProfile`과의 평균 차이를 0~100 매칭 점수로 변환한다.
- `전체 프로젝트 + 추천순`에서는 진행 가능한 프로젝트를 먼저 정렬하고 성사/종료된 프로젝트는 뒤로 보내서 사용자가 바로 후원 가능한 추천을 먼저 보게 했다. `진행중인 프로젝트`, `성사된 프로젝트` 필터를 선택하면 해당 상태 안에서만 술BTI 추천순으로 정렬한다.
- 추천순이 활성화된 카드에는 `내 술BTI와 n% 매칭` pill을 표시한다.
- 사용자가 마음에 들지 않아 취소를 요청하면 이번 변경은 `FundingListScreen.tsx`의 정렬/추천 UI, 술BTI 매칭 helper, selectedSort 상태, match badge만 제거하면 이전 펀딩 목록 동작으로 되돌릴 수 있도록 범위를 좁게 유지했다.
- 프로젝트 등록 화면, 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint`, `npx expo export --platform web --output-dir /tmp/judam-funding-bti-sort-check` 모두 통과했다.

[2026-05-05]: 펀딩 후원하기 화면 데이터 일치/가격 안내/응원 메시지 정리.

[진행 내용]:
- 사용자가 펀딩 후원하기 화면의 각 내용이 현재 각 게시글 내용과 일치하는지 점검하고, 가격 안내에서 `전통 누룩 소개 카드`, `양조장 감사 메시지` 같은 부가 항목을 빼며, 수량/금액 변화가 서로 반영되는지 확인하고, 양조장에게 한마디 옵션을 수정해달라고 요청했다.
- `src/features/funding/screens/FundingSupportScreen.tsx`를 확인해 후원 화면이 `FundingContext.projects`의 현재 프로젝트 데이터를 기준으로 프로젝트명, 양조장명, 카테고리, 이미지, 달성률, 목표금액, 후원자 수, 병당 가격, 배송비, 예상 전달일을 표시하는 구조임을 확인했다.
- 가격 안내는 이제 `project.rewardItems` 전체를 나열하지 않고 `project.rewardItems[0]` 또는 프로젝트명/용량 fallback으로 만든 첫 번째 실제 상품 리워드만 보여준다. 보조 카드/감사 메시지/알림 성격의 항목은 가격 안내에 표시하지 않는다.
- 가격 안내 안에 용량, 도수, 1병 가격 spec 박스를 추가해 현재 게시글의 `bottleSize`, `volume`, `alcoholContent`, `pricePerBottle` 값을 명확히 보여주도록 했다.
- 수량, 추가 후원금, 배송비, 리워드 금액, 최종 후원 금액, 하단 결제 버튼 금액은 기존처럼 같은 계산값을 사용한다. 추가로 프로젝트 id나 초기 수량 파라미터가 바뀌면 수량/추가 후원금/메시지/결제수단/동의 상태를 초기화해 다른 게시글의 후원 상태가 새 게시글로 섞이지 않게 했다.
- 양조장에게 한마디 기본 옵션에서 `정성스럽게 빚어주세요.`를 제거했다. 대신 `직접 입력` 옵션을 추가했고, 선택 시 같은 섹션 아래에 multiline 직접 입력창이 바로 열린다. preset 문구를 다시 선택하면 직접 입력창은 닫힌다.
- 실제 결제/서버/주소 API/백엔드 로직은 추가하지 않았다. 기존 프론트 mock 후원 흐름만 유지했다.
- 프로젝트 등록 화면, 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint`, `npx expo export --platform web --output-dir /tmp/judam-funding-support-sync-check` 모두 통과했다.

[2026-05-05]: 펀딩 후원하기 화면 프론트 결제 전 단계 고도화 완료.

[진행 내용]:
- 사용자가 후원하기 페이지에서 수량 제한을 제외하고 입력 검증 강화, 결제수단별 상세 UI, 최종 확인 모달, 후원 완료 안내, 최근 배송지 저장/불러오기, 로딩/중복 제출 방지를 모두 구현해달라고 요청했다.
- `src/features/funding/screens/FundingSupportScreen.tsx`에 후원자 연락처/이메일, 배송지 받는 분/기본 주소/상세 주소/배송 연락처, 추가 후원금 상한, 계좌이체 은행/입금자명 검증을 추가했다. 검증 실패 시 해당 필드 아래에 빨간 안내 문구를 표시하고 Alert로 입력 정보 확인을 안내한다.
- 연락처 입력은 `formatPhoneNumber`로 자동 하이픈 처리하고, 이메일/전화번호 검증은 `src/utils/validation.ts`의 `isValidEmail`, `isValidPhone`을 사용한다.
- 결제수단별 상세 UI를 추가했다. 카드 결제는 카드사와 할부 선택, 네이버페이는 mock 간편결제 안내, 계좌이체는 은행 선택과 입금자명 입력을 제공한다. 실제 카드번호 입력/PG/은행 API는 추가하지 않았다.
- 하단 후원 버튼을 누르면 즉시 완료하지 않고 `ConfirmationModal`을 띄운다. 최종 확인 모달은 프로젝트명, 실제 상품 리워드, 수량, 리워드 금액, 배송비, 추가 후원금, 결제수단, 최종 후원 금액을 보여주며, `후원 확정`을 눌러야 mock 후원이 완료된다.
- 후원 성공 시 `SafeStorage`에 `judam_recent_shipping_info:{user.id}` 키로 배송지를 저장하고, 다음 후원 화면에서 최근 배송지를 불러올 수 있는 카드와 버튼을 보여준다.
- 성공 모달에는 후원 내역을 추후 마이페이지에서 확인할 수 있도록 연결 예정이라는 안내를 추가했다. 아직 마이페이지 후원 내역 저장/조회 서버나 별도 라우트는 없다.
- 결제 처리 중에는 주요 입력과 버튼을 비활성화하고 `처리 중...` 상태를 보여 중복 제출을 막는다.
- 사용자가 제외하라고 한 수량 제한은 구현하지 않았다. `totalQuantity`, `targetQuantity` 기반 구매 가능 수량 제한 로직은 추가하지 않았다.
- 실제 결제/서버/주소 API/백엔드 로직은 추가하지 않았다. 기존 프론트 mock 후원 흐름만 유지했다.
- 프로젝트 등록 화면, 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint`, `npx expo export --platform web --output-dir /tmp/judam-funding-support-frontend-check` 모두 통과했다.

[2026-05-05]: 펀딩 페이지 프로젝트 등록 제외 코드/파일 정리 완료.

[진행 내용]:
- 사용자가 펀딩 프로젝트 등록 영역은 제외하고, 현재 구현된 기능은 절대 건드리거나 없애지 말고 펀딩 페이지 코드/파일 정리와 최적화만 해달라고 요청했다.
- 작업 전 `judam.md`, 현재 펀딩 screen 파일, 펀딩 feature 파일 구조, 변경 중인 git 상태를 확인했다. 기존 수정 상태였던 `FundingSupportScreen.tsx`와 `judam.md` 내용은 유지하고 작업했다.
- `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`, `BreweryProjectTermsScreen.tsx`, 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.
- `src/features/funding/recommendation.ts`를 추가해 `FundingListScreen.tsx` 안에 있던 `FundingStatusFilter`, `FundingSortOption`, 상태 필터 옵션, 정렬 옵션, 술BTI 코드별 맛 프로필, 맛 매칭 점수 계산, 추천 정렬 상태 우선순위 helper를 분리했다.
- `src/features/funding/supportConfig.tsx`를 추가해 `FundingSupportScreen.tsx` 안에 있던 `PaymentMethod`, `InfoModalType`, `ShippingInfo`, 응원 메시지 preset, 결제수단 옵션, mock 주소, 카드사/할부/은행 옵션, 추가 후원금 상한, 배송지/결제 helper를 분리했다.
- 화면 UI, 문구, 권한 분기, 후원 검증, 결제수단별 상세 UI, 최종 확인 모달, 최근 배송지 저장/불러오기, 술BTI 추천 정렬 동작은 변경하지 않았다. 이번 작업은 import 기준과 파일 책임을 정리한 리팩토링이다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint`, `npx expo export --platform web --output-dir /tmp/judam-funding-refactor-check` 모두 통과했다.

[2026-05-05]: 펀딩 메인 정렬/추천 칩 명칭 단축 완료.

[진행 내용]:
- 사용자가 펀딩 페이지 정렬/추천 영역의 `내 술BTI 추천순` 이름을 `추천순`으로만 바꿔달라고 요청했다.
- `src/features/funding/recommendation.ts`의 `FundingSortOption`과 `sortOptions` 표시값을 `추천순`으로 변경했다.
- `src/features/funding/screens/FundingListScreen.tsx`의 추천순 활성 여부, 정렬 조건, 로그인/술BTI 결과 안내 조건, Sparkles 아이콘 표시 조건을 새 이름 `추천순` 기준으로 맞췄다.
- 술BTI 매칭 점수 계산, 상태 우선순위, 권한 분기, 카드 매칭 badge, 다른 정렬 옵션은 변경하지 않았다.
- 프로젝트 등록 화면, 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-05]: 주담 레시피 제안 도수 범위 옵션 정리 완료.

[진행 내용]:
- 사용자가 주담 페이지에서 `레시피 제안하기`로 들어가는 레시피 제안 화면의 도수 범위 중 `1도 미만`과 `1% ~ 2%` 항목을 삭제해달라고 요청했다.
- 실제 코드에서는 `src/features/recipe/screens/RecipeCreateScreen.tsx`의 `ALCOHOL_RANGES`에 `1도 미만`, `1%~2%` 형태로 들어 있음을 확인했다.
- `ALCOHOL_RANGES`에서 앞의 두 항목을 제거해 현재 선택지는 `3%~5%`, `6%~8%`, `9%~12%`, `13%~15%`, `15% 이상`만 남겼다.
- 레시피 제안 화면의 레이아웃, 권한 분기, AI mock 생성 조건, 이미지 업로드 mock, 제출 흐름은 변경하지 않았다.
- 펀딩 프로젝트 등록 화면, 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.

[2026-05-05]: 커뮤니티 정렬 UI 위치 조정 및 게시글 제목 표시 연결 완료.

[진행 내용]:
- 사용자가 커뮤니티 페이지의 정렬/추천 UI를 위쪽으로 옮겨 `정보게시판` 옆에 배치하고, `정보게시판` 칩과 세로 길이가 같도록 현재보다 키워달라고 요청했다.
- `src/features/community/screens/CommunityScreen.tsx`에서 기존 게시글 목록 상단 오른쪽에 있던 정렬 버튼을 카테고리 칩 줄로 이동했다. 정렬 버튼은 `정보게시판` 옆에 보이는 같은 줄에 배치하고, 높이를 카테고리 칩과 같은 40px로 맞췄다.
- 사용자가 커뮤니티 작성 화면 입력값은 카테고리, 제목, 내용, 이미지인데 목록/상세에는 제목이 빠져 있다고 알려줘 제목 요소를 추가했다.
- `src/contexts/CommunityContext.tsx`의 게시글 타입과 mock 데이터에 `title`, `category`를 추가하고, 기존 6개 커뮤니티 mock 게시글을 Context 기준으로 정리했다.
- `src/features/community/screens/CommunityCreateScreen.tsx`는 게시글 등록 시 `title`과 `category`를 Context에 함께 저장한다.
- `src/features/community/screens/CommunityScreen.tsx`는 local duplicate post state 대신 `CommunityContext.posts`를 읽어 목록을 보여준다. 검색은 제목, 내용, 작성자 기준으로 동작한다.
- `src/features/community/screens/CommunityDetailScreen.tsx`는 상세 본문 위에 제목을 표시하고, 새로 작성된 mock 게시글도 Context에서 찾아 상세에 보여줄 수 있게 했다.
- 비회원 읽기/작성/좋아요/댓글 권한 분기, 이미지 선택, 커뮤니티 작성 검증, 백엔드/API/AI 금지선은 변경하지 않았다.
- 펀딩 프로젝트 등록 화면, 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-05]: 커뮤니티 게시글 카드 스타일을 펀딩 후기 카드 톤으로 보정 완료.

[진행 내용]:
- 사용자가 하단바 기준 `[커뮤니티]` 페이지의 게시글 UI를 펀딩 페이지의 후기 게시글 UI를 참고해 변경하되, 구성요소는 현재 커뮤니티 게시글 요소를 그대로 유지해 달라고 요청했다.
- 작업 전 `judam.md`, `src/features/community/screens/CommunityScreen.tsx`, 펀딩 후기 UI가 있는 `src/features/funding/screens/FundingDetailScreen.tsx`의 후기 카드 스타일을 확인했다.
- `CommunityScreen.tsx`의 게시글 카드 구성요소인 작성자, 양조장 배지, 카테고리, 시간, 제목, 내용, 좋아요, 댓글은 추가/삭제 없이 그대로 유지했다.
- 커뮤니티 카드 스타일만 펀딩 후기 카드 톤에 맞춰 조정했다. 카드 배경은 `#F9FAFB`, 모서리는 16px, 경계선은 `#F3F4F6`, 패딩/간격은 후기 카드처럼 더 조밀하게 정리했다.
- 카테고리 배지는 흰 배경/얇은 경계선/둥근 pill 형태로 바꾸고, 양조장 배지는 검정 pill 형태로 조정했다.
- 제목, 본문, 시간, 좋아요/댓글 텍스트의 폰트 무게와 색상을 후기 카드 스타일에 맞춰 다듬었다.
- 게시글 데이터, 검색/정렬/필터, 상세 이동, 좋아요 권한 분기, 작성 FAB, 백엔드/API/AI 미연동 원칙은 변경하지 않았다.
- `npx.cmd tsc --noEmit` 통과, `npm.cmd run lint` 통과 상태를 확인했다.

[2026-05-05]: 마이페이지 양조장 대시보드 이동 및 대시보드 화면 보강 완료.

[진행 내용]:
- 사용자가 양조장 계정으로 마이페이지의 [양조장 대시보드]를 눌러도 페이지 이동이 되지 않는 문제를 말했고, 참고 코드 기반의 대시보드 화면 구성을 요청했다.
- 작업 전 `judam.md`, `MyPageScreen`, `app/brewery/dashboard` 라우트, `BreweryDashboardScreen`, `FundingContext`, `AuthContext`를 확인했다.
- `MyPageScreen`의 양조장 대시보드 카드에 `/brewery/dashboard` 이동 `onPress`를 연결했다.
- 기존 `app/brewery/dashboard.tsx` re-export 라우트는 유지했다.
- `BreweryDashboardScreen`의 기존 양조장 기본 정보, 내 펀딩 현황, 제조 진행 현황, 알림 구조를 유지하면서 참고 코드 흐름에 맞춰 펀딩 상태 변경 bottom sheet와 양조일지 작성/수정 bottom sheet를 추가했다.
- 펀딩 상태 변경은 기존 `FundingContext.updateProjectStatus`를 사용하는 프론트 local/mock 상태 흐름으로 구현했다.
- 양조일지는 화면 내부 local state 기반으로 단계별 기록/수정 상태를 관리하며, 사진 추가는 서버 업로드 없이 mock placeholder 개수 관리로만 처리한다.
- 백엔드/API/AI/결제/서버 저장/신규 외부 의존성 추가 없음.
- `npx tsc --noEmit`, `npm run lint`, `git diff --check` 통과.

[2026-05-05]: 커뮤니티 게시글 상세 UI를 펀딩 후기 상세 톤으로 보정 완료.

[진행 내용]:
- 사용자가 이전에 요청했던 “커뮤니티 게시글 UI를 펀딩 페이지의 후기 게시글 UI를 참고하여 스타일 변경하되 구성요소는 유지” 기준을 각 커뮤니티 게시글 상세 화면에도 적용해달라고 요청했다.
- 작업 전 `judam.md`, `src/features/community/screens/CommunityDetailScreen.tsx`, 펀딩 후기 상세 화면 스타일을 확인했다.
- `CommunityDetailScreen.tsx`에서 작성자/작성자 유형/시간/카테고리/제목/내용/이미지/좋아요/댓글 구성요소는 제거하거나 새로 추가하지 않고 그대로 유지했다.
- 게시글 상세 본문 영역을 펀딩 후기 상세와 맞는 흰색 배경 위 `#F9FAFB` 카드, 16px 라운드, 얇은 경계선, 넉넉한 내부 여백 구조로 감쌌다.
- 카테고리 pill, 이미지 라운드, 댓글 bubble 톤을 목록 카드 및 펀딩 후기 카드 톤과 맞게 조정했다.
- 백엔드/API/AI/서버 저장 로직 추가 없이 프론트 UI 스타일만 수정했다.
- `npx tsc --noEmit`, `npm run lint` 통과.

[2026-05-05]: 커뮤니티 게시글 상세 본문 카드 래퍼 제거 완료.

[진행 내용]:
- 사용자가 커뮤니티 게시글 상세에서 게시글 본문을 `#F9FAFB` 카드 형태로 감싼 요소를 없애달라고 요청했다.
- 작업 전 `judam.md`와 `src/features/community/screens/CommunityDetailScreen.tsx`의 현재 상세 구조를 확인했다.
- `CommunityDetailScreen.tsx`에서 `detailCard` 래퍼 View와 해당 스타일 정의를 제거했다.
- 게시글 작성자/작성자 유형/시간/카테고리/좋아요/제목/내용/이미지/댓글 구성요소는 유지했고, 헤더와 본문은 다시 화면에 직접 배치되도록 padding을 복원했다.
- 백엔드/API/AI/서버 저장 로직 추가 없이 프론트 UI 구조만 수정했다.
- `npx tsc --noEmit`, `npm run lint` 통과.

[2026-05-05]: 펀딩 프로젝트 등록 필수 진행률 계산 기준 보정 완료.

[진행 내용]:
- 사용자가 양조장 펀딩 프로젝트 등록 화면에서 모든 필수 입력을 했는데도 진행률이 3% 부족해 제출이 활성화되지 않는 문제를 제보했다.
- 작업 전 `judam.md`, 현재 `BreweryProjectCreateScreen.tsx`, `second/src/app/pages/CreateProjectDetailPage.tsx`의 프로젝트 등록 진행률 계산 기준을 확인했다.
- `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`의 진행률 계산에서 펀딩 시작일/예상 발송 시작일의 경고 문구 여부가 필수 완료 여부를 깎던 조건을 제거했다.
- 날짜 경고는 기존 사용자 요청대로 안내 문구로만 유지하고, 진행률과 제출 가능 여부는 `*` 필수 항목의 입력/선택/업로드 완료 여부 기준으로 계산한다.
- 화면에 `*`로 표시되는 자동 계산 필드인 `목표 금액`과 고정값 필드인 `상품 분류`도 진행률 체크 목록에 포함해 표시 기준과 계산 기준을 맞췄다.
- 입력값은 공백 문자열을 완료로 보지 않도록 trim 기준으로 계산한다.
- 백엔드/API/AI/서버 저장 로직은 추가하지 않았고, 온보딩/로그인/회원가입 잠금 영역은 수정하지 않았다.

[2026-05-05]: 펀딩 프로젝트 등록 양조장 정보 불러오기 mock 자동 채움 보강 완료.

[진행 내용]:
- 사용자가 펀딩 프로젝트 만들기 화면의 양조장 정보 탭에서 `불러오기` 버튼을 누르면 임의의 더미 데이터로 해당 양조장 정보 페이지가 채워지되, 본인인증과 입금계좌는 양조장이 다시 입력하도록 비워달라고 요청했다.
- `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`의 `loadBreweryInfo`를 보강해 양조장명, 프로필 이미지, 창작자 소개, 사업자 구분, 상호명, 사업자 등록번호, 대표자명, 사업장 소재지, 업태, 종목, 이메일을 프론트 mock 값으로 채우도록 했다.
- 사용자 계정에 이미 있는 `breweryName`, `breweryLocation`, `breweryLocationDetail`, `businessNumber`, `email`은 우선 사용하고, 비어 있으면 화면 확인용 더미 값을 사용한다.
- 본인인증 영역은 휴대폰 번호, 인증번호 발송 상태, 인증번호 입력값, 타이머, 인증 완료 상태를 모두 초기화한다. 신분증/사업자등록증 선택 파일도 비운다.
- 입금계좌 영역은 은행, 계좌번호, 계좌 인증 완료 상태를 모두 초기화해 양조장이 직접 다시 입력해야 한다.
- 백엔드/API/AI/서버 저장 로직은 추가하지 않았고, 온보딩/로그인/회원가입 잠금 영역은 수정하지 않았다.

[2026-05-05]: 펀딩 프로젝트 등록 서류 파일 선택 실제 파일 선택기로 교체 완료.

[진행 내용]:
- 사용자가 펀딩 프로젝트 만들기 화면에서 신분증/사업자등록증, 사업자 등록증 사본, 통신판매신고증, 주류 통신판매 승인(신청)서, 전통주 제조면허증의 `파일 선택` 버튼이 임의 파일명을 넣는 방식이 아니라 실제 파일을 올리게 해달라고 요청했다.
- `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`에 `expo-document-picker`를 연결해 해당 서류 버튼들이 시스템 파일 선택기를 열도록 변경했다.
- 파일 선택 허용 타입은 PDF와 이미지이며, 사용자가 선택한 실제 로컬 파일의 이름을 `uploadedFiles` 상태에 반영한다.
- 기존 샘플 파일명 주입 로직을 제거했고, 양조장 정보 `불러오기`도 사업자 등록증 사본을 자동으로 채우지 않는다. 이미 사용자가 선택한 서류 파일은 그대로 유지된다.
- 실제 서버 업로드/API/백엔드 저장은 추가하지 않았다. 현재는 프론트 로컬 상태와 임시저장 payload 기준으로만 파일 선택 결과를 유지한다.
- 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.

[2026-05-05]: 펀딩 프로젝트 제출 후 생성 게시글 상세 이동 연결 완료.

[진행 내용]:
- 사용자가 펀딩 프로젝트 만들기 제출까지 무사히 마치면 실제로 펀딩 게시글이 만들어져 올라오게 해달라고 요청했다.
- 기존 `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`는 제출 확정 시 `FundingContext.addProject`를 호출해 프론트 로컬 프로젝트를 생성하고 있었지만, 성공 후 양조장 대시보드로 이동해 방금 만든 게시글을 바로 확인하기 어려웠다.
- 제출 확정 시 `addProject`가 반환하는 생성 프로젝트 id를 `createdProjectId` 상태에 저장하도록 했다.
- 제출 성공 모달 문구를 `펀딩 게시글이 생성되었습니다. 심사는 3-5영업일이 소요됩니다.`로 바꾸고, 버튼 라벨을 `게시글 확인`으로 변경했다.
- 성공 모달에서 `게시글 확인`을 누르면 방금 생성된 `/funding/[id]` 상세 게시글로 이동한다. 생성된 프로젝트는 기존 흐름대로 `심사 중` 상태이며, 상세에서는 후원 준비중 상태로 보인다.
- 실제 서버 저장/API/백엔드 업로드는 추가하지 않았다. 현재 생성 게시글은 앱 실행 중 `FundingContext.projects`에 반영되는 프론트 로컬 상태 기준이다.
- 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.

[2026-05-05]: 펀딩 프로젝트 만들기 나가기 라우팅 펀딩 메인 고정 완료.

[진행 내용]:
- 사용자가 펀딩 페이지에서 `프로젝트 등록`을 눌러 약관을 거쳐 펀딩 프로젝트 만들기 화면에 들어온 뒤, X 버튼과 임시저장 모달의 `불러오지 않고 나가기`를 누르면 약관 페이지나 등록 화면이 아니라 항상 펀딩 메인 페이지로 이동해야 한다고 요청했다.
- `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`의 나가기 흐름이 `router.back()`에 의존하고 있어 진입 히스토리에 따라 약관 페이지로 돌아갈 수 있음을 확인했다.
- 변경사항이 없는 X 나가기, 임시저장 없이 나가기, 임시저장 후 나가기 흐름을 모두 `router.replace('/funding')`로 고정했다.
- 임시저장 불러오기, 임시저장 삭제, 제출 성공 후 생성 게시글 상세 이동 흐름은 유지했다.
- 백엔드/API/AI/서버 저장 로직은 추가하지 않았고, 온보딩/로그인/회원가입 잠금 영역은 수정하지 않았다.

[2026-05-05]: 펀딩 후원하기 화면 게시글 데이터 동기화 기준 보정 완료.

[진행 내용]:
- 사용자가 펀딩 프로젝트 후원하기 화면의 모든 로직과 정보가 해당 펀딩 게시글과 동일해야 한다고 요청했다.
- `src/features/funding/supportConfig.tsx`에 펀딩 게시글 기준 helper를 추가했다. `getProjectUnitPrice`, `getProjectShippingFee`, `getProjectBottleSize`, `getProjectAlcoholContent`, `getProjectEstimatedDelivery`, `getPrimaryRewardItem`이 모두 `FundingProject` 데이터를 기준으로 값을 계산한다.
- `src/features/funding/screens/FundingDetailScreen.tsx`의 상세 후원 옵션 모달과 소개 영역에서 쓰는 가격, 배송비, 용량, 도수, 예상 배송일을 위 공용 helper 기준으로 변경했다.
- `src/features/funding/screens/FundingSupportScreen.tsx`의 프로젝트 카드, 가격 안내, 수량 계산, 최종 확인, 확인 모달이 동일 helper의 값을 사용하도록 맞췄다.
- 후원 완료 시 `FundingContext.addParticipation`과 `updateProjectFunding`에는 배송비를 제외한 `리워드 금액 + 추가 후원금`을 반영한다. 배송비는 결제 총액과 화면 표시에는 포함하지만 펀딩 목표 달성액에는 포함하지 않는다.
- `심사 중` 또는 `펀딩 예정` 프로젝트로 후원하기 화면에 직접 들어온 경우 기존처럼 종료된 펀딩이라고 표시하지 않고, 상세의 `후원 준비중` 흐름과 맞춰 `후원 준비중입니다` 안내를 보여준다.
- 실제 결제/서버/API/백엔드 저장 로직은 추가하지 않았고, 온보딩/로그인/회원가입 잠금 영역은 수정하지 않았다.

[2026-05-05]: 펀딩 후원하기 결제수단 토스페이/계좌이체 단순화 완료.

[진행 내용]:
- 사용자가 후원하기 화면의 결제수단을 기존 카드 간편결제, 네이버페이, 계좌이체에서 토스페이와 계좌이체만 남기고 구성해달라고 요청했다.
- `src/features/funding/supportConfig.tsx`의 `PaymentMethod`를 `toss | account` 기준으로 바꾸고, 결제수단 옵션을 `토스페이`, `계좌이체` 2개로 정리했다.
- 카드사 목록, 할부 목록, 네이버페이 결제수단은 현재 후원하기 화면에서 사용하지 않도록 제거했다.
- `src/features/funding/screens/FundingSupportScreen.tsx`에서 카드사/할부 상태와 네이버페이 안내 UI를 제거했다. 당시 토스페이 선택 시 결제 요청 금액과 토스 앱/웹 결제창 승인 예정 흐름을 보여주는 프론트 mock 안내 박스를 추가했으나, 이후 사용자 요청으로 해당 박스는 제거했고 현재는 토스페이 선택 카드만 표시한다.
- 계좌이체는 기존처럼 은행 선택과 입금자명 입력, 필드 검증, 최종 확인 모달 결제수단 요약을 유지한다.
- 최종 후원 금액, 배송비 포함 결제 총액, 펀딩 목표 달성액 반영 기준은 이전 작업의 게시글 데이터 동기화 기준을 그대로 유지했다.
- 실제 토스페이 SDK, PG, 결제 서버, 은행 API, 백엔드 저장 로직은 추가하지 않았다. 현재는 프론트 mock 결제 흐름이다.
- 프로젝트 등록 화면, 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-05]: 펀딩 후원하기 토스페이 안내 박스와 성공 모달 예정 문구 제거 완료.

[진행 내용]:
- 사용자가 후원하기 화면에서 토스페이를 눌렀을 때 뜨는 간편결제 mock 안내를 없애고, 후원 성공 모달의 `후원 내역은 추후 마이페이지에서 확인할 수 있도록 연결할 예정입니다.` 문구를 제거해달라고 요청했다.
- `src/features/funding/screens/FundingSupportScreen.tsx`에서 `selectedPaymentMethod === 'toss'`일 때 렌더링하던 토스페이 상세 안내 박스를 제거했다. 현재 토스페이는 결제수단 카드 선택 표시만 남는다.
- 토스페이 안내 박스 전용 스타일과 성공 모달 안내 문구 스타일을 함께 제거했다.
- 후원 성공 모달은 제목, 양조장 감사 문구, 후원 금액, 프로젝트/목록 이동 버튼만 표시한다.
- 사용자가 이후 펀딩 페이지 전체 점검을 요청하면 후원하기 완료 흐름과 마이페이지 후원 내역 연결이 아직 필요한 과제임을 반드시 리마인드해야 한다.
- 실제 토스페이 SDK, PG, 결제 서버, 은행 API, 백엔드 저장 로직은 추가하지 않았다. 현재는 프론트 mock 결제 흐름이다.
- 프로젝트 등록 화면, 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-05]: 양조장 본인 펀딩 프로젝트 수정 모드 연결 완료.

[진행 내용]:
- 사용자가 양조장으로 로그인했을 때 본인이 만든 펀딩 게시글의 `프로젝트 관리하기` 버튼이 양조장 대시보드가 아니라, 약관 다음의 펀딩 프로젝트 등록 화면을 해당 게시글 데이터로 채운 수정 모드로 열리게 해달라고 요청했다.
- `src/features/funding/screens/FundingDetailScreen.tsx`에서 자기 프로젝트의 하단 `프로젝트 관리하기` 버튼을 `/brewery/project/create?mode=edit&projectId={project.id}`로 연결했다. 미인증 양조장은 기존처럼 양조장 인증 화면으로 이동한다.
- `src/features/funding/screens/FundingSupportScreen.tsx`의 자기 프로젝트 직접 후원 방어 화면에서도 `프로젝트 관리하기` 버튼이 같은 수정 모드로 이동하도록 맞췄다.
- `src/contexts/FundingContext.tsx`에 `updateProject(projectId, project)`를 추가했다. 기존 프로젝트 id, 생성일, 후원금, 후원자 수, 상태, 양조일지 등 유지가 필요한 값은 수정 payload와 병합해 보존하고 `updatedAt`만 갱신한다.
- `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`에 수정 모드를 추가했다. `projectId` query가 있으면 현재 `FundingContext.projects`에서 해당 게시글을 찾고, `isFundingProjectOwnedByBrewery` 기준으로 본인 프로젝트인지 확인한다.
- 수정 모드는 해당 `FundingProject`의 제목, 카테고리, 소개, 대표 이미지, 원재료, 도수, 병당 가격, 목표 수량/금액, 시작일/종료일 기반 기간, 예상 배송일, 용량, 원재료 구성, 맛 지표, 예산, 일정, 양조장명을 프로젝트 등록 폼 상태로 역매핑한다.
- 기존 seed 게시글처럼 등록 폼에는 원래 저장되지 않던 본인인증, 입금 계좌, 세금계산서 일부, 인증 서류는 기존 제출/인증 완료 더미 상태로 채워서 진행률이 100%가 되고 수정 제출이 가능하도록 했다. 실제 서버/서류 업로드는 추가하지 않았다.
- 수정 제출 시 `addProject`로 새 게시글을 만들지 않고 `updateProject`로 기존 게시글을 갱신한다. 성공 모달의 `게시글 확인`을 누르면 기존 `/funding/[id]` 상세 화면으로 돌아가 수정된 내용이 반영된다.
- 생성 모드의 기존 약관 이후 등록 화면, 임시저장, 미리보기, 파일 선택, 제출 생성 흐름은 유지했다. 수정 모드 임시저장은 기존 생성 임시저장과 섞이지 않도록 `judam_project_temp_save:edit:{projectId}` 키를 사용한다.
- 첫 번째 demo 프로젝트는 기존 `ownership.ts`의 demo id 1 예외 덕분에 양조장 로그인 시 본인 프로젝트로 취급되며, 수정 모드에서 해당 더미 데이터가 채워진다.
- 실제 백엔드/API/AI/결제/서버 저장 로직은 추가하지 않았고, 온보딩/로그인/회원가입 잠금 영역은 수정하지 않았다.
- 개발상 남은 과제: 현재 게시글 데이터 모델에는 본인인증 전화번호, 정산 계좌, 인증 서류 원본, 세금계산서 상세가 정식 필드로 저장되어 있지 않아 수정 모드에서 이 영역은 더미로 보완한다. 백엔드 스키마가 정해지면 이 값들을 프로젝트/양조장 프로필 데이터와 분리해 실제 저장소 기준으로 매핑해야 한다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-05]: 펀딩 API 연결 대비 프론트 기준 정리 및 선반영 완료.

[진행 내용]:
- 사용자가 산학 API 연결 후 펀딩에서 점검해야 할 목록을 전달했고, 그중 지금 프론트 mock 단계에서 안전하게 할 수 있는 부분을 먼저 구현하며 전체 점검을 요청했다.
- 실제 API/DB/결제/주소 검색/신고 서버/토스페이 SDK는 추가하지 않았다. 현재 작업은 프론트 상태와 mock 데이터 기준 정렬, 소유권, 찜 수, 후기 작성 권한, 통계 계산 기준을 API 연결 전 형태로 정리한 것이다.
- `src/constants/data.ts`의 `FundingProject`에 API 연결 대비 선택 필드 `creatorId`, `breweryId`, `favoriteCount`를 추가했다. demo 1번 프로젝트는 로그인 양조장 mock 계정의 `id/uid`와 매칭되도록 값을 넣어 `내 프로젝트` 판정이 이름이 아니라 ID 기준으로도 동작하게 했다.
- `src/features/funding/ownership.ts`의 `isFundingProjectOwnedByBrewery`는 이제 `project.creatorId`/`project.breweryId`와 `user.id`/`user.uid` 매칭을 먼저 보고, 이후 양조장명 fallback과 demo project id 1 예외를 처리한다. API 연결 후 실제 owner id가 들어오면 같은 유틸을 계속 사용할 수 있다.
- `src/features/funding/recommendation.ts`에 `matchesFundingStatusFilter`, `getProjectFavoriteCount`, `getProjectCreatedTime`, `sortFundingProjectsForDisplay`, `getFundingListStats`를 추가했다.
- 펀딩 메인 `인기순`은 `FundingProject.favoriteCount`와 로컬 찜 상태를 합산한 찜 수 기준으로 정렬한다. `추천순`은 기존 술BTI tasteProfile 매칭을 유지하고, `마감임박`은 참여 가능 상태 우선 + 남은 일수 오름차순, `최신순`은 생성/수정일 또는 id 기준 최신순으로 정렬한다.
- 펀딩 메인의 상태 필터는 helper 기준으로 진행중/성사된 프로젝트를 구분하고, `주담과 함께한 순간들` 통계도 참여 가능 펀딩 수, 총 참여자, 성공 프로젝트 수, 총 모금액을 `getFundingListStats(projects)` 기준으로 계산한다.
- 펀딩 상세의 `다른 프로젝트 둘러보기`는 메인 펀딩의 `추천순`과 같은 `sortFundingProjectsForDisplay(..., "추천순")` 기준으로 최대 4개를 보여준다. `더보기`는 `/funding?sort=recommend&scrollToTop=1`로 이동해 메인 추천순 목록을 보게 한다.
- 펀딩 상세 공유하기는 React Native Share 메시지에 `https://judam.app/funding/{project.id}` 형식의 프로젝트 URL을 포함한다. 실제 클립보드 복사/딥링크 도메인/API는 추후 연결 과제다.
- 펀딩 후기 작성은 로그인 여부뿐 아니라 `FundingContext.participatedFundings`에 해당 프로젝트 참여 기록이 있는지 확인한다. 참여 기록이 없으면 `해당 펀딩에 참여하지 않았습니다.` 안내를 띄우고 작성 화면으로 보내지 않는다.
- `src/features/mypage/screens/MyPageScreen.tsx`의 통계 카드에 `찜한 펀딩`을 추가했고, 값은 `FavoritesContext.favoriteFundings.length`를 기준으로 표시한다. 펀딩 메인/상세 하트와 같은 Context라 함께 변동된다.
- 양조장 프로젝트 생성/수정 payload에는 `creatorId`, `breweryId`, `favoriteCount`가 포함된다. 새로 생성한 프로젝트도 이후 `내 프로젝트` 판정과 찜 수 기반 정렬에 필요한 프론트 필드를 갖는다.
- 원래 구현되어 있던 후원하기, 프로젝트 생성/수정, 양조일지, Q&A, 후기, 찜, 권한 분기 기능은 제거하지 않았다.
- API 연결 후 남은 과제: 실제 owner id 기준 소유권 확정, 상태값 표준화, 추천순을 실제 술BTI/로그 기반 서버 점수와 결합, 인기순을 서버 찜 수 기준으로 동기화, 찜 수와 마이페이지 수치 서버 동기화, 통계 서버값 반영, 주소 검색 API, 신고 저장 API, 양조일지/Q&A/후기 CRUD API, 후기 작성 가능 여부를 실제 결제/배송 완료 데이터로 검증, 토스페이/계좌이체 결제 API 연결, 보호 서류/정산 계좌의 보안 저장소 분리.
- 온보딩, 로그인, 회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-05]: 양조장 본인 펀딩 프로젝트 수정 모드 카테고리 고정 보정 완료.

[진행 내용]:
- 사용자가 이미 만든 양조장 펀딩 프로젝트를 `프로젝트 관리하기`로 수정할 때 기본 정보의 `프로젝트 카테고리`가 막걸리 등 기존 게시글 카테고리로 고정되어야 하지 않느냐고 확인을 요청했다.
- `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`의 수정 모드 역매핑을 확인했다. 현재 demo 1번 프로젝트는 기존 게시글 데이터의 `category`가 `막걸리`라 수정 화면 진입 시 값은 맞게 채워지지만, 입력창이 editable 상태라 사용자가 바꿀 수 있는 문제가 있었다.
- 수정 모드에서는 `프로젝트 카테고리` 입력창을 비활성화하고, `기존 펀딩 게시글의 카테고리는 수정 화면에서 변경하지 않습니다.` 안내 문구를 표시한다. 생성 모드에서는 기존처럼 직접 입력 가능하다.
- 수정 제출 payload는 화면 state가 실수로 변해도 `editProject.category`/`editProject.productType`을 우선 사용하도록 보정했다. 따라서 `프로젝트 관리하기`로 들어간 기존 게시글은 카테고리와 상품 분류가 기존 게시글 기준으로 유지되고, 제목/소개/금액/일정 등 수정 가능한 값만 반영된다.
- 게시글 데이터에 카테고리가 비어 있는 예외 상황에서는 수정 화면이 빈 필수값으로 잠기지 않도록 `막걸리`를 fallback으로 채운다.
- 백엔드/API/AI/결제/서버 저장 로직은 추가하지 않았고, 온보딩/로그인/회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-05]: 펀딩 프로젝트 생성/수정 후 상세 뒤로가기 플로우 보정 완료.

[진행 내용]:
- 사용자가 수정한 펀딩 게시글 상세에서 뒤로가기 버튼을 두 번 눌러야 펀딩 메인으로 가는 문제를 제보했다.
- 원인은 상세에서 `프로젝트 관리하기`를 `router.push`로 열고, 수정 제출 성공 후 `router.replace('/funding/{id}')`로 상세를 다시 열면서 스택 아래에 수정 전 상세가 남아 있었기 때문이다. 이후 상세 헤더 뒤로가기가 `router.back()`을 타면 펀딩 메인이 아니라 남아 있던 상세로 한 번 이동했다.
- `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`의 제출 성공 `게시글 확인` 이동 경로에 `fromProjectForm=1` query를 붙였다. 생성/수정 폼에서 상세로 넘어온 경우를 같은 기준으로 표시한다.
- `src/features/funding/screens/FundingDetailScreen.tsx`는 `fromProjectForm=1` query를 읽고, 이 상태에서 헤더 뒤로가기 버튼을 누르면 히스토리를 되감지 않고 `/funding`으로 `router.replace`한다. 기존 후기 상세 복귀용 `fromReview=1` 뒤로가기 플로우는 유지했다.
- 펀딩 페이지 범위 안에서만 수정했고, 온보딩/로그인/회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-05]: 펀딩 후원 성공 뒤로가기, 후기 1회 작성/수정, 주소 안내 문구 보정 완료.

[진행 내용]:
- 사용자가 펀딩 전체 점검 결과 중 마이페이지 후원 내역 연결은 담당자 구현 후 연결하고, 수량 제한과 후기 직접 진입 완료 상태 제한은 지금 넣지 않겠다고 결정했다.
- 후원 성공 모달의 `프로젝트로 돌아가기`를 누르면 `/funding/{id}?fromSupport=1`로 이동하게 했다. `FundingDetailScreen`은 `fromSupport=1` 상태에서 헤더 뒤로가기를 누르면 `router.back()` 대신 `/funding`으로 `router.replace`해 한 번에 펀딩 메인으로 돌아간다.
- `src/features/funding/reviews.ts`의 `FundingReview`에 선택 필드 `userId`를 추가하고, `isFundingReviewOwnedByUser` helper를 만들었다. 새로 작성되는 후기는 user id를 함께 저장하므로 같은 사용자의 중복 작성 여부를 안정적으로 판단한다. 기존 seed 후기처럼 userId가 없는 데이터는 userName fallback으로 판단한다.
- `FundingContext`에 `updateFundingReview(reviewId, review)`를 추가했다. 후기 수정 시 기존 id, 작성일, 좋아요 수는 유지하고 내용/별점/이미지/태그/그날의 기록만 갱신하며 `timestamp`는 `방금 수정`으로 표시한다.
- 펀딩 상세 후기 탭에서 이미 본인이 작성한 후기가 있으면 `나도 후기 작성하기`를 눌렀을 때 새 후기를 만들지 않고 `이미 작성한 후기입니다. 기존 후기를 수정하시겠습니까?` 모달을 띄운다. `수정하기`를 누르면 기존 후기 작성 화면을 `/archive/review/{projectId}?reviewId={reviewId}` 수정 모드로 연다.
- `FundingReviewWriteScreen`은 `reviewId` query를 받으면 기존 후기 데이터를 별점, 이미지, 상세 후기, 그날의 기록, 태그에 채워 수정 모드로 동작한다. 직접 `/archive/review/{projectId}`로 들어와도 본인이 이미 작성한 후기가 있으면 새로 만들지 않고 기존 후기 수정 모드로 열린다.
- 후기 수정 제출 후에는 기존 후기 상세 `/funding/{projectId}/review/{reviewId}`로 돌아가 수정된 내용이 보인다.
- 후원하기 주소 검색 모달 하단에 보이던 개발용 `실제 서비스에서는 주소 검색 API...` mock 안내 문구를 제거했다. 주소 검색 자체는 기존처럼 mock 주소 목록과 직접 입력 주소 사용을 유지한다.
- 펀딩 페이지 범위 안에서만 수정했고, 온보딩/로그인/회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-05]: 일반 사용자 로그인 기준 펀딩 플로우 재점검 및 사용자 노출 개발 문구 제거.

[진행 내용]:
- 사용자가 일반 사용자로 로그인했을 때 펀딩 메인, 토글/정렬, 상세 소개/양조일지/Q&A/후기, 프로젝트 후원하기의 전체 플로우와 로직에서 더 구현해야 하거나 놓친 부분이 있는지 재검사를 요청했다.
- 검사 범위는 일반 사용자 계정 기준의 펀딩 페이지로 제한했다. 온보딩/로그인/회원가입 잠금 영역과 양조장 프로젝트 등록 화면은 수정하지 않았다.
- 후원하기 화면의 개인정보 처리방침 모달에 남아 있던 `실제 서버 연동 전까지는 화면 내 mock 데이터로만 처리됩니다.` 개발용 문구를 제거하고, 사용자에게 보여도 자연스러운 개인정보 수집/이용 안내 문장만 남겼다.
- 일반 사용자 플로우 기준으로 확인한 현재 남은 과제는 마이페이지 담당 화면과 연결될 후원 내역 상세 연결, 실제 사용자별 참여/찜/후기/댓글 서버 동기화, 실제 주소 검색/결제 API 연결, 신고 저장 API, 후기 작성 가능 여부의 실제 결제/배송 완료 데이터 검증이다. 사용자가 수량 제한과 후기 직접 진입 완료 상태 제한은 지금 넣지 않겠다고 결정했으므로 현재 프론트에서는 추가하지 않는다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-05]: 양조장 로그인 기준 펀딩 플로우 재점검 및 인증 권한 보강 완료.

[진행 내용]:
- 사용자가 양조장으로 로그인했을 때 펀딩 메인, 프로젝트 등록, 내 프로젝트 표시, 상세 소개/양조일지/Q&A/후기, 프로젝트 관리하기, 다른 프로젝트 후원하기, 직접 진입 방어까지 전체 플로우와 로직에서 놓친 부분이 있는지 재검사를 요청했다.
- 확인 결과 인증 완료 양조장 기준의 큰 흐름은 유지된다. 펀딩 메인 hero에는 양조장 파트너 pill과 `프로젝트 등록` CTA가 표시되고, 등록 CTA는 약관 화면을 거쳐 프로젝트 생성 화면으로 이어진다. 본인 프로젝트 상세에서는 하단 CTA가 `프로젝트 관리하기`로 표시되며, 다른 양조장의 진행 중 프로젝트는 일반 사용자처럼 후원할 수 있다.
- 권한 보강 1: `BreweryProjectTermsScreen`은 기존에 로그인 여부만 검사해 직접 URL 진입 시 일반 사용자나 미인증 양조장도 약관 화면까지 볼 수 있었다. 이제 인증 완료 양조장만 약관 본문을 볼 수 있고, 일반 사용자는 `양조장 계정이 필요합니다`, 미인증 양조장은 `양조장 인증이 필요합니다` 가드 화면을 본다.
- 권한 보강 2: `FundingDetailScreen`의 `양조일지 관리` 버튼과 sticky tab index는 이제 `본인 프로젝트`이면서 `양조장 인증 완료` 상태일 때만 관리 버튼을 포함하도록 맞췄다. 미인증 양조장이 본인 프로젝트로 판정되는 예외 상황에서는 하단 CTA가 `양조장 인증하기`로 표시되고 인증 화면으로 보낸다.
- 권한 보강 3: `BreweryJournalManageScreen` 직접 진입도 `user.isBreweryVerified && isFundingProjectOwnedByBrewery(user, project)` 기준으로 막았다. 문구처럼 해당 프로젝트를 만든 인증 양조장만 양조일지를 작성/수정/삭제할 수 있다.
- 현재 mock 소유권 기준은 `creatorId`/`breweryId` 우선, 양조장명 fallback, demo project id 1 예외 순서다. 따라서 API 연결 전 mock에서는 demo 1번 프로젝트와, 로그인 양조장명과 같은 seed 프로젝트가 본인 프로젝트로 보일 수 있다. 실제 API 연결 후에는 owner id를 명확히 넣어 이 fallback 의존을 줄여야 한다.
- 남은 과제는 실제 양조장 owner id/권한 API 연결, 프로젝트 등록/수정 서류와 정산 정보의 보안 저장소 분리, 양조일지/Q&A/후기/신고 서버 저장, 후원 완료 후 마이페이지 후원 내역 연결, 실제 주소/결제 API 연결이다.
- 펀딩/양조장 프로젝트 영역만 수정했고, 온보딩/로그인/회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-05]: 커뮤니티 게시글 수 축소 및 프로필 이미지 로컬 교체 완료.

[진행 내용]:
- 사용자가 하단바 기준 커뮤니티 페이지의 게시글 개수를 자유게시판 1개, 정보게시판 2개로 줄이고, 해당 게시글과 댓글 프로필 이미지를 `newpicture`의 `person1~6` 이미지로 골고루 교체해달라고 요청했다.
- 작업 전 `judam.md`, `src/contexts/CommunityContext.tsx`, `CommunityScreen`, `CommunityDetailScreen`, 실제 로컬 이미지 폴더를 확인했다.
- 실제 폴더명은 `newpicture`가 아니라 기존 프로젝트 구조의 `newpicutre`였고, 그 안의 `person1.png`~`person6.png`를 사용했다.
- `CommunityContext`의 초기 게시글을 총 3개로 줄였다. 자유게시판 1개, 정보게시판 2개 구성이다.
- 초기 게시글 3개의 프로필 이미지는 `person1`, `person2`, `person3`을 사용하도록 변경했다.
- 커뮤니티 목록 화면은 URL 문자열과 로컬 이미지 source를 모두 처리할 수 있도록 `getAvatarSource` helper를 추가했다.
- 커뮤니티 상세 화면의 게시글/댓글 프로필 이미지는 `person1~6`을 고르게 사용하도록 교체했고, 상세 화면도 로컬 이미지 source를 처리하도록 변경했다.
- 새로 작성되는 게시글의 기존 URL avatar 흐름은 깨지지 않도록 `avatar` 타입은 로컬 이미지와 문자열 URL을 모두 허용한다.
- 백엔드/API/AI/서버 저장 로직 추가 없이 프론트 mock 데이터와 이미지 source 처리만 수정했다.
- `npx tsc --noEmit`, `npm run lint` 통과.

[2026-05-05]: 레시피 제안 화면 Router 로딩 오류 수정 완료.

[진행 내용]:
- 사용자가 Android 번들 중 `app/recipe/create.tsx` default export 누락 경고와 `ReferenceError: Property 'RefreshReg$' doesn't exist` 오류가 발생한다고 공유했다.
- 작업 전 `judam.md`, `app/recipe/create.tsx`, `src/features/recipe/screens/RecipeCreateScreen.tsx`를 확인했다.
- 실제 원인은 `RecipeCreateScreen.tsx` 내부의 깨진 문자열 리터럴과 닫히지 않은 JSX Text 태그 때문에 모듈 평가가 실패하고, 그 결과 Expo Router가 default export를 읽지 못하는 흐름이었다.
- 레시피 제목 placeholder의 닫히지 않은 문자열을 복구했고, 맛 태그/서브 재료 배열과 일부 깨진 JSX Text 태그 및 화면 문구를 정상 한국어 문자열로 복구했다.
- 파일 저장 중 생긴 UTF-8 BOM 경고도 제거했다.
- `app/recipe/create.tsx`의 re-export 구조는 유지했고, 백엔드/API/AI/서버 저장 로직은 변경하지 않았다.
- `npx tsc --noEmit`, `npm run lint`, `git diff --check` 통과.
- `npx expo export --platform web --output-dir .tmp/judam-recipe-create-route-check`는 120초 제한 안에 끝나지 않아 타임아웃되었지만, TypeScript/ESLint 기준 route screen 모듈 구문 오류는 해소된 상태다.

[2026-05-05]: 주담 레시피 상세 프로필 이미지 로컬 교체 완료.

[진행 내용]:
- 사용자가 하단바 기준 주담 페이지 레시피 리스트의 각 상세 화면에서 제안자와 댓글 프로필 이미지를 `person1~6`으로 골고루 바꿔달라고 요청했다.
- 작업 전 `judam.md`, `RecipeDetailScreen`, `newpicutre/person1~6.png` 존재 여부를 확인했다.
- `RecipeDetailScreen`에 `personImages` 배열과 `getAvatarSource` helper를 추가했다.
- 제안자 프로필은 레시피 id 기준으로 `person1~6` 중 하나를 순환 사용하게 했다.
- 초기 댓글 6개는 `person1`부터 `person6`까지 순서대로 사용하게 했다.
- 새 댓글 프로필은 현재 댓글 수 기준으로 `person1~6`을 순환 사용하게 했다.
- 기존 레시피 상세 데이터/댓글/좋아요/권한/백엔드/API/AI 로직은 변경하지 않았다.
- 검증 결과 `npx tsc --noEmit`, `npm run lint`, `git diff --check` 모두 통과했다.

[2026-05-05]: 양조장 대시보드 헤더/펀딩 CTA/하단 요약 카드 정리.

[진행 내용]:
- 사용자가 마이페이지에서 진입하는 양조장 대시보드 화면만 수정하고, 다른 부분은 건드리지 말라고 요청했다.
- 작업 전 `judam.md`와 `BreweryDashboardScreen` 위치 및 관련 UI 문자열을 확인했다.
- 양조장 대시보드 상단바 제목 왼쪽에 뒤로가기 버튼을 추가했고, 누르면 `/(tabs)/mypage`로 돌아가게 했다.
- 내 펀딩 현황 영역의 `새펀딩` 버튼 UI를 제거했다.
- 알림 및 정보 영역 하단의 `새 댓글`, `새 좋아요` quick stat 카드 2개를 제거했다.
- 양조장 대시보드 외 다른 화면/라우트/데이터/API 로직은 변경하지 않았다.
- 검증 결과 `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-05]: 양조장 대시보드 내 펀딩 현황 통계 및 종료 펀딩 표시 조정.

[진행 내용]:
- 사용자가 양조장 대시보드 화면에서 내 펀딩 현황 아래 통계 3개를 `[진행 중 / 전체 펀딩 수 / 총 참여자]`로 바꾸고, 세 카드 배경을 모두 첫 카드처럼 검정색으로 맞춰달라고 요청했다.
- 사용자가 가능하다면 펀딩 페이지의 종료된 펀딩도 하나 가져와 화면에 보여줄 수 있는지 물었다.
- 작업 전 `judam.md`, `BreweryDashboardScreen`, `FundingContext`, `constants/data`의 펀딩 상태 데이터를 확인했다.
- `BreweryDashboardScreen`에서 대시보드 표시용 프로젝트 목록에 종료된 펀딩 샘플 1개를 추가로 포함하도록 했다. 이미 해당 양조장 프로젝트 목록에 포함된 프로젝트는 중복 추가하지 않는다.
- 진행중 탭은 기존처럼 진행/예정/심사 중 펀딩을 보여주고, 종료됨 탭에서는 포함된 종료 펀딩을 볼 수 있게 했다.
- 통계 카드는 `진행 중`, `전체 펀딩 수`, `총 참여자` 순서로 바꾸고 모두 검정 배경 스타일을 사용하게 했다.
- 양조장 대시보드 외 다른 화면/라우트/API 로직은 변경하지 않았다.
- 검증 결과 `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-05]: 양조장 대시보드 종료 펀딩 양조일지 접근 및 제조 현황 섹션 제거.

[진행 내용]:
- 사용자가 양조장 대시보드의 종료됨 탭에 표시되는 펀딩도 해당 양조장이 진행했던 펀딩이므로 접근 제한 없이 `양조일지 관리` 화면을 보여줘야 한다고 요청했다.
- 사용자가 `제조 진행 현황` UI 섹션을 `알림 및 정보` 위까지 제거하고, `알림 및 정보` 오른쪽 `전체보기 >`를 검정색 한 줄 표시로 바꿔달라고 요청했다.
- 작업 전 `judam.md`, `BreweryDashboardScreen`, `BreweryJournalManageScreen`, `funding/ownership` 소유권 판정 로직을 확인했다.
- 대시보드에서 보여주는 종료 펀딩 샘플이 양조장 관리 대상처럼 양조일지 관리 화면에 접근할 수 있도록 demo 소유권 판정에 종료 펀딩 id를 포함했다.
- `BreweryDashboardScreen`에서 `제조 진행 현황` 섹션 UI를 제거했다.
- 제거된 제조 진행 현황 섹션에서만 쓰던 가로 스크롤, 그라데이션, 제조 단계 카드 관련 import/state/style도 정리했다.
- `알림 및 정보`의 `전체보기 >` 링크를 `View` 기반 한 줄 레이아웃으로 바꾸고 텍스트/화살표 색상을 검정색으로 통일했다.
- 이번 변경은 양조장 대시보드와 해당 종료 펀딩 양조일지 접근에 필요한 소유권 판정만 수정했고, 다른 화면 UI는 변경하지 않았다.
- 검증 결과 `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-05]: 홈 인기 레시피 제안 더보기 문구 변경.

[진행 내용]:
- 사용자가 하단바 기준 홈 화면의 `인기 레시피 제안` 옆 버튼 문구를 `더보기 >`에서 `전체보기 >`로 바꿔달라고 요청했다.
- 작업 전 `judam.md`와 `HomeScreen`의 해당 섹션 문구를 확인했다.
- `HomeScreen`의 인기 레시피 제안 섹션 버튼 텍스트만 `전체보기`로 변경했다.
- 홈 화면의 다른 섹션, 라우팅, 데이터 로직은 변경하지 않았다.
- 검증 결과 `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-06]: 양조일지 관리 저장 후 현재 화면 유지로 변경.

[진행 내용]:
- 사용자가 양조장 대시보드의 `내 펀딩 현황`에서 `양조일지 관리`로 이동해 임의 요소를 입력하고 저장했을 때, 펀딩 메인 페이지로 이동하지 않고 양조일지 관리 화면에 남아 추가된 요소를 바로 볼 수 있어야 한다고 요청했다.
- 작업 전 `judam.md`, `BreweryJournalManageScreen`, `FundingContext.updateProjectJournals` 저장 흐름을 확인했다.
- `BreweryJournalManageScreen`의 저장 로직에서 `router.replace(/funding/{id}?tab=journal)` 이동을 제거했다.
- 저장/수정 후에는 기존처럼 `updateProjectJournals`로 context 데이터를 갱신하고, 작성 모달을 닫은 뒤 같은 관리 화면에 남아 목록에 갱신된 양조일지를 보여주게 했다.
- 저장/수정 완료 시 사용자에게 `양조일지가 저장되었습니다.`, `양조일지가 수정되었습니다.` 알림을 표시한다.
- 양조일지 관리 화면의 저장 후 이동 흐름만 수정했고, 펀딩 상세/대시보드/데이터 구조는 변경하지 않았다.
- 검증 결과 `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-06]: AI 채팅 양조장 요청 카테고리 제거 및 새 대화 기록 저장.

[진행 내용]:
- 사용자가 상단바 메시지 아이콘으로 진입하는 AI 채팅 화면에서 기존 4개 카테고리 중 `양조장 요청` 채팅방 요소를 삭제해달라고 요청했다.
- 사용자가 남은 3개 카테고리(`술 추천`, `안주 추천`, `통합 AI`)에서 대화가 없을 때 `새 대화 시작하기`를 누르면 해당 카테고리 채팅방이 생성되고 기록으로 남아야 한다고 요청했다.
- 사용자가 우측 하단 검정색 `+` 버튼에서 채팅방 종류를 고른 경우에도 선택한 카테고리에 채팅방이 생성되고 기록으로 남아야 한다고 요청했다.
- 작업 전 `judam.md`, `app/ai-chat`, `app/ai-chat/[category]/[roomId]`, `AIChatScreen`, `AIChatRoomScreen`, `SafeStorage`를 확인했다.
- `AIChatScreen`의 카테고리 목록에서 `brewery/양조장 요청`을 제거하고 타입도 `recommend`, `pairing`, `general` 3개로 제한했다.
- `AIChatScreen`에 `SafeStorage` 기반 채팅방 목록 저장/불러오기 로직을 추가했다. 기존 저장값에 `brewery` 카테고리 방이 남아 있으면 화면 목록에서 제외된다.
- 빈 카테고리 화면의 `새 대화 시작하기` 버튼은 현재 선택된 카테고리의 새 채팅방을 만들고 바로 해당 방으로 이동하게 했다.
- 우측 하단 `+` 메뉴의 각 카테고리 항목도 단순 선택이 아니라 해당 카테고리 새 채팅방을 만들고 바로 이동하게 했다.
- 채팅방 상세 화면의 메시지 전송 로직/API/AI 서버 연동 로직은 변경하지 않았다.
- 검증 결과 `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-06]: 펀딩 페이지 UI/데이터/뒤로가기/프로젝트 생성 기준 보정 완료.

[진행 내용]:
- 사용자가 펀딩 페이지에서 찜 하트 색상 통일, 후기 태그 pill 높이 보정, 펀딩 더미데이터 막걸리화, 상세 하단 추천 카드 UI 통일, 펀딩 상세 뒤로가기 플로우 고정, 프로젝트 미리보기 헤더 문구 추가, 양조장 프로필 이미지 반영, 양조장 정보 초기값/불러오기 흐름, 신분증/사업자등록증 필수 진행률 반영을 순차 구현해달라고 요청했다.
- `FundingListScreen`의 펀딩 카드 하트는 찜 활성 시 흰색이 아니라 상세/추천과 같은 빨간색 fill/stroke로 표시되게 했다.
- `FundingDetailScreen`의 `다른 프로젝트 둘러보기` 추천 카드 UI를 메인 펀딩 목록 카드와 같은 구성으로 맞췄다. 썸네일, 하트, 양조장명, 카테고리, 상태 badge, 진행률/금액/남은일, Progress bar를 같은 톤으로 보여준다.
- `FundingDetailScreen`의 헤더 뒤로가기와 Android hardware back은 어떤 진입 경로든 항상 `/funding`으로 `router.replace`하도록 바꿨다. 이제 펀딩 상세에서 뒤로가기를 누르면 이전 상세/프로젝트 폼/약관이 아니라 펀딩 메인으로 바로 돌아간다.
- 펀딩 상세 양조장 정보 바는 `project.breweryProfileImage`가 있으면 동그란 이미지로 보여주고, 없으면 기존 `breweryLogo` 이모지 fallback을 사용한다. `BreweryProfileScreen`도 project id 기준으로 `FundingContext.projects`를 찾아 양조장명, 위치, bio, 프로필/대표 이미지를 표시한다.
- `FundingReviewWriteScreen`의 맨 아래 선택된 태그 목록은 Text 배경 방식에서 View pill + Text 방식으로 바꿨다. 고정 높이, `lineHeight`, `includeFontPadding: false`로 태그 칩 세로 길이가 들쭉날쭉하지 않게 했다.
- `src/constants/data.ts`의 펀딩 프로젝트 mock 중 약주/소주였던 3번, 4번, 6번 프로젝트를 모두 막걸리 프로젝트로 리뉴얼했다. 제목, category, shortDescription, rewardItems, main/subIngredients, projectSummary, story, budget/schedule 일부 표현, 도수와 tasteProfile을 막걸리 기준으로 맞췄다. `funding/reviews.ts`의 후기 작성자명에 남은 약주 표현도 막걸리로 바꿨다. 레시피 mock 데이터의 약주 표현은 펀딩 페이지 범위가 아니라 이번 작업에서 바꾸지 않았다.
- `BreweryProjectCreateScreen`에서 새 프로젝트 생성 시 양조장 정보 탭이 user 정보로 자동 채워지던 effect를 제거했다. 처음에는 빈 상태이고, `불러오기`를 눌렀을 때만 양조장명, 프로필 이미지, 소개, 세금계산서/사업자 정보가 mock 저장 정보로 들어온다. 본인인증/입금계좌/신분증 파일은 계속 비워 양조장이 직접 처리하게 둔다.
- 프로젝트 카테고리는 생성/수정 모두 `막걸리` 고정 read-only로 바꿨고, 생성 화면에는 `현재 주담 펀딩은 막걸리 프로젝트만 등록합니다.` 안내를 표시한다.
- 양조장 정보 탭의 `신분증/사업자등록증` 파일 업로드는 필수 항목으로 바꿨다. 이 항목도 진행률 계산에 포함되어 실제 파일을 선택해야 100% 제출 가능 상태에 도달한다.
- 프로젝트 생성/수정 미리보기 Modal 헤더에는 `게시글 미리보기` 제목을 추가했다.
- 백엔드/API/AI/결제/서버 저장 로직은 추가하지 않았고, 온보딩/로그인/회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-06]: 펀딩 카드 메인재료 표시 및 프로젝트 등록 진행률 97% 문제 보정.

[진행 내용]:
- 사용자가 펀딩 메인 목록과 상세 하단 `다른 프로젝트 둘러보기` 목록에서 모든 프로젝트에 `막걸리` 태그가 반복되는 대신, 프로젝트 등록/수정 시 입력한 메인재료가 보이게 해달라고 요청했다.
- `src/features/funding/projectLabels.ts`에 `getFundingMainIngredientLabel` helper를 추가했다. 우선 `FundingProject.mainIngredients`를 표시하고, 없으면 `ingredients[0].ingredient`, 그래도 없으면 `주재료` fallback을 사용한다.
- `FundingListScreen`의 메인 펀딩 카드와 `FundingDetailScreen`의 추천 프로젝트 카드에서 기존 category badge 텍스트를 `getFundingMainIngredientLabel(project)` 기준으로 바꿨다. 카드 구조와 하트/상태/진행률/금액/남은일 UI는 유지했다.
- 펀딩 프로젝트 생성/수정 payload는 `basicInfo.mainIngredient`를 `FundingProject.mainIngredients`로 저장하는 기존 흐름을 유지한다. 프로젝트 카테고리와 상품 분류는 생성/수정 모두 `막걸리`로 고정해 목록에는 메인재료, 데이터에는 막걸리 프로젝트 기준이 함께 유지되게 했다.
- 사용자가 펀딩 프로젝트 만들기에서 필수 항목을 다 입력했는데도 진행률이 97%에 머무는 문제를 제보했다. 원인은 화면에서는 막걸리로 고정되어 보이는 프로젝트 카테고리/상품 분류가 예전 임시저장 데이터에서는 빈 값으로 남을 수 있고, 완전히 빈 원재료 추가 행도 필수 계산에 들어갈 수 있는 구조였다.
- `BreweryProjectCreateScreen`의 진행률 계산에서 프로젝트 카테고리와 상품 분류는 고정값 `막걸리`로 항상 완료 처리한다. 임시저장 초안을 불러올 때도 `basicInfo.category`, `productInfo.productType`을 `막걸리`로 보정한다.
- 원재료 구성요소 진행률은 완전히 빈 추가 행을 무시하고, 값이 하나라도 들어간 행은 주 소재와 원산지가 모두 채워졌을 때만 완료 처리한다. 최소 1개의 완성된 원재료 행은 여전히 필요하다.
- 이전 요청대로 `신분증/사업자등록증`, 사업자 등록증 사본, 통신판매신고증, 주류 통신판매 승인서, 전통주 제조면허증은 필수 파일로 유지한다. 특히 신분증/사업자등록증을 실제 파일 선택기로 등록하지 않으면 100%가 되지 않는 것이 현재 의도된 동작이다.
- 백엔드/API/AI/결제 로직은 추가하지 않았고, 온보딩/로그인/회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-06]: 주담 레시피 상세 펀딩 제안 권한 및 작성자 수정/삭제 메뉴 추가.

[진행 내용]:
- 사용자가 하단바 기준 주담 페이지의 레시피 상세에서 `이 레시피로 펀딩 제안하기` 버튼은 일반 로그인 사용자와 비회원에게 보이지 않고, 오직 양조장 계정에게만 보여야 한다고 요청했다.
- 사용자가 해당 게시물 작성자와 각 댓글 작성자가 세 점 메뉴를 눌러 수정/삭제 기능을 사용할 수 있으면 좋겠다고 요청했다.
- 작업 전 `judam.md`, `RecipeDetailScreen`, `RecipeCreateScreen`, `AuthContext`, `recipesData`를 확인했다.
- `RecipeDetailScreen`에서 펀딩 제안 버튼 렌더링을 `user.type === 'brewery'`인 경우로 제한했다.
- 레시피 작성자가 현재 로그인 사용자와 일치할 때만 레시피 작성자 영역에 세 점 메뉴를 표시하고, 수정/삭제 액션을 제공했다.
- 레시피 수정은 `/recipe/create?editRecipeId={recipe.id}`로 이동하게 했고, 삭제는 레시피 목록으로 돌아가게 했다.
- 댓글 작성자가 현재 로그인 사용자와 일치할 때만 댓글 작성자 영역에 세 점 메뉴를 표시하고, 수정/삭제 액션을 제공했다.
- 댓글 삭제는 해당 댓글을 즉시 목록에서 제거하고, 댓글 수정은 기존 댓글 내용을 하단 입력창에 채운 뒤 기존 댓글을 제거해 다시 작성할 수 있게 했다.
- `RecipeCreateScreen`은 `editRecipeId` 파라미터가 있으면 기존 레시피의 제목, 메인 재료, 설명을 초기값으로 채워 수정 진입처럼 보이게 했다.
- 백엔드/API/서버 저장 로직은 추가하지 않았고, 현재 프론트 mock 상태 범위에서 동작하도록 구현했다.
- 검증 결과 `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-06]: 주담 첫 번째 레시피와 첫 댓글을 임시 사용자 작성물로 설정.

[진행 내용]:
- 사용자가 직전 수정이 커뮤니티가 아니라 주담 레시피 페이지에 적용된 것이 맞는지 확인했다. 직전 작업은 `RecipeDetailScreen`과 `RecipeCreateScreen` 중심으로 주담 레시피 상세/작성 화면에 적용된 것이 맞다.
- 사용자가 첫 번째 레시피 게시물을 임시로 사용자가 작성한 게시물로 설정하고, 첫 번째 게시물의 첫 번째 댓글도 사용자가 작성한 댓글로 임시 설정해달라고 요청했다.
- 작업 전 `judam.md`, `recipesData`, `RecipeDetailScreen`을 확인했다.
- `recipesData`의 첫 번째 레시피 작성자를 일반 사용자 mock 계정 이름인 `김주담`으로 변경했다.
- `RecipeDetailScreen`에서 첫 번째 레시피 상세의 첫 번째 댓글 작성자를 현재 로그인 사용자 이름으로 표시하고, 로그인 사용자가 없으면 `김주담`으로 표시하게 했다.
- 이 변경으로 일반 사용자 mock 계정 로그인 시 첫 번째 레시피와 첫 번째 댓글에 작성자용 세 점 메뉴가 보이는 상태를 확인할 수 있다.
- 백엔드/API/실제 저장 로직은 변경하지 않았고, 프론트 mock 데이터 확인용 임시 설정만 적용했다.
- 검증 결과 `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-06]: 주담 레시피 상세 세 점 메뉴 위치 및 댓글 수정 흐름 보정.

[진행 내용]:
- 사용자가 주담 레시피 상세 게시글 세 점 메뉴를 작성자 영역이 아니라 상단바 맨 오른쪽으로 옮기고, 좋아요는 기존 작성자 줄 위치로 되돌려달라고 요청했다.
- 사용자가 댓글 수정 후 다시 올리면 맨 아래로 붙지 않고 원래 댓글 위치에 남아야 한다고 요청했다.
- 사용자가 `visibleComments.map` 렌더링 흐름에서 오류가 발생한다고 공유했다.
- 작업 전 `judam.md`, `RecipeDetailScreen`, 커뮤니티 상세 상단바 메뉴 구조를 확인했다.
- `RecipeDetailScreen`의 게시글 작성자용 세 점 메뉴를 상단바 오른쪽 `headerMenuBtn` 위치로 이동했다.
- 작성자 정보 줄에서는 게시글 세 점 메뉴를 제거하고 좋아요 버튼만 기존 위치에 남겼다.
- 댓글 수정 상태를 `editingCommentId`로 추적하게 했다.
- 댓글 수정 시 기존 댓글을 목록에서 제거하지 않고 입력창에 내용을 채우며, 저장 시 같은 댓글 id의 content/timestamp만 갱신하게 했다. 따라서 수정된 댓글은 원래 위치를 유지한다.
- 댓글 삭제 중 수정 중이던 댓글을 삭제하는 경우 입력창과 수정 상태를 함께 초기화하게 했다.
- 검증 결과 `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-06]: 주담/커뮤니티 상세 메뉴 UI와 게시글·댓글 수정/삭제 흐름 정리.

[진행 내용]:
- 작업 전 `judam.md`, 주담 레시피 상세, 커뮤니티 상세/작성 화면, 커뮤니티 컨텍스트를 확인했다.
- 주담 레시피 상세의 작성자용 세 점 메뉴 UI를 기존 중앙 알림형 모달에서 커뮤니티 상단 메뉴와 같은 작은 드롭다운 카드 형태로 변경했다.
- 주담 레시피 댓글의 작성자용 세 점 메뉴도 같은 드롭다운 스타일로 열리게 조정했고, 스크롤 시작 시 열린 메뉴가 닫히도록 했다.
- 커뮤니티 컨텍스트에 `updatePost`를 추가해 기존 게시글을 수정 저장할 수 있게 했다.
- 커뮤니티 첫 번째 게시글의 임시 작성자를 `김주담`으로 설정했다.
- 커뮤니티 게시글 상세에서 수정을 누르면 `/community/create?editPostId={post.id}`로 이동하고, 작성 페이지에 기존 제목/내용/카테고리/이미지가 채워지도록 했다.
- 커뮤니티 게시글 상세에서 삭제를 누르면 해당 게시글을 mock 컨텍스트 목록에서 제거하고 커뮤니티 목록으로 돌아가게 했다.
- 커뮤니티 첫 번째 게시글의 첫 번째 댓글은 현재 로그인 사용자 작성 댓글로 임시 설정해 댓글 작성자용 메뉴가 확인되도록 했다.
- 커뮤니티 댓글에도 작성자에게만 세 점 메뉴가 보이도록 추가했고, 댓글 수정은 입력창에 기존 내용을 채운 뒤 같은 댓글 위치에서 내용만 갱신되도록 했다.
- 커뮤니티 댓글 삭제는 해당 댓글만 목록에서 제거하고, 수정 중이던 댓글이면 입력 상태도 함께 초기화하도록 했다.
- 백엔드 API나 실제 서버 저장 로직은 추가하지 않았고, 현재 프론트 mock/context 상태 범위에서 동작하도록 구현했다.
- 검증 결과 `npx tsc --noEmit`, `npm run lint`, `git diff --check` 모두 통과했다.

[2026-05-06]: 커뮤니티 게시글 상세 상단 세 점 표시 권한 보정.

[진행 내용]:
- 작업 전 `judam.md`와 `CommunityDetailScreen`의 상단 메뉴 렌더링 조건을 확인했다.
- 커뮤니티 게시글 상세에서 게시글 작성자가 아닌 경우 상단 오른쪽 세 점 버튼 자체가 보이지 않도록 변경했다.
- 작성자인 경우에만 세 점 버튼과 수정/삭제 드롭다운이 렌더링되며, 작성자가 아닌 경우에는 상단바 균형을 위한 빈 아이콘 자리만 유지한다.
- 기존 비작성자용 비활성화 메뉴 스타일은 더 이상 필요하지 않아 제거했다.
- 백엔드/API 로직 변경 없이 프론트 렌더링 조건만 수정했다.
- 검증 결과 `npx tsc --noEmit`, `npm run lint`, `git diff --check` 모두 통과했다.

[2026-05-06]: 커뮤니티 자유게시판 첫 번째 게시글 임시 사용자 작성물 판정 보강.

[진행 내용]:
- 작업 전 `judam.md`, `AuthContext`, 커뮤니티 mock/context 게시글 데이터를 확인했다.
- 일반 로그인 mock 사용자 이름은 `김주담`이고, 커뮤니티 자유게시판 첫 번째 게시글 작성자도 이미 `김주담`으로 맞춰져 있음을 확인했다.
- 회원가입 등으로 현재 사용자 이름이 달라진 경우에도 자유게시판 첫 번째 게시글은 임시로 현재 일반 사용자 작성물처럼 동작하도록 `CommunityDetailScreen`의 작성자 판정 조건을 보강했다.
- 이 변경으로 일반 사용자 로그인 상태에서 첫 번째 자유게시판 게시글 상세에 들어가면 수정/삭제 세 점 메뉴 권한이 유지된다.
- 백엔드/API 로직 변경 없이 프론트 mock 권한 판정만 수정했다.
- 검증 결과 `npx tsc --noEmit`, `npm run lint`, `git diff --check` 모두 통과했다.

[2026-05-06]: 펀딩 프로젝트 검색태그 및 등록 폼 데이터 보존 로직 보정.

[진행 내용]:
- 사용자가 양조장 프로젝트 등록 후 본인 프로젝트의 `프로젝트 관리하기`로 다시 들어가면 기본정보 탭의 검색태그가 사라지고, 기존 더미 프로젝트도 검색태그가 비어 있다고 제보했다.
- 원인은 등록 폼 내부에는 `basicInfo.tags`가 있었지만 `FundingProject` 타입, 더미 데이터, 생성/수정 payload에 검색태그 저장 필드가 없었고, 수정 화면 초안 생성도 항상 `tags: []`로 초기화하고 있었기 때문이다.
- `src/constants/data.ts`의 `FundingProject`에 `tags?: string[]`를 추가하고, 6개 펀딩 mock 프로젝트에 각각 검색태그를 채웠다.
- `BreweryProjectCreateScreen`에서 프로젝트 생성/수정 제출 시 `basicInfo.tags`를 trim/중복 제거/최대 10개 기준으로 `FundingProject.tags`에 저장한다. 수정 화면을 열 때는 `project.tags`를 다시 기본정보 탭의 검색태그로 복원한다. 오래된 임시저장 초안에 `tags`가 없으면 빈 배열로 안전하게 보정한다.
- 펀딩 메인 검색은 프로젝트명, 양조장명, 카테고리, 지역 외에 `mainIngredients`, `subIngredients`, `tags`까지 포함해 검색한다.
- 같은 데이터 보존 패턴을 점검해, 폼에는 있지만 프로젝트 데이터에 저장되지 않던 `짧은 제목`, 안내사항의 `프로젝트 정책`, `예상되는 어려움`도 `FundingProject.shortTitle`, `projectPolicy`, `expectedDifficulties`로 저장/수정 복원되게 했다. 펀딩 상세 안내사항은 프로젝트에 저장된 정책/어려움이 있으면 그 값을 우선 표시한다.
- 본인인증, 입금 계좌, 인증 서류처럼 정확한 재확인이 필요한 민감 정보는 이전 기획대로 프로젝트 게시글 데이터에 자동 보존하지 않는다.
- 백엔드/API/AI/결제 로직은 추가하지 않았고, 온보딩/로그인/회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-06]: 펀딩 페이지 잔여 부족점 점검.

[점검 결과]:
- 펀딩 메인/상세/후원하기/후기/양조일지/프로젝트 등록 흐름을 현재 코드 기준으로 다시 확인했다. 이번 점검은 코드 수정 없이 부족점 정리 목적이다.
- 현재 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.
- 가장 중요한 잔여 과제는 후원 성공 후 `FundingContext.addParticipation`에만 남는 mock 후원 기록을 마이페이지 후원 내역 화면과 연결하는 일이다. 사용자가 펀딩 전체 점검을 요청할 때 반드시 다시 리마인드해야 한다.
- 후기 작성 권한은 현재 `participatedFundings`가 fundingId 기준 mock 데이터라 사용자별 구매/배송완료/후기 가능 상태를 엄밀히 구분하지 못한다. API 연결 시 userId, payment/order id, 배송/완료 상태, review 작성 여부를 함께 봐야 한다.
- 신고하기는 사유/상세 입력 후 프론트 접수 안내만 보여준다. 실제 신고 DB 저장, 중복 신고 방지, 신고 처리 상태는 아직 없다.
- 공유하기는 React Native 공유 시트를 사용하지만, 공유 URL 복사 fallback이나 실제 앱 딥링크/웹 링크 검증은 아직 없다.
- 주소 검색은 후원하기와 프로젝트 등록 모두 mock 주소 목록 또는 입력 주소 사용 흐름이다. 실제 주소 API 연결은 아직 없다.
- 결제수단은 토스페이/계좌이체 UI와 최종 확인 modal까지만 있고, 실제 PG/계좌이체 서버 연동은 없다.
- `FundingContext`의 프로젝트 생성/수정, 양조일지, 후기, 후원 참여 기록은 앱 실행 중 로컬 Context 상태다. 새로고침/앱 재시작 후 보존되는 것은 찜, 최근 배송지, 프로젝트 작성 임시저장처럼 SafeStorage에 연결한 일부뿐이다.
- 펀딩 메인 카드와 상세 하단 추천 카드뿐 아니라 상세의 양조장 바, 후원하기 상단 프로젝트 정보, 후기 작성 상단 프로젝트 정보도 `막걸리` 반복 태그 대신 메인재료를 표시한다.
- `FundingProject.videoUrl`와 `JournalEntry.videoUrl` 타입은 있지만, Expo 앱에서는 동영상 iframe/플레이어를 만들지 않는다. 프로젝트 등록/관리의 프로젝트 계획 탭과 양조일지 작성/수정 화면은 선택 입력으로 영상 URL만 저장하고, 펀딩 상세 소개/양조일지에는 URL 텍스트만 표시한다.
- 양조장 소유권은 `isFundingProjectOwnedByBrewery`에서 `creatorId`/`breweryId`와 로그인 사용자 `id`/`uid` 매칭을 우선하고, fallback으로 양조장명 일치만 허용한다. 특정 demo project id를 모든 양조장 계정의 본인 프로젝트로 처리하지 않는다.

[2026-05-06]: 펀딩 메인재료 표시 통일, 양조일지 URL 입력, mock 소유권 예외 정리.

[진행 내용]:
- 사용자가 펀딩 상세 양조장 바와 후원하기 상단에 남은 `막걸리` category badge도 모두 메인재료로 바꿔달라고 요청했다.
- `FundingDetailScreen`, `FundingSupportScreen`, `FundingReviewWriteScreen`에서 사용자에게 노출되는 category badge 텍스트를 `getFundingMainIngredientLabel(project)` 기준으로 변경했다. 생성/수정 폼 내부의 프로젝트 카테고리/상품 분류 고정값 `막걸리`는 데이터 기준이므로 유지한다.
- 사용자가 동영상 기능은 하지 않고 URL만 사용하겠다고 정했다. `BreweryProjectCreateScreen` 프로젝트 계획 탭에 `프로젝트 영상 URL (선택)`을 추가해 `FundingProject.videoUrl`에 URL 문자열만 보존하고, `BreweryJournalManageScreen`에도 선택 입력 `영상 URL`을 추가해 `JournalEntry.videoUrl`에 URL 문자열만 보존한다. 펀딩 상세 소개/양조일지 탭과 양조일지 관리 목록은 iframe/플레이어 없이 URL 텍스트만 표시한다.
- mock 소유권 예외는 `src/features/funding/ownership.ts`에서 demo project id 1만 남겼다. 이제 양조장 로그인 시 예시 본인 프로젝트는 첫 번째 펀딩 게시글만 해당한다.
- 백엔드/API/AI/결제/영상 플레이어 로직은 추가하지 않았고, 온보딩/로그인/회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-06]: 펀딩 페이지 프론트 최종 점검 및 후기 권한/표시 보완.

[진행 내용]:
- 사용자가 펀딩 페이지 안에서만 모든 로직과 값이 맞는지, 프론트 기준으로 놓친 기능이 있는지 최종 점검해달라고 요청했다.
- 작업 전 `judam.md`를 다시 읽고, `FundingListScreen`, `FundingDetailScreen`, `FundingSupportScreen`, `FundingReviewWriteScreen`, `FundingReviewDetailScreen`, `FundingContext`, `supportConfig`, `recommendation`, 양조장 프로젝트 등록/양조일지 관리 화면을 기준으로 펀딩 메인/상세/후원/후기/양조일지/등록·수정 흐름을 점검했다.
- 프론트에서 바로 막을 수 있는 누락으로, 상세 화면에서는 진행 중 프로젝트의 후기 버튼이 숨겨져도 `/archive/review/[fundingId]` 직접 진입 시 mock 참여 기록 때문에 후기 작성 화면이 열릴 수 있는 우회가 있었다. `FundingReviewWriteScreen`에 성사된 펀딩 상태(`isCompletedFundingStatus`이면서 `펀딩 실패` 제외) 검사를 추가해 직접 라우트 접근과 제출 시점 모두에서 막았다.
- `FundingDetailScreen`의 후기 탭도 같은 기준을 사용하도록 맞췄다. 진행 중/예정/심사 중/실패 프로젝트는 `후기 준비중입니다!`, `펀딩이 성사되면 후기를 확인할 수 있어요` 안내만 보여주고 후기 수/작성 버튼을 노출하지 않는다. 성사된 프로젝트는 기존 후기 목록, 1회 작성/수정 모달, 댓글/좋아요 흐름을 유지한다.
- 펀딩 메인/상세/후원/후기 작성 화면의 노출 badge는 이미 메인재료 기준으로 통일되어 있었고, 프로젝트 등록/수정 화면의 미니 헤더와 게시글 미리보기 양조장 카드에 남아 있던 `막걸리` 표시도 `basicInfo.mainIngredient` 기준으로 바꿨다. 생성/수정 폼 내부의 프로젝트 카테고리와 상품 분류는 데이터 기준상 `막걸리` 고정 read-only로 유지한다.
- 현재 프론트 기준으로 큰 플로우는 유지된다: 비회원은 조회만 가능하고, 일반 사용자는 후원/찜/Q&A/후기 권한이 분기되며, 양조장은 본인 프로젝트만 관리/양조일지 관리가 가능하고 첫 번째 더미 프로젝트만 mock 본인 프로젝트로 판정된다.
- 아직 프론트 단독으로 완결할 수 없는 과제는 후원 내역과 마이페이지 연결, 사용자별 실제 구매/배송완료 기반 후기 작성 권한, 신고 DB 저장, 실제 주소 API, 실제 토스페이/계좌이체 PG, 프로젝트/후기/양조일지/후원 기록의 서버 영속화다. 사용자가 펀딩 전체 점검을 요청하면 후원하기와 마이페이지 후원 내역 연결을 반드시 다시 리마인드한다.
- 백엔드/API/AI/결제/영상 플레이어 로직은 추가하지 않았고, 온보딩/로그인/회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-06]: 펀딩 페이지 파일 정리 및 기능 보존형 리팩토링.

[진행 내용]:
- 사용자가 펀딩 페이지 파일을 보면서 기능은 없애지 말고 최적화와 파일 정리를 진행해달라고 요청했다.
- 작업 전 `judam.md`와 펀딩 관련 라우트/화면 파일을 다시 확인했다. 펀딩 목록, 상세, 후원, 후기 작성/상세, 양조장 프로젝트 생성, 양조일지 관리, `FundingContext`, 추천/후원 설정 helper의 현재 역할을 점검했다.
- `src/features/funding/components/FundingProjectCard.tsx`를 새로 추가했다. 기존 `FundingListScreen`의 펀딩 카드 UI와 `FundingDetailScreen`의 상세 하단 추천 카드 UI가 같은 디자인이어야 하므로, 카드 렌더링을 한 컴포넌트로 공통화했다.
- `FundingProjectCard`는 프로젝트 이미지, 찜 하트, 양조장명, 메인재료 badge, 상태 badge, `내 프로젝트` badge, 추천순일 때 술BTI 매칭 badge, 진행률/모금액/남은일/Progress bar를 담당한다. 찜 하트 색상과 메인재료 표시 기준은 기존 요청대로 유지한다.
- `FundingListScreen`은 카드 UI/스타일 중복을 제거하고, 페이지네이션/검색/필터/정렬/히어로/통계처럼 목록 화면 자체 로직만 남겼다. 파일 길이는 약 506줄에서 약 412줄로 줄었다.
- `FundingDetailScreen`은 `다른 프로젝트 둘러보기`에서 같은 `FundingProjectCard`를 사용하도록 바꿨고, 기존 추천 카드 전용 중복 스타일을 제거했다. 상세 화면의 소개, 양조일지, Q&A, 후기, 후원 옵션, 공유/신고, 뒤로가기 흐름은 변경하지 않았다.
- `src/features/funding/permissions.ts`를 새로 추가하고, 후기 접근/작성 가능 여부를 `canAccessFundingReviews(project)` 한 곳에서 판단하게 했다. `FundingDetailScreen`과 `FundingReviewWriteScreen`이 같은 기준을 사용하므로, 추후 API 상태값이 들어와도 후기 권한 기준을 한 파일에서 조정할 수 있다.
- `src/features/funding/recommendation.ts`에 `matchesFundingSearch`를 추가해 펀딩 검색 대상(제목, 양조장명, 카테고리, 지역, 메인재료, 서브재료, 검색태그)을 화면 파일 밖으로 옮겼다. 검색 동작 자체는 기존과 동일하다.
- 이번 작업은 파일 정리/중복 제거 중심이며, 백엔드/API/AI/결제/영상 플레이어 로직은 추가하지 않았다. 온보딩/로그인/회원가입 잠금 영역과 커뮤니티 화면은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-06]: 펀딩 프로젝트 관리 검색태그 수정 보존 버그 수정.

[진행 내용]:
- 사용자가 양조장 본인 프로젝트 관리하기에서 검색태그를 수정 제출한 뒤 다시 관리하기로 들어가면 입력했던 태그가 사라진다고 제보했다.
- 작업 전 `judam.md`와 `BreweryProjectCreateScreen`의 `tagDraft`, `basicInfo.tags`, `createProjectEditDraft`, `buildProjectPayload`, `updateProject` 흐름을 확인했다.
- 원인은 태그 입력창에 글자를 입력해둔 상태에서 Enter로 칩 확정 전 수정 제출하면 기존 payload가 `basicInfo.tags`만 저장해 입력 중인 `tagDraft`를 누락할 수 있었고, 같은 프로젝트 id 재진입/Context 갱신 때 기존 적용 guard가 id만 비교해 업데이트된 `project.tags` 재적용을 건너뛸 수 있었기 때문이다.
- `getReadyTags()`로 `basicInfo.tags`와 현재 `tagDraft`를 함께 normalize해 임시저장과 제출 payload에 사용한다.
- 태그 입력창은 `onBlur`에서도 `submitTag`를 호출해 화면 이동/제출 전 입력 중 태그를 칩으로 확정한다.
- 수정 화면 edit draft 적용 기준을 project id만이 아니라 `id:updatedAt/createdAt` key로 바꿔, 수정 제출 후 같은 프로젝트를 다시 열어도 최신 `project.tags`가 폼에 복원된다.
- 임시저장 불러오기와 edit draft 적용 시 `tagDraft`를 초기화해 이전 입력값이 섞이지 않게 했다.
- 기능 삭제나 백엔드/API 추가 없이 프론트 상태 보존 로직만 수정했다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint` 모두 통과했다.

[2026-05-06]: 술BTI 검사/결과 화면 Expo 앱 이식 및 마이페이지 연결.

[진행 내용]:
- 사용자가 Figma Make로 만든 `bti/` 폴더를 참고해 술BTI 화면을 만들어달라고 요청했다. 참고 대상은 `bti/src/app/pages/BTITestPage.tsx`, `BTIResultPage.tsx`, `routes.tsx`, `package.json`이었다.
- 작업 전 `judam.md`, `bti` 참고 파일, 현재 `MyPageScreen`, Expo Router 라우트 re-export 구조, `AuthContext.user.sulbti`, 펀딩 추천 helper의 술BTI 코드 체계를 확인했다.
- `bti/`는 웹 Figma Make 코드라 `motion/react`, `react-router`, Tailwind, `lucide-react`를 앱에 추가하지 않았다. 현재 Expo 앱 의존성인 React Native, Expo Router, `lucide-react-native`, `expo-linear-gradient`만 사용했다.
- `src/features/bti/data.ts`를 추가해 질문 25개, 결과 타입 16개, 타입별 설명/특징/추천 막걸리/맛 프로필, `calculateSulbti`, `getBtiResult`, `normalizeBtiType` helper를 분리했다. 결과 타입은 펀딩 추천에서 이미 쓰는 `HCSA`, `HCSP`, `HTSA`, `HTSP`, `LCSA`, `LCSP`, `LTSA`, `LTSP`, `HSSA`, `HSSP`, `LSSA`, `LSSP`, `HCAP`, `HTAP`, `LCAP`, `LTAP` 체계와 맞췄다.
- `src/features/bti/screens/BTITestScreen.tsx`를 추가했다. 25개 질문을 5개씩 5페이지로 보여주고, 진행률, 페이지별 완료 여부, 단일/복수 선택, 직접 입력, 비회원 로그인 안내, 결과 계산 후 `AuthContext.updateUser({ sulbti })` 저장 흐름을 구현했다.
- `src/features/bti/screens/BTIResultScreen.tsx`를 추가했다. `/bti-result/[type]`의 type 파라미터를 받아 결과 카드, 설명, 주요 특징, 추천 막걸리, 맛 프로필 막대, 공유하기, 다시하기, 홈으로 이동을 제공한다. 비회원이 직접 접근하면 로그인 안내를 보여준다.
- `app/bti-test.tsx`, `app/bti-result/[type].tsx` 라우트 re-export를 추가했다. Expo export에서 `/bti-test`, `/bti-result/[type]` static route가 정상 생성되는 것을 확인했다.
- `src/features/mypage/screens/MyPageScreen.tsx`의 로그인 사용자 술BTI 카드를 연결했다. `나의 술BTI 확인하기`는 결과가 있으면 결과 화면으로, 결과가 없으면 검사 화면으로 이동한다. `술BTI 검사하러 가기/다시 검사하기`는 항상 검사 화면으로 이동한다. 비회원 마이페이지 잠금 안내는 변경하지 않았다.
- 백엔드/API/AI 서버 로직과 새 npm 의존성은 추가하지 않았다. 온보딩/로그인/회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint`, `npx expo export --platform web --output-dir /tmp/judam-bti-flow-check` 모두 통과했다.

[2026-05-06]: 술BTI 검사 화면 인트로 문구 조정.

[진행 내용]:
- 사용자가 술BTI 검사 화면에서 `막걸리 취향 질문지` 아래의 `n번째 취향 묶음` 문구를 더 작게 하고 `당신의 술BTI를 알아보세요!`로 바꿔달라고 요청했다.
- `src/features/bti/screens/BTITestScreen.tsx`에서 페이지 인트로 제목을 고정 문구 `당신의 술BTI를 알아보세요!`로 변경하고, 제목 폰트 크기를 22에서 18로 줄였다.
- 질문 진행률, 페이지 이동, 답변 저장, 결과 계산, 마이페이지 연결 흐름은 변경하지 않았다.

[2026-05-06]: 술BTI 결과지 16개 신규 캐릭터 기준으로 교체 및 랜덤 결과 처리.

[진행 내용]:
- 사용자가 술BTI 결과지를 `SHFC`, `SHFU`, `SHMC`, `SHMU`, `SLFC`, `SLFU`, `SLMC`, `SLMU`, `DHFC`, `DHFU`, `DHMC`, `DHMU`, `DLFC`, `DLFU`, `DLMC`, `DLMU` 16개 조합으로 통일하고, 입력값 기반 결과 연결은 나중에 할 예정이므로 지금은 결과를 랜덤으로 나오게 해달라고 요청했다.
- `src/features/bti/data.ts`의 기존 `HCSA/LTSP` 계열 결과 데이터를 제거하고, 사용자가 제공한 한국어 캐릭터명, 상세 분석 타이틀, 주요 특징 키워드 6개, 추천 키워드 3개, 상세 분석 문장을 새 16개 결과 데이터로 반영했다.
- `calculateSulbti`는 현재 입력값을 분석하지 않고 `BTI_RESULT_TYPES` 16개 중 하나를 랜덤으로 반환한다. 질문/답변 UI는 그대로 유지했고, 나중에 입력값 기반 계산 로직만 이 함수 안에 다시 연결하면 된다.
- `BTIResultScreen`은 결과 카드 하단에 상세 분석 타이틀을 표시하고, 상세 분석 카드에는 사용자가 제공한 긴 분석 문장을 보여주도록 조정했다.
- `src/features/funding/recommendation.ts`의 술BTI 추천용 taste profile도 새 16개 코드 기준으로 갱신했다. 따라서 랜덤 결과로 저장된 `user.sulbti`가 펀딩 메인의 `추천순` 매칭 계산에서 null이 되지 않는다.
- 캐릭터 이미지는 사용자가 나중에 추가할 예정이므로 이번 작업에서는 이미지 asset이나 캐릭터 렌더링 영역을 추가하지 않았다.
- 백엔드/API/AI 서버 로직과 새 npm 의존성은 추가하지 않았다. 온보딩/로그인/회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint`, `npx expo export --platform web --output-dir /tmp/judam-bti-result-refresh-check` 모두 통과했다.

[2026-05-06]: 루트 참고용 bti 폴더 삭제 및 문서 정리.

[진행 내용]:
- 사용자가 루트의 `bti/` Figma Make 참고 폴더를 실제로 삭제할 예정이므로 앱이 깨지지 않게 관련 정리를 요청했다.
- 삭제 전 `judam.md`, `app/`, `src/`, 설정 파일에서 루트 `bti/` 직접 import 여부를 확인했다. 실제 앱은 `src/features/bti`, `app/bti-test.tsx`, `app/bti-result/[type].tsx`만 사용하고 루트 `bti/`를 import하지 않았다.
- 루트 `bti/` 폴더를 삭제했다. 술BTI 실제 기능 코드와 라우트는 유지했다.
- `judam.md`의 현재 구조 설명에서 루트 `bti/`를 참고 폴더로 설명하던 내용을 삭제/정리하고, 삭제된 항목에 `bti/` 삭제 사실을 기록했다.
- 백엔드/API/AI 서버 로직과 새 npm 의존성은 추가하지 않았다. 온보딩/로그인/회원가입 잠금 영역은 수정하지 않았다.
- 검증 결과 `git diff --check`, `npx tsc --noEmit`, `npm run lint`, `npx expo export --platform web --output-dir /tmp/judam-bti-folder-delete-check` 모두 통과했다.

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
[x] 술BTI 테스트 질문 폼 UI 구현 - `bti` Figma Make 질문지 기준 25문항/5페이지/직접 입력/결과 저장 완료
[x] 술BTI 결과 분석 화면 기본 구현 - 사용자 제공 16개 결과지(`SHFC`~`DLMU`) 기준 캐릭터명/상세 분석/특징 키워드/추천 키워드/맛 프로필 막대/공유/다시하기/홈 이동 완료, 현재 결과는 랜덤 반환
[ ] 술BTI 입력값 기반 결과 산출 로직 연결 - 현재 `calculateSulbti`는 임시 랜덤이며, 추후 질문 답변을 16개 코드 기준으로 매핑해야 한다
[ ] 술BTI 결과 오각형 레이더 차트 고도화 - 현재는 `bti` 결과 페이지와 맞춘 막대형 맛 프로필이며, 추후 필요 시 React Native SVG 기반 오각형 차트로 교체 가능

[Phase 4: 코어 펀딩 시스템 (11주차 ~ 12주차)]
[x] 프로젝트 상세 UI 및 양조장용 펀딩 프로젝트 약관/생성 UI 구현 - 상세/약관/생성 완료, 양조일지 등록 후 상세 탭 이동 및 단계별 더보기/좋아요/댓글/대댓글 프론트 mock 상호작용 완료, 펀딩 후기 작성/상세 라우트와 프론트 로컬 후기 생성/목록/상세/댓글 스코프 반영 흐름 완료, 성사된 펀딩/참여자 기준 후기 작성 권한 프론트 가드 완료
[ ] (12주차 ~ 5/27): 프로젝트 후원하기 UI 및 최종 결제/참여 흐름 완료 - 1차 연결 화면 구현 완료, `FundingContext.updateProjectFunding`으로 mock 후원 금액/후원자 수 반영 완료, 정식 결제/참여 흐름 고도화 필요
[x] 펀딩 API 연결 1차 PR: 펀딩 생성 시작 흐름. 펀딩 약관 동의 저장, 펀딩 프로젝트 임시저장, 임시저장 프로젝트 수정 연결 완료.
[x] 펀딩 API 연결 2차 PR: 프로젝트 기본 정보, 목표 금액 및 일정, 법적 고시 정보 저장 연결 완료.
[x] 펀딩 API 연결 3차 PR: 맛 지표, 프로젝트 계획 정보, 창작자/정산 정보, 환불/정책 관련 저장 연결 완료.
[x] 펀딩 API 연결 4차 PR: 필수 서류 업로드와 검증. 기존 파일명 state를 파일 URI/mimeType 보존 구조로 확장하고 최종 제출 시 multipart 업로드 연결 완료.
[x] 펀딩 API 연결 5차 PR: 펀딩 목록/상세/프로젝트 소개/양조일지 조회. 기존 UI 모델 보존을 위해 서버 응답을 `FundingProject`에 merge하는 방식으로 연결 완료.
[x] 펀딩 API 연결 6차 PR: Q&A 목록/질문 등록/답글 등록/후기 목록 조회/후기 작성 연결 완료. 후기 수정 API는 명세가 없어 기존 로컬 수정 흐름 유지.
[x] 펀딩 API 연결 7차 PR: 후원 옵션 조회, 주문 생성, 결제 요청, 결제 정보 조회, 주문 상세 조회 연결 완료. 결제 완료 callback/webhook 명세는 아직 없어 실제 결제 완료 확정은 백엔드 보강 필요.
[x] 펀딩 추가 API 연결: 양조일지 등록/수정/삭제, 공유 링크 조회, 신고 등록, 찜 등록/해제, 마이페이지 후원 내역 조회 연결 완료. 관리자 신고 목록은 화면이 없어 API client만 추가.

[Phase 5: 고도화 및 마무리 (13주차 ~ 14주차)]
[ ] (13주차): 추가 프론트엔드 기능(커뮤니티 등) 완성 및 전체 에러 핸들링 - 커뮤니티 작성 1차 연결 완료, Expo 타입/린트 에러 및 경고 0개 상태 확보, `finish/` 폴더 삭제 및 `second/` 최신 참고 기준 전환 완료, `app/` 라우트 엔트리와 `src/features` 중심 구조 정리 완료, 공용 mock/seed 데이터와 양조일지 로컬 상태 기준 정리 완료
[ ] (14주차 ~ 6/10): APK, AAB 파일 생성 및 최종 프로젝트 완료 (최종 보고)

위의 모든 내용은 읽고 리마인드한 후에, 마음대로 개발할까요? 하지말고 입력을 기다리기. 하지만 해당 자료를 보고 완벽한 리마인드는 해야 함. 매 순간 Judam.md를 리마인드하고 업데이트 할것.

[2026-05-06]: 주담/커뮤니티 상세 댓글 액션과 답글 UI를 펀딩 Q&A 패턴으로 정렬.

[진행 내용]:
- 사용자가 하단바 기준 [주담] 레시피 상세 댓글과 [커뮤니티] 게시글 상세 댓글의 `좋아요`, `답글`, `대댓글` UI/작성 흐름을 펀딩 상세 Q&A 영역과 같은 형태로 맞춰달라고 요청했다.
- 작업 전 `judam.md`를 읽고 현재 구조를 확인했다. 실제 구현 대상은 `src/features/recipe/screens/RecipeDetailScreen.tsx`, `src/features/community/screens/CommunityDetailScreen.tsx`이며, 참조 UI는 `src/features/funding/screens/FundingDetailScreen.tsx`의 Q&A 댓글/답글 액션 행이다.
- `RecipeDetailScreen` 댓글 하단 액션을 기존 텍스트형 `좋아요/답글`에서 펀딩 Q&A처럼 `ThumbsUp` 아이콘+숫자, `MessageCircle` 아이콘+답글, 답글이 있을 때 `ChevronUp/ChevronDown` 아이콘+`n개 답글` 형태로 변경했다.
- `RecipeDetailScreen`에 댓글별 답글 입력 상태(`replyingTo`, `replyInput`), 답글 펼침 상태(`expandedComments`), 답글 생성/좋아요/펼침 토글 로컬 로직을 추가했다. 새 답글은 현재 로그인 사용자 이름과 타입을 사용하며, mock 로컬 상태 안에서만 동작한다.
- `CommunityDetailScreen`에도 동일한 답글 타입/상태/핸들러를 추가하고, 댓글 액션 UI를 펀딩 Q&A와 같은 아이콘형 액션 행으로 변경했다. 답글 입력창은 해당 댓글 아래에 인라인으로 열리고, 답글 좋아요는 답글 카드 내부에서 처리한다.
- 기존 게시글/레시피 좋아요, 댓글 작성, 댓글 수정/삭제, 작성자 메뉴 권한 흐름은 유지했다. 백엔드 API, 실제 서버 저장, Context 영속화 로직은 추가하지 않았고 현재 프론트 mock/local state 범위에서만 동작한다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check` 모두 통과했다. PowerShell 실행 정책 때문에 `npx tsc --noEmit`은 직접 실행이 막혀 Windows용 `npx.cmd`로 검증했다.
[2026-05-06]: 레시피/주담 API 명세 보조 문서 `api.md` 신규 작성.

[진행 내용]:
- 사용자가 제공한 `C:\Users\USER\Desktop\api 명세서` 폴더의 레시피 관련 PDF 15개를 확인했다.
- 루트 위치에 `api.md`를 새로 만들고, 레시피 목록/상세/작성, 양조장 레시피 등록/소비자 레시피 확인, 레시피 관심 등록/해제, 댓글 목록/작성/수정/삭제, 댓글 좋아요 등록/취소, 마이페이지 내 레시피/관심 레시피 목록 API를 프론트 연결용으로 정리했다.
- `api.md`에는 API 작업 전 반드시 `judam.md`와 함께 확인해야 한다는 규칙, 서버 주소 미확정 상태에서는 실제 호출 코드를 만들지 않는다는 원칙, 로그인 API 연결 후 `Authorization: Bearer {access_token}` 헤더를 붙여야 한다는 메모를 적었다.
- 하단바 `[주담]` API 연결 전 백엔드에 추가 확인할 부족 필드도 `api.md`에 정리했다. 주요 항목은 작성자 닉네임/프로필 이미지, 댓글 수, 현재 사용자 관심 여부, 댓글 작성자 유형/프로필 이미지, 대댓글 API 존재 여부, 이미지 업로드 API, `USER`/`CONSUMER` author_type 값 통일, 내 추천순 정렬용 API다.
- 앱 코드와 서버/API 호출 로직은 수정하지 않았고, 문서 파일만 추가/갱신했다.
[2026-05-06]: 하단바 `[주담]` 진입 범위 레시피 API 1차 연결.

[진행 내용]:
- 사용자가 현재 서버 주소 `http://43.202.24.223:3000`를 공유했고, 서버는 사용할수록 과금되는 구조이므로 불필요한 실제 호출 검증을 피하라고 안내했다.
- 작업 전 `judam.md`와 `api.md`를 확인했고, API 연결 범위를 하단바 `[주담]`에서 직접 진입하는 레시피 목록, 상세, 작성, 상세 댓글/관심 액션으로 제한했다. 마이페이지 내 레시피/관심 레시피 목록 API와 양조장 전용 레시피 확인/등록 API는 연결하지 않았다.
- `src/features/recipe/api.ts`를 추가해 `JUDAM_API_BASE_URL = http://43.202.24.223:3000`, 공통 `fetch` wrapper, 토큰 조회, 레시피 목록/상세/작성, 관심 등록/해제, 댓글 목록/작성/수정/삭제, 댓글 좋아요 등록/취소 API 함수를 정리했다. `axios`나 새 의존성은 추가하지 않았다.
- `RecipeListScreen`은 `GET /api/recipes`를 `인기순 -> sort=popular`, `최신순 -> sort=newest`, `status=ALL`, `page=0`, `size=20`으로 호출한다. `내 추천순`은 아직 API가 없으므로 기존 로컬 정렬/mock 기준을 유지하고, 검색은 서버 API에 연결하지 않고 현재 받은 목록 안에서만 로컬 필터로 유지한다.
- `RecipeDetailScreen`은 `GET /api/recipes/{recipeId}`와 `GET /api/recipes/{recipeId}/comments`를 연결했다. 관심 등록/해제, 댓글 작성/수정/삭제, 댓글 좋아요 등록/취소도 함수 호출로 연결했지만, 현재 mock 로그인에는 실제 `access_token`이 없으므로 토큰이 없으면 인증 필수 API 호출을 막고 로그인 API 연결 후 동작하도록 했다.
- `RecipeCreateScreen`은 `[주담]`의 레시피 제안 버튼으로 진입하는 작성 화면이므로 `POST /api/recipes`를 연결했다. 이미지 업로드 API가 아직 없기 때문에 원격 URL일 때만 `image_url`로 보내고 로컬 이미지 URI는 서버로 보내지 않는다.
- `src/constants/data.ts`의 `Recipe` 타입에 API 매핑용 선택 필드(`status`, `isFundable`, `authorType`, `createdAt`, `subIngredients`, `flavorTags`, `alcoholRange` 등)를 추가했다.
- `api.md`에는 서버 주소, 과금 주의, 이번에 연결한 API와 연결하지 않은 API를 추가로 기록했다.
- 서버 과금 방지를 위해 실제 API 호출 테스트는 하지 않았고, 검증은 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check`로 진행했다. 세 명령 모두 통과했다.

[남은 확인/부족 API]:
- 로그인/회원가입 API가 연결되어 실제 `access_token` 저장 위치가 정해져야 관심 등록/해제, 댓글 작성/수정/삭제, 댓글 좋아요, 레시피 작성 API가 실제로 동작한다.
- 목록/상세 응답에 작성자 닉네임/프로필 이미지, 댓글 수, 현재 사용자 관심 여부가 부족하다. 현재는 fallback 표시와 `interest_count` 중심으로 매핑한다.
- 댓글 응답에는 작성자 유형/프로필 이미지, 본인 댓글 여부, 대댓글 API가 부족하다. 대댓글 UI는 기존 로컬 상태만 유지한다.
- 레시피 작성 화면의 이미지 업로드 API가 별도로 필요하다.
- `내 추천순` 서버 정렬/추천 점수 API와 검색 keyword API는 아직 없다.

[2026-05-07]: [주담] API 연결 후 한글 이스케이프 표시와 상세 화면 잔상 렌더링 수정.

[진행 내용]:
- 사용자가 `[주담]` 목록 화면에서 기존 한글 문구가 `\uC8FC...` 같은 문자로 그대로 보이고, 상세 진입 시 잠깐 다른 게시글 내용이 보였다가 API 응답으로 바뀌는 듯한 현상을 제보했다.
- 작업 전 `judam.md`와 `api.md`를 확인했고, 백엔드나 API 연결 범위는 바꾸지 않고 프론트 렌더링 문제만 수정했다.
- `src/features/recipe/screens/RecipeListScreen.tsx`의 JSX 속성/텍스트에 들어간 유니코드 이스케이프 문자열을 실제 한글 문자열로 바꿨다. JSX 텍스트/속성 안의 `\u....`는 JS 문자열처럼 해석되지 않아 화면에 그대로 표시될 수 있다.
- `src/features/recipe/api.ts`의 작성자 fallback 라벨을 `사용자`, `양조장`으로 정리했다.
- `src/features/recipe/screens/RecipeDetailScreen.tsx`는 API 상세 응답이 오기 전 mock/이전 fallback 게시글을 먼저 보여주지 않고 `레시피를 불러오고 있어요.` 로딩 상태를 보여주도록 바꿨다. 이로써 서버 레시피 ID와 mock 데이터 ID가 어긋날 때 다른 게시글이 잠깐 보이는 잔상을 막는다.
- 상세 댓글은 API 댓글 로딩 실패 시 깨진 mock 댓글을 보여주지 않고 빈 댓글 목록으로 둔다. 대댓글 UI는 기존처럼 프론트 로컬 상태이며, 대댓글 API는 아직 없다.
- 이번 작업은 새 API 호출을 추가하지 않았고 백엔드 코드는 건드리지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check` 모두 통과했다.

[2026-05-07]: 로그인/회원가입 API 연결 전 [주담] 인증 필요 API 테스트용 임시 토큰 저장 구조 추가.

[진행 내용]:
- 사용자가 새로 만든 카카오 테스트 계정의 `accessToken`을 제공했고, 현재 mock 로그인만으로는 `POST /api/recipes`, 관심 등록/해제, 댓글 작성/수정/삭제, 댓글 좋아요 같은 인증 필요 API를 검증할 수 없다고 요청했다.
- `src/contexts/AuthContext.tsx`에 임시 상수 `TEMP_JUDAM_ACCESS_TOKEN`과 `saveTemporaryAccessToken`, `removeTemporaryAccessToken`을 추가했다.
- 현재 mock 로그인 또는 mock 회원가입이 성공하면 `SafeStorage`에 `judam_access_token`으로 임시 토큰을 저장한다. 기존 `[주담]` API client는 `judam_access_token`을 먼저 찾으므로 이후 작성/관심/댓글 API에 `Authorization: Bearer {token}` 헤더가 붙는다.
- 앱 시작 시 `judam_user`가 이미 저장되어 있는데 `judam_access_token`이 없으면 임시 토큰을 다시 저장한다. 로그아웃하면 `judam_user`와 함께 임시 토큰도 제거한다.
- 이 구조는 실제 로그인/회원가입 API 연결 전 테스트 전용이다. 나중에 로그인/회원가입 API가 연결되면 `TEMP_JUDAM_ACCESS_TOKEN`, 임시 저장/삭제 함수, mock 로그인/회원가입의 임시 토큰 저장 로직을 제거하고 서버 응답의 실제 토큰 저장 구조로 교체해야 한다.
- 백엔드 코드는 건드리지 않았고, 새 API 엔드포인트도 추가 연결하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-07]: [주담] API 500 응답의 uncaught promise 표시 방지.

[진행 내용]:
- 사용자가 `[Error: Uncaught (in promise...) Error: 서버 내부 오류]` 로그를 공유했다. 이는 서버가 500을 반환했고, 일부 상세 화면 댓글 관련 async handler에서 해당 예외를 화면 단에서 잡지 못해 앱 로그에 uncaught promise로 올라온 상태다.
- 백엔드 500의 근본 원인은 여전히 서버 로그 확인이 필요하다. 현재 의심 지점은 레시피 작성/댓글 요청 body 검증, null 허용 여부, JWT의 `userId=4` 사용자 매핑, DB 제약조건이다.
- `src/features/recipe/screens/RecipeDetailScreen.tsx`의 댓글 작성/수정/삭제 API 호출을 `try/catch`로 감싸고, 실패 시 `Alert.alert`로 사용자에게 실패 안내를 보여주도록 수정했다.
- 이 수정은 프론트 예외 처리 보강이며, 백엔드 코드나 API 엔드포인트 연결 범위는 바꾸지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-07]: [주담] 레시피 작성 테스트용 임시 토큰을 백엔드 검증 토큰으로 교체.

[진행 내용]:
- 사용자가 백엔드 팀원에게 받은 `POST /api/recipes` 테스트 body와 인증 토큰을 제공했고, 서버 과금 부담을 고려해 한 번만 직접 호출해 원인을 분리했다.
- 직접 호출 결과 `POST http://43.202.24.223:3000/api/recipes`가 `201`을 반환했고, `recipe_id: 14`가 생성되었다. 이 요청에는 `image_url`이 없었지만 성공했으므로, 이전 500의 직접 원인은 `image_url: null`이 아니라 기존 임시 JWT payload와 백엔드 사용자 매핑 불일치일 가능성이 높다고 판단했다.
- `src/contexts/AuthContext.tsx`의 `TEMP_JUDAM_ACCESS_TOKEN`을 방금 성공한 테스트 토큰으로 교체했다. 새 토큰은 payload에 `id: "2"`, `email: "test-consumer@judam.com"`, `role: "USER"`를 가진다.
- 이미 앱에 예전 임시 토큰이 저장되어 있을 수 있으므로, 앱 시작 시 `judam_user`가 있고 저장된 `judam_access_token`이 현재 임시 토큰과 다르면 새 토큰으로 덮어쓰도록 수정했다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`의 레시피 작성 실패/로그인 안내 문구 중 유니코드 escape로 남아 있던 부분을 실제 한글 문구로 정리했다.
- 이 구조는 로그인/회원가입 API 연결 전 테스트 전용이다. 실제 인증 API가 연결되면 하드코딩 토큰과 임시 저장 로직을 제거하고, 로그인 응답의 실제 `accessToken` 저장 구조로 교체해야 한다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-07]: [주담] 목록 로딩 중 mock 목록 노출 방지 및 관심 UI 활성 상태 보강.

[진행 내용]:
- 사용자가 하단바 기준 `[주담]` 목록에서 API 로딩 중 기존 프론트 mock 레시피 목록이 잠깐 보이는 문제와, 레시피 관심을 눌러도 카운트만 바뀌고 하트 UI가 활성 상태로 보이지 않는 문제를 제보했다.
- 이번 작업은 `[주담]` 목록 화면과 공용 레시피 카드의 표시 상태만 수정했고, 새 서버 API 호출을 추가하지 않았다. 서버 과금 방지를 위해 실제 API 재호출 테스트도 하지 않았다.
- `src/features/recipe/screens/RecipeListScreen.tsx`의 초기 목록 상태를 mock `recipesData`가 아니라 빈 배열로 바꾸고, `GET /api/recipes` 호출 전에는 목록을 비워 `레시피 목록을 불러오고 있어요.` 로딩 상태만 보이게 했다. API 실패 시에도 mock 목록으로 되돌리지 않고 재시도 안내만 보여준다.
- `내 추천순`은 아직 서버 추천 API가 없으므로 mock 목록을 대신 보여주지 않고 `내 추천순 API가 아직 준비되지 않았어요.` 안내를 보여주도록 정리했다.
- 목록에서 사용자가 관심을 누른 레시피 ID를 화면 생명주기 동안 `likedRecipeIdsRef`로 기억하고, 관심 등록/해제 요청 전후에 `liked`와 `likes`를 낙관적으로 반영한다. 실패하면 이전 상태로 되돌린다.
- `src/components/recipe-card.tsx`의 관심 하트 활성 색을 검정에서 빨간색(`#EF4444`) 채움으로 바꿔 활성 상태가 확실히 보이게 했다.
- 단, 백엔드 목록/상세 응답에 `is_interested`가 아직 없으므로 앱을 새로 켠 직후 서버에 이미 관심 등록된 레시피를 자동으로 활성 표시하는 것은 프론트만으로는 불가능하다. 이 부분은 백엔드 응답 필드 추가가 필요하다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-07]: 로그인/회원가입 API 연결 전 사용자/양조장 권한별 임시 토큰 분기 추가.

[진행 내용]:
- 사용자가 양조장 권한 JWT를 제공했고, 실제 로그인/회원가입 API 연결 전에도 특정 테스트 계정으로 로그인하면 사용자 또는 양조장 권한을 나눠 테스트하고 싶다고 요청했다.
- `src/contexts/AuthContext.tsx`에서 기존 단일 임시 토큰을 `TEMP_USER_ACCESS_TOKEN`, `TEMP_BREWERY_ACCESS_TOKEN`으로 분리했다. 사용자 토큰은 기존에 `POST /api/recipes` 성공이 확인된 `id: "2"` 토큰을 유지하고, 양조장 토큰은 사용자가 제공한 `role: "BREWERY"` 토큰을 저장한다.
- 임시 로그인 계정 분기를 추가했다. `user@judam.test / judam123`으로 로그인하면 일반 사용자 권한과 사용자 토큰을 저장하고, `brewery@judam.test / judam123`으로 로그인하면 양조장 권한과 양조장 토큰을 저장한다.
- 기존 로그인 화면 UI는 수정하지 않았다. 기존처럼 이메일에 `brewery` 또는 `양조`가 포함되면 양조장 타입으로 넘기는 흐름도 유지되며, 위 테스트 계정은 더 명시적인 임시 분기 기준이다.
- 앱 시작 시 저장된 `judam_user.type`에 맞는 임시 토큰이 저장되어 있는지 확인하고, 다르면 해당 권한 토큰으로 덮어쓴다. 회원가입 mock도 선택한 사용자 유형에 맞는 임시 토큰을 저장한다.
- 이 구조는 실제 로그인/회원가입 API 연결 전 테스트 전용이다. 실제 인증 API가 연결되면 `TEMP_USER_ACCESS_TOKEN`, `TEMP_BREWERY_ACCESS_TOKEN`, `getTemporaryAccessToken`, `getTemporaryLoginType`, mock 로그인/회원가입의 임시 토큰 저장 로직을 모두 제거하고 서버 응답의 실제 `accessToken`과 `user.role` 기준으로 교체해야 한다.
- 백엔드 코드는 건드리지 않았고 실제 서버 호출도 하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-07]: 양조장 로그인 첫 화면과 [주담] 상세 펀딩 제안 라우팅 분기 수정.

[진행 내용]:
- 사용자가 UI 요소 변경 없이 로그인 후 화면 분기와 `[주담]` 레시피 상세의 버튼 이동 흐름만 수정하길 요청했다.
- `src/features/auth/screens/LoginScreen.tsx`에서 양조장 계정 로그인 성공 후 `/brewery/dashboard`로 바로 이동하던 분기를 제거하고, 일반 사용자와 동일하게 `/(tabs)` 홈 화면으로 이동하도록 변경했다. 로그인 화면 UI, 입력값, 버튼, 문구는 수정하지 않았다.
- `src/features/recipe/screens/RecipeDetailScreen.tsx`에서 양조장이 `이 레시피로 펀딩 제안하기` 버튼을 눌렀을 때 `/brewery/project/create`로 바로 이동하던 흐름을 `/brewery/project/terms` 펀딩 프로젝트 약관 페이지로 이동하도록 변경했다.
- 백엔드 API 연결이나 실제 서버 호출은 추가하지 않았고, 프론트 라우팅 분기만 수정했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-10]: 펀딩 API 연결 범위와 PR 단계 계획 문서화.

[진행 내용]:
- 사용자가 앞으로 API 연결은 `[펀딩]` 페이지만 진행하며, UI는 사용자가 별도로 요청하기 전까지 건드리지 말고 API만 연결하라고 명확히 지시했다. 이 규칙은 이후 펀딩 API 작업의 최우선 기준이다.
- `api.md`에 펀딩 API PR 계획을 추가했다. 1차 PR은 펀딩 생성 시작 흐름으로 약관 동의 저장, 펀딩 프로젝트 임시저장, 임시저장 프로젝트 수정을 포함하고 여기까지 연결 후 PR을 끊는다.
- 2차 PR은 프로젝트 기본 정보/목표 금액 및 일정/법적 고시 정보 저장, 3차 PR은 맛 지표/프로젝트 계획/창작자·정산/환불·정책, 4차 PR은 필수 서류 업로드, 5차 PR은 목록·상세·소개·양조일지 조회, 6차 PR은 Q&A·질문·답글·후기 조회, 7차 PR은 후원 옵션·주문 생성·결제 요청·주문 상세 조회로 기록했다.
- `judam.md`의 API 현재 상태와 백엔드/AI 금지선에 펀딩 API 연결 범위를 추가했다. 펀딩 API 작업 중에는 디자인, 배치, 문구, 라우팅 플로우, 기존 mock 기반 UX를 임의로 수정하지 않고 API client, mapper, 상태 연동, 로딩/에러 처리만 수정한다.
- 실제 코드, UI, 라우트, 서버 호출, 백엔드 로직은 변경하지 않았다. 문서 기준만 업데이트했다.

[2026-05-10]: 펀딩 1차 PR 범위 중 약관 동의 저장 API 연결.

[진행 내용]:
- 사용자가 `POST /api/fundings/agreements` 약관 동의 저장 API의 controller/routes/request/response/error 명세를 제공했고, 펀딩 페이지 API 1차 PR 범위 중 약관 동의 저장만 완료해달라고 요청했다.
- `src/features/funding/api.ts`를 추가했다. `JUDAM_FUNDING_API_BASE_URL = http://43.202.24.223:3000`, `getFundingAccessToken`, 공통 `requestFundingJson`, `getFundingApiErrorMessage`, `saveFundingAgreement`를 정의했다. 토큰은 기존 테스트 구조와 맞춰 `judam_access_token`, `access_token`, `accessToken`, `token` 순서로 조회한다.
- `src/features/brewery/project/screens/BreweryProjectTermsScreen.tsx`의 기존 UI와 7개 전체 약관 동의 조건은 유지했다. `다음`을 누르면 화면에서 이미 요구하던 전체 약관 동의 상태를 확인한 뒤 서버 명세가 요구하는 5개 필드 `isAdultConfirmed`, `isContactInfoAgreed`, `isSettlementInfoAgreed`, `isFeePolicyAgreed`, `isResponsibilityAgreed`와 `breweryId`를 `POST /api/fundings/agreements`로 보낸다.
- 현재 mock 양조장 로그인은 `user.id === "1"`이라 `breweryId: 1`로 전송된다. mock 회원가입/인증처럼 로컬 id가 숫자가 아닌 경우는 실제 인증/양조장 API가 연결되기 전까지 임시로 `1` fallback을 사용한다. 실제 Auth/Brewery API가 들어오면 서버의 숫자형 brewery id를 사용하도록 교체해야 한다.
- API 저장 성공 시 기존처럼 `/brewery/project/create`로 이동한다. 실패 시 서버 message 또는 토큰 필요 안내를 `Alert`로 보여주고 다음 단계로 이동하지 않는다.
- `api.md`에 펀딩 약관 동의 저장 endpoint, request/response/error, 프론트 연결 파일, 서버 과금 때문에 직접 호출 검증을 하지 않았다는 메모를 추가했다.
- UI 디자인, 문구, 약관 목록, 라우트 구조, 백엔드 내부 로직, 임시저장/수정 API는 건드리지 않았다.

[2026-05-10]: 펀딩 1차 PR 범위 중 프로젝트 임시저장 API 연결.

[진행 내용]:
- 사용자가 `POST /api/fundings/drafts` 펀딩 프로젝트 임시저장 API 명세를 제공했고, 양조장이 프로젝트 등록 중 누르는 `임시저장`에 API를 연결해달라고 요청했다.
- `src/features/funding/api.ts`에 `createFundingDraft`를 추가했다. 요청 필드는 `breweryId`, `title`, `shortTitle`, `category`, `mainIngredient`, `subIngredient`, `alcoholPercentage`, `summary`이며 인증 토큰은 기존 펀딩 API helper와 같은 방식으로 붙인다.
- `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`의 기존 임시저장 UI와 모달 플로우는 유지했다. 신규 프로젝트 등록 모드에서 `임시저장`을 누르면 먼저 `POST /api/fundings/drafts`를 호출하고, 성공 후 기존 로컬 임시저장 payload에 서버 응답 `serverDraft`를 함께 저장한다.
- API로 보내는 카테고리는 화면의 `막걸리` 고정 정책을 서버 enum에 맞춰 `MAKGEOLLI`로 전송한다. 도수는 `basicInfo.alcoholContent`를 숫자로 변환해 `alcoholPercentage`로 보낸다.
- 기존 프로젝트 관리/수정 모드의 임시저장은 아직 create draft endpoint를 호출하지 않고 기존 로컬 임시저장만 유지한다. 서버 draft 수정 API가 전달되면 그때 별도 연결한다.
- 서버 과금 방지를 위해 실제 API 호출 검증은 하지 않았다. UI 디자인, 문구, 라우팅, 제출 로직, 백엔드 내부 로직은 변경하지 않았다.

[2026-05-10]: 펀딩 생성 저장 API 1차 잔여/2차/3차 연결.

[진행 내용]:
- 사용자가 임시저장 프로젝트 수정, 기본정보 저장, 목표 금액 및 일정 저장, 법적 고시 정보 저장, 맛지표 저장, 프로젝트 계획 정보 저장, 창작자/정산/사업자 정보 저장, 환불/교환/성인인증/리스크 안내 저장 API 명세를 함께 제공했다.
- `src/features/funding/api.ts`에 `updateFundingDraft`, `saveFundingBasicInfo`, `saveFundingSchedule`, `saveFundingLegalInfo`, `saveFundingTasteProfile`, `saveFundingPlan`, `saveFundingBreweryInfo`, `saveFundingNotices`를 추가했다.
- `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`에서 기존 UI를 추가/변경하지 않고 API를 연결했다. 기존 로컬 임시저장을 덮어쓸 때 `serverDraft.draftId`가 있으면 `PATCH /api/fundings/drafts/{draftId}`로 수정하고, 없으면 `POST /api/fundings/drafts`로 생성한다.
- 신규 프로젝트 최종 제출 시 `draftId`를 확보한 뒤 basic-info, schedule, legal-info, taste-profile, plan, brewery-info, notices API를 순서대로 호출하고, 모두 성공하면 기존 프론트 로컬 게시글 생성 흐름을 실행한다.
- 화면의 맛 지표는 0~100 UI 값이므로 API의 1~5 범위에 맞게 변환해 전송한다. 카테고리/상품 유형은 기존 막걸리 고정 정책에 맞춰 API에는 `MAKGEOLLI`로 전송한다.
- 프로젝트 계획의 예산/일정 텍스트가 비어 있으면 현재 화면에서 별도 필수 입력이 아니므로 API 검증을 통과할 수 있게 목표금액/시작일 기반 최소 항목을 구성해 보낸다. 추후 백엔드가 실제 저장을 시작하면 화면 필수값 정책과 API 필수값 정책을 다시 맞춰야 한다.
- 수정 모드(`mode=edit`)는 기존 게시글 관리 흐름이므로 draft 생성/섹션 저장 API를 호출하지 않는다. 별도 프로젝트 수정 API가 오면 그때 연결한다.
- 파일 업로드, 목록/상세/소개/양조일지 조회, Q&A/후기, 후원/주문 API는 명세는 받았지만 현재 화면 상태와 API 응답 매핑이 불확실한 부분이 있어 임의 연결하지 않았다. 특히 파일 업로드는 현재 화면 state가 파일명만 저장하므로 실제 `multipart/form-data` 전송을 위해 URI/mimeType 보존 구조와 documentType 매핑 확인이 필요하다.
- 서버 과금 방지를 위해 실제 API 호출 검증은 하지 않았다. UI 디자인, 문구, 라우팅 구조, 백엔드 내부 로직은 변경하지 않았다.

[2026-05-10]: 펀딩 seed 목록 2개 유지 및 후원 주문/결제 API 연결.

[진행 내용]:
- 사용자가 펀딩 페이지 조회/Q&A/후원/주문 대상 mock 프로젝트 중 `꽃향기 가득한 생막걸리 프로젝트`도 필요 없다고 정정했다. 현재 코드의 기존 seed title에는 `신사`가 없고 `산사 막걸리 프로젝트`가 있어, 런타임 seed 목록은 `봄을 담은 벚꽃 막걸리 프로젝트`와 `산사 막걸리 프로젝트` 2개만 유지한다.
- `src/constants/data.ts`에서 `fundingProjects` export는 seed 데이터 중 위 2개 프로젝트만 filter해서 반환하도록 했다. 새로 프로젝트를 등록하면 기존 `FundingContext.addProject` 흐름으로 이 목록 앞에 추가되어 기존 카드/상세 UI 형식을 유지한다.
- `src/features/funding/api.ts`에 `createFundingOrder`, `requestFundingPayment`를 추가했다. 각각 `POST /api/fundings/{fundingId}/orders`, `POST /api/orders/{orderId}/payment`를 호출한다.
- `src/features/funding/screens/FundingSupportScreen.tsx`에서 후원 최종 확인 시 주문 생성 API를 먼저 호출하고, 응답의 `orderId`와 `totalAmount`로 결제 요청 API를 호출한다. 결제 요청 응답에 `paymentUrl`이 있으면 `Linking.openURL(paymentUrl)`로 실제 URL을 연 뒤 기존 후원 성공 모달과 로컬 참여/후원 금액 반영 흐름을 유지한다.
- 결제 완료 callback/webhook 명세가 없으므로 현재는 paymentUrl open 이후 기존 프론트 성공 처리로 이어진다. 실제 결제 완료 검증이 필요하면 결제 성공 callback route나 주문 상태 재조회 기준이 추가되어야 한다.
- 파일 업로드 API는 사용자가 나중에 수정한다고 했으므로 이번 작업에서 연결하지 않았다. 조회/Q&A/후기 API는 서버 mock 응답이 현재 상세 UI에 필요한 풍부한 필드보다 적어 기존 UI 정보 손실 위험이 있으므로 이번 작업에서 화면 대체 연결은 하지 않았다.

[2026-05-10]: 펀딩 API 연결 중 남은 병합 충돌 마커 정리.

[진행 내용]:
- 사용자가 구현된 UI가 사라지지 않도록 모든 화면 구조를 보존하면서 병합 충돌 마커만 해결해달라고 요청했다.
- `src/features/funding/screens/FundingSupportScreen.tsx`는 기존 후원하기 UI와 로컬 성공 모달/참여 반영 흐름을 유지하고, 주문 생성/결제 요청 API 연결에 필요한 `Linking`, `createFundingOrder`, `requestFundingPayment`, `getFundingApiErrorMessage` 로직을 보존하는 방식으로 충돌을 해결했다.
- `src/features/brewery/project/screens/BreweryProjectTermsScreen.tsx`는 약관 UI, 7개 전체 약관 동의 조건, 버튼 배치를 유지하고, 약관 저장 API 호출과 제출 중복 방지 상태만 보존하는 방식으로 충돌을 해결했다.
- `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`는 프로젝트 등록 폼 UI/탭/모달/로컬 저장 구조를 유지하고, draft 생성/수정 및 섹션별 저장 API helper, 임시저장/최종제출 API 호출 로직만 보존하는 방식으로 충돌을 해결했다.
- `src/constants/data.ts`는 당시 기존 seed 데이터 배열을 보존한 뒤, 런타임 export에서 `봄을 담은 벚꽃 막걸리 프로젝트`, `산사 막걸리 프로젝트` 2개만 필터링하는 펀딩 seed 정책을 유지했다. 이후 2026-05-10 추가 작업에서 `꽃향기 가득한 생막걸리 프로젝트`가 다시 포함되어 현재 seed는 3개다.
- 전체 충돌 마커 검색 기준 남은 충돌 마커가 없음을 확인했다.
- 검증 결과 `npx tsc --noEmit`, `npm run lint`, `git diff --check` 모두 통과했다. 서버 과금 방지를 위해 실제 API 호출 검증은 하지 않았다.

[2026-05-10]: 펀딩 5차/6차/7차 API UI 보존형 연결.

[진행 내용]:
- 사용자가 제공한 펀딩 API 명세 전체를 기준으로 4차 필수 서류 업로드는 사용자가 파일 상태 구조를 나중에 수정한 뒤 연결하기로 하고, 이번 작업에서는 5차 조회, 6차 Q&A/후기 조회, 7차 후원/결제 잔여 API를 연결했다.
- `src/features/funding/api.ts`에 펀딩 목록/상세/소개/양조일지, Q&A 목록/질문 등록/답글 등록, 후기 목록, 후원 옵션, 주문 상세, 양조장 1:1 문의 등록 API client 타입과 함수를 추가했다.
- `src/features/funding/apiMappers.ts`를 추가해 서버 응답을 기존 `FundingProject`, `JournalEntry`, `FundingReview` 구조로 변환한다. 서버 mock 응답이 벚꽃 프로젝트 기준으로 고정되어 있어, 상세/소개/후원 옵션의 주요 값은 현재 프로젝트명과 매칭될 때만 merge해 꽃향기/산사 프로젝트 UI가 잘못 덮이지 않게 했다.
- `src/contexts/FundingContext.tsx`에 `mergeProjects`, `mergeProject`, `mergeFundingReviews`를 추가했다. 기존 로컬 등록 게시글과 mock 데이터를 보존하면서 서버 조회 결과를 병합할 수 있게 했다.
- `src/features/funding/screens/FundingListScreen.tsx`는 기존 필터/정렬 UI를 유지한 채 `GET /api/fundings`를 호출하고, 서버 목록을 기존 카드 데이터에 merge한다. 서버에 없는 로컬/seed 프로젝트와 새로 등록한 프로젝트는 목록에서 유지된다.
- `src/features/funding/screens/FundingDetailScreen.tsx`는 상세/소개/양조일지/Q&A/후기 탭 진입 흐름에 맞춰 API를 호출한다. Q&A 질문 등록은 현재 UI에 제목 입력칸이 없어 입력 내용 앞 30자를 `title`로 보내고, 전체 입력값을 `content`로 보낸다. 답글 등록은 기존 인라인 답글 UI에서 `content`만 전송한다.
- 후기 목록 조회는 이 시점에 API에 연결했고, 이후 신규 명세를 받아 후기 작성은 추가 연결했다. 후기 수정 API는 아직 제공되지 않아 `FundingReviewWriteScreen`의 수정 모드는 기존 로컬 수정 흐름을 유지한다.
- `src/features/funding/screens/FundingSupportScreen.tsx`는 후원 옵션 조회와 주문 상세 조회를 추가 연결했다. 결제 요청 후 `paymentUrl`은 실제로 열고, 주문 상세 조회를 시도한 뒤 기존 성공 모달과 로컬 후원 반영 흐름을 유지한다.
- 현재 백엔드 결제 mock은 결제 요청 검증 금액이 `36000`으로 고정되어 있어 UI에서 다른 수량/금액으로 결제하면 실패할 수 있다. 실제 결제 완료까지 정확히 연결하려면 백엔드가 주문 생성 금액과 결제 요청 검증 금액을 같은 기준으로 맞추고, 결제 완료 callback/webhook 또는 상태 조회 기준을 제공해야 한다.
- `src/constants/data.ts`의 런타임 seed 프로젝트는 사용자 요청에 맞춰 `봄을 담은 벚꽃 막걸리 프로젝트`, `꽃향기 가득한 생막걸리 프로젝트`, `산사 막걸리 프로젝트` 3개로 정리했다. 사용자가 `신사 막걸리 프로젝트`라고 적었지만 현재 코드의 기존 seed title은 `산사 막걸리 프로젝트`라 기존 데이터를 유지했다.
- 사용자가 보낸 임시 로그인 정보 `user@judam.test / Judam123`, `brewery@judam.test / Judam123`이 기존 소문자 비밀번호와 함께 동작하도록 `AuthContext`의 임시 테스트 로그인 비밀번호 비교를 대소문자 무시 방식으로 조정했다. 로그인 화면 UI는 수정하지 않았다.
- `api.md`에 5차/6차/7차 연결 범위, merge 정책, 4차 파일 업로드 대기, 후기 작성 API 부재, 결제 callback/webhook 필요성을 기록했다.
- 서버 과금 방지를 위해 실제 API 호출 검증은 하지 않았다. 검증 결과 `npx tsc --noEmit`, `npm run lint`, `git diff --check` 모두 통과했다.

[2026-05-10]: 펀딩 4차 필수 서류 업로드 API 연결.

[진행 내용]:
- 사용자가 필수 서류 업로드 상세 명세를 추가로 제공해 `POST /api/fundings/drafts/{draftId}/documents`를 연결할 수 있게 됐다.
- `src/features/funding/api.ts`에 `FundingDocumentType`, multipart 요청 helper, `uploadFundingDocument`를 추가했다. multipart boundary 유지를 위해 `Content-Type`은 직접 지정하지 않고 `Authorization`만 붙인다.
- `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`의 `uploadedFiles` state를 기존 문자열 임시저장과 호환되는 `name/uri/mimeType/size` 구조로 확장했다. 예전 임시저장 문자열은 계속 표시되지만, 실제 업로드가 필요한 신규 제출에서는 `uri`가 없으면 파일을 다시 선택하라는 에러를 띄운다.
- 문서 선택 시 PDF/JPG/JPEG/PNG만 허용하고 5MB 초과 파일은 프론트에서 먼저 막는다.
- 신규 프로젝트 최종 제출 시 `draftId` 확보, 섹션 저장, 필수 서류 5개 업로드가 모두 성공한 뒤 기존 로컬 게시글 생성 흐름을 실행한다.
- documentType 매핑은 `idCard -> ETC`, `businessLicense -> BUSINESS_REGISTRATION`, `salesPermit -> MAIL_ORDER_BUSINESS`, `alcoholPermit -> LIQUOR_LICENSE`, `manufacturingLicense -> LIQUOR_LICENSE`다. 백엔드가 같은 `LIQUOR_LICENSE` 업로드를 replace-only로 처리하면 주류 승인서와 제조면허증을 구분할 수 없어 백엔드 enum 추가 또는 다중 파일 지원이 필요하다.
- 프로젝트 제출 API(`POST /api/fundings/drafts/{draftId}/submit`)와 프로젝트 미리보기 API(`GET /api/fundings/drafts/{draftId}/preview`)는 사용자가 보낸 최신 목록에는 endpoint만 있고 response/request 세부 명세가 아직 없어 연결하지 않았다.
- 서버 과금 방지를 위해 실제 API 호출 검증은 하지 않았다.

[2026-05-10]: 펀딩 추가 API 묶음 연결.

[진행 내용]:
- 사용자가 새로 전달한 양조일지 등록/수정/삭제, 공유 링크 조회, 신고 등록/목록, 결제 정보 조회, 후기 작성, 펀딩 찜 등록/해제, 마이페이지 후원 내역 조회 API 명세를 기준으로 연결했다.
- `src/features/funding/api.ts`에 `createBreweryLog`, `updateBreweryLog`, `deleteBreweryLog`, `getFundingShareLink`, `createFundingReport`, `getFundingReports`, `getFundingPaymentInfo`, `createFundingReview`, `likeFundingProject`, `unlikeFundingProject`, `getMyFundingOrders`를 추가했다.
- `src/features/brewery/project/screens/BreweryJournalManageScreen.tsx`는 기존 양조일지 관리 UI를 유지하면서 등록/수정/삭제 API를 호출한다. 이미지 선택값은 `uri/name/mimeType`으로 보존해 `multipart/form-data` `images` 필드로 전송한다. 기존 이미지 삭제는 수정 시 제거된 URL을 `deleteImageUrls`로 보낸다.
- 프론트 양조일지 단계와 백엔드 stage enum이 완전히 같은 이름은 아니어서 현재 등록/수정 매핑은 `1 -> INGREDIENT`, `2 -> INGREDIENT`, `3 -> FERMENTATION`, `4 -> AGING`, `5 -> BOTTLING`으로 연결했다. 조회 응답은 기존 `step` 문자열과 신규 `stage` enum을 모두 수용한다. 현재 프론트 UI에는 배송 단계가 없어 `SHIPPING`은 전송하지 않는다. 백엔드가 2단계/4단계를 별도 enum으로 구분해야 하면 추가 명세가 필요하다.
- `src/features/funding/screens/FundingDetailScreen.tsx`는 공유하기 모달에서 공유 링크 API를 먼저 조회하고, 신고하기 모달은 백엔드 신고 사유 enum으로 신고 등록 API를 호출한다.
- 실제 배포 서버 확인 결과 `GET /api/fundings/{fundingId}/share-link`는 HTML 404를 반환했다. 프론트는 공유 링크 API가 없을 때 기본 앱 공유 URL로 fallback한다.
- `src/features/funding/screens/FundingReviewWriteScreen.tsx`는 신규 후기 작성 시 `POST /api/fundings/{fundingId}/reviews`를 multipart로 호출한다. 후기 수정 API는 제공되지 않아 수정 모드는 기존 로컬 수정 흐름을 유지한다.
- `src/contexts/FavoritesContext.tsx`는 기존 찜 optimistic UI를 유지하면서 찜 등록/해제 API를 호출하고 실패 시 로컬 상태를 되돌린다. 서버가 이미 같은 찜 상태라고 알려주는 응답은 멱등 성공처럼 처리해 로컬/서버 상태가 엇갈릴 때도 버튼 상태가 불필요하게 반전되지 않게 했다.
- 런타임에서 `POST/DELETE /api/fundings/{fundingId}/likes`가 HTML 404를 반환하는 케이스가 확인됐다. 백엔드 likes 라우트가 실제 서버에 등록/배포되지 않았거나 local seed fundingId가 서버에 없을 수 있으므로, 프론트는 해당 경고를 숨기고 로컬 찜 상태를 유지한다. 백엔드는 likes endpoint가 JSON API로 응답하는지 확인해야 한다.
- `src/features/funding/screens/FundingSupportScreen.tsx`는 결제 요청 후 결제 정보 조회 API도 호출한다. 실제 배포 서버 확인 결과 `GET /api/orders/{orderId}/payment`는 HTML 404를 반환하므로, 프론트는 이 missing endpoint 에러를 숨기고 기존 성공 흐름을 유지한다. 결제 완료 callback/webhook이 없어 paymentUrl 이후 최종 성공 확정 기준은 여전히 백엔드 보강이 필요하다.
- `src/features/mypage/screens/MyPageScreen.tsx`와 `FundingContext`는 마이페이지 진입 시 후원 내역 API를 조회해 기존 참여 펀딩 상태에 병합한다. 실제 배포 서버 확인 결과 `GET /api/users/me/funding-orders`는 HTML 404를 반환하므로, 프론트는 이 missing endpoint 에러를 숨기고 기존 로컬 참여 펀딩 상태를 유지한다. 현재 마이페이지에는 후원 내역 상세 목록 UI가 없어 참여 펀딩 수와 후기 작성 권한 판단에만 반영한다.
- 펀딩 신고 목록 조회는 관리자/운영자 전용 화면이 현재 앱에 없어 API client만 추가했다.
- 서버 과금 방지를 위해 실제 API 호출 검증은 하지 않았다.

[2026-05-10]: API HTML 응답 JSON parse 경고 방어.

[진행 내용]:
- 사용자가 `JSON Parse error: Unexpected character: <` 경고를 전달했다. 이 경고는 서버/API 요청 응답이 JSON이 아니라 HTML로 왔을 때 발생하는 패턴이다.
- `src/features/funding/api.ts`와 `src/features/recipe/api.ts`의 공통 요청 helper가 응답 본문을 무조건 `JSON.parse`하지 않고, 비어 있는 응답은 `null`로 처리하며 JSON이 아닌 응답은 path/status/content-type이 포함된 명확한 Error로 던지게 했다.
- 이 변경은 서버가 HTML 에러 페이지를 반환하는 근본 원인을 고치는 것은 아니고, 어떤 API path에서 JSON이 아닌 응답이 왔는지 프론트 로그로 추적할 수 있게 하는 방어 처리다.

[2026-05-10]: [주담] 신규 레시피 API 명세 반영 및 추가 연결.

[진행 내용]:
- 사용자가 새로 전달한 레시피 목록 조회, 상세 조회, 작성, 댓글 목록 조회, 댓글 대댓글 목록 조회, 댓글 대댓글 작성, 레시피 펀딩 전환 제안 PDF 7개를 확인했다.
- `api.md`에 2026-05-10 신규 레시피 명세를 반영했다. 목록/상세 응답의 `author_nickname`, `author_profile_image`, `comment_count`, `is_interested`, 댓글 응답의 `author_type`, `author_profile_image`, `is_mine`, 대댓글 목록/작성, 레시피 작성 multipart 이미지 필드, 레시피 펀딩 전환 제안 API를 정리했다.
- `src/features/recipe/api.ts`의 목록/상세/댓글 DTO와 mapper를 신규 응답 필드에 맞게 확장했다. 이제 목록/상세 카드와 상세 화면은 서버가 내려주는 작성자 닉네임, 프로필 이미지, 댓글 수, 현재 사용자 관심 여부를 사용할 수 있다.
- `POST /api/recipes`는 기존 JSON body 방식에서 신규 명세의 `multipart/form-data` 방식으로 변경했다. 텍스트 필드는 그대로 form field로 보내고, 사용자가 갤러리에서 고른 로컬 이미지는 `image` 파일 필드로 전송한다. AI 생성 버튼의 원격 placeholder 이미지는 파일이 아니므로 업로드하지 않는다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`는 선택한 이미지의 `uri`, `fileName`, `mimeType`을 보존해 레시피 작성 API에 넘긴다.
- `src/features/recipe/api.ts`에 대댓글 목록 조회 `GET /api/recipes/{recipeId}/comments/{commentId}/replies`와 대댓글 작성 `POST /api/recipes/{recipeId}/comments/{commentId}/replies`를 추가했다.
- `src/features/recipe/screens/RecipeDetailScreen.tsx`의 기존 대댓글 UI는 유지하고, 사용자가 답글 입력을 열거나 펼칠 때 해당 댓글의 대댓글을 lazy load하도록 연결했다. 댓글 목록 조회 시 모든 댓글의 대댓글을 한 번에 호출하지 않아 서버 과금과 불필요한 N+1 호출을 줄인다.
- 대댓글 작성은 신규 API를 호출하고, 성공 응답을 기존 답글 UI에 반영한다. 대댓글 좋아요는 별도 API가 없으므로 대댓글도 `recipe_comments`의 `comment_id`를 가진다는 명세에 맞춰 기존 댓글 좋아요 등록/취소 API에 대댓글 ID를 넣어 호출한다.
- 댓글 목록 응답의 `totalElements`와 상세 응답의 `comment_count`를 상세 댓글 수 표시에 반영한다.
- `src/features/recipe/api.ts`에 레시피 펀딩 전환 제안 `POST /api/recipes/{recipeId}/funding` client 함수를 추가했다. 다만 사용자가 앞서 `[주담]` 상세 버튼은 바로 펀딩 생성이 아니라 `/brewery/project/terms` 약관 페이지로 가야 한다고 요청했으므로 현재 화면에서는 이 API를 직접 호출하지 않는다.
- 서버 과금 방지를 위해 실제 API 호출 검증은 하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-10]: [주담] 목록/상세 레시피 관심 상태 동기화.

[진행 내용]:
- 사용자가 주담 목록에서 관심을 누르면 상세에는 반영되지만, 상세에서 관심을 누른 뒤 목록으로 돌아오면 반영이 어려운 문제를 제보했다.
- 원인은 목록 화면이 `likedRecipeIdsRef`로 목록 내부에서만 관심 상태를 기억하고, 상세 화면의 변경값을 목록이 서버 재조회 없이 알 수 없는 구조였다.
- `src/features/recipe/interestState.ts`를 추가해 `[주담]` 레시피 관심 여부, 관심 수, 펀딩 가능 여부를 앱 세션 안에서 공유하는 작은 프론트 상태로 분리했다.
- `src/features/recipe/screens/RecipeListScreen.tsx`는 목록 로드 결과와 화면 focus 시점에 공유 관심 상태를 적용한다. 목록에서 관심 토글 시에도 같은 공유 상태를 optimistic update하고, API 성공 시 서버 응답의 `interest_count`, `is_fundable`로 보정하며 실패 시 이전 상태로 되돌린다.
- `src/features/recipe/screens/RecipeDetailScreen.tsx`는 상세 조회 후 공유 관심 상태가 있으면 서버 응답보다 우선해 화면에 적용한다. 상세에서 관심 토글 시에도 같은 공유 상태를 갱신해 목록으로 돌아왔을 때 하트 UI와 카운트가 즉시 맞춰진다.
- 이 동기화는 서버 호출을 추가하지 않는 프론트 세션 단위 보정이다. 앱을 완전히 재시작하면 서버의 `is_interested`, `interest_count` 응답이 다시 기준이 된다.
- 서버 과금 방지를 위해 실제 API 호출 검증은 하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check` 통과.

[2026-05-10]: [주담] 댓글 수와 작성한 대댓글 프론트 동기화.

[진행 내용]:
- 사용자가 상세에서 댓글을 작성한 뒤 뒤로가기로 목록에 돌아가면 서버 목록을 다시 불러오기 전까지 댓글 수가 반영되지 않고, 정렬 변경처럼 목록 API를 다시 호출해야 댓글 수가 맞아지는 문제를 제보했다.
- 원인은 댓글 작성/삭제 성공 후 상세 화면의 `commentsCount`만 바뀌고, 목록 화면의 `Recipe.comments` 값은 기존 조회 결과를 계속 들고 있기 때문이다.
- 기존 `src/features/recipe/interestState.ts`의 세션 공유 상태를 확장해 레시피별 댓글 수와 내가 작성/조회한 대댓글 목록도 기억하도록 했다.
- `src/features/recipe/screens/RecipeListScreen.tsx`는 focus 시점에 공유 상태를 목록 카드에 적용하므로, 상세에서 댓글 작성/삭제 후 뒤로가기를 해도 목록 댓글 수가 즉시 맞춰진다.
- `src/features/recipe/screens/RecipeDetailScreen.tsx`는 댓글 목록 조회 성공 시 서버 `totalElements`를 공유 댓글 수로 저장하고, 댓글 작성/삭제 성공 시 공유 댓글 수를 즉시 갱신한다.
- 상세에서 내가 작성한 대댓글은 `appendRecipeReplyState`로 저장한다. 이후 같은 레시피 상세에서 루트 댓글 목록이 다시 세팅되어도 저장된 대댓글을 해당 댓글의 `replies`에 다시 붙여, 답글 UI를 누르기 전에도 프론트가 방금 작성한 답글을 기억할 수 있게 했다.
- 대댓글 전체를 모든 댓글마다 자동 조회하는 방식은 서버 과금과 N+1 호출 위험이 있어 적용하지 않았다. 서버에 이미 존재하던 대댓글은 기존처럼 사용자가 답글 입력/펼침을 누르는 시점에 lazy load한다.
- 서버 과금 방지를 위해 실제 API 호출 검증은 하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check` 통과.

[2026-05-10]: [주담] 레시피 게시글 수정 UI 제거.

[진행 내용]:
- 사용자가 레시피 수정 API 기능은 아예 삭제하고 UI도 없애되, 레시피 삭제 기능은 남겨야 한다고 요청했다.
- `src/features/recipe/screens/RecipeDetailScreen.tsx`에서 레시피 작성자 메뉴의 `수정` 항목과 `handleRecipeEdit` 라우팅 핸들러를 제거했다.
- 레시피 작성자 메뉴의 `삭제` 항목은 유지했다. 단, 현재 레시피 게시글 삭제 API 명세는 아직 없어 삭제 버튼은 기존처럼 서버 삭제 호출 없이 목록으로 이동하는 임시 동작이다.
- 댓글의 수정/삭제 메뉴는 댓글 API가 이미 있으므로 변경하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check` 통과.

[2026-05-10]: [주담] 앱 재시작 직후 관심 하트 초기 상태 보정.

[진행 내용]:
- 사용자가 양조장 계정으로 이미 관심 등록한 레시피가 앱 재시작/재로그인 직후에는 하트가 비어 있고, 최신순/추천순 등 정렬 변경으로 목록을 다시 불러오면 정상 색칠된다고 제보했다.
- 원인은 앱 시작 시 `AuthContext`가 저장된 유저와 임시 토큰을 비동기로 복구하는 동안 `[주담]` 목록이 먼저 `GET /api/recipes`를 호출해, 첫 요청이 토큰 없이 나갈 수 있는 초기화 순서 문제로 판단했다.
- `src/contexts/AuthContext.tsx`에 `isAuthReady`를 추가하고, 저장된 사용자 복구 시 임시 토큰을 먼저 확인/저장한 뒤 `user`를 세팅하도록 순서를 조정했다.
- `src/features/recipe/screens/RecipeListScreen.tsx`는 `isAuthReady`가 true가 된 뒤에만 목록 API를 호출하도록 변경했다. 비로그인 사용자는 Auth 복구 완료 후 토큰 없이 public 목록을 조회하고, 로그인 사용자는 토큰 저장이 끝난 뒤 목록을 조회하므로 `is_interested` 초기값이 누락될 가능성이 줄어든다.
- 이 변경은 백엔드 API 호출을 추가하지 않고 첫 호출 타이밍만 늦추는 프론트 보정이다. 실제 로그인/회원가입 API 연결 시에도 동일하게 인증 초기화 완료 후 사용자별 목록 조회가 나가야 한다.
- 나중에 정식 로그인/회원가입 API를 연결할 때는 지금의 임시 토큰 하드코딩을 제거하되 `isAuthReady` 개념은 유지해야 한다. 앱 시작 시 저장된 `accessToken` 복구/검증, 현재 사용자 정보 복구, 필요 시 토큰 갱신 또는 로그아웃 처리가 끝난 뒤에만 `isAuthReady = true`가 되어야 한다.
- `[주담]`의 목록/상세처럼 `is_interested`, `is_liked`, `is_mine` 등 사용자별 필드를 받는 API는 `isAuthReady` 이전에 호출하면 안 된다. 인증 복구 전 첫 요청이 비로그인으로 나가면 앱 재시작 직후 관심 하트가 비어 보이고, 정렬 변경/재조회 후에야 정상화되는 문제가 다시 발생할 수 있다.
- 실제 로그인 API 연결 시 체크리스트: 로그인 성공 응답의 `accessToken`을 `judam_access_token` 또는 새 표준 키에 저장한다. 앱 재시작 시 토큰을 먼저 복구한다. 토큰 기준으로 사용자 정보를 복구한 뒤 `user`를 세팅한다. 그 다음 `isAuthReady = true`로 바꾼다. 로그아웃 시 토큰과 user를 모두 제거한다.
- 서버 과금 방지를 위해 실제 API 호출 검증은 하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check` 통과.

[2026-05-10]: [주담] 양조장 레시피 펀딩 전환 제안 API 흐름 연결.

[진행 내용]:
- 사용자가 `레시피 펀딩 전환 제안`과 `양조장 소비자 레시피 확인` PDF 2개를 추가로 전달했다.
- `api.md`에 `POST /api/recipes/{recipeId}/funding` 최신 명세와 `GET /api/recipes/brewery` 명세를 정리했다.
- `src/features/recipe/api.ts`에 양조장 소비자 레시피 확인 API client `fetchBreweryConsumerRecipes`를 추가했다. 다만 이 endpoint는 `author_type=USER`와 관심 수 내림차순이 고정이고, PDF 응답에 현재 카드에 필요한 `comment_count`, `is_interested`, `author_nickname`, 프로필 이미지가 없어 현재 `[주담]` 공개 목록을 대체 호출하도록 연결하지 않았다. 별도 양조장 전용 소비자 레시피 검토 화면/필터가 생기면 사용한다.
- 사용자가 앞서 요구한 대로 `[주담]` 상세의 `이 레시피로 펀딩 제안하기` 버튼은 바로 펀딩 프로젝트를 만들지 않고 먼저 `/brewery/project/terms` 약관 페이지로 이동한다. 이때 `recipeId`를 query로 넘기도록 수정했다.
- `src/features/brewery/project/screens/BreweryProjectTermsScreen.tsx`는 약관 동의 저장 성공 후 `recipeId`를 보존해 `/brewery/project/create?recipeId={recipeId}`로 넘긴다.
- `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`는 신규 프로젝트 최종 제출 시 기존 draft 생성/섹션 저장/서류 업로드를 유지한 뒤, `recipeId`가 있으면 `createRecipeFunding(recipeId, { title, description, goal_amount, start_date, end_date })`를 호출한다.
- 레시피 펀딩 전환 API가 성공하면 응답의 `funding_id`를 `FundingContext.mergeProjects`로 visible app project id에 반영하고, 성공 모달의 `게시글 확인`은 `/funding/{funding_id}`로 이동한다.
- 이로써 프론트 기준 `펀딩 제안 흐름 연결 정책/API 연동`은 큰 흐름상 해결됐다. 다만 백엔드 API는 성공 시 `funding_status=ACTIVE`를 반환해 즉시 진행 중 프로젝트가 되고, 기존 펀딩 등록 화면은 draft/심사 중 흐름도 함께 갖고 있다. 실제 제품 정책이 즉시 ACTIVE인지, 심사 제출 후 ACTIVE인지 최종 확인이 필요하다.
- 서버 과금 방지를 위해 실제 API 호출 검증은 하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check` 통과.

[2026-05-10]: AI 챗봇 채팅방 삭제 UI 추가.

[진행 내용]:
- 사용자가 양조장/사용자 화면 모두에서 [AI 챗봇]의 채팅방 삭제 기능을 요청했다. 대상 카테고리는 술 추천(`recommend`), 안주 추천(`pairing`), 통합 AI(`general`) 전체다.
- `src/features/ai-chat/screens/AIChatScreen.tsx`의 채팅방 목록에 `react-native-gesture-handler`의 `Swipeable`을 적용해, 채팅방을 옆으로 밀면 오른쪽에 빨간 `삭제` 액션이 보이도록 했다. 삭제 시 `judam.aiChat.rooms` SafeStorage 값을 함께 갱신해 세 카테고리 목록에서 해당 방이 사라진다.
- 목록 화면은 `useFocusEffect`로 저장된 채팅방을 다시 읽어 상세 화면에서 삭제 후 돌아왔을 때도 최신 목록을 반영하도록 했다.
- `src/features/ai-chat/screens/AIChatRoomScreen.tsx` 오른쪽 상단에 `MoreVertical` 점 세 개 버튼을 추가하고, 주담 레시피 상세의 작은 드롭다운 메뉴 스타일을 참고해 `삭제` 메뉴를 표시하도록 했다.
- 상세 화면의 삭제 메뉴를 누르면 현재 `roomId`를 기준으로 SafeStorage의 채팅방 목록에서 해당 방을 제거한 뒤 `/ai-chat` 목록으로 이동한다.
- 실제 AI 서버/API, 메시지 생성 로직, 사용자/양조장 권한 분기 로직은 변경하지 않았고 현재 프론트 로컬 저장소/UI 범위에서만 동작한다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/ai-chat/screens/AIChatScreen.tsx src/features/ai-chat/screens/AIChatRoomScreen.tsx` 모두 통과했다.

[2026-05-10]: [주담] 레시피 삭제 API 연결.

[진행 내용]:
- 사용자가 `레시피 삭제` PDF를 추가로 전달했다. 명세는 `DELETE /api/recipes/{recipeId}`이며 로그인한 작성자 본인만 삭제할 수 있고, `PUBLISHED`, `FUNDING_READY` 상태만 삭제 가능하다.
- `api.md`에 레시피 삭제 API 명세, 실패 케이스, 프론트 연결 위치를 정리했다.
- `src/features/recipe/api.ts`에 `deleteRecipe(recipeId)` client 함수를 추가했다.
- `src/features/recipe/screens/RecipeDetailScreen.tsx`의 작성자 메뉴 `삭제` 버튼을 실제 삭제 API 호출로 연결했다. 토큰이 없으면 기존 로그인 안내를 사용하고, 실패하면 서버 메시지를 Alert로 보여준다.
- `src/features/recipe/interestState.ts`에 삭제된 레시피 id를 현재 앱 세션에서 기억하는 상태를 추가했다. 삭제 성공 후 목록으로 돌아갔을 때 서버 목록을 즉시 다시 호출하지 않아도 방금 삭제한 카드가 남아 보이지 않도록 했다.
- 이로써 프론트 기준 `[주담]`의 레시피 삭제 API 연결은 해결됐다. 단, 실제 삭제 가능 여부는 백엔드가 작성자 id와 레시피 상태를 검증해 결정한다.
- 서버 과금 방지를 위해 실제 API 호출 검증은 하지 않았다.

[2026-05-12]: [주담] 양조장 작성 레시피 삭제 메뉴 노출 보정.

[진행 내용]:
- 사용자가 양조장 임시 계정으로 작성한 레시피 상세에서 삭제 버튼이 보이지 않는 문제를 제보했다.
- 원인은 레시피 작성자 메뉴 노출 기준이 `user.name === recipe.author` 문자열 비교에 의존하는데, 양조장 작성자명이 서버 응답에서 임시 계정 이름과 다르거나 깨져 내려오면 본인 글이어도 프론트가 작성자로 판단하지 못하는 구조였다.
- `src/features/recipe/api.ts`와 `src/constants/data.ts`에 레시피 작성자 id 보조 필드 `authorId`를 추가했다. 서버가 `user_id`를 내려주는 경우 현재 로그인 사용자 id와 비교해 작성자 메뉴를 보여줄 수 있다.
- `src/features/recipe/interestState.ts`에 현재 앱 세션에서 방금 작성한 레시피 id를 기억하는 `markCurrentUserRecipe`, `isCurrentUserRecipe`를 추가했다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`는 레시피 작성 성공 후 응답의 recipe id를 현재 사용자 작성 레시피로 기억한다.
- `src/features/recipe/screens/RecipeDetailScreen.tsx`의 작성자 판단은 이제 `이름 일치`, `authorId와 user.id 일치`, `현재 세션에서 작성한 레시피` 중 하나라도 맞으면 삭제 메뉴를 보여준다.
- 삭제 API 자체는 계속 서버의 JWT user id와 레시피 상태 검증을 따른다. 이번 변경은 임시 로그인/작성자명 불일치 때문에 메뉴가 숨겨지는 프론트 표시 문제만 보정한 것이다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/constants/data.ts src/features/recipe/api.ts src/features/recipe/interestState.ts src/features/recipe/screens/RecipeCreateScreen.tsx src/features/recipe/screens/RecipeDetailScreen.tsx` 통과.

[2026-05-12]: [주담] 양조장 작성자명 깨짐 표시 임시 보정.

[진행 내용]:
- 사용자가 양조장 계정으로 작성한 레시피 상세에서 작성자명이 `??????`로 보이는 대신 `양조장 테스트`로 표시되길 요청했다.
- `src/features/recipe/api.ts`의 레시피 작성자명 매핑 함수에 깨진 작성자명 판별 helper를 추가했다.
- 서버 응답의 `author_type`이 `BREWERY`이고 `author_nickname` 또는 `author_name`이 비어 있거나 물음표로만 구성된 경우, 프론트에서 `양조장 테스트`로 표시하도록 했다.
- 이 변경은 `[주담]` 목록/상세에서 서버 데이터를 화면용으로 매핑하는 표시 보정이며, 백엔드 데이터나 삭제 권한 검증에는 영향을 주지 않는다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/recipe/api.ts` 통과.

[2026-05-12]: [주담] 레시피 상세 프로젝트 컨셉 표시 추가.

[진행 내용]:
- 사용자가 레시피 제안하기에서 입력하는 `프로젝트 컨셉`이 상세 화면에는 표시되지 않는 문제를 확인했다.
- 기존 API 명세와 프론트 mapper는 이미 상세 응답의 `concept` 필드를 받을 수 있게 되어 있었으므로, 백엔드 추가 작업 없이 상세 UI만 보강했다.
- `src/features/recipe/screens/RecipeDetailScreen.tsx`에서 상세 state에 `concept`를 포함하고, `레시피 요약` 섹션 바로 위에 `프로젝트 컨셉` 섹션을 추가했다.
- `concept` 값이 비어 있으면 해당 섹션은 렌더링하지 않는다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/recipe/screens/RecipeDetailScreen.tsx` 통과.

[2026-05-12]: [주담] 댓글 답글 보기 버튼 상시 표시.

[진행 내용]:
- 사용자가 레시피 상세 댓글에서 해당 댓글에 답글이 있는지 없는지 구분하기 어렵다고 제보했다.
- 현재 백엔드 댓글 목록 응답에는 각 댓글별 `reply_count`가 없어, 프론트가 답글 존재 여부를 미리 정확히 알 수 없다. 모든 댓글의 대댓글 API를 선조회하면 N+1 호출과 서버 과금 문제가 생기므로 적용하지 않았다.
- `src/features/recipe/screens/RecipeDetailScreen.tsx`에서 댓글 하단의 답글 펼침 버튼을 답글 개수가 있을 때만 표시하던 방식에서 모든 댓글에 `답글 보기`로 상시 표시하도록 변경했다.
- 버튼을 누르면 기존처럼 해당 댓글의 대댓글 목록만 lazy load한다. 펼친 상태에서는 `답글 접기`로 표시하고, 답글 개수 숫자는 노출하지 않는다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/recipe/screens/RecipeDetailScreen.tsx` 통과.

[2026-05-12]: [주담] 레시피 작성 AI 법률 필터링 실패 응답 반영.

[진행 내용]:
- 사용자가 레시피 작성 API의 2026-05-12 변경 사항을 전달했다. `POST /api/recipes`는 `multipart/form-data`를 유지하며, `Content-Type: application/json`을 직접 지정하면 안 되고 텍스트 필드도 `FormData.append`로 전송해야 한다.
- 기존 `src/features/recipe/api.ts`의 `createRecipe`와 `requestFormJson`을 확인한 결과, 텍스트 필드는 이미 `FormData.append`로 전송하고 있고 multipart 요청에서는 `Content-Type`을 직접 지정하지 않아 현재 명세와 맞다.
- AI 법률 필터링이 서버에서 엄격하게 적용되어 통과 응답을 받지 못하면 레시피 등록이 차단된다. `api.md`에 법률 위반 키워드, AI 서버 오류, 응답 시간 초과, AI 서버 연결 실패 실패 메시지를 정리했다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`의 레시피 작성 실패 안내를 고정 문구에서 서버가 내려준 `message`를 보여주는 방식으로 변경했다. 이제 `'{위반 키워드}' 표현을 수정해주세요`, `AI 서버에 연결할 수 없습니다...` 같은 실패 사유가 화면에 표시된다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/recipe/screens/RecipeCreateScreen.tsx api.md` 통과.

[2026-05-12]: [주담] 댓글 `reply_count` 및 대댓글 작성 후 답글 수 동기화 연결.

[진행 내용]:
- 사용자가 수정된 댓글 API 명세를 전달했다. 댓글 목록 응답에는 루트 댓글별 `reply_count`가 추가됐고, 대댓글 작성 응답에는 부모 댓글의 최신 대댓글 수 `parent_reply_count`가 추가됐다.
- `api.md`에 `GET /api/recipes/{recipeId}/comments`의 `reply_count`, `nickname`, `author_profile_image`, `author_type`, `is_mine` 최신 응답 구조와 `POST /api/recipes/{recipeId}/comments/{commentId}/replies`의 `parent_reply_count` 응답을 반영했다.
- `src/features/recipe/api.ts`의 `RecipeCommentDto`와 `CreateReplyResponse` 타입을 최신 명세에 맞게 확장하고, `mapRecipeComment`가 `replyCount`를 반환하도록 했다.
- `src/features/recipe/screens/RecipeDetailScreen.tsx`는 댓글 목록의 `reply_count`로 대댓글 목록을 펼치기 전에도 `N개 답글` 버튼을 표시한다. 버튼을 누를 때만 대댓글 목록을 lazy load하므로 모든 댓글의 대댓글을 선조회하지 않는다.
- 대댓글 작성 성공 시 `parent_reply_count`를 사용해 부모 댓글의 `N개 답글` 숫자를 즉시 갱신한다.
- `src/features/recipe/interestState.ts`에 댓글별 답글 수 공유 상태를 추가해 상세 재진입/댓글 재조회 시 프론트에서 방금 갱신한 답글 수를 유지할 수 있게 했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/recipe/api.ts src/features/recipe/interestState.ts src/features/recipe/screens/RecipeDetailScreen.tsx api.md` 통과.

[2026-05-11]: [주담] 테스트 소비자 레시피 삭제 메뉴 노출 보정.

[진행 내용]:
- 사용자가 테스트 소비자로 작성한 레시피 상세 화면에서 상단 우측 세점/삭제 메뉴가 보이지 않는 문제를 확인했다.
- 원인은 서버 삭제 권한은 JWT user id로 판단하지만, 프론트 메뉴 노출은 `RecipeDetailScreen`에서 `user.name === recipe.author` 문자열 비교로 판단하던 구조였다.
- 현재 임시 소비자 JWT는 서버 user id `2`를 쓰고, 서버 상세 응답 작성자 닉네임은 `테스트소비자`로 내려오는데, 프론트 임시 로그인 사용자의 이름은 `테스트 사용자`라서 작성자 비교가 실패했다.
- `src/contexts/AuthContext.tsx`의 임시 소비자 로그인 이름을 `테스트소비자`로 변경했다.
- 이미 SafeStorage에 저장된 기존 임시 사용자(`테스트 사용자`)도 앱 시작 시 `normalizeTemporaryUser`로 `테스트소비자`로 보정하고 다시 저장하도록 했다.
- 삭제 API 자체는 계속 서버의 JWT user id와 레시피 상태 검증을 따른다. 이번 변경은 프론트에서 본인 작성 글의 세점/삭제 메뉴가 닉네임 불일치 때문에 숨겨지는 문제만 보정한 것이다.
- 검증 결과 `npx.cmd tsc --noEmit` 통과.

[2026-05-11]: 양조장 대시보드 하단 알림 및 정보 UI 수정.

[진행 내용]:
- 사용자가 양조장 대시보드 하단의 `알림 및 정보` 영역만 수정하라고 요청했다.
- `src/features/notifications/data.ts`를 추가해 상단 알림 화면에서 쓰던 알림 초기 데이터를 공용 데이터로 분리했다.
- `src/features/notifications/screens/NotificationsScreen.tsx`는 기존 화면 내부 mock 배열 대신 공용 `initialNotifications`를 초기 상태로 사용하도록 변경했다. 화면 내 전체/읽지 않음 필터, 전체 읽음, 개별 읽음 처리 UI 흐름은 유지했다.
- `src/features/brewery/screens/BreweryDashboardScreen.tsx` 하단 `알림 및 정보` 섹션의 부제 `최근 활동과 중요한 알림`을 `새로운 알림`으로 변경했다.
- 같은 섹션의 기존 자체 mock `recentNotifications`를 제거하고, 공용 알림 데이터 중 `read: false`인 읽지 않음 알림만 표시하도록 바꿨다.
- 대시보드 하단 알림 항목은 제목, 내용 2줄, 시간, 타입별 아이콘/배경, unread dot을 보여주며, `link`가 있는 항목은 누르면 해당 펀딩 상세로 이동한다.
- 읽지 않은 알림이 0개일 때는 `새로운 알림이 없습니다` 빈 상태를 보여준다.
- 이번 작업은 프론트 UI/mock 상태 공유 범위이며, 알림 API나 백엔드 로직은 연결하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/brewery/screens/BreweryDashboardScreen.tsx src/features/notifications/screens/NotificationsScreen.tsx src/features/notifications/data.ts` 통과.
[2026-05-11]: 상단 알림 목록 항목 재구성.

[진행 내용]:
- 사용자가 상단바 `[알림]` 화면에서 `양조 일지 업데이트`, `주담 업데이트` 항목을 제거하고, 알림 항목을 펀딩 진행 상황과 새로운 인기 레시피 중심으로 재구성하라고 요청했다.
- `src/features/notifications/data.ts`의 공용 알림 mock 데이터를 재작성했다. 이제 알림 타입은 `funding_new`, `funding_progress`, `funding_end`, `funding_success`, `recipe_popular` 중심이다.
- 알림 목록은 펀딩 등록, 펀딩 진행률 30/50/80%, 펀딩 종료, 펀딩 성공, 새로운 인기 레시피 등장 항목으로 구성된다.
- `양조 일지 업데이트`, `주담 업데이트`, 기존 `brewing_update`, `system`, `funding_fail`, `funding_update` 타입은 현재 알림 목록에서 제거했다.
- `src/features/notifications/screens/NotificationsScreen.tsx`와 `src/features/brewery/screens/BreweryDashboardScreen.tsx`의 타입별 아이콘 분기를 새 알림 타입에 맞춰 수정했다. 양조장 대시보드 하단의 `새로운 알림` 영역도 같은 공용 알림 데이터의 읽지 않음 항목을 그대로 보여준다.
- 이번 작업은 프론트 공용 mock 데이터와 UI 타입 분기만 수정했으며, 알림 API나 백엔드 로직은 연결하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/notifications/data.ts src/features/notifications/screens/NotificationsScreen.tsx src/features/brewery/screens/BreweryDashboardScreen.tsx` 통과.
[2026-05-11]: 알림 목록 API 연결 대비 문구 패턴 통일.

[진행 내용]:
- 사용자가 향후 알림 API 연결 시 사용하기 좋도록 상단 알림 목록의 표시 문구를 정해진 패턴으로 통일하라고 요청했다.
- `src/features/notifications/data.ts`의 공용 알림 mock `content`를 아래 표준 문구 기준으로 수정했다.
- 펀딩 등록 안내: `'{프로젝트명}' 펀딩이 새롭게 등록되었습니다.`
- 펀딩 진행 상황: `'{프로젝트명}' 펀딩이 목표 금액 {퍼센트}%를 달성했습니다.`
- 펀딩 성공 안내: `'{프로젝트명}' 펀딩이 목표 금액을 달성했습니다.`
- 펀딩 종료 안내: `'{프로젝트명}' 펀딩이 종료되었습니다.`
- 새로운 인기 레시피 등장: `'{레시피명}' 레시피가 현재 많은 관심을 받고 있습니다.`
- 기존 mock의 추가 설명 문장, `프로젝트` 표현, API 연결 시 변수화하기 애매한 문구를 제거하고 `펀딩`, `레시피`, `목표 금액`, `{퍼센트}%` 기준으로 맞췄다.
- 향후 알림 API 연결 시 서버 응답은 가능하면 `type`, `projectName` 또는 `recipeName`, `percent`, `read`, `link`, `timestamp`, `image` 같은 필드로 받아 위 문구 템플릿에 매핑하는 방향이 적합하다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/notifications/data.ts` 통과.
[2026-05-11]: 양조장 대시보드 하단 알림 아이콘/읽지 않음 표시 색상 수정.

[진행 내용]:
- 사용자가 양조장 대시보드 하단 `알림 및 정보` 영역의 펀딩 등록 안내, 펀딩 진행 상황, 새로운 인기 레시피 등장 아이콘 색상과 읽지 않음 점 색상을 수정하라고 요청했다.
- `src/features/brewery/screens/BreweryDashboardScreen.tsx`에서 대시보드 하단 알림의 타입별 파스텔 아이콘 배경을 제거하고, 모든 알림 아이콘을 검정색 원형 배경(`#111827`) 안의 흰색 lucide 아이콘으로 통일했다.
- 알림 타입별 아이콘 종류는 유지한다. 펀딩 등록은 `Wine`, 펀딩 진행 상황은 `TrendingUp`, 새로운 인기 레시피는 `BookOpen`, 펀딩 성공은 `PartyPopper`, 펀딩 종료는 `AlertCircle`을 사용한다.
- 읽지 않음 표시 점은 기존 파란색(`#3B82F6`)에서 회색 계열(`#9CA3AF`)로 변경했다.
- 이번 작업은 양조장 대시보드 하단 알림 UI 스타일만 수정했으며, 상단 알림 화면의 아이콘 색상과 알림 데이터/API 로직은 변경하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/brewery/screens/BreweryDashboardScreen.tsx` 통과.
[2026-05-11]: 양조장 대시보드 하단 알림 unread 배경 회색화.

[진행 내용]:
- 사용자가 양조장 대시보드 하단 `알림 및 정보` 카드 내부에 얇게 깔린 연한 파란색 배경을 회색 느낌으로 바꾸라고 요청했다.
- `src/features/brewery/screens/BreweryDashboardScreen.tsx`의 `notifUnread` 배경색을 기존 `#EFF6FF`에서 회색 계열 `#F1F3F5`로 변경했다.
- 같은 파일의 `statusBadgeSuccess`에도 `#EFF6FF`가 있지만, 이번 요청 대상은 알림 카드의 unread 배경이므로 해당 상태 배지는 변경하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/brewery/screens/BreweryDashboardScreen.tsx` 통과.
[2026-05-11]: 상단 알림 화면 포인트 컬러 회색화.

[진행 내용]:
- 사용자가 양조장 계정으로 상단바 `[알림]` 화면에 들어갔을 때 보이는 갈색 포인트를 회색 느낌으로 바꾸라고 요청했다.
- `src/features/notifications/screens/NotificationsScreen.tsx`에서 unread count 배지, `전체 읽음` 아이콘/텍스트, 활성 필터 텍스트, 읽지 않은 카드 테두리, unread dot, 알림 제목의 갈색 계열 색상을 회색/블랙 계열로 변경했다.
- 기존 갈색 코드 `#8B5A3C`, `#2B1810`, `rgba(139, 90, 60, 0.2)`는 상단 알림 화면에서 제거했다.
- 펀딩 등록 아이콘 색상도 갈색에서 `#4B5563` 회색으로 변경했다. 다른 알림 타입의 의미색은 유지했다.
- 이번 작업은 상단 알림 화면의 UI 색상만 수정했으며, 알림 데이터, 읽음 처리 로직, API 연결 여부는 변경하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/notifications/screens/NotificationsScreen.tsx` 통과.
[2026-05-11]: 알림 화면 이미지 소스 기존 펀딩/레시피 이미지로 교체.

[진행 내용]:
- 사용자가 상단 `[알림]` 화면의 현재 임의 이미지를 삭제하고, 펀딩 관련 알림은 펀딩 페이지에서 사용한 이미지를, 레시피 알림은 레시피에서 사용한 이미지를 가져다 쓰라고 요청했다.
- `src/features/notifications/data.ts`에서 알림 mock 안에 직접 넣어둔 외부 이미지 URL을 제거했다.
- 펀딩 알림 이미지는 `src/constants/data.ts`의 `fundingProjects`와 `getFundingProjectImageSource`를 통해 기존 펀딩 카드/상세에서 쓰는 이미지 소스를 참조하도록 변경했다.
- 레시피 알림 이미지는 `recipesData`와 `getImageSource`를 통해 기존 레시피 화면에서 쓰는 이미지 소스를 참조하도록 변경했다.
- `AppNotification.image` 타입을 문자열 URL 전용이 아니라 React Native `ImageSourcePropType`으로 변경해 원격 이미지와 로컬 `require` 이미지를 모두 받을 수 있게 했다.
- `src/features/notifications/screens/NotificationsScreen.tsx`는 `Image` 렌더링 시 `{ uri: n.image }`로 감싸지 않고 `source={n.image}`를 직접 사용하도록 변경했다. 이로써 펀딩의 localImage와 레시피의 로컬 이미지가 그대로 표시된다.
- 알림 이미지 연결만 수정했으며, 알림 문구, 읽음 처리, 필터, API 연결 여부는 변경하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/notifications/data.ts src/features/notifications/screens/NotificationsScreen.tsx` 통과.

[2026-05-12]: [마이] 술BTI 아래 영역 Figma Make 참고 UI 정리.

[진행 내용]:
- 사용자가 하단바 기준 `[마이]` 부분만 수정하겠다고 범위를 지정했고, 술BTI 아래부터 Figma Make 코드/첨부 시안을 참고해 수정하라고 요청했다. 프로필 헤더, 양조장 대시보드 바로가기, 술BTI 카드 영역은 건드리지 않았다.
- `src/features/mypage/screens/MyPageScreen.tsx`의 술BTI 아래 통계 카드부터 계정 정보, 나의 활동, 기타/고객센터 흐름만 수정했다.
- 통계 카드는 4개 항목 `참여 펀딩`, `찜한 펀딩`, `내 아카이브`, `작성 게시글`을 유지하면서 Figma Make 시안처럼 간결한 아이콘/숫자/라벨 구조로 동작하게 했다. 양조장 계정에서는 시안 기준으로 참여 펀딩 7, 찜한 펀딩 0, 내 아카이브 12, 작성 게시글 5가 보이게 했다.
- 통계 카드 중 참여/찜한 펀딩은 `/funding`, 작성 게시글은 `/community`로 이동한다. 현재 앱에는 `/mypage/funded`와 `/archive` index route가 없어 존재하지 않는 라우트로 이동하지 않도록 피했다.
- `나의 활동` mock을 Figma Make 참고 데이터에 맞춰 게시글 작성, 레시피 작성, 댓글 작성, 좋아요 4개 항목으로 확장했다. 활동 카드는 배지, 시간, 대상 글 제목, 내용, 좋아요/댓글 수, `자세히 보기`를 표시한다.
- 활동 카드 클릭 시 레시피 활동은 `/recipe/{id}`, 커뮤니티 관련 활동은 현재 앱 라우트인 `/community/{id}`로 이동한다.
- 고객센터 바텀시트의 간편 문의 입력값을 `supportMsg` state로 관리하고, 빈 내용이면 Alert로 안내하며 내용이 있으면 접수 완료 Alert 후 입력값을 초기화하고 바텀시트를 닫도록 했다.
- 이번 작업은 `[마이]` 화면 내부 UI/mock 동작만 수정했으며, 다른 하단 탭 화면과 백엔드/API 로직은 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/mypage/screens/MyPageScreen.tsx` 통과.
[2026-05-12]: [마이] 메인 술BTI 아래 UI 정정 및 작업 기준 보강.

[진행 내용]:
- 사용자가 이전 수정이 첨부 이미지와 다르다고 지적했다. 직전 작업에서는 Figma Make 참고 코드의 활동 카드/계정 정보까지 메인 화면에 확장했으나, 사용자가 원한 것은 첨부 이미지처럼 술BTI 아래를 `3개 통계 카드 + 기타 메뉴`로 정리하는 것이었다.
- 앞으로 사용자가 보내는 Figma Make 코드는 React Native 앱에 그대로 끼워 넣는 코드가 아니라 UI 요소와 구조를 참고하는 자료로만 사용한다. 웹 전용 코드, 현재 앱에 없는 라우트, 현재 요구 범위를 벗어난 섹션은 억지로 이식하지 않는다.
- 이번 정정 작업은 하단바 `[마이]`의 `src/features/mypage/screens/MyPageScreen.tsx`만 수정했다. 프로필 헤더, 양조장 대시보드 바로가기, 술BTI 카드 영역은 계속 건드리지 않았다.
- 술BTI 아래 통계 카드를 첨부 이미지 기준으로 `참여 펀딩`, `내 아카이브`, `나의 활동` 3개 항목만 표시하도록 변경했다. 기존에 추가했던 `찜한 펀딩` 통계는 메인 화면에서 제거했다.
- 첨부 이미지 기준으로 양조장 계정의 표시값은 `참여 펀딩 6`, `내 아카이브 12`, `나의 활동 5`가 보이도록 했다. 일반 계정의 참여 펀딩 수는 기존 `participatedFundings.length`를 유지한다.
- 메인 화면에서 `계정 정보` 섹션과 활동 카드 목록을 제거했다. 이 내용들은 이후 사용자가 요청한 개별 진입 페이지(`[참여 펀딩]`, `[내 아카이브]`, `[나의 활동]`)를 만들 때 별도 화면에서 설계한다.
- `기타` 섹션은 첨부 이미지처럼 `설정`, `공지사항`, `고객센터`, `약관 및 정책`, `로그아웃` 메뉴로 정리했다. `양조장 인증 신청`은 이번 첨부 이미지 범위에 없으므로 메인 기타 목록에서 제거했다.
- `고객센터` 바텀시트는 기존 동작을 유지했고, 이번 정정에서는 불필요하게 추가했던 문의 입력 state/Alert 로직을 제거했다.
- 기존 직전 로그의 “계정 정보/나의 활동 mock 확장” 내용은 현재 코드 기준으로 더 이상 맞지 않는다. 최신 기준은 이번 로그와 현재 `MyPageScreen.tsx` 코드다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/mypage/screens/MyPageScreen.tsx` 통과.

[2026-05-12]: [마이] 참여 펀딩 진입 화면 추가.

[진행 내용]:
- 사용자가 하단바 기준 `[마이]` 영역에서 `참여 펀딩`을 누르면 나오는 화면을 Figma Make 참고 이미지 흐름에 맞춰 새로 구성하길 요청했다.
- 참고 코드는 웹/React Router 기준이므로 그대로 끼워 넣지 않고, 현재 Expo Router/React Native 앱 구조에 맞춰 `src/features/mypage/screens/FundedProjectsScreen.tsx`를 새로 만들었다.
- 새 라우트 `app/mypage/funded.tsx`를 추가하고, `src/features/mypage/screens/MyPageScreen.tsx`의 `참여 펀딩` 통계 카드 이동 경로를 `/funding`에서 `/mypage/funded`로 변경했다.
- 펀딩 목록 데이터는 사용자가 보낸 더미 배열을 쓰지 않고, 현재 `[펀딩]` 탭과 같은 `FundingContext`의 `projects`와 `participatedFundings`를 조합해 표시한다.
- 참여 펀딩 화면에는 상단 뒤로가기/제목, 다크 요약 카드(`나의 펀딩 현황`, 총 참여 프로젝트 수, 총 참여금액, 진행 중, 완료), 참여 펀딩 카드 목록을 구성했다.
- 각 카드에는 기존 펀딩 요소와 동일한 프로젝트 이미지, 양조장명, 주재료 배지, 상태 배지, 제목, 진행률, 남은 일수, 참여자 수를 사용하고, 마이페이지 전용으로 내 참여일과 내 참여금액을 추가했다.
- 하트 버튼은 기존 `FavoritesContext`의 `isFavoriteFunding`, `toggleFavoriteFunding`을 사용해 `[펀딩]` 탭의 관심 펀딩 상태와 이어지게 했다.
- 상태 라벨이 성공/달성 계열인 프로젝트에는 `배송 내역` 버튼을 표시하고, 현재 존재하는 아카이브 리뷰 라우트 `/archive/review/{projectId}`로 연결했다. 추후 별도 배송 상세 API/화면이 생기면 이 버튼의 이동 경로만 교체하면 된다.
- 이번 작업 범위는 `[마이]` 영역의 참여 펀딩 진입 화면과 그 연결부이며, 다른 하단바 탭 화면 자체는 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/mypage/screens/MyPageScreen.tsx src/features/mypage/screens/FundedProjectsScreen.tsx app/mypage/funded.tsx` 통과.

[2026-05-12]: [마이] 참여 펀딩 카드 레이아웃 깨짐 보정.

[진행 내용]:
- 사용자가 `[마이] > 참여 펀딩` 화면에서 카드 우측 금액과 메타 정보가 화면 밖으로 잘리는 문제를 이미지로 전달했다.
- `src/features/mypage/screens/FundedProjectsScreen.tsx`에서 참여 펀딩 카드의 좌우 여백, 카드 패딩, 썸네일 크기, 카드 내부 gap을 펀딩 탭 카드와 비슷한 안정 폭으로 조정했다.
- 양조장명, 주재료 배지, 상태 배지의 최대 폭과 글자 크기를 줄여 좁은 모바일 폭에서도 한 줄 메타 영역이 밖으로 밀리지 않도록 했다.
- 하단 참여 정보 영역의 아이콘/글자 크기를 줄이고, 참여 금액 텍스트에 `numberOfLines={1}`과 최대 폭/우측 정렬을 적용해 금액이 카드 밖으로 잘리지 않게 했다.
- 이번 보정은 `[마이] > 참여 펀딩` 화면의 UI 레이아웃만 수정했으며, 펀딩 탭 원본 카드와 데이터/API 흐름은 변경하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/mypage/screens/FundedProjectsScreen.tsx` 통과.

[2026-05-12]: [마이] 참여 펀딩 배송 내역 주문 상세 화면 추가.

[진행 내용]:
- 사용자가 `[마이] > 참여 펀딩` 카드의 `배송 내역` 버튼을 누르면 나오는 주문 상세 화면 참고 코드와 이미지를 전달했다.
- 참고 코드는 웹/React Router/mock order data 기준이므로 그대로 사용하지 않고, 현재 Expo Router/React Native 구조에 맞춰 `src/features/mypage/screens/FundingOrderDetailScreen.tsx`를 새로 만들었다.
- 새 라우트 `app/funding/order/[id].tsx`를 추가하고, `src/features/mypage/screens/FundedProjectsScreen.tsx`의 `배송 내역` 버튼 이동 경로를 기존 임시 `/archive/review/{projectId}`에서 `/funding/order/{projectId}`로 변경했다.
- 주문 상세 데이터는 현재 백엔드 주문 상세 API와 직접 연결하지 않고, `FundingContext`의 `projects`, `participatedFundings`와 로그인 사용자 정보를 조합해 프론트 파생 더미 주문 데이터로 구성했다.
- 펀딩 프로젝트의 실제 이미지, 양조장명, 제목/shortTitle, 리워드 옵션, 가격/배송비, 참여일, 예상 배송일을 사용하고, 산사 막걸리 프로젝트(id 5)는 참고 이미지에 맞춰 주문번호 `JD-2025-006102`, 토스페이, 배송 예정, 양조장 전화번호, 배송지 더미 정보를 보정했다.
- 주문 상세 화면에는 상단 주문번호 헤더, 배송 상태 배너, 운송장 영역, 배송 타임라인, 주문 상품, 결제 내역, 배송지 정보, 후기 작성 CTA/완료 상태, 펀딩 상세/양조장 문의 버튼, 양조장 연락처와 주문일 정보를 구성했다.
- 양조장 문의는 RN `Modal`과 `TextInput`으로 구성했으며, 현재는 프론트 상태/Alert 기반 접수 처리만 한다. 추후 문의 API가 연결되면 submit 처리만 교체하면 된다.
- 운송장 복사는 별도 클립보드 패키지가 현재 의존성에 없어서 우선 Alert 안내로 처리했다. 실제 복사 기능이 필요하면 `expo-clipboard` 설치 후 `Clipboard.setStringAsync`로 교체한다.
- 이번 작업 범위는 `[마이] > 참여 펀딩 > 배송 내역` 진입 화면과 연결부이며, 펀딩 탭 원본 화면과 백엔드 API 로직은 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/mypage/screens/FundingOrderDetailScreen.tsx src/features/mypage/screens/FundedProjectsScreen.tsx app/funding/order/[id].tsx` 통과.

[2026-05-12]: [마이] 참여 펀딩 배송 내역 1개 제한 및 페이지네이션 추가.

[진행 내용]:
- 사용자가 현재 배송 내역이 필요한 항목은 1개뿐인지 확인했고, 참여 펀딩 목록이 3개를 넘으면 첨부 이미지처럼 페이지로 나뉘어야 한다고 요청했다.
- `src/features/mypage/screens/FundedProjectsScreen.tsx`에서 배송 내역 버튼 노출 대상을 산사 막걸리 프로젝트(id 5) 1개로 제한했다. 따라서 현재 명시 더미 주문 상세도 1개 기준으로 동작한다.
- `src/features/mypage/screens/FundingOrderDetailScreen.tsx`에서도 `ORDER_OVERRIDES`에 등록된 프로젝트만 주문 상세가 열리도록 제한해, 임의 프로젝트에 자동 파생 주문 상세가 열리지 않게 했다.
- 참여 펀딩 목록에 `PAGE_SIZE = 3` 기준 페이지네이션을 추가했다. 3개 초과 시 `이전`, 페이지 번호, `다음` 버튼과 `총 N개 펀딩 · 현재 / 전체 페이지` 문구가 표시된다.
- 페이지네이션 스타일은 사용자가 첨부한 이미지처럼 활성 페이지는 검정 배경, 비활성/이전/다음은 흰색 또는 비활성 회색 버튼으로 구성했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/mypage/screens/FundedProjectsScreen.tsx src/features/mypage/screens/FundingOrderDetailScreen.tsx` 통과.

[2026-05-12]: [마이] 내 아카이브 화면 추가.

[진행 내용]:
- 사용자가 `[마이]`의 `내 아카이브`를 누르면 들어가는 `술 아카이브` 화면을 참고 이미지/코드 기반으로 구성하길 요청했다.
- 참고 코드는 웹/React Router/Figma Make 기준이므로 그대로 사용하지 않고, 현재 Expo Router/React Native 구조에 맞춰 `src/features/mypage/screens/MyArchiveScreen.tsx`를 새로 만들었다.
- 새 라우트 `app/mypage/archive.tsx`를 추가하고, `src/features/mypage/screens/MyPageScreen.tsx`의 `내 아카이브` 통계 카드에 `/mypage/archive` 이동을 연결했다.
- 화면 상단에는 `술 아카이브` 제목과 `+ 새로운 술 작성하기` 버튼을 배치했다. 작성 버튼은 로그인 사용자는 현재 존재하는 후기 작성 라우트 `/archive/review/5`로, 비로그인 사용자는 `/login`으로 이동한다.
- 기존 요구 흐름에 맞춰 예전 `내가 참여했던 펀딩 술/전체 경험한 술` 목록형 탭은 만들지 않고, `전체 / 펀딩 술 / 일반 술` 세그먼트 토글만 구성했다.
- 검색창은 이름, 양조장, 종류, 태그 기준으로 프론트 상태에서 필터링되며, 입력값이 있으면 X 버튼으로 초기화할 수 있다.
- 펀딩 술 데이터는 사용자가 보낸 웹 더미 배열을 그대로 쓰지 않고, 현재 `FundingContext`의 `projects`, `participatedFundings`를 조합해 프로젝트 이미지/이름/양조장/카테고리/참여일을 가져오도록 했다.
- 일반 술 데이터는 현재 화면 구성을 위한 프론트 더미 3개(`안동 증류식 소주`, `꽃향기 주`, `감귤 막걸리`)를 만들고, 로컬 `newpicutre` 이미지를 사용했다.
- 카드 UI는 참고 이미지처럼 좌측 썸네일, 펀딩 술 배지, 날짜, 양조장/카테고리, 술 이름, 별점, 도수/태그/화살표로 구성했다.
- 펀딩 술 카드는 누르면 해당 펀딩 상세 `/funding/{fundingId}`로 이동한다. 일반 술 상세 라우트는 아직 없으므로 현재는 상세 이동을 붙이지 않았다.
- 이번 작업 범위는 `[마이] > 내 아카이브` 진입 화면과 마이페이지 연결부이며, 다른 하단바 탭 원본 화면과 백엔드 API 로직은 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/mypage/screens/MyArchiveScreen.tsx src/features/mypage/screens/MyPageScreen.tsx app/mypage/archive.tsx` 통과.

[2026-05-12]: [마이] 술 아카이브 UI 밀도 및 작성 버튼 위치 보정.

[진행 내용]:
- 사용자가 `[마이] > 내 아카이브` 화면에서 카테고리 토글을 더 명확한 회색 트랙 느낌으로 바꾸고, 목록 카드의 세로 높이를 줄이며, 상단바를 다른 페이지와 통일하고 뒤로가기 요소를 추가하길 요청했다.
- `src/features/mypage/screens/MyArchiveScreen.tsx`에서 헤더를 뒤로가기 버튼 + `술 아카이브` 제목 구조로 변경하고, 기존 상단 `+ 새로운 술 작성하기` 버튼을 제거했다.
- 작성 버튼은 커뮤니티 화면처럼 하단 플로팅 액션 버튼으로 옮겼고, 사용자의 요청에 맞춰 왼쪽 하단 검정 원형 `+` 버튼으로 배치했다.
- `전체 / 펀딩 술 / 일반 술` 토글은 회색/베이지 계열 트랙 위에 놓고, 활성 탭은 검정 배경과 흰 글씨로 처리해 비활성 탭과 차이가 크게 보이도록 했다.
- 아카이브 카드의 세로 밀도를 줄이기 위해 카드 패딩, gap, 썸네일 크기, 날짜/메타/제목/별점/태그 간격과 글자 크기를 전반적으로 낮췄다.
- 이번 변경은 `[마이] > 내 아카이브` 화면의 UI 배치/스타일만 수정했으며, 데이터 구성과 다른 하단바 탭 원본 화면은 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/mypage/screens/MyArchiveScreen.tsx` 통과.

[2026-05-12]: [마이] 술 아카이브 추가 플로우 및 상세 뒤로가기 보정.

[진행 내용]:
- 사용자가 `[마이] > 술 아카이브`에서 펀딩 술 상세로 들어간 뒤 뒤로가기를 누르면 항상 펀딩 탭으로 가던 문제를 수정했다. `src/features/funding/screens/FundingDetailScreen.tsx`의 상단 뒤로가기는 고정 `router.replace('/funding')`가 아니라 실제 이전 화면으로 돌아가도록 `router.back()`을 사용한다.
- `src/features/mypage/screens/MyArchiveScreen.tsx`의 아카이브 작성 FAB는 오른쪽 하단 검정 원형 `+` 버튼으로 유지하고, 버튼 클릭 시 기존 후기 작성 화면으로 바로 가지 않고 `/mypage/archive/add` 플로우로 이동한다.
- `app/mypage/archive/add.tsx` 라우트와 `src/features/mypage/screens/AddArchiveFlowScreen.tsx`를 추가했다. 첫 화면은 `펀딩 참여 술`과 `일반 술` 선택 카드로 구성했고, 펀딩 참여 술을 선택하면 펀딩 프로젝트 선택 단계로 넘어간다.
- 펀딩 프로젝트 선택 단계는 현재 배송/후기 작성 대상인 완료 펀딩 1개(id 5)를 `FundingContext`의 실제 펀딩 프로젝트 데이터와 기존 펀딩 이미지/상태/진행률 UI 요소로 보여준다. 선택 시 `/archive/review/{projectId}?archiveMode=funding`으로 이동한다.
- 일반 술 선택 시 `/archive/review/5?archiveMode=normal`로 이동한다. 현재는 별도 일반 술 작성 전용 API/화면이 없으므로 펀딩 후기 작성 UI를 재사용하되, 화면 헤더와 상단 요약 문구를 일반 술 기록에 맞게 표시한다.
- `src/features/funding/screens/FundingReviewWriteScreen.tsx`에 `archiveMode` 진입 옵션을 추가했다. 아카이브 작성 플로우에서 들어온 경우 펀딩 참여 여부/펀딩 종료 상태 API 권한 체크를 우회하고, 상단 제목을 `나의 술 기록 작성`으로 표시하며 저장 후 `/mypage/archive`로 돌아간다. 일반 펀딩 후기 작성/수정 플로우는 기존 제목, API 호출, 저장 후 후기 상세 이동 흐름을 유지한다.
- 이번 변경 범위는 `[마이] > 술 아카이브` 작성 흐름과 그 흐름에서 재사용되는 펀딩 후기 작성 화면의 아카이브 모드, 그리고 아카이브에서 들어간 펀딩 상세의 뒤로가기 동작으로 제한했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/mypage/screens/AddArchiveFlowScreen.tsx src/features/mypage/screens/MyArchiveScreen.tsx src/features/funding/screens/FundingDetailScreen.tsx src/features/funding/screens/FundingReviewWriteScreen.tsx app/mypage/archive/add.tsx` 통과.

[2026-05-13]: [마이] 일반 술 기록 작성 화면의 술 이름 입력 및 아이콘 보정.

[진행 내용]:
- 작업 전 `judam.md`를 확인했고, 이번 수정 범위는 `[마이] > 술 아카이브 > + 추가 > 일반 술 > 나의 술 기록 작성` 화면의 일반 술 모드로만 제한했다.
- `src/features/funding/screens/FundingReviewWriteScreen.tsx`에서 `archiveMode=normal`일 때만 사진 첨부 카드 위에 `술 이름 *` 입력 칸을 추가했다. 펀딩 술 후기 작성/수정 모드에는 해당 입력 칸이 보이지 않는다.
- 일반 술 모드 저장 시 술 이름이 비어 있으면 `술 이름 입력` 알림을 보여주고 저장하지 않도록 했다.
- 일반 술 모드에서는 상단 요약 카드의 기존 펀딩 프로젝트 이미지를 사용하지 않고, 일기장이 펼쳐진 느낌의 `📖` 이모티콘 박스로 표시하도록 변경했다. 펀딩 술 모드의 프로젝트 이미지 표시는 기존 그대로 유지한다.
- 일반 술 모드에서 저장되는 기록의 `rewardName`에는 입력한 술 이름을 넣도록 했다. 기존 펀딩 후기 저장 흐름은 변경하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-13]: [마이] 일반 술 기록 작성 화면 아이콘 보정.

[진행 내용]:
- 작업 전 `judam.md`를 확인했고, 직전 오해로 수정했던 `src/features/brewery/screens/BreweryDashboardScreen.tsx` 변경은 원래대로 되돌렸다.
- 직전 오해로 추가했던 양조장 대시보드 하단 알림 아이콘 통일 관련 `judam.md` 기록도 삭제했다.
- 실제 요청 범위인 `[마이] > 술 아카이브 > + 추가 > 일반 술 > 나의 술 기록 작성` 화면만 수정했다.
- `src/features/funding/screens/FundingReviewWriteScreen.tsx`에서 일반 술 모드 상단 카드의 기존 이미지/이모티콘 자리를 검정 원형 배경 안 흰색 `BookOpen` 아이콘으로 교체했다.

[2026-05-13]: [마이] 나의 활동 진입 화면 추가.

[진행 내용]:
- 작업 전 `judam.md`를 확인했고, 요청 범위를 하단바 기준 `[마이]`의 `나의 활동` 진입 화면으로 제한했다.
- `src/features/mypage/screens/MyActivityScreen.tsx`를 새로 추가해 `레시피`, `커뮤니티`, `펀딩` 3개 섹션을 아코디언 카드로 구성했다.
- 각 섹션 아이콘은 요청대로 색상 배경이 아닌 검정색 동그라미 배경 안의 흰색 lucide 아이콘으로 통일했다.
- 한 섹션을 열면 다른 섹션은 닫히도록 `expandedSection` 단일 상태로 관리했다.
- 섹션 내부에는 레시피/커뮤니티/펀딩별 하위 탭을 구성했고, 현재 프로젝트에 있는 `recipesData`, `CommunityContext`, `FundingContext`, `FavoritesContext` 기반으로 가능한 카운트와 일부 목록을 표시했다. 아직 별도 API/스토어가 없는 작성 댓글, Q&A 계열은 빈 상태 UI로 둔다.
- `app/mypage/activity.tsx` 라우트를 추가하고, `src/features/mypage/screens/MyPageScreen.tsx`의 `나의 활동` 통계 카드에 해당 라우트 이동만 연결했다. 마이 메인 상단, BTI, 양조장 대시보드, 다른 하단바 페이지는 수정하지 않았다.
- `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `git diff --check -- src/features/mypage/screens/MyActivityScreen.tsx app/mypage/activity.tsx src/features/mypage/screens/MyPageScreen.tsx` 검증을 통과했다.

[2026-05-13]: [주담] 레시피 제안하기 AI 추천 API 3종 연결.

[진행 내용]:
- 작업 시작 전 `judam.md`와 API 작업 기준에 따라 `api.md`를 확인했다.
- 사용자가 전달한 레시피 제안하기용 API 3종을 `api.md`에 정리했다: `POST /api/recipe/suggest-sub-ingredients`, `POST /api/recipe/suggest-flavor-tags`, `POST /api/recipe/suggest-summary`.
- `src/features/recipe/api.ts`에 `suggestRecipeSubIngredients`, `suggestRecipeFlavorTags`, `suggestRecipeSummary` 클라이언트 함수를 추가했다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`의 기존 서브 재료/맛 태그/프로젝트 요약 `AI 생성` 버튼을 프론트 mock 값 대신 새 API 호출로 연결했다.
- 서브 재료 추천은 현재 메인 재료 입력값을 join해 `main_ingredient`로 보내고, 메인 재료 문자열 안의 국내 지역명을 찾아 `region`으로 보낸다. 지역명이 없으면 빈 문자열을 보낸다.
- 맛 태그 추천은 현재 제목, 메인 재료, 선택된 서브 재료, 도수 범위를 보낸다.
- 요약문 추천은 현재 제목, 메인 재료, 선택된 서브 재료, 도수 범위, 선택/직접 입력 맛 태그, 프로젝트 컨셉을 보내며 컨셉이 비어 있으면 `null`로 보낸다.
- 새 API 호출 실패 시 기존 알림 모달로 서버 메시지 또는 fallback 문구를 보여준다.
- 서버 과금 방지를 위해 실제 API 수동 호출 검증은 하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-13]: [주담] 레시피 제안하기 서브재료 AI 생성 API 임시 해제.

[진행 내용]:
- 작업 시작 전 `judam.md`와 API 작업 기준에 따라 `api.md`를 확인했다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`에서 서브재료 `AI 생성` 버튼만 `suggestRecipeSubIngredients` 호출을 중단하고 임시 로컬 추천값(`누룩`, `물`, `유자`, `생강`, `꿀`)을 표시하도록 되돌렸다.
- `src/features/recipe/api.ts`의 `suggestRecipeSubIngredients` API 클라이언트와 `api.md` 엔드포인트 메모는 삭제하지 않았다. 추후 사용자가 요청하면 화면 버튼 핸들러만 다시 API 호출 방식으로 복구하면 된다.
- 맛 태그 추천과 요약문 추천 API 연결은 그대로 유지했다.

[2026-05-14]: [주담] 레시피 제안 작성 API sub_ingredient 및 서브 재료 AI 생성 재연결.

[진행 내용]:
- 작업 시작 전 `judam.md`와 `api.md`를 확인하고, 사용자가 전달한 최신 레시피 작성 API 변경 사항을 현재 코드와 대조했다.
- `src/features/recipe/api.ts`의 `CreateRecipePayload`에 선택 필드 `sub_ingredient`를 추가하고, `createRecipe`가 `POST /api/recipes` multipart `FormData`에 선택한 서브 재료를 쉼표 구분 문자열로 append하도록 수정했다.
- `createRecipe`는 계속 `requestFormJson`을 사용하며, multipart boundary가 자동 설정되도록 `Content-Type`을 직접 지정하지 않는다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`의 서브 재료 `AI 생성` 버튼을 임시 로컬 추천값에서 `suggestRecipeSubIngredients` API 호출로 복구했다.
- 서브 재료 추천 요청은 메인 재료 배열을 join한 값을 `main_ingredient`로 보내고, 메인 재료 텍스트 안의 국내 지역명을 찾아 `region`으로 보낸다. 지역명을 찾지 못하면 빈 문자열을 보낸다.
- 레시피 등록 실패 시 서버가 내려주는 AI 법률 필터링 실패 `message`를 기존 알림 모달에 그대로 표시하는 흐름을 유지했다.
- 검증 결과 `npx.cmd tsc --noEmit` 통과. PowerShell 실행 정책 때문에 `npx tsc --noEmit`은 `npx.ps1` 실행 차단으로 실패하여 `npx.cmd`로 재실행했다.

[2026-05-14]: [주담] 레시피 제안 작성 서브 재료 AI 생성 임시 분리 복구.

[진행 내용]:
- 사용자가 서브 재료 추천 API가 아직 시연 가능한 상태가 아니라서 의도적으로 끊어둔 것이라고 알려주었다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`에서 서브 재료 `AI 생성` 버튼만 다시 로컬 임시 추천값 `누룩`, `물`, `유자`, `생강`, `꿀`을 보여주도록 되돌렸다.
- `src/features/recipe/api.ts`의 `suggestRecipeSubIngredients` 클라이언트 함수와 `POST /api/recipes`의 `sub_ingredient` FormData 전송은 유지했다. 즉, 추천은 임시 로컬이지만 사용자가 선택한 서브 재료는 레시피 작성 API에 계속 포함된다.

[2026-05-14]: [주담] 레시피 제안 작성 제출 전 필수값 검증 보강.

[진행 내용]:
- 사용자가 레시피 제안 제출 시 `서버 내부 오류`가 발생한다고 알려주었다.
- 현재 화면은 제목과 메인 재료만 검사하고 있었지만, 최신 `POST /api/recipes` 명세는 `abv_range`, `target_flavor`, `concept`, `summary`, `content`도 필수다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`의 `handleSubmit`에 도수 범위, 지향하는 맛, 프로젝트 컨셉, 프로젝트 요약 누락 검증을 추가해 빈 필수값이 서버로 전송되지 않도록 했다.
- 빈 필수값이 서버로 넘어가면 백엔드가 400 대신 500을 반환할 수 있으므로, 시연 중에는 프론트 모달에서 먼저 안내한다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-14]: [주담] 레시피 제안 작성 500 원인 추가 확인 - 임시 JWT 만료.

[진행 내용]:
- 사용자가 모든 필수값을 채운 캡쳐에서도 `서버 내부 오류`가 난다고 알려주었다.
- 현재 `AuthContext`의 일반 사용자 임시 JWT를 디코딩해 확인한 결과 `2026-05-14 02:17:46 KST`에 만료된 상태였다. 현재 시점에는 만료 토큰으로 `POST /api/recipes`를 호출하고 있었고, 백엔드가 이를 401 대신 500으로 반환하는 것으로 보인다.
- `src/features/recipe/api.ts`에 JWT `exp` 만료 여부를 확인하는 `isJwtExpired` helper를 추가했다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`에서 레시피 작성 제출 전에 저장된 토큰이 만료됐으면 API 호출을 막고 `로그인 시간이 만료되었습니다.` 모달을 보여주도록 했다.
- 실제 시연을 계속하려면 백엔드에서 새 일반 사용자 테스트 토큰을 받아 `AuthContext`의 `TEMP_USER_ACCESS_TOKEN`을 교체하거나, 실제 로그인 API 토큰 저장 흐름을 연결해야 한다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-14]: [인증] 양조장 임시 토큰 교체.

[진행 내용]:
- 사용자가 새 양조장 리프레시 토큰을 전달해 `src/contexts/AuthContext.tsx`의 `TEMP_BREWERY_ACCESS_TOKEN` 위치에 교체했다.
- 새 토큰 만료 시각은 `2026-05-22 14:15:13 KST`다.
- 토큰 payload는 `userId: "1"`만 포함하고 `role` claim은 없다. 백엔드가 레시피 작성의 `author_type`을 JWT `role`에서 추출한다고 되어 있으므로, 이 토큰으로도 레시피 작성이 실패하면 `role: "BREWERY"`가 포함된 access token을 받아야 한다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-14]: [인증] role 포함 양조장 access token 교체.

[진행 내용]:
- 사용자가 새 양조장 접근 토큰을 전달했다.
- 토큰 payload를 확인한 결과 `userId: "1"`, `provider: "kakao"`, `role: "BREWERY"`가 포함되어 있고, 만료 시각은 `2026-05-21 12:58:19 KST`다.
- `src/contexts/AuthContext.tsx`의 `TEMP_BREWERY_ACCESS_TOKEN`을 해당 access token으로 교체했다.
- 양조장 로그인 유지 상태라면 앱 시작 시 저장된 `judam_access_token`이 새 토큰으로 갱신된다. 확실한 테스트는 로그아웃 후 `brewery@judam.test / judam123` 재로그인으로 진행한다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-14]: [주담] 레시피 작성 API 직접 성공 확인 및 이미지 제거 상태 보강.

[진행 내용]:
- 새 양조장 access token으로 서버에 직접 요청해 `POST /api/recipes` multipart 이미지 없음, `POST /api/recipes/brewery` JSON 이미지 없음 모두 `201` 성공을 확인했다.
- 따라서 앱에서 계속 `서버 내부 오류` 또는 `Network request failed`가 나면 토큰/기본 필드보다 이미지 파일 업로드나 앱 내부 image asset 상태가 주요 의심 지점이다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`에서 이미지 preview의 X 버튼이 `imagePreview`만 지우고 실제 업로드 대상인 `imageAsset`은 남겨두던 문제를 수정했다. 이제 X 버튼은 preview와 imageAsset을 모두 제거한다.
- 레시피 제출 직전 `Recipe create request` 로그를 추가해 제목, 도수, 재료, 맛 태그, 이미지 asset 포함 여부, 이미지 이름/type/uri를 Metro 콘솔에서 확인할 수 있게 했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-14]: [주담] 레시피 이미지 첨부 시 백엔드 500 직접 확인.

[진행 내용]:
- 사용자가 이미지 없이 레시피 등록은 되지만 이미지가 있을 때 등록이 안 된다고 알려주었다.
- 새 양조장 access token으로 `POST /api/recipes`에 작은 1x1 PNG를 multipart `image` 필드로 직접 첨부해 호출했다.
- 같은 필드/토큰에서 이미지가 없으면 `201`이지만, 이미지가 있으면 서버가 `500 서버 내부 오류`를 반환했다.
- 따라서 현재 실패 원인은 프론트 필수값이나 토큰이 아니라 백엔드의 multipart 파일 처리, S3 업로드, 또는 이미지 처리 파이프라인으로 판단한다.
- 백엔드 로그에서 `req.file`, 파일 mimetype/size/originalname, S3 upload start/success/fail, 업로드 예외 stack trace를 확인해야 한다.

[2026-05-26]: [주담] 사용자 제공 레시피 작성 문서 기준 API 상태 재확인.

[진행 내용]:
- 작업 시작 전 `judam.md`와 `api.md`를 확인했다.
- 사용자가 제공한 `C:\Users\USER\Desktop\레시피 작성.md`를 확인했다. 핵심 내용은 양조장 레시피 등록 화면도 기존 `POST /api/recipes/brewery` JSON `image_url` 방식이 아니라 일반 소비자 레시피 작성과 같은 `POST /api/recipes` multipart `image` 파일 방식으로 호출해야 한다는 것이다.
- 현재 활성 `[주담]` 레시피 작성 코드 경로는 이미 `src/features/recipe/api.ts`의 `createRecipe`가 `FormData`를 만들고 `/api/recipes`로 전송하며, `RecipeCreateScreen`이 USER/BREWERY 로그인 상태 모두 이 함수를 사용한다.
- 별도 `createBreweryRecipe` 작성 함수나 활성 `/api/recipes/brewery` 작성 호출은 현재 레시피 작성 화면 코드에 남아 있지 않음을 확인했다. `/api/recipes/brewery`는 양조장 소비자 레시피 확인 목록 조회 `GET`에서만 사용된다.
- `api.md`의 Brewery Recipe Create 섹션에 2026-05-26 업데이트를 추가해 `/api/recipes/brewery` JSON 작성 API가 현재 프론트 작성 화면에서는 reference-only이며, 활성 작성 경로는 `/api/recipes` multipart라고 명시했다.
- 별도 코드 변경은 필요하지 않았고, 문서 정리만 수행했다.

[2026-05-14]: [주담] 레시피 작성 토큰 role 누락 사전 차단.

[진행 내용]:
- 사용자가 양조장 계정 로그인 상태에서도 레시피 작성이 계속 `서버 내부 오류`를 낸다고 알려주었다.
- `api.md`를 다시 확인한 결과 `POST /api/recipes`는 `author_type`을 JWT `role`에서 자동 추출한다. 사용자가 전달한 토큰은 리프레시 토큰 형태로 `userId`만 있고 `role`이 없어 백엔드가 작성자 타입을 만들지 못하는 상태로 보인다.
- `src/features/recipe/api.ts`에 `decodeRecipeJwtPayload` helper를 추가해 저장된 JWT payload를 읽을 수 있게 했다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`에서 제출 전 JWT에 `role`이 없으면 API 호출을 막고 `레시피 작성용 토큰이 필요합니다.` 안내 모달을 보여주도록 했다.
- 레시피 작성 시연을 계속하려면 리프레시 토큰이 아니라 `role: "BREWERY"` 또는 `role: "USER"`가 포함된 access token이 필요하다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-14]: [주담] 레시피 AI 추천 API 응답 파싱 보강.

[진행 내용]:
- 사용자가 AI 서버의 레시피 제안 API 구성 캡쳐를 공유했다.
- 캡쳐상 실제 응답은 기존 `api.md`에 정리된 `data.flavor_tags`, `data.summary` 래퍼 구조가 아니라 `{ "flavor_tags": [...] }`, `{ "summary": "..." }`처럼 최상위 필드로 내려온다.
- `src/features/recipe/api.ts`의 `suggestRecipeSubIngredients`, `suggestRecipeFlavorTags`, `suggestRecipeSummary` 파서를 보강해 기존 래퍼형 응답과 캡쳐의 최상위 필드 응답을 모두 지원하도록 했다.
- 서브 재료 버튼은 현재 시연 안정성을 위해 로컬 임시 추천값을 유지하지만, API 클라이언트 함수는 나중에 재연결할 때 바로 사용할 수 있다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-14]: [주담] 지향하는 맛 AI 생성 빈 응답 로그 처리.

[진행 내용]:
- 사용자가 레시피 제안 화면에서 `지향하는 맛`의 `AI 생성` 버튼을 눌러도 화면 변화가 없다고 알려주었다.
- 현재 화면 입력값과 같은 형태로 `POST /api/recipe/suggest-flavor-tags`를 직접 호출해 확인한 결과 서버는 `200`을 반환하지만 `flavor_tags`가 빈 배열이었다.
- 빈 배열이면 프론트가 오류 없이 빈 추천 목록을 렌더링하므로 사용자는 버튼이 작동하지 않는 것처럼 보였다.
- 처음에는 빈 배열일 때 시연용 맛 태그 fallback을 추가했지만, 사용자가 임시값은 서브 재료에만 있어야 한다고 정정했다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`에서 맛 태그 임시 fallback을 제거하고, AI 서버가 빈 배열을 반환하면 화면에는 아무 태그도 추가하지 않고 `Recipe flavor tag AI returned an empty array.` 콘솔 경고만 남기도록 했다.
- 서버가 실제 추천 태그를 반환하면 기존처럼 서버 응답을 사용한다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-14]: [주담] 레시피 AI 추천 API 도수 형식 변환.

[진행 내용]:
- 사용자가 백엔드에서 받은 AI 추천 API 최신 명세를 공유했다.
- AI 추천 API 예시는 `abv_range`를 `5~7도` 형식으로 받고, 현재 레시피 작성 화면은 작성 API 명세에 맞춰 `3%~5%`, `6%~8%` 형식으로 선택값을 가진다.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`에 AI 추천 호출 전용 `getAiAbvRangeText` helper를 추가했다.
- 맛 태그/요약 AI 추천 호출에서는 `3%~5%`를 `3~5도`, `15% 이상`을 `15도 이상`으로 변환해 보낸다.
- 최종 `POST /api/recipes` 작성 요청은 기존처럼 화면 선택값의 `%` 형식을 그대로 보낸다.
- 서브 재료는 사용자 요청대로 여전히 로컬 임시 추천값만 표시한다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-18]: [마이] 술 아카이브 기록 작성 필수값 및 후기 불러오기 버튼 보강.

[진행 내용]:
- 작업 전 `judam.md`를 확인했고, 이번 수정 범위는 `[마이] > 내 아카이브 > 새로운 술 기록 > 주담에서 펀딩한 술/그 외 전통주 > 나의 술 기록 작성`으로 제한했다.
- `src/features/funding/screens/FundingReviewWriteScreen.tsx`에서 `archiveMode`로 마이페이지 아카이브 작성 플로우에서 들어온 경우에만 `그날의 기록` 제목을 필수 표시로 바꾸고, 기분과 함께한 안주가 모두 비어 있지 않아야 저장되도록 검증을 추가했다.
- 일반 펀딩 후기 작성 화면은 기존처럼 `그날의 기록 (선택)` 문구와 선택 입력 흐름을 유지한다.
- `archiveMode=funding`일 때만 상단 펀딩 프로젝트 카드 오른쪽 상단에 아이콘 없는 `불러오기` 버튼을 추가했다. 사진 첨부 영역은 기존 구성을 유지한다. 버튼을 누르면 같은 펀딩에 사용자가 이미 작성한 후기가 있을 때 별점, 사진, 상세 후기, 그날의 기록, 태그를 현재 기록 작성 폼에 채우고, 없으면 안내 모달을 보여준다.
- 실제 서버 API나 다른 하단바 탭 화면은 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-18]: [마이] 프로필 화면 UI 크기 보정.

[진행 내용]:
- 작업 전 `judam.md`와 `src/features/mypage/screens/ProfileScreen.tsx`, `MyPageScreen.tsx`, `MySettingsScreen.tsx`를 확인했다.
- `src/features/mypage/screens/ProfileScreen.tsx`에서 프로필 이미지 카드, 아바타, 카메라 버튼, 정보 행 높이, 아이콘 박스, 라벨/값 글씨 크기를 줄여 마이페이지 메뉴 카드와 비슷한 밀도로 조정했다.
- 헤더 제목과 뒤로가기 아이콘도 프로필 화면에서 과하게 커 보이지 않도록 낮췄다.
- 프로필 수정 기능, 이미지 선택 기능, 비밀번호 변경 라우팅, AuthContext 저장 흐름은 변경하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-18]: [마이] 참여 펀딩 화면 UI 밀도 보정.

[진행 내용]:
- 작업 전 `judam.md`, `src/features/mypage/screens/FundedProjectsScreen.tsx`, `src/features/mypage/screens/MyArchiveScreen.tsx`를 확인했다.
- `참여 펀딩` 화면의 상단 요약 카드, 통계 영역, 참여 펀딩 리스트 카드가 `내 아카이브` 목록에 비해 크게 보이던 부분을 조정했다.
- `src/features/mypage/screens/FundedProjectsScreen.tsx`에서 요약 카드 padding/아이콘/제목/통계 글씨 크기를 줄이고, 리스트 카드의 썸네일, 하트 버튼, 배지, 제목, 진행률 숫자, 내 참여 정보, 배송 내역 버튼, 페이지네이션 버튼 크기를 전반적으로 낮췄다.
- 참여 펀딩 데이터 계산, 찜 토글, 펀딩 상세 이동, 배송 내역 이동, 페이지네이션 동작은 변경하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-18]: [주담] 레시피 목록 7개 단위 페이지네이션 적용.

[진행 내용]:
- 작업 전 `judam.md`, `src/features/recipe/screens/RecipeListScreen.tsx`, `src/features/recipe/api.ts`를 확인했다.
- 레시피 목록 API client `fetchRecipes`가 이미 `page`, `size` 파라미터를 지원하므로, `RecipeListScreen`에서 한 번에 전체를 불러오는 대신 `size=7` 기준으로 현재 페이지 레시피만 요청하도록 변경했다.
- 주담 목록 하단에 `이전`, 페이지 번호, `다음` 페이지네이션 UI와 총 레시피 수/현재 페이지 안내를 추가했다.
- 인기순/최신순 정렬을 바꾸면 1페이지부터 다시 조회하도록 했다. `내 추천순`은 기존처럼 준비 중 안내를 유지한다.
- 레시피 카드, 관심 등록/해제, 댓글 진입, 레시피 제안하기, API client 함수 자체는 변경하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.
[2026-05-20]: [마이] 프로필 조회/닉네임/전화번호 API 연결.

[진행 내용]:
- 작업 시작 전 `judam.md`와 `api.md`를 확인하고, 사용자가 전달한 마이페이지 프로필 API 명세를 `api.md`의 `My Page Profile APIs` 섹션에 정리했다.
- `src/features/mypage/api.ts`를 추가해 `GET /api/mypage/profile`, `GET /api/mypage/profile/nickname/check`, `PATCH /api/mypage/profile/nickname`, `PATCH /api/mypage/profile/phone`을 `Authorization: Bearer {accessToken}` 방식으로 호출하도록 했다.
- `src/features/mypage/screens/MyPageScreen.tsx`는 하단바 `[마이]` 진입 시 프로필 조회를 호출해 AuthContext의 사용자 정보를 서버 프로필 값으로 동기화한다.
- `src/features/mypage/screens/ProfileScreen.tsx`는 프로필 조회, 닉네임 중복 확인 후 수정, 전화번호 숫자 정규화 후 수정 흐름을 실제 API에 연결했다.
- 이메일 수정 API와 프로필 이미지 업로드 API는 명세가 없어 이메일은 읽기 전용, 프로필 이미지는 기존 로컬 변경 방식으로 유지했다.

[2026-05-20]: [마이] 비회원 마이페이지 및 프로필 인증 UI 보강.

[진행 내용]:
- 수정 범위를 마이페이지 관련 화면으로만 제한했다.
- `src/features/mypage/screens/MyPageScreen.tsx`의 비회원 상태에서 기존 메뉴/통계 노출보다 먼저 로그인 요청 카드가 표시되도록 했다.
- `src/features/mypage/screens/ProfileScreen.tsx`는 회원가입 화면의 입력 패턴을 참고해 닉네임 중복확인 버튼, 전화번호 인증 버튼, 이메일 인증 버튼이 있는 하단 시트 UI로 정리했다.
- 닉네임은 중복확인 성공 후에만 저장 API를 호출하고, 전화번호는 인증 완료 후 숫자만 추출해 저장 API를 호출한다.
- 이메일 인증 UI는 구현했지만 이메일 수정/인증 API가 아직 없어 서버 저장은 막고 안내만 표시한다.
- 프로필 이미지 역시 서버 업로드 API가 없어 로컬 이미지 변경 안내만 유지했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-21]: [인증] 양조장 임시 access token 교체.

[진행 내용]:
- 사용자가 전달한 새 양조장 접근 토큰으로 `src/contexts/AuthContext.tsx`의 `TEMP_BREWERY_ACCESS_TOKEN`을 교체했다.
- 새 토큰 payload는 `userId: "1"`, `provider: "kakao"`, `role: "BREWERY"`를 포함한다.
- 새 토큰 만료 시각은 `2026-05-28 22:26:01 KST`다.
- 검증 결과 `npx.cmd tsc --noEmit` 통과.
[2026-05-21]: [마이] 내 아카이브 그 외 전통주 기록 진입 오류 수정.

[진행 내용]:
- 작업 시작 전 `judam.md`를 확인했고, 수정 범위를 마이페이지의 내 아카이브 진입 흐름과 해당 아카이브 작성 화면으로 제한했다.
- 원인은 `src/features/mypage/screens/AddArchiveFlowScreen.tsx`에서 그 외 전통주 기록도 임시 펀딩 프로젝트 id `5`로 `/archive/review/5?archiveMode=normal`에 진입시키는데, 현재 `FundingContext`의 프로젝트 목록은 API/컨텍스트 기준으로 비어 있거나 id 5가 없을 수 있어 `src/features/funding/screens/FundingReviewWriteScreen.tsx`가 normal 모드 폼 렌더링 전에 "프로젝트를 찾을 수 없습니다" 화면을 반환하던 흐름이었다.
- `AddArchiveFlowScreen`의 그 외 전통주 진입 id를 일반 기록 전용 `0`으로 분리해 실제 펀딩 프로젝트처럼 보이지 않게 정리했다.
- `FundingReviewWriteScreen`에서 `archiveMode=normal`일 때는 실제 펀딩 프로젝트가 없어도 일반 전통주 기록 폼이 열리도록 normal 아카이브용 fallback 프로젝트를 적용했다.
- 펀딩 후기/펀딩 아카이브 작성은 기존처럼 실제 프로젝트가 없으면 프로젝트 없음 안내를 유지한다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-21]: [마이] 내 아카이브 작성 화면을 펀딩 후기 작성 화면과 분리.

[진행 내용]:
- 사용자가 일반 술 기록이 펀딩과 완전히 별개여야 한다고 명확히 요청하여, 직전 작업의 `FundingReviewWriteScreen` normal fallback 수정은 제거하고 펀딩 후기 작성 화면을 원래 흐름으로 복구했다.
- `app/mypage/archive/write.tsx` 라우트를 새로 추가하고, `src/features/mypage/screens/ArchiveWriteScreen.tsx`를 추가해 내 아카이브 전용 작성 코드를 분리했다.
- `src/features/mypage/screens/AddArchiveFlowScreen.tsx`에서 일반 술은 `/mypage/archive/write?type=normal`, 펀딩 술은 `/mypage/archive/write?type=funding&fundingId={id}`로 이동하도록 바꿨다.
- 새 아카이브 작성 화면은 일반 술 기록과 펀딩 술 기록을 자체적으로 구분하며, 펀딩 술 기록일 때만 선택한 펀딩 프로젝트 요약과 `후기 불러오기` 버튼을 보여준다.
- `후기 불러오기`는 기존 펀딩 후기 데이터를 읽어 현재 아카이브 작성 폼에 채우는 방식이라, 펀딩 후기 작성 코드와 UI는 분리하면서도 기존 후기를 참고할 수 있다.
- `src/features/mypage/screens/MyArchiveScreen.tsx`에서 저장된 아카이브 기록이 목록에 함께 보이도록 연결했다.
- 현재 저장소에는 별도 아카이브 전용 Context/API가 아직 없어서 저장 데이터는 기존 로컬 `FundingContext`의 review 저장 함수를 임시로 공유하지만, 작성 화면/라우트/UI 코드는 펀딩 후기와 분리했다. 추후 아카이브 API가 생기면 `ArchiveWriteScreen`의 저장 함수만 교체하면 된다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-21]: [마이] 내 아카이브 펀딩 프로젝트 선택용 임시 더미 옵션 추가.

[진행 내용]:
- 사용자가 현재 펀딩 목록을 가져오지 못하는 상황에서 아카이브 작성의 `펀딩 프로젝트` 선택에 임시 더미데이터 1개를 넣어달라고 요청했다.
- 펀딩 목록/API/후기 작성 코드는 수정하지 않고, `src/features/mypage/screens/AddArchiveFlowScreen.tsx` 내부에서 선택 가능한 펀딩 옵션이 없을 때만 `아카이브 테스트 펀딩 전통주` 더미 프로젝트가 보이도록 했다.
- `src/features/mypage/screens/ArchiveWriteScreen.tsx`도 같은 더미 id를 인식하게 해, 더미 프로젝트 선택 후 펀딩 술 아카이브 작성 화면으로 정상 진입하도록 했다.
- 더미 프로젝트는 마이페이지 아카이브 작성 플로우 안에서만 사용하는 화면용 fallback이며, 실제 펀딩 목록/상세/후기 API 동작에는 연결하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-21]: [마이] 내 아카이브 작성 태그 섹션 토글 복원.

[진행 내용]:
- 사용자가 기존 펀딩 후기 작성 화면의 태그 영역처럼 카테고리별 토글이 필요하다고 알려줬다.
- 펀딩 후기 작성 파일은 수정하지 않고, `src/features/mypage/screens/ArchiveWriteScreen.tsx`의 태그 UI만 기존 후기 작성 패턴처럼 섹션별 접힘/펼침 구조로 변경했다.
- 태그 카테고리별 선택 개수 배지와 위/아래 화살표 아이콘을 추가했고, 펀딩 후기 불러오기 시 선택된 태그가 있는 첫 섹션이 자동으로 열리도록 했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-21]: [마이] 내 아카이브 전용 상세 페이지 추가.

[진행 내용]:
- 사용자가 내 술 아카이브 목록 클릭 시 펀딩 후기 상세 페이지 코드를 직접 쓰지 말고, 작성 화면처럼 UI 구조만 참고한 아카이브 전용 상세 코드를 만들자고 요청했다.
- 펀딩 후기 상세 화면 파일은 수정하지 않고, `app/mypage/archive/detail/[archiveId].tsx` 라우트와 `src/features/mypage/screens/ArchiveDetailScreen.tsx`를 새로 추가했다.
- `src/features/mypage/screens/MyArchiveScreen.tsx`에서 목록 카드를 누르면 펀딩 상세가 아니라 `/mypage/archive/detail/{id}`로 이동하도록 변경했다.
- 새 상세 화면은 펀딩 후기 상세의 헤더/별점/태그/그날의 기록/이미지/좋아요/댓글 UI 흐름을 참고하되, 아카이브 전용 데이터로 렌더링한다.
- 저장된 아카이브 기록은 기존 로컬 review 저장 데이터에서 읽고, 기존 샘플 일반 술 기록도 상세 화면에서 볼 수 있도록 임시 샘플 상세 데이터를 함께 구성했다.
- 펀딩 관련 상세/후기 작성/펀딩 목록 코드는 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-21]: [마이] 내 아카이브 목록 카드 메타 정보 제거.

[진행 내용]:
- 사용자가 내 술 아카이브 목록 카드에서 술 이름 위쪽에 보이는 양조장명과 소주/막걸리 같은 주류 정보를 제거해달라고 요청했다.
- 수정 범위는 `src/features/mypage/screens/MyArchiveScreen.tsx` 목록 카드 UI로만 제한했다.
- `ArchiveDrinkCard`에서 양조장 텍스트와 카테고리 배지 렌더링을 제거하고, 더 이상 쓰지 않는 관련 스타일을 삭제했다.
- 상세 페이지, 작성 페이지, 펀딩 관련 화면 코드는 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-21]: [마이] 내 아카이브 작성 날짜/일반 술 도수 입력 배치.

[진행 내용]:
- 사용자가 펀딩 술/일반 술 공통으로 기록 날짜 입력칸을 사진 첨부 위쪽에 두고, 날짜 기본값은 기록하는 당일 날짜로 넣어달라고 요청했다.
- `src/features/mypage/screens/ArchiveWriteScreen.tsx`에 `recordDate` 상태를 추가하고 기본값을 오늘 날짜(`YYYY. MM. DD`)로 설정했다.
- 기록 날짜 입력 섹션을 사진 첨부 섹션 바로 위에 배치했다.
- 일반 술 모드에서만 술 이름 입력 아래에 도수 입력칸을 추가했고, 도수 미입력 시 저장 전 안내하도록 했다.
- 현재 아카이브 저장은 임시로 `FundingContext`의 review 저장 함수를 공유하므로, `src/contexts/FundingContext.tsx`의 `addFundingReview` 입력에 선택 날짜를 받을 수 있게 최소 수정했다. 입력 날짜가 없으면 기존처럼 저장 시점의 날짜를 사용한다.
- 펀딩 후기 작성/상세/펀딩 목록 화면 코드는 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-21]: [마이] 내 아카이브 작성 날짜 입력 3분할.

[진행 내용]:
- 사용자가 기록 날짜를 한 줄 입력이 아니라 년, 월, 일 입력칸으로 가로 배치해달라고 요청했다.
- `src/features/mypage/screens/ArchiveWriteScreen.tsx`에서 날짜 상태를 `recordYear`, `recordMonth`, `recordDay`로 분리했다.
- 날짜 입력 UI를 년/월/일 3칸 가로 배치로 변경하고, 각 칸은 숫자 키보드와 적절한 최대 길이를 사용하도록 했다.
- 저장 시에는 세 값을 다시 `YYYY. MM. DD` 형태로 합쳐 기존 목록/상세 표시 흐름에 맞췄다.
- 펀딩 후기 작성/상세/펀딩 목록 화면 코드는 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-21]: [마이] 내 아카이브 작성 날짜 입력칸 크기 축소.

[진행 내용]:
- 사용자가 기록 날짜의 년/월/일 입력 네모칸이 주변 글씨에 비해 커 보인다고 알려줬다.
- `src/features/mypage/screens/ArchiveWriteScreen.tsx`에서 날짜 입력칸 높이, radius, padding, 글자 크기만 줄였다.
- 다른 입력칸, 작성 흐름, 펀딩 관련 화면 코드는 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-21]: [마이] 내 아카이브 상세 상단 정보 구조 변경.

[진행 내용]:
- 사용자가 술 기록 상세 페이지에서 술 이름은 한 번만 나오고, 내 술 기록이므로 프로필 영역은 필요 없다고 요청했다.
- `src/features/mypage/screens/ArchiveDetailScreen.tsx`에서 상단 배너/프로필/작성자 영역을 제거하고, 날짜 -> 술 이름과 일반술/펀딩술 배지 -> 펀딩 술인 경우 양조장명 -> 별점 순서로 재배치했다.
- 설명 이하 영역은 기존 흐름을 유지하되, 태그 영역의 첫 칩에 도수가 나오도록 했다.
- 일반 술 기록은 작성 시 입력한 도수를 태그 데이터 맨 앞에 보존하도록 `src/features/mypage/screens/ArchiveWriteScreen.tsx` 저장 payload를 조정했다.
- 펀딩 술 기록은 프로젝트의 `alcoholContent`를 상세 태그 첫 칩으로 사용한다.
- 펀딩 후기 작성/상세/펀딩 목록 화면 코드는 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-21]: [마이] 내 아카이브 상세 좋아요/댓글 제거.

[진행 내용]:
- 사용자가 나의 술 기록 상세 페이지에는 좋아요와 댓글이 필요 없다고 요청했다.
- `src/features/mypage/screens/ArchiveDetailScreen.tsx`에서 좋아요/댓글 액션 영역, 댓글 목록, 하단 댓글 입력바, 로그인 유도 모달 관련 로직을 제거했다.
- 개인 기록 상세 화면은 기록 내용, 태그, 그날의 기록, 이미지 중심으로만 남겼다.
- 펀딩 후기 작성/상세/펀딩 목록 화면 코드는 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-21]: [마이] 내 아카이브 펀딩술 기록 더미데이터 추가.

[진행 내용]:
- 사용자가 내 술 아카이브에 펀딩술 기록 더미데이터 1개를 추가해달라고 요청했다.
- `src/features/mypage/screens/MyArchiveScreen.tsx`에 `달빛 담은 배 막걸리` 샘플 펀딩술 기록 1개를 추가했다.
- 해당 더미 기록은 `isFunding: true`로 표시되어 전체/펀딩술 탭에 보이며, 실제 펀딩 프로젝트 상세가 아니라 아카이브 전용 상세 페이지로 이동한다.
- `src/features/mypage/screens/ArchiveDetailScreen.tsx`의 샘플 상세 데이터에도 같은 id의 펀딩술 기록을 추가해 목록 클릭 시 전용 상세 내용을 볼 수 있게 했다.
- 실제 펀딩 목록/상세/후기 작성 코드는 수정하지 않았다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 참여 펀딩 배송조회 더미 데이터 추가.

[진행 내용]:
- 사용자가 참여 펀딩에도 배송조회가 가능한 더미 데이터 1개를 추가해달라고 요청했다.
- `src/features/mypage/screens/FundedProjectsScreen.tsx`에 배송조회 확인용 참여 펀딩 더미 프로젝트를 추가하고, 참여 펀딩 목록/요약 금액/프로젝트 수에 포함되도록 했다.
- 해당 더미 프로젝트는 목록 카드에서 배송조회 버튼이 바로 노출되며, 버튼을 누르면 기존 주문 상세 라우트 `/funding/order/9001`로 이동한다.
- `src/features/mypage/screens/FundingOrderDetailScreen.tsx`에서 같은 더미 프로젝트 id를 인식하도록 주문 상세용 프로젝트와 주문 오버라이드를 추가했다.
- 주문 상세에는 배송중 상태, 택배사, 운송장 번호가 표시되어 배송조회 UI를 확인할 수 있게 했다.
- 수정 범위는 마이페이지의 참여 펀딩 목록과 그 목록에서 들어가는 배송조회 상세 화면으로 제한했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.
[2026-05-22]: [마이] 프로필 이미지 수정 API 연결.

[진행 내용]:
- 사용자가 전달한 `PATCH /api/mypage/profile/image` 명세를 `api.md`에 정리했다.
- `src/features/mypage/api.ts`에 multipart/form-data 요청 함수와 `updateMyPageProfileImage` 클라이언트를 추가했다.
- `src/features/mypage/screens/ProfileScreen.tsx`에서 이미지 선택 후 `image` 필드명으로 서버 업로드를 호출하고, 성공 응답의 `profileImageUrl`을 AuthContext 사용자 프로필 이미지에 반영하도록 했다.
- multipart 요청은 boundary 자동 설정을 위해 `Content-Type`을 직접 지정하지 않는다.
- 서버 과금 방지 원칙에 따라 실제 API 직접 호출은 하지 않고 타입/린트 검증으로 확인했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 메인 프로필 아바타 이미지 표시.

[진행 내용]:
- `src/features/mypage/screens/MyPageScreen.tsx`에서 마이페이지 메인 프로필 아바타가 첫 글자 대신 `user.profileImage`를 우선 표시하도록 변경했다.
- 프로필 이미지가 없을 때만 기존처럼 닉네임/이름 첫 글자를 fallback으로 보여준다.
- 추가 API는 필요 없으며, 프로필 수정 화면에서 AuthContext에 반영된 `profileImage` 값을 그대로 사용한다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 주문 상세 배송 타임라인 4단계 구조 변경.

[진행 내용]:
- 사용자가 참여 펀딩의 배송내역 버튼으로 들어가는 주문 상세 페이지 UI에서 배송 타임라인을 5단계에서 4단계로 변경해달라고 요청했다.
- `src/features/mypage/screens/FundingOrderDetailScreen.tsx`의 `buildTimeline` 구성을 수정했다.
- 기존 `펀딩 참여 완료`, `제조 시작`, `제조 완료/배송 준비`, `발송`, `배송 완료` 흐름을 제거하고 `상품 준비`, `집화`, `배송 중`, `배송 완료` 4단계만 표시하도록 변경했다.
- 배송 상태에 따라 각 단계의 완료 표시가 이어지도록 `prepared`, `collected`, `shipping`, `delivered` 기준을 정리했다.
- 더미 데이터가 아니라 주문 상세 페이지의 공통 타임라인 UI 구조만 수정했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 내 술 기록 상세 수정/삭제 메뉴 추가.

[진행 내용]:
- 사용자가 내 기록 상세 페이지 상단 오른쪽에 커뮤니티 상세와 같은 세점 메뉴 UI를 추가하고, 수정/삭제 동작을 구현해달라고 요청했다.
- `src/features/mypage/screens/ArchiveDetailScreen.tsx` 헤더 오른쪽에 `MoreVertical` 세점 버튼과 `수정`, `삭제` 드롭다운 메뉴를 추가했다.
- 저장된 아카이브 기록에서 `수정`을 누르면 `/mypage/archive/write` 작성 화면으로 `editId`, `type`, `fundingId`를 넘겨 기존 기록 내용을 채운 상태로 이동하도록 연결했다.
- 저장된 아카이브 기록에서 `삭제`를 누르면 해당 기록을 제거하고 내 아카이브 목록으로 돌아가도록 했다.
- `src/features/mypage/screens/ArchiveWriteScreen.tsx`가 `editId`를 받을 때 기존 날짜, 술 이름, 도수, 별점, 사진, 상세 기록, 기분, 안주, 태그를 초기값으로 채우도록 수정했다.
- 수정 모드 저장 시 새 기록을 추가하지 않고 기존 기록을 업데이트하도록 연결했고, 버튼/알림 문구도 수정 모드에 맞게 바꿨다.
- `src/contexts/FundingContext.tsx`에 아카이브 임시 저장소에서 사용하는 기록 삭제 함수와 수정 날짜 반영 처리를 추가했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 프로필/비밀번호 변경 UI 문구와 크기 조정.

[진행 내용]:
- 사용자가 마이페이지 프로필 화면에서 프로필 이미지 아래 회색 안내 문구를 삭제해달라고 요청했다.
- `src/features/mypage/screens/ProfileScreen.tsx`에서 `이미지는 서버에 저장되고 프로필에 반영됩니다.` 문구와 관련 스타일을 제거했다.
- 전화번호 수정 시트 안내 문구는 `인증 후 저장할 수 있어요.`만 남기도록 변경했다.
- 이메일 인증 시트 하단의 `이메일 수정 API가 없어 현재는 인증 UI만 동작합니다.` 안내 문구를 제거했다.
- `src/features/mypage/screens/PasswordChangeScreen.tsx`에서 헤더 제목, 아이콘, 카드 여백, 입력칸 높이, 라벨, 저장 버튼 크기를 줄여 다른 마이페이지 UI 밀도와 맞췄다.
- 수정 범위는 마이페이지 프로필 및 비밀번호 변경 화면으로 제한했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 나의 활동 더미 항목 표시.

[진행 내용]:
- 사용자가 나의 활동 화면에서 레시피, 펀딩, 커뮤니티 각각의 항목 UI를 결정할 수 있도록 더미 데이터를 하나씩 불러와달라고 요청했다.
- `src/features/mypage/screens/MyActivityCategoryScreen.tsx`의 공통 활동 화면에 `ActivityItem` 카드 렌더링 구조를 추가했다.
- 레시피 화면의 작성 탭에 `막걸리 크림 파스타` 더미 항목을 추가했다.
- 펀딩 화면의 관심 탭에 `달빛 담은 배 막걸리` 더미 항목을 추가했다.
- 커뮤니티 화면의 작성 탭에 `이번 주말에 마신 전통주 추천` 더미 항목을 추가했다.
- 항목이 없는 탭은 기존 빈 상태 UI를 그대로 유지하도록 했다.
- 수정 범위는 마이페이지 나의 활동 화면으로 제한했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 레시피 활동 탭 카드 UI 조정.

[진행 내용]:
- 사용자가 나의 활동 > 레시피 화면에서 작성/관심 탭은 주담 레시피 목록 카드 UI를 그대로 가져오고, 댓글 탭은 레시피 제목과 내가 단 댓글을 네모 박스로 구분해 보여달라고 요청했다.
- `src/features/mypage/screens/MyActivityCategoryScreen.tsx`에서 레시피 작성/관심 더미 항목은 `src/components/recipe-card.tsx`의 `RecipeCard`를 사용하도록 변경했다.
- 레시피 댓글 탭에는 레시피 제목을 상단에 표시하고, `내 댓글` 라벨이 있는 별도 박스 안에 댓글 내용을 표시하는 카드 UI를 추가했다.
- 펀딩/커뮤니티 활동 탭의 기존 더미 카드 구조는 유지했다.
- 수정 범위는 마이페이지 나의 활동 공통 화면으로 제한했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 레시피/커뮤니티 활동 카드 이동 및 댓글 UI 정리.

[진행 내용]:
- 사용자가 레시피 댓글 활동에서 날짜와 `내 댓글` 문구를 제거하고, 각 활동 항목을 누르면 해당 상세 페이지로 이동하는 구조를 요청했다.
- `src/features/mypage/screens/MyActivityCategoryScreen.tsx`에서 레시피 댓글 카드의 날짜 표시와 `내 댓글` 라벨을 제거했다.
- 레시피 댓글 더미 항목은 `/recipe/900103`으로 이동하도록 연결했고, 작성/관심 항목은 기존 `RecipeCard` 자체의 상세 이동 구조를 사용한다.
- 커뮤니티 활동에도 같은 구조를 적용해 작성/관심 탭은 커뮤니티 목록 카드 형태로 표시하고 `/community/{id}`로 이동하도록 했다.
- 커뮤니티 댓글 탭은 게시글 제목과 댓글 박스만 보여주며 `/community/900203`으로 이동하도록 연결했다.
- 수정 범위는 마이페이지 나의 활동 공통 화면으로 제한했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 커뮤니티 활동 카드 배경 구분 강화.

[진행 내용]:
- 사용자가 나의 활동 > 커뮤니티 카드가 화면 배경과 구분이 잘 되지 않아 레시피 카드처럼 분리되어 보이게 해달라고 요청했다.
- `src/features/mypage/screens/MyActivityCategoryScreen.tsx`의 커뮤니티 활동 카드 배경을 흰색으로 변경했다.
- 커뮤니티 카드 radius, 테두리, elevation, shadow를 레시피 카드와 유사한 밀도로 조정해 배경과 구분되도록 했다.
- 수정 범위는 마이페이지 나의 활동 공통 화면의 커뮤니티 카드 스타일로 제한했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 펀딩 활동 카드/댓글/Q&A 구조 적용.

[진행 내용]:
- 사용자가 나의 활동 > 펀딩 화면에서 관심/댓글을 다른 활동 카테고리와 동일한 구조로 불러오고, Q&A는 댓글과 같은 구조로 보여달라고 요청했다.
- `src/features/mypage/screens/MyActivityCategoryScreen.tsx`에 펀딩 활동 항목 타입을 추가하고 `FundingProjectCard`를 사용해 관심 펀딩을 펀딩 목록 카드 형태로 표시하도록 했다.
- 펀딩 관심 더미 항목은 `/funding/900301` 상세로 이동하도록 연결했다.
- 펀딩 댓글 탭은 펀딩 제목과 댓글 박스 구조로 표시하고 `/funding/900301`로 이동하도록 했다.
- 펀딩 Q&A 탭도 댓글과 같은 카드 구조로 표시하고 `/funding/900301`로 이동하도록 했다.
- 수정 범위는 마이페이지 나의 활동 공통 화면으로 제한했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 펀딩 Q&A 답변보기 토글 추가.

[진행 내용]:
- 사용자가 나의 활동 > 펀딩 Q&A 항목에 `답변보기`를 두고 펼치면 답변을 볼 수 있게 해달라고 요청했다.
- `src/features/mypage/screens/MyActivityCategoryScreen.tsx`의 활동 항목 타입에 `answer` 필드를 추가했다.
- 댓글형 카드에서 `answer`가 있는 항목은 `답변보기` 토글 버튼을 표시하도록 했다.
- 토글을 펼치면 답변 박스가 나타나고, 다시 누르면 접히도록 `openAnswers` 상태를 추가했다.
- `답변보기` 버튼은 카드 상세 이동과 분리되도록 이벤트 전파를 막았다.
- 펀딩 Q&A 더미 항목에 배송 일정 답변 내용을 추가했다.
- 수정 범위는 마이페이지 나의 활동 공통 화면으로 제한했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 추가 마이페이지 API 연결.

[진행 내용]:
- 사용자가 전달한 추가 API 중 기존에 이미 연결된 프로필 조회, 닉네임 중복 확인/수정, 전화번호 수정, 프로필 이미지 수정은 중복 작업하지 않았다.
- `src/features/mypage/api.ts`에 비밀번호 변경, 마이페이지 요약 조회, 술BTI 결과 조회/저장, 아카이브 이미지 업로드/삭제 API 클라이언트를 추가했다.
- `src/features/mypage/screens/PasswordChangeScreen.tsx`를 비밀번호 변경 API 호출 방식으로 연결하고 저장 중 상태와 오류 처리를 추가했다.
- `src/features/mypage/screens/MyPageScreen.tsx`에서 `GET /api/mypage/summary`를 호출해 참여 펀딩 수, 아카이브 수, 뱃지 수, 술BTI 요약 타입을 반영하도록 했다.
- `src/features/bti/screens/BTITestScreen.tsx`에서 술BTI 검사 변환 성공 후 `POST /api/mypage/sulbti`로 결과를 저장하도록 연결했다.
- `src/features/bti/screens/BTIResultScreen.tsx`에서 `GET /api/mypage/sulbti`로 저장된 결과를 불러와 로컬 사용자 상태에 반영하도록 했다.
- 아카이브 이미지 업로드/삭제 함수는 추가했지만, 실제 작성/수정 화면 연결은 아카이브 생성/수정 API가 반환하는 `archiveId` 계약이 필요하다.
- `api.md`에 새로 받은 비밀번호, 요약, 술BTI, 아카이브 recordDate, 아카이브 이미지 API 내용을 정리했다.

[2026-05-22]: [마이] 뱃지 화면 6개 슬롯 그리드 구성.

[진행 내용]:
- 사용자가 마이페이지 뱃지 화면에 6개 뱃지를 가로 2개, 세로 3줄로 배치하고, 미획득 상태는 원형 회색 빈 슬롯처럼 보이게 해달라고 요청했다.
- 전달받은 뱃지 이미지 6개를 `assets/images/badges` 폴더로 복사해 앱에서 `require`로 사용할 수 있게 했다.
- `src/features/mypage/screens/BadgeScreen.tsx`에 공동 제작자, 반가워요!, 주담과 소통하기, 펀딩 숙련가, 펀딩 입문자, 펀딩 중급자 데이터를 추가했다.
- 각 뱃지는 이름과 이미지, 획득 여부(`earned`)를 분리해 두었고, 현재는 `earned: false`로 미획득 회색 원형 슬롯을 보여준다.
- 나중에 획득 처리 시 `earned`가 true가 되면 해당 이미지가 원형 뱃지 안에 채워지는 구조로 구성했다.
- 화면 하단에는 `계속해서 뱃지가 추가될 예정이에요!` 안내 문구를 작은 회색 글씨로 추가했다.
- 수정 범위는 마이페이지 뱃지 화면과 뱃지 이미지 에셋 추가로 제한했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 아카이브 통합 작성 API 연결.

[진행 내용]:
- 백엔드가 전달한 `POST /api/mypage/archives/with-images` 명세를 `api.md`에 추가했다.
- `src/features/mypage/api.ts`에 `createMyPageArchiveWithImages` API 클라이언트를 추가했다.
- `src/features/mypage/screens/ArchiveWriteScreen.tsx`의 신규 작성 저장 흐름을 통합 작성 API 호출로 변경했다.
- 작성 성공 시 응답의 `archiveId`와 S3 이미지 URL을 로컬 아카이브 목록 상태에도 반영하도록 했다.
- multipart 요청에서는 `Content-Type`을 직접 지정하지 않고 Authorization 헤더만 사용하도록 유지했다.
- 현재 프론트 태그 UI는 문자열 태그이고 백엔드 작성 API는 `tagIds`만 받기 때문에, 태그 ID 매핑 API/목록이 연결되기 전까지는 `tagIds`를 빈 배열로 전송한다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 아카이브 통합 작성 API 태그 필드 반영.

[진행 내용]:
- 백엔드가 추가 전달한 `customTags`, `alcoholId`, `fundingId`, `orderId`, `reviewId` 필드를 `src/features/mypage/api.ts`의 통합 작성 API payload 타입과 FormData 구성에 반영했다.
- `src/features/mypage/screens/ArchiveWriteScreen.tsx`에 프론트 고정 태그명과 백엔드 `tagId` 매핑을 추가했다.
- 아카이브 작성 시 선택한 고정 태그는 `tagIds`로, 직접 입력 태그는 `customTags`로 전송하도록 변경했다.
- 현재 고정 태그 ID는 백엔드 예시의 `달콤한=21`, `친구모임=32`, `행복한=39`를 기준으로 카테고리별 연속 ID를 적용했다.
- `api.md`에 통합 작성 API의 추가 필드와 태그 매핑 내용을 갱신했다.

[2026-05-22]: [마이] 아카이브 목록/상세/수정/삭제/태그 API 연결.

[진행 내용]:
- `src/features/mypage/api.ts`에 아카이브 목록 조회, 상세 조회, 수정, 삭제, 태그 목록 조회 API 클라이언트를 추가했다.
- `src/features/mypage/screens/MyArchiveScreen.tsx`에서 `GET /api/mypage/archives`를 호출해 DB 아카이브 목록을 표시하도록 연결했다.
- DB 목록이 있을 때는 더미 목록을 섞지 않고 서버 목록을 우선 표시하도록 했다.
- `src/features/mypage/screens/ArchiveDetailScreen.tsx`에서 `GET /api/mypage/archives/{archiveId}`로 상세를 조회하고, 메뉴 삭제는 `DELETE /api/mypage/archives/{archiveId}`를 호출하도록 연결했다.
- `src/features/mypage/screens/ArchiveWriteScreen.tsx` 수정 모드에서 상세 API로 기존 값을 불러오고, 저장 시 `PATCH /api/mypage/archives/{archiveId}`를 호출하도록 연결했다.
- 아카이브 태그 목록 API를 호출해 태그명과 `tagId` 매핑을 보강하도록 했다.
- 백엔드가 전달한 고정 태그 ID 매핑 중 `혼술=11`, `기념일=14`, `편안한=17`을 반영했다.
- `api.md`에 아카이브 목록/상세/수정/삭제/태그 조회 API 연결 내용을 추가했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 일반 술 아카이브 더미 제거.

[진행 내용]:
- `src/features/mypage/screens/MyArchiveScreen.tsx`에서 일반 술 더미 데이터 `GENERAL_DRINKS`를 목록 조합에서 제거했다.
- 사용하지 않는 일반 술 더미 상수도 삭제했다.
- 이제 서버 아카이브 목록이 없을 때도 일반 술 더미가 대신 표시되지 않는다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 아카이브 이미지 없는 카드 UI 및 상세 표시 보강.

[진행 내용]:
- `src/features/mypage/screens/MyArchiveScreen.tsx`에서 아카이브 이미지가 없을 때 더미 이미지를 넣지 않고 이미지 영역 자체를 렌더링하지 않도록 변경했다.
- 이미지가 없는 카드에서는 텍스트 영역이 왼쪽으로 붙도록 카드 레이아웃을 유지했다.
- `src/features/mypage/screens/ArchiveDetailScreen.tsx`에서 서버 상세 응답에 없는 `mood`, `pairing`은 같은 ID의 로컬 기록이 있으면 병합해 표시하도록 보강했다.
- `src/features/mypage/screens/ArchiveWriteScreen.tsx` 수정 모드에서 새로 추가한 로컬 이미지는 `POST /api/mypage/archives/{archiveId}/images`로 업로드하도록 연결했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 아카이브 수정 이미지 업로드 분기 수정.

[진행 내용]:
- 이미지가 없던 아카이브를 수정하면서 이미지를 추가해도 목록/상세에 이미지가 나타나지 않는 문제를 확인했다.
- 원인은 작성 성공 후 로컬 상태에 같은 `archiveId`가 들어가면서 수정 시 로컬 수정 분기가 서버 수정/이미지 업로드 분기보다 먼저 실행될 수 있는 구조였다.
- `src/features/mypage/screens/ArchiveWriteScreen.tsx`에서 수정 모드는 `PATCH /api/mypage/archives/{archiveId}` 및 `POST /api/mypage/archives/{archiveId}/images` 서버 호출 분기를 우선 타도록 순서를 변경했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 아카이브 목록 중복 key 경고 수정.

[진행 내용]:
- `src/features/mypage/screens/MyArchiveScreen.tsx`에서 서버 아카이브와 로컬 아카이브가 같은 숫자 ID를 가질 때 `general-{id}` key가 중복되는 문제를 수정했다.
- 목록 아이템 모델에 `listKey`를 추가하고 서버/로컬 출처를 포함한 고유 key를 사용하도록 변경했다.
- fallback key에는 index를 포함해 샘플/기타 항목도 중복되지 않게 했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 아카이브 목록 key 최종 중복 방지.

[진행 내용]:
- 로컬 아카이브 상태 배열에 같은 기록 ID가 중복으로 들어온 경우 `local-general-{id}` key도 중복될 수 있어 추가 수정했다.
- `src/features/mypage/screens/MyArchiveScreen.tsx`의 목록 렌더링 key에 최종 index를 항상 붙여 같은 ID가 중복되어도 React key가 겹치지 않도록 했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 아카이브 수정 이미지 삭제 API 연결.

[진행 내용]:
- 이미지 삭제 후 저장해도 반영되지 않는 문제를 확인했다.
- 원인은 수정 화면에서 이미지 썸네일만 제거하고 기존 서버 이미지의 `DELETE /api/mypage/archives/{archiveId}/images/{imageId}`를 호출하지 않았기 때문이다.
- `src/features/mypage/screens/ArchiveWriteScreen.tsx`에서 상세 조회 시 이미지 URL과 `imageId` 매핑을 저장하도록 했다.
- 수정 저장 시 기존 서버 이미지 중 화면에서 제거된 이미지를 계산해 `deleteMyPageArchiveImage`를 호출하도록 연결했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.
[2026-05-22 AI chat API connection]
- Connected `src/features/ai-chat/screens/AIChatRoomScreen.tsx` to backend proxy `POST /api/ai/chat`.
- Added `src/features/ai-chat/api.ts` with base URL `http://43.202.24.223:3000`, optional bearer token lookup, request body `{ message, user_id, history }`, and backend error message passthrough.
- AI chat room now sends previous user/assistant messages as history, shows loading/error states, renders backend `suggested_questions`, and persists updated messages/last message/title to `judam.aiChat.rooms`.

[2026-05-22]: [마이/커뮤니티] 수정 화면 네비게이션 분기 정리.

[진행 내용]:
- 아카이브 상세에서 수정 화면으로 이동할 때 `router.push` 대신 `router.replace`를 사용하도록 변경해 수정 전 상세 화면이 스택에 남지 않게 했다.
- 아카이브 수정 완료 후에는 목록이 아니라 수정된 상세 화면으로 `replace` 이동하도록 변경했다.
- 커뮤니티 상세에서 게시글 수정 화면으로 이동할 때도 `router.replace`를 사용하도록 변경해 수정 전 상세가 뒤로가기 스택에 남지 않게 했다.
- 이 변경으로 수정 완료 후 뒤로가기 시 수정 전 화면이 다시 뜨는 분기 꼬임을 줄였다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 뱃지 표시 순서 변경.

[진행 내용]:
- 사용자가 마이페이지 뱃지 UI 순서를 `반가워요!`, `주담과 소통하기`, `펀딩 입문자`, `펀딩 중급자`, `펀딩 숙련가`, `공동 제작자` 순으로 정렬해달라고 요청했다.
- `src/features/mypage/screens/BadgeScreen.tsx`의 `BADGES` 배열 순서를 요청한 표시 순서대로 변경했다.
- 뱃지 이미지, 이름, 미획득 회색 슬롯 UI 구조는 그대로 유지했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 아카이브 통합 수정 API 재연결.

[진행 내용]:
- 사용자가 전달한 `PATCH /api/mypage/archives/{archiveId}/with-images` 명세를 확인했다.
- `src/features/mypage/api.ts`에 `updateMyPageArchiveWithImages` API 클라이언트를 추가했다.
- `MyPageArchive` 타입에 `mood`, `pairing` 응답 필드를 반영했다.
- `src/features/mypage/screens/ArchiveWriteScreen.tsx` 수정 모드 저장을 기존 JSON PATCH + 이미지 개별 업로드/삭제 흐름에서 통합 multipart PATCH API 호출로 변경했다.
- 수정 저장 시 술 이름, 도수, 별점, 날짜, 상세 기록, 기분, 안주, 고정 태그, 직접 입력 태그, 삭제 이미지 ID, 새 이미지 파일을 한 번에 전송하도록 했다.
- `src/features/mypage/screens/ArchiveDetailScreen.tsx`에서 서버 응답의 `mood`, `pairing`을 우선 표시하도록 변경했다.
- `api.md`에 아카이브 통합 수정 API 내용을 추가했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 아카이브 로딩/목록 새로고침 개선.

[진행 내용]:
- 사용자가 아카이브 상세 로딩 중 `기록을 찾을 수 없습니다` UI가 먼저 뜨는 문제와 수정 후 목록이 바로 반영되지 않는 문제를 보고했다.
- `src/features/mypage/screens/ArchiveDetailScreen.tsx`에 상세 조회 로딩 상태를 추가했다.
- 서버 아카이브 상세를 불러오는 동안에는 `기록을 불러오는 중입니다` UI를 표시하고, 조회 실패/실제 없음일 때만 찾을 수 없음 UI가 뜨도록 분기했다.
- `src/features/mypage/screens/MyArchiveScreen.tsx`의 서버 아카이브 목록 조회를 `useFocusEffect` 기반으로 변경해 목록 화면에 다시 포커스될 때마다 최신 목록을 재조회하도록 했다.
- 목록 조회 중 빈 목록일 때는 `아카이브를 불러오는 중입니다` UI를 표시하도록 했다.
- 수정 후 상세/다른 화면에서 목록으로 돌아왔을 때 서버 목록이 다시 조회되어 변경 내용이 바로 반영되도록 했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [마이] 반가워요 뱃지 획득 상태 적용.

[진행 내용]:
- 사용자가 마이페이지 뱃지 화면에서 `반가워요!` 뱃지를 획득한 상태라고 가정해 표시해달라고 요청했다.
- `src/features/mypage/screens/BadgeScreen.tsx`의 `welcome` 뱃지 `earned` 값을 `true`로 변경했다.
- 다른 뱃지는 기존처럼 미획득 회색 슬롯 상태를 유지했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [양조장] 대시보드 내 펀딩 현황 페이지네이션 추가.

[진행 내용]:
- 사용자가 양조장 대시보드의 `내 펀딩 현황` 목록을 한 번에 3개씩 나눠 보여달라고 요청했다.
- `src/features/brewery/screens/BreweryDashboardScreen.tsx`에서 펀딩 목록 페이지 상태를 추가하고, 필터링된 목록을 3개 단위로 slice해 렌더링하도록 변경했다.
- 목록이 4개 이상일 때만 이전/다음 페이지 버튼과 현재 페이지 표시를 보여주도록 페이지네이션 UI를 추가했다.
- 진행중/종료됨 필터를 바꾸면 1페이지로 돌아가고, 목록 개수가 줄어든 경우 현재 페이지가 유효 범위 안에 머물도록 보정했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [양조장] 대시보드 기본 정보 카드 프로필 페이지 연결 및 프로필 UI 개편.

[진행 내용]:
- 사용자가 양조장 대시보드의 양조장 기본 정보 카드를 누르면 정보 수정 페이지가 아니라 양조장 프로필 페이지로 이동하게 해달라고 요청했다.
- `src/features/brewery/screens/BreweryDashboardScreen.tsx`에서 기본 정보 카드 이동 경로를 `/brewery/verification`에서 `/brewery/profile`로 변경했다.
- 기존 `src/features/brewery/screens/BreweryProfileScreen.tsx`를 참고 코드의 구성에 맞춰 양조장 프로필 화면으로 개편했다.
- `/brewery/profile` 진입 시 로그인한 양조장의 이름, 위치, 사업자등록번호, 연락처, 이메일을 우선 사용하고, 없으면 솔샘양조장 mock 정보를 표시하도록 했다.
- 기존 `/brewery/{id}` 공개 프로필 라우트도 유지되도록 프로젝트 기반 데이터 fallback을 남겼다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-22]: [양조장] 프로필 페이지 인라인 수정 모드 추가.

[진행 내용]:
- 사용자가 양조장 프로필 화면의 `수정` 버튼을 누르면 별도 화면 이동 없이 해당 페이지에서 요소를 수정 가능하게 해달라고 요청했다.
- `src/features/brewery/screens/BreweryProfileScreen.tsx`에 편집 모드 상태와 입력 폼 상태를 추가했다.
- 수정 모드에서 양조장명, 한 줄 소개, 소개 문구, 브랜드 스토리, 양조장 소개, 설립연도, 대표자명, 소재지, 이메일을 화면 안에서 바로 입력할 수 있게 했다.
- 저장 시 `AuthContext.updateUser`로 양조장명, 소재지, 대표자명, 이메일을 로컬 사용자 상태에 반영하도록 했다.
- 사업자등록번호와 전화번호는 수정 모드에서 직접 입력하지 않고 누르면 기존 양조장 정보 수정 화면 `/brewery/verification`으로 이동하도록 했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-26]: [마이] 뱃지 목록 조회 API 연결.

[진행 내용]:
- 사용자가 전달한 `GET /api/mypage/badges` 명세를 확인했다.
- `src/features/mypage/api.ts`에 `MyPageBadge` 타입과 `getMyPageBadges` API 클라이언트를 추가했다.
- `src/features/mypage/screens/BadgeScreen.tsx`를 서버 뱃지 목록 기반으로 변경했다.
- 서버의 `displayOrder` 기준으로 정렬하고, `badgeId`로 로컬 뱃지 이미지를 매칭하도록 했다.
- `earned` 값에 따라 획득 뱃지 이미지 또는 미획득 잠금 슬롯을 표시한다.
- API 실패 시 기존 fallback 뱃지 슬롯을 유지하고 오류 문구를 표시한다.
- `api.md`에 마이페이지 뱃지 목록 조회 API 내용을 추가했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-26]: [마이] 메인 뱃지 카운트 뱃지 목록 API 기준 반영.

[진행 내용]:
- 마이페이지 메인의 뱃지 카운트가 `GET /api/mypage/summary`의 `badgeCount`만 사용해 0으로 보일 수 있는 문제를 확인했다.
- `src/features/mypage/screens/MyPageScreen.tsx`에서 `GET /api/mypage/badges`도 함께 호출하도록 연결했다.
- 뱃지 목록 응답의 `earned: true` 개수를 계산해 메인 뱃지 카운트에 우선 표시하도록 했다.
- 이 호출은 백엔드의 뱃지 자동 획득 처리도 트리거하므로 `welcome` 뱃지 조건 충족 시 카운트가 반영될 수 있다.
- `src/features/mypage/screens/BadgeScreen.tsx`의 fallback `welcome`은 `earned: false`로 유지되어 프론트가 임의 획득 처리하지 않음을 확인했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-26]: [마이] 프로필 수정 화면 문구 및 입력 흐름 정리.

[진행 내용]:
- `src/features/mypage/screens/ProfileScreen.tsx`의 깨진 Alert/라벨/버튼 문구를 정상 한글 문구로 정리했다.
- 닉네임 중복 확인 및 저장 성공/실패 문구가 깨지지 않도록 수정했다.
- 전화번호는 수정/인증 모달을 열지 않고 프로필 화면에서 확인만 하는 읽기 전용 항목으로 변경했다.
- 이메일은 인증 버튼 없이 이메일 형식 확인 후 바로 저장되는 UI로 변경했다.
- 현재 이메일 수정 API가 없기 때문에 이메일 저장은 앱의 사용자 상태에만 반영된다.
- 프로필 이미지 변경 권한/성공/실패 문구도 정상 한글로 정리했다.
- 수정 범위는 마이페이지 프로필 화면으로 제한했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-26]: [마이] 프로필 이메일 안내 문구 및 이미지 버튼 중복 클릭 방지.

[진행 내용]:
- `src/features/mypage/screens/ProfileScreen.tsx`에서 이메일 변경 하단의 `인증 없이 바로 저장됩니다.` 안내 문구를 제거했다.
- helper 문구가 없는 항목은 빈 텍스트가 렌더링되지 않도록 조건부 렌더링으로 변경했다.
- 프로필 이미지 변경 버튼은 저장 중 중복 클릭되지 않도록 `saving` 상태에서 비활성화하고 opacity를 낮추도록 했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-26]: [마이] 프로필 이미지 선택 편집 화면 비활성화.

[진행 내용]:
- `src/features/mypage/screens/ProfileScreen.tsx`에서 프로필 이미지 선택 시 Expo 기본 crop/edit 화면이 뜨지 않도록 `allowsEditing`을 `false`로 변경했다.
- 사용자가 이미지를 선택하면 별도 편집 화면 없이 바로 프로필 이미지 업로드 흐름으로 이어진다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-26]: [마이] 메인 통계 포커스 시 즉시 갱신.

[진행 내용]:
- 마이페이지 메인의 참여 펀딩, 내 아카이브, 뱃지 카운트가 다른 화면 작업 후 즉시 반영되지 않는 문제를 수정했다.
- `src/features/mypage/screens/MyPageScreen.tsx`의 데이터 조회를 mount 시점 `useEffect`에서 화면 포커스 시점 `useFocusEffect` 기반으로 변경했다.
- 마이페이지로 돌아올 때마다 프로필, 펀딩 주문, 요약, 뱃지 목록을 다시 조회하도록 했다.
- 이로써 아카이브 작성/수정/삭제, 펀딩 참여, 뱃지 획득 후 마이페이지 메인 통계가 다시 갱신된다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-26]: [마이] 내 아카이브 더미 데이터 제거 및 API 목록만 표시.

[진행 내용]:
- `src/features/mypage/screens/MyArchiveScreen.tsx`에서 남아 있던 샘플 펀딩 아카이브와 로컬/더미 목록 조합을 제거했다.
- 내 아카이브 목록은 `GET /api/mypage/archives` 응답으로 받은 서버 데이터만 표시하도록 정리했다.
- `src/features/mypage/screens/ArchiveDetailScreen.tsx`의 샘플 상세 데이터 블록을 제거했다.
- `src/features/mypage/screens/AddArchiveFlowScreen.tsx`, `ArchiveWriteScreen.tsx`에 남아 있던 아카이브용 더미 펀딩 프로젝트 fallback을 제거했다.
- 더미 관련 식별자(`SAMPLE`, `DUMMY`, `GENERAL_DRINKS`, `SAMPLE_ARCHIVES`, `ARCHIVE_DUMMY`, `sample`)가 대상 아카이브 파일에 남아 있지 않음을 확인했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-26]: [??] ??? ???? ???? AI ?? API ???.

[?? ??]:
- ?? ?? ? `judam.md`? `api.md`? ????.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`? ?? ?? `AI ??` ??? ?? ?? ??? ?? `suggestRecipeSubIngredients` API ??? ?? ????.
- ?? payload? ?? ?? ?? ??? `main_ingredient`? ?? ?? ????? ??? `region`? ???. ???? ??? ? ???? ???.
- `src/features/recipe/api.ts`? ?? ?? ??? ??? `data.sub_ingredients`? ??? `sub_ingredients`? ?? ????? ??? ????.
- ?? ??? ?? API ??? ?? ??? `npx.cmd tsc --noEmit`, `npm.cmd run lint`? ????.

[2026-05-26]: [양조장] 프로필 기본값 비움 및 공개 미작성 차단.

[진행 내용]:
- 사용자가 양조장 회원가입/인증 직후 프로필 내용은 비어 있고, 인증에서 받은 값만 채워진 상태여야 한다고 설명했다.
- `src/features/brewery/screens/BreweryProfileScreen.tsx`의 샘플 기본 프로필 문구를 제거하고 빈 값 기반으로 변경했다.
- 빈 항목은 회색 플레이스홀더로 어떤 내용을 적는 칸인지 안내하도록 `PROFILE_PLACEHOLDERS`를 추가했다.
- 양조장명, 소재지, 사업자등록번호, 전화번호, 이메일 등 인증/계정 정보는 기존 사용자 상태에 있는 값만 채워지도록 유지했다.
- 브랜드 한 줄 소개, 간단 소개, 브랜드 스토리, 양조장 소개, 설립연도는 신규 양조장 상태에서 비어 있게 했다.
- 본인 프로필에서는 빈 상태여도 수정 화면에 들어가 내용을 채울 수 있게 유지했다.
- 다른 유저가 공개 양조장 프로필에 들어갈 때 소개/히스토리 내용이 없으면 `아직 준비 중인 양조장입니다` 안내 화면으로 차단하도록 했다.
- `src/contexts/AuthContext.tsx`의 사용자 타입에 양조장 프로필 입력값을 로컬에 보관할 수 있는 선택 필드를 추가했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-26]: [양조장] 프로필 뒤로가기 버튼 동작 보정.

[진행 내용]:
- 사용자가 양조장 프로필 왼쪽 상단 뒤로가기 버튼이 정상 작동하지 않는다고 보고했다.
- `src/features/brewery/screens/BreweryProfileScreen.tsx`에 `handleBack` 함수를 추가했다.
- 수정 모드에서는 뒤로가기 버튼이 기존처럼 수정 취소로 동작하고, 일반 모드에서는 `router.canGoBack()`이 가능하면 뒤로 이동하도록 했다.
- 뒤로 갈 스택이 없는 직접 진입 상황에서는 본인 프로필이면 `/brewery/dashboard`, 공개 프로필이면 `/(tabs)/funding`으로 fallback 이동하도록 했다.
- absolute 중앙 제목이 왼쪽 버튼 터치를 방해하지 않도록 제목에 `pointerEvents="none"`을 적용하고, 헤더 버튼/수정 버튼에 `zIndex`를 부여했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.
[2026-05-26]: 홈 인기 레시피 제안 API 연결.

[진행 내용]:
- `src/features/recipe/api.ts`에 `fetchPopularRecipes`를 추가해 `GET /api/recipes/popular`를 호출하도록 했다.
- 인기 레시피 응답은 기존 `recipes` 래핑, 배열 직접 응답, `data` 래핑을 모두 허용하도록 파싱했다.
- `image_url`과 `imageUrl`을 모두 매핑하며, `null`이면 `RecipeCard`에서 기본 레시피 이미지를 표시하도록 했다.
- `src/features/home/screens/HomeScreen.tsx`의 `[인기 레시피 제안]` 섹션은 초기 로컬 fallback을 보여준 뒤 API 성공 시 서버 인기 레시피로 교체한다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npm.cmd run lint` 통과.

[2026-05-26]: [??] ??? API ??? ?? ??? ?? ??.

[?? ??]:
- `src/features/recipe/api.ts`? ?? ?? ?? ???? `message`, `error`, `errors`? ???? ?? ??/????? ?? ? ?? ???? ???? ????.
- ???? AI ?? ?? ? `[object Object]`? ??? ??? ?? ??? ?? ???? ??? ? ?? ??.
- ?? ?? `npx.cmd tsc --noEmit`, `npm.cmd run lint` ??.

[2026-05-26]: [??] ???? AI ?? API ?? ??? ?? ??.

[?? ??]:
- ????? `POST /api/recipe/suggest-sub-ingredients`? `region`, `location`, `area` ?? ??? ????? ?????.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`?? ?? ?? ???? ??? ?? helper? `region` ??? ????, ???? ?? ???? `main_ingredient`? ???? ????.
- `src/features/recipe/api.ts`? `SuggestSubIngredientsPayload` ??? ? ??? ?? `mainIngredient`/`main_ingredient`? ???? ?? ?? ??? ????? ???.

[2026-05-26]: [??] ???? AI ?? 422 ?? ??? ?? ??.

[?? ??]:
- ???? ?? API ?? ? `status: 422`, `message: [object Object]` ??? ????? ????.
- ??? ??? `mainIngredient` ?? `main_ingredient`? ????? ?? ???, ?? ?? ???? ?? ???? ? ???? ?? ??? ??? ? ??? ?? ??? ?? ???? ????.
- ??? API ?? ?????? ??? `[object Object]` ???? ??? ??? ???? ???? ??? ????.
- ?? ?? `npx.cmd tsc --noEmit`, `npm.cmd run lint` ??.

[2026-05-26]: [??] ???? AI ?? API ?? ??.

[?? ??]:
- ??? ??? ?? ?? ?? `AI ??` ??? `suggestRecipeSubIngredients` API ???? ?? ????.
- `src/features/recipe/screens/RecipeCreateScreen.tsx`? ?? ?? ?? ??? `??`, `?`, `??`, `??`, `?`? ????.
- ? ??/?? AI ?? API ???, ??? ?? ??? ??? ?? API? `sub_ingredient`? ??? ??? ????.
- ?? ?? `npx.cmd tsc --noEmit`, `npm.cmd run lint` ??.

[2026-05-27]: 프론트 작업 기준 및 백엔드 API 규칙 문서 정리.

[진행 내용]:
- `judam.md` 상단에 `현재 백엔드 API/프론트 작업 규칙` 섹션을 추가했다.
- 프로젝트 기본 정보, Android Studio 에뮬레이터 + Expo Go 테스트 기준, 백엔드 base URL을 명시했다.
- 일반 펀딩 목록, 내 프로젝트/관리하기 목록, 공개 상세, 관리하기 데이터, 임시저장 목록, 홈 인기 레시피 API를 화면 성격별로 구분했다.
- 내 프로젝트/관리하기 화면에서는 `GET /api/fundings?mine=true`와 `Authorization: Bearer {accessToken}`을 필수로 쓰고, 403 시 권한 안내 문구를 표시하도록 규칙화했다.
- `by-funding` 관리하기 응답의 `basicInfo`, `schedule`, `legalInfo`, `tasteProfile`, `plan`, `breweryInfo`, `notices`, `documents`, `images` 매핑 기준을 정리했다.
- 이미지 URL, 토큰 refresh, 홈 인기 레시피 `data.recipes` 최대 3개 표시, API 응답 추측 금지와 프론트 레포만 수정 원칙을 추가했다.
- 코드 파일은 수정하지 않았고 문서만 갱신했다.

[2026-05-27]: 펀딩 내 프로젝트 demo 소유권 예외 제거.

[진행 내용]:
- 아리 계정으로 로그인했는데 `꽃향기 가득한 생막걸리 프로젝트`가 `내 프로젝트`로 표시되는 문제를 확인했다.
- 원인은 `src/features/funding/ownership.ts`에서 demo project id 1을 모든 양조장 계정의 본인 프로젝트로 취급하던 임시 예외였다.
- `DEMO_BREWERY_PROJECT_IDS` 예외를 제거하고, `creatorId`/`breweryId`와 로그인 사용자 `id`/`uid` 매칭 또는 양조장명 일치만 소유권 기준으로 남겼다.
- `judam.md`의 현재 펀딩 소유권 기준도 demo id 예외를 쓰지 않는 기준으로 갱신했다.
- 검증 결과 `npx.cmd tsc --noEmit`, `npx.cmd eslint app src --no-cache`, `git diff --check` 통과. Android 에뮬레이터에서 `꽃향기 가득한 생막걸리 프로젝트`의 `내 프로젝트` 배지가 사라진 것을 확인했다.
