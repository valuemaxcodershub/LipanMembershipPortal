import { Card, Button } from "flowbite-react";
import { FiCheckCircle, FiMail } from "react-icons/fi";
import { Link, Navigate, useParams } from "react-router-dom";
import { maskMail } from "../../utils/app/text";

function RegistrationSuccessPage() {
  const { email } = useParams();
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return <Navigate to="/auth/sign-up" />;
  }
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <Card className="max-w-md w-full ">
        <div className="flex flex-col items-center text-center">
          <FiCheckCircle className="text-green-500 dark:text-green-400 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            A verification email has been sent to your inbox. Please check your
            email ({maskMail(email)}) and follow the instructions to activate your account.
          </p>
          <FiMail className="text-blue-600 dark:text-blue-400 text-4xl mb-4" />

          {/* <Button
            as={Link}
            to="/auth/sign-in"
            color="blue"
            className="w-full mt-2"
          >
            Go to Login
          </Button> */}
        </div>
      </Card>
    </div>
  );
}

export default RegistrationSuccessPage;
