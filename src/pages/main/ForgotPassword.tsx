import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { TextInput, Button, Tooltip, Alert, Card } from "flowbite-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Logo } from "../../components/UI/Logo";
import Buttonloader from "../../components/UI/Buttonloader";
import { ResetPassword } from "../../utils/api/auth";
import { HiInformationCircle } from "react-icons/hi";
import { toast } from "react-toastify";
import { resetPasswordSchema, ResetPasswordSchemaType } from "../../schemas/mainauth";



function ForgotPasswordPage() {
  const { uid, token } = useParams();
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [togglePassword1, setTogglePassword1] = useState<boolean>(false);
  const [togglePassword2, setTogglePassword2] = useState<boolean>(false);

  const onSubmit = async (formData: ResetPasswordSchemaType) => {
    setLoading(true);
    setErrorMessage("");
    try {
      console.log({ ...formData, uid, token });
      const { data } = await ResetPassword({ ...formData, uid, token });
      toast.success(
        data.detail ||
          "Password reset instructions have been sent to your email."
      );
      navigate("/auth/sign-in")
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to reset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Logo className="bg-blue-700 p-3 rounded-xl h-16 my-6" />
      <Card className="w-full max-w-md p-3 shadow-lg">
        <h1 className="mb-8 text-center text-3xl font-semibold text-gray-800 dark:text-white">
          Forgot Password
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Enter your New Password below to complete reset.
        </p>
        {errorMessage && (
          <Alert color="failure" icon={HiInformationCircle} onDismiss={()=> setErrorMessage("")}>
            {errorMessage}
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              New Password
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
              Confirm New Password
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
            <Buttonloader isLoading={loading} title="Reset Password" />
          </Button>

          {/* Back to Login
          <div className="mt-4 text-center text-sm text-gray-600">
            Remembered your password?{" "}
            <Link to="/auth/sign-in" className="text-blue-600 underline">
              Sign In
            </Link>
          </div> */}
        </form>
      </Card>
    </div>
  );
}

export default ForgotPasswordPage;
