export class GeminiLiveService {
  private ws: WebSocket | null = null;
  private apiKey: string;
  private onAudioChunk: (base64Audio: string) => void;
  private onTranscript: (text: string, role: 'user' | 'ai') => void;
  private onStatusChange: (status: 'disconnected' | 'connecting' | 'connected' | 'error') => void;

  constructor(
    apiKey: string,
    onAudioChunk: (base64Audio: string) => void,
    onTranscript: (text: string, role: 'user' | 'ai') => void,
    onStatusChange: (status: 'disconnected' | 'connecting' | 'connected' | 'error') => void
  ) {
    this.apiKey = apiKey;
    this.onAudioChunk = onAudioChunk;
    this.onTranscript = onTranscript;
    this.onStatusChange = onStatusChange;
  }

  public connect(systemInstruction: string) {
    this.onStatusChange('connecting');
    const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${this.apiKey}`;

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.onStatusChange('connected');
        
        // Send Multimodal Live API Setup Message
        const setupMsg = {
          setup: {
            model: 'models/gemini-2.0-flash-exp', // Multimodal Live API standard model
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: 'Kore', // Prebuilt voices: Puck, Charon, Kore, Fenrir, Aoede
                  },
                },
              },
            },
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
          },
        };

        this.send(setupMsg);
      };

      this.ws.onmessage = (event) => {
        try {
          // Guard for binary messages if any
          if (typeof event.data !== 'string') return;

          const message = JSON.parse(event.data);

          if (message.serverContent) {
            const modelTurn = message.serverContent.modelTurn;
            if (modelTurn && modelTurn.parts) {
              for (const part of modelTurn.parts) {
                // Audio Chunk Output (24kHz PCM, Mono, 16-bit)
                if (part.inlineData && part.inlineData.data) {
                  this.onAudioChunk(part.inlineData.data);
                }
                // Text Transcript of AI Response
                if (part.text) {
                  this.onTranscript(part.text, 'ai');
                }
              }
            }
          }

          if (message.serverContent?.turnComplete) {
            console.log('[Gemini Live] Model completed speaking.');
          }
        } catch (error) {
          console.error('[Gemini Live] Error parsing websocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('[Gemini Live] WebSocket closed:', event.code, event.reason);
        this.onStatusChange('disconnected');
      };

      this.ws.onerror = (error) => {
        console.error('[Gemini Live] WebSocket error:', error);
        this.onStatusChange('error');
      };
    } catch (error) {
      console.error('[Gemini Live] Connection initialization failed:', error);
      this.onStatusChange('error');
    }
  }

  public sendAudioChunk(base64Audio: string) {
    const chunkMsg = {
      realtimeInput: {
        mediaChunks: [
          {
            mimeType: 'audio/pcm;rate=16000', // Input must be 16kHz PCM mono 16-bit
            data: base64Audio,
          },
        ],
      },
    };
    this.send(chunkMsg);
  }

  private send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('[Gemini Live] Cannot send message: socket not open');
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.onStatusChange('disconnected');
  }
}
