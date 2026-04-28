import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth, UserType } from "../contexts/AuthContext";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredType?: UserType;
  requireVerified?: boolean;
}

/**
 * 권한별 페이지 접근 제어 컴포넌트
 *
 * @param requiredType - 필요한 사용자 타입 ("user" | "brewery")
 * @param requireVerified - 양조장 인증 필요 여부 (brewery type일 때만 적용)
 */
export function ProtectedRoute({
  children,
  requiredType,
  requireVerified = false,
}: ProtectedRouteProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. 로그인 체크
    if (!user) {
      toast.error("로그인이 필요합니다.");
      navigate("/login", { replace: true });
      return;
    }

    // 2. 사용자 타입 체크
    if (requiredType && user.type !== requiredType) {
      if (requiredType === "brewery") {
        toast.error("양조장 계정만 접근할 수 있습니다.");
      } else {
        toast.error("일반 사용자 계정만 접근할 수 있습니다.");
      }
      navigate("/home", { replace: true });
      return;
    }

    // 3. 양조장 인증 체크
    if (requireVerified && user.type === "brewery" && !user.isBreweryVerified) {
      toast.error("양조장 인증이 필요합니다.");
      navigate("/brewery/verify", { replace: true });
      return;
    }
  }, [user, requiredType, requireVerified, navigate]);

  // 권한 체크가 완료되기 전에는 아무것도 렌더링하지 않음
  if (!user) {
    return null;
  }

  if (requiredType && user.type !== requiredType) {
    return null;
  }

  if (requireVerified && user.type === "brewery" && !user.isBreweryVerified) {
    return null;
  }

  return <>{children}</>;
}
