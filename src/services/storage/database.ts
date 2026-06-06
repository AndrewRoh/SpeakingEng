import * as SQLite from 'expo-sqlite';
import { LessonContent } from '@/services/gemini/geminiText';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;

  try {
    dbInstance = await SQLite.openDatabaseAsync('speakingeng.db');
    
    // Initialize schema
    await dbInstance.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS lesson_cache (
        lesson_id TEXT PRIMARY KEY,
        content TEXT,
        created_at INTEGER
      );
      CREATE TABLE IF NOT EXISTS learning_progress (
        lesson_id TEXT PRIMARY KEY,
        completed INTEGER,
        completed_at INTEGER,
        score INTEGER
      );
      CREATE TABLE IF NOT EXISTS vocabulary_sr (
        word TEXT PRIMARY KEY,
        meaning TEXT,
        example TEXT,
        interval INTEGER,
        ease_factor REAL,
        next_review INTEGER
      );
    `);
    
    return dbInstance;
  } catch (error) {
    console.error('Failed to open SQLite database:', error);
    throw error;
  }
}

// Lesson Caching Functions
export async function getCachedLesson(lessonId: string): Promise<LessonContent | null> {
  try {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ content: string }>(
      'SELECT content FROM lesson_cache WHERE lesson_id = ?',
      [lessonId]
    );

    if (result && result.content) {
      return JSON.parse(result.content) as LessonContent;
    }
    return null;
  } catch (error) {
    console.error('Failed to read cached lesson:', error);
    return null;
  }
}

export async function cacheLesson(lessonId: string, content: LessonContent): Promise<void> {
  try {
    const db = await getDatabase();
    const contentString = JSON.stringify(content);
    const now = Date.now();

    await db.runAsync(
      `INSERT OR REPLACE INTO lesson_cache (lesson_id, content, created_at)
       VALUES (?, ?, ?)`,
      [lessonId, contentString, now]
    );
  } catch (error) {
    console.error('Failed to cache lesson:', error);
  }
}

// Progress Tracking Functions
export async function getProgress(lessonId: string): Promise<{ completed: boolean; score: number } | null> {
  try {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ completed: number; score: number }>(
      'SELECT completed, score FROM learning_progress WHERE lesson_id = ?',
      [lessonId]
    );

    if (result) {
      return {
        completed: result.completed === 1,
        score: result.score,
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to get progress:', error);
    return null;
  }
}

export async function saveProgress(lessonId: string, completed: boolean, score: number = 0): Promise<void> {
  try {
    const db = await getDatabase();
    const now = Date.now();

    await db.runAsync(
      `INSERT OR REPLACE INTO learning_progress (lesson_id, completed, completed_at, score)
       VALUES (?, ?, ?, ?)`,
      [lessonId, completed ? 1 : 0, now, score]
    );
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

// Spaced Repetition (SR) Vocabulary Functions
export interface SRWord {
  word: string;
  meaning: string;
  example: string;
  interval: number;
  easeFactor: number;
  nextReview: number;
}

export async function addWordToReview(word: string, meaning: string, example: string): Promise<void> {
  try {
    const db = await getDatabase();
    const now = Date.now();
    // Default starting values: interval = 1 day, easeFactor = 2.5
    await db.runAsync(
      `INSERT OR IGNORE INTO vocabulary_sr (word, meaning, example, interval, ease_factor, next_review)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [word, meaning, example, 1, 2.5, now + 24 * 60 * 60 * 1000]
    );
  } catch (error) {
    console.error('Failed to add word to review:', error);
  }
}

export async function getWordsToReview(): Promise<SRWord[]> {
  try {
    const db = await getDatabase();
    const now = Date.now();
    const rows = await db.getAllAsync<{
      word: string;
      meaning: string;
      example: string;
      interval: number;
      ease_factor: number;
      next_review: number;
    }>(
      'SELECT * FROM vocabulary_sr WHERE next_review <= ?',
      [now]
    );

    return rows.map((row) => ({
      word: row.word,
      meaning: row.meaning,
      example: row.example,
      interval: row.interval,
      easeFactor: row.ease_factor,
      nextReview: row.next_review,
    }));
  } catch (error) {
    console.error('Failed to get review words:', error);
    return [];
  }
}

export async function reviewWord(word: string, correct: boolean): Promise<void> {
  try {
    const db = await getDatabase();
    const current = await db.getFirstAsync<{ interval: number; ease_factor: number }>(
      'SELECT interval, ease_factor FROM vocabulary_sr WHERE word = ?',
      [word]
    );

    if (!current) return;

    let newInterval = 1;
    let newEaseFactor = current.ease_factor;

    if (correct) {
      newEaseFactor = Math.max(1.3, current.ease_factor + 0.1);
      newInterval = current.interval === 1 ? 4 : Math.ceil(current.interval * newEaseFactor);
    } else {
      newEaseFactor = Math.max(1.3, current.ease_factor - 0.2);
      newInterval = 1;
    }

    const nextReview = Date.now() + newInterval * 24 * 60 * 60 * 1000;

    await db.runAsync(
      `UPDATE vocabulary_sr 
       SET interval = ?, ease_factor = ?, next_review = ?
       WHERE word = ?`,
      [newInterval, newEaseFactor, nextReview, word]
    );
  } catch (error) {
    console.error('Failed to update reviewed word:', error);
  }
}
