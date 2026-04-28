import { createContext, useContext, useState, ReactNode } from "react";

export type UserType = "user" | "brewery";

export interface User {
  id: string;
  uid: string;        // 변경 불가 고유 ID (JD-XXXXXXXX 형식)
  name: string;
  email: string;
  phone?: string;
  type: UserType;
  isBreweryVerified?: boolean;
  breweryName?: string;
  breweryLocation?: string;
  businessNumber?: string;
  sulbti?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, type: UserType) => Promise<void>;
  logout: () => void;
  signup: (data: SignupData) => Promise<void>;
  verifyBrewery: (data: BreweryVerificationData) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  type: UserType;
  breweryName?: string;
  breweryLocation?: string;
}

interface BreweryVerificationData {
  businessNumber: string;
  businessLicense?: File | null;
  breweryName: string;
  breweryLocation: string;
  phone: string;
}

/** 고유 UID 생성: JD-XXXXXXXX */
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
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("judam_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

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
    };

    setUser(mockUser);
    localStorage.setItem("judam_user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("judam_user");
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
    };

    setUser(mockUser);
    localStorage.setItem("judam_user", JSON.stringify(mockUser));
  };

  const verifyBrewery = async (data: BreweryVerificationData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (user) {
      const updatedUser: User = {
        ...user,
        type: "brewery",
        isBreweryVerified: true,
        breweryName: data.breweryName,
        breweryLocation: data.breweryLocation,
        businessNumber: data.businessNumber,
        phone: data.phone,
      };
      setUser(updatedUser);
      localStorage.setItem("judam_user", JSON.stringify(updatedUser));
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("judam_user", JSON.stringify(updatedUser));
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