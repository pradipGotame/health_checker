import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db, collection, addDoc } from "../firebase/firebase";

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerUser = async (data) => {
    setLoading(true);
    setError(null);

    const { username, password, name, email, age, weight, height, location } =
      data;

    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, username, password);

      const userRef = collection(db, "users");
      const docRef = await addDoc(userRef, {
        name,
        age,
        weight,
        height,
        location,
      });

      localStorage.setItem("userId", docRef.id);

      setLoading(false);
    } catch (error) {
      setError("Error saving data: " + error.message);
      setLoading(false);
    }
  };

  return { registerUser, loading, error, setError };
};

export default useRegister;
