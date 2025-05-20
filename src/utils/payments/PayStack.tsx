import { Button } from "flowbite-react";
import { usePaystackPayment } from "react-paystack";
import { usePayment } from "../../hooks/payment";
import { AiOutlineLoading } from "react-icons/ai";

const PaystackPayment = ({
  amount,
  email,
  name,
  description = "LiPAN Payment",
  membership,
  plan,
}: {
  amount: number;
  email: string;
  name: string;
  description: string;
    plan: string;
    membership: number;
}) => {
  const { processPayment, isProcessingPayment } = usePayment();
  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100, // Paystack expects amount in kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    metadata: {
      custom_fields: [
        { display_name: "Full Name", variable_name: "full_name", value: name },
        {
          display_name: "Payment description",
          variable_name: "description",
          value: description,
        },
        {
          display_name: "Plan type",
          variable_name: "plan",
          value: plan,
        },
        {
          display_name: "Membership Id",
          variable_name: "membership",
          value: membership,
        },
      ],
    },
  };

  const onSuccess = async (ref: any) => {
    console.log(ref);
    await processPayment({
      transaction_id: ref.transaction,
      transaction_ref: ref.trxref,
      payment_method: "paystack",
      total: amount,
      amount,
      status: ref.status,
      description,
      membership_type: membership,
      plan
    });
  };

  const onClose = () => {
    console.log("closed");
  };
  const initializePayment = usePaystackPayment(config);
  return (
    <Button
      disabled={isProcessingPayment}
      className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold"
      onClick={() => {
        initializePayment({ onSuccess, onClose });
      }}
    >
      {isProcessingPayment ? (
        <AiOutlineLoading className="animate-spin text-white !m-auto" />
      ) : (
        "Continue to pay"
      )}
    </Button>
  );
};

export default PaystackPayment;
