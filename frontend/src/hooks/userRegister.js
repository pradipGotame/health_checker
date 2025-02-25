import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db, collection, addDoc } from "../firebase/firebase";

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerUser = async (data) => {
    setLoading(true);
    setError(null);

    const { email, password, full_name, age, weight, height, location } = data;

    try {
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = user.uid;
      const userRef = collection(db, "users");

      await addDoc(userRef, {
        userId,
        email,
        full_name,
        age,
        weight,
        height,
        location,
      });

      localStorage.setItem("userId", userId);
      setLoading(false);

      return user;
    } catch (error) {
      console.log("error =>> ", error.message);
      setError("Error saving data: " + error.message);
      setLoading(false);

      return null;
    }
  };

  return { registerUser, loading, error };
};

export default useRegister;
