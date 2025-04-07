import { useContext } from "react";
import { PaymentContext, PaymentContextType } from "../contexts/createContexts/payment";
export const usePayment = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};