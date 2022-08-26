import axios from "axios";
import { User } from "src/modules/users/interfaces/user.interface";
import React, {
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";
interface ContextProps {
  //states
  user?: User;
  setUser: React.Dispatch<SetStateAction<User | undefined>>;
  //functions
}
const createDefault = (): ContextProps => ({
  //states
  setUser: () => {},
  //functions
});
export const AuthContext = React.createContext<ContextProps>(createDefault());
export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User>();

  const populateUser = () => {
    axios({ url: "/api/auth/user", method: "GET" }).then((res) => {
      setUser(res.data?.user);
    });
  };

  useEffect(() => {
    populateUser();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => React.useContext(AuthContext);
