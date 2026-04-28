import React, { createContext, useContext, useState, useEffect } from "react";
import SafeStorage from "@/utils/storage";

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
