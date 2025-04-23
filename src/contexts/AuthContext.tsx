import React, { useEffect, useReducer, useRef } from "react";
import Cookies from "js-cookie";
import { AuthContext, AuthContextType, LoginData } from "./createContexts/auth";
import { isTokenExpired } from "../utils/app/time";
import { Button, Modal } from "flowbite-react";
import {
  FaExclamationTriangle,
  FaSignOutAlt,
  FaTimesCircle,
} from "react-icons/fa";

type AuthState = {
  user: AuthContextType["user"];
  isAuthenticated: boolean;
  showLogoutModal: boolean;
};

type AuthAction =
  | { type: "LOGIN"; payload: any }
  | { type: "LOGOUT" }
  | { type: "LOAD_USER"; payload: any }
  | { type: "SHOW_LOGOUT_MODAL" }
  | { type: "HIDE_LOGOUT_MODAL" };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  showLogoutModal: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        showLogoutModal: false,
      };
    case "LOAD_USER":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "SHOW_LOGOUT_MODAL":
      return { ...state, showLogoutModal: true };
    case "HIDE_LOGOUT_MODAL":
      return { ...state, showLogoutModal: false };
    default:
      return state;
  }
}

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const removeUser = () => {
    Cookies.remove("user");
    Cookies.remove("token");
  };

  useEffect(() => {
    const user = JSON.parse(Cookies.get("user") || "null");
    const token = JSON.parse(Cookies.get("token") || "null");
    if (user && !isTokenExpired(token?.access)) {
      dispatch({ type: "LOAD_USER", payload: user });
    } else {
      removeUser();
    }
  }, []);

  const login = ({ user, ...tokens }: LoginData) => {
    Cookies.set("user", JSON.stringify(user));
    Cookies.set("token", JSON.stringify(tokens));
    dispatch({ type: "LOGIN", payload: user });
  };

  const logout = () => {
    removeUser();
    dispatch({ type: "LOGOUT" });
  };

  const openLogoutModal = () => dispatch({ type: "SHOW_LOGOUT_MODAL" });
  const closeLogoutModal = () => dispatch({ type: "HIDE_LOGOUT_MODAL" });

  const LogoutModal = () => (
    <Modal
      position="center"
      size="md"
      show={state.showLogoutModal}
      onClose={closeLogoutModal}
    >
      <Modal.Body className="text-center">
        <div className="flex justify-center items-center size-24 mx-auto mb-4 rounded-full bg-[#ff0000]/20">
          <FaExclamationTriangle className="text-[#ff0000] text-5xl" />
        </div>
        <p className="text-gray-400 text-md">
          Are you sure you want to log out?
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Button size="md" color="gray" className="!text-gray-800 dark:!text-white" onClick={closeLogoutModal}>
            <FaTimesCircle className="h-6  mr-3 text-lg" />
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
        login,
        logout: openLogoutModal, // triggers modal instead of logout directly
      }}
    >
      {children}
      <LogoutModal />
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
