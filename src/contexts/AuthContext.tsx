import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import SafeStorage from "@/utils/storage";
import {
  clearAuthTokens,
  completeKakaoSignup,
  loginWithEmail,
  loginWithKakaoCode as requestKakaoLogin,
  saveAuthTokens,
  signupWithEmail,
  updateMyRole,
  type AuthApiUser,
  type AuthRole,
  type KakaoLoginResponse,
  type SelectableAuthRole,
} from "@/features/auth/api";
import { digitsOnly } from "@/utils/validation";
import type { BtiTasteAxisValues } from "@/features/bti/data";

export type UserType = "user" | "brewery";

export interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  type: UserType;
  isBreweryVerified?: boolean;
  breweryName?: string;
  breweryLocation?: string;
  breweryLocationDetail?: string;
  businessNumber?: string;
  sulbti?: string;
  sulbtiProfile?: BtiTasteAxisValues;
  sulbtiFoodPairing?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthReady: boolean;
  login: (email: string, password: string, type: UserType, keepLoggedIn?: boolean) => Promise<User>;
  loginWithKakaoCode: (code: string, keepLoggedIn?: boolean) => Promise<KakaoLoginResult>;
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
      email?: string;
      nickname?: string;
      profileImage?: string | null;
      kakaoId?: string | number;
      kakaoSignupToken?: string;
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
    phone: apiUser.phoneNumber || undefined,
    profileImage: apiUser.profileImage || undefined,
    type,
    isBreweryVerified: type === "brewery" ? isVerifiedBreweryRole(apiUser.role) : undefined,
  };
}

function getKakaoSignupPayload(session: KakaoLoginResponse): Extract<KakaoLoginResult, { status: "signupRequired" }> {
  const user = session.user;
  return {
    status: "signupRequired",
    email: session.email || session.kakaoEmail || user?.email,
    nickname: session.nickname || session.kakaoNickname || user?.nickname,
    profileImage: session.profileImage || user?.profileImage,
    kakaoId: session.kakaoId,
    kakaoSignupToken: session.kakaoSignupToken,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const keepLoggedIn = await SafeStorage.getItem(KEEP_LOGIN_KEY);
        const savedUser = await SafeStorage.getItem("judam_user");
        if (keepLoggedIn !== "true") {
          if (savedUser) {
            await SafeStorage.removeItem("judam_user");
            await clearAuthTokens();
          }
          return;
        }
        if (savedUser) {
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
    const nextUser = mapAuthApiUser(session.user, type);
    setUser(nextUser);
    try {
      await SafeStorage.setItem("judam_user", JSON.stringify(nextUser));
      await saveAuthTokens(session.accessToken, session.refreshToken);
      await SafeStorage.setItem(KEEP_LOGIN_KEY, keepLoggedIn ? "true" : "false");
    } catch (e) {
      console.error("Failed to save user to SafeStorage", e);
    }

    return nextUser;
  };

  const loginWithKakaoCode = async (code: string, keepLoggedIn = false) => {
    const session = await requestKakaoLogin(code);
    const apiUser = session?.user;
    const shouldSignup =
      Boolean(session?.isNewUser || session?.signupRequired || session?.requiresSignup) || !apiUser;

    if (shouldSignup || !apiUser) {
      return getKakaoSignupPayload(session);
    }
    const nextUser = mapAuthApiUser(apiUser);
    setUser(nextUser);
    try {
      await SafeStorage.setItem("judam_user", JSON.stringify(nextUser));
      await saveAuthTokens(session.accessToken, session.refreshToken);
      await SafeStorage.setItem(KEEP_LOGIN_KEY, keepLoggedIn ? "true" : "false");
    } catch (e) {
      console.error("Failed to save Kakao user to SafeStorage", e);
    }

    return { status: "loggedIn" as const, user: nextUser };
  };

  const logout = async () => {
    setUser(null);
    try {
      await SafeStorage.removeItem("judam_user");
      await SafeStorage.removeItem(KEEP_LOGIN_KEY);
      await SafeStorage.removeItem("judam_onboarded");
      await clearAuthTokens();
    } catch (e) {
      console.error("Failed to remove user from SafeStorage", e);
    }
  };

  const signup = async (data: SignupData) => {
    const role: SelectableAuthRole = data.type === "brewery" ? "BREWERY_PENDING" : "USER";
    const signupPayload = {
      email: data.email.trim().toLowerCase(),
      password: data.password,
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
      : await signupWithEmail(signupPayload);
    const fallbackUser: AuthApiUser = {
      userId: Math.random().toString(36).slice(2, 11),
      email: data.email.trim().toLowerCase(),
      nickname: data.name.trim(),
      phoneNumber: digitsOnly(data.phone || ""),
      role,
    };
    const nextUser = mapAuthApiUser(session?.user || fallbackUser, data.type);

    setUser(nextUser);
    try {
      await SafeStorage.setItem("judam_user", JSON.stringify(nextUser));
      await saveAuthTokens(session?.accessToken, session?.refreshToken);
      await SafeStorage.setItem(KEEP_LOGIN_KEY, "false");
    } catch (e) {
      console.error("Failed to save user to SafeStorage", e);
    }
  };

  const verifyBrewery = async (data: BreweryVerificationData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!user) {
      throw new Error("Login is required to verify brewery");
    }

    if (user) {
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
