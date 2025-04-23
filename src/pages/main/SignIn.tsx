import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { TextInput, Button, Tooltip, Card, Label, Checkbox } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../../components/UI/Logo";
import axios from "../../config/axios";
import Buttonloader from "../../components/UI/Buttonloader";
import {
  resetSchema,
  ResetSchemaType,
  signInSchema,
  SignInSchemaType,
} from "../../schemas/mainauth";
import { Login } from "../../utils/api/auth";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/auth";
import { BiX } from "react-icons/bi";
import { AiOutlineLoading } from "react-icons/ai";
import { HiEye, HiEyeOff, HiLockClosed, HiMail } from "react-icons/hi";
import Captcha, { CaptchaRef } from "../../components/UI/Captcha";

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
    setValue,
  } = useForm({
    resolver: yupResolver(resetSchema),
  });

  const [remember, setRemember] = useState(false);

  const captchaRef = useRef<CaptchaRef>(null);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [generatedCaptcha, setGeneratedCaptcha] = useState("");

  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [resetLoading, setResetLoading] = useState(false);
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("userEmail");
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
      setRemember(true);
    }
  }, [setValue]);

  const onSubmit = async (formData: SignInSchemaType) => {
    setCaptchaError(null);
    if (remember) {
      localStorage.setItem("userEmail", formData.email);
    } else {
      localStorage.removeItem("userEmail");
    }
    if (!captchaInput) {
      setCaptchaError("Please enter the CAPTCHA");
      return;
    }
    if (captchaInput !== generatedCaptcha) {
      captchaRef.current?.refreshCaptcha();
      setCaptchaError("CAPTCHA does not match");
      return;
    }

    console.log(formData);
    setLoading(true);
    try {
      const { data } = await Login(formData);
      console.log(data);
      login(data);
      toast.success("Login successful!");
      reset();
      navigate("/member/dashboard");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message.trim());
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
        <Card className="w-full max-w-xl p-3 shadow-lg ">
          <h1 className="mb-8 text-center text-3xl font-semibold text-gray-800 dark:text-white">
            Welcome Back
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <Label value="Email" />
              <div className="relative">
                <TextInput
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  icon={HiMail}
                  disabled={loading}
                  color={errors.email ? "failure" : undefined}
                  helperText={errors.email?.message}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <Label value="Password" />
              <div className="relative">
                <TextInput
                  {...register("password")}
                  type={togglePassword ? "text" : "password"}
                  placeholder="Password"
                  icon={HiLockClosed}
                  disabled={loading}
                  style={{ paddingRight: 35 }}
                  color={errors.password ? "failure" : undefined}
                />
                <div
                  className={`absolute right-3 top-3 flex items-center text-gray-400 hover:text-blue-500`}
                >
                  <Tooltip
                    className="!text-sm"
                    content={togglePassword ? "Hide" : "Show"}
                    animation="duration-500"
                  >
                    <button
                      type="button"
                      className="text-gray-500 dark:text-gray-300 text-lg"
                      onClick={() => setTogglePassword((prev) => !prev)}
                    >
                      {togglePassword ? <HiEyeOff /> : <HiEye />}
                    </button>
                  </Tooltip>
                </div>
              </div>
              {errors.password && (
                <span className="text-red-600 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Captcha
                  ref={captchaRef}
                  onChange={(captcha) => setGeneratedCaptcha(captcha)}
                />
              </div>
              <Label value="Enter CAPTCHA" />
              <TextInput
                placeholder="Type the characters you see above"
                disabled={loading}
                color={captchaError ? "failure" : "gray"}
                onChange={(e) => setCaptchaInput(e.target.value)}
                helperText={
                  captchaError && (
                    <span className="text-red-600 text-sm">{captchaError}</span>
                  )
                }
              />
            </div>

            <div className="flex items-center justify-start">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  disabled={loading}
                  color="blue"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              color="blue"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Buttonloader isLoading={loading} title="Sign In" />
            </Button>

            {/* Additional Links */}
            <div className="mt-4 flex justify-between text-sm text-gray-600 border-t border-gray-300 dark:border-gray-700 pt-3">
              <p
                onClick={() => setShowForgotPassword(true)}
                className="underline cursor-pointer text-blue-600 dark:text-blue-500"
              >
                Forgot Password?
              </p>
              <span className="flex gap-2 dark:text-gray-200">
                Don't have an account?
                <Link
                  to="/auth/sign-up"
                  className="text-blue-600 dark:text-blue-500 underline"
                >
                  Sign Up
                </Link>
              </span>
            </div>
          </form>
        </Card>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <Card className="shadow-lg max-w-lg w-full ">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">
                Reset Password
              </h2>
              <BiX
                className="dark:text-gray-200 hover:bg-slate-300/20 rounded-full mb-4 cursor-pointer"
                size={30}
                onClick={() => {
                  resetReset();
                  setShowForgotPassword(false);
                }}
              />
            </div>
            <p className="mb-4 dark:text-gray-500">
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
          </Card>
        </div>
      )}
    </>
  );
}

export default SignInPage;
