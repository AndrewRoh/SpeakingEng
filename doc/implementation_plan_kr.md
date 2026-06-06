# SpeakingEng 앱 기능 고도화 구현 계획서 (Implementation Plan)

이 구현 계획서는 **SpeakingEng** 영어 회화 학습 애플리케이션의 핵심 기능을 정교화하고, 하드코딩된 모의(Mock) 데이터 영역을 실시간 AI API(Gemini)와 SQLite 로컬 데이터베이스 연동으로 전환하여 실제로 동작하는 프리미엄 앱으로 완성시키기 위한 상세 설계 문서입니다.

---

## 🌟 주요 개발 목표
1. **실시간 대화 로그 기반 AI 피드백 고도화**:
   - 하드코딩되어 제공되던 통화 완료 리포트를 실제 대화 스크립트(자막 로그) 기반으로 전환합니다.
   - 대화 종료 후 Gemini API를 호출하여 학습자의 오문장 교정(문법 오류), 교정 이유(한국어 해설), 추천 표현/어휘를 실시간으로 분석 및 노출합니다.
2. **에빙하우스 망각 곡선(Spaced Repetition) 복습 시스템 완성**:
   - 학습 단계에서 제공된 핵심 단어들이 SQLite 데이터베이스(`vocabulary_sr` 테이블)에 누적되도록 합니다.
   - 진도 화면(Progress)에서 오늘 복습 주기가 도래한 단어를 로드하고, 즉시 카드로 복습을 수행할 수 있는 인터랙티브 UI를 구현합니다.
3. **실제 SQLite DB 데이터 기반 진도(Progress) 통계 연동**:
   - 기존의 목업 진도율, 학습 시간, 스피킹 문장 수 등의 통계를 실제 학습 이력(`learning_progress` 및 `vocabulary_sr` 테이블)과 결합하여 동적으로 렌더링합니다.

---

## 💡 사용자 검토 사항 (User Review Required)

> [!IMPORTANT]
> **API 키 관리 및 토큰 사용량**:
> - 실시간 대화 피드백은 대화 양에 비례하여 Gemini API 토큰을 소비합니다. 텍스트 분석에 최적화된 **Gemini 2.5 Flash** 모델을 사용하여 빠른 응답성과 경제성을 동시에 확보합니다.
> - API 키가 등록되지 않은 상태(오프라인 모드)일 경우, 앱이 중단되지 않고 로컬 캐시나 기본 메타데이터(Mock)로 우아하게 대체 작동(Graceful Degradation)할 수 있도록 구조적 예외 처리를 반영합니다.

> [!NOTE]
> **오디오 스트리밍 하드웨어 권한**:
> - Gemini Live의 실시간 PCM 오디오 처리는 기기 상태(안드로이드/iOS)에 영향을 받습니다. 본 계획서에서는 우선 대화 기록(텍스트 자막)을 이용한 분석 및 교정에 중점을 두고, 오디오 스트림 송수신 파이프라인의 완성도를 높입니다.

---

## 🙋‍♂️ 오픈 질문 (Open Questions)

> [!WARNING]
> **복습 알고리즘 세부 튜닝**:
> - 현재 구현되어 있는 SuperMemo-2 기반 망각 곡선 알고리즘(`ease_factor` 및 `interval` 점진 가중치)이 지나치게 빡빡하거나 느슨하지 않도록 주기를 하루(1일) 단위 외에 수분/시간 단위 초기 단계도 지원할지 여부를 조율해야 합니다.
> - 교정된 오문장과 추천 단어를 학습자가 터치 한 번으로 '내 단어장(복습 리스트)'에 즉시 수동 저장할 수 있는 기능 추가 여부를 제안합니다.

---

## 🛠️ 주요 변경 사항 (Proposed Changes)

### 1. 서비스 및 유틸리티 레이어 (Services & Utilities)

---

#### [MODIFY] [geminiText.ts](file:///e:/Works/SpeakingEng/src/services/gemini/geminiText.ts)
- 대화 종료 후 실시간 자막 이력(Subtitle list)을 전달받아 피드백 리포트를 생성하는 `generateConversationReport` 함수를 추가합니다.
- Gemini 2.5 Flash 모델의 JSON Response 기능을 활용하여 문법 오류 분석, 교정 문장, 한국어 이유 설명, 핵심 어휘 리스트를 정밀하게 추출하는 스키마를 구성합니다.

```typescript
export interface ConversationReport {
  badSentence: string;
  goodSentence: string;
  explanation: string;
  words: { word: string; meaning: string }[];
}

export async function generateConversationReport(
  apiKey: string,
  chatHistory: { sender: 'user' | 'ai'; text: string }[]
): Promise<ConversationReport> {
  // 1. 자막 로그를 하나의 컨텍스트로 정합
  // 2. prompt 생성 및 Gemini 2.5 Flash API 호출
  // 3. 정밀 JSON 구조(badSentence, goodSentence, explanation, words) 반환
}
```

