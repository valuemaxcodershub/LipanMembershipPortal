import { FaCheckCircle } from "react-icons/fa";
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Link, useSearchParams } from "react-router-dom";

function formatAmount(amount: string, currency: string) {
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) return "";
  const code = (currency || "NGN").toUpperCase();
  if (code === "NGN") return `₦${value.toLocaleString()}`;
  if (code === "USD") return `$${value.toLocaleString()}`;
  return `${code} ${value.toLocaleString()}`;
}

export default function RegistrationSuccess() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [searchParams] = useSearchParams();
  const conferenceIdRaw = searchParams.get("id") || "";
  const conferenceId =
    !conferenceIdRaw || conferenceIdRaw === "undefined" || conferenceIdRaw === "null"
      ? ""
      : conferenceIdRaw;
  const paid = searchParams.get("paid") === "1";
  const feeLabel = searchParams.get("fee") || "";
  const amountText = formatAmount(
    searchParams.get("amount") || "",
    searchParams.get("currency") || ""
  );

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="ms-form-page flex min-h-screen flex-col items-center justify-center px-4 font-[Segoe_UI,Candara,Calibri,sans-serif]">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
      />
      <div className="ms-form-card w-full max-w-lg rounded-xl p-8 text-center shadow-[0_1.6px_3.6px_rgba(0,0,0,0.18)]">
        <div className="mb-6 flex justify-center">
          <FaCheckCircle className="h-20 w-20 text-[#5b5fc7]" />
        </div>

        <h1 className="mb-3 text-2xl font-bold text-[#242424] sm:text-3xl">
          Thank you for registering for LiPAN&apos;s 20th Biennial Conference,
          2026.
        </h1>

        <p className="mb-2 text-gray-600">
          {paid ? (
            "Your conference payment was received successfully."
          ) : (
            <>
              Your registration has been received. Payment is currently{" "}
              <strong>pending</strong>.
            </>
          )}
        </p>

        {conferenceId ? (
          <p className="mb-2 text-lg text-[#242424]">
            Your Conference ID is:{" "}
            <span className="font-mono text-2xl font-bold tracking-widest text-[#5b5fc7]">
              {conferenceId}
            </span>
          </p>
        ) : null}

        {(amountText || feeLabel) && (
          <div className="mb-4 rounded-lg border border-[#e4e4f5] bg-white/80 px-4 py-3">
            {feeLabel && (
              <p className="text-sm text-gray-600">{feeLabel}</p>
            )}
            {amountText && (
              <p className="text-2xl font-bold text-[#4f52b3]">
                {paid ? "Amount paid: " : "Amount to pay: "}
                {amountText}
              </p>
            )}
          </div>
        )}

        <p className="mb-6 text-sm text-gray-500">
          {paid
            ? "Keep your Conference ID safe. Further updates will be sent to your email."
            : conferenceId
              ? "Please keep your Conference ID. Use Pay Now below to complete payment."
              : "Please complete payment below to confirm your place at the conference."}
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          {!paid && conferenceId && (
            <Button
              as={Link}
              to={`/conference/pay?id=${encodeURIComponent(conferenceId)}`}
              className="!bg-[#5b5fc7] hover:!bg-[#4f52c1]"
            >
              Pay Now
            </Button>
          )}
          {!paid && !conferenceId && (
            <Button
              as={Link}
              to="/conference/pay"
              className="!bg-[#5b5fc7] hover:!bg-[#4f52c1]"
            >
              Go to Payment Page
            </Button>
          )}
          <Button
            as="a"
            href="https://lipanonline.org/conference/"
            color="light"
          >
            Back to Conference Info
          </Button>
        </div>
      </div>
    </div>
  );
}
