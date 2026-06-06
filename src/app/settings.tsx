import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
  useColorScheme,
  Switch,
} from 'react-native';
import { useApiKey } from '@/contexts/ApiKeyContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { apiKey, saveApiKey, deleteApiKey } = useApiKey();
  const [keyInput, setKeyInput] = useState('');
  const [isSecure, setIsSecure] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    if (apiKey) {
      setKeyInput(apiKey);
    } else {
      setKeyInput('');
    }
  }, [apiKey]);

  const handleSave = async () => {
    if (!keyInput.trim()) {
      Alert.alert('오류', 'API 키를 입력해주세요.');
      return;
    }

    try {
      await saveApiKey(keyInput.trim());
      Alert.alert('성공', 'Gemini API 키가 저장되었습니다.', [
        { text: '확인', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('오류', 'API 키 저장에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'API 키 삭제',
      '저장된 API 키를 삭제하시겠습니까? 삭제하면 AI 관련 기능을 사용할 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteApiKey();
              setKeyInput('');
              Alert.alert('성공', 'API 키가 삭제되었습니다.');
            } catch (error) {
              Alert.alert('오류', 'API 키 삭제에 실패했습니다.');
            }
          },
        },
      ]
    );
  };

  const testApiKey = async () => {
    if (!keyInput.trim()) {
      Alert.alert('오류', '테스트할 API 키를 입력해주세요.');
      return;
    }

    setIsTesting(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${keyInput.trim()}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Hello, respond with exactly "API Key is valid!"' }] }],
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        Alert.alert('성공', 'API 키 인증에 성공했습니다! 정상적으로 작동합니다.');
      } else {
        const errMsg = data.error?.message || '인증 오류가 발생했습니다.';
        Alert.alert('인증 실패', `유효하지 않은 API 키입니다.\n\n상세: ${errMsg}`);
      }
    } catch (error) {
      Alert.alert('오류', '네트워크 연결 오류 또는 유효하지 않은 API 키 형식입니다.');
    } finally {
      setIsTesting(false);
    }
  };

  const openAiStudio = () => {
    Linking.openURL('https://aistudio.google.com/apikey');
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDark && styles.textWhite]}>Google Gemini API 설정</Text>
        
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cardLabel, isDark && styles.textGray]}>Gemini API Key</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={keyInput}
              onChangeText={setKeyInput}
              placeholder="AI Studio에서 발급받은 API 키 입력"
              placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
              secureTextEntry={isSecure}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setIsSecure(!isSecure)}
            >
              <Ionicons
                name={isSecure ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.helpText, isDark && styles.textGray]}>
            앱에서 실시간 원어민 대화, 교재 콘텐츠 생성 및 피드백을 받으려면 Google Gemini API 키가 필요합니다. 입력된 키는 디바이스 내부(AsyncStorage)에만 안전하게 저장됩니다.
          </Text>

          <TouchableOpacity style={styles.linkButton} onPress={openAiStudio}>
            <Text style={styles.linkText}>Gemini API Key 무료 발급 받기 (Google AI Studio)</Text>
            <Ionicons name="open-outline" size={16} color="#4f46e5" />
          </TouchableOpacity>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.btn, styles.btnOutline, isTesting && styles.btnDisabled]}
              onPress={testApiKey}
              disabled={isTesting}
            >
              {isTesting ? (
                <ActivityIndicator size="small" color="#4f46e5" />
              ) : (
                <Text style={styles.btnOutlineText}>키 테스트</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleSave}>
              <Text style={styles.btnPrimaryText}>저장하기</Text>
            </TouchableOpacity>
          </View>

          {apiKey && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
              <Text style={styles.deleteText}>저장된 API 키 삭제</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDark && styles.textWhite]}>애플리케이션 정보</Text>
        <View style={[styles.card, isDark && styles.cardDark]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, isDark && styles.textGray]}>앱 버전</Text>
            <Text style={[styles.infoValue, isDark && styles.textWhite]}>1.0.0 (Expo SDK 56)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, isDark && styles.textGray]}>개발 모델</Text>
            <Text style={[styles.infoValue, isDark && styles.textWhite]}>Gemini 2.5 Flash / Live</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, isDark && styles.textGray]}>목적</Text>
            <Text style={[styles.infoValue, isDark && styles.textWhite]}>시원스쿨 영어회화 AI 자기주도학습</Text>
          </View>
        </View>
      </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 4,
  },
  textWhite: {
    color: '#f9fafb',
  },
  textGray: {
    color: '#9ca3af',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#1f2937',
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#111827',
  },
  inputDark: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
    color: '#ffffff',
  },
  eyeButton: {
    padding: 8,
  },
  helpText: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 12,
    lineHeight: 18,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 4,
  },
  linkText: {
    fontSize: 13,
    color: '#4f46e5',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: '#4f46e5',
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: '#4f46e5',
    backgroundColor: 'transparent',
  },
  btnOutlineText: {
    color: '#4f46e5',
    fontSize: 15,
    fontWeight: 'bold',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
    gap: 6,
  },
  deleteText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
});
