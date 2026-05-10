import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Search, X, ChevronDown, Check, MessageCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router";
import { recipesData, Recipe } from "../data/recipes";
import { RecipeCard } from "../components/RecipeCard";

export function RecipePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"인기순" | "최신순" | "내 추천순">("인기순");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const [recipes, setRecipes] = useState<Recipe[]>(recipesData);

  const handleRecipeLike = (recipeId: number) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setRecipes(
      recipes.map((recipe) =>
        recipe.id === recipeId
          ? { ...recipe, liked: !recipe.liked, likes: recipe.liked ? recipe.likes - 1 : recipe.likes + 1 }
          : recipe
      )
    );
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const query = searchQuery.toLowerCase();
    return (
      !query ||
      recipe.title.toLowerCase().includes(query) ||
      recipe.description.toLowerCase().includes(query) ||
      recipe.ingredients.some((ing) => ing.toLowerCase().includes(query)) ||
      recipe.author.toLowerCase().includes(query)
    );
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortOption === "인기순") return b.likes - a.likes;
    if (sortOption === "최신순") return b.id - a.id;
    return b.likes - a.likes;
  });

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Page Header */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-bold text-black">주담</h1>
          <Link to="/ai-chat">
            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
              <MessageCircle className="w-5 h-5 text-black" />
            </button>
          </Link>
        </div>
      </div>

      {/* Search Section */}
      <section className="bg-white border-b border-gray-200 px-4 pt-20 pb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="레시피, 재료, 작성자로 검색..."
            className="pl-12 pr-10 h-12 bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-gray-400 rounded-full"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </section>

      {/* Recipe Feed */}
      <section className="px-4 py-5">
        {/* Action Button + Sort Row */}
        <div className="mb-4 flex items-center gap-3">
          {user ? (
            <Link to="/recipe/create" className="flex-1">
              <Button className="w-full h-9 bg-black hover:bg-gray-800 text-white rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                레시피 제안하기
              </Button>
            </Link>
          ) : (
            <div className="flex-1 bg-gray-100 border border-gray-200 rounded-full px-4 py-2 text-center">
              <Link to="/login">
                <span className="text-gray-600 text-xs font-medium">로그인하고 제안하기</span>
              </Link>
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                showSortDropdown
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <span>{sortOption}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden min-w-[120px]">
                {(["인기순", "최신순", "내 추천순"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSortOption(opt); setShowSortDropdown(false); }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <span>{opt}</span>
                    {sortOption === opt && <Check className="w-4 h-4 text-gray-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recipe Cards - 펀딩 스타일 */}
        <div className="space-y-3">
          {sortedRecipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              index={index}
              onLike={handleRecipeLike}
              showLikeButton={true}
            />
          ))}

          {sortedRecipes.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}