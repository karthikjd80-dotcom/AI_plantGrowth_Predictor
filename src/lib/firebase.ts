import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously,
  sendPasswordResetEmail,
  signOut as fbSignOut, 
  onAuthStateChanged,
  updateProfile,
  type User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer, 
  collection, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { PredictionResult } from '../types';

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with specific database ID if present in config
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Validate Connection to Firestore on startup as required by integration instructions
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore connection check: client is offline or initial network delay.");
    }
  }
}

// Run connection validation in background
testFirestoreConnection().catch(() => {});

// Cloud scan item definition
export interface CloudScanRecord {
  id: string;
  userId: string;
  timestamp: number;
  image: string;
  plantName: string;
  healthStatus: string;
  diseaseName: string;
  confidenceScore: number;
  prediction: PredictionResult;
  createdAt?: any;
}

/**
 * Save a plant scan result to Firestore under /users/{userId}/scans/{scanId}
 */
export async function saveScanToFirestore(user: User, scanId: string, image: string, prediction: PredictionResult): Promise<void> {
  if (!user || !user.uid) return;

  try {
    // 1. Ensure user profile exists
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Plant Parent',
      photoURL: user.photoURL || '',
      lastActive: Date.now()
    }, { merge: true });

    // 2. Save scan document
    const scanRef = doc(db, 'users', user.uid, 'scans', scanId);
    await setDoc(scanRef, {
      id: scanId,
      userId: user.uid,
      timestamp: Date.now(),
      image,
      plantName: prediction.plantName || 'Unknown Plant',
      healthStatus: prediction.healthStatus || 'Healthy',
      diseaseName: prediction.diseaseName || 'None',
      confidenceScore: prediction.confidenceScore || 95,
      prediction,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.error('Failed to save scan to Firestore:', err);
    throw err;
  }
}

/**
 * Fetch all user scans from Firestore under /users/{userId}/scans
 */
export async function fetchUserScansFromFirestore(user: User): Promise<CloudScanRecord[]> {
  if (!user || !user.uid) return [];

  try {
    const scansCol = collection(db, 'users', user.uid, 'scans');
    const q = query(scansCol, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);

    const records: CloudScanRecord[] = [];
    snapshot.forEach((d) => {
      records.push(d.data() as CloudScanRecord);
    });
    return records;
  } catch (err) {
    console.error('Failed to fetch user scans from Firestore:', err);
    return [];
  }
}

/**
 * Sign In with Google Popup
 */
export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/**
 * Sign In with Email and Password
 */
export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
}

/**
 * Register / Sign Up with Email and Password
 */
export async function registerWithEmail(email: string, pass: string, displayName?: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName && result.user) {
    await updateProfile(result.user, { displayName });
  }
  return result.user;
}

/**
 * Sign In as Guest / Anonymous Demo User (Instant Cloud Sync without popups)
 */
export async function loginAsGuest(): Promise<User> {
  const result = await signInAnonymously(auth);
  return result.user;
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Sign Out
 */
export async function logoutUser(): Promise<void> {
  await fbSignOut(auth);
}

export { onAuthStateChanged };
export type { User };

