import { createContext } from "react";

interface UserContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<UserContextType | null>(null);
