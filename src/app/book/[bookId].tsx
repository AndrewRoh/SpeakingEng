import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { booksData } from '@/data/books/metadata';
import { Ionicons } from '@expo/vector-icons';

export default function BookDetailsScreen() {
  const { bookId } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const book = booksData.find((b) => b.id === bookId);

  if (!book) {
    return (
      <View style={[styles.container, isDark && styles.containerDark, styles.centered]}>
        <Text style={[styles.errorText, isDark && styles.textWhite]}>교재를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '#10b981';
      case 'intermediate':
        return '#f59e0b';
      case 'advanced':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      {/* Book Summary Card */}
      <View style={[styles.bookCard, isDark && styles.cardDark]}>
        <View style={styles.headerRow}>
          <Text style={styles.bookEmoji}>{book.emoji}</Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: isDark ? '#374151' : '#f3f4f6' }]}>
              <Text style={[styles.badgeText, isDark && styles.textWhite]}>{book.categoryLabel}</Text>
            </View>
            <View style={[styles.badge, { borderColor: getDifficultyColor(book.difficulty), borderWidth: 1 }]}>
              <Text style={[styles.badgeText, { color: getDifficultyColor(book.difficulty) }]}>
                {book.difficultyLabel}
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.bookTitle, isDark && styles.textWhite]}>{book.title}</Text>
        <Text style={[styles.bookDesc, isDark && styles.textGray]}>{book.description}</Text>
      </View>

      {/* Chapters Title */}
      <Text style={[styles.sectionTitle, isDark && styles.textWhite]}>목차 (Chapters)</Text>

      {/* Chapters List */}
      <View style={styles.chaptersList}>
        {book.chapters.map((chapter, index) => {
          // Dynamic lessonId structure: bookId_chapterId
          const lessonId = `${book.id}_${chapter.id}`;

          return (
            <TouchableOpacity
              key={chapter.id}
              style={[styles.chapterItem, isDark && styles.cardDark]}
              onPress={() => router.push(`/book/lesson/${lessonId}`)}
            >
              <View style={styles.chapterNumberContainer}>
                <Text style={styles.chapterNumber}>{(index + 1).toString().padStart(2, '0')}</Text>
              </View>

              <View style={styles.chapterInfo}>
                <Text style={[styles.chapterTitle, isDark && styles.textWhite]}>{chapter.title}</Text>
                <Text style={[styles.chapterDesc, isDark && styles.textGray]} numberOfLines={1}>
                  {chapter.description}
                </Text>
              </View>

              <Ionicons
                name="play-circle"
                size={28}
                color="#6366f1"
                style={styles.playIcon}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: 'bold',
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
    marginBottom: 24,
    marginTop: 8,
  },
  cardDark: {
    backgroundColor: '#1f2937',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookEmoji: {
    fontSize: 36,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  bookDesc: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
    marginLeft: 4,
  },
  textWhite: {
    color: '#ffffff',
  },
  textGray: {
    color: '#9ca3af',
  },
  chaptersList: {
    gap: 12,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  chapterNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#6366f112',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  chapterNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  chapterInfo: {
    flex: 1,
    marginRight: 8,
  },
  chapterTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },
  chapterDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  playIcon: {
    marginLeft: 4,
  },
});
