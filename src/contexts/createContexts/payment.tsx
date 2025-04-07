import { createContext } from "react";

export interface PaymentContextType {
  isPaymentModalOpen: boolean;
  openPaymentModal: () => void;
  closePaymentModal: () => void;
  selectedMembership: string | null;
  setSelectedMembership: (membership: string) => void;
  isProcessingPayment: boolean;
  processPayment: (paymentMethod: string, amount: number) => Promise<void>;
  paymentStatus: "pending" | "success" | "failed" | null;
  userMembershipStatus: boolean;
  setUserMembershipStatus: (status: boolean) => void;
}

export const PaymentContext = createContext<PaymentContextType | undefined>(undefined);
