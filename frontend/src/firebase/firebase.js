import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STOREBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSENGER_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const db = getFirestore(app);

export {
  db,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  app,
  doc,
  messaging,
  setDoc,
};
