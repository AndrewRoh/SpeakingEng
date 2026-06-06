import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  useColorScheme,
} from 'react-native';
import { booksData, Book } from '@/data/books/metadata';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

type CategoryFilter = 'all' | 'vocabulary' | 'grammar' | 'expression' | 'basic-speaking';

export default function BooksScreen() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const filterCategories = [
    { id: 'all', label: '전체' },
    { id: 'vocabulary', label: '단어' },
    { id: 'grammar', label: '문법' },
    { id: 'expression', label: '표현' },
    { id: 'basic-speaking', label: '기초/스피킹' },
  ];

  const filteredBooks = booksData.filter((book) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'basic-speaking') {
      return book.category === 'basic' || book.category === 'speaking';
    }
    return book.category === activeCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '#10b981'; // Green
      case 'intermediate':
        return '#f59e0b'; // Amber
      case 'advanced':
        return '#ef4444'; // Red
      default:
        return '#6b7280';
    }
  };

  const renderBookItem = ({ item }: { item: Book }) => {
    // Demo progress (we will implement dynamic progress later)
    const progress = 0; // Starts at 0%

    return (
      <TouchableOpacity
        style={[styles.bookCard, isDark && styles.bookCardDark]}
        onPress={() => router.push(`/book/${item.id}`)}
      >
        <View style={styles.bookHeader}>
          <View style={styles.emojiContainer}>
            <Text style={styles.bookEmoji}>{item.emoji}</Text>
          </View>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: isDark ? '#374151' : '#f3f4f6' }]}>
              <Text style={[styles.badgeText, isDark && styles.textWhite]}>{item.categoryLabel}</Text>
            </View>
            <View style={[styles.badge, { borderColor: getDifficultyColor(item.difficulty), borderWidth: 1 }]}>
              <Text style={[styles.badgeText, { color: getDifficultyColor(item.difficulty) }]}>
                {item.difficultyLabel}
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.bookTitle, isDark && styles.textWhite]}>{item.title}</Text>
        <Text style={[styles.bookDesc, isDark && styles.textGray]} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}% 완료</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={isDark ? '#9ca3af' : '#4b5563'}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Category Tabs */}
      <View style={styles.categoryScroll}>
        {filterCategories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryTab,
              activeCategory === cat.id && styles.categoryTabActive,
              isDark && styles.categoryTabDark,
              isDark && activeCategory === cat.id && styles.categoryTabActiveDark,
            ]}
            onPress={() => setActiveCategory(cat.id as CategoryFilter)}
          >
            <Text
              style={[
                styles.categoryTabText,
                activeCategory === cat.id && styles.categoryTabTextActive,
                isDark && styles.categoryTabTextDark,
                isDark && activeCategory === cat.id && styles.categoryTabTextActiveDark,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Books List */}
      <FlatList
        data={filteredBooks}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, isDark && styles.textGray]}>해당 카테고리의 교재가 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  categoryScroll: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  categoryTabDark: {
    backgroundColor: '#1f2937',
  },
  categoryTabActive: {
    backgroundColor: '#6366f1',
  },
  categoryTabActiveDark: {
    backgroundColor: '#6366f1',
  },
  categoryTabText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '600',
  },
  categoryTabTextDark: {
    color: '#9ca3af',
  },
  categoryTabTextActive: {
    color: '#ffffff',
  },
  categoryTabTextActiveDark: {
    color: '#ffffff',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  bookCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  bookCardDark: {
    backgroundColor: '#1f2937',
  },
  bookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  emojiContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookEmoji: {
    fontSize: 22,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  bookDesc: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 16,
  },
  textWhite: {
    color: '#ffffff',
  },
  textGray: {
    color: '#9ca3af',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
  },
});
