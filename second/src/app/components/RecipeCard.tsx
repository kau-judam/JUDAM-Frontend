import { motion } from "motion/react";
import { Heart, MessageCircle, Sparkles } from "lucide-react";
import { Link } from "react-router";

interface RecipeCardProps {
  recipe: {
    id: number;
    title: string;
    author: string;
    description: string;
    likes: number;
    comments: number;
    timestamp: string;
    liked?: boolean;
    image?: string;
  };
  index?: number;
  onLike?: (recipeId: number) => void;
  showLikeButton?: boolean;
}

export function RecipeCard({ recipe, index = 0, onLike, showLikeButton = false }: RecipeCardProps) {
  return (
    <Link to={`/recipe/${recipe.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-4"
      >
        <div className="flex gap-4">
          {/* 왼쪽: 썸네일 */}
          {recipe.image ? (
            <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 flex-shrink-0 rounded-xl bg-gray-100 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
          )}

          {/* 오른쪽: 내용 */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-gray-500">{recipe.author}</span>
                <span className="text-xs text-gray-400">{recipe.timestamp}</span>
              </div>
              <h3 className="text-sm font-bold text-black mb-1 line-clamp-2 leading-tight">
                {recipe.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {recipe.description}
              </p>
            </div>

            {/* 하단: 좋아요 & 댓글 */}
            <div className="flex items-center gap-4 mt-2">
              {showLikeButton && onLike ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onLike(recipe.id);
                  }}
                  className={`flex items-center gap-1 transition-colors ${
                    recipe.liked ? "text-gray-900" : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${recipe.liked ? "fill-current" : ""}`} />
                  <span className="text-xs font-medium">{recipe.likes}</span>
                </button>
              ) : (
                <div className="flex items-center gap-1 text-gray-400">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs font-medium">{recipe.likes}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-gray-400">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs font-medium">{recipe.comments}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
