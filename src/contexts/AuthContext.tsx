// src/context/AuthContext.tsx
import { useReducer, useEffect } from "react";
import Cookies from "js-cookie";
import { isTokenExpired } from "../utils/app/time";
import { Modal, Button } from "flowbite-react";
import { FaExclamationTriangle, FaSignOutAlt, FaTimesCircle } from "react-icons/fa";
import axios from "../config/axios";
import { AuthContext, LoginData, Tokens, UserType } from "./createContexts/auth";


type AuthState = {
  user: UserType | null;
  isAuthenticated: boolean;
  showLogoutModal: boolean;
  isLoading: boolean;
};

type AuthAction =
  | { type: "LOGIN"; payload: {user: UserType} }
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

  // Helper functions
  const setAuthCookies = (user: UserType, tokens: Tokens) => {
    Cookies.set("user", JSON.stringify(user), { secure: true, sameSite: "Lax" });
    Cookies.set("access_token", tokens.access, { secure: true, sameSite: "Lax" });
    Cookies.set("refresh_token", tokens.refresh, { 
      secure: true, 
      sameSite: "Lax",
      httpOnly: false // Note: True HTTPOnly requires backend to set cookie
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

      if (refreshToken) {
        try {
          // Attempt to refresh token
          const response = await axios.post("/auth/token/refresh/", {
            refresh: refreshToken,
          });
          console.log("Token refreshed successfully:", response);
          const {user: userData, access} = response.data;
          setAuthCookies(userData, {access, refresh: refreshToken});
          dispatch({ type: "LOAD_USER", payload: userData });
        } catch (error) {
          clearAuthCookies();
        }
      } else {
        clearAuthCookies();
      }
      dispatch({ type: "SET_isLOADING", payload: false });
    };

    initializeAuth();
  }, []);

  // Auth methods
  const login = ({user, ...tokens}: LoginData) => {
    setAuthCookies(user, tokens);
    dispatch({ type: "LOGIN", payload: { user } });
  };

  const logout = () => {
    clearAuthCookies();
    dispatch({ type: "LOGOUT" });
  };

  const showLogoutModal = () => dispatch({ type: "SHOW_LOGOUT_MODAL" });
  const hideLogoutModal = () => dispatch({ type: "HIDE_LOGOUT_MODAL" });

  // Logout Modal Component
  const LogoutModal = () => (
    <Modal
      show={state.showLogoutModal}
      onClose={hideLogoutModal}
      position="center"
      size="md"
    >
      <Modal.Body className="text-center">
        <div className="flex justify-center items-center size-24 mx-auto mb-4 rounded-full bg-[#ff0000]/20">
          <FaExclamationTriangle className="text-[#ff0000] text-5xl" />
        </div>
        <p className="text-gray-400 text-md">
          Are you sure you want to log out?
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Button 
            size="md" 
            color="gray" 
            className="!text-gray-800 dark:!text-white"
            onClick={hideLogoutModal}
          >
            <FaTimesCircle className="h-6 mr-3 text-lg" />
            Cancel
          </Button>
          <Button
            size="md"
            className="!bg-[#ff0000] hover:!bg-[#ff0000]/80"
            onClick={logout}
          >
            <FaSignOutAlt className="h-6 text-white mr-3 text-lg" />
            Logout
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );

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
      <LogoutModal />
    </AuthContext.Provider>
  );
};
export default AuthContextProvider;