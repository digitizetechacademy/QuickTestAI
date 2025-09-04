'use server';

import {db} from '@/lib/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

export interface QuizResult {
  id: string;
  userId: string;
  topic: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  createdAt: string; 
}

export type SaveQuizResultInput = Omit<QuizResult, 'id' | 'createdAt'>;

export async function saveQuizResult(
  result: SaveQuizResultInput
): Promise<void> {
  try {
    const docData = {
      ...result,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, 'quizResults'), docData);
  } catch (error) {
    console.error('Error saving quiz result:', error);
    throw new Error('Failed to save quiz result.');
  }
}

export async function getQuizHistory(userId: string): Promise<QuizResult[]> {
  if (!userId) {
    return [];
  }

  try {
    const q = query(
      collection(db, 'quizResults'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const history: QuizResult[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const createdAt = (data.createdAt as Timestamp)?.toDate()?.toISOString() || new Date().toISOString();
      history.push({
        id: doc.id,
        userId: data.userId,
        topic: data.topic,
        difficulty: data.difficulty,
        score: data.score,
        totalQuestions: data.totalQuestions,
        createdAt: createdAt,
      });
    });
    return history;
  } catch (error) {
    console.error('Error getting quiz history:', error);
    throw new Error('Failed to get quiz history');
  }
}
