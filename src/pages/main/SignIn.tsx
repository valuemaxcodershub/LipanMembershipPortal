import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { TextInput, Button, Tooltip } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../../components/UI/Logo";
import axios from "../../config/axios";
import Buttonloader from "../../components/UI/Buttonloader";
import { resetSchema, ResetSchemaType, signInSchema, SignInSchemaType } from "../../schemas/mainauth";
import { Login } from "../../utils/api/auth";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/auth";
import { BiX } from "react-icons/bi";
import { AiOutlineLoading } from "react-icons/ai";



function SignInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    reset,
    resetField,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchemaType>({
    resolver: yupResolver(signInSchema),
  });

  const {
    register: resetRegister,
    handleSubmit: resetHandleSubmit,
    reset: resetReset,
    formState: { errors: resetErrors },
  } = useForm({
    resolver: yupResolver(resetSchema),
  });

  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  const [resetLoading, setResetLoading] = useState(false);

  const onSubmit = async (formData: SignInSchemaType) => {
    console.log(formData);
    setLoading(true);
    try {
      const { data } = await Login(formData);
      console.log(data);
      login(data);
      toast.success("Login successful!");
      // Store the token in local storage or context

      reset();
      navigate("/member/dashboard");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message.split(":")[1].trim());
      resetField("password");
    } finally {
      setLoading(false);
    }
  };


  const handleReset = async (resetData: ResetSchemaType) => {
    setResetLoading(true);
    console.log(resetData);

    try {
      const { data } = await axios.post("/auth/password/reset/", resetData);
      console.log(data);
      toast.success(data?.detail || "Password reset successfull");
      resetReset();
      setShowForgotPassword(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.detail || error.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="bg-blue-700 p-3 rounded-xl h-20 my-6">
          <Logo className="h-full" />
        </div>{" "}
        <div className="w-full max-w-md rounded-lg bg-white p-10 shadow-lg">
          <h1 className="mb-8 text-center text-3xl font-semibold text-gray-800">
            Welcome Back
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <div className="relative">
                <TextInput
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  icon={FiMail}
                  color={errors.email ? "failure" : ""}
                  helperText={errors.email?.message}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <div className="relative">
                <TextInput
                  {...register("password")}
                  type={togglePassword ? "text" : "password"}
                  placeholder="Password"
                  icon={FiLock}
                  style={{ paddingRight: 35 }}
                  color={errors.password ? "failure" : ""}
                  helperText={errors.password?.message}
                />
                <div
                  className={`absolute inset-y-0 right-3 ${errors.password ? "-top-4" : "top-1"} flex items-center text-gray-400 hover:text-blue-500`}
                >
                  <Tooltip
                    className="!text-sm"
                    content="Show/Hide"
                    animation="duration-500"
                  >
                    <button
                      type="button"
                      onClick={() => setTogglePassword((prev) => !prev)}
                    >
                      {togglePassword ? (
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
              <Buttonloader isLoading={loading} title="Sign In" />
            </Button>

            {/* Additional Links */}
            <div className="mt-4 flex justify-between text-sm text-gray-600">
              <p onClick={() => setShowForgotPassword(true)} className="hover:underline cursor-pointer">
                Forgot Password?
              </p>
              <span className="flex gap-2">
                Don't have an account?
                <Link to="/auth/sign-up" className="text-blue-600 underline">
                  Sign Up
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
              <BiX
                className="bg-gray-100 rounded-full mb-4"
                size={30}
                onClick={() => {
                  resetReset();
                  setShowForgotPassword(false);
                }}
                
              />
            </div>
            <p className="mb-4">
              Enter your email to receive a password reset link:
            </p>
            <form
              onSubmit={resetHandleSubmit(handleReset)}
              className="space-y-4"
            >
              <TextInput
                {...resetRegister("email")}
                type="text"
                placeholder="Your email"
                color={resetErrors.email ? "failure" : ""}
                helperText={resetErrors.email?.message}
                //   className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-main_color"
              />

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-2 bg-blue-600 text-white text-center font-bold rounded-md disabled:bg-blue-400 transition duration-300"
              >
                {resetLoading ? (
                  <AiOutlineLoading className="size-7 animate-spin inline-block" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default SignInPage;
