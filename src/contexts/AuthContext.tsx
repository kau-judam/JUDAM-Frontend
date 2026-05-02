import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import SafeStorage from "@/utils/storage";

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
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, type: UserType) => Promise<void>;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await SafeStorage.getItem("judam_user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error("Failed to load user from SafeStorage", e);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string, type: UserType) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockUser: User = {
      id: "1",
      uid: "JD-DEMO0001",
      name: type === "brewery" ? "술샘양조장" : "김주담",
      email,
      phone: "010-1234-5678",
      type,
      isBreweryVerified: type === "brewery" ? true : undefined,
      breweryName: type === "brewery" ? "술샘양조장" : undefined,
      breweryLocation: type === "brewery" ? "경기 양평" : undefined,
      breweryLocationDetail: type === "brewery" ? "누룩길 12" : undefined,
      businessNumber: type === "brewery" ? "123-45-67890" : undefined,
    };

    setUser(mockUser);
    try {
      await SafeStorage.setItem("judam_user", JSON.stringify(mockUser));
    } catch (e) {
      console.error("Failed to save user to SafeStorage", e);
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      await SafeStorage.removeItem("judam_user");
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

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, verifyBrewery, updateUser }}>
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
