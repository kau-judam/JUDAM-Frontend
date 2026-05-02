# 주담(JuDam) 변경 이력 — v306 · v307 · v308

> **참고:** v309 · v310 · v311은 폐기(rollback 완료). 본 문서는 v305 이전 상태에서 v308까지의 변경 사항만을 기록합니다.

---

## v306 — 인증 Context 기반 구조 전환

**변경 파일:** `AuthContext.tsx`, `App.tsx`

### AuthContext.tsx — 전면 재구성

| 항목 | 이전 | 이후 |
|------|------|------|
| `uid` 필드 | 없음 | `JD-XXXXXXXX` 형식 고유 ID 추가 |
| `phone` 필드 | 없음 | User 인터페이스에 선택 필드로 추가 |
| `sulbti` 필드 | 없음 | User 인터페이스에 선택 필드로 추가 |
| `updateUser()` | 없음 | `Partial<User>`를 받아 상태 + localStorage 동기 업데이트 |
| `generateUID()` | 없음 | `JD-` 접두사 + 8자리 영숫자 난수 생성 함수 추가 |
| `signup()` | 기본 필드만 저장 | `uid`, `phone`, `breweryName`, `breweryLocation` 포함 저장 |
| localStorage 키 | 미정 | `judam_user` 로 통일 |
| 초기 상태 | 항상 `null` | 앱 진입 시 `localStorage.judam_user` 파싱하여 세션 복원 |

```ts
// 추가된 User 인터페이스 주요 필드
export interface User {
  uid: string;          // 변경 불가 고유 ID (JD-XXXXXXXX 형식)
  phone?: string;
  sulbti?: string;
  isBreweryVerified?: boolean;
  breweryName?: string;
  breweryLocation?: string;
}
```

### App.tsx — Provider 계층 확장

```tsx
// 이전
<AuthProvider>
  <RouterProvider router={router} />
</AuthProvider>

// 이후
<AuthProvider>
  <FavoritesProvider>
    <CommunityProvider>
      <FundingProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" richColors />
      </FundingProvider>
    </CommunityProvider>
  </FavoritesProvider>
</AuthProvider>
```

- `CommunityProvider`, `FundingProvider`, `FavoritesProvider` 최상위 래핑 추가
- `sonner` Toaster 전역 등록

---

## v307 — 마이페이지 · 설정 · 회원가입 UI/UX 개선

**변경 파일:** `MyPage.tsx`, `SettingsPage.tsx`, `SignupPage.tsx`

### MyPage.tsx

#### 1) 하드코딩 → Context 연동
- 사용자 이름, 이메일, 계정 유형 등 모든 표시 정보를 `useAuth().user`에서 읽도록 교체
- 로그인 미완료 시 `user === null` 가드 → 로그인 유도 화면 표시

#### 2) 술BTI 카드 — 조건부 렌더링
```ts
// localStorage에서 BTI 결과 읽기
const btiCode = localStorage.getItem("btiResult");
const btiData = btiCode ? btiNames[btiCode] : null;
```
- `btiData` 존재 시 → 결과 카드 (유형명 + 설명 + 결과 페이지 이동)
- `btiData` 없음 시 → **"당신의 술BTI를 알아보세요!"** 안내 텍스트로 대체 (비활성 상태)

#### 3) 술BTI 검사 버튼 항상 노출
```ts
const handleGoToBTITest = () => {
  localStorage.removeItem("btiResult"); // 기존 결과 초기화
  navigate("/bti-test");
};
```
- BTI 결과 유무와 무관하게 "술BTI 검사하러 가기" 버튼 항상 표시
- 클릭 시 기존 `btiResult` 삭제 후 테스트 시작 → 재검사 가능

#### 4) 나의 활동 섹션 제거
- 기존 "나의 활동" 별도 섹션(더미 통계 버튼 묶음) 전체 삭제

#### 5) 전화번호 · UID 표시 연동
- 프로필 정보 영역에 `user.phone`, `user.uid` 실제 값 표시

