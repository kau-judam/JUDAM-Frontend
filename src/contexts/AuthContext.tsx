import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { Linking } from "react-native";
import { router } from "expo-router";
import SafeStorage from "@/utils/storage";
import {
  clearAuthTokens,
  completeKakaoSignup,
  getAuthAccessToken,
  getAuthSessionAccessToken,
  getAuthSessionRefreshToken,
  loginWithEmail,
  loginWithKakaoCode as requestKakaoLogin,
  saveAuthTokens,
  signupWithEmail,
  updateMyRole,
  updateMyBreweryApplication,
  type AuthApiUser,
  type AuthRole,
  type KakaoLoginResponse,
  type SelectableAuthRole,
} from "@/features/auth/api";
import { digitsOnly } from "@/utils/validation";
import { clearPendingExternalPayment, hasRecentPendingExternalPayment } from "@/utils/externalFlow";
import type { BtiTasteAxisValues } from "@/features/bti/data";
import {
  beginKakaoCallbackHandling,
  clearPendingKakaoAuthRequest,
  finishKakaoCallbackHandling,
  getKakaoCallbackCode,
  getPendingKakaoAuthRequest,
  isKakaoCallbackUrl,
} from "@/features/auth/kakaoAuth";

export type UserType = "user" | "brewery";

export interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  role?: AuthRole;
  phone?: string;
  profileImage?: string;
  type: UserType;
  isBreweryVerified?: boolean;
  breweryName?: string;
  breweryLocation?: string;
  breweryLocationDetail?: string;
  breweryBrandStory?: string;
  breweryDescription?: string;
  breweryBrandStoryLong?: string;
  breweryHistory?: string;
  breweryEstablished?: string;
  breweryProfileImage?: string;
  breweryContactEmail?: string;
  businessNumber?: string;
  sulbti?: string;
  sulbtiProfile?: BtiTasteAxisValues;
  sulbtiFoodPairing?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthReady: boolean;
  login: (email: string, password: string, type: UserType, keepLoggedIn?: boolean) => Promise<User>;
  loginWithKakaoCode: (code: string, keepLoggedIn?: boolean, redirectUri?: string) => Promise<KakaoLoginResult>;
  logout: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  verifyBrewery: (data: BreweryVerificationData) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  updateUserRole: (role: SelectableAuthRole) => Promise<User>;
}

export type KakaoLoginResult =
  | { status: "loggedIn"; user: User }
  | {
      status: "signupRequired";
      reason?: string;
      email?: string;
      nickname?: string;
      profileImage?: string | null;
      kakaoId?: string | number;
      kakaoSignupToken?: string;
      existingUserId?: string | number;
    };

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  type: UserType;
  marketingAgreed?: boolean;
  phoneVerificationToken?: string;
  kakaoSignupToken?: string;
  breweryName?: string;
  breweryLocation?: string;
  breweryLocationDetail?: string;
}

interface BreweryVerificationData {
  businessNumber: string;
  businessLicense?: unknown;
  breweryName: string;
  breweryLocation: string;
  breweryLocationDetail?: string;
  phone: string;
}

function generateUID(prefix = "JD"): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = `${prefix}-`;
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const KEEP_LOGIN_KEY = "judam_keep_login";

function normalizeTemporaryUser(user: User): User {
  if (user.type === "user" && user.id === "2" && user.name === "테스트 사용자") {
    return { ...user, name: "테스트소비자" };
  }
  return user;
}

function mapAuthRoleToUserType(role?: AuthRole): UserType {
  const normalizedRole = String(role || "").toUpperCase();
  return normalizedRole.includes("BREWERY") ? "brewery" : "user";
}

function isVerifiedBreweryRole(role?: AuthRole) {
  const normalizedRole = String(role || "").toUpperCase();
  return normalizedRole === "BREWERY" || normalizedRole === "BREWERY_APPROVED";
}

function mapAuthApiUser(apiUser: AuthApiUser, fallbackType: UserType = "user"): User {
  const type = apiUser.role ? mapAuthRoleToUserType(apiUser.role) : fallbackType;
  return {
    id: String(apiUser.userId),
    uid: generateUID(type === "brewery" ? "JD-BREW" : "JD-USER"),
    name: apiUser.nickname,
    email: apiUser.email,
    role: apiUser.role,
    phone: apiUser.phoneNumber || undefined,
    profileImage: apiUser.profileImage || undefined,
    type,
    isBreweryVerified: type === "brewery" ? isVerifiedBreweryRole(apiUser.role) : undefined,
  };
}

function getKakaoProfileEmail(profile?: KakaoLoginResponse["kakaoProfile"]) {
  return profile?.email || profile?.kakao_account?.email || profile?.kakaoAccount?.email;
}

function getKakaoProfileNickname(profile?: KakaoLoginResponse["kakaoProfile"]) {
  return (
    profile?.nickname ||
    profile?.properties?.nickname ||
    profile?.kakao_account?.profile?.nickname ||
    profile?.kakaoAccount?.profile?.nickname
  );
}

