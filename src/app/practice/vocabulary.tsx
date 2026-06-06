import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const { width } = Dimensions.get('window');

interface Word {
  word: string;
  meaning: string;
  example: string;
}

const mockWords: Word[] = [
  { word: 'acquire', meaning: '습득하다, 얻다', example: 'It takes time to acquire a new language.' },
  { word: 'essential', meaning: '필수적인, 극히 중요한', example: 'Practice is essential to master speaking.' },
  { word: 'fluency', meaning: '유창성, 거침없음', example: 'He speaks English with native fluency.' },
  { word: 'confidence', meaning: '자신감', example: 'She gained confidence after practicing.' },
  { word: 'commute', meaning: '통근하다, 출퇴근하다', example: 'My daily commute takes about an hour.' },
];

export default function VocabularyPractice() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const currentWord = mockWords[currentIndex];

  const handleSpeak = (text: string) => {
    Speech.speak(text, { language: 'en-US' });
  };

  const handleNext = (known: boolean) => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < mockWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Reset or show completion
        setCurrentIndex(0);
      }
    }, 150);
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Progress Indicator */}
      <View style={styles.progressHeader}>
        <Text style={[styles.progressText, isDark && styles.textGray]}>
          단어 카드 {currentIndex + 1} / {mockWords.length}
        </Text>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${((currentIndex + 1) / mockWords.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Flashcard */}
      <TouchableOpacity
        style={[styles.card, isFlipped ? styles.cardFlipped : null, isDark && styles.cardDark]}
        activeOpacity={0.9}
        onPress={() => setIsFlipped(!isFlipped)}
      >
        {!isFlipped ? (
          // Front of card (English Word)
          <View style={styles.cardFace}>
            <Text style={[styles.wordText, isDark && styles.textWhite]}>{currentWord.word}</Text>
            <TouchableOpacity
              style={styles.speakBtn}
              onPress={(e) => {
                e.stopPropagation();
                handleSpeak(currentWord.word);
              }}
            >
              <Ionicons name="volume-high" size={28} color="#6366f1" />
            </TouchableOpacity>
            <Text style={styles.hintText}>터치하여 뜻 보기</Text>
          </View>
        ) : (
          // Back of card (Korean Meaning & Example)
          <View style={styles.cardFace}>
            <Text style={styles.meaningText}>{currentWord.meaning}</Text>
            <View style={styles.exampleContainer}>
              <Text style={[styles.exampleLabel, isDark && styles.textGray]}>예문:</Text>
              <Text style={[styles.exampleText, isDark && styles.textWhite]}>{currentWord.example}</Text>
              <TouchableOpacity
                style={styles.speakExampleBtn}
                onPress={(e) => {
                  e.stopPropagation();
                  handleSpeak(currentWord.example);
                }}
              >
                <Ionicons name="volume-medium-outline" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <Text style={styles.hintText}>터치하여 단어 보기</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Bottom Control Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.forgotBtn]}
          onPress={() => handleNext(false)}
        >
          <Ionicons name="close-circle-outline" size={22} color="#ef4444" />
          <Text style={styles.forgotBtnText}>아직 모름</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.knowBtn]}
          onPress={() => handleNext(true)}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color="#10b981" />
          <Text style={styles.knowBtnText}>알고 있음</Text>
        </TouchableOpacity>
      </View>
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
  progressHeader: {
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
    height: width * 0.9,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cardDark: {
    backgroundColor: '#1f2937',
  },
  cardFlipped: {
    borderColor: '#6366f1',
    borderWidth: 1,
  },
  cardFace: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  wordText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  speakBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f112',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  meaningText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4f46e5',
    textAlign: 'center',
  },
  exampleContainer: {
    marginTop: 32,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  exampleLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 22,
  },
  speakExampleBtn: {
    marginTop: 10,
    padding: 6,
  },
  hintText: {
    position: 'absolute',
    bottom: 0,
    fontSize: 12,
    color: '#9ca3af',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    height: 54,
    borderRadius: 27,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
  },
  forgotBtn: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  forgotBtnText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: 'bold',
  },
  knowBtn: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  knowBtnText: {
    color: '#10b981',
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
