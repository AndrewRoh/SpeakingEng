import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

interface Sentence {
  english: string;
  korean: string;
}

const mockSentences: Sentence[] = [
  { english: 'It takes time to learn a new language.', korean: '새로운 언어를 배우는 데는 시간이 걸립니다.' },
  { english: 'Practice is essential to master speaking.', korean: '말하기를 마스터하기 위해 연습은 필수적입니다.' },
  { english: 'Is it possible to improve my pronunciation quickly?', korean: '제 발음을 빠르게 개선하는 것이 가능한가요?' },
];

export default function SpeakingPractice() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const currentSentence = mockSentences[currentIndex];

  const handleSpeak = () => {
    Speech.speak(currentSentence.english, { language: 'en-US' });
  };

  const startRecording = () => {
    setIsRecording(true);
    setPronunciationScore(null);
    setFeedback(null);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsAnalyzing(true);
    // Simulate pronunciation analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      const score = Math.floor(Math.random() * (100 - 75 + 1)) + 75; // Generate score 75-100
      setPronunciationScore(score);
      
      if (score >= 90) {
        setFeedback('완벽해요! 원어민 수준의 자연스러운 억양과 발음입니다.');
      } else if (score >= 80) {
        setFeedback('좋습니다! 몇몇 자음 발음에 좀 더 신경 쓰면 완벽해집니다.');
      } else {
        setFeedback('아주 잘하셨습니다! 강세를 주는 모음 부분에 힘을 실어 읽어보세요.');
      }
    }, 1800);
  };

  const handleNext = () => {
    setPronunciationScore(null);
    setFeedback(null);
    if (currentIndex < mockSentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.progressText, isDark && styles.textGray]}>
          문장 {currentIndex + 1} / {mockSentences.length}
        </Text>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${((currentIndex + 1) / mockSentences.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Target Sentence Card */}
      <View style={[styles.card, isDark && styles.cardDark]}>
        <Text style={styles.koreanText}>{currentSentence.korean}</Text>
        <Text style={[styles.englishText, isDark && styles.textWhite]}>{currentSentence.english}</Text>
        
        <TouchableOpacity style={styles.listenBtn} onPress={handleSpeak}>
          <Ionicons name="volume-high" size={24} color="#6366f1" />
          <Text style={styles.listenBtnText}>원어민 발음 듣기</Text>
        </TouchableOpacity>
      </View>

      {/* Feedback Section */}
      <View style={styles.feedbackContainer}>
        {isAnalyzing && (
          <View style={styles.analyzingWrapper}>
            <ActivityIndicator size="small" color="#6366f1" />
            <Text style={[styles.analyzingText, isDark && styles.textGray]}>발음 분석 중...</Text>
          </View>
        )}

        {pronunciationScore !== null && (
          <View style={[styles.reportCard, isDark && styles.cardDark]}>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreLabel}>발음 점수</Text>
              <Text style={[styles.scoreValue, { color: pronunciationScore >= 85 ? '#10b981' : '#f59e0b' }]}>
                {pronunciationScore}점
              </Text>
            </View>
            <Text style={[styles.feedbackText, isDark && styles.textGray]}>{feedback}</Text>
          </View>
        )}
      </View>

      {/* Audio Recording Button Section */}
      <View style={styles.recordingSection}>
        {isRecording ? (
          <TouchableOpacity style={styles.recordBtnActive} onPress={stopRecording}>
            <Ionicons name="stop" size={32} color="#ffffff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.recordBtnInactive}
            onPress={startRecording}
            disabled={isAnalyzing}
          >
            <Ionicons name="mic" size={32} color="#ffffff" />
          </TouchableOpacity>
        )}
        <Text style={[styles.recordingHint, isDark && styles.textGray]}>
          {isRecording ? '녹음을 중단하려면 탭하세요' : '마이크 버튼을 누르고 따라 말해보세요'}
        </Text>
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={[styles.nextBtn, isRecording && styles.nextBtnDisabled]}
        onPress={handleNext}
        disabled={isRecording}
      >
        <Text style={styles.nextBtnText}>다음 문장</Text>
        <Ionicons name="arrow-forward" size={18} color="#ffffff" />
      </TouchableOpacity>
      <View style={{ height: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 24,
    justifyContent: 'space-between',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  header: {
    marginTop: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366f1',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    alignItems: 'center',
  },
  cardDark: {
    backgroundColor: '#1f2937',
  },
  koreanText: {
    fontSize: 15,
    color: '#4f46e5',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  englishText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 24,
  },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#6366f112',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  listenBtnText: {
    color: '#6366f1',
    fontWeight: 'bold',
    fontSize: 14,
  },
  feedbackContainer: {
    height: 120,
    justifyContent: 'center',
  },
  analyzingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  analyzingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  reportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  feedbackText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  recordingSection: {
    alignItems: 'center',
  },
  recordBtnInactive: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  recordBtnActive: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  recordingHint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 12,
    textAlign: 'center',
  },
  nextBtn: {
    backgroundColor: '#374151',
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  nextBtnDisabled: {
    opacity: 0.5,
  },
  nextBtnText: {
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
