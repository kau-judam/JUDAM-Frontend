import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { CommunityProvider } from "./contexts/CommunityContext";
import { FundingProvider } from "./contexts/FundingContext";
import { Toaster } from "sonner";

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CommunityProvider>
          <FundingProvider>
            <RouterProvider router={router} />
            <Toaster position="top-center" richColors />
          </FundingProvider>
        </CommunityProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}