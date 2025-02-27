import { getAuth } from "firebase/auth";
import {
  db,
  where,
  getDocs,
  doc,
  addDoc,
  query,
  collection,
  setDoc,
} from "../firebase/firebase";
export const saveTokenToFirestore = async (token) => {
  const auth = getAuth();
  const user = auth.currentUser;
  console.log("token -> ", token);
  if (!user) {
    console.warn("User not logged in. Cannot store FCM token.");
    return;
  }

  console.log("users uid -> ", user.uid);
  try {
    // Get user document reference
    const q = query(collection(db, "users"), where("userId", "==", user.uid)); // Example: filter by email
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // 🔹 Get the first matching document (assuming email is unique)
      const userDoc = querySnapshot.docs[0];
      const userRef = doc(db, "users", userDoc.id); // Use found document ID

      // 🔥 Update FCM Token while keeping existing data
      await setDoc(userRef, { fcmToken: token }, { merge: true });

      console.log("FCM Token updated in Firestore:", token);
    } else {
      console.warn("No matching user found for email:", user.email);
    }

    console.log("FCM Token saved to Firestore:", token);
  } catch (error) {
    console.error("Error storing FCM token in Firestore:", error);
  }
};
