import { createContext, useContext, useState, ReactNode } from "react";
import { fundingProjects, FundingProject } from "../finish/src/app/data/fundingData";

interface ParticipatedFunding {
  fundingId: number;
  amount: number;
  date: string;
}

interface FundingContextType {
  projects: FundingProject[];
  participatedFundings: ParticipatedFunding[];
  addParticipation: (fundingId: number, amount: number) => void;
}

// Demo: seed some initial participations so the page isn't empty
const initialParticipations: ParticipatedFunding[] = [
  { fundingId: 1, amount: 50000, date: "2026.03.15" },
  { fundingId: 2, amount: 35000, date: "2026.02.28" },
  { fundingId: 3, amount: 80000, date: "2026.03.22" },
  { fundingId: 4, amount: 120000, date: "2026.01.05" },
  { fundingId: 5, amount: 45000, date: "2026.01.10" },
  { fundingId: 6, amount: 62000, date: "2025.12.20" },
];

const FundingContext = createContext<FundingContextType | undefined>(undefined);

export function FundingProvider({ children }: { children: ReactNode }) {
  const [projects] = useState<FundingProject[]>(fundingProjects);
  const [participatedFundings, setParticipatedFundings] = useState<ParticipatedFunding[]>(
    initialParticipations
  );

  const addParticipation = (fundingId: number, amount: number) => {
    const today = new Date();
    const date = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(
      today.getDate()
    ).padStart(2, "0")}`;
    setParticipatedFundings((prev) => {
      // Avoid duplicate
      if (prev.some((p) => p.fundingId === fundingId)) return prev;
      return [{ fundingId, amount, date }, ...prev];
    });
  };

  return (
    <FundingContext.Provider value={{ projects, participatedFundings, addParticipation }}>
      {children}
    </FundingContext.Provider>
  );
}

export function useFunding() {
  const ctx = useContext(FundingContext);
  if (!ctx) throw new Error("useFunding must be used within FundingProvider");
  return ctx;
}
