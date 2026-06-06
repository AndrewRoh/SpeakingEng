import { PROMPTS } from './prompts';

export interface VocabularyItem {
  word: string;
  meaning: string;
  sentence: string;
}

export interface KeyPatternItem {
  pattern: string;
  meaning: string;
  usage: string;
}

export interface PracticeSentenceItem {
  korean: string;
  english: string;
}

export interface LessonContent {
  introduction: string;
  vocabulary: VocabularyItem[];
  keyPatterns: KeyPatternItem[];
  practiceSentences: PracticeSentenceItem[];
}

export interface GrammarFeedback {
  corrected: string;
  explanation: string;
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function generateLessonContent(
  apiKey: string,
  bookTitle: string,
  category: string,
  difficulty: string,
  chapterTitle: string,
  targetFocus: string
): Promise<LessonContent> {
  const prompt = PROMPTS.textbookGeneration(bookTitle, category, difficulty, chapterTitle, targetFocus);

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          introduction: {
            type: 'STRING',
            description: '이 단원의 학습 소개 및 가이드 (한국어, 2-3문장)',
          },
          vocabulary: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                word: { type: 'STRING', description: '영어 단어 또는 숙어 표현' },
                meaning: { type: 'STRING', description: '한국어 뜻 설명' },
                sentence: { type: 'STRING', description: '해당 단어를 이용한 예시 영어 문장' },
              },
              required: ['word', 'meaning', 'sentence'],
            },
          },
          keyPatterns: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                pattern: { type: 'STRING', description: '핵심 말하기 문법 패턴' },
                meaning: { type: 'STRING', description: '패턴의 한국어 뜻' },
                usage: { type: 'STRING', description: '이 패턴의 구체적인 상황적 사용방법 해설 (한국어)' },
              },
              required: ['pattern', 'meaning', 'usage'],
            },
          },
          practiceSentences: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                korean: { type: 'STRING', description: '영작 연습을 유도하기 위한 한국어 문장' },
                english: { type: 'STRING', description: '그에 대응하는 완벽한 영어 번역 문장' },
              },
              required: ['korean', 'english'],
            },
          },
        },
        required: ['introduction', 'vocabulary', 'keyPatterns', 'practiceSentences'],
      },
    },
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }

    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      throw new Error('Empty response from Gemini API');
    }

    return JSON.parse(textResponse) as LessonContent;
  } catch (error) {
    console.error('Failed to generate lesson content:', error);
    throw error;
  }
}

export async function correctSentence(
  apiKey: string,
  sentence: string
): Promise<GrammarFeedback> {
  const prompt = PROMPTS.grammarCorrection(sentence);

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          corrected: {
            type: 'STRING',
            description: '교정된 올바른 영어 문장',
          },
          explanation: {
            type: 'STRING',
            description: '잘못된 문법적 결함이나 어색한 부분에 대한 한국어 피드백',
          },
        },
        required: ['corrected', 'explanation'],
      },
    },
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }

    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      throw new Error('Empty response from Gemini API');
    }

    return JSON.parse(textResponse) as GrammarFeedback;
  } catch (error) {
    console.error('Failed to correct sentence:', error);
    throw error;
  }
}
