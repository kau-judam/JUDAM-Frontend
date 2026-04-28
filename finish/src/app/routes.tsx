import { createBrowserRouter, Outlet, Navigate } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { BTITestPage } from "./pages/BTITestPage";
import { BTIResultPage } from "./pages/BTIResultPage";
import { FundingListPage } from "./pages/FundingListPage";
import { FundingDetailPage } from "./pages/FundingDetailPage";
import { MyPage } from "./pages/MyPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { UserTypeSelectionPage } from "./pages/UserTypeSelectionPage";
import { BreweryVerificationPage } from "./pages/BreweryVerificationPage";
import { BreweryDashboardPage } from "./pages/BreweryDashboardPage";
import { CreateProjectDetailPage } from "./pages/CreateProjectDetailPage";
import { BreweryProjectTermsPage } from "./pages/BreweryProjectTermsPage";
import { ArchivePage } from "./pages/ArchivePage";
import { ArchiveDetailPage } from "./pages/ArchiveDetailPage";
import { AddArchivePage } from "./pages/AddArchivePage";
import { RecipeCreationPage } from "./pages/RecipeCreationPage";
import { CommunityPage } from "./pages/CommunityPage";
import { CreatePostPage } from "./pages/CreatePostPage";
import { PostDetailPage } from "./pages/PostDetailPage";
import { RecipeDetailPage } from "./pages/RecipeDetailPage";
import { ReviewDetailPage } from "./pages/ReviewDetailPage";
import { FundingReviewWritePage } from "./pages/FundingReviewWritePage";
import { FundingOrderDetailPage } from "./pages/FundingOrderDetailPage";
import { BreweryPage } from "./pages/BreweryPage";
import { FundingSupportPage } from "./pages/FundingSupportPage";
import { AIChatPage } from "./pages/AIChatPage";
import { AIChatRoomPage } from "./pages/AIChatRoomPage";
import { NotificationPage } from "./pages/NotificationPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AnnouncementPage } from "./pages/AnnouncementPage";
import { FundedProjectsPage } from "./pages/FundedProjectsPage";
import { MyPostsPage } from "./pages/MyPostsPage";
import { TermsPage } from "./pages/TermsPage";
import { RecipePage } from "./pages/RecipePage";
import { PasswordResetPage } from "./pages/PasswordResetPage";
import { FAQPage } from "./pages/FAQPage";

// Smart root index: first visit → onboarding, returning user → home
function RootIndex() {
  const hasOnboarded = localStorage.getItem("judam_onboarded");
  return hasOnboarded ? <Navigate to="/home" replace /> : <Navigate to="/onboarding" replace />;
}

// Root component wrapper for context
function Root() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* Mobile App Container - iPhone 16 Pro Max (430px) */}
      <div className="w-full max-w-[430px] bg-white min-h-screen shadow-2xl relative">
        <Outlet />
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      // Standalone pages (without bottom nav)
      {
        index: true,
        Component: RootIndex,
      },
      {
        path: "onboarding",
        Component: OnboardingPage,
      },
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "signup",
        Component: SignupPage,
      },
      {
        path: "user-type-selection",
        Component: UserTypeSelectionPage,
      },
      {
        path: "password-reset",
        Component: PasswordResetPage,
      },
      // Main app with layout
      {
        path: "/",
        Component: RootLayout,
        children: [
          { index: true, Component: HomePage },
          { path: "home", Component: HomePage },
          { path: "bti-test", Component: BTITestPage },
          { path: "bti-result/:type", Component: BTIResultPage },
          { path: "recipe", Component: RecipePage },
          { path: "recipe/create", Component: RecipeCreationPage },
          { path: "recipe/:id", Component: RecipeDetailPage },
          { path: "community", Component: CommunityPage },
          { path: "community/post/create", Component: CreatePostPage },
          { path: "community/post/:postId", Component: PostDetailPage },
          { path: "funding", Component: FundingListPage },
          { path: "funding/:projectId/review/:reviewId", Component: ReviewDetailPage },
          { path: "funding/:id/support", Component: FundingSupportPage },
          { path: "funding/:id", Component: FundingDetailPage },
          { path: "mypage", Component: MyPage },
          {
            path: "brewery/verify",
            Component: BreweryVerificationPage, // 로그인한 모든 사용자 접근 가능 (인증받으러 오는 페이지)
          },
          {
            path: "brewery/dashboard",
            element: (
              <ProtectedRoute requiredType="brewery" requireVerified>
                <BreweryDashboardPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "brewery/project/terms",
            element: (
              <ProtectedRoute requiredType="brewery" requireVerified>
                <BreweryProjectTermsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "brewery/project/details",
            element: (
              <ProtectedRoute requiredType="brewery" requireVerified>
                <CreateProjectDetailPage />
              </ProtectedRoute>
            ),
          },
          { path: "archive", Component: ArchivePage },
          { path: "archive/add", Component: AddArchivePage },
          { path: "archive/review/:fundingId", Component: FundingReviewWritePage },
          { path: "archive/order/:id", Component: FundingOrderDetailPage },
          { path: "archive/:id", Component: ArchiveDetailPage },
          { path: "archive/:id/edit", Component: AddArchivePage },
          { path: "brewery/:id", Component: BreweryPage },
          { path: "ai-chat", Component: AIChatPage },
          { path: "ai-chat/:category/:roomId", Component: AIChatRoomPage },
          { path: "notifications", Component: NotificationPage },
          { path: "settings", Component: SettingsPage },
          { path: "announcements", Component: AnnouncementPage },
          { path: "mypage/funded", Component: FundedProjectsPage },
          { path: "mypage/posts", Component: MyPostsPage },
          { path: "terms", Component: TermsPage },
          { path: "faq", Component: FAQPage },
          { path: "*", Component: NotFoundPage },
        ],
      },
    ],
  },
]);