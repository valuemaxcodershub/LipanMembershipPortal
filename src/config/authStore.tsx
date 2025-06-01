import { useState } from "react";
import { UserType } from "../contexts/createContexts/auth";

export const useAuthStore = () => {
     const [accessToken, setAccessToken] = useState<string | null>(null);
     const [user, setUser] = useState<UserType | null>(null);

     const clearAuthStore = () => {
          setAccessToken(null);
          setUser(null);
     };

     return {
          accessToken,
          setAccessToken,
          getAccessToken: () => accessToken,
          user,
          setUser,
          getUser: () => user,
          clearAuthStore,
     };
};
