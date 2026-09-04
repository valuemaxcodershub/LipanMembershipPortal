// src/context/AuthContext.tsx
import { useReducer, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { isTokenExpired } from "../utils/app/time";

import axios from "../config/axios";
import {
  AuthContext,
  LoginData,
  Tokens,
  UserType,
} from "./createContexts/auth";
import IncompleteProfileModal from "../components/UI/IncompleteProfileModal";
import { useLocation, useNavigate } from "react-router-dom";
import { checkProfileCompletion } from "../utils/app/profile";
import useProfileCompletionGuard from "../hooks/useProfileCheck";
import LogoutModal from "../components/UI/LogoutModal";

type AuthState = {
  user: UserType | null;
  isAuthenticated: boolean;
  showLogoutModal: boolean;
  isLoading: boolean;
};

type AuthAction =
  | { type: "LOGIN"; payload: { user: UserType } }
  | { type: "LOGOUT" }
  | { type: "LOAD_USER"; payload: UserType }
  | { type: "SET_isLOADING"; payload: boolean }
  | { type: "SHOW_LOGOUT_MODAL" }
  | { type: "HIDE_LOGOUT_MODAL" };

// Initial State
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  showLogoutModal: false,
  isLoading: true,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        showLogoutModal: false,
        isLoading: false,
      };
    case "LOAD_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "SET_isLOADING":
      return { ...state, isLoading: action.payload };
    case "SHOW_LOGOUT_MODAL":
      return { ...state, showLogoutModal: true };
    case "HIDE_LOGOUT_MODAL":
      return { ...state, showLogoutModal: false };
    default:
      return state;
  }
};

// Context

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  // Helper functions
  const setAuthCookies = (user: UserType, tokens: Tokens) => {
    Cookies.set("user", JSON.stringify(user), {
      secure: true,
      sameSite: "Lax",
    });
    Cookies.set("access_token", tokens.access, {
      secure: true,
      sameSite: "Lax",
    });
    Cookies.set("refresh_token", tokens.refresh, {
      secure: true,
      sameSite: "Lax",
    });
  };

  const clearAuthCookies = () => {
    Cookies.remove("user");
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const refreshToken = Cookies.get("refresh_token");

      try {
        if (refreshToken) {
          try {
            // Fail fast if API is unreachable so public pages are not stuck loading
            const response = await axios.post(
              "/auth/token/refresh/",
              { refresh: refreshToken },
              { timeout: 8000 }
            );
            console.log("Token refreshed successfully:", response);
            const { user: userData, access } = response.data;
            setAuthCookies(userData, { access, refresh: refreshToken });
            dispatch({ type: "LOAD_USER", payload: userData });
          } catch (error) {
            clearAuthCookies();
          }
        } else {
          clearAuthCookies();
        }
      } finally {
        dispatch({ type: "SET_isLOADING", payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Auth methods
  const login = ({ user, ...tokens }: LoginData) => {
    setAuthCookies(user, tokens);
    dispatch({ type: "LOGIN", payload: { user } });
  };

  const logout = () => {
    clearAuthCookies();
    dispatch({ type: "LOGOUT" });
  };

  const runUserProfileCompletionCheck = async () => {
    const requiredField = ["level_of_learners", "areas_of_interest"];
    try {
      const [profileResponse] = await Promise.all([axios.get("/auth/user/")]);
      const profileRes = profileResponse.data;
      const completion = checkProfileCompletion(profileRes, [
        "id",
        "created_at",
        "updated_at",
        "is_active",
        "is_admin",
        "is_staff",
        "membership_type",
        "membership_detail",
        "payment_status",
        "plan_type",
        "profile_pic",
        "bio",
      ]);

      if (completion.incompleteFields.length) {
        setIsOpen(true);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  
    useProfileCompletionGuard(
      isOpen,
      runUserProfileCompletionCheck,
      state?.user as UserType
    );

  const showLogoutModal = () => dispatch({ type: "SHOW_LOGOUT_MODAL" });
  const hideLogoutModal = () => dispatch({ type: "HIDE_LOGOUT_MODAL" });

  // Logout Modal Component

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        login,
        logout: showLogoutModal, // Shows modal instead of direct logout
      }}
    >
      {children}
      <LogoutModal
        isOpen={state.showLogoutModal}
        onClose={hideLogoutModal}
        onLogout={logout}
      />
      <IncompleteProfileModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </AuthContext.Provider>
  );
};
export default AuthContextProvider;
