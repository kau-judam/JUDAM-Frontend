import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { FundingProject, JournalEntry, ProjectStatus, fundingProjects } from "@/constants/data";
import type { FundingReview } from "@/features/funding/reviews";
import type { MyFundingOrderItem } from "@/features/funding/api";

interface ParticipatedFunding {
  fundingId: number;
  amount: number;
  date: string;
}

type FundingReviewInput = Omit<FundingReview, "id" | "date" | "timestamp" | "likes"> & { id?: number; date?: string };

interface FundingContextType {
  projects: FundingProject[];
  participatedFundings: ParticipatedFunding[];
  fundingReviews: FundingReview[];
  addParticipation: (fundingId: number, amount: number) => void;
  mergeParticipationsFromOrders: (orders: MyFundingOrderItem[]) => void;
  addProject: (project: Omit<FundingProject, "id">) => FundingProject;
  updateProject: (projectId: number, project: Partial<Omit<FundingProject, "id">>) => FundingProject | null;
  addFundingReview: (review: FundingReviewInput) => FundingReview;
  updateFundingReview: (reviewId: number, review: Partial<FundingReviewInput>) => FundingReview | null;
  deleteFundingReview: (reviewId: number) => void;
  mergeProjects: (incomingProjects: FundingProject[]) => void;
  mergeProject: (projectId: number, project: Partial<Omit<FundingProject, "id">>) => void;
  mergeFundingReviews: (projectId: number, reviews: FundingReview[]) => void;
  updateProjectJournals: (projectId: number, journals: JournalEntry[]) => void;
  updateProjectStatus: (projectId: number, status: ProjectStatus) => void;
  updateProjectFunding: (projectId: number, amount: number) => void;
}

const FundingContext = createContext<FundingContextType | undefined>(undefined);

