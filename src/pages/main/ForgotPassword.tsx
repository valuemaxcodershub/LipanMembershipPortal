import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { TextInput, Button, Tooltip } from "flowbite-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Logo } from "../../components/UI/Logo";
import axios from "../../config/axios";
import Buttonloader from "../../components/UI/Buttonloader";
import { ForgotPassword } from "../../utils/api/auth";

const schema = yup.object({
  new_password1: yup
    .string()
    .min(8, "This field should be at least 8 characters")
    .required("This field is required"),
  new_password2: yup
    .string()
    .oneOf([yup.ref("new_password1")], "Passwords must match")
    .required("This field is required"),
});

function ForgotPasswordPage() {
  const {uid, token} = useParams()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [togglePassword1, setTogglePassword1] = useState<boolean>(false);
  const [togglePassword2, setTogglePassword2] = useState<boolean>(false);

  const onSubmit = async (formData: any) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      const { data } = await ForgotPassword({...formData, uid, token});
      setSuccessMessage(
        data.detail || "Password reset instructions have been sent to your email."
      );
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to send reset instructions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen p-6">
      <div className="bg-blue-700 p-3 rounded-xl h-20 my-6">
        <Logo className="h-full" />
      </div>
      <div className="w-full max-w-md rounded-lg bg-white p-10 shadow-lg">
        <h1 className="mb-8 text-center text-3xl font-semibold text-gray-800">
          Forgot Password
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Enter your email address below and we will send you instructions to
          reset your password.
        </p>
        {successMessage && (
          <p className="text-green-600 text-center mb-4">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-600 text-center mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <div className="relative">
              <TextInput
                {...register("new_password1")}
                type={togglePassword1 ? "text" : "password"}
                placeholder="Password"
                icon={FiLock}
                style={{ paddingRight: 35 }}
                color={errors.new_password1 ? "failure" : ""}
                helperText={errors.new_password1?.message}
              />
              <div
                className={`absolute inset-y-0 right-3 ${errors.new_password1 ? "-top-4" : "top-1"} flex items-center text-gray-400 hover:text-blue-500`}
              >
                <Tooltip
                  className="!text-sm"
                  content="Show/Hide"
                  animation="duration-500"
                >
                  <button
                    type="button"
                    onClick={() => setTogglePassword1((prev) => !prev)}
                  >
                    {togglePassword1 ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <div className="relative">
              <TextInput
                {...register("new_password2")}
                type={togglePassword2 ? "text" : "password"}
                placeholder="Password"
                icon={FiLock}
                style={{ paddingRight: 35 }}
                color={errors.new_password2 ? "failure" : ""}
                helperText={errors.new_password2?.message}
              />
              <div
                className={`absolute inset-y-0 right-3 ${errors.new_password2 ? "-top-4" : "top-1"} flex items-center text-gray-400 hover:text-blue-500`}
              >
                <Tooltip
                  className="!text-sm"
                  content="Show/Hide"
                  animation="duration-500"
                >
                  <button
                    type="button"
                    onClick={() => setTogglePassword2((prev) => !prev)}
                  >
                    {togglePassword2 ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Buttonloader isLoading={loading} title="Send Reset Link" />
          </Button>

          {/* Back to Login */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Remembered your password?{" "}
            <Link to="/auth/sign-in" className="text-blue-600 underline">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
