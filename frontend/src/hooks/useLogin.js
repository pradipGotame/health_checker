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
      await signInWithEmailAndPassword(auth, email, password);

      const user = auth.currentUser;
      console.log("userid =>> ", user.uid);
      localStorage.setItem("userId", user.uid);
      setLoading(false);
    } catch (err) {
      console.log("error =>> ", err.message);
      setError("Error: " + err.message);
      setLoading(false);
    }
  };

  return { loginUser, loading, error };
};

export default useLogin;
