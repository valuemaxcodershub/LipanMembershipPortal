import { FaCheckCircle } from "react-icons/fa";
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function RegistrationSuccess() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // update size for responsive confetti
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
      />
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="w-20 h-20 text-blue-500" />
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-bold  mb-2">
          <span className="bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Registration Successful
          </span>{" "}
          🎉
        </h1>

        {/* Subheadline */}
        <p className="text-gray-600 mb-4">
          Thank you for registering for the {/*International*/} Conference
          {/*on [Topic]*/}. Your submission has been received.
        </p>

        {/* Extra Info */}
        <p className="text-gray-500 text-sm mb-6">
          📩
          {/* A confirmation email has been sent to your registered email
          address. Please check your inbox (and spam folder, just in case).
          <br />
          <br /> */}
          Our team will review your submission and share further updates soon.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button href="/conference/register" gradientDuoTone="purpleToBlue">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
