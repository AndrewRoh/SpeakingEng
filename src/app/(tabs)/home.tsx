import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { useApiKey } from '@/contexts/ApiKeyContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { apiKey } = useApiKey();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      {/* Settings Top Button */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, isDark && styles.textWhite]}>안녕하세요! 👋</Text>
          <Text style={[styles.subtitle, isDark && styles.textGray]}>오늘도 영어 한 문장씩 말해봐요.</Text>
        </View>
        <TouchableOpacity
          style={[styles.settingsButton, isDark && styles.settingsButtonDark]}
          onPress={() => router.push('/settings')}
        >
          <Ionicons
            name="settings-outline"
            size={24}
            color={isDark ? '#f9fafb' : '#374151'}
          />
        </TouchableOpacity>
      </View>

      {/* Warning if API key is missing */}
      {!apiKey && (
        <TouchableOpacity
          style={styles.warningCard}
          onPress={() => router.push('/settings')}
        >
          <View style={styles.warningHeader}>
            <Ionicons name="warning" size={24} color="#ef4444" />
            <Text style={styles.warningTitle}>API 키 설정 필요</Text>
          </View>
          <Text style={styles.warningText}>
            AI와의 실시간 대화 및 맞춤 학습 콘텐츠 생성을 위해 Gemini API 키 설정이 필요합니다. 여기를 눌러 설정해주세요.
          </Text>
        </TouchableOpacity>
      )}

      {/* Stats Summary Section */}
      <View style={[styles.statsContainer, isDark && styles.cardDark]}>
        <View style={styles.statBox}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={[styles.statValue, isDark && styles.textWhite]}>5일</Text>
          <Text style={styles.statLabel}>학습 스트릭</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statEmoji}>⏱️</Text>
          <Text style={[styles.statValue, isDark && styles.textWhite]}>120분</Text>
          <Text style={styles.statLabel}>이번 주 학습</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statEmoji}>🗣️</Text>
          <Text style={[styles.statValue, isDark && styles.textWhite]}>15회</Text>
          <Text style={styles.statLabel}>AI 대화 횟수</Text>
        </View>
      </View>

      {/* Big Premium Voice Call Button */}
      <TouchableOpacity
        style={styles.micCallButton}
        onPress={() => router.push('/conversation')}
      >
        <View style={styles.micIconContainer}>
          <Ionicons name="mic" size={40} color="#ffffff" />
        </View>
        <View style={styles.micTextContainer}>
          <Text style={styles.micCallTitle}>AI 실시간 전화 대화</Text>
          <Text style={styles.micCallSubtitle}>말하는 만큼 늘어요! 자유롭게 대화 시작</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ffffff" style={styles.chevron} />
      </TouchableOpacity>

      {/* Quick Study Options */}
      <Text style={[styles.sectionTitle, isDark && styles.textWhite]}>오늘의 학습 추천</Text>
      
      <View style={styles.quickGrid}>
        <TouchableOpacity
          style={[styles.quickCard, { borderLeftColor: '#4f46e5' }, isDark && styles.cardDark]}
          onPress={() => router.push('/practice/vocabulary')}
        >
          <Ionicons name="flash-outline" size={28} color="#4f46e5" />
          <Text style={[styles.quickCardTitle, isDark && styles.textWhite]}>단어 암기</Text>
          <Text style={styles.quickCardDesc}>핵심 단어 1000개 마스터</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickCard, { borderLeftColor: '#10b981' }, isDark && styles.cardDark]}
          onPress={() => router.push('/practice/grammar')}
        >
          <Ionicons name="school-outline" size={28} color="#10b981" />
          <Text style={[styles.quickCardTitle, isDark && styles.textWhite]}>문법 마스터</Text>
          <Text style={styles.quickCardDesc}>말하기 전용 문법 퀴즈</Text>
        </TouchableOpacity>
      </View>

      {/* Recommended Books Section */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, isDark && styles.textWhite]}>학습 교재 이어하기</Text>
        <TouchableOpacity onPress={() => router.push('/books')}>
          <Text style={styles.seeAllText}>전체 교재 보기</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.recentBookCard, isDark && styles.cardDark]}
        onPress={() => router.push('/book/vocab-1000')}
      >
        <View style={styles.bookIcon}>
          <Text style={styles.bookIconText}>📖</Text>
        </View>
        <View style={styles.recentBookInfo}>
          <Text style={[styles.recentBookTitle, isDark && styles.textWhite]}>기적의 말하기 영단어 1000</Text>
          <Text style={styles.recentBookChapter}>Chapter 1: 기본 동사 (학습 중)</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '40%' }]} />
            </View>
            <Text style={styles.progressText}>40% 완료</Text>
          </View>
        </View>
        <Ionicons name="play" size={20} color="#4f46e5" />
      </TouchableOpacity>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  textWhite: {
    color: '#f9fafb',
  },
  textGray: {
    color: '#9ca3af',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  settingsButtonDark: {
    backgroundColor: '#1f2937',
  },
  warningCard: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  warningText: {
    fontSize: 13,
    color: '#b91c1c',
    lineHeight: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#1f2937',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
  },
  micCallButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  micIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  micCallTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  micCallSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  chevron: {
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '600',
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  quickCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  quickCardDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  recentBookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  bookIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookIconText: {
    fontSize: 24,
  },
  recentBookInfo: {
    flex: 1,
    marginLeft: 16,
  },
  recentBookTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },
  recentBookChapter: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
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
    backgroundColor: '#4f46e5',
  },
  progressText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
  },
});
