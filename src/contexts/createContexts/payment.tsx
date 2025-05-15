import { createContext } from "react";

export interface PaymentContextType {
  isPaymentModalOpen: boolean;
  openMembershipModal: () => void;
  openPaymentModal: () => void;
  closeMembershipModal: () => void;
  closePaymentModal: () => void;
  isProcessingPayment: boolean;
  processPayment: (data: any) => Promise<void>;
}

export const PaymentContext = createContext<PaymentContextType | undefined>(undefined);
