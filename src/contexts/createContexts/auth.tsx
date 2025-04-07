import { createContext } from "react";

export interface UserType {
  id: string;
  profile_pic: string;
  fullName: string;
  email: string;
  phone: string;
  is_admin: boolean;
}

export type LoginData = {
  user: UserType;
  tokens: { access: string; refresh: string };
};
export interface AuthContextType {
  user: UserType | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
