# 권한별 화면 분기 테스트 가이드

## 구현된 권한 시스템

### 1. ProtectedRoute 컴포넌트
- 라우트 레벨에서 권한 체크
- 로그인 필요 시 → `/login`으로 리다이렉트 + toast 메시지
- 권한 부족 시 → `/home`으로 리다이렉트 + toast 메시지
- 양조장 미인증 시 → `/brewery/verify`로 리다이렉트 + toast 메시지

### 2. 보호된 라우트
```
/brewery/verify          → brewery 계정만 (인증 불필요)
/brewery/dashboard       → brewery 계정 + 인증 완료
/brewery/project/terms   → brewery 계정 + 인증 완료
/brewery/project/details → brewery 계정 + 인증 완료
```

## 테스트 시나리오

### A. 일반 사용자 테스트

#### 1. 회원가입 및 로그인
```
1. /signup → 회원가입 진행
   - 이메일: user@test.com
   - 비밀번호: password123
   ✅ 성공 시 → /home으로 이동
   
2. /login → 로그인 진행
   - 이메일: user@test.com
   ✅ 성공 시 → /home으로 이동
```

#### 2. 양조장 페이지 접근 차단 확인
```
URL 직접 입력:
- /brewery/dashboard → ❌ "양조장 계정만 접근할 수 있습니다" toast + /home 리다이렉트
- /brewery/project/terms → ❌ "양조장 계정만 접근할 수 있습니다" toast + /home 리다이렉트
- /brewery/verify → ❌ "양조장 계정만 접근할 수 있습니다" toast + /home 리다이렉트
```

#### 3. MyPage UI 확인
```
/mypage:
✅ "일반 유저" 배지 표시
✅ "양조장 인증" 메뉴 표시
❌ "양조장 대시보드" 버튼 미표시
```

### B. 양조장 계정 (미인증) 테스트

#### 1. 양조장 계정 생성
```
1. 일반 계정으로 로그인 후
2. /mypage → "양조장 인증" 클릭
3. /brewery/verify에서 인증 정보 입력
   - 사업자번호: 123-45-67890
   - 양조장명: 테스트양조장
   - 지역: 경기 양평
   ✅ 인증 완료 시 → user.type이 "brewery"로 변경
   ✅ user.isBreweryVerified = true
```

#### 2. 인증 전 페이지 접근 테스트
```
인증 전에 URL 직접 입력:
- /brewery/dashboard → ❌ "양조장 인증이 필요합니다" toast + /brewery/verify 리다이렉트
- /brewery/project/terms → ❌ "양조장 인증이 필요합니다" toast + /brewery/verify 리다이렉트
```

### C. 양조장 계정 (인증 완료) 테스트

#### 1. 로그인
```
/login:
- 이메일: brewery@test.com (또는 "brewery"가 포함된 이메일)
✅ 로그인 성공 시 → /brewery/dashboard로 자동 이동
```

#### 2. 양조장 전용 페이지 접근
```
✅ /brewery/dashboard → 접근 가능 (대시보드 표시)
✅ /brewery/project/terms → 접근 가능 (약관 페이지 표시)
✅ /brewery/project/details → 접근 가능 (프로젝트 등록 페이지 표시)
```

#### 3. MyPage UI 확인
```
/mypage:
✅ "양조장 계정" 배지 표시
✅ "양조장 대시보드" 버튼 표시 → /brewery/dashboard 이동
❌ "양조장 인증" 메뉴 미표시
```

#### 4. FundingDetailPage UI 확인
```
/funding/1:
✅ 상단 헤더에 "양조장 대시보드" 아이콘 표시
✅ 알림 아이콘 표시
```

### D. 비로그인 사용자 테스트

#### 1. 보호된 페이지 접근
```
URL 직접 입력 (로그아웃 상태):
- /brewery/dashboard → ❌ "로그인이 필요합니다" toast + /login 리다이렉트
- /brewery/verify → ❌ "로그인이 필요합니다" toast + /login 리다이렉트
```

#### 2. 공개 페이지 접근
```
✅ /home → 접근 가능 (비회원으로 둘러보기)
✅ /funding → 접근 가능
✅ /funding/1 → 접근 가능
✅ /community → 접근 가능
```

## Mock 로그인 계정

### 일반 사용자
```
이메일: user@test.com (또는 "brewery" 미포함 이메일)
비밀번호: 아무거나
→ type: "user"
→ 홈으로 리다이렉트
```

### 양조장
```
이메일: brewery@test.com (또는 "brewery" 포함 이메일)
비밀번호: 아무거나
→ type: "brewery"
→ isBreweryVerified: true (mock)
→ 양조장 대시보드로 리다이렉트
```

## 권한 체크 흐름도

```
사용자 접근
    ↓
ProtectedRoute 체크
    ↓
로그인 여부? ─── NO → /login + toast
    ↓ YES
사용자 타입 확인
    ↓
requiredType 일치? ─── NO → /home + toast
    ↓ YES
requireVerified 필요?
    ↓ YES
양조장 인증 완료? ─── NO → /brewery/verify + toast
    ↓ YES
페이지 렌더링
```

## 확인 완료 사항

- ✅ ProtectedRoute 컴포넌트 생성
- ✅ 양조장 전용 라우트에 ProtectedRoute 적용
- ✅ 권한 없을 때 적절한 toast 메시지 표시
- ✅ 권한 없을 때 적절한 페이지로 리다이렉트
- ✅ MyPage 권한별 UI 분기
- ✅ FundingDetailPage 권한별 헤더 아이콘
- ✅ LoginPage 사용자 타입별 리다이렉트
- ✅ SignupPage 회원가입 플로우 개선
- ✅ 중복 권한 체크 제거
