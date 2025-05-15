import { createContext } from "react";

export interface UserType {
  profile_pic: string;
  full_name: string;
  email: string;
  phone: string;
  is_admin: boolean;
  payment_status: "unpaid" | "paid" | "pending"
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
