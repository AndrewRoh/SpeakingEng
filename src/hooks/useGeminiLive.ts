import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { GeminiLiveService } from '@/services/gemini/geminiLive';
import { useApiKey } from '@/contexts/ApiKeyContext';
import { Audio } from 'expo-av';

export interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export function useGeminiLive() {
  const { apiKey } = useApiKey();
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeSpeech, setActiveSpeech] = useState<string>('');

  const liveServiceRef = useRef<GeminiLiveService | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const isRecordingRef = useRef<boolean>(false);

  // Setup audio recording permissions and setup Audio mode
  const setupAudio = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('권한 오류', '마이크 권한이 필요합니다.');
        return false;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        playThroughEarpieceAndroid: false, // Route to speaker phone
      });

      return true;
    } catch (e) {
      console.error('Failed to configure Audio settings:', e);
      return false;
    }
  };

  const handleAudioChunk = useCallback((base64Audio: string) => {
    // Playback incoming 24kHz PCM chunk.
    // In production, we'll write this base64 chunk to a WAV buffer or use native player.
    // For local dev simulation, this is called whenever Gemini Live sends audio.
    console.log('[useGeminiLive] Received audio chunk length:', base64Audio.length);
  }, []);

  const handleTranscript = useCallback((text: string, role: 'user' | 'ai') => {
    if (role === 'ai') {
      setActiveSpeech((prev) => prev + text);
    } else {
      setMessages((prev) => [...prev, { sender: 'user', text }]);
    }
  }, []);

  const handleStatusChange = useCallback((newStatus: ConnectionStatus) => {
    setStatus(newStatus);
    if (newStatus === 'connected') {
      setMessages([{ sender: 'ai', text: 'Hello! I am your Gemini Speaking Coach. What would you like to talk about today?' }]);
    }
  }, []);

  const startSession = async (systemInstruction: string) => {
    if (!apiKey) {
      Alert.alert('오류', 'API 키가 필요합니다.');
      return;
    }

    const audioReady = await setupAudio();
    if (!audioReady) return;

    // Reset messages
    setMessages([]);
    setActiveSpeech('');

    liveServiceRef.current = new GeminiLiveService(
      apiKey,
      handleAudioChunk,
      handleTranscript,
      handleStatusChange
    );

    liveServiceRef.current.connect(systemInstruction);

    // Start Recording mic chunks (using expo-av or native PCM hook)
    try {
      const recording = new Audio.Recording();
      // Configure for 16kHz PCM (mono) as required by Gemini Live
      await recording.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: 2, // MPEG_4
          audioEncoder: 3, // AAC
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: 20, // Min quality for lower latency
          sampleRate: 16000,
          numberOfChannels: 1,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
          bitRate: 128000,
        },
        web: {}
      });

      await recording.startAsync();
      recordingRef.current = recording;
      isRecordingRef.current = true;

      // In real-time development on S23, we poll the recording buffer or hook native stream.
      // We simulate streaming chunks by checking recording status every 100ms
      console.log('[useGeminiLive] Started microphone capture.');
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const endSession = async () => {
    // Stop recording
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch (e) {
        // Already stopped
      }
      recordingRef.current = null;
    }
    isRecordingRef.current = false;

    // Flush current active speech
    if (activeSpeech) {
      setMessages((prev) => [...prev, { sender: 'ai', text: activeSpeech }]);
      setActiveSpeech('');
    }

    // Disconnect websocket
    if (liveServiceRef.current) {
      liveServiceRef.current.disconnect();
      liveServiceRef.current = null;
    }

    setStatus('disconnected');
  };

  useEffect(() => {
    return () => {
      endSession();
    };
  }, []);

  return {
    status,
    messages: activeSpeech ? [...messages, { sender: 'ai', text: activeSpeech }] : messages,
    startSession,
    endSession,
  };
}
