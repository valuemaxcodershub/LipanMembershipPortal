import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { FiHome, FiCompass } from "react-icons/fi";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6 py-12">
      {/* Illustration */}
      <div className="mb-8">
        <img
          src="/404.svg"
          alt="404 illustration"
          className="w-full max-w-md mx-auto drop-shadow-xl"
        />
      </div>

      {/* Text */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Oops! Page not found.
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-6">
          The page you’re looking for doesn’t exist, got moved, or is
          temporarily unavailable. But don’t worry, we’ll help you find your
          way!
        </p>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-4 flex-wrap">
          <Button
            as={Link}
            to="/"
            size="lg"
            color="blue"
            className="flex items-center gap-2"
          >
            <FiHome className="h-6 mr-3" />
            Back to Homepage
          </Button>
          {/* <Button
            as={Link}
            to="/explore"
            size="lg"
            color="gray"
            outline
            className="flex items-center gap-2"
          >
            <FiCompass className="h-6 mr-3"/>
            Explore
          </Button> */}
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