#### 6) 계정 유형 판별 로직
```ts
const isBrewery = () => {
  const userType = user.type?.toLowerCase();
  return ["brewery", "양조장", "브루어리"].includes(userType);
};
```
- 양조장 계정: 양조장 대시보드 배너 표시
- 일반 유저: BTI 카드 + 검사 버튼 표시

---

### SettingsPage.tsx

#### 1) Context 연동
- `updateUser()` 훅 사용으로 닉네임, 이메일, 전화번호 변경 즉시 전역 상태 반영
- 표시 값 초기화를 `user.name`, `user.email`, `user.phone`으로 통일

#### 2) 인증 버튼 추가 (이메일 · 전화번호)

| 필드 | 추가 기능 |
|------|-----------|
| 이메일 | "인증 코드 발송" 버튼 → 코드 입력 → "확인" 버튼 → 인증 완료 후 저장 허용 |
| 전화번호 | "인증번호 전송" 버튼 → 번호 입력 → "확인" 버튼 → 인증 완료 후 저장 허용 |

- 데모 인증 코드: `123456`
- 인증 미완료 상태에서 저장 시도 → 오류 토스트 차단

#### 3) 회원탈퇴 기능
```ts
const handleWithdraw = () => {
  if (withdrawConfirm !== "탈퇴하겠습니다") {
    toast.error("탈퇴 확인 문구를 정확히 입력해주세요");
    return;
  }
  logout();                           // judam_user localStorage 제거
  toast.success("회원 탈퇴가 완료되었습니다");
  navigate("/");
};
```
- 확인 문구 `"탈퇴하겠습니다"` 정확 입력 후 탈퇴 처리
- `logout()` 호출: `judam_user` 삭제, 나머지 데이터는 유지 (의도적 설계)

---

### SignupPage.tsx

| 변경 | 내용 |
|------|------|
| 전화번호 입력 필드 추가 | `phone` 항목 + "인증" 버튼 UI 추가 |
| `signup()` 인자 | `phone` 필드 포함하여 AuthContext로 전달 |

---

## v308 — 마이페이지 서브페이지 Context 연동

**변경 파일:** `MyPostsPage.tsx`, `FundedProjectsPage.tsx`

### MyPostsPage.tsx — CommunityContext 연동

```ts
// 이전: 하드코딩 더미 배열
const myPosts = [...hardcodedPosts].slice(0, 3);

// 이후: CommunityContext 실제 데이터
const { posts } = useCommunity();
const myPosts = posts.slice(0, 3);
```
- 주담(커뮤니티) 탭의 실제 게시글 Context를 구독
- 게시글 추가·삭제 시 이 페이지에도 자동 반영

### FundedProjectsPage.tsx — FundingContext 연동

```ts
// 이전: 하드코딩 더미 배열
const myFundings = [...hardcodedFundings];

// 이후: FundingContext 실제 참여 데이터
const { projects, participatedFundings } = useFunding();
const myFundings: MyFunding[] = participatedFundings
  .slice(0, 3)
  .map((p) => {
    const project = projects.find((proj) => proj.id === p.fundingId);
    return project ? { ...project, myAmount: p.amount, myDate: p.date } : null;
  })
  .filter((x): x is MyFunding => x !== null);
```
- `participatedFundings` 목록 기반으로 `projects`에서 실제 펀딩 데이터 매핑
- 후원 완료 시 `addParticipation()` 호출 흐름과 연결 대기 중 (→ v309에서 시도, 폐기)

---

## 폐기된 버전

| 버전 | 시도 내용 | 폐기 사유 |
|------|-----------|-----------|
| v309 | `AuthContext.logout()` 시 `btiResult` localStorage 초기화 추가 | rollback |
| v310 | `CommunityPage` local state → `useCommunity()` 교체 / `FundingSupportPage` 결제 완료 시 `addParticipation()` 호출 추가 | rollback |
| v311 | `SignupPage`의 `signup()` 호출에서 존재하지 않는 `breweryData` 필드 제거 (오류 수정) | rollback |

> v309–v311에서 식별된 잠재적 이슈는 별도 작업 세션에서 재검토 필요.
