import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  useColorScheme,
  Animated,
  Platform,
} from 'react-native';
import { useApiKey } from '@/contexts/ApiKeyContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGeminiLive } from '@/hooks/useGeminiLive';
import { PROMPTS } from '@/services/gemini/prompts';

export default function ConversationScreen() {
  const { apiKey } = useApiKey();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { status, messages: subtitles, startSession, endSession } = useGeminiLive();
  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';
  const [timer, setTimer] = useState(0);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [reportFeedback, setReportFeedback] = useState<{
    badSentence: string;
    goodSentence: string;
    explanation: string;
    words: { word: string; meaning: string }[];
  } | null>(null);

  const timerInterval = useRef<any>(null);
  
  // Waveform animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const barHeight1 = useRef(new Animated.Value(20)).current;
  const barHeight2 = useRef(new Animated.Value(30)).current;
  const barHeight3 = useRef(new Animated.Value(45)).current;
  const barHeight4 = useRef(new Animated.Value(30)).current;
  const barHeight5 = useRef(new Animated.Value(20)).current;

  // Waveform animation loop
  useEffect(() => {
    let animationLoop: { stop: () => void } | null = null;
    if (isConnected) {
      const startWaveformAnimation = () => {
        const animateBar = (val: Animated.Value, min: number, max: number) => {
          return Animated.loop(
            Animated.sequence([
              Animated.timing(val, {
                toValue: Math.floor(Math.random() * (max - min + 1) + min),
                duration: 150 + Math.random() * 100,
                useNativeDriver: false,
              }),
              Animated.timing(val, {
                toValue: min,
                duration: 150 + Math.random() * 100,
                useNativeDriver: false,
              }),
            ])
          );
        };

        const pulse = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.15,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1.0,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        );

        const a1 = animateBar(barHeight1, 10, 40);
        const a2 = animateBar(barHeight2, 15, 60);
        const a3 = animateBar(barHeight3, 20, 90);
        const a4 = animateBar(barHeight4, 15, 60);
        const a5 = animateBar(barHeight5, 10, 40);

        pulse.start();
        a1.start();
        a2.start();
        a3.start();
        a4.start();
        a5.start();

        return {
          stop: () => {
            pulse.stop();
            a1.stop();
            a2.stop();
            a3.stop();
            a4.stop();
            a5.stop();
            // Reset to defaults
            pulseAnim.setValue(1);
            barHeight1.setValue(20);
            barHeight2.setValue(30);
            barHeight3.setValue(45);
            barHeight4.setValue(30);
            barHeight5.setValue(20);
          },
        };
      };
      animationLoop = startWaveformAnimation();
    } else {
      if (animationLoop) {
        (animationLoop as any).stop();
      }
    }

    return () => {
      if (animationLoop) {
        (animationLoop as any).stop();
      }
    };
  }, [isConnected]);

  // Call timer logic
  useEffect(() => {
    if (isConnected) {
      timerInterval.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
      setTimer(0);
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [isConnected]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    if (!apiKey) {
      router.push('/settings');
      return;
    }
    setShowReport(false);
    const systemPrompt = PROMPTS.conversationSystemPrompt(
      '기본 자유 회화',
      '일상 톡톡',
      '자유로운 아침 일과 및 취미 일상 대화 나누기'
    );
    startSession(systemPrompt);
  };

  const handleEndCall = () => {
    endSession();
    setReportFeedback({
      badSentence: '❌ I am drinking water and make breakfast.',
      goodSentence: '➔ I drink water and make breakfast.',
      explanation: '설명: 아침 습관이나 일과처럼 반복되는 동작은 단순 현재 시제로 통일해야 매끄럽습니다.',
      words: [
        { word: 'commute', meaning: '통근하다, 출퇴근하다' },
        { word: 'grab breakfast', meaning: '아침을 간단히 먹다' }
      ]
    });
    setShowReport(true);
  };

  if (!apiKey) {
    return (
      <View style={[styles.container, isDark && styles.containerDark, styles.centered]}>
        <Ionicons name="mic-off" size={64} color={isDark ? '#4b5563' : '#9ca3af'} />
        <Text style={[styles.noKeyTitle, isDark && styles.textWhite]}>Gemini API 키가 필요합니다</Text>
        <Text style={[styles.noKeyDesc, isDark && styles.textGray]}>
          실시간 음성 대화를 사용하려면 API 키 설정이 필요합니다. 설정 화면에서 키를 등록해주세요.
        </Text>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.settingsBtnText}>설정하러 가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Connected UI */}
      {isConnected && (
        <View style={styles.callContainer}>
          {/* Status and Timer */}
          <View style={styles.callHeader}>
            <View style={styles.statusDotWrapper}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>통화 연결 중 (Gemini Live)</Text>
            </View>
            <Text style={[styles.timerText, isDark && styles.textWhite]}>{formatTime(timer)}</Text>
          </View>

          {/* Subtitles Area (Optional) */}
          <View style={[styles.subtitlesContainer, isDark && styles.subtitlesContainerDark]}>
            {showSubtitles ? (
              <ScrollView
                style={styles.subtitlesScroll}
                contentContainerStyle={styles.subtitlesContent}
                ref={(ref) => ref?.scrollToEnd({ animated: true })}
              >
                {subtitles.map((sub, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.subBubble,
                      sub.sender === 'user' ? styles.userBubble : styles.aiBubble,
                      sub.sender === 'ai' && isDark && styles.aiBubbleDark,
                    ]}
                  >
                    <Text
                      style={[
                        styles.subText,
                        sub.sender === 'user' ? styles.userSubText : (isDark ? styles.textWhite : styles.aiSubText),
                      ]}
                    >
                      {sub.text}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.subtitlesOff}>
                <Ionicons name="chatbox-outline" size={24} color="#6b7280" />
                <Text style={styles.subtitlesOffText}>자막이 비활성화되었습니다</Text>
              </View>
            )}
          </View>

          {/* Waveform & Pulse Button Area */}
          <View style={styles.waveSection}>
            <Animated.View
              style={[
                styles.pulseCircle,
                { transform: [{ scale: pulseAnim }] },
              ]}
            />
            <View style={styles.waveformContainer}>
              <Animated.View style={[styles.waveBar, { height: barHeight1 }]} />
              <Animated.View style={[styles.waveBar, { height: barHeight2 }]} />
              <Animated.View style={[styles.waveBar, { height: barHeight3, backgroundColor: '#6366f1' }]} />
              <Animated.View style={[styles.waveBar, { height: barHeight4 }]} />
              <Animated.View style={[styles.waveBar, { height: barHeight5 }]} />
            </View>
          </View>

          {/* Controls Footer */}
          <View style={styles.callFooter}>
            <TouchableOpacity
              style={[styles.controlBtn, showSubtitles ? styles.controlBtnActive : styles.controlBtnInactive]}
              onPress={() => setShowSubtitles(!showSubtitles)}
            >
              <Ionicons
                name={showSubtitles ? 'chatbox' : 'chatbox-outline'}
                size={22}
                color={showSubtitles ? '#ffffff' : '#6b7280'}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.hangUpButton} onPress={handleEndCall}>
              <Ionicons name="call" size={32} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.controlBtn, styles.controlBtnInactive]}>
              <Ionicons name="volume-high" size={22} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Disconnected / Ready UI */}
      {!isConnected && !showReport && (
        <View style={styles.readyContainer}>
          <Text style={[styles.readyTitle, isDark && styles.textWhite]}>원어민 AI와 통화 시작하기</Text>
          <Text style={[styles.readyDesc, isDark && styles.textGray]}>
            부담 없이 영어로 대화하세요. Gemini Live 기술이 탑재되어 지연 없이 실시간 대화가 가능합니다. 잘못된 문법은 AI 코치가 친절하게 바로 잡아줍니다.
          </Text>

          <View style={styles.micCircleBig}>
            <Ionicons name="mic" size={60} color="#6366f1" />
          </View>

          <TouchableOpacity
            style={[styles.startCallBtn, isConnecting && styles.startCallBtnDisabled]}
            onPress={handleStartCall}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Ionicons name="call" size={20} color="#ffffff" />
                <Text style={styles.startCallBtnText}>AI 전화 연결하기</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Post Conversation Learning Report */}
      {!isConnected && showReport && (
        <ScrollView style={styles.reportScroll} contentContainerStyle={styles.reportContainer}>
          <View style={styles.reportHeader}>
            <Ionicons name="checkmark-circle" size={48} color="#10b981" />
            <Text style={[styles.reportTitleText, isDark && styles.textWhite]}>회화 세션 완료 리포트</Text>
            <Text style={[styles.reportDate, isDark && styles.textGray]}>대화 시간: 02:40</Text>
          </View>

          {/* Grammar Correction Section */}
          <Text style={[styles.reportSectionTitle, isDark && styles.textWhite]}>문법 피드백 & 교정</Text>
          <View style={[styles.reportCard, isDark && styles.cardDark]}>
            <View style={styles.correctionRow}>
              <Text style={styles.badSentence}>{reportFeedback?.badSentence || '❌ I am drinking water and make breakfast.'}</Text>
              <Text style={styles.goodSentence}>{reportFeedback?.goodSentence || '➔ I drink water and make breakfast.'}</Text>
              <Text style={[styles.correctionReason, isDark && styles.textGray]}>
                {reportFeedback?.explanation || '설명: 현재 시제를 사용하여 반복되는 아침 습관을 일관되게 표현하는 것이 좋습니다. 현재진행형(am drinking)과 일반현재(make)를 함께 쓰기보다 단순현재 시제로 통일하세요.'}
              </Text>
            </View>
          </View>

          {/* Recommended Vocab */}
          <Text style={[styles.reportSectionTitle, isDark && styles.textWhite]}>대화에서 추천 단어</Text>
          <View style={[styles.reportCard, isDark && styles.cardDark, { gap: 12 }]}>
            {(reportFeedback?.words || [
              { word: 'commute', meaning: '통근하다, 출퇴근하다 (아침 일과 얘기 시 추천)' },
              { word: 'grab breakfast', meaning: '아침을 간단히 먹다 (make breakfast의 원어민식 대체 표현)' }
            ]).map((w, idx) => (
              <View key={idx} style={styles.vocabRow}>
                <Text style={[styles.vocabWord, isDark && styles.textWhite]}>{w.word}</Text>
                <Text style={[styles.vocabMeaning, isDark && styles.textGray]}>{w.meaning}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.doneReportBtn}
            onPress={() => setShowReport(false)}
          >
            <Text style={styles.doneReportBtnText}>확인 완료</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
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
    padding: 24,
  },
  noKeyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  noKeyDesc: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  settingsBtn: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  settingsBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  readyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  readyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  readyDesc: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 48,
    paddingHorizontal: 12,
  },
  textWhite: {
    color: '#ffffff',
  },
  textGray: {
    color: '#9ca3af',
  },
  cardDark: {
    backgroundColor: '#1f2937',
  },
  micCircleBig: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#6366f11c',
    borderWidth: 1,
    borderColor: '#6366f150',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
  },
  startCallBtn: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  startCallBtnDisabled: {
    backgroundColor: '#9ca3af',
  },
  startCallBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  callContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  statusDotWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitlesContainer: {
    height: 180,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  subtitlesContainerDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  subtitlesScroll: {
    flex: 1,
  },
  subtitlesContent: {
    gap: 8,
    paddingBottom: 8,
  },
  subBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    maxWidth: '85%',
  },
  userBubble: {
    backgroundColor: '#6366f1',
    alignSelf: 'flex-end',
  },
  aiBubble: {
    backgroundColor: '#f3f4f6',
    alignSelf: 'flex-start',
  },
  aiBubbleDark: {
    backgroundColor: '#374151',
  },
  subText: {
    fontSize: 14,
    lineHeight: 18,
  },
  userSubText: {
    color: '#ffffff',
  },
  aiSubText: {
    color: '#374151',
  },
  subtitlesOff: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  subtitlesOffText: {
    fontSize: 13,
    color: '#6b7280',
  },
  waveSection: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pulseCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6366f112',
    position: 'absolute',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 100,
  },
  waveBar: {
    width: 6,
    borderRadius: 3,
    backgroundColor: '#a5b4fc',
  },
  callFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlBtnActive: {
    backgroundColor: '#6366f1',
  },
  controlBtnInactive: {
    backgroundColor: '#e5e7eb',
  },
  hangUpButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  reportScroll: {
    flex: 1,
  },
  reportContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  reportHeader: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  reportTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
  },
  reportDate: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  reportSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
    marginTop: 16,
    marginLeft: 4,
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
  correctionRow: {
    gap: 8,
  },
  badSentence: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
  },
  goodSentence: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  correctionReason: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
    marginTop: 4,
  },
  vocabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  vocabWord: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },
  vocabMeaning: {
    fontSize: 13,
    color: '#6b7280',
  },
  doneReportBtn: {
    backgroundColor: '#6366f1',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  doneReportBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
