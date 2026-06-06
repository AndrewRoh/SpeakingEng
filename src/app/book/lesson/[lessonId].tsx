import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useColorScheme,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { booksData } from '@/data/books/metadata';
import { useApiKey } from '@/contexts/ApiKeyContext';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { generateLessonContent } from '@/services/gemini/geminiText';
import { getCachedLesson, cacheLesson, saveProgress } from '@/services/storage/database';

interface LessonContent {
  introduction: string;
  vocabulary: { word: string; meaning: string; sentence: string }[];
  keyPatterns: { pattern: string; meaning: string; usage: string }[];
  practiceSentences: { korean: string; english: string }[];
}

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams();
  const { apiKey } = useApiKey();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'vocab' | 'practice'>('info');
  const [revealIndex, setRevealIndex] = useState<number | null>(null);
  const [content, setContent] = useState<LessonContent | null>(null);

  // Parse bookId and chapterId
  const [bookId, chapterId] = typeof lessonId === 'string' ? lessonId.split('_') : ['', ''];
  const book = booksData.find((b) => b.id === bookId);
  const chapter = book?.chapters.find((c) => c.id === chapterId);

  useEffect(() => {
    if (chapter) {
      loadLessonContent();
    }
  }, [lessonId]);

  const loadLessonContent = async () => {
    if (!book || !chapter) return;
    setIsLoading(true);

    const mockContent: LessonContent = {
      introduction: `이번 레슨에서는 "${chapter.title}"에 대해 배웁니다.\n\n주요 목표는 [${chapter.targetFocus}]을(를) 완벽히 익혀 회화에서 자연스럽게 구사할 수 있도록 훈련하는 것입니다. 차근차근 단어와 핵심 패턴을 익히고 실전 영작 연습에 도전해보세요!`,
      vocabulary: [
        { word: 'acquire', meaning: '습득하다, 얻다', sentence: 'It takes time to acquire a new language.' },
        { word: 'essential', meaning: '필수적인, 극히 중요한', sentence: 'Water is essential for life.' },
        { word: 'practice', meaning: '연습하다, 실천하다', sentence: 'You need to practice speaking English every day.' },
        { word: 'fluency', meaning: '유창성, 거침없음', sentence: 'His goal is to achieve fluency in Spanish.' },
        { word: 'confidence', meaning: '자신감, 신뢰', sentence: 'Speaking in public builds your confidence.' },
      ],
      keyPatterns: [
        { pattern: 'It takes time to [verb]...', meaning: '~하는 데 시간이 걸린다', usage: '동작을 완료하는 데 필요한 시간을 나타낼 때 사용합니다.' },
        { pattern: 'Is it possible to [verb]...?', meaning: '~하는 것이 가능한가요?', usage: '가능성이나 허락을 부드럽게 질문할 때 사용합니다.' },
      ],
      practiceSentences: [
        { korean: '새로운 언어를 배우는 데는 시간이 걸립니다.', english: 'It takes time to learn a new language.' },
        { korean: '매일 영어를 연습하는 것은 필수적입니다.', english: 'It is essential to practice English every day.' },
        { korean: '오늘 밤에 AI와 이야기하는 것이 가능한가요?', english: 'Is it possible to talk with AI tonight?' },
      ]
    };

    try {
      // 1. Try to load from SQLite Cache
      const cached = await getCachedLesson(lessonId as string);
      if (cached) {
        setContent(cached);
        setIsLoading(false);
        return;
      }

      // 2. If no cache and no API key, use mock
      if (!apiKey) {
        setContent(mockContent);
        setIsLoading(false);
        return;
      }

      // 3. Fetch from Gemini API
      const generated = await generateLessonContent(
        apiKey,
        book.title,
        book.categoryLabel,
        book.difficultyLabel,
        chapter.title,
        chapter.targetFocus
      );

      // 4. Cache in SQLite
      await cacheLesson(lessonId as string, generated);
      setContent(generated);
    } catch (error) {
      console.error('Gemini content generation failed, using mock data:', error);
      Alert.alert(
        '콘텐츠 생성 알림',
        'Gemini API를 통한 단원 실시간 생성에 실패했습니다. 오프라인 모드로 탑재된 기본 샘플로 대체됩니다.',
        [{ text: '확인' }]
      );
      setContent(mockContent);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
    });
  };

  if (!book || !chapter) {
    return (
      <View style={[styles.container, isDark && styles.containerDark, styles.centered]}>
        <Text style={[styles.errorText, isDark && styles.textWhite]}>단원을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.container, isDark && styles.containerDark, styles.centered]}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={[styles.loadingText, isDark && styles.textGray]}>AI 학습 콘텐츠 생성 중...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Title & Chapter Details */}
      <View style={styles.lessonHeader}>
        <Text style={[styles.chapterNum, isDark && styles.textWhite]}>{chapter.title}</Text>
        <Text style={[styles.bookSubtitle, isDark && styles.textGray]}>{book.title}</Text>
      </View>

      {/* Segmented Control / Tabs */}
      <View style={[styles.tabBar, isDark && styles.tabBarDark]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'info' && styles.tabActive]}
          onPress={() => setActiveTab('info')}
        >
          <Text style={[styles.tabLabel, activeTab === 'info' && styles.tabLabelActive, isDark && styles.textWhite]}>
            해설 & 패턴
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'vocab' && styles.tabActive]}
          onPress={() => setActiveTab('vocab')}
        >
          <Text style={[styles.tabLabel, activeTab === 'vocab' && styles.tabLabelActive, isDark && styles.textWhite]}>
            핵심 단어
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'practice' && styles.tabActive]}
          onPress={() => setActiveTab('practice')}
        >
          <Text style={[styles.tabLabel, activeTab === 'practice' && styles.tabLabelActive, isDark && styles.textWhite]}>
            영작 연습
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'info' && content && (
          <View style={styles.tabContent}>
            {/* Introduction */}
            <View style={[styles.card, isDark && styles.cardDark]}>
              <Text style={[styles.cardTitle, isDark && styles.textWhite]}>단원 요약 및 가이드</Text>
              <Text style={[styles.cardText, isDark && styles.textGray]}>{content.introduction}</Text>
            </View>

            {/* Key Grammar Patterns */}
            <Text style={[styles.sectionTitle, isDark && styles.textWhite]}>핵심 표현 패턴</Text>
            {content.keyPatterns.map((pat, idx) => (
              <View key={idx} style={[styles.card, isDark && styles.cardDark]}>
                <View style={styles.patternHeader}>
                  <Text style={styles.patternText}>{pat.pattern}</Text>
                  <TouchableOpacity onPress={() => handleSpeak(pat.pattern.replace(/\[.*?\]/g, ''))}>
                    <Ionicons name="volume-medium-outline" size={20} color="#6366f1" />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.patternMeaning, isDark && styles.textWhite]}>뜻: {pat.meaning}</Text>
                <Text style={[styles.patternUsage, isDark && styles.textGray]}>{pat.usage}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'vocab' && content && (
          <View style={styles.tabContent}>
            {content.vocabulary.map((vocab, idx) => (
              <View key={idx} style={[styles.vocabCard, isDark && styles.cardDark]}>
                <View style={styles.vocabHeader}>
                  <View>
                    <Text style={[styles.vocabWord, isDark && styles.textWhite]}>{vocab.word}</Text>
                    <Text style={styles.vocabMeaning}>{vocab.meaning}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.speakButton}
                    onPress={() => handleSpeak(vocab.word)}
                  >
                    <Ionicons name="volume-high-outline" size={22} color="#6366f1" />
                  </TouchableOpacity>
                </View>
                <View style={styles.vocabExample}>
                  <Text style={[styles.vocabExampleEng, isDark && styles.textWhite]}>{vocab.sentence}</Text>
                  <TouchableOpacity onPress={() => handleSpeak(vocab.sentence)} style={styles.speakSmallBtn}>
                    <Ionicons name="volume-medium-outline" size={16} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'practice' && content && (
          <View style={styles.tabContent}>
            <Text style={[styles.instructionText, isDark && styles.textGray]}>
              한국어 문장을 보고 머릿속으로 영작한 후, 카드를 터치하여 올바른 표현을 확인해보세요. 스피커 모양을 눌러 발음도 들을 수 있습니다.
            </Text>

            {content.practiceSentences.map((sentence, idx) => {
              const isRevealed = revealIndex === idx;

              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.practiceCard, isDark && styles.cardDark]}
                  onPress={() => setRevealIndex(isRevealed ? null : idx)}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.koreanText, isDark && styles.textWhite]}>{sentence.korean}</Text>
                  
                  {isRevealed ? (
                    <View style={styles.revealSection}>
                      <View style={styles.revealedTextWrapper}>
                        <Text style={styles.englishText}>{sentence.english}</Text>
                        <TouchableOpacity
                          style={styles.speakButton}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleSpeak(sentence.english);
                          }}
                        >
                          <Ionicons name="volume-high-outline" size={20} color="#6366f1" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.hiddenSection}>
                      <Text style={styles.hiddenText}>터치하여 영어 문장 확인</Text>
                      <Ionicons name="eye-outline" size={18} color="#6366f1" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Quick Link to Speech Practice */}
            <TouchableOpacity
              style={styles.voicePracticeLink}
              onPress={async () => {
                await saveProgress(lessonId as string, true, 100);
                router.push('/conversation');
              }}
            >
              <Ionicons name="mic" size={22} color="#ffffff" />
              <Text style={styles.voicePracticeText}>이 표현들로 AI와 실시간 회화 시작</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 15,
    marginTop: 12,
    color: '#6b7280',
  },
  lessonHeader: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  chapterNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  bookSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingHorizontal: 8,
  },
  tabBarDark: {
    backgroundColor: '#1f2937',
    borderBottomColor: '#374151',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#6366f1',
  },
  tabLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#6366f1',
    fontWeight: 'bold',
  },
  scrollContent: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  cardDark: {
    backgroundColor: '#1f2937',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 8,
    marginBottom: 4,
    marginLeft: 4,
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  patternText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  patternMeaning: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  patternUsage: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  vocabCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
    marginBottom: 12,
  },
  vocabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 10,
    marginBottom: 10,
  },
  vocabWord: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  vocabMeaning: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '600',
    marginTop: 2,
  },
  speakButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366f10c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vocabExample: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 8,
  },
  vocabExampleEng: {
    fontSize: 13,
    color: '#4b5563',
    flex: 1,
  },
  speakSmallBtn: {
    padding: 4,
  },
  instructionText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 8,
    marginLeft: 4,
  },
  practiceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
    marginBottom: 12,
  },
  koreanText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#374151',
  },
  hiddenSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  hiddenText: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '600',
  },
  revealSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  revealedTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  englishText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
    flex: 1,
  },
  voicePracticeLink: {
    backgroundColor: '#6366f1',
    height: 54,
    borderRadius: 27,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  voicePracticeText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  textWhite: {
    color: '#ffffff',
  },
  textGray: {
    color: '#9ca3af',
  },
});
