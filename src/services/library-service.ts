
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
  limit,
} from 'firebase/firestore';

export interface Reading {
  id: string;
  userId: string;
  topic: string;
  createdAt: string; 
}

export type SaveReadingInput = Omit<Reading, 'id' | 'createdAt'>;

export async function saveReading(reading: SaveReadingInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'readings'), {
      ...reading,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving reading:', error);
    throw new Error('Failed to save reading.');
  }
}

export async function getReadingHistory(userId: string): Promise<Reading[]> {
  if (!userId) {
    return [];
  }

  try {
    const q = query(
      collection(db, 'readings'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(15) // Limit to the last 15 readings
    );
    const querySnapshot = await getDocs(q);
    const history: Reading[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const createdAt = (data.createdAt as Timestamp)?.toDate()?.toISOString() ?? new Date().toISOString();
      history.push({
        id: doc.id,
        userId: data.userId,
        topic: data.topic,
        createdAt,
      });
    });
    return history;
  } catch (error) {
    console.error('Error getting reading history:', error);
    throw new Error('Failed to get reading history');
  }
}
