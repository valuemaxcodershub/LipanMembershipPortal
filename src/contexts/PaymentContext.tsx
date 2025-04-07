import {  useState, ReactNode } from "react";
import { PaymentContext } from "./createContexts/payment";
import MembershipModal from "../components/UI/MembershipModal";


const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [selectedMembership, setSelectedMembership] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed" | null>(null);
  const [userMembershipStatus, setUserMembershipStatus] = useState<boolean>(false);

  const openPaymentModal = () => setIsPaymentModalOpen(true);
  const closePaymentModal = () => setIsPaymentModalOpen(false);

  const processPayment = async (paymentMethod: string, amount: number) => {
    setIsProcessingPayment(true);
    setPaymentStatus("pending");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setPaymentStatus("success");
      setUserMembershipStatus(true);
      closePaymentModal();
    } catch (error) {
      setPaymentStatus("failed");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        isPaymentModalOpen,
        openPaymentModal,
        closePaymentModal,
        selectedMembership,
        setSelectedMembership,
        isProcessingPayment,
        processPayment,
        paymentStatus,
        userMembershipStatus,
        setUserMembershipStatus,
      }}
    >
      {children}
      <MembershipModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
      />
    </PaymentContext.Provider>
  );
};

export default PaymentProvider;

