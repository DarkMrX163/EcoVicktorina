import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  getDocFromServer,
  doc
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { LeaderboardEntry } from './types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test connection on startup
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore client is offline or unreachable.');
    }
  }
}
testConnection();

const LEADERBOARD_COLLECTION = 'leaderboard';

/**
 * Save a new entry to global online Firestore database
 */
export async function saveOnlineLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'date'>): Promise<void> {
  try {
    const payload = {
      playerName: entry.playerName,
      settlement: entry.settlement,
      score: Number(entry.score) || 0,
      correctPercentage: Number(entry.correctPercentage) || 0,
      category: entry.category,
      mode: entry.mode,
      rankTitle: entry.rankTitle,
      createdAt: new Date().toISOString(),
    };
    await addDoc(collection(db, LEADERBOARD_COLLECTION), payload);
  } catch (err) {
    console.error('Failed to save score to online Firestore:', err);
  }
}

/**
 * Subscribe to real-time updates from global Firestore leaderboard
 */
export function subscribeOnlineLeaderboard(callback: (entries: LeaderboardEntry[]) => void): () => void {
  try {
    const q = query(
      collection(db, LEADERBOARD_COLLECTION),
      orderBy('score', 'desc'),
      limit(100)
    );

    return onSnapshot(q, (snapshot) => {
      const entries: LeaderboardEntry[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        entries.push({
          id: docSnap.id,
          playerName: data.playerName || 'Участник',
          settlement: data.settlement || 'г. Нефтегорск',
          score: Number(data.score) || 0,
          correctPercentage: Number(data.correctPercentage) || 0,
          category: data.category || 'all',
          mode: data.mode || 'marathon',
          rankTitle: data.rankTitle || 'Знаток экологии',
          date: data.createdAt ? new Date(data.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        });
      });
      callback(entries);
    }, (error) => {
      console.error('Firestore onSnapshot error:', error);
    });
  } catch (err) {
    console.error('Failed to subscribe to Firestore leaderboard:', err);
    return () => {};
  }
}
