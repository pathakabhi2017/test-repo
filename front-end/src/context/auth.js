import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [homeContent, setHomeContent] = useState({})

  useEffect(() => {
    const data = localStorage.getItem("auth");

    if (data) {
      const parseData = JSON.parse(data);

      setAuth({
        user: parseData.userInfo,
        token: parseData.token,
        type: "",
        answer_id: ""
      });

    }

    //eslint-disable-next-line
  }, []);
  return (
    <AuthContext.Provider value={[auth, setAuth, setHomeContent, homeContent]}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };

