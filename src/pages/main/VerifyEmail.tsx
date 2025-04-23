// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { Button, Card } from "flowbite-react";
// import { FiCheckCircle, FiXCircle, FiRefreshCw, FiLogIn } from "react-icons/fi";
// import SpinnerLogo from "../../components/UI/LogoLoader";
// import axios from "../../config/axios";

// function EmailVerificationPage() {
//   const { token } = useParams(); // Extract token from URL params
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState<"success" | "error" | null>(null);

//   useEffect(() => {
//     const verifyEmail = async () => {
//       try {
//         const { data } = await axios.get(`/confirm-email/${token}/`);
//         console.log(data);
//         setStatus("success");
//       } catch (err) {
//         setStatus("error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) {
//       verifyEmail();
//     }
//   }, [token]);

//   const resendVerificationLink = async () => {
//     try {
//       setLoading(true);
//       await axios.post("/api/auth/resend-verification", { token });
//       alert("A new verification link has been sent to your email.");
//     } catch (err) {
//       alert("Failed to resend verification link. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <SpinnerLogo />
//       </div>
//     );
//   }

//   if (status === "error") {
//     return (
//       <div className="grid place-items-center min-h-screen ">
//         <Card className="flex flex-col items-center justify-center text-center">
//           <FiXCircle className="mb-4 text-6xl text-red-600 m-auto" />
//           <h1 className="text-2xl font-semibold text-gray-800">
//             Verification Failed
//           </h1>
//           <p className="mt-2 text-gray-600">
//             We couldn’t verify your email. The verification link might have
//             expired or is invalid.
//           </p>
//           <Button
//             color="red"
//             size="lg"
//             className="mt-6 flex items-center space-x-2"
//             onClick={resendVerificationLink}
//           >
//             <FiRefreshCw className="mr-3 h-6" />
//             <span>Resend Verification Link</span>
//           </Button>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="grid place-items-center min-h-screen text-center">
//       <Card className="flex flex-col items-center justify-center text-center">
//         <FiCheckCircle className="mb-4 text-6xl text-green-600 m-auto" />
//         <h1 className="text-2xl font-semibold text-gray-800">
//           Email Verified!
//         </h1>
//         <p className="mt-2 text-gray-600">
//           Thank you! Your email has been successfully verified. You can now
//           access your account.
//         </p>
//         <Button
//           as={Link}
//           to="/auth/sign-in"
//           size="lg"
//           className="mt-6 flex items-center space-x-2 bg-green-600"
//         >
//           <span>Go to Login</span>
//           <FiLogIn className="ml-3 h-6" />
//         </Button>
//       </Card>
//     </div>
//   );
// }

// export default EmailVerificationPage;

import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Spinner } from "flowbite-react";
import { Button, Card, Alert } from "flowbite-react";
import { FaCheckCircle, FaTimesCircle, FaRedo } from "react-icons/fa";
import { HiInformationCircle } from "react-icons/hi";
import { maskMail } from "../../utils/app/text";
import { PageMeta } from "../../utils/app/pageMetaValues";
import { Logo } from "../../components/UI/Logo";
import { ResendVerificationEmail, VerifyEmail } from "../../utils/api/auth";
import { toast } from "react-toastify";

export default function VerifyWithLinkPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState("waiting"); // loading,waiting, success, error, expired
  // const [userEmail, setUserEmail] = useState("");
  const [retry, setRetry] = useState(0);

  const userMail = searchParams.get("email") || "";
  const isEmail = userMail && /\S+@\S+\.\S+/.test(userMail);

  async function verifyInit() {
    setStatus("loading");
    if (userMail && !isEmail) {
      toast.error("Invalid Auth Information.");
      navigate("/auth/sign-in");
      return;
    }
    try {
      const { data } = await VerifyEmail({ key: token as string });
      console.log(data);
      if (data.detail === "ok") {
        setStatus("success");
        toast.success("Email verified successfully.");
      } else {
        setStatus("expired");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }
  // useEffect(() => {
  //   verifyInit();
  // }, []);

  const handleResendVerification = async () => {
    try {
      const { data } = await ResendVerificationEmail({ email: userMail });
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <PageMeta>
        <meta
          name="description"
          content="Verify your account to start using our services."
        />
        <title>Verify Account</title>
      </PageMeta>

      <div className="flex flex-col items-center justify-center">
        <Logo className="bg-blue-600 p-2 h-16 rounded-xl mb-4" />
        <Card className="w-full max-w-md shadow-lg rounded-xl">
          {(status === "waiting" || status === "loading") && (
            <div className="flex flex-col items-center space-y-4 text-center">
              {status === "loading" && <Spinner size="xl" color="info" />}
              <p className="text-lg font-medium text-gray-800 dark:text-white">
                {status === "loading"
                  ? "Verifying your account..."
                  : "Verify your account"}
              </p>
              {status === "waiting" && (
                <Button color="blue" onClick={verifyInit}>
                  Verify
                </Button>
              )}
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center space-y-4 text-center">
              <FaCheckCircle className="text-green-500 text-5xl" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Verification Successful
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Your account <strong>({maskMail(userMail)})</strong> has been
                successfully verified.
              </p>
              <Button color="success" onClick={() => navigate("/auth/sign-in")}>
                Go to Login
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center space-y-4">
              <Alert color="failure" icon={HiInformationCircle}>
                An error occurred while verifying your account. Please try
                again.
              </Alert>
              <FaTimesCircle className="text-red-500 text-5xl" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
                Verification Failed
              </h2>
              <div className="flex items-center gap-2">
                <Button color="success" onClick={verifyInit}>
                  Retry
                </Button>
                <Button color="warning" onClick={handleResendVerification}>
                  Resend Verification Email
                </Button>
              </div>
            </div>
          )}

          {status === "expired" && (
            <div className="flex flex-col items-center space-y-4 text-center">
              <FaRedo className="text-yellow-500 text-5xl" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Token Expired
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Your verification link has expired. Please request a new one.
              </p>
              <Button color="warning" onClick={handleResendVerification}>
                Resend Verification Email
              </Button>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
