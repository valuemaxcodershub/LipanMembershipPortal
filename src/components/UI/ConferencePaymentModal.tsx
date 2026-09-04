"use client";

import { useState, useEffect } from "react";
import { Modal, Spinner, Button } from "flowbite-react";
import axios from "axios";
import { FaRedo, FaShieldAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { buildConferencePayload } from "../../utils/conferencePayload";

export default function PaymentProcessingModal({
  isOpen,
  onClose,
  transactionData,
  lipanId = "",
}: {
  isOpen: boolean;
  onClose: () => void;
  transactionData: any;
  lipanId?: string;
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [failed, setFailed] = useState(false);

  const sendTransaction = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = buildConferencePayload(data, {
        lipanId,
        paymentMethod: "paystack",
      });

      await axios.post(
        `${import.meta.env.VITE_OTHER_API_URL}/api/conference`,
        payload
      );

      localStorage.removeItem("pendingTransaction");
      setFailed(false);

      setTimeout(() => {
        onClose();
        navigate(`/conference/register/success?callbackUrl=${pathname}`);
      }, 2000);
    } catch (err) {
      console.error("Error submitting payment:", err);
      localStorage.setItem("pendingTransaction", JSON.stringify(data));
      setFailed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen && transactionData) {
      sendTransaction(transactionData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, transactionData]);

  const retry = () => {
    const savedData = JSON.parse(
      localStorage.getItem("pendingTransaction") || "null"
    );
    if (savedData) {
      sendTransaction(savedData);
    }
  };

  return (
    <Modal
      show={isOpen}
      size="md"
      popup
      onClose={() => {}}
      dismissible={false}
    >
      <Modal.Body>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="relative mb-4 h-20 w-20">
            <FaShieldAlt className="absolute inset-0 h-20 w-20 text-[#5b5fc7]" />
          </div>

          <h3 className="mb-2 text-lg font-semibold">Payment Successful</h3>
          {isSubmitting ? (
            <p className="flex justify-center gap-3 text-gray-500">
              <Spinner aria-label="Submitting" size="md" />
              Submitting request now. Please wait...
            </p>
          ) : failed ? (
            <>
              <p className="text-red-500">
                Request failed, transaction saved locally. Please retry.
              </p>
              <Button
                onClick={retry}
                color="failure"
                outline
                className="!mx-auto !w-full mt-3"
              >
                Retry <FaRedo className="ml-3 h-5" />
              </Button>
            </>
          ) : (
            <p className="text-gray-500">Request submitted successfully!</p>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
