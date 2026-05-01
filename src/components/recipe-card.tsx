import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Heart, MessageCircle, Sparkles } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { getImageSource } from '@/constants/data';

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
    image?: string | ImageSourcePropType;
  };
  index?: number;
  onLike?: (recipeId: number) => void;
  showLikeButton?: boolean;
}

export function RecipeCard({ recipe, index = 0, onLike, showLikeButton = false }: RecipeCardProps) {
  return (
    <Animated.View entering={FadeInUp.delay(index * 50).duration(400)}>
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.8}
        onPress={() => router.push(`/recipe/${recipe.id}`)}
      >
        <View style={styles.inner}>
          {/* Left: Thumbnail */}
          <View style={styles.thumbBox}>
            {recipe.image ? (
              <Image source={getImageSource(recipe.image)!} style={styles.thumb} resizeMode="contain" />
            ) : (
              <View style={styles.placeholder}>
                <Sparkles size={24} color="#9CA3AF" />
              </View>
            )}
          </View>

          {/* Right: Content */}
          <View style={styles.content}>
            <View>
              <View style={styles.metaRow}>
                <Text style={styles.author}>{recipe.author}</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.time}>{recipe.timestamp}</Text>
              </View>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{recipe.title}</Text>
              <Text style={styles.desc} numberOfLines={2}>{recipe.description}</Text>
            </View>

            {/* Bottom Stats */}
            <View style={styles.footer}>
              <TouchableOpacity 
                disabled={!showLikeButton}
                onPress={() => onLike && onLike(recipe.id)}
                style={styles.stat}
              >
                <Heart 
                  size={16} 
                  color={recipe.liked ? "#111" : "#9CA3AF"} 
                  fill={recipe.liked ? "#111" : "transparent"} 
                />
                <Text style={[styles.statTxt, recipe.liked && { color: '#111' }]}>{recipe.likes}</Text>
              </TouchableOpacity>
              <View style={styles.stat}>
                <MessageCircle size={16} color="#9CA3AF" />
                <Text style={styles.statTxt}>{recipe.comments}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  inner: { flexDirection: 'row', gap: 16 },
  thumbBox: { width: 96, height: 96, borderRadius: 16, overflow: 'hidden', backgroundColor: '#F9FAFB' },
  thumb: { width: '100%', height: '100%', objectFit: 'contain' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, justifyContent: 'space-between' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  author: { fontSize: 12, fontWeight: '800', color: '#6B7280' },
  dot: { color: '#D1D5DB' },
  time: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  title: { fontSize: 15, fontWeight: '800', color: '#111', lineHeight: 20, marginBottom: 4 },
  desc: { fontSize: 12, color: '#6B7280', lineHeight: 18, fontWeight: '500' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 12 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statTxt: { fontSize: 12, fontWeight: '700', color: '#9CA3AF' },
});
