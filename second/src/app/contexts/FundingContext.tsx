import { createContext, useContext, useState, ReactNode } from "react";
import { fundingProjects, FundingProject, ProjectStatus } from "../data/fundingData";

interface ParticipatedFunding {
  fundingId: number;
  amount: number;
  date: string;
}

interface FundingContextType {
  projects: FundingProject[];
  participatedFundings: ParticipatedFunding[];
  addParticipation: (fundingId: number, amount: number) => void;
  addProject: (project: Omit<FundingProject, "id">) => void;
  updateProjectJournals: (projectId: number, journals: import("../data/fundingData").JournalEntry[]) => void;
  updateProjectStatus: (projectId: number, status: ProjectStatus) => void;
  updateProjectFunding: (projectId: number, amount: number) => void;
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
  const [projects, setProjects] = useState<FundingProject[]>(fundingProjects);
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

  const addProject = (project: Omit<FundingProject, "id">) => {
    const newId = Math.max(...projects.map((p) => p.id), 0) + 1;
    const newProject: FundingProject = { ...project, id: newId };
    setProjects((prev) => [newProject, ...prev]);
  };

  const updateProjectJournals = (projectId: number, journals: import("../data/fundingData").JournalEntry[]) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, journals } : p))
    );
  };

  const updateProjectStatus = (projectId: number, status: ProjectStatus) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status, updatedAt: new Date().toISOString() } : p))
    );
  };

  const updateProjectFunding = (projectId: number, amount: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const newCurrentAmount = p.currentAmount + amount;
          const newBackers = p.backers + 1;
          const progress = (newCurrentAmount / p.goalAmount) * 100;

          // 목표 달성 시 상태 자동 업데이트
          let newStatus = p.status;
          if (progress >= 100 && (p.status === "진행 중" || p.status === "펀딩 예정")) {
            newStatus = "목표 달성";
          }

          return {
            ...p,
            currentAmount: newCurrentAmount,
            backers: newBackers,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
  };

  return (
    <FundingContext.Provider value={{ projects, participatedFundings, addParticipation, addProject, updateProjectJournals, updateProjectStatus, updateProjectFunding }}>
      {children}
    </FundingContext.Provider>
  );
}

export function useFunding() {
  const ctx = useContext(FundingContext);
  if (!ctx) throw new Error("useFunding must be used within FundingProvider");
  return ctx;
}