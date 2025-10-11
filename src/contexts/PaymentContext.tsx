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
import PaymentVerificationModal from "../components/UI/PaymentVerifyModal";

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
  const [modalState, setModalState] = useState<any>({
    open: false,
    loading: false,
    reference: "",
    errorMessage: "",
  });

  const openMembershipModal = () => setIsMembershipModalOpen(true);
  const closeMembershipModal = () => setIsMembershipModalOpen(false);

  const openPaymentModal = () => setIsPaymentModalOpen(true);
  const closePaymentModal = () => setIsPaymentModalOpen(false);

  const handleSelectMembership = (plan: MembershipPlan & { plan: string }) => {
    setSelectedMembership(plan);
    closeMembershipModal();
    setTimeout(openPaymentModal, 300); // slight delay for smooth UX
  };

  const verifyPayment = async (paymentData: any) => {
    setModalState({
      open: true,
      loading: true,
      reference: paymentData.transaction_ref,
    });

    try {
      await axios.post("/payments/verify/", {
        reference: paymentData.transaction_ref,
      });

      // Success
      setModalState({
        open: true,
        loading: false,
        reference: paymentData.transaction_ref,
        errorMessage: undefined,
      });

      window.location.reload();
      // maybe dispatch success state here
    } catch (error: any) {
      setModalState({
        open: true,
        loading: false,
        reference: paymentData.transaction_ref,
        errorMessage: error.response?.data?.detail || "Verification failed",
      });
      throw error;
    }
  };

  const processPayment = async (paymentData: any) => {
    // console.log(paymentData);
    setIsProcessingPayment(true);

    try {
      // console.log(paymentData);
      // const { data } = await axios.post("/user/transactions/", paymentData);
      // console.log(data);
      await verifyPayment(paymentData);
      toast.success("Payment Successfull", {
        position: "top-center",
      });
    } catch (err: any) {
      console.error(err);
      const errorMsg = errorHandler(err);
      toast.error(errorMsg || "Payment Succesfully, but not registered", {
        position: "top-center",
      });
      throw err;
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

      <PaymentVerificationModal
        open={modalState.open}
        loading={modalState.loading}
        reference={modalState.reference}
        errorMessage={modalState.errorMessage}
        onClose={() => setModalState((prev: any) => ({ ...prev, open: false }))}
      />
    </PaymentContext.Provider>
  );
};

export default PaymentProvider;
