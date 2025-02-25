import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const auth = getAuth();
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userId = user.uid;

      localStorage.setItem("userId", userId);
      setLoading(false);

      return user;
    } catch (error) {
      console.log("error =>> ", error.message);
      setError("Error logging in: " + error.message);
      setLoading(false);

      return null;
    }
  };

  return { loginUser, loading, error };
};

export default useLogin;
