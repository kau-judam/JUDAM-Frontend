import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router";

export function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType(); // "PUSH" | "REPLACE" | "POP"

  useEffect(() => {
    // POP = 뒤로가기/앞으로가기 → 브라우저 자체 스크롤 위치 복원에 맡긴다
    if (navigationType !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);

  return null;
}