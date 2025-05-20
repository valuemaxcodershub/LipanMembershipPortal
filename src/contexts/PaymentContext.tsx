import { useState, ReactNode } from "react";
import { PaymentContext } from "./createContexts/payment";
import {
  MembershipSelectionModal,
  PaymentModal,
} from "../components/UI/MembershipModal";
import { MembershipPlan } from "../types/_all";
import { useAuth } from "../hooks/auth";
import axios from "../config/axios";
import { errorHandler } from "../utils/api/errors";
import { toast } from "react-toastify";

const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isMembershipModalOpen, setIsMembershipModalOpen] =
    useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [selectedMembership, setSelectedMembership] = useState<
    (MembershipPlan & { plan: string }) | null
  >(null);
  const [isProcessingPayment, setIsProcessingPayment] =
    useState<boolean>(false);

  const openMembershipModal = () => setIsMembershipModalOpen(true);
  const closeMembershipModal = () => setIsMembershipModalOpen(false);

  const openPaymentModal = () => setIsPaymentModalOpen(true);
  const closePaymentModal = () => setIsPaymentModalOpen(false);

  const handleSelectMembership = (plan: MembershipPlan & { plan: string }) => {
    setSelectedMembership(plan);
    closeMembershipModal();
    setTimeout(openPaymentModal, 300); // slight delay for smooth UX
  };

  const processPayment = async (paymentData: any) => {
    console.log(paymentData);
    setIsProcessingPayment(true);

    try {
      const { data } = await axios.post("/user/transactions/", paymentData);
      console.log(data);
      toast.success(data?.detail || "Payment Successfull", {
        position: "top-center",
      });
    } catch (err: any) {
      console.error(err);
      const errorMsg = errorHandler(err);
      toast.error(errorMsg || "Payment Succesfully, but not registered", {
        position: "top-center",
      });
    } finally {
      setIsProcessingPayment(false);
      closePaymentModal();
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        isPaymentModalOpen,
        openMembershipModal,
        closeMembershipModal,
        openPaymentModal,
        closePaymentModal,
        isProcessingPayment,
        processPayment,
      }}
    >
      {children}
      <MembershipSelectionModal
        isOpen={isMembershipModalOpen}
        onClose={closeMembershipModal}
        onSelect={handleSelectMembership}
      />
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        membership={selectedMembership!}
        userInfo={user!}
        // onUserInfoChange={handleUserInfoChange}
      />
    </PaymentContext.Provider>
  );
};

export default PaymentProvider;
