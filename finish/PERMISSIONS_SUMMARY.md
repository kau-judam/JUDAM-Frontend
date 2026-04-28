# 권한별 화면 분기 처리 현황

## 사용자 권한 타입

- `user`: 일반 사용자
- `brewery`: 양조장 계정 (인증 필요: `isBreweryVerified`)

## 보호된 라우트

### 양조장 전용 페이지 (ProtectedRoute 적용)

1. `/brewery/verify` - 양조장 인증 페이지
   - 권한: `brewery` 타입 필요
   - 인증 불필요 (인증하러 가는 페이지)

2. `/brewery/dashboard` - 양조장 대시보드
   - 권한: `brewery` 타입 + `isBreweryVerified` 필요
   
3. `/brewery/project/terms` - 펀딩 프로젝트 약관
   - 권한: `brewery` 타입 + `isBreweryVerified` 필요
   
4. `/brewery/project/details` - 펀딩 프로젝트 상세 입력
   - 권한: `brewery` 타입 + `isBreweryVerified` 필요

## 권한별 UI 분기

### MyPage
- ✅ 양조장 계정일 때 "양조장 대시보드" 바로가기 버튼 표시
- ✅ 일반 사용자일 때 "양조장 인증" 메뉴 표시
- ✅ 계정 타입 배지 표시 (일반 유저 vs 양조장 계정)

### FundingDetailPage
- ✅ 양조장 계정일 때 상단 헤더에 "양조장 대시보드" 아이콘 표시
- ✅ 양조장 계정일 때 알림 아이콘 표시

### HomePage
- 현재 권한별 분기 없음 (모든 사용자에게 동일한 UI 표시)

## 권한 체크 메커니즘

### 라우트 레벨 (ProtectedRoute)
```tsx
<ProtectedRoute requiredType="brewery" requireVerified>
  <Component />
</ProtectedRoute>
```

- 로그인 안 된 경우 → `/login`으로 리다이렉트
- 권한 없는 경우 → `/home`으로 리다이렉트
- 양조장 미인증 시 → `/brewery/verify`로 리다이렉트
- 모든 체크 통과 시 → 페이지 렌더링

### 컴포넌트 레벨
```tsx
const { user } = useAuth();
const isBrewery = user?.type === "brewery";

{isBrewery && <BreweryOnlyFeature />}
```

## 로그인 플로우

### 일반 사용자
1. `/login` → 이메일/비밀번호 입력
2. 로그인 성공 → `/home`

### 양조장
1. 회원가입 시 `/user-type-selection`에서 "양조장" 선택
2. `/brewery/verify`에서 인증 진행
3. 인증 완료 후 `/brewery/dashboard` 사용 가능

## 권한 확인 체크리스트

- [✅] 양조장 전용 페이지에 ProtectedRoute 적용
- [✅] MyPage에서 권한별 UI 분기
- [✅] FundingDetailPage에서 권한별 헤더 아이콘 표시
- [✅] ProtectedRoute 컴포넌트 생성 및 적용
- [✅] 중복 권한 체크 제거 (BreweryDashboardPage)
- [✅] 권한 없을 때 적절한 toast 메시지 및 리다이렉트

## 추가 개선 가능 사항

1. LoginPage에서 사용자 타입 선택 옵션 추가 고려
2. 양조장 계정 전용 기능 추가 시 권한 체크 필수
3. 비회원 접근 가능한 페이지 명시적 정의
