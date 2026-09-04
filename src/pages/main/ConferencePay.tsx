import { useEffect, useMemo, useState } from "react";
import { Button, Label, TextInput, Spinner } from "flowbite-react";
import { Link, useSearchParams } from "react-router-dom";
import { usePaystackPayment } from "react-paystack";
import { toast } from "react-toastify";
import axios from "../../config/axios";
import { HiOutlineCreditCard } from "react-icons/hi";
import { FaCheckCircle } from "react-icons/fa";

type LookupData = {
  conferenceId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  registrationFee?: string;
  amount?: number;
  currency?: string;
  paymentStatus?: string;
};

function formatAmount(amount: number, currency: string) {
  if (!Number.isFinite(amount) || amount <= 0) return "";
  const code = (currency || "NGN").toUpperCase();
  if (code === "NGN") return `₦${amount.toLocaleString()}`;
  if (code === "USD") return `$${amount.toLocaleString()}`;
  return `${code} ${amount.toLocaleString()}`;
}

export default function ConferencePayPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const thanks = searchParams.get("thanks") === "1";
  const emailSent = searchParams.get("emailSent") === "1";
  const urlId = searchParams.get("id") || "";
  const urlName = searchParams.get("name") || "";
  const urlEmail = searchParams.get("email") || "";
  const urlFee = searchParams.get("fee") || "";
  const urlAmount = Number(searchParams.get("amount") || 0);
  const urlCurrency = (searchParams.get("currency") || "NGN").toUpperCase();

  const [conferenceId, setConferenceId] = useState(urlId);
  const [lookup, setLookup] = useState<LookupData | null>(null);
  const [loading, setLoading] = useState(!!urlId);
  const [paying, setPaying] = useState(false);
  const [paidLocally, setPaidLocally] = useState(false);

  const loadRegistration = async (id: string, silent = false) => {
    const trimmed = id.trim();
    if (!/^\d{6}$/.test(trimmed)) {
      if (!silent) toast.error("Enter a valid 6-digit Conference ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(`/conference/lookup/${trimmed}/`);
      setLookup(data);
      setConferenceId(trimmed);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("id", trimmed);
          return next;
        },
        { replace: true }
      );
      if (data.paymentStatus === "paid") {
        setPaidLocally(true);
      }
    } catch (err: any) {
      if (!silent && !urlAmount) {
        toast.error(err?.response?.data?.message || "Conference ID not found");
      }
      if (!urlAmount) setLookup(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlId) {
      void loadRegistration(urlId, thanks || urlAmount > 0);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayId = lookup?.conferenceId || conferenceId || urlId;
  const displayName = lookup
    ? `${lookup.firstName || ""} ${lookup.lastName || ""}`.trim()
    : urlName;
  const displayEmail = lookup?.email || urlEmail;
  const displayFee = lookup?.registrationFee || urlFee;
  const amount = Number(lookup?.amount || urlAmount || 0);
  const currency = (lookup?.currency || urlCurrency || "NGN").toUpperCase() as
    | "NGN"
    | "USD";
  const paymentStatus = paidLocally
    ? "paid"
    : lookup?.paymentStatus || "pending";
  const amountText = formatAmount(amount, currency);
  const hasRegistrationDetails = !!(displayName || displayEmail || amount || displayFee || thanks);

  const paystackConfig = useMemo(
    () => ({
      reference: `${displayId || "lipan"}-${Date.now()}`,
      email: displayEmail || "",
      amount: Math.round(amount * 100),
      publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      currency,
    }),
    [displayId, displayEmail, amount, currency]
  );

  const initializePayment = usePaystackPayment(paystackConfig);

  const onSuccess = async (reference: any) => {
    setPaying(true);
    try {
      if (displayId) {
        await axios.post("/conference/pay/", {
          conferenceId: displayId,
          paymentTrxId: reference.transaction || reference.trans || "",
          paymentTrxRef: reference.trxref || reference.reference || "",
          paymentMethod: "paystack",
        });
      }
      setPaidLocally(true);
      toast.success("Payment received. Thank you.");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Payment succeeded but could not be recorded. Contact support with your Conference ID."
      );
    } finally {
      setPaying(false);
    }
  };

  const startPayment = () => {
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";
    if (!publicKey.startsWith("pk_")) {
      toast.error("Paystack public key is missing or invalid. Check VITE_PAYSTACK_PUBLIC_KEY.");
      return;
    }
    if (!displayEmail || !amount) {
      toast.error("Unable to start payment. Missing email or amount.");
      return;
    }
    if (paymentStatus === "paid") {
      toast.info("Already paid.");
      return;
    }
    initializePayment({ onSuccess, onClose: () => {} });
  };

  return (
    <div className="ms-form-page min-h-screen px-4 pb-16 pt-28 font-[Segoe_UI,Candara,Calibri,sans-serif]">
      <div className="mx-auto w-full max-w-xl">
        <article className="ms-form-header overflow-hidden rounded-xl shadow-[0_1.6px_3.6px_rgba(0,0,0,0.18)]">
          <div className="h-2 bg-[#4f52b3]" />
          <div className="px-5 py-8 sm:px-8">
            {thanks || paidLocally ? (
              <div className="mb-4 flex justify-center">
                <FaCheckCircle className="h-14 w-14 text-[#5b5fc7]" />
              </div>
            ) : null}

            <h1 className="text-2xl font-bold text-[#242424]">
              {paymentStatus === "paid"
                ? "Payment received"
                : thanks
                  ? "Thank you for registering"
                  : "Conference Payment"}
            </h1>
            <p className="mt-2 text-sm font-semibold text-[#2d2d2d]">
              LiPAN&apos;s 20th Biennial Conference, 2026
            </p>
            <p className="mt-2 text-sm text-gray-600">
              {paymentStatus === "paid"
                ? "Your conference payment was received successfully."
                : thanks
                  ? emailSent
                    ? `Your registration has been received and a confirmation email was sent${displayEmail ? ` to ${displayEmail}` : ""}. Payment is currently pending.`
                    : "Your registration has been received. Payment is currently pending. If the email is slow to arrive, use your Conference ID below to pay now."
                  : "Complete your conference registration payment below."}
            </p>

            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner size="lg" />
              </div>
            ) : (
              <>
                {hasRegistrationDetails ? (
                  <div className="ms-form-card mt-6 space-y-3 rounded-xl p-4">
                    {displayId ? (
                      <p className="text-[#242424]">
                        Your Conference ID is:{" "}
                        <span className="font-mono text-2xl font-bold tracking-widest text-[#5b5fc7]">
                          {displayId}
                        </span>
                      </p>
                    ) : null}

                    {displayName ? (
                      <p>
                        <span className="text-gray-500">Name:</span>{" "}
                        <strong>{displayName}</strong>
                      </p>
                    ) : null}

                    {displayEmail ? (
                      <p>
                        <span className="text-gray-500">Email:</span>{" "}
                        <strong>{displayEmail}</strong>
                      </p>
                    ) : null}

                    {displayFee ? (
                      <p>
                        <span className="text-gray-500">Registration fee:</span>{" "}
                        <strong>{displayFee}</strong>
                      </p>
                    ) : null}

                    {amountText ? (
                      <p className="text-2xl font-bold text-[#4f52b3]">
                        {paymentStatus === "paid" ? "Amount paid: " : "Amount to pay: "}
                        {amountText}
                      </p>
                    ) : null}

                    <p className="text-sm">
                      Status:{" "}
                      <strong
                        className={
                          paymentStatus === "paid" ? "text-green-600" : "text-amber-600"
                        }
                      >
                        {paymentStatus}
                      </strong>
                    </p>

                    {paymentStatus !== "paid" && amount > 0 && displayEmail ? (
                      <Button
                        onClick={startPayment}
                        isProcessing={paying}
                        disabled={paying}
                        className="mt-2 w-full !bg-[#5b5fc7] hover:!bg-[#4f52c1]"
                      >
                        <HiOutlineCreditCard className="mr-2 h-5" />
                        Pay with Paystack
                      </Button>
                    ) : null}
                  </div>
                ) : (
                  <div className="mt-6 space-y-3">
                    <Label value="Conference ID" className="!text-[#424242]" />
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <TextInput
                        value={conferenceId}
                        onChange={(e) => setConferenceId(e.target.value)}
                        placeholder="6-digit ID"
                        maxLength={6}
                        className="w-full"
                      />
                      <Button
                        color="light"
                        onClick={() => loadRegistration(conferenceId)}
                        isProcessing={loading}
                      >
                        Load
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Enter your 6-digit Conference ID to load your amount and pay.
                    </p>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button
                    as={Link}
                    to="/conference/register"
                    color="light"
                    className="w-full"
                  >
                    Back to registration
                  </Button>
                  <Button
                    as="a"
                    href="https://lipanonline.org/conference/"
                    color="light"
                    className="w-full"
                  >
                    Conference info
                  </Button>
                </div>
              </>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
