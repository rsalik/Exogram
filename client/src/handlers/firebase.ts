import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const app = initializeApp({
  apiKey: 'AIzaSyCANdvfJid7BOHTeKS-pFrRF8hDNmhkX_A',
  authDomain: 'exogram-46cc8.firebaseapp.com',
  databaseURL: 'https://exogram-46cc8-default-rtdb.firebaseio.com',
  projectId: 'exogram-46cc8',
  storageBucket: 'exogram-46cc8.appspot.com',
  messagingSenderId: '1082408161985',
  appId: '1:1082408161985:web:6b8e100c78aafcb5f07a40',
  measurementId: 'G-VP91XQLW8W',
});

export const db = getDatabase(app);
export const auth = getAuth(app);
