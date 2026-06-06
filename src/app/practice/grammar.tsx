import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Quiz {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

const mockQuizzes: Quiz[] = [
  {
    question: 'How long ________ to learn a new language?',
    options: ['does it take', 'is it taking', 'take it', 'does taking'],
    answerIndex: 0,
    explanation: '특정 동작을 하는 데 걸리는 시간을 물어볼 때는 "How long does it take + to 동사원형?" 패턴을 사용합니다.',
  },
  {
    question: 'I have to study English ________ get a job.',
    options: ['for', 'to', 'because', 'so'],
    answerIndex: 1,
    explanation: '목적(~하기 위해서)을 나타낼 때는 "to + 동사원형" 형태의 부정사를 연결하여 사용합니다.',
  },
  {
    question: 'She ________ water and makes breakfast every morning.',
    options: ['drinking', 'is drink', 'drinks', 'drink'],
    answerIndex: 2,
    explanation: 'every morning처럼 반복되는 아침 습관은 일반 현재 시제를 사용하며, 3인칭 단수 주어(She)에 맞춰 drinks를 씁니다.',
  },
];

export default function GrammarPractice() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const currentQuiz = mockQuizzes[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOptionIndex(idx);
  };

  const handleSubmit = () => {
    if (selectedOptionIndex === null) {
      Alert.alert('선택 필요', '정답을 선택해주세요.');
      return;
    }
    setIsSubmitted(true);
    if (selectedOptionIndex === currentQuiz.answerIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOptionIndex(null);
    setIsSubmitted(false);
    if (currentIndex < mockQuizzes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setIsSubmitted(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <View style={[styles.container, isDark && styles.containerDark, styles.centered]}>
        <Ionicons name="trophy-outline" size={80} color="#f59e0b" />
        <Text style={[styles.scoreTitle, isDark && styles.textWhite]}>퀴즈 완료!</Text>
        <Text style={[styles.scoreValue, isDark && styles.textWhite]}>
          점수: {score} / {mockQuizzes.length}
        </Text>
        <Text style={[styles.scoreDesc, isDark && styles.textGray]}>
          {score === mockQuizzes.length
            ? '완벽합니다! 모든 문법 문제를 맞추셨습니다. 👍'
            : '조금 더 공부하면 다 맞출 수 있어요! 오답 노트를 확인하고 다시 도전해보세요.'}
        </Text>
        <TouchableOpacity style={styles.restartBtn} onPress={handleRestart}>
          <Text style={styles.restartBtnText}>다시 시작하기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      {/* Progress */}
      <View style={styles.header}>
        <Text style={[styles.progressText, isDark && styles.textGray]}>
          문제 {currentIndex + 1} / {mockQuizzes.length}
        </Text>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${((currentIndex + 1) / mockQuizzes.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Question Card */}
      <View style={[styles.questionCard, isDark && styles.cardDark]}>
        <Text style={[styles.questionText, isDark && styles.textWhite]}>
          {currentQuiz.question}
        </Text>
      </View>

      {/* Options List */}
      <View style={styles.optionsList}>
        {currentQuiz.options.map((opt, idx) => {
          const isSelected = selectedOptionIndex === idx;
          const isCorrectAnswer = idx === currentQuiz.answerIndex;
          
          let btnStyle = styles.optionItem;
          let textStyle = [styles.optionText, isDark && styles.textWhite];
          let checkIcon = null;

          if (isSelected) {
            btnStyle = { ...styles.optionItem, ...styles.optionItemSelected };
            textStyle = [styles.optionTextSelected];
          }

          if (isSubmitted) {
            if (isCorrectAnswer) {
              btnStyle = { ...styles.optionItem, ...styles.optionItemCorrect };
              textStyle = [styles.optionTextCorrect];
              checkIcon = <Ionicons name="checkmark-circle" size={20} color="#10b981" />;
            } else if (isSelected) {
              btnStyle = { ...styles.optionItem, ...styles.optionItemIncorrect };
              textStyle = [styles.optionTextIncorrect];
              checkIcon = <Ionicons name="close-circle" size={20} color="#ef4444" />;
            }
          }

          return (
            <TouchableOpacity
              key={idx}
              style={[btnStyle, isDark && !isSelected && !isSubmitted && styles.cardDark]}
              onPress={() => handleSelectOption(idx)}
              disabled={isSubmitted}
              activeOpacity={0.7}
            >
              <Text style={textStyle}>{opt}</Text>
              {checkIcon}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Explanation Box */}
      {isSubmitted && (
        <View style={[styles.explanationCard, isDark && styles.cardDark]}>
          <View style={styles.explanationHeader}>
            <Ionicons name="information-circle-outline" size={20} color="#6366f1" />
            <Text style={[styles.explanationTitle, isDark && styles.textWhite]}>문법 해설</Text>
          </View>
          <Text style={[styles.explanationText, isDark && styles.textGray]}>
            {currentQuiz.explanation}
          </Text>
        </View>
      )}

      {/* Action Button */}
      <View style={styles.footer}>
        {!isSubmitted ? (
          <TouchableOpacity
            style={[styles.actionBtn, selectedOptionIndex === null && styles.actionBtnDisabled]}
            onPress={handleSubmit}
            disabled={selectedOptionIndex === null}
          >
            <Text style={styles.actionBtnText}>제출하기</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.actionBtn} onPress={handleNext}>
            <Text style={styles.actionBtnText}>
              {currentIndex < mockQuizzes.length - 1 ? '다음 문제' : '퀴즈 완료'}
            </Text>
          </TouchableOpacity>
        )}
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
    paddingVertical: 80,
  },
  header: {
    marginTop: 8,
    marginBottom: 20,
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
  questionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
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
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    lineHeight: 26,
    textAlign: 'center',
  },
  optionsList: {
    gap: 12,
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  optionItemSelected: {
    backgroundColor: '#6366f112',
    borderColor: '#6366f1',
    borderWidth: 2,
  },
  optionItemCorrect: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
    borderWidth: 2,
  },
  optionItemIncorrect: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  optionTextSelected: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4f46e5',
  },
  optionTextCorrect: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#10b981',
  },
  optionTextIncorrect: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  explanationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
    marginBottom: 24,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  explanationText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  footer: {
    marginBottom: 20,
  },
  actionBtn: {
    backgroundColor: '#6366f1',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnDisabled: {
    backgroundColor: '#9ca3af',
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
    marginTop: 8,
  },
  scoreDesc: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 12,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  restartBtn: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  restartBtnText: {
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
