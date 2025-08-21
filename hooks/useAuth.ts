import { useCallback, useState } from "react";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const login = useCallback(() => setIsLoggedIn(true), []);

  const logout = useCallback(() => setIsLoggedIn(false), []);

  return { isLoggedIn, login, logout };
};