function getKakaoProfileImage(profile?: KakaoLoginResponse["kakaoProfile"]) {
  return (
    profile?.profileImage ||
    profile?.profileImageUrl ||
    profile?.profile_image_url ||
    profile?.thumbnail_image_url ||
    profile?.properties?.profile_image ||
    profile?.properties?.thumbnail_image ||
    profile?.kakao_account?.profile?.profile_image_url ||
    profile?.kakao_account?.profile?.thumbnail_image_url ||
    profile?.kakaoAccount?.profile?.profileImageUrl ||
    profile?.kakaoAccount?.profile?.thumbnailImageUrl
  );
}

function getKakaoSignupPayload(session: KakaoLoginResponse): Extract<KakaoLoginResult, { status: "signupRequired" }> {
  const user = session.user;
  const kakaoProfile = session.kakaoProfile;
  return {
    status: "signupRequired",
    reason: session.reason,
    email: session.email || session.kakaoEmail || getKakaoProfileEmail(kakaoProfile) || user?.email,
    nickname: session.nickname || session.kakaoNickname || getKakaoProfileNickname(kakaoProfile) || user?.nickname,
    profileImage: session.profileImage || getKakaoProfileImage(kakaoProfile) || user?.profileImage,
    kakaoId: session.kakaoId,
    kakaoSignupToken: session.kakaoSignupToken,
    existingUserId: session.existingUserId,
  };
}

function isIncompleteKakaoUser(session: KakaoLoginResponse) {
  const provider = String(session.user?.provider || "").toLowerCase();
  if (provider !== "kakao") return false;

  return !session.user?.email || !session.user?.phoneNumber;
}