export function FundingProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<FundingProject[]>(fundingProjects);
  const [participatedFundings, setParticipatedFundings] = useState<ParticipatedFunding[]>([]);
  const [fundingReviews, setFundingReviews] = useState<FundingReview[]>([]);

  const addParticipation = (fundingId: number, amount: number) => {
    const today = new Date();
    const date = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(
      today.getDate()
    ).padStart(2, "0")}`;
    setParticipatedFundings((prev) => {
      if (prev.some((p) => p.fundingId === fundingId)) return prev;
      return [{ fundingId, amount, date }, ...prev];
    });
  };

  const addProject = (project: Omit<FundingProject, "id">) => {
    const nextProject: FundingProject = {
      ...project,
      id: Math.max(0, ...projects.map((p) => p.id)) + 1,
      createdAt: project.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects((prev) => [nextProject, ...prev]);
    return nextProject;
  };

  const updateProject = (projectId: number, project: Partial<Omit<FundingProject, "id">>) => {
    const currentProject = projects.find((item) => item.id === projectId);
    if (!currentProject) return null;
    const updatedProject: FundingProject = {
      ...currentProject,
      ...project,
      id: projectId,
      createdAt: currentProject.createdAt,
      updatedAt: new Date().toISOString(),
    };
    setProjects((prev) =>
      prev.map((item) =>
        item.id === projectId
          ? {
              ...item,
              ...project,
              id: projectId,
              createdAt: item.createdAt,
              updatedAt: updatedProject.updatedAt,
            }
          : item
      )
    );
    return updatedProject;
  };

  const addFundingReview = (review: FundingReviewInput) => {
    const today = new Date();
    const date = `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, "0")}. ${String(
      today.getDate()
    ).padStart(2, "0")}`;
    const nextReview: FundingReview = {
      ...review,
      id: review.id || Math.max(0, ...fundingReviews.map((item) => item.id)) + 1,
      date: review.date || date,
      timestamp: "방금 전",
      likes: 0,
    };
    setFundingReviews((prev) => [nextReview, ...prev]);
    return nextReview;
  };

  const mergeParticipationsFromOrders = useCallback((orders: MyFundingOrderItem[]) => {
    if (orders.length === 0) return;
    setParticipatedFundings((prev) => {
      const next = [...prev];
      orders.forEach((order) => {
        if (next.some((item) => item.fundingId === order.fundingId)) return;
        const date = order.orderedAt ? order.orderedAt.slice(0, 10).replace(/-/g, ".") : "";
        next.push({
          fundingId: order.fundingId,
          amount: order.totalAmount,
          date,
        });
      });
      return next;
    });
  }, []);

  const updateFundingReview = (reviewId: number, review: Partial<FundingReviewInput>) => {
    const currentReview = fundingReviews.find((item) => item.id === reviewId);
    if (!currentReview) return null;
    const updatedReview: FundingReview = {
      ...currentReview,
      ...review,
      id: reviewId,
      date: review.date || currentReview.date,
      timestamp: "방금 수정",
      likes: currentReview.likes,
    };
    setFundingReviews((prev) => prev.map((item) => (item.id === reviewId ? updatedReview : item)));
    return updatedReview;
  };

  const deleteFundingReview = (reviewId: number) => {
    setFundingReviews((prev) => prev.filter((item) => item.id !== reviewId));
  };

  const mergeProjects = useCallback((incomingProjects: FundingProject[]) => {
    if (incomingProjects.length === 0) return;
    setProjects((prev) => {
      const nextProjects = [...prev];
      incomingProjects.forEach((incomingProject) => {
        const index = nextProjects.findIndex((project) => project.id === incomingProject.id);
        if (index >= 0) {
          nextProjects[index] = {
            ...nextProjects[index],
            ...incomingProject,
            id: nextProjects[index].id,
            createdAt: nextProjects[index].createdAt || incomingProject.createdAt,
            updatedAt: incomingProject.updatedAt || new Date().toISOString(),
          };
        } else {
          nextProjects.push(incomingProject);
        }
      });
      return nextProjects;
    });
  }, []);

  const mergeProject = useCallback((projectId: number, project: Partial<Omit<FundingProject, "id">>) => {
    setProjects((prev) =>
      prev.map((item) =>
        item.id === projectId
          ? {
              ...item,
              ...project,
              id: projectId,
              createdAt: item.createdAt,
              updatedAt: project.updatedAt || new Date().toISOString(),
            }
          : item
      )
    );
  }, []);

  const mergeFundingReviews = useCallback((projectId: number, reviews: FundingReview[]) => {
    if (reviews.length === 0) return;
    setFundingReviews((prev) => {
      const nextReviews = [...prev];
      reviews.forEach((review) => {
        const index = nextReviews.findIndex((item) => item.projectId === projectId && item.id === review.id);
        if (index >= 0) {
          nextReviews[index] = { ...nextReviews[index], ...review };
        } else {
          nextReviews.push(review);
        }
      });
      return nextReviews;
    });
  }, []);

  const updateProjectJournals = useCallback((projectId: number, journals: JournalEntry[]) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId ? { ...project, journals, updatedAt: new Date().toISOString() } : project
      )
    );
  }, []);

  const updateProjectStatus = (projectId: number, status: ProjectStatus) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId ? { ...project, status, updatedAt: new Date().toISOString() } : project
      )
    );
  };

  const updateProjectFunding = (projectId: number, amount: number) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        const currentAmount = project.currentAmount + amount;
        const progress = (currentAmount / project.goalAmount) * 100;
        const status =
          progress >= 100 && (project.status === "진행 중" || project.status === "펀딩 예정")
            ? "목표 달성"
            : project.status;

        return {
          ...project,
          currentAmount,
          backers: project.backers + 1,
          status,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  return (
    <FundingContext.Provider
      value={{
        projects,
        participatedFundings,
        fundingReviews,
        addParticipation,
        mergeParticipationsFromOrders,
        addProject,
        updateProject,
        addFundingReview,
        updateFundingReview,
        deleteFundingReview,
        mergeProjects,
        mergeProject,
        mergeFundingReviews,
        updateProjectJournals,
        updateProjectStatus,
        updateProjectFunding,
      }}
    >
      {children}
    </FundingContext.Provider>
  );
}

export function useFunding() {
  const ctx = useContext(FundingContext);
  if (!ctx) throw new Error("useFunding must be used within FundingProvider");
  return ctx;
}
