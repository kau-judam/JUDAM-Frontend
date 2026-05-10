import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 로깅 서비스에 전송 (예: Sentry, LogRocket)
    console.error("Error caught by boundary:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    // 페이지 새로고침
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = "/home";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
              {/* 에러 아이콘 */}
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>

              {/* 제목 */}
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                문제가 발생했습니다
              </h2>

              {/* 설명 */}
              <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                예상치 못한 오류가 발생했습니다.<br />
                잠시 후 다시 시도해주세요.
              </p>

              {/* 에러 상세 정보 (개발 환경에서만 표시) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl text-left">
                  <p className="text-xs font-mono text-red-600 mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs font-mono text-gray-600">
                      <summary className="cursor-pointer mb-2">Stack trace</summary>
                      <pre className="whitespace-pre-wrap overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* 액션 버튼 */}
              <div className="space-y-3">
                <Button
                  onClick={this.handleReset}
                  className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  다시 시도
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="w-full h-12 border-2 border-gray-200 hover:border-gray-900 bg-white rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  홈으로 이동
                </Button>
              </div>

              {/* 헬프 링크 */}
              <p className="text-xs text-gray-400 mt-6">
                문제가 계속되면{" "}
                <a href="/faq" className="text-gray-600 hover:text-gray-900 underline">
                  고객센터
                </a>
                로 문의해주세요
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
