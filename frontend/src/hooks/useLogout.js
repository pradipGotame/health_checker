import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);

      localStorage.removeItem("userId");

      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return { logout };
};

export default useLogout;
