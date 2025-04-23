import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Label,
  TextInput,
  Checkbox,
  Tooltip,
} from "flowbite-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { HiLockClosed, HiUser, HiEye, HiEyeOff, HiMail } from "react-icons/hi";
import { Logo } from "../../components/UI/Logo";
import Captcha, { CaptchaRef } from "../../components/UI/Captcha";
import { useAuth } from "../../hooks/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { Login } from "../../utils/api/auth";
import { toast } from "react-toastify";
import Buttonloader from "../../components/UI/Buttonloader";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
//     .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const AdminLoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [generatedCaptcha, setGeneratedCaptcha] = useState("");
  const captchaRef = useRef<CaptchaRef>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("adminEmail");
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
      setRemember(true);
    }
  }, [setValue]);

  const onSubmit = async (formdata: any) => {
    setCaptchaError(null);
    if (remember) {
      localStorage.setItem("adminEmail", formdata.email);
    } else {
      localStorage.removeItem("adminEmail");
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
    console.log("Admin Login Data:", formdata);
    // TODO: handle actual login (call API, redirect, etc.)
    try {
      const { data } = await Login(formdata);
      login(data);
      navigate("/admin/dashboard");
      toast.success("Login successfully");
    } catch (err: any) {
      toast.error(err.message);
      captchaRef.current?.refreshCaptcha();
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Logo className="bg-blue-700 p-3 rounded-xl h-20 my-6" />
      <Card className="w-full max-w-xl shadow-lg dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Welcome Back, Admin
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-1">
          Sign in with your credentials to access the admin dashboard.
        </p>

        <form
          className="space-y-4 mt-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <Label htmlFor="email" value="Email address" />
            <TextInput
              id="email"
              disabled={isSubmitting}
              type="email"
              icon={HiMail}
              placeholder="admin@example.com"
              {...register("email")}
              color={errors.email ? "failure" : "gray"}
              helperText={
                errors.email && (
                  <span className="text-red-600 text-sm">
                    {errors.email.message}
                  </span>
                )
              }
            />
          </div>

          <div>
            <Label htmlFor="password" value="Password" />
            <div className="relative">
              <TextInput
                id="password"
                type={showPassword ? "text" : "password"}
                icon={HiLockClosed}
                placeholder="********"
                disabled={isSubmitting}
                {...register("password")}
                color={errors.password ? "failure" : "gray"}
              />
              <div className={`absolute right-3 top-3 flex items-center`}>
                <Tooltip
                  className="!text-sm"
                  content={showPassword ? "Hide" : "Show"}
                  animation="duration-500"
                >
                  <button
                    type="button"
                    className="text-gray-500 dark:text-gray-300 text-lg"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <HiEyeOff /> : <HiEye />}
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
              disabled={isSubmitting}
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
                color="blue"
                disabled={isSubmitting}
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <Label htmlFor="remember">Remember me</Label>
            </div>
          </div>

          <Button type="submit" color="blue" disabled={isSubmitting} fullSized>
            <Buttonloader isLoading={isSubmitting} title="Sign In" />
          </Button>
        </form>

        <div className="mt-6 text-sm text-center text-gray-600 dark:text-gray-300">
          <p>
            Don’t have access?{" "}
            <a
              target="_blank"
              href="mailto:admin@lipanonline.org"
              className="font-medium underline text-blue-600 dark:text-blue-400"
            >
              Contact your system administrator
            </a>{" "}
            to request permissions.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
