import axios from "../../config/axios";
import {
  ResetPasswordSchemaType,
  SignInSchemaType,
  SignUpSchemaType,
} from "../../schemas/mainauth";
import { errorHandler } from "./errors";

export const Login = async (formData: SignInSchemaType) => {
  try {
    const response = await axios.post("/auth/login/", formData);
    return response;
  } catch (error) {
    throw new Error(errorHandler(error));
  }
};

export const Register = async (formData: SignUpSchemaType) => {
  try {
    const response = await axios.post("/auth/registration/", formData);
    return response;
  } catch (error) {
    throw new Error(errorHandler(error));
  }
};

// export const ForgotPassword = async (formData: ) => {
//   try {
//     const response = await axios.post("/auth/forgot-password/", formData);
//     return response;
//   } catch (error) {
//     throw new Error(errorHandler(error));
//   }
// };

export const ResetPassword = async (
  formData: ResetPasswordSchemaType & { uid?: string; token?: string }
) => {
  try {
    const response = await axios.post(
      "/auth/password/reset/confirm/",
      formData
    );
    return response;
  } catch (error) {
    throw new Error(errorHandler(error));
  }
};

export const VerifyEmail = async (formData: { key: string }) => {
  try {
    const response = await axios.post(
      `/auth/registration/verify-email/`,
      formData
    );
    return response;
  } catch (error) {
    throw new Error(errorHandler(error));
  }
};

export const ResendVerificationEmail = async (formData: { email: string }) => {
  try {
    const response = await axios.post(
      "/auth/registration/resend-email/",
      formData
    );
    return response;
  } catch (error) {
    throw new Error(errorHandler(error));
  }
};

export const Logout = async () => {
  try {
    const response = await axios.post("/accounts/logout/");
    return response;
  } catch (error) {
    throw new Error(errorHandler(error));
  }
};
