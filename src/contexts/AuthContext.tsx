import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import SafeStorage from "@/utils/storage";
import type { BtiTasteAxisValues } from "@/features/bti/data";

export type UserType = "user" | "brewery";

export interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  phone?: string;
  type: UserType;
  isBreweryVerified?: boolean;
  breweryName?: string;
  breweryLocation?: string;
  breweryLocationDetail?: string;
  businessNumber?: string;
  sulbti?: string;
  sulbtiProfile?: BtiTasteAxisValues;
}

interface AuthContextType {
  user: User | null;
  isAuthReady: boolean;
  login: (email: string, password: string, type: UserType, keepLoggedIn?: boolean) => Promise<User>;
  logout: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  verifyBrewery: (data: BreweryVerificationData) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  type: UserType;
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

function generateUID(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "JD-";
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TEMP_USER_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJlbWFpbCI6InRlc3QtY29uc3VtZXJAanVkYW0uY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3NzgwODc4NjYsImV4cCI6MTc3ODY5MjY2Nn0.BtGpz_7jGpN0ePz3LXxFhuQ22CkKm2Etr8cKh-6OPm8";
const TEMP_BREWERY_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwicHJvdmlkZXIiOiJrYWthbyIsInJvbGUiOiJCUkVXRVJZIiwiaWF0IjoxNzc4MTUzMTA1LCJleHAiOjE3Nzg3NTc5MDV9.Z5bfCtuy3JCZdIV-NYUsiQ0g8MOHH29LWNblO_v2jZo";
const KEEP_LOGIN_KEY = "judam_keep_login";

function getTemporaryAccessToken(type: UserType) {
  return type === "brewery" ? TEMP_BREWERY_ACCESS_TOKEN : TEMP_USER_ACCESS_TOKEN;
}

function getTemporaryLoginType(email: string, password: string, fallbackType: UserType) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim().toLowerCase();
  if (normalizedEmail === "user@judam.test" && normalizedPassword === "judam123") return "user";
  if (normalizedEmail === "brewery@judam.test" && normalizedPassword === "judam123") return "brewery";
  return fallbackType;
}

function normalizeTemporaryUser(user: User): User {
  if (user.type === "user" && user.id === "2" && user.name === "테스트 사용자") {
    return { ...user, name: "테스트소비자" };
  }
  return user;
}

async function saveTemporaryAccessToken(type: UserType) {
  await SafeStorage.setItem("judam_access_token", getTemporaryAccessToken(type));
}

async function removeTemporaryAccessToken() {
  await SafeStorage.removeItem("judam_access_token");
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
            await removeTemporaryAccessToken();
          }
          return;
        }
        if (savedUser) {
          const parsedUser = normalizeTemporaryUser(JSON.parse(savedUser) as User);
          const savedToken = await SafeStorage.getItem("judam_access_token");
          const expectedToken = getTemporaryAccessToken(parsedUser.type);
          if (savedToken !== expectedToken) {
            await saveTemporaryAccessToken(parsedUser.type);
          }
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

  const login = async (email: string, password: string, type: UserType, keepLoggedIn = true) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const loginType = getTemporaryLoginType(email, password, type);

    const mockUser: User = {
      id: loginType === "brewery" ? "1" : "2",
      uid: loginType === "brewery" ? "JD-BREW0001" : "JD-USER0002",
      name: loginType === "brewery" ? "술샘양조장" : "테스트소비자",
      email,
      phone: "010-1234-5678",
      type: loginType,
      isBreweryVerified: loginType === "brewery" ? true : undefined,
      breweryName: loginType === "brewery" ? "술샘양조장" : undefined,
      breweryLocation: loginType === "brewery" ? "경기 양평" : undefined,
      breweryLocationDetail: loginType === "brewery" ? "누룩길 12" : undefined,
      businessNumber: loginType === "brewery" ? "123-45-67890" : undefined,
    };

    setUser(mockUser);
    try {
      await SafeStorage.setItem("judam_user", JSON.stringify(mockUser));
      await saveTemporaryAccessToken(loginType);
      await SafeStorage.setItem(KEEP_LOGIN_KEY, keepLoggedIn ? "true" : "false");
    } catch (e) {
      console.error("Failed to save user to SafeStorage", e);
    }

    return mockUser;
  };

  const logout = async () => {
    setUser(null);
    try {
      await SafeStorage.removeItem("judam_user");
      await SafeStorage.removeItem(KEEP_LOGIN_KEY);
      await SafeStorage.removeItem("judam_onboarded");
      await removeTemporaryAccessToken();
    } catch (e) {
      console.error("Failed to remove user from SafeStorage", e);
    }
  };

  const signup = async (data: SignupData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      uid: generateUID(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      type: data.type,
      isBreweryVerified: false,
      breweryName: data.breweryName,
      breweryLocation: data.breweryLocation,
      breweryLocationDetail: data.breweryLocationDetail,
    };

    setUser(mockUser);
    try {
      await SafeStorage.setItem("judam_user", JSON.stringify(mockUser));
      await saveTemporaryAccessToken(data.type);
      await SafeStorage.setItem(KEEP_LOGIN_KEY, "true");
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
        await saveTemporaryAccessToken("brewery");
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

  return (
    <AuthContext.Provider value={{ user, isAuthReady, login, logout, signup, verifyBrewery, updateUser }}>
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
