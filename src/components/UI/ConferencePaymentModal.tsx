"use client";

import React, { useState, useEffect } from "react";
import { Modal, Spinner, Button } from "flowbite-react";
import axios from "axios";
import { FaCheckCircle, FaShieldAlt } from "react-icons/fa";

export default function PaymentProcessingModal({
  isOpen,
  onClose,
  transactionData,
}: {
  isOpen: boolean;
  onClose: () => void;
  transactionData: any;
}) {
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [failed, setFailed] = useState(false);

  const sendTransaction = async (data) => {
    try {
      // 🚨 Replace with your API route
      await axios.post(
        `${import.meta.env.VITE_OTHER_API_URL}/api/conference-request`,
        data
      );

      // ✅ success: clear saved transaction
      localStorage.removeItem("pendingTransaction");
      setIsSubmitting(false);
      setFailed(false);

      // auto-close modal after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error submitting payment:", err);

      // ❌ failed: save in localStorages
      localStorage.setItem("pendingTransaction", JSON.stringify(data));
      setIsSubmitting(false);
      setFailed(true);
    }
  };
  useEffect(() => {
    if (isOpen && transactionData) {
      sendTransaction(transactionData);
    }
  }, [isOpen, transactionData, onClose]);

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
      onClose={() => {}} // 🚫 prevent dismiss
      dismissible={false}
    >
      <Modal.Body>
        <div className="flex flex-col items-center justify-center text-center py-6">
          <div className="relative w-20 h-20 mb-4">
            {isSubmitting && (
              <Spinner
                aria-label="Submitting"
                size="xl"
                className="absolute inset-0 m-auto"
              />
            )}
            <FaShieldAlt className="w-20 h-20 text-blue-600 absolute inset-0" />
          </div>

          <h3 className="text-lg font-semibold mb-2">Payment Successful</h3>
          {isSubmitting ? (
            <p className="text-gray-500">
              Submitting request now. Please wait...
            </p>
          ) : failed ? (
            <>
              <p className="text-red-500">
                Request failed, transaction saved locally. Please retry.
              </p>
              <Button
                onClick={retry}
                color="blue"
                className="!mx-auto !w-full mt-3"
              >
                Retry
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