function assertAuthSessionToken(session: { accessToken?: string; access_token?: string; token?: string; jwt?: string } | null | undefined) {
  if (!getAuthSessionAccessToken(session)) {
    throw new Error("로그인 응답에서 accessToken을 받지 못했습니다. 다시 로그인해주세요.");
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const keepLoggedIn = await SafeStorage.getItem(KEEP_LOGIN_KEY);
        const savedUser = await SafeStorage.getItem("judam_user");
        const hasPendingExternalPayment = await hasRecentPendingExternalPayment();
        if (keepLoggedIn !== "true" && !hasPendingExternalPayment) {
          await SafeStorage.removeItem("judam_user");
          await clearAuthTokens();
          return;
        }
        if (savedUser) {
          const accessToken = await getAuthAccessToken();
          if (!accessToken) {
            await SafeStorage.removeItem("judam_user");
            await SafeStorage.removeItem(KEEP_LOGIN_KEY);
            await clearAuthTokens();
            return;
          }
          const parsedUser = normalizeTemporaryUser(JSON.parse(savedUser) as User);
          await SafeStorage.setItem("judam_user", JSON.stringify(parsedUser));
          setUser(parsedUser);
        }
      } catch (e) {
        console.error("Failed to load user from SafeStorage", e);
      } finally {
        setIsAuthReady(true);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string, type: UserType, keepLoggedIn = false) => {
    const session = await loginWithEmail(email.trim().toLowerCase(), password);
    assertAuthSessionToken(session);
    const nextUser = mapAuthApiUser(session.user, type);
    try {
      await saveAuthTokens(getAuthSessionAccessToken(session), getAuthSessionRefreshToken(session));
      await SafeStorage.setItem(KEEP_LOGIN_KEY, keepLoggedIn ? "true" : "false");
      await SafeStorage.setItem("judam_user", JSON.stringify(nextUser));
    } catch (e) {
      console.error("Failed to save user to SafeStorage", e);
    }
    setUser(nextUser);

    return nextUser;
  };

  const loginWithKakaoCode = useCallback(async (code: string, keepLoggedIn = false, redirectUri?: string) => {
    const session = await requestKakaoLogin(code, redirectUri);
    const apiUser = session?.user;
    const shouldSignup =
      Boolean(session?.isNewUser || session?.signupRequired || session?.requiresSignup) ||
      isIncompleteKakaoUser(session) ||
      !apiUser;

    if (shouldSignup || !apiUser) {
      return getKakaoSignupPayload(session);
    }
    assertAuthSessionToken(session);
    const nextUser = mapAuthApiUser(apiUser);
    try {
      await saveAuthTokens(getAuthSessionAccessToken(session), getAuthSessionRefreshToken(session));
      await SafeStorage.setItem(KEEP_LOGIN_KEY, keepLoggedIn ? "true" : "false");
      await SafeStorage.setItem("judam_user", JSON.stringify(nextUser));
    } catch (e) {
      console.error("Failed to save Kakao user to SafeStorage", e);
    }
    setUser(nextUser);

    return { status: "loggedIn" as const, user: nextUser };
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    const handleKakaoCallbackUrl = async (url: string | null) => {
      if (!url || !isKakaoCallbackUrl(url) || !beginKakaoCallbackHandling(url)) return;

      try {
        const code = getKakaoCallbackCode(url);
        const pendingRequest = await getPendingKakaoAuthRequest();
        const kakaoResult = await loginWithKakaoCode(
          code,
          Boolean(pendingRequest?.keepLoggedIn),
          pendingRequest?.redirectUri
        );

        await clearPendingKakaoAuthRequest();
        finishKakaoCallbackHandling(url);

        if (kakaoResult.status === "signupRequired") {
          router.replace({
            pathname: "/(auth)/signup",
            params: {
              kakaoEmail: kakaoResult.email,
              kakaoNickname: kakaoResult.nickname,
              kakaoProfileImage: kakaoResult.profileImage || undefined,
              kakaoId: kakaoResult.kakaoId ? String(kakaoResult.kakaoId) : undefined,
              kakaoSignupToken: kakaoResult.kakaoSignupToken,
              kakaoNeedsProfileCompletion: kakaoResult.kakaoSignupToken ? undefined : "true",
            },
          } as any);
          return;
        }

        router.replace("/(tabs)");
      } catch (error) {
        await clearPendingKakaoAuthRequest();
        finishKakaoCallbackHandling(url);
        console.warn("Failed to handle Kakao callback URL.", error);
        router.replace("/(auth)/login");
      }
    };

    Linking.getInitialURL()
      .then((url) => {
        void handleKakaoCallbackUrl(url);
      })
      .catch((error) => console.warn("Failed to read initial URL.", error));

    const subscription = Linking.addEventListener("url", ({ url }) => {
      void handleKakaoCallbackUrl(url);
    });

    return () => subscription.remove();
  }, [isAuthReady, loginWithKakaoCode]);

  const logout = async () => {
    setUser(null);
    try {
      await SafeStorage.removeItem("judam_user");
      await SafeStorage.removeItem(KEEP_LOGIN_KEY);
      await SafeStorage.removeItem("judam_onboarded");
      await clearPendingExternalPayment();
      await clearAuthTokens();
    } catch (e) {
      console.error("Failed to remove user from SafeStorage", e);
    }
  };

  const signup = async (data: SignupData) => {
    const role: SelectableAuthRole = data.type === "brewery" ? "BREWERY_PENDING" : "USER";
    const signupPayload = {
      email: data.email.trim().toLowerCase(),
      nickname: data.name.trim(),
      phoneNumber: digitsOnly(data.phone || ""),
      termsAgreed: true,
      privacyAgreed: true,
      marketingAgreed: Boolean(data.marketingAgreed),
      role,
      phoneVerificationToken: data.phoneVerificationToken,
    };
    const session = data.kakaoSignupToken
      ? await completeKakaoSignup({
          ...signupPayload,
          kakaoSignupToken: data.kakaoSignupToken,
        })
      : await signupWithEmail({
          ...signupPayload,
          password: data.password,
        });
    if (!session?.user) {
      throw new Error("회원가입 응답에서 사용자 정보를 받지 못했습니다.");
    }
    assertAuthSessionToken(session);
    const nextUser = mapAuthApiUser(session.user, data.type);

    try {
      await saveAuthTokens(getAuthSessionAccessToken(session), getAuthSessionRefreshToken(session));
      await SafeStorage.setItem(KEEP_LOGIN_KEY, "false");
      await SafeStorage.setItem("judam_user", JSON.stringify(nextUser));
    } catch (e) {
      console.error("Failed to save user to SafeStorage", e);
    }
    setUser(nextUser);
  };

  const verifyBrewery = async (data: BreweryVerificationData) => {
    if (!user) {
      throw new Error("Login is required to verify brewery");
    }

    if (!user.isBreweryVerified) {
      throw new Error("승인된 양조장 계정만 정보를 수정할 수 있습니다.");
    }

    await updateMyBreweryApplication({
      breweryName: data.breweryName.trim(),
      location: data.breweryLocation.trim(),
    });

    const updatedUser: User = {
      ...user,
      type: "brewery",
      isBreweryVerified: true,
      breweryName: data.breweryName,
      breweryLocation: data.breweryLocation,
      breweryLocationDetail: data.breweryLocationDetail,
      businessNumber: data.businessNumber,
      phone: data.phone,
    };
    setUser(updatedUser);
    try {
      await SafeStorage.setItem("judam_user", JSON.stringify(updatedUser));
    } catch (e) {
      console.error("Failed to save updated user to SafeStorage", e);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      try {
        await SafeStorage.setItem("judam_user", JSON.stringify(updatedUser));
      } catch (e) {
        console.error("Failed to update user in SafeStorage", e);
      }
    }
  };

  const updateUserRole = async (role: SelectableAuthRole) => {
    const response = await updateMyRole(role);
    const nextUser = mapAuthApiUser(response.user, role === "BREWERY_PENDING" ? "brewery" : "user");
    setUser(nextUser);
    try {
      await SafeStorage.setItem("judam_user", JSON.stringify(nextUser));
    } catch (e) {
      console.error("Failed to update user role in SafeStorage", e);
    }
    return nextUser;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthReady, login, loginWithKakaoCode, logout, signup, verifyBrewery, updateUser, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
