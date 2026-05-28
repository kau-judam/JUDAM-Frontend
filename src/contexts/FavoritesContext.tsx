import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getFundingApiErrorMessage,
  getMyLikedFundings,
  likeFundingProject,
  unlikeFundingProject,
} from "@/features/funding/api";

interface FavoritesContextType {
  favoriteFundings: number[];
  toggleFavoriteFunding: (fundingId: number) => void;
  isFavoriteFunding: (fundingId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthReady } = useAuth();
  const [favoriteFundings, setFavoriteFundings] = useState<number[]>([]);
  const pendingFavoriteIdsRef = useRef(new Set<number>());

  // Keep funding likes aligned to the server DB only. No persisted local cache is used here.
  useEffect(() => {
    if (!isAuthReady) return;

    if (!user?.id) {
      setFavoriteFundings([]);
      return;
    }

    let mounted = true;
    const loadFavorites = async () => {
      setFavoriteFundings([]);
      try {
        const response = await getMyLikedFundings();
        if (mounted) {
          setFavoriteFundings(response.content.map((funding) => funding.fundingId));
        }
      } catch (apiError) {
        const message = getFundingApiErrorMessage(apiError, "");
        if (message && message !== "로그인 정보가 필요합니다. 다시 로그인해주세요.") {
          console.warn(message);
        }
        if (mounted) setFavoriteFundings([]);
      }
    };
    loadFavorites();

    return () => {
      mounted = false;
    };
  }, [isAuthReady, user?.id]);

  const toggleFavoriteFunding = async (fundingId: number) => {
    if (pendingFavoriteIdsRef.current.has(fundingId)) return;
    const wasFavorite = favoriteFundings.includes(fundingId);
    pendingFavoriteIdsRef.current.add(fundingId);

    try {
      let response;
      if (wasFavorite) {
        response = await unlikeFundingProject(fundingId);
      } else {
        response = await likeFundingProject(fundingId);
      }
      if (response.fundingId) {
        setFavoriteFundings((prev) => {
          const next = response.liked
            ? Array.from(new Set([...prev, response.fundingId]))
            : prev.filter((id) => id !== response.fundingId);
          return next;
        });
      }
    } catch (error) {
      const message = getFundingApiErrorMessage(error, "펀딩 찜 상태를 저장하지 못했습니다.");
      if (message.includes("API 응답이 JSON이 아닙니다.") && message.includes("/likes")) {
        return;
      }
      if (!wasFavorite && message.includes("이미 찜한")) {
        setFavoriteFundings((prev) => Array.from(new Set([...prev, fundingId])));
        return;
      }
      if (wasFavorite && message.includes("찜하지 않은")) {
        setFavoriteFundings((prev) => prev.filter((id) => id !== fundingId));
        return;
      }
      console.warn(message);
    } finally {
      pendingFavoriteIdsRef.current.delete(fundingId);
    }
  };

  const isFavoriteFunding = (fundingId: number) => {
    return favoriteFundings.includes(fundingId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favoriteFundings, toggleFavoriteFunding, isFavoriteFunding }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
