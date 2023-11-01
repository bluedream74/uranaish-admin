import AuthContext, { UserType } from "../context/AuthContext";
import { useState } from "react";
import axiosApi from "../utils/axios";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType>({
    email: null,
    password: null
  });

  const signin = (newUser: UserType, callback: VoidFunction):Promise<boolean> => {
    return axiosApi
      .post<UserType>(`/account/api/admin_login/`, newUser)
      .then(res => {
        setUser({
          email: res.data.email,
          password: ''
        });
        callback();
        return true;
      })
      .catch(() => {
        setUser({
          email: null,
          password: null
        });
        return false;
      });
  };

  const signout = (callback: VoidFunction) => {
    // return fakeAuthProvider.signout(() => {
      setUser({
        email: null,
        password: null
      });
      callback();
    // });
  };

  const value = { user, signin, signout };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}