# SpeakingEng App Feature Enhancement Implementation Plan

This implementation plan is a detailed design document aimed at refining the core functionalities of the **SpeakingEng** English conversation learning application, converting the hardcoded mock data areas to live Gemini AI API and SQLite local database integrations, and completing it as a fully functional premium app.

---

## 🌟 Main Development Goals
1. **AI Feedback Enhancement Based on Real-time Conversation Logs**:
   - Refactor the hardcoded post-call feedback report to generate dynamically based on the actual conversation script (subtitle logs).
   - After a conversation session ends, invoke the Gemini API to analyze the learner's spoken sentences for grammar errors, explain the error context in Korean, and extract recommended expressions/vocabulary in real time.
2. **Ebbinghaus Spaced Repetition Vocabulary System Completion**:
   - Save vocabulary items learned during study sessions to the SQLite database (`vocabulary_sr` table).
   - On the Progress screen, load words whose review cycles have arrived today and implement an interactive card-flip UI for immediate review.
3. **Real SQLite DB Data Integration for Progress Statistics**:
   - Replace mock completion rates, study durations, and speaking sentence counts on the progress screen with dynamic data derived from the actual learning history tables (`learning_progress` and `vocabulary_sr`).

---

## 💡 User Review Required

> [!IMPORTANT]
> **API Key Management and Token Consumption**:
> - Real-time conversation feedback consumes Gemini API tokens proportional to the conversation length. We plan to utilize the **Gemini 2.5 Flash** model, optimized for text analysis, to ensure both fast response times and cost efficiency.
> - If no API key is registered (offline mode), structural exception handling will be implemented so that the app degrades gracefully, showing cached data or fallback mock data rather than crashing.

> [!NOTE]
> **Audio Streaming Hardware Permissions**:
> - Real-time PCM audio streaming with Gemini Live depends on the target device platform state (Android/iOS). In this plan, we will prioritize log-based analysis and text corrections first, while refining the audio stream pipe stability.

---

## 🙋‍♂️ Open Questions

> [!WARNING]
> **Spaced Repetition Algorithm Tuning**:
> - We should fine-tune the SuperMemo-2 algorithm variables (`ease_factor` and `interval` increments) to check whether we need to support sub-day (minute/hour) intervals for initial learning stages or keep the default 1-day step increments.
> - Suggest adding a feature allowing learners to manually add corrected sentences or suggested words to their custom vocabulary list with a single touch.

---

## 🛠️ Proposed Changes

### 1. Services & Utilities

---

#### [MODIFY] [geminiText.ts](file:///e:/Works/SpeakingEng/src/services/gemini/geminiText.ts)
- Add the `generateConversationReport` function to receive subtitle history lists and generate feedback reports after session termination.
- Leverage the JSON Response capability of the Gemini 2.5 Flash model with a strict schema to pull grammar feedback, corrected sentences, Korean explanations, and core vocabulary lists.

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
  // 1. Compile chat history into a single context prompt.
  // 2. Generate prompt and call Gemini 2.5 Flash API.
  // 3. Return parsed JSON conforming to the ConversationReport structure.
}
```

#### [MODIFY] [prompts.ts](file:///e:/Works/SpeakingEng/src/services/gemini/prompts.ts)
- Define `PROMPTS.conversationReport` to configure a detailed system instruction for extracting spoken grammar slips and generating high-quality Korean tips.

---

### 2. Components & Screens

---

#### [MODIFY] [conversation.tsx](file:///e:/Works/SpeakingEng/src/app/(tabs)/conversation.tsx)
- Modify the `handleEndCall` callback: stop the call session, show a loading spinner, fetch the analysis report from `generateConversationReport` using accumulated subtitle logs, and present the report.
- Automatically save recommended words into the SQLite database (`addWordToReview`) upon session completion for spaced review later.

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
+     // Automatically insert recommended words into review database
+     for (const wordObj of report.words) {
+       await addWordToReview(wordObj.word, wordObj.meaning, report.goodSentence);
+     }
+   } catch (e) {
+     Alert.alert("Failed to generate report", "Using offline fallback report.");
+     setReportFeedback(fallbackMockReport);
+   } finally {
+     setIsLoadingReport(false);
+   }
  };
```

#### [MODIFY] [lessonId.tsx](file:///e:/Works/SpeakingEng/src/app/book/lesson/[lessonId].tsx)
- Enable an "Add to review" action button next to vocabulary words in the lesson view, allowing manually triggerable database insertion.
- Record lesson completion info properly via `saveProgress` upon tapping the voice practice CTA.

#### [MODIFY] [progress.tsx](file:///e:/Works/SpeakingEng/src/app/(tabs)/progress.tsx)
- **Local DB Spaced Repetition Review View**:
  - Load target review words on component mount using `getWordsToReview`.
  - Build an interactive flip-card modal or card container allowing the user to mark words as "Known" (Correct) or "Unknown" (Incorrect).
  - Feed selections back to `reviewWord` to reschedule review dates.
- **Dynamic Stats Queries**:
  - Aggregate book progress based on actual `completed` rows from `learning_progress`.
  - Reflect real stats for total speaking count and correctness instead of mock metrics.

---

## 🧪 Verification Plan

### Manual Verification Scenarios
1. **API Key Presence**:
   - Ensure the app blocks connection attempts and guides users to settings if the key is empty.
   - Confirm active connection once the API key is successfully supplied.
2. **AI Feedback Report Generation**:
   - Start a Live call session, speak 3-4 sentences with intentional grammatical mistakes (e.g., "I is happy").
   - Terminate the call, verify the loading indicator appears, and confirm the generated card correctly highlights and explains the grammar error.
3. **Spaced Repetition Review Loop**:
   - Navigate to a book lesson, save a word, return to the Progress screen, and confirm it is visible under "Words to review today".
   - Toggle known/unknown on the flip-card and verify the SQLite `next_review` timestamp shifts according to SM-2 calculations.
