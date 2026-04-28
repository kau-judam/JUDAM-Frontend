import React, { createContext, useContext, useState, useEffect } from "react";

interface FavoritesContextType {
  favoriteFundings: number[];
  toggleFavoriteFunding: (fundingId: number) => void;
  isFavoriteFunding: (fundingId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteFundings, setFavoriteFundings] = useState<number[]>(() => {
    // localStorage에서 초기값 로드
    const saved = localStorage.getItem("favoriteFundings");
    return saved ? JSON.parse(saved) : [];
  });

  // favoriteFundings가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("favoriteFundings", JSON.stringify(favoriteFundings));
  }, [favoriteFundings]);

  const toggleFavoriteFunding = (fundingId: number) => {
    setFavoriteFundings((prev) => {
      if (prev.includes(fundingId)) {
        return prev.filter((id) => id !== fundingId);
      } else {
        return [...prev, fundingId];
      }
    });
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
