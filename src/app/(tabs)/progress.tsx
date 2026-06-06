import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Mock progress data
  const overallStats = [
    { label: '학습 완료 시간', value: '18시간', icon: 'time', color: '#6366f1' },
    { label: '학습한 단어', value: '240개', icon: 'bookmark', color: '#10b981' },
    { label: '문법 정확도', value: '82%', icon: 'checkmark-circle', color: '#f59e0b' },
    { label: '스피킹 문장', value: '1,120문장', icon: 'mic', color: '#ec4899' },
  ];

  const bookProgress = [
    { title: '기적의 말하기 영단어 1000', progress: 40, emoji: '🍎', color: '#ef4444' },
    { title: '말하기 영문법 1', progress: 85, emoji: '📝', color: '#3b82f6' },
    { title: '말하기 영문법 2', progress: 10, emoji: '💡', color: '#f59e0b' },
    { title: '시원스쿨 기초영어법', progress: 100, emoji: '👶', color: '#10b981' },
  ];

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      {/* Overall Score Circle */}
      <View style={[styles.card, isDark && styles.cardDark, styles.overallCard]}>
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreNumber, isDark && styles.textWhite]}>84</Text>
          <Text style={styles.scoreLabel}>종합 영어 실력 지수</Text>
        </View>
        <View style={styles.scoreDetails}>
          <Text style={[styles.scoreDesc, isDark && styles.textGray]}>
            지난 주 대비 <Text style={styles.scoreHighlight}>+4점</Text> 상승했습니다! AI 회화 연습량과 정확도가 꾸준히 개선되고 있습니다.
          </Text>
        </View>
      </View>

      {/* Grid Stats */}
      <Text style={[styles.sectionTitle, isDark && styles.textWhite]}>핵심 학습 통계</Text>
      <View style={styles.statsGrid}>
        {overallStats.map((stat, idx) => (
          <View key={idx} style={[styles.statItem, isDark && styles.cardDark]}>
            <View style={[styles.iconWrapper, { backgroundColor: stat.color + '1a' }]}>
              <Ionicons name={stat.icon as any} size={20} color={stat.color} />
            </View>
            <Text style={[styles.statValue, isDark && styles.textWhite]}>{stat.value}</Text>
            <Text style={styles.statLabelText}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Book Progress */}
      <Text style={[styles.sectionTitle, isDark && styles.textWhite]}>교재별 완료율</Text>
      <View style={[styles.card, isDark && styles.cardDark]}>
        {bookProgress.map((book, idx) => (
          <View key={idx} style={styles.bookProgressRow}>
            <View style={styles.bookHeaderRow}>
              <Text style={styles.bookEmoji}>{book.emoji}</Text>
              <Text style={[styles.bookTitle, isDark && styles.textWhite]} numberOfLines={1}>
                {book.title}
              </Text>
              <Text style={[styles.bookProgressPct, { color: book.color }]}>{book.progress}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${book.progress}%`, backgroundColor: book.color },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Review Recommendations */}
      <Text style={[styles.sectionTitle, isDark && styles.textWhite]}>망각 곡선 기반 오늘 복습할 단어</Text>
      <View style={[styles.card, isDark && styles.cardDark, styles.reviewCard]}>
        <View style={styles.reviewHeader}>
          <Ionicons name="sparkles" size={18} color="#f59e0b" />
          <Text style={[styles.reviewTitle, isDark && styles.textWhite]}>
            오늘 15개의 단어를 복습하면 영구 암기됩니다.
          </Text>
        </View>
        <Text style={[styles.reviewText, isDark && styles.textGray]}>
          망각 주기가 다가온 취약 단어: get along with (친하게 지내다), run out of (다 떨어지다), look up to (존경하다)...
        </Text>
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  cardDark: {
    backgroundColor: '#1f2937',
  },
  overallCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  scoreContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6366f110',
  },
  scoreNumber: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
  },
  scoreLabel: {
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 2,
  },
  scoreDetails: {
    flex: 1,
  },
  scoreDesc: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
  },
  scoreHighlight: {
    fontWeight: 'bold',
    color: '#6366f1',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statItem: {
    width: (width - 44) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabelText: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
  },
  bookProgressRow: {
    marginBottom: 16,
  },
  bookHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bookEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  bookProgressPct: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  reviewCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  reviewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  reviewText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
});
