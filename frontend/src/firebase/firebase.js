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
  getDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { getAuth } from "firebase/auth";

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
export const auth = getAuth(app);

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
  getDoc,
  deleteDoc,
};

// Notification functions
export const createNotification = async (userId, type, message, activityId = null) => {
  try {
    const notificationsRef = collection(db, "notifications");
    const notificationData = {
      userId,
      type,
      message,
      activityId,
      seen: false,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(notificationsRef, notificationData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

export const getUnseenNotificationsCount = async (userId) => {
  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("userId", "==", userId),
      where("seen", "==", false)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error("Error getting unseen notifications count:", error);
    return 0;
  }
};

export const markNotificationsAsSeen = async (userId) => {
  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("userId", "==", userId),
      where("seen", "==", false)
    );
    const querySnapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    querySnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { seen: true });
    });
    
    await batch.commit();
  } catch (error) {
    console.error("Error marking notifications as seen:", error);
    throw error;
  }
};

export const getNotifications = async (userId) => {
  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt
    }));
  } catch (error) {
    console.error("Error getting notifications:", error);
    // If the error is about missing index, provide a more helpful message
    if (error.code === 'failed-precondition' && error.message.includes('index')) {
      console.warn('Firestore index is required. Please create a composite index for notifications collection on userId and createdAt fields.');
    }
    return [];
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await deleteDoc(notificationRef);
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

export const markNotificationAsSeen = async (notificationId) => {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, { seen: true });
  } catch (error) {
    console.error("Error marking notification as seen:", error);
    throw error;
  }
};
