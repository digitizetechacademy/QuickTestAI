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
  createdAt: Timestamp | Date;
}

export type SaveQuizResultInput = Omit<QuizResult, 'id' | 'createdAt'>;
export type SavedQuizResult = Omit<QuizResult, 'createdAt'> & { createdAt: string };


export async function saveQuizResult(
  result: SaveQuizResultInput
): Promise<string> {
  try {
    const docData = {
      ...result,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, 'quizResults'), docData);

    return docRef.id;
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
      history.push({
        id: doc.id,
        ...data,
      } as QuizResult);
    });
    return history;
  } catch (error) {
    console.error('Error getting quiz history:', error);
    throw new Error('Failed to get quiz history');
  }
}