#### [MODIFY] [prompts.ts](file:///e:/Works/SpeakingEng/src/services/gemini/prompts.ts)
- `PROMPTS.conversationReport` 템플릿을 추가하여 학습자가 대화 중 실수한 표현을 세밀하게 골라내고 어휘 팁을 제공하도록 System Prompt를 구성합니다.

---

### 2. 컴포넌트 및 화면 레이어 (Components & Screens)

---

#### [MODIFY] [conversation.tsx](file:///e:/Works/SpeakingEng/src/app/(tabs)/conversation.tsx)
- 통화 종료(`handleEndCall`) 핸들러에서 대화 종료 후 로딩 스피너를 띄우고, 누적된 자막(`subtitles`) 데이터를 `generateConversationReport` API로 전달해 실시간 리포트를 받아오도록 수정합니다.
- 추출된 추천 단어들을 단원 완료 시 SQLite 데이터베이스(`addWordToReview`)에 자동으로 등록해 나중에 학습자가 복습할 수 있게 설계합니다.

```diff
  const handleEndCall = async () => {
    endSession();
-   setReportFeedback({ ...MockData });
-   setShowReport(true);
+   setIsLoadingReport(true);
+   try {
+     const report = await generateConversationReport(apiKey, subtitles);
+     setReportFeedback(report);
+     setShowReport(true);
+     // 추천 단어들을 자동으로 Spaced Repetition 복습 리스트에 등록
+     for (const wordObj of report.words) {
+       await addWordToReview(wordObj.word, wordObj.meaning, report.goodSentence);
+     }
+   } catch (e) {
+     Alert.alert("리포트 생성 실패", "오프라인 샘플 리포트로 대체합니다.");
+     setReportFeedback(fallbackMockReport);
+   } finally {
+     setIsLoadingReport(false);
+   }
  };
```

#### [MODIFY] [lessonId.tsx](file:///e:/Works/SpeakingEng/src/app/book/lesson/[lessonId].tsx)
- 단원 상세 화면에서 학습자가 단어나 영작 예문을 학습할 때, 단어 옆에 "암기 리스트에 추가" 또는 "복습 대상 지정" 버튼을 활성화하여 클릭 시 SQLite `vocabulary_sr`에 단어가 수동/자동으로 들어가도록 기능을 매핑합니다.
- `voicePracticeLink` 클릭 시 학습 진행 정보를 `saveProgress`에 동적 저장하여 진도 통계에 정확히 누적합니다.

#### [MODIFY] [progress.tsx](file:///e:/Works/SpeakingEng/src/app/(tabs)/progress.tsx)
- **로컬 DB 기반 망각 곡선 복습 뷰 개발**:
  - 화면 마운트 시 `getWordsToReview` 함수를 호출하여 오늘 복습해야 하는 단어 목록(리스트 및 개수)을 가져옵니다.
  - 사용자가 복습 카드를 탭하여 뜻을 확인하고, "알고 있음(Correct)" / "모름(Incorrect)"을 선택할 수 있는 인터랙티브 모달 또는 플립 카드 UI를 하단에 임베딩합니다.
  - 선택 결과에 따라 데이터베이스(`reviewWord`) 상태를 업데이트하여 다음 복습 주기를 자동으로 연동합니다.
- **실제 학습 통계 쿼리**:
  - `learning_progress`의 `completed` 컬럼을 책별로 집계하여 탭의 교재 완료율 그래프에 실시간으로 반영합니다.
  - 스피킹 누적 문장 및 정확도를 데이터 기록 기반으로 요약하여 렌더링합니다.

---

## 🧪 검증 계획 (Verification Plan)

### 수동 검증 시나리오
1. **API 키 설정 검증**:
   - 설정 화면에서 API 키를 비운 채로 대화를 시도할 때 차단 및 가이드 문구 노출 확인
   - 올바른 API 키 저장 후 정상 진입 확인
2. **실시간 대화 리포트 생성 테스트**:
   - 실시간 Live 통화 모드를 실행하여 3-4문장 정도의 영어 대화를 수행 (일부러 문법적 오류 포함: 예: "I is happy").
   - 통화를 종료한 뒤, 로딩 애니메이션이 작동하고 실제 대화에 기초한 맞춤 피드백(오류 문장 검출 및 설명)이 잘 표현되는지 검증.
3. **망각 곡선 단어 등록 및 복습 흐름 테스트**:
   - 단원 교재의 단어 탭에서 발음 듣기 및 단어 저장을 시도한 뒤, Progress 탭으로 돌아와 "오늘 복습할 단어" 리스트에 실시간 반영되는지 확인.
   - 단어 카드를 뒤집고 '알아요'/'몰라요' 처리 시, SQLite DB의 `next_review`가 연산에 따라 뒤로 밀리거나 다음 날로 재조정되는 동작 테스트.
