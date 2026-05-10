import React, { createContext, useContext, useState, useEffect } from "react";
import SafeStorage from "@/utils/storage";
import { getFundingApiErrorMessage, likeFundingProject, unlikeFundingProject } from "@/features/funding/api";

interface FavoritesContextType {
  favoriteFundings: number[];
  toggleFavoriteFunding: (fundingId: number) => void;
  isFavoriteFunding: (fundingId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteFundings, setFavoriteFundings] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial value from SafeStorage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const saved = await SafeStorage.getItem("favoriteFundings");
        if (saved) {
          setFavoriteFundings(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to load favorites from SafeStorage", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadFavorites();
  }, []);

  // Save to SafeStorage whenever favoriteFundings changes, but only after initial load
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await SafeStorage.setItem("favoriteFundings", JSON.stringify(favoriteFundings));
      } catch (e) {
        console.error("Failed to save favorites to SafeStorage", e);
      }
    };
    
    if (isLoaded) {
      saveFavorites();
    }
  }, [favoriteFundings, isLoaded]);

  const toggleFavoriteFunding = async (fundingId: number) => {
    const wasFavorite = favoriteFundings.includes(fundingId);
    setFavoriteFundings((prev) => (wasFavorite ? prev.filter((id) => id !== fundingId) : [...prev, fundingId]));

    try {
      if (wasFavorite) {
        await unlikeFundingProject(fundingId);
      } else {
        await likeFundingProject(fundingId);
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
      setFavoriteFundings((prev) => (wasFavorite ? Array.from(new Set([...prev, fundingId])) : prev.filter((id) => id !== fundingId)));
      console.warn(message);
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
