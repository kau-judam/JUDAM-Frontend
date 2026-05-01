# 🍶 JUDAM-Frontend 
> **주담: 다시 피어나는 우리 술 이야기**  
> 소비자 맞춤형 전통주 공동 기획 펀딩 플랫폼

---

## 프로젝트 소개

**주담**은 전통주 시장의 변화에 발맞추어 규제 완화와 인프라 구축을 기반으로, 모디슈머와 팬슈머 트렌드를 연결하는 **양방향 전통주 펀딩 서비스**입니다.
- **핵심 가치**: 취향 기반 술BTI 큐레이션, 소비자 참여형 레시피 제안 및 상용화 펀딩

---

## Front-end 팀 소개

| 이름 | 학과 |
| :---: | :--- | :--- |
| **권아영** | 소프트웨어학과 |
| **강민재** | 소프트웨어학과 |

---

## 기술 스택

### **Core**
- `React 19` / `React Native 0.81.5`
- `Expo SDK 54` / `Expo Router 6`
- `TypeScript` (Strict Mode)

### **Libraries**
- **Navigation**: `Expo Router`, `React Navigation`
- **Animation**: `React Native Reanimated`, `Haptics`
- **UI & Icons**: `React Native SVG`, `Lucide React Native`, `Linear Gradient`
- **Storage**: `AsyncStorage` (SafeStorage Wrapper)

---

## 프로젝트 구조

확장성과 유지보수를 위해 **Feature-based** 구조를 채택

- **`app/`**: Expo Router 엔트리 (Route 설정 및 Re-export 전용)
- **`src/features/`**: 서비스 기능별 독립 폴더 (HomeScreen, FundingScreen 등)
- **`src/components/`**: 공용 UI 컴포넌트 및 기본 원자 단위 UI
- **`src/contexts/`**: 전역 상태 관리 (Auth, Funding, Community 등)
- **`src/constants/`**: 글로벌 테마(`theme.ts`) 및 Mock 데이터 관리
- **`src/utils/`**: 공통 유틸리티 (SafeStorage 등)

---

## 라우트 구조

5탭 구조를 통해 직관적인 UX를 제공

1. **홈 (`/`)**: 맞춤형 전통주 피드 및 메인 배너
2. **주담 (`/recipe`)**: 소비자 레시피 제안 및 AI 맛 예측
3. **펀딩 (`/funding`)**: 진행 중인 프로젝트 리스트 및 후원
4. **커뮤니티 (`/community`)**: 정보 공유 및 자유 게시판
5. **마이페이지 (`/mypage`)**: 술BTI 히스토리 및 활동 아카이브
