// Import the functions you need from the SDKs you need
import {initializeApp, getApps, getApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: 'quick-test-ai',
  appId: '1:495101905101:web:2d3a812d15b9909fa08184',
  storageBucket: 'quick-test-ai.firebasestorage.app',
  apiKey: 'AIzaSyCHu5-LV3mTgFGEo3tO1gB5OWsYTiSIsuI',
  authDomain: 'quick-test-ai.firebaseapp.com',
  messagingSenderId: '495101905101',
  measurementId: '',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export {app, auth, db, googleProvider};
